import Link from 'next/link';
import UpgradeButton from '@/components/UpgradeButton';

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Developer Dashboard</h1>
      <p className="mt-2 text-sm text-zinc-600">Manage API keys, usage, and subscription.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="rounded border px-4 py-2" href="/dashboard/keys">
          API Keys
        </Link>
        <Link className="rounded border px-4 py-2" href="/dashboard/usage">
          Usage
        </Link>
        <UpgradeButton />
      </div>
    </main>
  );
}
