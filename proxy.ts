import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);
const isWebhookRoute = createRouteMatcher(['/api/webhooks/paddle']);

export const proxy = clerkMiddleware(async (auth, req) => {
  if (isWebhookRoute(req)) {
    return;
  }

  if (isDashboardRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};