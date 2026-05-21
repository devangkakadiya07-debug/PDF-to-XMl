import { prisma } from '@/lib/db/prisma';

export async function getMonthlyUsage(userId: string, year: number, month: number) {
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 1, 0, 0, 0));

  const billableCalls = await prisma.apiRequestLog.count({
    where: {
      userId,
      billable: true,
      success: true,
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });

  return { billableCalls, start, end };
}
