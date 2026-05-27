export const dynamic = 'force-dynamic';

import { Environment, Paddle } from '@paddle/paddle-node-sdk';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

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

export async function POST(req: Request) {
  const signature = req.headers.get('paddle-signature');
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
  const apiKey = process.env.PADDLE_API_KEY;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing Paddle webhook signature' }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing Paddle API key' }, { status: 500 });
  }

  const rawBody = await req.text();
  const paddle = new Paddle(apiKey, { environment: Environment.production });

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
  
  // FIXED LOGIC: Extract email from custom_data
  const email = data.custom_data?.email; 

  if (!email) {
    console.error("Missing custom_data.email in webhook payload. Frontend did not send it.");
    return NextResponse.json({ error: 'Missing customer email in webhook payload' }, { status: 400 });
  }

  const customerId = data.customer_id ?? data.id;
  const subscriptionId = data.subscription_id ?? data.id;

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