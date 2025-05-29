"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { supabaseServer } from "@/lib/supabaseServer";
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/dashboard");
    });
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-3xl mb-6">Welcome to AiForgePro</h1>
      <div className="space-x-4">
        <a href="/auth/login" className="underline text-blue-600">Log In</a>
        <a href="/auth/signup" className="underline text-green-600">Sign Up</a>
      </div>
    </div>
  );
}
