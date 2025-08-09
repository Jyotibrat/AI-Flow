// Calendar Connections Component for ScheduleX

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Link, 
  Unlink,
  RefreshCw,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';
import { CalendarProvider } from '../../types/calendar';
import CalendarIntegrationManager from '../../services/CalendarIntegrationManager';
import { toast } from 'react-hot-toast';

interface CalendarConnectionsProps {
  connectedProviders: CalendarProvider[];
  onConnect: (providerId: 'google') => void;
  onDisconnect: (providerId: string) => void;
  calendarManager: CalendarIntegrationManager;
}

const CalendarConnections: React.FC<CalendarConnectionsProps> = ({
  connectedProviders,
  onConnect,
  onDisconnect,
  calendarManager
}) => {
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);
  const [providerHealth, setProviderHealth] = useState<{ google: boolean }>({
    google: false
  });

  useEffect(() => {
    checkProvidersHealth();
  }, [connectedProviders]);

  const checkProvidersHealth = async () => {
    try {
      const health = await calendarManager.checkProvidersHealth();
      setProviderHealth(health);
    } catch (error) {
      console.error('Error checking provider health:', error);
    }
  };

  const refreshCalendarList = async (providerId: string) => {
    setIsRefreshing(providerId);
    try {
      // Refresh calendar list logic would go here
      // For now, we'll just simulate a refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Calendar list refreshed');
    } catch (error) {
      console.error('Error refreshing calendar list:', error);
      toast.error('Failed to refresh calendar list');
    } finally {
      setIsRefreshing(null);
    }
  };

  const toggleCalendarVisibility = (_providerId: string, _calendarId: string, currentSelected: boolean) => {
    // This would update the calendar selection in the provider
    // For now, we'll just show a toast
    toast.success(`Calendar ${currentSelected ? 'hidden' : 'shown'} in sync`);
  };

  const providers = [
    {
      id: 'google' as const,
      name: 'Google Calendar',
      description: 'Connect to your Google Calendar to sync events and find available time slots',
      icon: '🗓️',
      color: 'from-blue-500 to-blue-600',
      connected: connectedProviders.find(p => p.id === 'google'),
      healthy: providerHealth.google
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="mb-2 text-3xl font-bold text-white">Calendar Connections</h2>
        <p className="text-gray-400">
          Connect your calendars to enable AI-powered scheduling and time optimization
        </p>
      </div>

      {/* Provider Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {providers.map((provider, index) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 transition-all duration-300 border border-gray-700 bg-gray-900/50 rounded-xl hover:border-gray-600"
          >
            {/* Provider Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${provider.color} rounded-lg flex items-center justify-center text-2xl`}>
                  {provider.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{provider.name}</h3>
                  <div className="flex items-center mt-1 space-x-2">
                    {provider.connected ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-400">Connected</span>
                        {provider.healthy ? (
                          <Shield className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">Not connected</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Connection Actions */}
              <div className="flex space-x-2">
                {provider.connected ? (
                  <>
                    <button
                      onClick={() => refreshCalendarList(provider.id)}
                      disabled={isRefreshing === provider.id}
                      className="p-2 text-gray-400 transition-all duration-200 rounded-lg hover:text-blue-400 hover:bg-blue-500/20"
                      title="Refresh calendar list"
                    >
                      <RefreshCw className={`w-4 h-4 ${isRefreshing === provider.id ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      onClick={() => onDisconnect(provider.id)}
                      className="p-2 text-gray-400 transition-all duration-200 rounded-lg hover:text-red-400 hover:bg-red-500/20"
                      title="Disconnect"
                    >
                      <Unlink className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onConnect(provider.id)}
                    className="p-2 text-gray-400 transition-all duration-200 rounded-lg hover:text-green-400 hover:bg-green-500/20"
                    title="Connect"
                  >
                    <Link className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <p className="mb-4 text-sm text-gray-400">{provider.description}</p>

            {/* Connection Button */}
            {!provider.connected ? (
              <button
                onClick={() => onConnect(provider.id)}
                className={`w-full px-4 py-3 bg-gradient-to-r ${provider.color} rounded-lg font-semibold text-white hover:opacity-90 transition-all duration-300 flex items-center justify-center space-x-2`}
              >
                <Link className="w-5 h-5" />
                <span>Connect {provider.name}</span>
              </button>
            ) : (
              <div className="space-y-4">
                {/* Account Info */}
                <div className="p-4 rounded-lg bg-gray-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Connected Account</span>
                    <span className={`w-2 h-2 rounded-full ${provider.healthy ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  <p className="font-medium text-white">{provider.connected.userEmail}</p>
                  {!provider.healthy && (
                    <p className="mt-1 text-xs text-red-400">Connection issue - please reconnect</p>
                  )}
                </div>

                {/* Calendar List */}
                {provider.connected.calendarList && provider.connected.calendarList.length > 0 && (
                  <div className="p-4 rounded-lg bg-gray-800/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-300">Available Calendars</span>
                      <span className="text-xs text-gray-500">
                        {provider.connected.calendarList.filter(cal => cal.selected !== false).length} selected
                      </span>
                    </div>
                    <div className="space-y-2 overflow-y-auto max-h-32">
                      {provider.connected.calendarList.map((calendar) => (
                        <div key={calendar.id} className="flex items-center justify-between">
                          <div className="flex items-center flex-1 space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-white truncate">{calendar.name}</span>
                            {calendar.primary && (
                              <span className="px-2 py-1 text-xs text-blue-400 rounded bg-blue-500/20">Primary</span>
                            )}
                          </div>
                          <button
                            onClick={() => toggleCalendarVisibility(provider.id, calendar.id, calendar.selected !== false)}
                            className="p-1 text-gray-400 transition-colors hover:text-white"
                            title={calendar.selected !== false ? 'Hide from sync' : 'Include in sync'}
                          >
                            {calendar.selected !== false ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disconnect Button */}
                <button
                  onClick={() => onDisconnect(provider.id)}
                  className="flex items-center justify-center w-full px-4 py-2 space-x-2 font-semibold text-white transition-all duration-300 bg-gray-700 rounded-lg hover:bg-red-600"
                >
                  <Unlink className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-4 border rounded-lg bg-blue-500/10 border-blue-500/30"
      >
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="mb-1 font-medium text-blue-400">Security & Privacy</h4>
            <p className="text-sm text-blue-300/80">
              Your calendar data is handled securely and never stored on our servers. 
              We only access your calendar information to find available time slots and create scheduled events. 
              You can disconnect at any time.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Integration Status */}
      {connectedProviders.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-4 border rounded-lg bg-green-500/10 border-green-500/30"
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <h4 className="font-medium text-green-400">Integration Active</h4>
              <p className="text-sm text-green-300/80">
                {connectedProviders.length} calendar{connectedProviders.length !== 1 ? 's' : ''} connected. 
                AI scheduling is now available for optimal time management.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CalendarConnections;
