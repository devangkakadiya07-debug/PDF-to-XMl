import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

export async function ensureUserRecord(userId: string) {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    throw new Error('User email not found');
  }

  return prisma.user.upsert({
    where: { id: userId },
    update: {
      email,
      name: user.fullName ?? undefined,
    },
    create: {
      id: userId,
      email,
      name: user.fullName ?? null,
    },
  });
}
