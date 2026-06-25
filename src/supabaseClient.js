import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://jihrqijhyahsbbmpkxpd.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_FmicO8SfyqJP4lvKr9xdhg_s6dq9Wi8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
