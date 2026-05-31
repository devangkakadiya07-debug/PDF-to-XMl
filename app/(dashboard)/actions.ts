'use server';

import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { ensureUserRecord } from '@/lib/auth/syncUser';
import { requireUserId } from '@/lib/auth/requireUser';
import { generateApiKey, hashApiKey, maskApiKey } from '@/lib/apiKeys';
import { getMonthlyUsage } from '@/lib/billing/usageAggregation';

export async function getKeys() {
  const userId = await requireUserId();
  const user = await ensureUserRecord(userId);

  if (!user) {
    return [];
  }

  return prisma.apiKey.findMany({
    where: { userId, revokedAt: null },
    select: {
      id: true,
      maskedKey: true,
      environment: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createKey(environment: 'TEST' | 'LIVE') {
  const userId = await requireUserId();
  const syncedUser = await ensureUserRecord(userId);

  if (!syncedUser) {
    return {
      success: false,
      error: 'Verify your email address before generating API keys.',
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeSubscriptionItemId: true },
  });

  const isSubscribed = Boolean(user?.stripeSubscriptionItemId);

  if (environment === 'LIVE' && !isSubscribed) {
    return {
      success: false,
      error: 'Upgrade to the Pro plan to generate Live API keys.',
    };
  }

  const key = generateApiKey(environment);
  const keyHash = hashApiKey(key);
  const maskedKey = maskApiKey(key);

  const created = await prisma.apiKey.create({
    data: {
      userId,
      keyHash,
      maskedKey,
      environment,
    },
    select: {
      id: true,
      maskedKey: true,
      environment: true,
      createdAt: true,
    },
  });

  revalidatePath('/dashboard/keys');

  return {
    success: true,
    id: created.id,
    key,
    maskedKey: created.maskedKey,
    environment: created.environment,
    createdAt: created.createdAt.toISOString(),
  };
}

export async function revokeKey(id: string) {
  const userId = await requireUserId();

  await prisma.apiKey.updateMany({
    where: { id, userId },
    data: { revokedAt: new Date() },
  });

  revalidatePath('/dashboard/keys');
}

export async function getUsage() {
  // Next.js 16 currently exposes noStore via unstable_noStore.
  noStore();

  const userId = await requireUserId();
  const user = await ensureUserRecord(userId);

  if (!user) {
    return {
      year: new Date().getUTCFullYear(),
      month: new Date().getUTCMonth() + 1,
      billableCalls: 0,
      monthlyCallLimit: 0,
    };
  }

  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;

  const usage = await getMonthlyUsage(userId, year, month);

  return {
    year,
    month,
    billableCalls: usage.billableCalls,
    monthlyCallLimit: user.monthlyCallLimit,
  };
}
