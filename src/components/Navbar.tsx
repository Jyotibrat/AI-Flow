import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Info, 
  FileText, 
  Users, 
  MessageCircle, 
  Mail, 
  BookOpen, 
  Brain,
  Calendar,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Home' }, // Home
  { path: '/about', icon: Info, label: 'About' }, // About
  { path: '/examples', icon: FileText, label: 'Examples' }, // Examples
  { path: '/ai-tools', icon: Brain, label: 'AI Tools' }, // AI Tools
  { path: '/schedule-x', icon: Calendar, label: 'ScheduleX' }, // ScheduleX
  { path: '/blog', icon: BookOpen, label: 'Blog' }, // Blog
  { path: '/community', icon: MessageCircle, label: 'Community' }, // Community
  { path: '/contribute', icon: Users, label: 'Contribute' }, // Contribute
  { path: '/contact', icon: Mail, label: 'Contact' }, // Contact
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-gray-800 rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Navbar */}
      <motion.nav
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex fixed left-0 top-16 bottom-16 w-20 bg-gray-900/95 backdrop-blur-md border-r border-gray-800 z-30"
      >
        <div className="flex flex-col justify-center items-center py-8 pl-4 space-y-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group relative p-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
      </motion.nav>

      {/* Mobile Navbar */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-gray-900/95 backdrop-blur-md border-r border-gray-800 z-40"
          >
            <div className="pt-20 px-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-3 rounded-lg mb-2 transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;