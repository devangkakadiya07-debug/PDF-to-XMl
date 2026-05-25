import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:flex-row">
        <aside className="w-full lg:max-w-[240px]">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
              Dashboard
            </p>
            <nav className="mt-5 grid gap-2 text-sm text-zinc-600 sm:grid-cols-2 lg:grid-cols-1">
              <Link
                href="/dashboard"
                className="rounded-lg border border-transparent px-3 py-2 font-medium text-zinc-900 transition hover:border-zinc-200 hover:bg-zinc-50"
              >
                Overview
              </Link>
              <Link
                href="/dashboard/keys"
                className="rounded-lg border border-transparent px-3 py-2 font-medium transition hover:border-zinc-200 hover:bg-zinc-50"
              >
                API Access Keys
              </Link>
              <Link
                href="/dashboard/usage"
                className="rounded-lg border border-transparent px-3 py-2 font-medium transition hover:border-zinc-200 hover:bg-zinc-50"
              >
                Usage Metering
              </Link>
              <Link
                href="/dashboard/billing"
                className="rounded-lg border border-transparent px-3 py-2 font-medium transition hover:border-zinc-200 hover:bg-zinc-50"
              >
                Billing
              </Link>
            </nav>
          </div>
        </aside>
        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </div>
  );
}
