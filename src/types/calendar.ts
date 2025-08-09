// Types for ScheduleX Calendar Integration

export interface Task {
  id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  deadline?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  tags?: string[];
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  estimatedEffort?: 'easy' | 'medium' | 'hard';
  dependencies?: string[]; // IDs of dependent tasks
  location?: string;
  reminders?: number[]; // minutes before task
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
  }>;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: 'email' | 'popup';
      minutes: number;
    }>;
  };
  source?: 'google' | 'outlook' | 'schedulex';
  taskId?: string; // Reference to original task
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  conflictingEvents?: CalendarEvent[];
}

export interface SchedulingPreferences {
  workingHours: {
    start: string; // '09:00'
    end: string; // '17:00'
  };
  workingDays: number[]; // 0-6 (Sunday-Saturday)
  bufferTime: number; // minutes between tasks
  preferredTaskLength: number; // minutes
  breakDuration: number; // minutes
  timezone: string;
  focusTimeBlocks?: {
    start: string;
    end: string;
    days: number[];
  }[];
}

export interface CalendarProvider {
  id: 'google' | 'outlook';
  name: string;
  isConnected: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  userEmail?: string;
  calendarList?: Array<{
    id: string;
    name: string;
    primary?: boolean;
    selected?: boolean;
  }>;
}

export interface AISchedulingSuggestion {
  id: string;
  task: Task;
  suggestedSlot: TimeSlot;
  confidence: number; // 0-1
  reasoning: string;
  alternatives?: TimeSlot[];
  considerations: string[];
}

export interface ScheduleOptimization {
  totalTasks: number;
  scheduledTasks: number;
  unscheduledTasks: Task[];
  suggestions: AISchedulingSuggestion[];
  workloadBalance: {
    date: string;
    hours: number;
    taskCount: number;
    intensity: 'light' | 'moderate' | 'heavy' | 'overloaded';
  }[];
  conflicts: Array<{
    type: 'overlap' | 'deadline_conflict' | 'dependency_violation';
    description: string;
    affectedTasks: string[];
    severity: 'low' | 'medium' | 'high';
  }>;
}

export interface CalendarSync {
  id: string;
  taskId: string;
  calendarProvider: 'google' | 'outlook';
  calendarId: string;
  eventId: string;
  lastSyncAt: Date;
  syncStatus: 'pending' | 'synced' | 'failed' | 'conflict';
  errorMessage?: string;
}

// OAuth configuration
export interface OAuthConfig {
  google: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string[];
  };
  microsoft: {
    clientId: string;
    authority: string;
    redirectUri: string;
    scopes: string[];
  };
}

// Calendar integration settings
export interface CalendarSettings {
  autoSync: boolean;
  syncInterval: number; // minutes
  defaultCalendar: {
    google?: string;
    outlook?: string;
  };
  reminderSettings: {
    email: boolean;
    popup: boolean;
    defaultMinutes: number[];
  };
  conflictResolution: 'ask' | 'auto_reschedule' | 'skip';
  timeBlockingEnabled: boolean;
  smartSchedulingEnabled: boolean;
}

// AI prompt templates for scheduling
export interface AIPromptTemplate {
  taskAnalysis: string;
  scheduleOptimization: string;
  conflictResolution: string;
  workloadBalancing: string;
}
