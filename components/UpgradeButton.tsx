'use client';

import { useTransition } from 'react';
import { createCheckoutSession } from '@/app/(dashboard)/actions/stripe';

export default function UpgradeButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      onClick={() =>
        startTransition(async () => {
          const { url } = await createCheckoutSession();
          window.location.href = url;
        })
      }
      disabled={isPending}
    >
      {isPending ? 'Redirecting…' : 'Upgrade to Live'}
    </button>
  );
}
