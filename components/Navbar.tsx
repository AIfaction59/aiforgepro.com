// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/lib/supabase/browser";

export default function Navbar() {
  const [session, setSession] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const router = useRouter();

  // 1) Track auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setCredits(null); // clear credits when session changes
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 2) When we have a session, fetch credits
  useEffect(() => {
    if (!session) return;
    fetch("/api/credits/balance")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        setCredits(payload.credits ?? 0);
      })
      .catch((err) => {
        console.error("Failed to load credits:", err);
        setCredits(0);
      });
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <Link href={session ? "/dashboard" : "/"} className="text-xl font-bold">
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

      <div className="flex items-center space-x-4">
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
            {/* show email */}
            <span className="text-gray-700">{session.user.email}</span>
            {/* show credits */}
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">
              Credits:{" "}
              {credits === null ? <em>Loading…</em> : credits}
            </span>
            {/* sign out */}
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
