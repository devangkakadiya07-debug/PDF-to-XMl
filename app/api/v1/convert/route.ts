import { NextResponse } from 'next/server';
import { ApiKeyEnvironment } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { consumeRateLimit } from '@/lib/rate/inMemoryRateLimit';
import { getBearerToken, hashApiKey } from '@/lib/apiKeys';
import { generateInvoiceXml, type InvoicePayload, type InvoiceProfile } from '@/lib/ubl/generator';
import { getMonthlyUsage } from '@/lib/billing/usageAggregation';

type ConvertBody = {
  profile: InvoiceProfile;
  invoice: InvoicePayload;
};

function cloneForTest(invoice: InvoicePayload): InvoicePayload {
  return {
    ...invoice,
    invoice_number: `TEST-${invoice.invoice_number}`,
    seller: {
      ...invoice.seller,
      vat_id: 'TEST-VAT-0000',
    },
    buyer: {
      ...invoice.buyer,
      vat_id: 'TEST-VAT-0000',
    },
  };
}

export async function POST(req: Request) {
  const token = getBearerToken(req.headers.get('authorization'));

  if (!token) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 401 });
  }

  const keyHash = hashApiKey(token);

  const apiKey = await prisma.apiKey.findFirst({
    where: {
      keyHash,
      revokedAt: null,
    },
    include: {
      user: {
        select: {
          id: true,
          monthlyCallLimit: true,
        },
      },
    },
  });

  if (!apiKey) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const rate = consumeRateLimit(apiKey.id);
  if (!rate.ok) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const rawBody = await req.text();
  const requestSize = Buffer.byteLength(rawBody, 'utf8');
  let profile = 'unknown';
  let success = false;
  let responseSize: number | undefined;

  try {
    const requestBody = JSON.parse(rawBody) as ConvertBody;
    profile = requestBody.profile;

    if (apiKey.environment === ApiKeyEnvironment.LIVE) {
      const now = new Date();
      const usage = await getMonthlyUsage(apiKey.userId, now.getUTCFullYear(), now.getUTCMonth() + 1);

      if (usage.billableCalls >= apiKey.user.monthlyCallLimit) {
        return NextResponse.json(
          { error: 'Monthly usage cap exceeded. Please upgrade your plan.' },
          { status: 429 },
        );
      }
    }

    const invoice =
      apiKey.environment === ApiKeyEnvironment.TEST
        ? cloneForTest(requestBody.invoice)
        : requestBody.invoice;

    const xml = generateInvoiceXml(requestBody.profile, invoice);
    success = true;
    responseSize = Buffer.byteLength(xml, 'utf8');

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'content-type': 'application/xml; charset=utf-8',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unable to convert payload',
      },
      { status: 400 },
    );
  } finally {
    await prisma.apiRequestLog.create({
      data: {
        userId: apiKey.userId,
        apiKeyId: apiKey.id,
        endpoint: '/api/v1/convert',
        profile,
        success,
        billable: apiKey.environment === ApiKeyEnvironment.LIVE && success,
        requestSize,
        responseSize,
      },
    });
  }
}
