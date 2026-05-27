'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createKey, revokeKey } from '@/app/(dashboard)/actions';

type KeyRow = {
  id: string;
  maskedKey: string;
  environment: 'TEST' | 'LIVE';
  createdAt: string;
};

export default function KeyManager({ initialKeys }: { initialKeys: KeyRow[] }) {
  const [keys, setKeys] = useState<KeyRow[]>(initialKeys);
  const [isPending, startTransition] = useTransition();
  const [plainKey, setPlainKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleCreate = (environment: 'TEST' | 'LIVE') => {
    startTransition(async () => {
      setErrorMessage(null);
      const result = await createKey(environment);
      if (result.success === false) {
        setErrorMessage(result.error);
        return;
      }
      setKeys((prev) => [
        {
          id: result.id,
          maskedKey: result.maskedKey,
          environment: result.environment,
          createdAt: result.createdAt,
        },
        ...prev,
      ]);
      setPlainKey(result.key);
      setCopied(false);
      setShowModal(true);
      router.refresh();
    });
  };

  const handleRevoke = (id: string) => {
    startTransition(async () => {
      setKeys((prev) => prev.filter((key) => key.id !== id));
      await revokeKey(id);
      router.refresh();
    });
  };

  const copyKey = async () => {
    if (!plainKey) return;
    await navigator.clipboard.writeText(plainKey);
    setCopied(true);
  };

  const sandboxKeys = keys.filter((key) => key.environment === 'TEST');
  const liveKeys = keys.filter((key) => key.environment === 'LIVE');
  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const renderRows = (rows: KeyRow[], emptyLabel: string) => {
    if (rows.length === 0) {
      return (
        <tr className="border-t border-zinc-200">
          <td className="px-4 py-4 text-sm text-zinc-500" colSpan={4}>
            {emptyLabel}
          </td>
        </tr>
      );
    }

    return rows.map((apiKey) => (
      <tr key={apiKey.id} className="border-t border-zinc-200">
        <td className="px-4 py-4 font-mono text-xs text-zinc-900">{apiKey.maskedKey}</td>
        <td className="px-4 py-4 text-sm text-zinc-600">{formatDate(apiKey.createdAt)}</td>
        <td className="px-4 py-4 text-sm">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
            Active
          </span>
        </td>
        <td className="px-4 py-4 text-right">
          <button
            onClick={() => handleRevoke(apiKey.id)}
            disabled={isPending}
            className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
          >
            Revoke
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <section className="space-y-10">
      {errorMessage ? (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">Sandbox Environment</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Sandbox keys are for free testing only and do not hit production endpoints.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleCreate('TEST')}
            disabled={isPending}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-zinc-400 hover:bg-zinc-50 disabled:opacity-50"
          >
            {isPending ? 'Processing…' : 'Generate Sandbox Key'}
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Key</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>{renderRows(sandboxKeys, 'No active sandbox keys yet.')}</tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">Production Environment</h3>
            <p className="mt-2 text-sm text-zinc-600">
              Live keys require an active Pro Plan and enable production conversions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleCreate('LIVE')}
            disabled={isPending}
            className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-900 disabled:opacity-50"
          >
            {isPending ? 'Processing…' : 'Generate Live Key'}
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Key</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>{renderRows(liveKeys, 'No active live keys yet.')}</tbody>
          </table>
        </div>
      </div>

      {showModal && plainKey ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-lg">
            <h4 className="text-lg font-semibold text-zinc-900">New API key (shown once)</h4>
            <p className="mt-2 text-sm text-zinc-600">
              Copy this key now. It will not be shown again.
            </p>
            <pre className="mt-3 overflow-auto rounded bg-zinc-100 p-3 text-xs text-zinc-900">
              {plainKey}
            </pre>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={copyKey} className="rounded bg-black px-4 py-2 text-white">
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={() => setShowModal(false)} className="rounded border px-4 py-2">
                I have copied it
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
