// Calendar Integration Manager for ScheduleX

import { GoogleCalendarService, CalendarServiceInterface } from './GoogleCalendarService';
import AISchedulingService from './AISchedulingService';
import {
  Task,
  CalendarEvent,
  CalendarProvider,
  SchedulingPreferences,
  AISchedulingSuggestion,
  ScheduleOptimization,
  CalendarSync,
  CalendarSettings,
  TimeSlot
} from '../types/calendar';
import { addDays, startOfDay, endOfDay } from 'date-fns';

interface SyncResult {
  success: boolean;
  syncedEvents: CalendarSync[];
  errors: string[];
}

class CalendarIntegrationManager {
  private googleService: GoogleCalendarService;
  private aiService: AISchedulingService;
  private connectedProviders: Map<string, CalendarServiceInterface>;
  private settings: CalendarSettings;

  constructor() {
    this.googleService = new GoogleCalendarService();
    this.aiService = new AISchedulingService();
    this.connectedProviders = new Map();
    this.settings = this.loadSettings();
    
    this.initializeProviders();
  }

  // Initialize connected providers from storage
  private async initializeProviders(): Promise<void> {
    try {
      // Check Google Calendar connection
      const googleStatus = this.googleService.getConnectionStatus();
      if (googleStatus.connected) {
        this.connectedProviders.set('google', this.googleService);
      }
    } catch (error) {
      console.error('Error initializing providers:', error);
    }
  }

  // Connect to Google Calendar
  async connectGoogleCalendar(): Promise<{ success: boolean; provider?: any }> {
    try {
      // Check if already connected
      const status = this.googleService.getConnectionStatus();
      if (status.connected) {
        this.connectedProviders.set('google', this.googleService);
        return { 
          success: true, 
          provider: {
            id: 'google',
            name: 'Google Calendar',
            isConnected: true,
            userEmail: status.email
          }
        };
      }

      // Initiate OAuth flow
      const authenticated = await this.googleService.authenticate();
      if (authenticated) {
        this.connectedProviders.set('google', this.googleService);
        return { 
          success: true, 
          provider: {
            id: 'google',
            name: 'Google Calendar',
            isConnected: true,
            userEmail: status.email
          }
        };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      throw error;
    }
  }

  // Handle Google OAuth callback (not needed with new implementation)
  async handleGoogleCallback(code: string): Promise<any> {
    // This method is no longer needed with the new OAuth flow
    // but keeping for compatibility
    console.log('Google OAuth callback handled automatically');
    return {
      id: 'google',
      name: 'Google Calendar',
      isConnected: true
    };
  }

  // Connect to Outlook Calendar (REMOVED - Requires paid tenant)
  async connectOutlookCalendar(): Promise<{ success: boolean; error?: string }> {
    return { 
      success: false, 
      error: 'Outlook Calendar integration requires a paid Microsoft tenant and is currently disabled.' 
    };
  }

  // Get all connected providers
  getConnectedProviders(): any[] {
    const providers = [];
    const googleStatus = this.googleService.getConnectionStatus();
    if (googleStatus.connected) {
      providers.push({
        id: 'google',
        name: 'Google Calendar',
        isConnected: true,
        userEmail: googleStatus.email
      });
    }
    return providers;
  }

  // Get provider by ID
  getProvider(providerId: string): any {
    if (providerId === 'google') {
      const status = this.googleService.getConnectionStatus();
      return status.connected ? {
        id: 'google',
        name: 'Google Calendar',
        isConnected: true,
        userEmail: status.email
      } : undefined;
    }
    return undefined;
  }

  // Disconnect from a provider
  async disconnectProvider(providerId: string): Promise<void> {
    try {
      if (providerId === 'google') {
        await this.googleService.disconnect();
        this.connectedProviders.delete('google');
      }
    } catch (error) {
      console.error(`Error disconnecting from ${providerId}:`, error);
      throw error;
    }
  }

  // Get events from all connected calendars (Google only now)
  async getAllEvents(
    startDate: Date = new Date(),
    endDate: Date = addDays(new Date(), 7)
  ): Promise<CalendarEvent[]> {
    const allEvents: CalendarEvent[] = [];

    try {
      // Get Google Calendar events
      const googleStatus = this.googleService.getConnectionStatus();
      if (googleStatus.connected) {
        try {
          // Get default calendars - for now just use primary calendar
          const calendars = await this.googleService.getCalendars();
          const primaryCalendar = calendars.find(cal => cal.primary) || calendars[0];
          
          if (primaryCalendar) {
            const events = await this.googleService.getEvents(
              primaryCalendar.id,
              startDate,
              endDate
            );
            allEvents.push(...events);
          }
        } catch (error) {
          console.error('Error fetching Google calendar events:', error);
        }
      }

      return allEvents;
    } catch (error) {
      console.error('Error fetching all events:', error);
      throw error;
    }
  }

  // Generate AI-powered schedule suggestions
  async generateSmartSchedule(
    tasks: Task[],
    preferences: SchedulingPreferences,
    dateRange?: { start: Date; end: Date }
  ): Promise<ScheduleOptimization> {
    try {
      const range = dateRange || {
        start: startOfDay(new Date()),
        end: endOfDay(addDays(new Date(), 14))
      };

      // Get existing events from all calendars
      const existingEvents = await this.getAllEvents(range.start, range.end);

      // Generate AI suggestions
      const optimization = await this.aiService.generateScheduleSuggestions(
        tasks,
        existingEvents,
        preferences,
        range
      );

      return optimization;
    } catch (error) {
      console.error('Error generating smart schedule:', error);
      throw error;
    }
  }

  // Sync tasks to calendar(s)
  async syncTasksToCalendar(
    suggestions: AISchedulingSuggestion[],
    targetCalendars: { providerId: string; calendarId: string }[]
  ): Promise<SyncResult> {
    const syncedEvents: CalendarSync[] = [];
    const errors: string[] = [];

    try {
      for (const suggestion of suggestions) {
        if (suggestion.confidence < 0.3) {
          continue; // Skip low-confidence suggestions
        }

        for (const target of targetCalendars) {
          try {
            const event = this.convertSuggestionToCalendarEvent(suggestion);
            let createdEvent: CalendarEvent;

            if (target.providerId === 'google') {
              await this.googleService.ensureValidToken();
              createdEvent = await this.googleService.createEvent(target.calendarId, event);
            } else if (target.providerId === 'outlook') {
              createdEvent = await this.outlookService.createEvent(target.calendarId, event);
            } else {
              errors.push(`Unknown provider: ${target.providerId}`);
              continue;
            }

            // Record successful sync
            const sync: CalendarSync = {
              id: `sync-${Date.now()}-${Math.random()}`,
              taskId: suggestion.task.id,
              calendarProvider: target.providerId as 'google' | 'outlook',
              calendarId: target.calendarId,
              eventId: createdEvent.id,
              lastSyncAt: new Date(),
              syncStatus: 'synced'
            };

            syncedEvents.push(sync);
            
            // Store sync record
            this.storeSyncRecord(sync);

          } catch (error) {
            errors.push(`Failed to sync task "${suggestion.task.title}" to ${target.providerId}: ${error}`);
          }
        }
      }

      return {
        success: errors.length === 0,
        syncedEvents,
        errors
      };
    } catch (error) {
      console.error('Error syncing tasks to calendar:', error);
      return {
        success: false,
        syncedEvents,
        errors: [`Sync operation failed: ${error}`]
      };
    }
  }

  // Update synced task in calendar
  async updateSyncedTask(
    taskId: string,
    updatedTask: Partial<Task>,
    newTimeSlot?: TimeSlot
  ): Promise<void> {
    try {
      const syncRecords = this.getSyncRecordsForTask(taskId);
      
      for (const sync of syncRecords) {
        try {
          const event = this.convertTaskToCalendarEvent(updatedTask as Task, newTimeSlot);
          
          if (sync.calendarProvider === 'google') {
            await this.googleService.ensureValidToken();
            await this.googleService.updateEvent(sync.calendarId, sync.eventId, event);
          } else if (sync.calendarProvider === 'outlook') {
            await this.outlookService.updateEvent(sync.calendarId, sync.eventId, event);
          }

          // Update sync record
          sync.lastSyncAt = new Date();
          sync.syncStatus = 'synced';
          this.storeSyncRecord(sync);

        } catch (error) {
          console.error(`Error updating synced task in ${sync.calendarProvider}:`, error);
          sync.syncStatus = 'failed';
          sync.errorMessage = error instanceof Error ? error.message : 'Unknown error';
          this.storeSyncRecord(sync);
        }
      }
    } catch (error) {
      console.error('Error updating synced task:', error);
      throw error;
    }
  }

  // Delete synced task from calendar
  async deleteSyncedTask(taskId: string): Promise<void> {
    try {
      const syncRecords = this.getSyncRecordsForTask(taskId);
      
      for (const sync of syncRecords) {
        try {
          if (sync.calendarProvider === 'google') {
            await this.googleService.ensureValidToken();
            await this.googleService.deleteEvent(sync.calendarId, sync.eventId);
          } else if (sync.calendarProvider === 'outlook') {
            await this.outlookService.deleteEvent(sync.calendarId, sync.eventId);
          }

          // Remove sync record
          this.removeSyncRecord(sync.id);

        } catch (error) {
          console.error(`Error deleting synced task from ${sync.calendarProvider}:`, error);
        }
      }
    } catch (error) {
      console.error('Error deleting synced task:', error);
      throw error;
    }
  }

  // Find available time slots across all calendars
  async findAvailableTimeSlots(
    duration: number, // in minutes
    dateRange: { start: Date; end: Date },
    preferences?: SchedulingPreferences
  ): Promise<TimeSlot[]> {
    try {
      const allEvents = await this.getAllEvents(dateRange.start, dateRange.end);
      const defaultPreferences: SchedulingPreferences = {
        workingHours: { start: '09:00', end: '17:00' },
        workingDays: [1, 2, 3, 4, 5], // Monday to Friday
        bufferTime: 15,
        preferredTaskLength: 60,
        breakDuration: 15,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      const prefs = preferences || defaultPreferences;
      
      // Use Google Calendar service to find free slots (it has the logic already)
      const googleProvider = this.connectedProviders.get('google');
      if (googleProvider) {
        await this.googleService.ensureValidToken();
        return await this.googleService.findFreeTimeSlots(
          ['primary'], // We'll use all events we fetched
          dateRange.start,
          dateRange.end,
          duration
        );
      }

      // Fallback implementation if Google Calendar not available
      return this.findFreeSlotsManually(allEvents, dateRange, duration, prefs);
    } catch (error) {
      console.error('Error finding available time slots:', error);
      throw error;
    }
  }

  // Manual implementation of finding free slots
  private findFreeSlotsManually(
    events: CalendarEvent[],
    dateRange: { start: Date; end: Date },
    duration: number,
    _preferences: SchedulingPreferences
  ): TimeSlot[] {
    const freeSlots: TimeSlot[] = [];
    
    // Sort events by start time
    const sortedEvents = events.sort((a, b) => 
      new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime()
    );

    let currentTime = new Date(dateRange.start);
    const endTime = new Date(dateRange.end);

    for (const event of sortedEvents) {
      const eventStart = new Date(event.start.dateTime);
      const eventEnd = new Date(event.end.dateTime);

      // Check if there's a gap before this event
      if (currentTime < eventStart) {
        const gapDuration = eventStart.getTime() - currentTime.getTime();
        if (gapDuration >= duration * 60 * 1000) {
          freeSlots.push({
            start: new Date(currentTime),
            end: new Date(eventStart),
            available: true
          });
        }
      }

      currentTime = new Date(Math.max(currentTime.getTime(), eventEnd.getTime()));
    }

    // Check for remaining time after last event
    if (currentTime < endTime) {
      const remainingDuration = endTime.getTime() - currentTime.getTime();
      if (remainingDuration >= duration * 60 * 1000) {
        freeSlots.push({
          start: new Date(currentTime),
          end: new Date(endTime),
          available: true
        });
      }
    }

    return freeSlots;
  }

  // Convert AI suggestion to calendar event format
  private convertSuggestionToCalendarEvent(suggestion: AISchedulingSuggestion): Partial<CalendarEvent> {
    const task = suggestion.task;
    const slot = suggestion.suggestedSlot;

    return {
      summary: task.title,
      description: `${task.description || ''}\n\nScheduled by ScheduleX AI\nPriority: ${task.priority}\nEstimated duration: ${task.duration} minutes${task.deadline ? `\nDeadline: ${task.deadline.toLocaleDateString()}` : ''}`,
      start: {
        dateTime: slot.start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: slot.end.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      location: task.location,
      taskId: task.id
    };
  }

  // Convert task to calendar event format
  private convertTaskToCalendarEvent(task: Task, timeSlot?: TimeSlot): Partial<CalendarEvent> {
    const event: Partial<CalendarEvent> = {
      summary: task.title,
      description: `${task.description || ''}\n\nScheduled by ScheduleX\nPriority: ${task.priority}${task.deadline ? `\nDeadline: ${task.deadline.toLocaleDateString()}` : ''}`,
      location: task.location,
      taskId: task.id
    };

    if (timeSlot) {
      event.start = {
        dateTime: timeSlot.start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      event.end = {
        dateTime: timeSlot.end.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    }

    return event;
  }

  // Settings management
  getSettings(): CalendarSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<CalendarSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  private loadSettings(): CalendarSettings {
    try {
      const stored = localStorage.getItem('calendar_settings');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }

    // Default settings
    return {
      autoSync: true,
      syncInterval: 30,
      defaultCalendar: {},
      reminderSettings: {
        email: true,
        popup: true,
        defaultMinutes: [15, 30]
      },
      conflictResolution: 'ask',
      timeBlockingEnabled: true,
      smartSchedulingEnabled: true
    };
  }

  private saveSettings(): void {
    try {
      localStorage.setItem('calendar_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  // Sync records management
  private storeSyncRecord(sync: CalendarSync): void {
    try {
      const existing = this.getAllSyncRecords();
      const index = existing.findIndex(s => s.id === sync.id);
      
      if (index !== -1) {
        existing[index] = sync;
      } else {
        existing.push(sync);
      }
      
      localStorage.setItem('calendar_sync_records', JSON.stringify(existing));
    } catch (error) {
      console.error('Error storing sync record:', error);
    }
  }

  private getSyncRecordsForTask(taskId: string): CalendarSync[] {
    return this.getAllSyncRecords().filter(sync => sync.taskId === taskId);
  }

  private getAllSyncRecords(): CalendarSync[] {
    try {
      const stored = localStorage.getItem('calendar_sync_records');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading sync records:', error);
      return [];
    }
  }

  private removeSyncRecord(syncId: string): void {
    try {
      const existing = this.getAllSyncRecords();
      const filtered = existing.filter(sync => sync.id !== syncId);
      localStorage.setItem('calendar_sync_records', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing sync record:', error);
    }
  }

  // Health check for connected providers
  async checkProvidersHealth(): Promise<{ google: boolean; outlook: boolean }> {
    const health = { google: false, outlook: false };

    try {
      const googleProvider = this.connectedProviders.get('google');
      if (googleProvider) {
        try {
          await this.googleService.ensureValidToken();
          await this.googleService.getCalendarList();
          health.google = true;
        } catch (error) {
          console.error('Google Calendar health check failed:', error);
        }
      }

      const outlookProvider = this.connectedProviders.get('outlook');
      if (outlookProvider) {
        try {
          await this.outlookService.getCalendarList();
          health.outlook = true;
        } catch (error) {
          console.error('Outlook Calendar health check failed:', error);
        }
      }
    } catch (error) {
      console.error('Error checking providers health:', error);
    }

    return health;
  }
}

export default CalendarIntegrationManager;
