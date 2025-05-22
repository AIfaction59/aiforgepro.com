// app/library/page.tsx
"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LibraryPage() {
  const { data, error } = useSWR("/api/images", fetcher);

  if (error) return <p className="p-6">Error loading images: {error.error || error.message}</p>;
  if (!data) return <p className="p-6">Loading…</p>;
  if (!data.images.length) return <p className="p-6">No images yet.</p>;

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {data.images.map((img: any) => (
        <div key={img.id} className="border p-2 rounded flex flex-col">
          {img.url ? (
            <img src={img.url} alt="" className="w-full h-auto rounded" />
          ) : (
            <div className="flex items-center justify-center bg-gray-200 h-32">No preview</div>
          )}
          <p className="text-xs mt-1">{new Date(img.created_at).toLocaleString()}</p>
          {img.url && (
            <a
              href={img.url}
              download
              className="mt-auto text-center text-blue-600 hover:underline"
            >
              Download
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
