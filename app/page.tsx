"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/browser";

export default function HomePage() {
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to AiForgePro</h1>
      <p className="mb-6 text-lg text-center max-w-xl">
        Generate stunning AI product images, save them to your private library,
        and manage your creative assets in one place.
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
