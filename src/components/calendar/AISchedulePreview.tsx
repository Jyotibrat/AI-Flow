// AI Schedule Preview Component for ScheduleX

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Eye,
  Edit,
  Target,
  BarChart3
} from 'lucide-react';
import { ScheduleOptimization, AISchedulingSuggestion } from '../../types/calendar';
import { format, parseISO } from 'date-fns';

interface AISchedulePreviewProps {
  optimization: ScheduleOptimization | null;
  onSyncToCalendar: () => void;
  onRegenerateSchedule: () => void;
  isGenerating: boolean;
}

const AISchedulePreview: React.FC<AISchedulePreviewProps> = ({
  optimization,
  onSyncToCalendar,
  onRegenerateSchedule,
  isGenerating
}) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISchedulingSuggestion | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'analytics'>('list');

  if (!optimization && !isGenerating) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No Schedule Generated</h3>
        <p className="text-gray-500 mb-6">
          Add some tasks and connect a calendar to generate your AI-powered schedule
        </p>
        <button
          onClick={onRegenerateSchedule}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        >
          Generate Schedule
        </button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <RefreshCw className="w-8 h-8 text-white animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Generating AI Schedule...</h3>
        <p className="text-gray-400">
          Analyzing your tasks and finding optimal time slots
        </p>
      </div>
    );
  }

  if (!optimization) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-500 bg-green-500/20';
    if (confidence >= 0.6) return 'text-yellow-500 bg-yellow-500/20';
    return 'text-red-500 bg-red-500/20';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20';
      case 'low': return 'text-green-500 bg-green-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'light': return 'text-green-500 bg-green-500/20';
      case 'moderate': return 'text-yellow-500 bg-yellow-500/20';
      case 'heavy': return 'text-orange-500 bg-orange-500/20';
      case 'overloaded': return 'text-red-500 bg-red-500/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">AI Schedule Preview</h2>
          <p className="text-gray-400">
            {optimization.scheduledTasks} of {optimization.totalTasks} tasks scheduled
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Sync Summary */}
          {optimization.scheduledTasks > 0 && (
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-300 font-medium">
                  Ready to sync {optimization.scheduledTasks} task{optimization.scheduledTasks > 1 ? 's' : ''} to Google Calendar
                </span>
              </div>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={onRegenerateSchedule}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-white transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Regenerate</span>
            </button>
            
            {optimization.scheduledTasks > 0 && (
              <button
                onClick={onSyncToCalendar}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Sync scheduled tasks to Google Calendar"
              >
                {isGenerating ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Calendar className="w-5 h-5" />
                )}
                <span>{isGenerating ? 'Syncing...' : 'Sync to Calendar'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex space-x-2">
        {[
          { id: 'list', label: 'Task List', icon: CheckCircle },
          { id: 'timeline', label: 'Timeline', icon: Clock },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              viewMode === mode.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <mode.icon className="w-4 h-4" />
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-400">Scheduled</span>
          </div>
          <p className="text-2xl font-bold text-white">{optimization.scheduledTasks}</p>
          <p className="text-xs text-gray-500">
            {Math.round((optimization.scheduledTasks / optimization.totalTasks) * 100)}% success rate
          </p>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-400">Conflicts</span>
          </div>
          <p className="text-2xl font-bold text-white">{optimization.conflicts.length}</p>
          <p className="text-xs text-gray-500">Scheduling issues</p>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-400">Avg Confidence</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {Math.round((optimization.suggestions.reduce((acc, s) => acc + s.confidence, 0) / optimization.suggestions.length) * 100)}%
          </p>
          <p className="text-xs text-gray-500">AI certainty</p>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-400">Total Time</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {Math.round(optimization.suggestions.reduce((acc, s) => acc + s.task.duration, 0) / 60)}h
          </p>
          <p className="text-xs text-gray-500">Scheduled hours</p>
        </div>
      </div>

      {/* Content based on view mode */}
      <AnimatePresence mode="wait">
        {viewMode === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Scheduled Tasks */}
            {optimization.suggestions.filter(s => s.confidence > 0.3).length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Scheduled Tasks</h3>
                <div className="space-y-3">
                  {optimization.suggestions
                    .filter(s => s.confidence > 0.3)
                    .map((suggestion, index) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedSuggestion(suggestion)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-white">{suggestion.task.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(suggestion.task.priority)}`}>
                                {suggestion.task.priority}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                                {Math.round(suggestion.confidence * 100)}% confident
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{format(suggestion.suggestedSlot.start, 'MMM dd, yyyy')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {format(suggestion.suggestedSlot.start, 'HH:mm')} - {format(suggestion.suggestedSlot.end, 'HH:mm')}
                                </span>
                              </div>
                              <span>{suggestion.task.duration} min</span>
                            </div>
                            
                            <p className="text-gray-300 text-sm">{suggestion.reasoning}</p>
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSuggestion(suggestion);
                              }}
                              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle edit suggestion
                              }}
                              className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-all duration-200"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            )}

            {/* Unscheduled Tasks */}
            {optimization.unscheduledTasks.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Unscheduled Tasks ({optimization.unscheduledTasks.length})
                </h3>
                <div className="space-y-3">
                  {optimization.unscheduledTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-red-500/10 p-4 rounded-lg border border-red-500/30"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">{task.title}</h4>
                          <p className="text-red-400 text-sm">
                            Could not find suitable time slot - consider adjusting deadline or duration
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {viewMode === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Workload Balance */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Workload Balance</h3>
              <div className="grid gap-3">
                {optimization.workloadBalance.map((day, index) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-900/50 p-4 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-medium">
                          {format(parseISO(day.date), 'EEEE, MMM dd')}
                        </span>
                        <p className="text-gray-400 text-sm">
                          {day.taskCount} tasks • {day.hours.toFixed(1)} hours
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getIntensityColor(day.intensity)}`}>
                        {day.intensity}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Conflicts */}
            {optimization.conflicts.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Scheduling Conflicts</h3>
                <div className="space-y-3">
                  {optimization.conflicts.map((conflict, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/30"
                    >
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div>
                          <h4 className="text-white font-medium mb-1">{conflict.type.replace('_', ' ').toUpperCase()}</h4>
                          <p className="text-orange-300 text-sm">{conflict.description}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            conflict.severity === 'high' 
                              ? 'text-red-400 bg-red-500/20' 
                              : conflict.severity === 'medium'
                              ? 'text-orange-400 bg-orange-500/20'
                              : 'text-yellow-400 bg-yellow-500/20'
                          }`}>
                            {conflict.severity} severity
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedSuggestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedSuggestion(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4">{selectedSuggestion.task.title}</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Scheduled Time</h4>
                  <p className="text-gray-300">
                    {format(selectedSuggestion.suggestedSlot.start, 'EEEE, MMMM do, yyyy')}
                  </p>
                  <p className="text-gray-300">
                    {format(selectedSuggestion.suggestedSlot.start, 'h:mm a')} - {format(selectedSuggestion.suggestedSlot.end, 'h:mm a')}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">AI Reasoning</h4>
                  <p className="text-gray-300">{selectedSuggestion.reasoning}</p>
                </div>

                {selectedSuggestion.considerations.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Considerations</h4>
                    <ul className="space-y-1">
                      {selectedSuggestion.considerations.map((consideration, index) => (
                        <li key={index} className="text-gray-300 text-sm">• {consideration}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setSelectedSuggestion(null)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-white transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AISchedulePreview;
