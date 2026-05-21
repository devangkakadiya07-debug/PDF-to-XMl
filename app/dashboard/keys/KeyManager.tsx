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
  const router = useRouter();

  const handleCreate = (environment: 'TEST' | 'LIVE') => {
    startTransition(async () => {
      const created = await createKey(environment);
      setKeys((prev) => [
        {
          id: created.id,
          maskedKey: created.maskedKey,
          environment: created.environment,
          createdAt: created.createdAt,
        },
        ...prev,
      ]);
      setPlainKey(created.key);
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

  return (
    <>
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => handleCreate('LIVE')}
          disabled={isPending}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {isPending ? 'Processing…' : 'Create Live Key'}
        </button>
        <button
          onClick={() => handleCreate('TEST')}
          disabled={isPending}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          {isPending ? 'Processing…' : 'Create Test Key'}
        </button>
      </div>

      <ul className="space-y-2">
        {keys.map((key) => (
          <li key={key.id} className="flex items-center justify-between rounded border p-3">
            <div>
              <p className="font-mono text-sm">{key.maskedKey}</p>
              <p className="text-xs text-zinc-500">{key.environment}</p>
            </div>
            <button
              onClick={() => handleRevoke(key.id)}
              disabled={isPending}
              className="rounded border border-red-300 px-3 py-1 text-red-700 disabled:opacity-50"
            >
              Revoke
            </button>
          </li>
        ))}
      </ul>

      {showModal && plainKey ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded bg-white p-5">
            <h2 className="text-lg font-semibold">New API key (shown once)</h2>
            <p className="mt-2 text-sm text-zinc-600">Copy this key now. It will not be shown again.</p>
            <pre className="mt-3 overflow-auto rounded bg-zinc-100 p-3 text-xs">{plainKey}</pre>
            <div className="mt-4 flex gap-2">
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
    </>
  );
}
