// Simplified Calendar Integration Manager for ScheduleX
// Google Calendar only (Microsoft removed due to paid tenant requirement)

import { GoogleCalendarService } from './GoogleCalendarService';
import AISchedulingService from './AISchedulingService';
import {
  Task,
  CalendarEvent,
  SchedulingPreferences,
  AISchedulingSuggestion,
  ScheduleOptimization,
  CalendarSettings,
  TimeSlot
} from '../types/calendar';
import { addDays, startOfDay, endOfDay } from 'date-fns';

export default class CalendarIntegrationManager {
  private googleService: GoogleCalendarService;
  private aiService: AISchedulingService;
  private settings: CalendarSettings;

  constructor() {
    this.googleService = new GoogleCalendarService();
    this.aiService = new AISchedulingService();
    this.settings = this.loadSettings();
  }

  // Connect to Google Calendar
  async connectGoogleCalendar(): Promise<{ success: boolean; provider?: any }> {
    try {
      // Check if already connected
      const status = this.googleService.getConnectionStatus();
      if (status.connected) {
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
        const newStatus = this.googleService.getConnectionStatus();
        return { 
          success: true, 
          provider: {
            id: 'google',
            name: 'Google Calendar',
            isConnected: true,
            userEmail: newStatus.email
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

  // Connect to Outlook Calendar (DISABLED)
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

  // Get all connected providers with proper initialization
  async getConnectedProvidersAsync(): Promise<any[]> {
    const providers = [];
    const googleStatus = await this.googleService.getConnectionStatusAsync();
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

  // Disconnect from a provider
  async disconnectProvider(providerId: string): Promise<void> {
    try {
      if (providerId === 'google') {
        await this.googleService.disconnect();
      }
    } catch (error) {
      console.error(`Error disconnecting from ${providerId}:`, error);
      throw error;
    }
  }

  // Get events from Google Calendar
  async getAllEvents(
    startDate: Date = new Date(),
    endDate: Date = addDays(new Date(), 7)
  ): Promise<CalendarEvent[]> {
    try {
      const googleStatus = this.googleService.getConnectionStatus();
      if (!googleStatus.connected) {
        return [];
      }

      // Get calendars and fetch events from primary calendar
      const calendars = await this.googleService.getCalendars();
      const primaryCalendar = calendars.find(cal => cal.primary) || calendars[0];
      
      if (primaryCalendar) {
        return await this.googleService.getEvents(primaryCalendar.id, startDate, endDate);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  // Generate AI-powered schedule suggestions
  async generateSmartSchedule(
    tasks: Task[],
    preferences: SchedulingPreferences,
    dateRange?: { start: Date; end: Date }
  ): Promise<ScheduleOptimization> {
    try {
      // Determine optimal date range based on task deadlines
      const range = this.calculateOptimalDateRange(tasks, dateRange);

      // Get existing events
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

  // Calculate optimal date range based on task deadlines
  private calculateOptimalDateRange(
    tasks: Task[],
    providedRange?: { start: Date; end: Date }
  ): { start: Date; end: Date } {
    if (providedRange) {
      return providedRange;
    }

    const today = startOfDay(new Date());
    let latestDeadline = endOfDay(addDays(today, 7)); // Default 7 days
    let hasDeadlines = false;

    // Find the LATEST deadline to ensure we include all task deadlines
    for (const task of tasks) {
      if (task.deadline && !task.isCompleted) {
        hasDeadlines = true;
        if (task.deadline > latestDeadline) {
          latestDeadline = task.deadline;
        }
      }
    }

    // If we have deadlines, schedule from today to the latest deadline (NO EXTENSION)
    if (hasDeadlines) {
      // Use the exact deadline date, not extended beyond it
      const deadlineDate = endOfDay(latestDeadline);
      
      return {
        start: today,
        end: deadlineDate // This should NOT go beyond the deadline
      };
    }
    
    // Default range if no deadlines
    return {
      start: today,
      end: endOfDay(addDays(today, 7)) // Default range
    };
  }

  // Create events in Google Calendar
  async syncTasksToCalendar(
    suggestions: AISchedulingSuggestion[],
    targetCalendars?: Array<{ providerId: string; calendarId: string }> | string
  ): Promise<{ success: boolean; syncedEvents: any[]; errors: string[] }> {
    const syncedEvents: any[] = [];
    const errors: string[] = [];

    try {
      const googleStatus = this.googleService.getConnectionStatus();
      if (!googleStatus.connected) {
        return {
          success: false,
          syncedEvents: [],
          errors: ['Google Calendar not connected']
        };
      }

      // Determine target calendar ID
      let calendarId: string | undefined;
      
      if (Array.isArray(targetCalendars)) {
        // Find Google calendar from the array
        const googleCalendar = targetCalendars.find(cal => cal.providerId === 'google');
        calendarId = googleCalendar?.calendarId;
      } else if (typeof targetCalendars === 'string') {
        calendarId = targetCalendars;
      }

      // If no calendar specified, use primary
      if (!calendarId || calendarId === 'primary') {
        const calendars = await this.googleService.getCalendars();
        const primaryCalendar = calendars.find(cal => cal.primary) || calendars[0];
        calendarId = primaryCalendar?.id || 'primary';
      }

      if (!calendarId) {
        return {
          success: false,
          syncedEvents: [],
          errors: ['No calendar available for syncing']
        };
      }

      for (const suggestion of suggestions) {
        if (suggestion.confidence < 0.3) {
          continue; // Skip low-confidence suggestions
        }

        try {
          const event = this.convertSuggestionToCalendarEvent(suggestion);
          
          const createdEvent = await this.googleService.createEvent(calendarId, event);

          syncedEvents.push({
            taskId: suggestion.task.id,
            eventId: createdEvent.id,
            calendarId: calendarId,
            syncedAt: new Date()
          });

        } catch (error) {
          errors.push(`Failed to sync task "${suggestion.task.title}": ${error}`);
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

  // Find available time slots
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
      return this.findFreeSlotsManually(allEvents, dateRange, duration, prefs);
    } catch (error) {
      console.error('Error finding available time slots:', error);
      throw error;
    }
  }

  // Convert AI suggestion to calendar event format
  private convertSuggestionToCalendarEvent(suggestion: AISchedulingSuggestion): CalendarEvent {
    const task = suggestion.task;
    const slot = suggestion.suggestedSlot;

    return {
      id: '', // Will be set by Google Calendar
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

  // Health check for Google Calendar
  async checkProvidersHealth(): Promise<{ google: boolean; outlook: boolean }> {
    const health = { google: false, outlook: false };

    try {
      const googleStatus = this.googleService.getConnectionStatus();
      if (googleStatus.connected) {
        try {
          await this.googleService.checkConnection();
          health.google = true;
        } catch (error) {
          console.error('Google Calendar health check failed:', error);
        }
      }
      // Outlook is disabled
      health.outlook = false;
    } catch (error) {
      console.error('Error checking providers health:', error);
    }

    return health;
  }
}
