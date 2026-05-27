import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 1. Define the routes that require authentication
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);

// 2. Explicitly define the webhook route
const isWebhookRoute = createRouteMatcher(['/api/webhooks/paddle']);

export default clerkMiddleware(async (auth, req) => {
  // If Paddle is sending a webhook, bypass Clerk completely and let it through
  if (isWebhookRoute(req)) {
    return;
  }

  // If a user tries to access the dashboard, force them to log in
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