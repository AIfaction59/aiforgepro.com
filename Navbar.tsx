// Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "./supabase";

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
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <Link href="/">
          <a className="text-xl font-bold">AiForgePro</a>
        </Link>

        {session && (
          <>
            <Link href="/generate">
              <a className="hover:underline">Generate</a>
            </Link>
            <Link href="/library">
              <a className="hover:underline">Library</a>
            </Link>
            <Link href="/pricing">
              <a className="hover:underline">Buy Credits</a>
            </Link>
          </>
        )}
      </div>

      <div className="space-x-4">
        {!session ? (
          <>
            <Link href="/auth/login">
              <a className="text-blue-600 hover:underline">Log In</a>
            </Link>
            <Link href="/auth/signup">
              <a className="text-green-600 hover:underline">Sign Up</a>
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
