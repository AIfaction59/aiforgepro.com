// app/layout.tsx
"use client";

import React, { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import Navbar from "../Navbar";
import SyncProfile from "../components/SyncProfile";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Initialize Supabase client once per session
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <SessionContextProvider supabaseClient={supabaseClient}>
          {/* this will upsert your profiles.id row on every login/signup */}
          <SyncProfile />
          <Navbar />
          {children}
        </SessionContextProvider>
      </body>
    </html>
  );
}
