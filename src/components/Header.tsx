import React, { useState } from "react";
import { motion } from "framer-motion";
import { Code, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";

// Create a motion-wrapped Link component
const MotionLink = motion(Link);

const Header: React.FC = () => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
  <>
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-40 bg-white/85 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80 shadow-sm shadow-black/5"
    >
      <div className="container mx-auto px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - adjusted for sidebar space */}
          <div className="flex items-center">
            <div className="w-20 lg:w-0"></div> {/* Spacer for sidebar */}
            <MotionLink
              to="/"
              whileHover={{ scale: 1.05 }}
              className="group flex items-center space-x-3 premium-link"
            >
              <div className="relative transition-transform duration-300 group-hover:rotate-3">
                <Code className="w-8 h-8 text-blue-500 drop-shadow-sm" />
                <Sparkles className="w-4 h-4 text-purple-400 absolute -top-1 -right-1 transition-transform duration-300 group-hover:scale-125" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                AI Flow
              </h1>
            </MotionLink>
          </div>

          {/* Right side elements with proper alignment and spacing */}
          <div className="flex items-center space-x-3 pr-16">
            {user ? (
              <UserMenu />
            ) : (
              <motion.button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 text-sm font-medium rounded-full flex-shrink-0 premium-button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            )}
            <div className="hidden sm:flex items-center px-3 py-2 bg-gray-100/90 dark:bg-gray-800/80 rounded-full text-sm flex-shrink-0 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 shadow-[0_0_12px_rgba(34,197,94,0.9)]"></div>
              <span className="ml-2 text-gray-700 dark:text-gray-300 whitespace-nowrap text-sm">
                8 AI Tools Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
    />
  </>
);

};

export default Header;
