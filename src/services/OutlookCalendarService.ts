// Outlook Calendar Service for ScheduleX Integration

import { PublicClientApplication, AccountInfo } from '@azure/msal-browser';
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthenticationProvider } from '@microsoft/microsoft-graph-client';
import { CalendarEvent, CalendarProvider, TimeSlot } from '../types/calendar';

class MSALAuthProvider implements AuthenticationProvider {
  private msalInstance: PublicClientApplication;
  private account: AccountInfo | null = null;

  constructor(msalInstance: PublicClientApplication, account: AccountInfo | null = null) {
    this.msalInstance = msalInstance;
    this.account = account;
  }

  async getAccessToken(): Promise<string> {
    try {
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const account = this.account || accounts[0];
      const tokenRequest = {
        scopes: ['https://graph.microsoft.com/Calendars.ReadWrite', 'https://graph.microsoft.com/User.Read'],
        account: account,
      };

      const response = await this.msalInstance.acquireTokenSilent(tokenRequest);
      return response.accessToken;
    } catch (error) {
      console.error('Error acquiring token:', error);
      throw error;
    }
  }
}

class OutlookCalendarService {
  private msalInstance: PublicClientApplication;
  private graphClient: Client | null = null;
  private authProvider: MSALAuthProvider | null = null;

  constructor() {
    const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
    const authority = import.meta.env.VITE_MICROSOFT_AUTHORITY || 'https://login.microsoftonline.com/common';
    const redirectUri = import.meta.env.VITE_MICROSOFT_REDIRECT_URI || `${window.location.origin}/auth/microsoft/callback`;

    this.msalInstance = new PublicClientApplication({
      auth: {
        clientId,
        authority,
        redirectUri,
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false,
      },
    });
  }

  // Initialize authentication flow
  async initializeAuth(): Promise<void> {
    try {
      const loginRequest = {
        scopes: ['https://graph.microsoft.com/Calendars.ReadWrite', 'https://graph.microsoft.com/User.Read'],
        prompt: 'consent' as const,
      };

      await this.msalInstance.loginPopup(loginRequest);
    } catch (error) {
      console.error('Microsoft auth error:', error);
      throw new Error('Failed to authenticate with Microsoft');
    }
  }

  // Handle authentication and setup Graph client
  async setupGraphClient(): Promise<CalendarProvider> {
    try {
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        throw new Error('No authenticated accounts found');
      }

      const account = accounts[0];
      this.authProvider = new MSALAuthProvider(this.msalInstance, account);
      this.graphClient = Client.initWithMiddleware({ authProvider: this.authProvider });

      // Get user info
      const userInfo = await this.getUserInfo();
      const calendarList = await this.getCalendarList();

      const provider: CalendarProvider = {
        id: 'outlook',
        name: 'Outlook Calendar',
        isConnected: true,
        userEmail: userInfo.email,
        calendarList
      };

      // Store provider info
      this.storeProvider(provider);
      return provider;
    } catch (error) {
      console.error('Error setting up Graph client:', error);
      throw error;
    }
  }

  // Get user information
  private async getUserInfo(): Promise<{ email: string; name: string }> {
    if (!this.graphClient) {
      throw new Error('Graph client not initialized');
    }

    try {
      const user = await this.graphClient.api('/me').get();
      return { 
        email: user.mail || user.userPrincipalName, 
        name: user.displayName 
      };
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  }

  // Get list of calendars
  async getCalendarList(): Promise<Array<{ id: string; name: string; primary?: boolean }>> {
    if (!this.graphClient) {
      throw new Error('Graph client not initialized');
    }

    try {
      const calendars = await this.graphClient.api('/me/calendars').get();
      return calendars.value.map((cal: any) => ({
        id: cal.id,
        name: cal.name,
        primary: cal.isDefaultCalendar || false
      }));
    } catch (error) {
      console.error('Error fetching calendar list:', error);
      throw error;
    }
  }

  // Get events from a calendar within date range
  async getEvents(
    calendarId: string = 'calendar',
    timeMin: Date,
    timeMax: Date
  ): Promise<CalendarEvent[]> {
    if (!this.graphClient) {
      throw new Error('Graph client not initialized');
    }

    try {
      const startTime = timeMin.toISOString();
      const endTime = timeMax.toISOString();
      
      const events = await this.graphClient
        .api(`/me/calendars/${calendarId}/calendarView`)
        .query({
          startDateTime: startTime,
          endDateTime: endTime,
          $orderby: 'start/dateTime',
        })
        .get();

      return events.value.map((event: any) => this.convertOutlookEventToCalendarEvent(event));
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  // Create a new event
  async createEvent(calendarId: string, event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    if (!this.graphClient) {
      throw new Error('Graph client not initialized');
    }

    try {
      const outlookEvent = this.convertCalendarEventToOutlookEvent(event);
      const createdEvent = await this.graphClient
        .api(`/me/calendars/${calendarId}/events`)
        .post(outlookEvent);

      return this.convertOutlookEventToCalendarEvent(createdEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Update an existing event
  async updateEvent(calendarId: string, eventId: string, event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    if (!this.graphClient) {
      throw new Error('Graph client not initialized');
    }

    try {
      const outlookEvent = this.convertCalendarEventToOutlookEvent(event);
      const updatedEvent = await this.graphClient
        .api(`/me/calendars/${calendarId}/events/${eventId}`)
        .patch(outlookEvent);

      return this.convertOutlookEventToCalendarEvent(updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  // Delete an event
  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    if (!this.graphClient) {
      throw new Error('Graph client not initialized');
    }

    try {
      await this.graphClient
        .api(`/me/calendars/${calendarId}/events/${eventId}`)
        .delete();
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  // Find free time slots
  async findFreeTimeSlots(
    calendarIds: string[],
    startTime: Date,
    endTime: Date,
    durationMinutes: number
  ): Promise<TimeSlot[]> {
    try {
      const freeSlots: TimeSlot[] = [];
      const events: CalendarEvent[] = [];

      // Get events from all calendars
      for (const calendarId of calendarIds) {
        const calendarEvents = await this.getEvents(calendarId, startTime, endTime);
        events.push(...calendarEvents);
      }

      // Sort events by start time
      events.sort((a, b) => 
        new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime()
      );

      // Find gaps between events
      let currentTime = new Date(startTime);
      for (const event of events) {
        const eventStart = new Date(event.start.dateTime);
        const eventEnd = new Date(event.end.dateTime);

        // Check if there's a gap before this event
        if (currentTime < eventStart) {
          const gapDuration = eventStart.getTime() - currentTime.getTime();
          if (gapDuration >= durationMinutes * 60 * 1000) {
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
        if (remainingDuration >= durationMinutes * 60 * 1000) {
          freeSlots.push({
            start: new Date(currentTime),
            end: new Date(endTime),
            available: true
          });
        }
      }

      return freeSlots;
    } catch (error) {
      console.error('Error finding free time slots:', error);
      throw error;
    }
  }

  // Convert Outlook event to our CalendarEvent format
  private convertOutlookEventToCalendarEvent(outlookEvent: any): CalendarEvent {
    return {
      id: outlookEvent.id,
      summary: outlookEvent.subject || '',
      description: outlookEvent.bodyPreview,
      start: {
        dateTime: outlookEvent.start.dateTime,
        timeZone: outlookEvent.start.timeZone
      },
      end: {
        dateTime: outlookEvent.end.dateTime,
        timeZone: outlookEvent.end.timeZone
      },
      location: outlookEvent.location?.displayName,
      attendees: outlookEvent.attendees?.map((attendee: any) => ({
        email: attendee.emailAddress.address,
        displayName: attendee.emailAddress.name,
        responseStatus: this.mapOutlookResponseStatus(attendee.status.response)
      })),
      source: 'outlook'
    };
  }

  // Convert our CalendarEvent format to Outlook event
  private convertCalendarEventToOutlookEvent(event: Partial<CalendarEvent>): any {
    const outlookEvent: any = {
      subject: event.summary,
      body: {
        contentType: 'text',
        content: event.description || ''
      },
      start: {
        dateTime: event.start?.dateTime,
        timeZone: event.start?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: event.end?.dateTime,
        timeZone: event.end?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    if (event.location) {
      outlookEvent.location = {
        displayName: event.location
      };
    }

    if (event.attendees) {
      outlookEvent.attendees = event.attendees.map((attendee) => ({
        emailAddress: {
          address: attendee.email,
          name: attendee.displayName
        },
        type: 'required'
      }));
    }

    return outlookEvent;
  }

  // Map Outlook response status to our format
  private mapOutlookResponseStatus(outlookStatus: string): 'needsAction' | 'declined' | 'tentative' | 'accepted' {
    switch (outlookStatus?.toLowerCase()) {
      case 'accepted':
        return 'accepted';
      case 'declined':
        return 'declined';
      case 'tentativelyaccepted':
        return 'tentative';
      default:
        return 'needsAction';
    }
  }

  // Store provider info
  private storeProvider(provider: CalendarProvider): void {
    localStorage.setItem('outlook_calendar_provider', JSON.stringify(provider));
  }

  // Load stored provider
  loadStoredProvider(): CalendarProvider | null {
    try {
      const stored = localStorage.getItem('outlook_calendar_provider');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading stored provider:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const accounts = this.msalInstance.getAllAccounts();
    return accounts.length > 0;
  }

  // Disconnect from Outlook
  async disconnect(): Promise<void> {
    try {
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        await this.msalInstance.logoutPopup({
          account: accounts[0]
        });
      }
      localStorage.removeItem('outlook_calendar_provider');
      this.graphClient = null;
      this.authProvider = null;
    } catch (error) {
      console.error('Error disconnecting from Outlook:', error);
      throw error;
    }
  }

  // Initialize the service and setup if already authenticated
  async initialize(): Promise<CalendarProvider | null> {
    try {
      await this.msalInstance.initialize();
      
      if (this.isAuthenticated()) {
        return await this.setupGraphClient();
      }
      
      return this.loadStoredProvider();
    } catch (error) {
      console.error('Error initializing Outlook service:', error);
      return null;
    }
  }
}

export default OutlookCalendarService;
