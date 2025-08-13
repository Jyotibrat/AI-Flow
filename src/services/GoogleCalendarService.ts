// Browser-compatible Google Calendar Service
// Uses direct OAuth2 flow without Node.js dependencies

import { CalendarEvent, TimeSlot } from '../types/calendar';

export interface CalendarServiceInterface {
  authenticate(): Promise<boolean>;
  disconnect(): Promise<void>;
  getConnectionStatus(): { connected: boolean; email?: string };
  getCalendars(): Promise<Array<{ id: string; name: string; primary?: boolean }>>;
  getEvents(calendarId: string, startDate: Date, endDate: Date): Promise<CalendarEvent[]>;
  createEvent(calendarId: string, event: CalendarEvent): Promise<CalendarEvent>;
  updateEvent(calendarId: string, eventId: string, event: CalendarEvent): Promise<CalendarEvent>;
  deleteEvent(calendarId: string, eventId: string): Promise<void>;
  getFreeBusyInfo(calendarIds: string[], startDate: Date, endDate: Date): Promise<TimeSlot[]>;
  checkConnection(): Promise<boolean>;
}

export class GoogleCalendarService implements CalendarServiceInterface {
  private clientId: string;
  private redirectUri: string;
  private accessToken: string | undefined = undefined;
  private isAuthenticated: boolean = false;
  private initializationPromise: Promise<void>;

  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
    this.redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/google-oauth-redirect.html`;
    
    // Initialize from storage
    this.initializationPromise = this.initializeFromStorage();
  }

  private async initializeFromStorage(): Promise<void> {
    const storedToken = localStorage.getItem('google_access_token');
    if (storedToken) {
      this.accessToken = storedToken;
      // Verify token is still valid
      const isValid = await this.verifyToken();
      if (isValid) {
        this.isAuthenticated = true;
      }
    }
  }

  // Ensure initialization is complete before operations
  private async ensureInitialized(): Promise<void> {
    await this.initializationPromise;
  }

  async authenticate(): Promise<boolean> {
    await this.ensureInitialized();
    
    if (!this.clientId) {
      console.warn('Google Client ID not configured');
      return false;
    }

    try {
      // Check if we already have a valid token
      if (this.accessToken && this.isAuthenticated) {
        return true;
      }

      // Start OAuth flow
      return await this.initiateOAuthFlow();
    } catch (error) {
      console.error('Google authentication failed:', error);
      return false;
    }
  }

  private async initiateOAuthFlow(): Promise<boolean> {
    const scope = 'https://www.googleapis.com/auth/calendar';
    const responseType = 'token'; // Use implicit flow for browser apps
    const state = Math.random().toString(36).substring(2, 15);
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${this.clientId}&` +
      `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=${responseType}&` +
      `state=${state}&` +
      `include_granted_scopes=true`;

    // Store state for verification
    localStorage.setItem('oauth_state', state);

    // Open popup for OAuth
    return new Promise((resolve) => {
      const popup = window.open(authUrl, 'google-oauth', 'width=500,height=600,scrollbars=yes');
      
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          // Check if we got the token
          const token = localStorage.getItem('google_access_token');
          if (token) {
            this.accessToken = token;
            this.isAuthenticated = true;
            resolve(true);
          } else {
            resolve(false);
          }
        }
      }, 1000);

      // Handle message from popup (for when popup redirects back)
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
          popup?.close();
          this.accessToken = event.data.token;
          this.isAuthenticated = true;
          localStorage.setItem('google_access_token', this.accessToken!);
          window.removeEventListener('message', messageHandler);
          resolve(true);
        } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
          popup?.close();
          window.removeEventListener('message', messageHandler);
          resolve(false);
        }
      };

      window.addEventListener('message', messageHandler);
    });
  }

  private async verifyToken(): Promise<boolean> {
    if (!this.accessToken) return false;

    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + this.accessToken);
      const data = await response.json();
      
      if (data.error) {
        localStorage.removeItem('google_access_token');
        this.accessToken = undefined;
        this.isAuthenticated = false;
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.accessToken) {
      try {
        // Revoke token
        await fetch(`https://oauth2.googleapis.com/revoke?token=${this.accessToken}`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Error revoking token:', error);
      }
    }

    this.accessToken = undefined;
    this.isAuthenticated = false;
    localStorage.removeItem('google_access_token');
  }

  getConnectionStatus(): { connected: boolean; email?: string } {
    // For synchronous operation, check current state
    return {
      connected: this.isAuthenticated && !!this.accessToken,
      email: 'Google Calendar'
    };
  }

  // Async version that ensures initialization
  async getConnectionStatusAsync(): Promise<{ connected: boolean; email?: string }> {
    await this.ensureInitialized();
    return this.getConnectionStatus();
  }

  async getCalendars(): Promise<Array<{ id: string; name: string; primary?: boolean }>> {
    if (!this.isAuthenticated || !this.accessToken) {
      throw new Error('Not authenticated with Google Calendar');
    }

    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch calendars: ${response.statusText}`);
      }

      const data = await response.json();
      return data.items.map((calendar: any) => ({
        id: calendar.id,
        name: calendar.summary,
        primary: calendar.primary || false,
      }));
    } catch (error) {
      console.error('Error fetching Google calendars:', error);
      return [];
    }
  }

  async getEvents(calendarId: string, startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    if (!this.isAuthenticated || !this.accessToken) {
      throw new Error('Not authenticated with Google Calendar');
    }

    try {
      const timeMin = startDate.toISOString();
      const timeMax = endDate.toISOString();
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
        `timeMin=${timeMin}&timeMax=${timeMax}&orderBy=startTime&singleEvents=true`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data = await response.json();
      return data.items.map((event: any) => this.convertToCalendarEvent(event));
    } catch (error) {
      console.error('Error fetching Google Calendar events:', error);
      return [];
    }
  }

  async createEvent(calendarId: string, event: CalendarEvent): Promise<CalendarEvent> {
    if (!this.isAuthenticated || !this.accessToken) {
      throw new Error('Not authenticated with Google Calendar');
    }

    try {
      const googleEvent = {
        summary: event.summary,
        description: event.description,
        start: {
          dateTime: event.start.dateTime,
          timeZone: event.start.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: event.end.dateTime,
          timeZone: event.end.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(googleEvent),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Google Calendar API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`Failed to create event: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return this.convertToCalendarEvent(data);
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      throw error;
    }
  }

  async updateEvent(calendarId: string, eventId: string, event: CalendarEvent): Promise<CalendarEvent> {
    if (!this.isAuthenticated || !this.accessToken) {
      throw new Error('Not authenticated with Google Calendar');
    }

    try {
      const googleEvent = {
        summary: event.summary,
        description: event.description,
        start: {
          dateTime: event.start.dateTime,
          timeZone: event.start.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: event.end.dateTime,
          timeZone: event.end.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(googleEvent),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update event: ${response.statusText}`);
      }

      const data = await response.json();
      return this.convertToCalendarEvent(data);
    } catch (error) {
      console.error('Error updating Google Calendar event:', error);
      throw error;
    }
  }

  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    if (!this.isAuthenticated || !this.accessToken) {
      throw new Error('Not authenticated with Google Calendar');
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok && response.status !== 404) {
        throw new Error(`Failed to delete event: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error);
      throw error;
    }
  }

  async getFreeBusyInfo(calendarIds: string[], startDate: Date, endDate: Date): Promise<TimeSlot[]> {
    if (!this.isAuthenticated || !this.accessToken) {
      throw new Error('Not authenticated with Google Calendar');
    }

    try {
      const busySlots: TimeSlot[] = [];

      for (const calendarId of calendarIds) {
        const events = await this.getEvents(calendarId, startDate, endDate);
        events.forEach(event => {
          busySlots.push({
            start: new Date(event.start.dateTime),
            end: new Date(event.end.dateTime),
            available: false,
          });
        });
      }

      return busySlots;
    } catch (error) {
      console.error('Error fetching free/busy info:', error);
      return [];
    }
  }

  private convertToCalendarEvent(googleEvent: any): CalendarEvent {
    return {
      id: googleEvent.id,
      summary: googleEvent.summary || 'Untitled Event',
      description: googleEvent.description || '',
      start: {
        dateTime: googleEvent.start.dateTime || googleEvent.start.date,
        timeZone: googleEvent.start.timeZone,
      },
      end: {
        dateTime: googleEvent.end.dateTime || googleEvent.end.date,
        timeZone: googleEvent.end.timeZone,
      },
      location: googleEvent.location,
      source: 'google' as const,
      taskId: googleEvent.extendedProperties?.private?.taskId,
    };
  }

  // Health check method
  async checkConnection(): Promise<boolean> {
    try {
      if (!this.isAuthenticated || !this.accessToken) {
        return false;
      }

      const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=1', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Google Calendar connection check failed:', error);
      return false;
    }
  }
}
