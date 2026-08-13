import {
  AuthError,
  AuthTokenResponsePassword,
  createClient,
  OAuthResponse,
  SupabaseClient,
  UserResponse,
} from "@supabase/supabase-js";
import type { Database } from "../types/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

let supabase: SupabaseClient<Database>;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is not set. Supabase client was not initialized.\n" +
      "Set these in app/.env.local (Vite) or export env variables, then restart the dev server.\n" +
      "Example:\n  VITE_SUPABASE_URL=https://your-project-ref.supabase.co\n  VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...your_key",
  );

  // 앱이 크래시되지 않도록 최소한의 가짜(Dummy) 객체 연결
  supabase = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: new Error("Supabase not configured") }),
      signInWithOAuth: async () => ({ data: null, error: new Error("Supabase not configured") }),
      signOut: async () => ({ data: null, error: new Error("Supabase not configured") }),
      onAuthStateChange: () => ({ data: null, error: new Error("Supabase not configured") }),
    },
    from: () => ({
      select: async () => ({ data: null, error: new Error("Supabase not configured") }),
      insert: async () => ({ data: null, error: new Error("Supabase not configured") }),
      update: async () => ({ data: null, error: new Error("Supabase not configured") }),
      delete: async () => ({ data: null, error: new Error("Supabase not configured") }),
    }),
  } as unknown as SupabaseClient<Database>;
} else {
  supabase = createClient<Database>(supabaseUrl, supabaseKey);
}

export { supabase };
export type { Database };
