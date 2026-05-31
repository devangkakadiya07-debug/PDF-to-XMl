export const dynamic = 'force-dynamic';

import * as Sentry from '@sentry/nextjs';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getPaddleServerClient } from '@/lib/paddle/server';

async function getHandler(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      stripeCustomerId: true,
      stripeSubscriptionItemId: true,
    },
  });

  if (!user?.stripeCustomerId || !user.stripeSubscriptionItemId) {
    return NextResponse.redirect(new URL('/pricing?billing=unavailable', req.url));
  }

  try {
    const paddle = getPaddleServerClient();
    const session = await paddle.customerPortalSessions.create(user.stripeCustomerId, [
      user.stripeSubscriptionItemId,
    ]);

    return NextResponse.redirect(new URL(session.urls.general.overview));
  } catch (error) {
    console.error('Failed to create Paddle customer portal session:', error);
    return NextResponse.redirect(new URL('/pricing?billing=portal-error', req.url));
  }
}

export const GET = Sentry.wrapRouteHandlerWithSentry(getHandler, {
  method: 'GET',
  parameterizedRoute: '/api/billing/portal',
});