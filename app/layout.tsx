import type { Metadata } from 'next';
import Link from 'next/link';
import { Hexagon } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import './globals.css';

export const metadata: Metadata = {
  title: 'EN16931 UBL XML API',
  description: 'EN16931 UBL 2.1 generator API for Peppol and XRechnung',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  const isLoggedIn = Boolean(userId);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-gradient-to-b from-white via-slate-50 to-white text-zinc-900">
        <div className="flex min-h-full flex-col">
          <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-gradient-to-b from-white/85 via-white/75 to-white/65 backdrop-blur supports-[backdrop-filter]:bg-white/70">
            <div className="nav-fade mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-3 text-sm font-semibold tracking-tight text-zinc-900"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200/70 bg-white/85 shadow-sm">
                    <Hexagon className="h-4 w-4 text-zinc-900" aria-hidden="true" />
                  </span>
                  <span className="text-base">UBL API</span>
                </Link>
                <nav
                  className="nav-stagger flex flex-wrap items-center gap-4 text-sm text-zinc-600"
                  aria-label="Primary"
                >
                  <Link className="transition hover:text-zinc-900" href="/#features">
                    Features
                  </Link>
                  <Link className="transition hover:text-zinc-900" href="/#pricing">
                    Pricing
                  </Link>
                  <Link className="transition hover:text-zinc-900" href="/#documentation">
                    Documentation
                  </Link>
                </nav>
              </div>
              <div className="nav-stagger flex items-center gap-3 text-sm">
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-900"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      Get Started
                    </Link>
                    <Link className="text-zinc-600 transition hover:text-zinc-900" href="/sign-in">
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
