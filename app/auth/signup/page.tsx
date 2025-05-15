// app/auth/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

export default function SignUpPage() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // redirect users back here after they click the magic link:
        emailRedirectTo: window.location.origin + "/auth/verify",
      }
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setMessage(
        "🎉 Please check your inbox for a confirmation link before logging in."
      );
      // optional: automatically navigate them to a “check your email” page
      // router.push("/auth/verify");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow"
      >
        <h1 className="text-2xl mb-4">Sign Up</h1>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        {message && <p className="mb-4 text-green-600">{message}</p>}
        <label className="block mb-3">
          <span className="block text-sm">Email</span>
          <input
            type="email"
            className="mt-1 block w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block mb-4">
          <span className="block text-sm">Password</span>
          <input
            type="password"
            className="mt-1 block w-full border rounded p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          {loading ? "Signing up…" : "Sign Up"}
        </button>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/auth/login" className="text-green-600 hover:underline">
            Log In
          </a>
        </p>
      </form>
    </div>
  );
}
