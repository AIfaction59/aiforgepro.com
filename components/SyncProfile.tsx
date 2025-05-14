// components/SyncProfile.tsx
"use client";

import { useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function SyncProfile() {
  const user = useUser();
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (!user) return;

    const upsertProfile = async () => {
      try {
        const { error } = await supabase
          .from("profiles")
          .upsert(
            {
              id: user.id,    // PK in your profiles table
              credits: 0      // default starting credits
            },
            { onConflict: "id" }
          );
        if (error) console.error("Failed to sync profile:", error);
      } catch (err) {
        console.error("Unexpected error syncing profile:", err);
      }
    };

    upsertProfile();
  }, [user, supabase]);

  return null;
}
