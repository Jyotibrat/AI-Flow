import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import { motion } from 'framer-motion';
import { Lock, Zap } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center px-6 bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Authentication Required
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Please sign in to access our AI Tools and unlock the full potential of our platform.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Zap className="w-5 h-5" />
            <span>Get Started</span>
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Join thousands of users already using our AI tools
          </p>
        </div>
      </div>
    </motion.div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;