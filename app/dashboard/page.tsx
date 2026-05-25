import UpgradeButton from '@/components/UpgradeButton';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export default async function DashboardPage() {
  // 1. Get the logged-in user's Clerk ID
  const { userId } = await auth();

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
    <section className="flex w-full flex-col gap-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Subscription Status</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Keep your plan current for uninterrupted invoice conversion.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isSubscribed ? (
              <UpgradeButton />
            ) : (
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Active Pro Plan
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
