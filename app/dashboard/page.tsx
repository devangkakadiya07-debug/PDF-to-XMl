import Link from 'next/link';
import UpgradeButton from '@/components/UpgradeButton';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export default async function DashboardPage() {
  // 1. Get the logged-in user's Clerk ID
  const { userId } = auth();

  let isSubscribed = false;

  // 2. Ask the database if this user has a Stripe Subscription ID
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeSubscriptionItemId: true }, // Only fetch what we need
    });

    // If the column has a string in it, they are a paying customer
    if (user?.stripeSubscriptionItemId) {
      isSubscribed = true;
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Developer Dashboard</h1>
      <p className="mt-2 text-sm text-zinc-600">Manage API keys, usage, and subscription.</p>
      
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="rounded border px-4 py-2" href="/dashboard/keys">
          API Keys
        </Link>
        <Link className="rounded border px-4 py-2" href="/dashboard/usage">
          Usage
        </Link>

        {/* 3. The Conditional Logic */}
        {!isSubscribed ? (
          <UpgradeButton />
        ) : (
          <div className="rounded border bg-green-50 px-4 py-2 text-green-700 font-medium">
            Active Pro Plan
          </div>
        )}
      </div>
    </main>
  );
}
