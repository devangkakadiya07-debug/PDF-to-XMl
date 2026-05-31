import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';

function getVerifiedEmailAddress(user: Awaited<ReturnType<typeof currentUser>>) {
  if (!user) {
    return null;
  }

  const primaryVerifiedEmail = user.emailAddresses.find(
    (emailAddress) =>
      emailAddress.id === user.primaryEmailAddressId &&
      emailAddress.verification?.status === 'verified',
  );

  if (primaryVerifiedEmail) {
    return primaryVerifiedEmail.emailAddress;
  }

  return (
    user.emailAddresses.find((emailAddress) => emailAddress.verification?.status === 'verified')
      ?.emailAddress ?? null
  );
}

export async function ensureUserRecord(userId: string) {
  const user = await currentUser();
  const email = getVerifiedEmailAddress(user);
  const name = user?.fullName ?? undefined;

  return prisma.$transaction(async (tx) => {
    const existingById = await tx.user.findUnique({ where: { id: userId } });

    if (!email) {
      if (!existingById) {
        return null;
      }

      if (name !== undefined && existingById.name !== name) {
        return tx.user.update({
          where: { id: userId },
          data: { name },
        });
      }

      return existingById;
    }

    if (existingById) {
      return tx.user.update({
        where: { id: userId },
        data: {
          email,
          name,
        },
      });
    }

    const existingByEmail = await tx.user.findUnique({ where: { email } });

    if (existingByEmail) {
      return tx.user.update({
        where: { id: existingByEmail.id },
        data: {
          id: userId,
          name,
        },
      });
    }

    return tx.user.create({
      data: {
        id: userId,
        email,
        name: name ?? null,
      },
    });
  });
}
