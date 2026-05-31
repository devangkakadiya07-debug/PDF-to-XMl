export const dynamic = 'force-dynamic';

import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

async function getHandler(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);

  if (searchParams.get('confirm') !== 'crash') {
    return NextResponse.json(
      {
        error: 'Missing confirmation token. Append ?confirm=crash to trigger the test error.',
      },
      { status: 400 },
    );
  }

  throw new Error('Manual Sentry test error from /api/sentry-test');
}

export const GET = Sentry.wrapRouteHandlerWithSentry(getHandler, {
  method: 'GET',
  parameterizedRoute: '/api/sentry-test',
});