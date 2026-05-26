'use server';

import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { prisma } from '@/lib/db/prisma';
import { ensureUserRecord } from '@/lib/auth/syncUser';
import { requireUserId } from '@/lib/auth/requireUser';
import { generateApiKey, hashApiKey, maskApiKey } from '@/lib/apiKeys';
import { getMonthlyUsage } from '@/lib/billing/usageAggregation';

export async function getKeys() {
  const userId = await requireUserId();
  await ensureUserRecord(userId);

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
  await ensureUserRecord(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeSubscriptionItemId: true },
  });

  const isSubscribed = Boolean(user?.stripeSubscriptionItemId);

  if (environment === 'LIVE' && !isSubscribed) {
    throw new Error('Unauthorized: Active Pro Plan required to generate live keys.');
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
