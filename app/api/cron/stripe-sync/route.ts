export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getMonthlyUsage } from '@/lib/billing/usageAggregation';
export async function POST(req: Request) {
  const expected = process.env.CRON_SECRET;
  const auth = req.headers.get('authorization');

  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: {
      stripeSubscriptionItemId: {
        not: null,
      },
    },
    select: {
      id: true,
      stripeSubscriptionItemId: true,
    },
  });

  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = now.getUTCDate();

  for (const user of users) {
    if (!user.stripeSubscriptionItemId) continue;
    const usage = await getMonthlyUsage(user.id, year, month);

    const quantity = usage.billableCalls;
    const body = new URLSearchParams({
      quantity: String(quantity),
      action: 'set',
      timestamp: String(Math.floor(now.getTime() / 1000)),
    });
    const key = `usage-sync-${user.id}-${year}-${month}-${day}`;

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    await fetch(
      `https://api.stripe.com/v1/subscription_items/${user.stripeSubscriptionItemId}/usage_records`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Idempotency-Key': key,
        },
        body,
      },
    );
  }

  return NextResponse.json({ syncedUsers: users.length });
}
