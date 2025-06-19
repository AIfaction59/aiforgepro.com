"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("studio");
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);

  const router = useRouter();

  // Fetch current credit balance
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch("/api/credits/balance");
        const data = await res.json();
        if (res.ok) {
          setCredits(data.credits ?? 0);
        } else {
          setCredits(0);
        }
      } catch (err) {
        console.error("Credit fetch error:", err);
        setCredits(0);
      }
    };

    fetchCredits();
  }, []);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      let base64File;
      if (file) base64File = await convertFileToBase64(file);

      const res = await fetch("/api/dalle/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style,
          file: base64File,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }
        if (res.status === 402) {
          setCredits(0);
          throw new Error("You are out of credits.");
        }
        throw new Error(data.error || "Image generation failed.");
      }

      setImageUrl(data.imageUrl);
      setCredits((prev) => (prev !== null ? prev - 1 : null)); // update locally
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const outOfCredits = credits !== null && credits <= 0;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
      <div className="w-full max-w-lg bg-white rounded shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">Generate a Product Image</h1>

        {credits !== null && (
          <p className="text-center text-gray-600 text-sm">
            {outOfCredits ? "❌ You are out of credits." : `💳 You have ${credits} credit${credits !== 1 ? "s" : ""} left`}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Prompt */}
          <label className="block">
            <span className="text-sm">Prompt</span>
            <input
              type="text"
              className="w-full p-2 border rounded mt-1"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required={!file}
              placeholder="e.g., Stainless steel water bottle"
            />
          </label>

          {/* File */}
          <label className="block">
            <span className="text-sm">Upload Base Image (optional)</span>
            <input
              type="file"
              accept="image/*"
              className="w-full mt-1"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          {/* Style */}
          <label className="block">
            <span className="text-sm">Background / Style</span>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-2 border rounded mt-1"
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
              <option value="multi-view">Multi-View: front, back & side</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={loading || outOfCredits}
            className={`w-full py-2 rounded text-white ${
              loading || outOfCredits
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </form>

        {outOfCredits && (
          <div className="text-center text-sm text-red-600">
            You're out of credits.{" "}
            <a href="/pricing" className="text-blue-600 underline">
              Buy more here
            </a>
          </div>
        )}

        {error && <p className="text-red-500 text-sm text-center">❌ {error}</p>}

        {imageUrl && (
          <div className="text-center mt-4">
            <h2 className="text-xl font-semibold mb-2">Generated Image</h2>
            <img src={imageUrl} alt="AI Generated" className="rounded shadow mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
}
