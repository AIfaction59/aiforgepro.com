'use client';

import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (!session) return;
    fetch('/api/credits/balance')
      .then((res) => res.json())
      .then((data) => setCredits(data.credits ?? 0))
      .catch(() => setCredits(0));
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth/login');
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <Link href="/dashboard" className="font-bold text-lg">
          AiForgePro
        </Link>
        {session && (
          <>
            <Link href="/generate" className="hover:underline">Generate</Link>
            <Link href="/library" className="hover:underline">Library</Link>
            <Link href="/pricing" className="hover:underline">Buy Credits</Link>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {!session ? (
          <>
            <Link href="/auth/login" className="text-blue-600 hover:underline">Log In</Link>
            <Link href="/auth/signup" className="text-green-600 hover:underline">Sign Up</Link>
          </>
        ) : (
          <>
            <span className="text-gray-700 text-sm">{session.user.email}</span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
              Credits: {credits ?? '…'}
            </span>
            <button onClick={handleLogout} className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
