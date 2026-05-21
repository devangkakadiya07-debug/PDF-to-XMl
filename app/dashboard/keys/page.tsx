import KeyManager from './KeyManager';
import { getKeys } from '@/app/(dashboard)/actions';

export default async function KeysPage() {
  const keys = await getKeys();

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">API Keys</h1>
      <p className="mt-2 text-sm text-zinc-600">Create test and live keys for API access.</p>
      <div className="mt-6">
        <KeyManager
          initialKeys={keys.map((key) => ({
            ...key,
            createdAt: key.createdAt.toISOString(),
          }))}
        />
      </div>
    </main>
  );
}
