// Simplified AI Scheduling Service for ScheduleX Integration
// This version respects user-selected deadline times exactly

import { 
  Task, 
  SchedulingPreferences, 
  AISchedulingSuggestion, 
  ScheduleOptimization,
  CalendarEvent 
} from '../types/calendar';
import { addMinutes, format } from 'date-fns';

class AISchedulingService {
  constructor() {
    // Simple service doesn't need external API
  }

  // Main method to generate schedule suggestions using user-selected times
  async generateScheduleSuggestions(
    tasks: Task[],
    _existingEvents: CalendarEvent[], // Prefixed with _ to indicate intentionally unused
    _preferences: SchedulingPreferences, // Not used in simple version
    _dateRange: { start: Date; end: Date } // Not used in simple version
  ): Promise<ScheduleOptimization> {
    try {
      console.log('🚀 Generating simple schedule from user-selected times');
      
      const suggestions: AISchedulingSuggestion[] = [];

      for (const task of tasks) {
        if (!task.deadline) {
          console.log(`⚠️ Skipping task "${task.title}" - no deadline time specified`);
          continue;
        }

        // Use the exact deadline time as the scheduling time
        const scheduledStart = new Date(task.deadline);
        const scheduledEnd = addMinutes(scheduledStart, task.duration);

        console.log(`📅 Scheduling "${task.title}" at user-selected time: ${format(scheduledStart, 'MMM do, yyyy HH:mm')} - ${format(scheduledEnd, 'HH:mm')}`);

        const suggestion: AISchedulingSuggestion = {
          id: `suggestion-${task.id}-${Date.now()}`,
          task,
          suggestedSlot: {
            start: scheduledStart,
            end: scheduledEnd,
            available: true
          },
          confidence: 1.0, // 100% confidence since it's user's choice
          reasoning: `Scheduled at your selected time: ${format(scheduledStart, 'MMM do, yyyy')} at ${format(scheduledStart, 'HH:mm')}. This respects your preferred timing for completing "${task.title}".`,
          alternatives: [], // No alternatives needed
          considerations: [
            'Scheduled at user-specified time',
            `Duration: ${task.duration} minutes`,
            `Priority: ${task.priority}`
          ]
        };

        suggestions.push(suggestion);
      }

      console.log(`✅ Created ${suggestions.length} simple schedule suggestions`);

      // Count scheduled and unscheduled tasks
      const scheduledTasks = suggestions.length;
      const unscheduledTasks = tasks.filter(task => !task.deadline);

      // Create optimization result
      const optimization: ScheduleOptimization = {
        totalTasks: tasks.length,
        scheduledTasks,
        unscheduledTasks,
        suggestions,
        workloadBalance: [], // Not calculated in simple version
        conflicts: [] // No conflict detection in simple version
      };

      return optimization;
    } catch (error) {
      console.error('Error generating schedule suggestions:', error);
      throw error;
    }
  }

  // Simple analysis method (not used in the simplified version)
  async analyzeTasks(tasks: Task[]): Promise<Array<Task & { analysis: any }>> {
    // Return tasks with basic analysis
    return tasks.map(task => ({
      ...task,
      analysis: {
        complexity: 'medium',
        focus_level_required: 'medium',
        optimal_time_of_day: 'any'
      }
    }));
  }
}

export default AISchedulingService;
