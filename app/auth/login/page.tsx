"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl mb-4">Log In</h1>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <label className="block mb-3">
          <span className="block text-sm">Email</span>
          <input type="email" className="mt-1 block w-full border rounded p-2"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="block mb-4">
          <span className="block text-sm">Password</span>
          <input type="password" className="mt-1 block w-full border rounded p-2"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" disabled={loading}
          className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
          {loading ? "Logging in…" : "Log In"}
        </button>
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <a href="/auth/signup" className="text-blue-600 hover:underline">Sign Up</a>
        </p>
      </form>
    </div>
  );
}
