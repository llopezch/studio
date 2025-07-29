import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const isValidSupabaseUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || !isValidSupabaseUrl(supabaseUrl)) {
    console.error("Supabase credentials are not configured correctly or the URL is invalid. Falling back to mock data.");
    return null;
  }

  return createSupabaseClient(supabaseUrl, supabaseKey)
}