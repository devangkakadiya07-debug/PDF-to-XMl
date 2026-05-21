# PDF-to-XML MVP

API-first EN 16931 UBL 2.1 generator with Peppol BIS Billing 3.0 and XRechnung support, Clerk dashboard auth, Stripe subscription billing, Prisma API key management, and usage sync cron.

## Stack

- Next.js App Router + TypeScript
- Prisma + PostgreSQL
- Clerk auth
- Stripe checkout/webhooks
- xmlbuilder2 UBL generation
- Vitest unit tests

## Environment

Copy `.env.example` to `.env` and fill values.
Set `API_KEY_HASH_SECRET` to a strong random value for API key hash peppering.

## Install

```bash
npm install
```

## Prisma

```bash
npm run prisma -- generate
npm run prisma -- migrate dev
```

## Run

```bash
npm run dev
```

## Test

```bash
npm test
```

## Stripe setup

1. Create recurring Stripe Price and set `STRIPE_PRICE_ID`.
2. Configure webhook endpoint: `/api/webhook/stripe`.
3. Add events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`

## Cron

`/api/cron/stripe-sync` expects `Authorization: Bearer ${CRON_SECRET}` and syncs month-to-date billable usage with idempotency key `usage-sync-{userId}-{year}-{month}-{day}`.

## API

### POST `/api/v1/convert`

- Auth: `Authorization: Bearer test_...|live_...`
- Supports `profile: peppol | xrechnung`
- XRechnung requires `buyer_reference`
- TEST key behavior:
  - prefixes invoice number with `TEST-`
  - forces both VAT IDs to `TEST-VAT-0000`
  - logs are non-billable

### POST `/api/v1/validate`

Proxies XML/profile payload to external EN16931 validator URL.

## Dashboard

- `/dashboard`
- `/dashboard/keys` key creation/revoke and one-time plaintext reveal
- `/dashboard/usage` real-time monthly usage (`noStore()`)
