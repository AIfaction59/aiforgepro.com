// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

export default function HomePage() {
  const router = useRouter();

  // If already logged in, send to /dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/dashboard");
    });
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to AiForgePro</h1>
      <p className="mb-6 text-lg">
        Generate AI images, store them in your private library, and purchase credits on demand.
      </p>
      <div className="space-x-4">
        <button
          onClick={() => router.push("/auth/login")}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Log In
        </button>
        <button
          onClick={() => router.push("/auth/signup")}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
