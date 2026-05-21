import { getUsage } from '@/app/(dashboard)/actions';

export default async function UsagePage() {
  const usage = await getUsage();

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Usage</h1>
      <p className="mt-2 text-sm text-zinc-600">Real-time monthly billable requests.</p>
      <div className="mt-6 grid max-w-md gap-3 rounded border p-4">
        <p>
          <span className="font-semibold">Period:</span> {usage.year}-{String(usage.month).padStart(2, '0')}
        </p>
        <p>
          <span className="font-semibold">Billable calls:</span> {usage.billableCalls}
        </p>
        <p>
          <span className="font-semibold">Monthly limit:</span> {usage.monthlyCallLimit}
        </p>
      </div>
    </main>
  );
}
