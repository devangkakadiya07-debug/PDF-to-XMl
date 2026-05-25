import Link from 'next/link';

export default function PricingPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
            Pricing
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-zinc-900 sm:text-4xl">
            Transparent Pricing. No Surprises.
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            Start in sandbox, then scale production usage when you are ready.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">Sandbox</h2>
                <p className="mt-1 text-sm text-zinc-500">Validate integrations risk-free.</p>
              </div>
              <span className="text-2xl font-semibold text-zinc-900">$0/month</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-zinc-600">
              <li>100 test requests per month</li>
              <li>No production usage</li>
            </ul>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              Start Testing
            </Link>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">Pro</h2>
                <p className="mt-1 text-sm text-zinc-500">Production-ready scale.</p>
              </div>
              <span className="text-2xl font-semibold text-zinc-900">$49/month</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-zinc-600">
              <li>1,000 production conversions per month</li>
              <li>Standard email support</li>
              <li>Unlimited sandbox access</li>
            </ul>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-900"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
