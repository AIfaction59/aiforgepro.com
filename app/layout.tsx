// app/layout.tsx (client wrapper)
"use client";

import React, { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import SyncProfile from "../components/SyncProfile";
import Navbar from "../Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  return (
    <html lang="en">
      <body>
        <SessionContextProvider supabaseClient={supabaseClient}>
          <SyncProfile />
          <Navbar />
          {children}
        </SessionContextProvider>
      </body>
    </html>
  );
}
