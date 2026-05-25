async function createSandboxKey() {
  'use server';
}

async function createLiveKey() {
  'use server';
}

export default function ApiKeysPage() {
  return (
    <section className="space-y-10">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Sandbox Environment</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Sandbox keys are for free testing only and do not hit production endpoints.
            </p>
          </div>
          <form action={createSandboxKey}>
            <button
              type="submit"
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              Generate Sandbox Key
            </button>
          </form>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Key</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-zinc-200">
                <td className="px-4 py-4 text-sm text-zinc-500" colSpan={3}>
                  No active sandbox keys yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Production Environment</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Live keys require an active Pro Plan and enable production conversions.
            </p>
          </div>
          <form action={createLiveKey}>
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-900"
            >
              Generate Live Key
            </button>
          </form>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Key</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-zinc-200">
                <td className="px-4 py-4 text-sm text-zinc-500" colSpan={3}>
                  No active live keys yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
