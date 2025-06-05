// app/library/page.tsx
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";

type Props = { searchParams?: { page?: string } };

export default async function LibraryPage({ searchParams }: Props) {
  // Protect route
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();
  if (!session) redirect("/auth/login");

  // Pagination
  const page = parseInt(searchParams?.page || "1", 10);
  const pageSize = 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Fetch user’s images
  const { data: images = [], error } = await supabaseServer
    .from("images")
    .select("id, image_url, created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error loading images:", error);
    return <div className="p-6">Failed to load images.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Your Image Library</h1>

      {images.length === 0 ? (
        <p>
          No images yet.{" "}
          <Link href="/generate" className="underline text-blue-600">
            Generate one now
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="border rounded overflow-hidden">
              <img
                src={img.image_url}
                alt="User generated"
                className="w-full h-auto block"
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-between">
        {page > 1 && (
          <Link href={`/library?page=${page - 1}`} className="underline">
            ← Previous
          </Link>
        )}
        {images.length === pageSize && (
          <Link href={`/library?page=${page + 1}`} className="underline">
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
