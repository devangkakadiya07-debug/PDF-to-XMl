export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 prose prose-zinc">
      <h1>Privacy Policy</h1>
      <p>
        This Privacy Policy explains how UBL API processes data for business customers. UBL API
        acts as a Data Processor and you are the Data Controller for any invoice data you submit.
      </p>

      <h2>In-Memory Processing and Data Storage</h2>
      <p>
        UBL API uses in-memory processing only. We receive the JSON payload, generate the XML,
        and immediately drop the payload. We do not store, log, or train AI on any invoice data,
        personally identifiable information, or financial records submitted to the API.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        We use Clerk for user authentication, which processes basic account information such as
        name and email. We use Paddle as our Merchant of Record for billing. We do not store
        credit card numbers on our servers.
      </p>

      <h2>Contact</h2>
      <p>If you have questions about this policy or data handling, contact support@ublapi.com.</p>
    </main>
  );
}
