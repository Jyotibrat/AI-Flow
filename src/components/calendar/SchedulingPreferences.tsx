// Scheduling Preferences Component for ScheduleX

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Settings, 
  Save, 
  RotateCcw,
  Sun,
  Moon,
  Coffee,
  Zap
} from 'lucide-react';
import { SchedulingPreferences as ISchedulingPreferences } from '../../types/calendar';

interface SchedulingPreferencesProps {
  preferences: ISchedulingPreferences;
  onUpdatePreferences: (preferences: ISchedulingPreferences) => void;
}

const SchedulingPreferences: React.FC<SchedulingPreferencesProps> = ({
  preferences,
  onUpdatePreferences
}) => {
  const [formData, setFormData] = useState<ISchedulingPreferences>(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const updateFormData = (updates: Partial<ISchedulingPreferences>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    setHasChanges(JSON.stringify(newData) !== JSON.stringify(preferences));
  };

  const handleSave = () => {
    onUpdatePreferences(formData);
    setHasChanges(false);
  };

  const handleReset = () => {
    setFormData(preferences);
    setHasChanges(false);
  };

  const toggleWorkingDay = (day: number) => {
    const workingDays = formData.workingDays.includes(day)
      ? formData.workingDays.filter(d => d !== day)
      : [...formData.workingDays, day].sort();
    updateFormData({ workingDays });
  };

  const addFocusBlock = () => {
    const newBlock = {
      start: '09:00',
      end: '11:00',
      days: [1, 2, 3, 4, 5]
    };
    updateFormData({
      focusTimeBlocks: [...(formData.focusTimeBlocks || []), newBlock]
    });
  };

  const updateFocusBlock = (index: number, updates: any) => {
    const blocks = [...(formData.focusTimeBlocks || [])];
    blocks[index] = { ...blocks[index], ...updates };
    updateFormData({ focusTimeBlocks: blocks });
  };

  const removeFocusBlock = (index: number) => {
    const blocks = [...(formData.focusTimeBlocks || [])];
    blocks.splice(index, 1);
    updateFormData({ focusTimeBlocks: blocks });
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Scheduling Preferences</h2>
          <p className="text-gray-400">
            Configure your work schedule and preferences to help AI create better schedules
          </p>
        </div>
        
        {hasChanges && (
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-white transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Working Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/50 p-6 rounded-xl border border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Working Hours</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Start Time
                </label>
                <div className="relative">
                  <Sun className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="time"
                    value={formData.workingHours.start}
                    onChange={(e) => updateFormData({
                      workingHours: { ...formData.workingHours, start: e.target.value }
                    })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  End Time
                </label>
                <div className="relative">
                  <Moon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="time"
                    value={formData.workingHours.end}
                    onChange={(e) => updateFormData({
                      workingHours: { ...formData.workingHours, end: e.target.value }
                    })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">
                Working Days
              </label>
              <div className="grid grid-cols-7 gap-2">
                {dayNames.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => toggleWorkingDay(index)}
                    className={`p-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                      formData.workingDays.includes(index)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Task Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 p-6 rounded-xl border border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Task Preferences</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Buffer Time Between Tasks (minutes)
              </label>
              <input
                type="number"
                value={formData.bufferTime}
                onChange={(e) => updateFormData({ bufferTime: parseInt(e.target.value) || 0 })}
                min="0"
                max="60"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Preferred Task Length (minutes)
              </label>
              <input
                type="number"
                value={formData.preferredTaskLength}
                onChange={(e) => updateFormData({ preferredTaskLength: parseInt(e.target.value) || 60 })}
                min="15"
                max="480"
                step="15"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Break Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.breakDuration}
                onChange={(e) => updateFormData({ breakDuration: parseInt(e.target.value) || 15 })}
                min="5"
                max="60"
                step="5"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Timezone
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => updateFormData({ timezone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London Time</option>
                <option value="Europe/Paris">Central European Time</option>
                <option value="Asia/Tokyo">Tokyo Time</option>
                <option value="Australia/Sydney">Sydney Time</option>
                <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                  {Intl.DateTimeFormat().resolvedOptions().timeZone} (Auto)
                </option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Focus Time Blocks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900/50 p-6 rounded-xl border border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Focus Time Blocks</h3>
              <p className="text-gray-400 text-sm">Define periods for high-concentration tasks</p>
            </div>
          </div>
          <button
            onClick={addFocusBlock}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-white transition-all duration-300"
          >
            Add Block
          </button>
        </div>

        <div className="space-y-4">
          {formData.focusTimeBlocks?.map((block, index) => (
            <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={block.start}
                    onChange={(e) => updateFocusBlock(index, { start: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={block.end}
                    onChange={(e) => updateFocusBlock(index, { end: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <button
                    onClick={() => removeFocusBlock(index)}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white transition-all duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Days
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {dayNames.map((day, dayIndex) => (
                    <button
                      key={dayIndex}
                      onClick={() => {
                        const days = block.days.includes(dayIndex)
                          ? block.days.filter(d => d !== dayIndex)
                          : [...block.days, dayIndex].sort();
                        updateFocusBlock(index, { days });
                      }}
                      className={`p-2 rounded-lg font-medium text-xs transition-all duration-300 ${
                        block.days.includes(dayIndex)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          {(!formData.focusTimeBlocks || formData.focusTimeBlocks.length === 0) && (
            <div className="text-center py-8">
              <Coffee className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No focus time blocks defined</p>
              <p className="text-gray-500 text-sm">Add blocks to prioritize high-concentration tasks during these times</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-xl"
      >
        <h4 className="text-blue-400 font-semibold mb-3">Optimization Tips</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-300/80">
          <div>
            <p className="mb-2">• <strong>Buffer Time:</strong> Allows for transitions and unexpected delays</p>
            <p className="mb-2">• <strong>Focus Blocks:</strong> AI will prioritize complex tasks during these periods</p>
          </div>
          <div>
            <p className="mb-2">• <strong>Working Days:</strong> Only selected days will be used for scheduling</p>
            <p>• <strong>Preferred Length:</strong> AI tries to batch tasks into this duration when possible</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SchedulingPreferences;
