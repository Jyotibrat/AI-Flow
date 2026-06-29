import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const createMockSupabase = () => {
  console.warn(
    'Supabase is not configured or using default placeholders. Authentication features will be simulated/disabled.'
  );
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      signUp: async () => ({ data: { user: null }, error: new Error('Supabase is not configured') }),
      signInWithPassword: async () => ({ data: { user: null }, error: new Error('Supabase is not configured') }),
      signInWithOAuth: async () => ({ data: {}, error: new Error('Supabase is not configured') }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      insert: async () => ({ data: null, error: null }),
      select: () => ({
        eq: () => ({ data: null, error: null }),
      }),
    }),
  } as any;
};

export const supabase =
  supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl) && !supabaseUrl.includes('your_supabase')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMockSupabase();