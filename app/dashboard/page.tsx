// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

type Props = { };

export default async function DashboardPage(props: Props) {
  // Protect route on the server side
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();
  if (!session) {
    redirect("/auth/login");
  }

  // Fetch the user's current credit balance
  const { data: profile, error } = await supabaseServer
    .from("profiles")
    .select("credits")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    // You could show an error page or just default to 0
  }

  const credits = profile?.credits ?? 0;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {session.user.email}</h1>
      <p className="text-lg">
        You have <span className="font-semibold">{credits}</span> credits remaining.
      </p>
      <div className="mt-6 space-x-4">
        <button
          onClick={() => {}}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate an Image
        </button>
        <button
          onClick={() => {}}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Buy More Credits
        </button>
      </div>
    </div>
  );
}
