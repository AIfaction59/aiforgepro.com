"use client";

import { useEffect, useState } from "react";

interface ImageRecord {
  id: number;
  image_url: string;
  created_at: string;
}

export default function LibraryPage() {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setImages(data.images);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl mb-4">Your Library</h1>

      {loading && <p>Loading your images…</p>}
      {error && <p className="text-red-500">❌ {error}</p>}
      {!loading && images.length === 0 && <p>No images generated yet.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <img
            key={img.id}
            src={img.image_url}
            alt={`Generated on ${new Date(img.created_at).toLocaleString()}`}
            className="w-full h-auto rounded shadow"
          />
        ))}
      </div>
    </div>
  );
}
