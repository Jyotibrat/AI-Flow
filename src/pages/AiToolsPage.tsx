import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const AiToolsPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }

        if (session?.user) {
          console.log('User logged in via Google:', session.user);
          navigate('/dashboard'); // ✅ redirect after success
        } else {
          navigate('/'); // ✅ fallback redirect
        }
      } catch (err) {
        console.error('Session check failed:', err);
        setError("Authentication failed. Please try again.");
        navigate('/');
      } finally {
        setLocalLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

return (
  <div className="min-h-screen flex items-center justify-center text-gray-900 dark:text-white bg-white dark:bg-gray-900 transition-colors duration-300">
    {(authLoading || localLoading) ? (
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
    ) : error ? (
      <div className="text-red-600 dark:text-red-400">{error}</div>
    ) : (
      <div>Authenticating with Google...</div>
    )}
  </div>
);

};

export default AiToolsPage;
