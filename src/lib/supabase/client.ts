import { createBrowserClient } from '@supabase/ssr';
import { ENV } from '@/config/environment';
import type { Database } from '@/types/supabase';

export function createClient() {
  return createBrowserClient<Database>(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
}
