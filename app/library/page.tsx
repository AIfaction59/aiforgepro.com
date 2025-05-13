// app/library/page.tsx
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";

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
          <Link
            href="/generate"
            className="underline text-blue-600 hover:text-blue-800"
          >
            Generate one now
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="border rounded overflow-hidden bg-gray-50"
            >
              <Image
                src={img.image_url}
                alt={`Generated at ${new Date(
                  img.created_at
                ).toLocaleString()}`}
                width={300}
                height={300}
                className="object-cover w-full h-48"
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-between">
        {page > 1 && (
          <Link
            href={`/library?page=${page - 1}`}
            className="underline hover:text-gray-700"
          >
            ← Previous
          </Link>
        )}
        {images.length === pageSize && (
          <Link
            href={`/library?page=${page + 1}`}
            className="underline hover:text-gray-700"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
