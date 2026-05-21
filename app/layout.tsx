import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EN16931 UBL XML API',
  description: 'EN16931 UBL 2.1 generator API for Peppol and XRechnung',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-white text-zinc-900">{children}</body>
    </html>
  );
}
