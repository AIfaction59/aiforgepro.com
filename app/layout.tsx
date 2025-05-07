import "./globals.css";
import Navbar from "../Navbar";

export const metadata = {
  title: "AiForgePro",
  description: "Your AI Image Generator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
