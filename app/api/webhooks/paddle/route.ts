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
  };
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
  const userId = getUserId(data);

  const activeUpdate = {
    monthlyCallLimit: PRO_MONTHLY_CALL_LIMIT,
    ...(customerId ? { stripeCustomerId: customerId } : {}),
    ...(subscriptionId ? { stripeSubscriptionItemId: subscriptionId } : {}),
  };

  const cancelUpdate = {
    stripeSubscriptionItemId: null,
    monthlyCallLimit: 0,
  };

  type UserUpdateData = typeof activeUpdate | typeof cancelUpdate;

  const updateByCustomerId = async (updateData: UserUpdateData) => {
    if (!customerId) return 0;
    const result = await prisma.user.updateMany({
      where: { stripeCustomerId: customerId },
      data: updateData,
    });
    return result.count;
  };

  const updateByUserId = async (updateData: UserUpdateData) => {
    if (!userId) return;
    await prisma.user.update({ where: { id: userId }, data: updateData });
  };

  switch (eventData.eventType) {
    case 'transaction.completed': {
      const updatedCount = await updateByCustomerId(activeUpdate);
      if (updatedCount === 0) {
        await updateByUserId(activeUpdate);
      }
      break;
    }
    case 'subscription.updated': {
      const updatedCount = await updateByCustomerId(activeUpdate);
      if (updatedCount === 0) {
        await updateByUserId(activeUpdate);
      }
      break;
    }
    case 'subscription.canceled': {
      const updatedCount = await updateByCustomerId(cancelUpdate);
      if (updatedCount === 0) {
        await updateByUserId(cancelUpdate);
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
