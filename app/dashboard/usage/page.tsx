import { getUsage } from '@/app/(dashboard)/actions';

export default async function UsagePage() {
  const usage = await getUsage();
  const limit = Math.max(usage.monthlyCallLimit, 1);
  const percent = Math.min(100, Math.round((usage.billableCalls / limit) * 100));
  const widthClasses = [
    'w-[0%]',
    'w-[10%]',
    'w-[20%]',
    'w-[30%]',
    'w-[40%]',
    'w-[50%]',
    'w-[60%]',
    'w-[70%]',
    'w-[80%]',
    'w-[90%]',
    'w-[100%]',
  ];
  const widthClass = widthClasses[Math.min(10, Math.round(percent / 10))];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Usage</h2>
        <p className="mt-2 text-sm text-zinc-600">Real-time monthly billable requests.</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">Current Billing Cycle</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Track usage across the current subscription window.
            </p>
          </div>
          <div className="text-sm font-semibold text-zinc-900">
            {usage.billableCalls.toLocaleString()} / {usage.monthlyCallLimit.toLocaleString()} requests used
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>API Calls Made</span>
            <span>Monthly Limit</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-zinc-100">
            <div className={`h-2 rounded-full bg-zinc-900 ${widthClass}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
