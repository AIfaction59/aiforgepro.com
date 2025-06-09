// app/layout.tsx
"use client";

import React, { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import Navbar from "../components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Initialize Supabase client once per session
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <SessionContextProvider supabaseClient={supabaseClient}>
          <Navbar />
          <main className="flex-grow flex items-center justify-center px-4">
            {children}
          </main>
        </SessionContextProvider>
      </body>
    </html>
  );
}
