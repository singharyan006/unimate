import { createBrowserClient } from '@supabase/ssr'

export const createClient = (token?: string | null) => {
  const options = token
    ? { global: { headers: { Authorization: `Bearer ${token}` } } }
    : {};

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    options
  );
};
