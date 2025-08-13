# ScheduleX - AI-Powered Calendar Integration

ScheduleX is a comprehensive AI-powered calendar integration system that automatically schedules your tasks into available time slots across Google Calendar and Outlook Calendar.

## Features

### 🔗 Calendar Integration
- **Google Calendar**: OAuth2 integration with full read/write access
- **Outlook Calendar**: Microsoft Graph API integration with MSAL authentication
- **Multi-Calendar Support**: Connect and manage multiple calendar accounts simultaneously
- **Real-time Sync**: Automatic synchronization of events and availability

### 🤖 AI-Powered Scheduling
- **Task Analysis**: AI analyzes task duration, deadline, and priority using Gemini API
- **Smart Optimization**: Finds optimal time slots considering workload balance and preferences
- **Conflict Detection**: Automatically detects and resolves scheduling conflicts
- **Preference Learning**: Adapts to your working patterns and focus times

### 📋 Task Management
- **Comprehensive CRUD**: Create, edit, delete, and complete tasks
- **Priority System**: High, medium, low priority with visual indicators
- **Deadline Tracking**: Smart deadline management with urgency alerts
- **Progress Tracking**: Monitor task completion and productivity metrics

### ⚙️ Customizable Preferences
- **Working Hours**: Set your preferred work schedule
- **Focus Time Blocks**: Define periods for high-concentration tasks
- **Buffer Time**: Automatic spacing between tasks for transitions
- **Timezone Support**: Full timezone awareness and conversion

## Prerequisites

Before setting up ScheduleX, ensure you have:

1. **Node.js** (version 16 or higher)
2. **Google Cloud Console Account** for Google Calendar API
3. **Microsoft Azure Account** for Outlook Calendar integration
4. **Gemini API Key** for AI scheduling features

## Environment Setup

### 1. Install Dependencies

```bash
npm install google-auth-library @microsoft/microsoft-graph-client @azure/msal-browser date-fns uuid react-big-calendar moment
```

### 2. Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Google Calendar Integration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Microsoft Outlook Integration
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
VITE_MICROSOFT_AUTHORITY=https://login.microsoftonline.com/common

# Gemini AI API (for task analysis and optimization)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Custom redirect URIs
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173
VITE_MICROSOFT_REDIRECT_URI=http://localhost:5173
```

### 3. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5173` (or your domain)
5. Copy the Client ID and Client Secret to your `.env` file

### 4. Microsoft Azure Setup

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to Azure Active Directory > App registrations
3. Create a new registration:
   - Name: ScheduleX Calendar Integration
   - Redirect URI: `http://localhost:5173` (Single-page application)
4. Go to API permissions and add:
   - Microsoft Graph > Calendars.ReadWrite
   - Microsoft Graph > User.Read
5. Copy the Application (client) ID to your `.env` file

### 5. Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key to your `.env` file

## API Permissions Required

### Google Calendar API
- `https://www.googleapis.com/auth/calendar` - Read/write access to calendars
- `https://www.googleapis.com/auth/calendar.events` - Read/write access to events

### Microsoft Graph API
- `Calendars.ReadWrite` - Read and write access to user calendars
- `User.Read` - Read user profile information

## Project Structure

```
src/
├── components/calendar/          # Calendar-related React components
│   ├── TaskManager.tsx          # Task creation and management
│   ├── CalendarConnections.tsx  # Calendar provider connections
│   ├── AISchedulePreview.tsx    # AI-generated schedule preview
│   ├── SchedulingPreferences.tsx # User preference settings
│   └── QuickStats.tsx           # Dashboard statistics
├── services/                    # Backend services
│   ├── GoogleCalendarService.ts # Google Calendar integration
│   ├── OutlookCalendarService.ts # Outlook Calendar integration
│   ├── AISchedulingService.ts   # AI-powered scheduling logic
│   └── CalendarIntegrationManager.ts # Central orchestration
├── types/                       # TypeScript interfaces
│   └── calendar.ts              # Calendar-related type definitions
└── pages/
    └── ScheduleX.tsx            # Main ScheduleX page component
```

## Key Components

### CalendarIntegrationManager
Central service that orchestrates all calendar operations:
- Manages connections to multiple calendar providers
- Handles OAuth flows and token management
- Coordinates between AI scheduling and calendar sync
- Provides unified interface for calendar operations

### AI Scheduling Service
Powered by Gemini API for intelligent task scheduling:
- Analyzes task metadata (duration, priority, deadline)
- Finds optimal time slots in connected calendars
- Balances workload across days and weeks
- Respects user preferences and focus time blocks

### Task Management
Comprehensive task lifecycle management:
- Rich task creation with metadata
- Priority and deadline management
- Progress tracking and completion
- Integration with calendar events

## Usage

### 1. Connect Calendar Providers

1. Navigate to ScheduleX page
2. Go to "Calendar" tab
3. Click "Connect Google Calendar" or "Connect Outlook"
4. Complete OAuth flow
5. Select which calendars to sync

### 2. Create Tasks

1. Go to "Tasks" tab
2. Click "Add Task" button
3. Fill in task details:
   - Title and description
   - Duration (estimated time)
   - Priority (High/Medium/Low)
   - Deadline
4. Save task

### 3. Configure Preferences

1. Go to "Settings" tab
2. Set working hours and days
3. Define focus time blocks
4. Configure buffer times and preferences
5. Save settings

### 4. Generate AI Schedule

1. Go to "AI Schedule" tab
2. Click "Generate AI Schedule"
3. Review the optimized schedule
4. Make any necessary adjustments
5. Click "Sync to Calendars" to apply

## Development

### Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables for Development

For local development, use these redirect URIs:
- Google: `http://localhost:5173`
- Microsoft: `http://localhost:5173`

### Testing

Test calendar integrations with:
1. Google Calendar test account
2. Microsoft 365 test account
3. Various task scenarios
4. Different timezone configurations

## Security Considerations

1. **OAuth Tokens**: Stored securely in browser storage with automatic refresh
2. **API Keys**: Environment variables only, never exposed in client code
3. **Permissions**: Minimal required permissions for calendar access
4. **Data Privacy**: Task data processed locally, only metadata sent to AI API

## Troubleshooting

### Common Issues

1. **OAuth Redirect Mismatch**
   - Ensure redirect URIs match exactly in provider settings
   - Check for trailing slashes and protocol (http vs https)

2. **API Rate Limits**
   - Google Calendar: 1000 requests per 100 seconds per user
   - Microsoft Graph: Varies by endpoint, typically 10,000 requests per 10 minutes

3. **CORS Issues**
   - Ensure proper origin configuration in OAuth settings
   - Check browser console for detailed error messages

4. **Token Expiration**
   - Tokens are automatically refreshed
   - Check network tab for failed auth requests

### Debug Mode

Enable debug logging by adding to your `.env`:
```env
VITE_DEBUG_CALENDAR=true
```

## Contributing

When contributing to ScheduleX:

1. Follow TypeScript best practices
2. Add proper error handling
3. Include JSDoc comments for public methods
4. Test with multiple calendar providers
5. Consider timezone edge cases

## License

This project is part of the AI-Flow application and follows the same licensing terms.

## Support

For support with ScheduleX:
1. Check this documentation
2. Review console logs for errors
3. Verify environment variable configuration
4. Test OAuth flows with provider tools
5. Check API quota limits in respective consoles
