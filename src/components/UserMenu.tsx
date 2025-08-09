import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
  <div className="relative">
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
        <User className="w-4 h-4 text-white" />
      </div>
      <span className="hidden md:block text-sm text-gray-800 dark:text-gray-300">
        {user.email?.split('@')[0]}
      </span>
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-50"
        >
          <div className="p-3 border-b border-gray-300 dark:border-gray-700">
            <p className="text-sm text-gray-800 dark:text-gray-300">{user.email}</p>
          </div>
          <div className="p-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-red-500 dark:text-red-400"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

};

export default UserMenu;