"use client";

export const dynamic = 'force-dynamic';
export const prerender = false;

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectedFrom") ?? "/dashboard";

  const supabase: SupabaseClient = createClientComponentClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace(redirectTo);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace(redirectTo);
    });
    return () => subscription.unsubscribe();
  }, [router, redirectTo, supabase.auth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else if (data.session) {
      router.replace(redirectTo);
    } else {
      setError("Login succeeded, but no session was found.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl mb-4">Log In</h1>
      {error && <p className="mb-4 text-red-500">❌ {error}</p>}

      <label className="block mb-3">
        <span className="block text-sm">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
        />
      </label>

      <label className="block mb-4">
        <span className="block text-sm">Password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        {loading ? "Logging in…" : "Log In"}
      </button>

      <p className="mt-4 text-center text-sm">
        Don’t have an account?{' '}
        <a href="/auth/signup" className="text-blue-600 hover:underline">Sign Up</a>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense fallback={<div>Loading login form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
