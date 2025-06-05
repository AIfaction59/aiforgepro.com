// lib/supabaseServer.ts
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const supabaseServer = createRouteHandlerSupabaseClient({ cookies });
