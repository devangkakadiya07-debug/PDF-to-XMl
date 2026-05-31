import Link from 'next/link';
import { FileCheck2, RefreshCcw, ShieldCheck } from 'lucide-react';
import CodePanel from '@/components/CodePanel';

export default function Home() {
  const convertRequestExample = `{
  "profile": "xrechnung",
  "invoice": {
    "invoice_number": "INV-2041",
    "issue_date": "2026-05-21",
    "currency": "EUR",
    "buyer_reference": "BR-2026-001",
    "seller": {
      "name": "Moonlight Labs GmbH",
      "endpoint": { "id": "991-123456789", "scheme_id": "0088" },
      "vat_id": "DE123456789"
    },
    "buyer": {
      "name": "Acme Fintech Ltd",
      "endpoint": { "id": "993-987654321", "scheme_id": "0088" },
      "vat_id": "DE987654321"
    },
    "line_items": [
      {
        "id": "1",
        "description": "Platform subscription",
        "quantity": 1,
        "price_amount": 1290,
        "tax_category": "S",
        "tax_rate": 19
      },
      {
        "id": "2",
        "description": "Onboarding",
        "quantity": 1,
        "price_amount": 310,
        "tax_category": "S",
        "tax_rate": 19
      }
    ]
  }
}`.trim();

  const convertResponseExample = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0</cbc:CustomizationID>
  <cbc:ProfileID>urn:fdc:xoev-de:kosit:standard:xrechnung_3.0</cbc:ProfileID>
  <cbc:ID>INV-2041</cbc:ID>
  <cbc:IssueDate>2026-05-21</cbc:IssueDate>
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>
  <cbc:BuyerReference>BR-2026-001</cbc:BuyerReference>
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cbc:EndpointID schemeID="0088">991-123456789</cbc:EndpointID>
      <cac:PartyName>
        <cbc:Name>Moonlight Labs GmbH</cbc:Name>
      </cac:PartyName>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>DE123456789</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cbc:EndpointID schemeID="0088">993-987654321</cbc:EndpointID>
      <cac:PartyName>
        <cbc:Name>Acme Fintech Ltd</cbc:Name>
      </cac:PartyName>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>DE987654321</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
    </cac:Party>
  </cac:AccountingCustomerParty>
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="EUR">304.00</cbc:TaxAmount>
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="EUR">1600.00</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="EUR">304.00</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:ID>S</cbc:ID>
        <cbc:Percent>19.00</cbc:Percent>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>
  </cac:TaxTotal>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="EUR">1600.00</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="EUR">1600.00</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="EUR">1904.00</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="EUR">1904.00</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
  <cac:InvoiceLine>
    <cbc:ID>1</cbc:ID>
    <cbc:InvoicedQuantity unitCode="EA">1.00</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="EUR">1290.00</cbc:LineExtensionAmount>
    <cac:TaxTotal>
      <cbc:TaxAmount currencyID="EUR">245.10</cbc:TaxAmount>
    </cac:TaxTotal>
    <cac:Item>
      <cbc:Name>Platform subscription</cbc:Name>
      <cac:ClassifiedTaxCategory>
        <cbc:ID>S</cbc:ID>
        <cbc:Percent>19.00</cbc:Percent>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:ClassifiedTaxCategory>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="EUR">1290.00</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>
  <cac:InvoiceLine>
    <cbc:ID>2</cbc:ID>
    <cbc:InvoicedQuantity unitCode="EA">1.00</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="EUR">310.00</cbc:LineExtensionAmount>
    <cac:TaxTotal>
      <cbc:TaxAmount currencyID="EUR">58.90</cbc:TaxAmount>
    </cac:TaxTotal>
    <cac:Item>
      <cbc:Name>Onboarding</cbc:Name>
      <cac:ClassifiedTaxCategory>
        <cbc:ID>S</cbc:ID>
        <cbc:Percent>19.00</cbc:Percent>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:ClassifiedTaxCategory>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="EUR">310.00</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>
</Invoice>`.trim();

  return (
    <main className="bg-white">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-16 pt-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
          EN16931 XML API
        </p>
        <h1 className="mt-5 max-w-4xl text-pretty text-4xl font-semibold leading-tight text-zinc-900 sm:text-5xl">
          Convert Invoices to Legally Compliant EN16931 XML via Simple JSON API.
        </h1>
        <p className="mt-5 max-w-3xl text-pretty text-base text-zinc-500 sm:text-lg">
          Stop reading dense EU e-invoicing schemas. Generate flawless XRechnung and
          Peppol-compliant UBL 2.1 XML with a single POST request. Built for modern ERPs and
          SaaS platforms.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-900"
          >
            Get Free API Key
          </Link>
          <Link
            href="/#documentation"
            className="rounded-md border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-400 hover:bg-zinc-50"
          >
            Read Docs
          </Link>
        </div>
      </section>

      <section id="features" className="bg-zinc-50 py-16">
        <div className="mx-auto w-full max-w-5xl px-6">
          <h2 className="text-center text-2xl font-semibold text-zinc-900 sm:text-3xl">
            Meet the 2025/2026 EU E-Invoicing Mandates Instantly.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-zinc-900">100% Tax-Compliant</h3>
              <p className="mt-3 text-sm text-zinc-600">
                Fully supports EN16931 profiles including German XRechnung, French Chorus Pro
                formats, and global Peppol BIS Billing 3.0.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
                <RefreshCcw className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-zinc-900">
                Zero Regulatory Maintenance
              </h3>
              <p className="mt-3 text-sm text-zinc-600">
                When the EU updates e-invoicing schemas, we update our backend engine. Your
                code never breaks.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-900">
                <FileCheck2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-zinc-900">Automated Validation</h3>
              <p className="mt-3 text-sm text-zinc-600">
                Every response is pre-validated against official schematrons before it hits your
                server.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="documentation" className="bg-zinc-50 py-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
                  Documentation
                </p>
                <h2 className="mt-4 text-3xl font-semibold text-zinc-900 sm:text-4xl">
                  Developer API Reference
                </h2>
                <p className="mt-4 text-base text-zinc-600">
                  Build with one endpoint and a strict payload that maps directly to EN16931
                  UBL 2.1. Every response is returned as deterministic UBL XML with
                  predictable totals and tax grouping.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-200/70 px-6 py-5">
                  <h3 className="text-base font-semibold text-zinc-900">Authentication</h3>
                  <p className="mt-2 text-sm text-zinc-600">
                    Send your API key in the Authorization header. Test keys are scoped to
                    sandbox usage and do not count toward live quotas.
                  </p>
                  <p className="mt-3 text-sm text-zinc-600">
                    <span className="font-medium text-zinc-900">Header:</span>{' '}
                    <span className="font-mono text-zinc-800">
                      Authorization: Bearer YOUR_API_KEY
                    </span>
                  </p>
                </div>

                <div className="border-b border-zinc-200/70 px-6 py-5">
                  <h3 className="text-base font-semibold text-zinc-900">Endpoints</h3>
                  <p className="mt-2 text-sm text-zinc-600">
                    POST /api/v1/convert accepts JSON and returns application/xml. Select a
                    profile and send the invoice payload shown on the right.
                  </p>
                  <div className="mt-3 grid gap-2 text-sm text-zinc-600">
                    <p>
                      <span className="font-medium text-zinc-900">profile:</span> peppol | xrechnung
                    </p>
                    <p>
                      <span className="font-medium text-zinc-900">buyer_reference:</span> required
                      for xrechnung
                    </p>
                  </div>
                </div>

                <div className="px-6 py-5">
                  <h3 className="text-base font-semibold text-zinc-900">Error Codes</h3>
                  <dl className="mt-3 grid gap-2 text-sm text-zinc-600">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="font-medium text-zinc-900">400</dt>
                      <dd>Invalid payload or validation error.</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="font-medium text-zinc-900">401</dt>
                      <dd>Missing or invalid API key.</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="font-medium text-zinc-900">429</dt>
                      <dd>Rate limit exceeded or monthly quota reached.</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm">
                <div className="grid gap-4">
                  <CodePanel
                    title="POST /api/v1/convert"
                    language="JSON"
                    code={convertRequestExample}
                  />
                  <CodePanel
                    title="Response: UBL 2.1 XML"
                    language="XML"
                    code={convertResponseExample}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 sm:py-32">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
              Pricing
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-zinc-900 sm:text-4xl">
              Transparent Pricing. No Surprises.
            </h2>
            <p className="mt-3 text-sm text-zinc-500">
              Start in sandbox, then scale production usage when you are ready.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">Sandbox Tier</h3>
                  <p className="mt-1 text-sm text-zinc-500">Validate integrations risk-free.</p>
                </div>
                <span className="text-2xl font-semibold text-zinc-900">$0</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                <li>100 test requests per month</li>
                <li>No production usage</li>
              </ul>
              <Link
                href="/dashboard"
                className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-zinc-400 hover:bg-zinc-50"
              >
                Start Testing
              </Link>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">Pro Tier</h3>
                  <p className="mt-1 text-sm text-zinc-500">Production-ready scale.</p>
                </div>
                <span className="text-2xl font-semibold text-zinc-900">$49/mo</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                <li>1,000 production conversions per month</li>
                <li>Email support</li>
                <li>Unlimited sandbox usage</li>
              </ul>
              <Link
                href="/dashboard"
                className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-900"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
