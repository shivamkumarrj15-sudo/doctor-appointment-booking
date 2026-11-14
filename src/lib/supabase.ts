import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (err) {
    console.warn('[Supabase] Failed to initialize client:', err);
    client = null;
  }
} else {
  // Graceful notification in development / preview
  console.info(
    '[Supabase] Environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY are not configured yet. Analytics and feedback are running in local fallback mode. See ANALYTICS_SETUP.md for instructions.'
  );
}

export const supabase = client;
