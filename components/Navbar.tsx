"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/lib/supabase/browser";

export default function Navbar() {
  const [session, setSession] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const router = useRouter();

  // Get session on load + subscribe to auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setCredits(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Fetch credits when logged in
  useEffect(() => {
    if (!session) return;

    fetch("/api/credits/balance")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCredits(data.credits ?? 0);
      })
      .catch((err) => {
        console.error("Failed to fetch credits:", err);
        setCredits(0);
      });
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <Link href="/dashboard" className="font-bold text-lg">
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
            <span className="text-gray-700">{session.user.email}</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">
              Credits: {credits === null ? <em>Loading…</em> : credits}
            </span>
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
