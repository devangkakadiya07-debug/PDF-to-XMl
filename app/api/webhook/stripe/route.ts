export const dynamic = 'force-dynamic';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db/prisma';
import { getStripeClient } from '@/lib/stripe/client';

async function postHandler(req: Request) {
  const stripe = getStripeClient();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature configuration' }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  const existing = await prisma.stripeEvent.findUnique({ where: { id: event.id } });
  if (existing) {
    return NextResponse.json({ received: true, replay: true });
  }

  await prisma.stripeEvent.create({ data: { id: event.id } });

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id || session.metadata?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Missing user mapping' }, { status: 400 });
    }

    const stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
    const subscriptionId =
      typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

    if (!stripeCustomerId || !subscriptionId) {
      return NextResponse.json({ error: 'Missing Stripe customer or subscription' }, { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const stripeSubscriptionItemId = subscription.items.data[0]?.id;

    if (!stripeSubscriptionItemId) {
      return NextResponse.json({ error: 'Missing Stripe subscription item id' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId,
        stripeSubscriptionItemId,
        monthlyCallLimit: 2000,
      },
    });
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const stripeCustomerId =
      typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;

    if (stripeCustomerId) {
      await prisma.user.updateMany({
        where: { stripeCustomerId },
        data: {
          stripeSubscriptionItemId: null,
          monthlyCallLimit: 0,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}

export const POST = Sentry.wrapRouteHandlerWithSentry(postHandler, {
  method: 'POST',
  parameterizedRoute: '/api/webhook/stripe',
});
