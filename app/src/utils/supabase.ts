import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

let supabase: any;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase 환경변수가 설정되지 않아 임시 모드로 동작합니다.");

  // 앱이 크래시되지 않도록 최소한의 가짜(Dummy) 객체 연결
  supabase = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: new Error("Supabase 미설정") }),
      signInWithOAuth: async () => ({ data: null, error: new Error("Supabase 미설정") }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: async () => ({ data: [], error: null }),
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null }),
    }),
  };
} else {
  supabase = createClient<Database>(supabaseUrl, supabaseKey);
}

export { supabase };
export type { Database };
