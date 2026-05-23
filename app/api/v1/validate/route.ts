export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
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
