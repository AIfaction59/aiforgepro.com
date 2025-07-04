'use client';

import Providers from './providers';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-grow px-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
