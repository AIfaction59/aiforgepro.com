// lib/supabase/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies }                   from "next/headers";

export function supabaseRoute() {
  return createRouteHandlerClient({ cookies });
}
