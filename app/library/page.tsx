// app/library/page.tsx
"use client";

import { useEffect, useState } from "react";

interface Img {
  id: string;
  image_url: string;
  created_at: string;
}

export default function LibraryPage() {
  const [images, setImages] = useState<Img[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setImages(data.images);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl mb-4">Your Library</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {images.length === 0 ? (
        <p>No images yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <img
              key={img.id}
              src={img.image_url}
              alt={`Generated at ${new Date(img.created_at).toLocaleString()}`}
              className="w-full h-auto rounded shadow"
            />
          ))}
        </div>
      )}
    </div>
  );
}
