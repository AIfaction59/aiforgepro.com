// app/layout.tsx
"use client";

import React, { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import Navbar from "../Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Initialize Supabase client once per session
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <SessionContextProvider supabaseClient={supabaseClient}>
          <Navbar />
          {children}
        </SessionContextProvider>
      </body>
    </html>
  );
}
