// app/layout.tsx
import { Providers } from "./providers";
import Navbar from "../components/Navbar";
import "./globals.css"; // optional: if you're using global styles

export const metadata = {
  title: "Your App",
  description: "AI-powered app with Supabase & Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-grow flex items-center justify-center px-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
