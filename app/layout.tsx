import type { Metadata } from 'next';
import Link from 'next/link';
import { Hexagon } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { ClerkProvider } from '@clerk/nextjs';
import DeferredAuthModalButtons from '@/components/DeferredAuthModalButtons';
import NavUserProfile from '@/components/NavUserProfile';
import { ibmPlexMono, ibmPlexSans } from '@/app/fonts';
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

  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased">
        <body
          className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} min-h-full bg-gradient-to-b from-white via-slate-50 to-white text-zinc-900`}
        >
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
                  {userId ? (
                    <NavUserProfile userId={userId} />
                  ) : (
                    <DeferredAuthModalButtons />
                  )}
                </div>
              </div>
            </header>
            <div className="flex-1">{children}</div>
            <footer className="border-t border-zinc-200/70 bg-white/80">
              <div className="mx-auto w-full max-w-6xl px-6 py-6">
                <div className="flex flex-col items-center gap-3 text-center text-sm text-zinc-500">
                  <p>© 2026 UBL API. All rights reserved.</p>
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <Link
                      href="/terms"
                      className="transition-colors hover:text-zinc-900"
                    >
                      Terms
                    </Link>
                    <Link
                      href="/refund"
                      className="transition-colors hover:text-zinc-900"
                    >
                      Refund Policy
                    </Link>
                    <Link
                      href="/privacy"
                      className="transition-colors hover:text-zinc-900"
                    >
                      Privacy
                    </Link>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
