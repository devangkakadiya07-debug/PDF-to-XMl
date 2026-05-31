'use server';

import { requireUserId } from '@/lib/auth/requireUser';
import { ensureUserRecord } from '@/lib/auth/syncUser';
import { getStripeClient } from '@/lib/stripe/client';

export async function createCheckoutSession() {
  const stripe = getStripeClient();
  const userId = await requireUserId();
  const user = await ensureUserRecord(userId);

  if (!user) {
    throw new Error('Verify your email address before creating a checkout session');
  }

  if (user.stripeSubscriptionItemId) {
    throw new Error('You are already subscribed');
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!priceId || !baseUrl) {
    throw new Error('Stripe env is not configured');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?checkout=success`,
    cancel_url: `${baseUrl}/dashboard?checkout=cancel`,
    metadata: { userId },
    ...(user.stripeCustomerId
      ? { customer: user.stripeCustomerId }
      : { customer_email: user.email, client_reference_id: userId }),
  });

  if (!session.url) {
    throw new Error('Unable to create checkout session');
  }

  return { url: session.url };
}
