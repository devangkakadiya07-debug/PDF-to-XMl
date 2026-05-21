import Playground from '@/components/Playground';

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <div className="flex justify-end p-4">
        <a href="/dashboard/keys" className="bg-black text-white px-4 py-2 rounded">
          Get API Key / Login
        </a>
      </div>
      <h1 className="text-3xl font-semibold">EN16931 XML API</h1>
      <p className="mt-2 text-zinc-600">
        JSON-in, compliant UBL 2.1 XML-out for Peppol BIS Billing 3.0 and XRechnung.
      </p>

      <section className="mt-8 grid gap-4 rounded border p-4">
        <h2 className="text-xl font-semibold">Playground</h2>
        <Playground />
      </section>
    </main>
  );
}
