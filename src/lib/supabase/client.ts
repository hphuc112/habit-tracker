export const supabaseClient = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
};

export function getSupabaseClientConfig() {
  return supabaseClient;
}
