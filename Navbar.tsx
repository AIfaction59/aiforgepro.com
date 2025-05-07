// Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "./supabase";
import Link from "next/link";

export default function Navbar() {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  // On mount, load the current session and subscribe to changes
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/"); // or "/auth/login"
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link href="/">
        <a className="text-xl font-bold">AiForgePro</a>
      </Link>

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
