// app/generate/page.tsx
"use client";

import { useState } from "react";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("studio");
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      // If user picked a file, read as base64 data URL
      let fileDataUrl: string | undefined;
      if (file) {
        fileDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });
      }

      const res = await fetch("/api/dalle/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, file: fileDataUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}`);
      }

      setImageUrl(data.imageUrl);

      // Save into library
      await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: data.imageUrl }),
      });
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow space-y-4">
        <h1 className="text-2xl text-center">Generate a Product Image</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Prompt */}
          <label className="block">
            <span className="text-sm">Prompt</span>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              placeholder="Describe your product…"
              required={!file}
            />
          </label>

          {/* File upload */}
          <label className="block">
            <span className="text-sm">Upload Base Image (optional)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1 block w-full"
            />
          </label>

          {/* Style dropdown */}
          <label className="block">
            <span className="text-sm">Background Style</span>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            >
              <option value="studio">Studio</option>
              <option value="outdoor">Outdoor</option>
              <option value="minimalist">Minimalist</option>
              <option value="fantasy">Fantasy</option>
              <option value="high contrast">High Contrast</option>
              <option value="colored background">Colored Background</option>
              <option value="transparent background">Transparent Background</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="make-up">Make-Up</option>
              <option value="technology">Technology</option>
              <option value="sci-fi">Sci-Fi</option>
              <option value="gray">Gray</option>
              <option value="black">Black</option>
              <option value="white">White</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="light gray">Light Gray</option>
              <option value="kitchen counter">Kitchen Counter</option>
              <option value="camping">Camping</option>
              <option value="garage">Garage</option>
              <option value="fitness">Fitness</option>
              <option value="office desk">Office Desk</option>
              <option value="floating product">Floating Product</option>
            </select>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Generating…" : "Generate"}
          </button>
        </form>

        {error && <p className="text-red-500">❌ {error}</p>}

        {imageUrl && (
          <div className="mt-6 text-center">
            <h2 className="text-xl mb-2">Result</h2>
            <img
              src={imageUrl}
              alt={`Generated (${style})`}
              className="rounded shadow mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}
