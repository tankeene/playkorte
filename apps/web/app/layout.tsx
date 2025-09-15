import './globals.css';
import React from 'react';

export const metadata = {
  title: 'PlayKorte',
  description: 'Find and book nearby sports courts',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <h1 className="text-3xl font-bold mb-4">PlayKorte</h1>
          {children}
        </div>
      </body>
    </html>
  );
}
