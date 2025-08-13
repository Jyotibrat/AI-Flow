// Quick Stats Component for ScheduleX

import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Target,
  Brain
} from 'lucide-react';
import { format } from 'date-fns';

interface QuickStatsProps {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  urgentTasks: number;
  connectedCalendars: number;
  lastScheduleGenerated: Date | null;
}

const QuickStats: React.FC<QuickStatsProps> = ({
  totalTasks,
  pendingTasks,
  completedTasks,
  urgentTasks,
  connectedCalendars,
  lastScheduleGenerated
}) => {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400'
    },
    {
      label: 'Pending',
      value: pendingTasks,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-400'
    },
    {
      label: 'Completed',
      value: `${completedTasks} (${completionRate}%)`,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400'
    },
    {
      label: 'Urgent',
      value: urgentTasks,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/20',
      textColor: 'text-red-400'
    },
    {
      label: 'Connected Calendars',
      value: connectedCalendars,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400'
    },
    {
      label: 'Last AI Schedule',
      value: lastScheduleGenerated 
        ? format(lastScheduleGenerated, 'MMM dd, HH:mm')
        : 'Never',
      icon: Brain,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-500/20',
      textColor: 'text-indigo-400'
    }
  ];

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
            </div>
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color}`} />
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
            <p className="text-lg font-bold text-white">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default QuickStats;
