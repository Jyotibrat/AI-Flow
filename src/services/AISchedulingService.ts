// Simplified AI Scheduling Service for ScheduleX Integration
// This version respects user-selected deadline times exactly

import { 
  Task, 
  TimeSlot, 
  SchedulingPreferences, 
  AISchedulingSuggestion, 
  ScheduleOptimization,
  CalendarEvent 
} from '../types/calendar';
import { addMinutes, format } from 'date-fns';

class AISchedulingService {
  private readonly GEMINI_API_KEY: string;

  constructor() {
    this.GEMINI_API_KEY = import.meta.env.VITE_APP_GEMINI_API_KEY || '';
  }

  // Main method to generate schedule suggestions using user-selected times
  async generateScheduleSuggestions(
    tasks: Task[],
    existingEvents: CalendarEvent[],
    preferences: SchedulingPreferences,
    dateRange: { start: Date; end: Date }
  ): Promise<ScheduleOptimization> {
    try {
      const suggestions: AISchedulingSuggestion[] = [];

      for (const task of tasks) {
        if (!task.deadline) {
          continue;
        }

        // Use the exact deadline time as the scheduling time
        const scheduledStart = new Date(task.deadline);
        const scheduledEnd = addMinutes(scheduledStart, task.duration);

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

      // Create optimization result
      const optimization: ScheduleOptimization = {
        totalTasks: tasks.length,
        scheduledTasks: suggestions.length,
        unscheduledTasks: tasks.filter(task => !task.deadline),
        suggestions,
        workloadBalance: [],
        conflicts: []
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
