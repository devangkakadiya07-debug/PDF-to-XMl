export const dynamic = 'force-dynamic';

import { Environment, Paddle } from '@paddle/paddle-node-sdk';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db/prisma';

type PaddleWebhookEventData = {
  id?: string;
  customerId?: string;
  subscriptionId?: string;
  customData?: {
    userId?: string;
  };
  customer?: {
    id?: string;
    email?: string;
  };
  customerEmail?: string;
  email?: string;
  nextBilledAt?: string;
};

type PaddleWebhookEvent = {
  eventType: string;
  data?: PaddleWebhookEventData;
};

const PRO_MONTHLY_CALL_LIMIT = 2000;

function getCustomerId(data: PaddleWebhookEventData) {
  return data.customerId ?? data.customer?.id;
}

function getSubscriptionId(data: PaddleWebhookEventData) {
  if (data.subscriptionId) return data.subscriptionId;
  if (data.id && data.id.startsWith('sub_')) return data.id;
  return undefined;
}

function getUserId(data: PaddleWebhookEventData) {
  return data.customData?.userId;
}

function getEmail(data: PaddleWebhookEventData) {
  return data.customer?.email ?? data.customerEmail ?? data.email;
}

async function findUser(data: PaddleWebhookEventData) {
  const userId = getUserId(data);
  if (userId) {
    return prisma.user.findUnique({ where: { id: userId } });
  }

  const customerId = getCustomerId(data);
  if (customerId) {
    const userByCustomerId = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });
    if (userByCustomerId) return userByCustomerId;
  }

  const subscriptionId = getSubscriptionId(data);
  if (subscriptionId) {
    const userBySubscriptionId = await prisma.user.findUnique({
      where: { stripeSubscriptionItemId: subscriptionId },
    });
    if (userBySubscriptionId) return userBySubscriptionId;
  }

  const email = getEmail(data);
  if (email) {
    return prisma.user.findUnique({ where: { email } });
  }

  return null;
}

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
  const customerId = getCustomerId(data);
  const subscriptionId = getSubscriptionId(data) ?? data.id;
  const user = await findUser(data);

  switch (eventData.eventType) {
    case 'transaction.completed': {
      if (!user) break;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          monthlyCallLimit: PRO_MONTHLY_CALL_LIMIT,
          ...(customerId ? { stripeCustomerId: customerId } : {}),
          ...(subscriptionId ? { stripeSubscriptionItemId: subscriptionId } : {}),
        },
      });
      break;
    }
    case 'subscription.updated': {
      if (!user) break;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          monthlyCallLimit: PRO_MONTHLY_CALL_LIMIT,
          ...(customerId ? { stripeCustomerId: customerId } : {}),
          ...(subscriptionId ? { stripeSubscriptionItemId: subscriptionId } : {}),
        },
      });
      break;
    }
    case 'subscription.canceled': {
      if (!user) break;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          stripeSubscriptionItemId: null,
          monthlyCallLimit: 0,
        },
      });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
