export const dynamic = 'force-dynamic';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

async function postHandler(req: Request) {
  const validatorUrl = process.env.EN16931_VALIDATOR_URL;
  if (!validatorUrl) {
    return NextResponse.json({ error: 'Validator URL not configured' }, { status: 500 });
  }

  const body = await req.json();

  const res = await fetch(validatorUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: {
      'content-type': res.headers.get('content-type') || 'application/json',
    },
  });
}

export const POST = Sentry.wrapRouteHandlerWithSentry(postHandler, {
  method: 'POST',
  parameterizedRoute: '/api/v1/validate',
});
