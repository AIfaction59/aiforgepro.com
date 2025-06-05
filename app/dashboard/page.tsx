// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import supabase from "@/lib/supabase";
import Link from "next/link";

export default async function DashboardPage() {
  // fetch the current session on the server
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();

  // if not logged in, send them to /auth/login
  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Dashboard</h2>
      <p className="mb-6">You’re logged in as {session.user.email}</p>

      {/* “Generate Image” button */}
      <Link
        href="/generate"
        className="inline-block px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Generate Image
      </Link>
    </div>
  );
}
