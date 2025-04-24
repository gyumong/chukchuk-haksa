import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/config/env';

export function createClient() {
  return createBrowserClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
}
