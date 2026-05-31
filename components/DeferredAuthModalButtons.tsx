'use client';

import dynamic from 'next/dynamic';

const AuthModalButtons = dynamic(() => import('@/components/AuthModalButtons'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-3">
      <span className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-400 shadow-sm">
        Get Started
      </span>
      <span className="text-zinc-400">Login</span>
    </div>
  ),
});

export default function DeferredAuthModalButtons() {
  return <AuthModalButtons />;
}