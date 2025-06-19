'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function LibraryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 9;
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      await fetchImages(user.id, 0);
    };
    init();
  }, []);

  const fetchImages = async (uid: string, pageIndex: number) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("images")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1);

    if (!error && data) {
      setImages(prev => [...prev, ...data]);
      setPage(pageIndex);
    } else {
      console.error("Error fetching images:", error?.message);
    }
    setLoading(false);
  };

  const handleDelete = async (image: any) => {
    const path = image.image_url.split("/storage/v1/object/public/product-images/")[1];
    if (!path) return;

    const { error: storageError } = await supabase.storage.from("product-images").remove([path]);
    const { error: dbError } = await supabase.from("images").delete().eq("id", image.id);

    if (storageError || dbError) {
      console.error("Delete failed:", storageError?.message || dbError?.message);
      return;
    }

    setImages(prev => prev.filter(img => img.id !== image.id));
  };

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && userId) {
      fetchImages(userId, page + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMoreRef.current, page, userId]);

  return (
    <div className="p-6">
      {images.length === 0 && !loading ? (
        <p className="text-center text-gray-500">No images found yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow p-4 relative group">
              <img
                src={image.image_url}
                alt={image.prompt}
                className="w-full h-auto object-cover rounded cursor-pointer"
                onClick={() => setLightboxUrl(image.image_url)}
              />
              <p className="text-sm mt-2 text-gray-600">{image.prompt}</p>
              <p className="text-xs text-gray-400">
                {new Date(image.created_at).toLocaleString()}
              </p>
              <div className="flex justify-between mt-2 space-x-2 opacity-0 group-hover:opacity-100 transition">
                <a
                  href={image.image_url}
                  download
                  className="text-blue-600 hover:underline text-sm"
                >
                  Download
                </a>
                <button
                  onClick={() => handleDelete(image)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      <div ref={loadMoreRef} className="h-10 mt-10 flex justify-center items-center">
        {loading && <p className="text-gray-400">Loading more...</p>}
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
        >
          <img
            src={lightboxUrl}
            alt="Preview"
            className="max-w-full max-h-[90vh] rounded"
          />
        </div>
      )}
    </div>
  );
}
