"use client";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });

export default function LibraryPage() {
  const { data, error } = useSWR("/api/images", fetcher);

  if (error) return <p className="p-6">Error loading images: {error.message}</p>;
  if (!data) return <p className="p-6">Loading…</p>;
  if (!data.images.length) return <p className="p-6">No images yet.</p>;

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {data.images.map((img: any) => (
        <div key={img.id} className="border p-2 rounded flex flex-col">
          <img src={img.url} alt="" className="w-full h-auto rounded" />
          <p className="text-xs mt-1">
            {new Date(img.created_at).toLocaleString()}
          </p>
          <a
            href={img.url}
            download
            className="mt-auto text-center text-blue-600 hover:underline"
          >
            Download
          </a>
        </div>
      ))}
    </div>
  );
}
