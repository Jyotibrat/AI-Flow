import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Examples from './pages/Examples';
import Contribute from './pages/Contribute';
import Community from './pages/Community';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import AITools from './pages/AITools';
import Chatbot from './components/Chatbot';
import { initGA, trackPageView } from './utils/analytics';
import { Toaster } from 'react-hot-toast';

// Create a separate component for analytics tracking
const AnalyticsTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Google Analytics
    initGA();

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <Router>
        <AnalyticsTracker />
        <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
          <AnimatePresence mode="wait">
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/examples" element={<Examples />} />
                <Route path="/contribute" element={<Contribute />} />
                <Route path="/community" element={<Community />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/ai-tools" element={
                  <ProtectedRoute>
                    <AITools />
                  </ProtectedRoute>
                } />
              </Routes>
            </Layout>
          </AnimatePresence>
          <Chatbot />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;