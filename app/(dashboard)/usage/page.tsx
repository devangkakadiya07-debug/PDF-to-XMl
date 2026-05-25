export default function UsagePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Current Billing Cycle</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Track usage across the current subscription window.
            </p>
          </div>
          <div className="text-sm font-semibold text-zinc-900">450 / 1,000 requests used</div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>API Calls Made</span>
            <span>Monthly Limit</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-zinc-100">
            <div className="h-2 w-[45%] rounded-full bg-zinc-900" />
          </div>
        </div>
      </div>
    </section>
  );
}
