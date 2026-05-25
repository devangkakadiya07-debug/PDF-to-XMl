import KeyManager from './KeyManager';
import { getKeys } from '@/app/(dashboard)/actions';

export default async function KeysPage() {
  const keys = await getKeys();

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">API Keys</h2>
        <p className="mt-2 text-sm text-zinc-600">Create test and live keys for API access.</p>
      </div>
      <KeyManager
        initialKeys={keys.map((key) => ({
          ...key,
          createdAt: key.createdAt.toISOString(),
        }))}
      />
    </section>
  );
}
