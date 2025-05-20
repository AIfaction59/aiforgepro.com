// app/library/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ImageRecord {
  id: string;
  path: string;
  created_at: string;
}

export default function LibraryPage() {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/images")
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error || res.statusText);
        return payload.images as ImageRecord[];
      })
      .then((imgs) => setImages(imgs))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-center">Loading your library…</p>;
  if (error)   return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!images.length)
    return (
      <div className="p-6 text-center">
        <p className="mb-4">You haven’t generated any images yet.</p>
        <Link href="/generate" className="text-blue-600 underline">
          Go generate one →
        </Link>
      </div>
    );

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((img) => (
        <div
          key={img.id}
          className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
        >
          <div className="flex-1">
            <img
              src={img.path}
              alt={`Generated at ${new Date(img.created_at).toLocaleString()}`}
              className="object-cover w-full h-48"
            />
          </div>
          <div className="p-2 flex items-center justify-between text-xs text-gray-600">
            <span>
              {new Date(img.created_at).toLocaleString([], {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
            <a
              href={img.path}
              download
              className="text-blue-600 hover:underline"
            >
              Download
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
