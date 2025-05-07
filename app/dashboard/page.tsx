import { redirect } from "next/navigation";
import { supabaseServer } from "../../supabaseServer";

export default async function DashboardPage() {
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Dashboard</h2>
      <p>You’re logged in as {session.user.email}</p>
    </div>
  );
}
