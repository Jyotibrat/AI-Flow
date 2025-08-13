// Task Manager Component for ScheduleX

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Flag, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Circle,
  AlertTriangle,
  Filter
} from 'lucide-react';
import { Task } from '../../types/calendar';
import { format } from 'date-fns';

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

interface TaskFormData {
  title: string;
  description: string;
  duration: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline: string;
  category: string;
  location: string;
  estimatedEffort: 'easy' | 'medium' | 'hard';
}

const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'urgent' | 'high' | 'medium' | 'low'>('all');
  
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    duration: 60,
    priority: 'medium',
    deadline: '',
    category: '',
    location: '',
    estimatedEffort: 'medium'
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: 60,
      priority: 'medium',
      deadline: '',
      category: '',
      location: '',
      estimatedEffort: 'medium'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title,
      description: formData.description,
      duration: formData.duration,
      priority: formData.priority,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      category: formData.category || undefined,
      location: formData.location || undefined,
      estimatedEffort: formData.estimatedEffort,
      isCompleted: false,
      tags: [],
      dependencies: [],
      reminders: [15, 30]
    };

    if (editingTask) {
      onUpdateTask(editingTask, newTask);
      setEditingTask(null);
    } else {
      onAddTask(newTask);
    }

    resetForm();
    setIsAddingTask(false);
  };

  const handleEdit = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
      duration: task.duration,
      priority: task.priority,
      deadline: task.deadline ? format(task.deadline, 'yyyy-MM-dd\'T\'HH:mm') : '',
      category: task.category || '',
      location: task.location || '',
      estimatedEffort: task.estimatedEffort || 'medium'
    });
    setEditingTask(task.id);
    setIsAddingTask(true);
  };

  const handleCancel = () => {
    setIsAddingTask(false);
    setEditingTask(null);
    resetForm();
  };

  const toggleTaskCompletion = (taskId: string, isCompleted: boolean) => {
    onUpdateTask(taskId, { isCompleted: !isCompleted });
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <Flag className="w-4 h-4" />;
      default: return <Flag className="w-4 h-4" />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending' && task.isCompleted) return false;
    if (filter === 'completed' && !task.isCompleted) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    return true;
  });

  const pendingTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="mb-2 text-3xl font-bold text-white">Task Manager</h2>
          <p className="text-gray-400">
            {pendingTasks.length} pending, {completedTasks.length} completed
          </p>
        </div>
        
        <button
          onClick={() => setIsAddingTask(true)}
          className="flex items-center px-6 py-3 space-x-2 font-semibold text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="w-5 h-5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Status:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-1 text-sm text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-1 text-sm text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Add/Edit Task Form */}
      <AnimatePresence>
        {isAddingTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 border border-gray-600 rounded-lg bg-gray-900/50"
          >
            <h3 className="mb-4 text-xl font-semibold text-white">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Work, Personal"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the task..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                    min="15"
                    max="480"
                    className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Effort Level
                  </label>
                  <select
                    value={formData.estimatedEffort}
                    onChange={(e) => setFormData({ ...formData, estimatedEffort: e.target.value as any })}
                    className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 text-white placeholder-gray-400 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional location"
                  />
                </div>
              </div>

              <div className="flex pt-4 space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 font-semibold text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 font-semibold text-white transition-all duration-300 bg-gray-600 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full">
              <CheckCircle className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-400">No tasks found</h3>
            <p className="text-gray-500">
              {tasks.length === 0 
                ? "Add your first task to get started with AI scheduling"
                : "Try adjusting your filters or add more tasks"
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gray-900/50 p-6 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-300 ${
                  task.isCompleted ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1 space-x-4">
                    <button
                      onClick={() => toggleTaskCompletion(task.id, task.isCompleted)}
                      className={`mt-1 transition-colors duration-200 ${
                        task.isCompleted
                          ? 'text-green-500 hover:text-green-400'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {task.isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center mb-2 space-x-3">
                        <h3 className={`text-lg font-semibold ${
                          task.isCompleted ? 'line-through text-gray-500' : 'text-white'
                        }`}>
                          {task.title}
                        </h3>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                          getPriorityColor(task.priority)
                        }`}>
                          {getPriorityIcon(task.priority)}
                          <span className="capitalize">{task.priority}</span>
                        </span>

                        {task.category && (
                          <span className="px-2 py-1 text-xs text-blue-400 rounded-full bg-blue-500/20">
                            {task.category}
                          </span>
                        )}
                      </div>
                      
                      {task.description && (
                        <p className="mb-3 text-gray-400">{task.description}</p>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{task.duration} min</span>
                        </div>
                        
                        {task.deadline && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {format(task.deadline, 'MMM dd, yyyy')}</span>
                          </div>
                        )}
                        
                        {task.location && (
                          <div className="flex items-center space-x-1">
                            <span>📍 {task.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center ml-4 space-x-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 text-gray-400 transition-all duration-200 rounded-lg hover:text-blue-400 hover:bg-blue-500/20"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-2 text-gray-400 transition-all duration-200 rounded-lg hover:text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
