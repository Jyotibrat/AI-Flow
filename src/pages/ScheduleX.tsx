// ScheduleX Main Page - AI-Powered Calendar Integration

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  Clock,
  Brain,
  Settings,
  Plus,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Zap,
  Users,
  Target
} from 'lucide-react';
import CalendarIntegrationManager from '../services/CalendarIntegrationManager';
import TaskManager from '../components/calendar/TaskManager';
import CalendarConnections from '../components/calendar/CalendarConnections';
import AISchedulePreview from '../components/calendar/AISchedulePreview';
import SchedulingPreferences from '../components/calendar/SchedulingPreferences';
import QuickStats from '../components/calendar/QuickStats';
import { 
  Task, 
  CalendarProvider, 
  SchedulingPreferences as ISchedulingPreferences,
  ScheduleOptimization 
} from '../types/calendar';
import { toast } from 'react-hot-toast';

const ScheduleX: React.FC = () => {
  const [calendarManager] = useState(() => new CalendarIntegrationManager());
  const [activeTab, setActiveTab] = useState<'tasks' | 'calendar' | 'ai' | 'settings'>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [connectedProviders, setConnectedProviders] = useState<CalendarProvider[]>([]);
  const [aiOptimization, setAiOptimization] = useState<ScheduleOptimization | null>(null);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [preferences, setPreferences] = useState<ISchedulingPreferences>({
    workingHours: { start: '09:00', end: '17:00' },
    workingDays: [1, 2, 3, 4, 5],
    bufferTime: 15,
    preferredTaskLength: 60,
    breakDuration: 15,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    focusTimeBlocks: [
      { start: '09:00', end: '11:00', days: [1, 2, 3, 4, 5] },
      { start: '14:00', end: '16:00', days: [1, 2, 3, 4, 5] }
    ]
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load connected providers with proper initialization
      const providers = await calendarManager.getConnectedProvidersAsync();
      setConnectedProviders(providers);

      // Load saved tasks
      const savedTasks = loadTasksFromStorage();
      setTasks(savedTasks);

      // Load saved preferences
      const savedPreferences = loadPreferencesFromStorage();
      if (savedPreferences) {
        setPreferences(savedPreferences);
      }

      // Load saved AI optimization
      const savedOptimization = loadAIOptimizationFromStorage();
      if (savedOptimization) {
        setAiOptimization(savedOptimization);
        toast.success('Previous AI schedule restored!', { 
          duration: 3000,
          id: 'restore-schedule'
        });
      }

      // Check provider health
      await calendarManager.checkProvidersHealth();
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load calendar data');
    }
  };

  // Task management
  const addTask = (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    // Clear AI optimization since tasks changed
    setAiOptimization(null);
    clearAIOptimizationFromStorage();
    toast.success('Task added successfully!');
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    );
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    // Clear AI optimization since tasks changed
    setAiOptimization(null);
    clearAIOptimizationFromStorage();
    toast.success('Task updated successfully!');
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    // Clear AI optimization since tasks changed
    setAiOptimization(null);
    clearAIOptimizationFromStorage();
    toast.success('Task deleted successfully!');
  };

  // AI Schedule Generation
  const generateAISchedule = async () => {
    if (tasks.length === 0) {
      toast.error('Please add some tasks before generating a schedule');
      return;
    }

    if (connectedProviders.length === 0) {
      toast.error('Please connect to at least one calendar provider');
      return;
    }

    setIsGeneratingSchedule(true);
    try {
      const optimization = await calendarManager.generateSmartSchedule(
        tasks.filter(task => !task.isCompleted),
        preferences
      );
      
      setAiOptimization(optimization);
      saveAIOptimizationToStorage(optimization);
      setActiveTab('ai');
      toast.success(`Generated schedule for ${optimization.scheduledTasks} tasks!`);
    } catch (error) {
      console.error('Error generating AI schedule:', error);
      toast.error('Failed to generate schedule. Please try again.');
    } finally {
      setIsGeneratingSchedule(false);
    }
  };

  // Calendar connection handlers
  const handleCalendarConnect = async (providerId: 'google') => {
    try {
      if (providerId === 'google') {
        const result = await calendarManager.connectGoogleCalendar();
        if (result.success && result.provider) {
          setConnectedProviders(prev => [...prev.filter(p => p.id !== 'google'), result.provider]);
          toast.success('Google Calendar connected successfully!');
        } else {
          toast.error('Failed to connect to Google Calendar');
        }
      }
    } catch (error) {
      console.error(`Error connecting to ${providerId}:`, error);
      toast.error('Failed to connect to Google Calendar');
    }
  };

  const handleCalendarDisconnect = async (providerId: string) => {
    try {
      await calendarManager.disconnectProvider(providerId);
      setConnectedProviders(prev => prev.filter(p => p.id !== providerId));
      toast.success('Google Calendar disconnected');
    } catch (error) {
      console.error(`Error disconnecting from ${providerId}:`, error);
      toast.error('Failed to disconnect from Google Calendar');
    }
  };

  // Sync to calendar
  const syncToCalendar = async () => {
    if (!aiOptimization?.suggestions || aiOptimization.suggestions.length === 0) {
      toast.error('No AI schedule suggestions to sync. Generate a schedule first.');
      return;
    }

    if (connectedProviders.length === 0) {
      toast.error('No calendar providers connected. Connect to Google Calendar first.');
      return;
    }

    try {
      setIsGeneratingSchedule(true);
      toast.loading('Syncing tasks to Google Calendar...', { id: 'sync' });

      const result = await calendarManager.syncTasksToCalendar(
        aiOptimization.suggestions,
        'primary' // Use primary Google Calendar
      );

      if (result.success) {
        toast.success(`Successfully synced ${result.syncedEvents.length} tasks to calendar!`, { 
          id: 'sync' 
        });
        
      } else {
        toast.error(`Sync completed with errors: ${result.errors.join(', ')}`, { 
          id: 'sync' 
        });
      }
      
    } catch (error) {
      console.error('Calendar sync error:', error);
      toast.error('Failed to sync to calendar. Please try again.', { 
        id: 'sync' 
      });
    } finally {
      setIsGeneratingSchedule(false);
    }
  };

  // Storage helpers
  const saveTasksToStorage = (tasks: Task[]) => {
    try {
      localStorage.setItem('schedulex_tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const loadTasksFromStorage = (): Task[] => {
    try {
      const stored = localStorage.getItem('schedulex_tasks');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          deadline: task.deadline ? new Date(task.deadline) : undefined
        }));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
    return [];
  };

  const savePreferencesToStorage = (prefs: ISchedulingPreferences) => {
    try {
      localStorage.setItem('schedulex_preferences', JSON.stringify(prefs));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const loadPreferencesFromStorage = (): ISchedulingPreferences | null => {
    try {
      const stored = localStorage.getItem('schedulex_preferences');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return null;
    }
  };

  const saveAIOptimizationToStorage = (optimization: ScheduleOptimization) => {
    try {
      const optimizationData = {
        ...optimization,
        suggestions: optimization.suggestions.map(suggestion => ({
          ...suggestion,
          task: {
            ...suggestion.task,
            createdAt: suggestion.task.createdAt.toISOString(),
            updatedAt: suggestion.task.updatedAt.toISOString(),
            deadline: suggestion.task.deadline?.toISOString()
          },
          suggestedSlot: {
            ...suggestion.suggestedSlot,
            start: suggestion.suggestedSlot.start.toISOString(),
            end: suggestion.suggestedSlot.end.toISOString()
          },
          alternatives: suggestion.alternatives?.map(alt => ({
            ...alt,
            start: alt.start.toISOString(),
            end: alt.end.toISOString()
          }))
        }))
      };
      localStorage.setItem('schedulex_ai_optimization', JSON.stringify(optimizationData));
    } catch (error) {
      console.error('Error saving AI optimization:', error);
    }
  };

  const loadAIOptimizationFromStorage = (): ScheduleOptimization | null => {
    try {
      const stored = localStorage.getItem('schedulex_ai_optimization');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          suggestions: parsed.suggestions.map((suggestion: any) => ({
            ...suggestion,
            task: {
              ...suggestion.task,
              createdAt: new Date(suggestion.task.createdAt),
              updatedAt: new Date(suggestion.task.updatedAt),
              deadline: suggestion.task.deadline ? new Date(suggestion.task.deadline) : undefined
            },
            suggestedSlot: {
              ...suggestion.suggestedSlot,
              start: new Date(suggestion.suggestedSlot.start),
              end: new Date(suggestion.suggestedSlot.end)
            },
            alternatives: suggestion.alternatives?.map((alt: any) => ({
              ...alt,
              start: new Date(alt.start),
              end: new Date(alt.end)
            }))
          }))
        };
      }
    } catch (error) {
      console.error('Error loading AI optimization:', error);
    }
    return null;
  };

  const clearAIOptimizationFromStorage = () => {
    try {
      localStorage.removeItem('schedulex_ai_optimization');
    } catch (error) {
      console.error('Error clearing AI optimization:', error);
    }
  };

  const updatePreferences = (newPreferences: ISchedulingPreferences) => {
    setPreferences(newPreferences);
    savePreferencesToStorage(newPreferences);
    toast.success('Preferences updated successfully!');
  };

  const tabs = [
    { id: 'tasks', label: 'Tasks', icon: CheckCircle },
    { id: 'calendar', label: 'Calendars', icon: Calendar },
    { id: 'ai', label: 'AI Schedule', icon: Brain },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] as const;

  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);
  const urgentTasks = pendingTasks.filter(task => task.priority === 'urgent' || task.priority === 'high');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen px-6 py-12"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              ScheduleX
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            AI-powered task scheduling that integrates with Google Calendar. 
            Let artificial intelligence optimize your time and boost your productivity.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <QuickStats
          totalTasks={tasks.length}
          pendingTasks={pendingTasks.length}
          completedTasks={completedTasks.length}
          urgentTasks={urgentTasks.length}
          connectedCalendars={connectedProviders.length}
          lastScheduleGenerated={aiOptimization ? new Date() : null}
        />

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          <button
            onClick={generateAISchedule}
            disabled={isGeneratingSchedule || tasks.length === 0 || connectedProviders.length === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingSchedule ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
            <span>{isGeneratingSchedule ? 'Generating...' : 'Generate AI Schedule'}</span>
          </button>

          {aiOptimization && (
            <button
              onClick={syncToCalendar}
              disabled={isGeneratingSchedule || connectedProviders.length === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title={connectedProviders.length === 0 ? 'Connect to Google Calendar first' : 'Sync tasks to Google Calendar'}
            >
              {isGeneratingSchedule ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Calendar className="w-5 h-5" />
              )}
              <span>{isGeneratingSchedule ? 'Syncing...' : 'Sync to Calendar'}</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('tasks')}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-white transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700"
          >
            {activeTab === 'tasks' && (
              <TaskManager
                tasks={tasks}
                onAddTask={addTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarConnections
                connectedProviders={connectedProviders}
                onConnect={handleCalendarConnect}
                onDisconnect={handleCalendarDisconnect}
                calendarManager={calendarManager}
              />
            )}

            {activeTab === 'ai' && (
              <AISchedulePreview
                optimization={aiOptimization}
                onSyncToCalendar={syncToCalendar}
                onRegenerateSchedule={generateAISchedule}
                isGenerating={isGeneratingSchedule}
              />
            )}

            {activeTab === 'settings' && (
              <SchedulingPreferences
                preferences={preferences}
                onUpdatePreferences={updatePreferences}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Help Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm p-8 rounded-xl border border-blue-500/30">
            <h3 className="text-2xl font-bold mb-4">How ScheduleX Works</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">1. Add Your Tasks</h4>
                  <p className="text-gray-400 text-sm">
                    Create tasks with duration, priority, deadlines, and descriptions. 
                    The more details you provide, the better AI can schedule them.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Connect Calendars</h4>
                  <p className="text-gray-400 text-sm">
                    Link your Google Calendar to see existing events and 
                    find available time slots for your tasks.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Let AI Optimize</h4>
                  <p className="text-gray-400 text-sm">
                    Our AI analyzes your tasks, preferences, and calendar to create 
                    an optimized schedule that maximizes productivity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ScheduleX;
