export default function RefundPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-zinc-700">
      <h1 className="mb-8 text-4xl font-bold tracking-tight text-zinc-900">Refund Policy</h1>
      
      <div className="space-y-8 text-base leading-relaxed">
        <p>This policy applies to UBL API subscriptions and usage-based credits provided on a business-to-business basis.</p>
        
        <section>
          <h2 className="mb-3 text-2xl font-semibold text-zinc-900">B2B Digital Service</h2>
          <p>Because this is a B2B digital API, all sales are generally final once API credits have been utilized.</p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-zinc-900">14-Day Exception</h2>
          <p>We offer a 14-day refund policy for the most recent subscription charge only if zero API calls have been made in that billing cycle.</p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold text-zinc-900">Contact</h2>
          <p>Support requests and refund inquiries must be sent to <a href="mailto:support@ublapi.com" className="font-medium text-black underline underline-offset-4">support@ublapi.com</a>.</p>
        </section>
      </div>
    </main>
  );
}