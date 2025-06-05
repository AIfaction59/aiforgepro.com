// lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";
// If you have a `database.types.ts`, you can import it:
// import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseServer = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);