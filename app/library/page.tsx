// app/library/page.tsx
"use client";

import useSWR from "swr";
import Image from "next/image";

type ImageRecord = {
  id: string;
  image_url: string;
  created_at: string;
};

export default function LibraryPage() {
  const fetcher = (url: string) =>
    fetch(url).then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    });

  const { data, error } = useSWR<{ images: ImageRecord[] }>(
    "/api/images",
    fetcher
  );

  if (error) return <p>Error loading images: {error.message}</p>;
  if (!data) return <p>Loading…</p>;

  if (data.images.length === 0)
    return <p className="p-6 text-center">No images yet.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl mb-4">My Library</h1>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {data.images.map((img) => (
          <div key={img.id} className="border rounded overflow-hidden">
            <Image
              src={img.image_url}
              alt={`Generated on ${new Date(
                img.created_at
              ).toLocaleString()}`}
              width={320}
              height={240}
              className="object-cover w-full h-48"
            />
            <div className="p-2 flex justify-between items-center">
              <span className="text-xs text-gray-600">
                {new Date(img.created_at).toLocaleString()}
              </span>
              <a
                href={img.image_url}
                download
                className="text-blue-600 hover:underline text-xs"
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
