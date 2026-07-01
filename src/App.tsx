import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Chatbot from './components/Chatbot';
import { initGA, trackPageView } from './utils/analytics';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Examples = lazy(() => import('./pages/Examples'));
const Contribute = lazy(() => import('./pages/Contribute'));
const Community = lazy(() => import('./pages/Community'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const AITools = lazy(() => import('./pages/AITools'));

const AnalyticsTracker: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
  return null;
};

function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AnalyticsTracker />
        <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
          <ScrollToTop />
          <AnimatePresence mode="wait">
            <Layout>
              <Suspense fallback={<LoadingScreen />}>
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
              </Suspense>
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