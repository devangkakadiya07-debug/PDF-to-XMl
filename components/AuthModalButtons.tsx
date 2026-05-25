'use client';

import { SignInButton } from '@clerk/nextjs';

export default function AuthModalButtons() {
  return (
    <>
      <SignInButton mode="modal">
        <button
          type="button"
          className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
        >
          Get Started
        </button>
      </SignInButton>
      <SignInButton mode="modal">
        <button type="button" className="text-zinc-600 transition hover:text-zinc-900">
          Login
        </button>
      </SignInButton>
    </>
  );
}
