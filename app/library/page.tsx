// app/library/page.tsx
"use client";

import { useEffect, useState } from "react";

type ImageRecord = { id: string; image_url: string; created_at: string };

export default function LibraryPage() {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setImages(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4">Your Library</h1>
      {error && <p className="text-red-500">Error: {error}</p>}
      {images.length === 0 && !error && <p>No saved images yet.</p>}
      <div className="grid grid-cols-2 gap-4">
        {images.map((img) => (
          <div key={img.id} className="border p-2 rounded">
            <img src={img.image_url} alt="" className="rounded" />
            <p className="text-xs text-gray-500 mt-2">
              {new Date(img.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
