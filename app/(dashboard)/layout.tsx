import DashboardTabs from '@/components/DashboardTabs';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <header>
          <h1 className="text-2xl font-semibold text-zinc-900">Developer Dashboard</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Manage API keys, usage, and subscription.
          </p>
        </header>

        <div className="sticky top-0 z-10 -mx-6 mt-6 border-b border-zinc-200 bg-zinc-50/95 px-6 backdrop-blur">
          <DashboardTabs />
        </div>

        <main className="pt-6">{children}</main>
      </div>
    </div>
  );
}