// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import Link from "next/link";

export default async function DashboardPage() {
  // 1) Try to fetch session on the server
  const {
    data: { session },
    error: sessionError,
  } = await supabaseServer.auth.getSession();

  if (sessionError || !session) {
    // if anything goes wrong, send them to login
    redirect("/auth/login");
  }

  // 2) At this point you know `session.user` is defined
  return (
    <div className="p-6">
      <h1 className="text-2xl">Welcome, {session.user.email}</h1>
      {/* …whatever else in your dashboard… */}
    </div>
  );
}
