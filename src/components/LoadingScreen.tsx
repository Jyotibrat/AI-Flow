import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
return (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50"
  >
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
      />
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
      >
        AI Flow
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-gray-600 dark:text-gray-400"
      >
        Initializing AI-powered tools...
      </motion.p>
    </div>
  </motion.div>
);
};

export default LoadingScreen;
