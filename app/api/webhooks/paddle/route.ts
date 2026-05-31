export const dynamic = 'force-dynamic';

import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getPaddleServerClient } from '@/lib/paddle/server';

type PaddleWebhookEvent = {
  eventType: string;
  data?: {
    id?: string;
    customer_id?: string;
    subscription_id?: string;
    custom_data?: {
      email?: string;
      userId?: string;
    };
  };
};

const PRO_MONTHLY_CALL_LIMIT = 2000;

async function postHandler(req: Request) {
  const signature = req.headers.get('paddle-signature');
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing Paddle webhook signature' }, { status: 400 });
  }

  const rawBody = await req.text();
  let paddle;

  try {
    paddle = getPaddleServerClient();
  } catch {
    return NextResponse.json({ error: 'Missing Paddle API key' }, { status: 500 });
  }

  let eventData: PaddleWebhookEvent;
  try {
    eventData = (await paddle.webhooks.unmarshal(
      rawBody,
      webhookSecret,
      signature,
    )) as PaddleWebhookEvent;
  } catch {
    return NextResponse.json({ error: 'Invalid Paddle webhook signature' }, { status: 400 });
  }

  const data = eventData.data ?? {};
  
  // 1. Check all possible formatting variations from the SDK
  // 2. Cast as 'any' to bypass strict TS typing for raw payload checks
  const customData = (data as any).customData || (data as any).custom_data || {};
  const email = customData?.email || (data as any).customer?.email; 

  if (!email) {
    console.log("Ignored event missing email to drain Paddle retry queue.");
    // RETURN 200 SO PADDLE STOPS RETRYING THE BROKEN EVENTS
    return NextResponse.json({ received: true, note: "Ignored missing email" }, { status: 200 });
  }

  const customerId = data.customer_id ?? (data as any).id;
  const subscriptionId = data.subscription_id ?? (data as any).id;

  const activeUpdate = {
    monthlyCallLimit: PRO_MONTHLY_CALL_LIMIT,
    ...(customerId ? { stripeCustomerId: customerId } : {}), 
    ...(subscriptionId ? { stripeSubscriptionItemId: subscriptionId } : {}),
  };

  const cancelUpdate = {
    stripeSubscriptionItemId: null,
    monthlyCallLimit: 0,
  };

  try {
    switch (eventData.eventType) {
      case 'transaction.completed':
      case 'subscription.activated':
      case 'subscription.updated': {
        await prisma.user.updateMany({
          where: { email: email },
          data: activeUpdate,
        });
        break;
      }
      case 'subscription.canceled': {
        await prisma.user.updateMany({
          where: { email: email },
          data: cancelUpdate,
        });
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("Database update failed:", error);
    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

export const POST = Sentry.wrapRouteHandlerWithSentry(postHandler, {
  method: 'POST',
  parameterizedRoute: '/api/webhooks/paddle',
});