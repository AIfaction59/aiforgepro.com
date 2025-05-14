// Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/lib/supabase/browser";

export default function Navbar() {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    // listen to changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-xl font-bold">
          AiForgePro
        </Link>

        {session && (
          <>
            <Link href="/generate" className="hover:underline">
              Generate
            </Link>
            <Link href="/library" className="hover:underline">
              Library
            </Link>
            <Link href="/pricing" className="hover:underline">
              Buy Credits
            </Link>
          </>
        )}
      </div>

      <div className="space-x-4">
        {!session ? (
          <>
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Log In
            </Link>
            <Link href="/auth/signup" className="text-green-600 hover:underline">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <span className="text-gray-700">{session.user.email}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
