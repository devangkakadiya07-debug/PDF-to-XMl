export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-zinc-700">
      <h1 className="mb-8 text-4xl font-bold tracking-tight text-zinc-900">Privacy Policy</h1>
      
      <div className="space-y-8 text-base leading-relaxed">
        <p>This Privacy Policy explains how UBL API processes data for business customers. UBL API acts as a Data Processor and you are the Data Controller for any invoice data you submit.</p>
        
        <section>
          <h2 className="mb-3 text-2xl font-semibold text-zinc-900">In-Memory Processing and Data Storage</h2>
          <p>UBL API uses in-memory processing only. We receive the JSON payload, generate the XML, and immediately drop the payload. We do not store, log, or train AI on any invoice data, personally identifiable information, or financial records submitted to the API.</p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-zinc-900">Third-Party Services</h2>
          <p>We use Clerk for user authentication, which processes basic account information such as name and email. We use Paddle as our Merchant of Record for billing. We do not store credit card numbers on our servers.</p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-zinc-900">Contact</h2>
          <p>If you have questions about this policy or data handling, contact <a href="mailto:support@ublapi.com" className="font-medium text-black underline underline-offset-4">support@ublapi.com</a>.</p>
        </section>
      </div>
    </main>
  );
}
