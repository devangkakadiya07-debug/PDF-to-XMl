export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 prose prose-zinc">
      <h1>Terms of Service</h1>
      <p>
        These Terms of Service govern your access to and use of UBL API, a B2B API for converting
        JSON to EN16931 UBL 2.1 XML.
      </p>

      <h2>Service Scope</h2>
      <p>
        The service provides schema formatting and transformation of your JSON payloads into
        compliant XML structures. You are responsible for the source data you provide and for
        validating outputs within your own business context.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        We are not tax advisors. The API provides schema formatting only. You are solely
        responsible for the legal validity, tax accuracy, and final submission of invoices to
        government gateways such as Peppol or XRechnung. We are not liable for rejected invoices,
        penalties, or tax assessments arising from your use of the service.
      </p>

      <h2>Abuse and Prohibited Activities</h2>
      <p>
        Reverse engineering the API, attempting to bypass rate limits, or using the service for
        illegal activities will result in immediate account termination.
      </p>

      <h2>Governing Law</h2>
      <p>These terms are governed by the laws of India.</p>
    </main>
  );
}
