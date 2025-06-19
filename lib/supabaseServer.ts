// lib/supabaseServer.ts

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Export a function, not a singleton
export function createSupabaseServerClient() {
  return createRouteHandlerClient({ cookies });
}
