// components/SyncProfile.tsx
"use client";

import { useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function SyncProfile() {
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { error } = await supabase
        .from("profiles")
        .upsert(
          { id: session.user.id, email: session.user.email },
          { onConflict: "id" }
        );
      if (error) console.error("Profile upsert error:", error);
    })();
  }, [session, supabase]);

  return null;
}
