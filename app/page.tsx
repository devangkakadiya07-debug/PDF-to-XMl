import Link from 'next/link';
import { FileCheck2, RefreshCcw, ShieldCheck } from 'lucide-react';

export default function Home() {
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

      <section className="bg-zinc-50 py-16">
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

      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-950/95 p-4 shadow-lg">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-950">
                <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-3">
                  <p className="text-xs font-semibold text-zinc-300">
                    Input: standard-invoice.json
                  </p>
                  <span className="rounded-full bg-zinc-800 px-2 py-1 text-[10px] font-semibold text-zinc-400">
                    JSON
                  </span>
                </div>
                <pre className="overflow-x-auto px-4 py-5 text-[13px] leading-relaxed text-zinc-200">
                  <code>
                    <span className="text-zinc-400">{'{'}
</span>
                    <span className="text-emerald-300">  "invoiceNumber"</span>
                    <span className="text-zinc-400">: </span>
                    <span className="text-amber-300">"INV-2041"</span>
                    <span className="text-zinc-400">,
</span>
                    <span className="text-emerald-300">  "taxAmount"</span>
                    <span className="text-zinc-400">: </span>
                    <span className="text-sky-300">184.5</span>
                    <span className="text-zinc-400">,
</span>
                    <span className="text-emerald-300">  "lineItems"</span>
                    <span className="text-zinc-400">: [
</span>
                    <span className="text-zinc-400">    {'{'}
</span>
                    <span className="text-emerald-300">      "description"</span>
                    <span className="text-zinc-400">: </span>
                    <span className="text-amber-300">"Cloud subscription"</span>
                    <span className="text-zinc-400">,
</span>
                    <span className="text-emerald-300">      "quantity"</span>
                    <span className="text-zinc-400">: </span>
                    <span className="text-sky-300">1</span>
                    <span className="text-zinc-400">,
</span>
                    <span className="text-emerald-300">      "netAmount"</span>
                    <span className="text-zinc-400">: </span>
                    <span className="text-sky-300">1290</span>
                    <span className="text-zinc-400">
    },
</span>
                    <span className="text-zinc-400">    {'{'}
</span>
                    <span className="text-emerald-300">      "description"</span>
                    <span className="text-zinc-400">: </span>
                    <span className="text-amber-300">"Onboarding"</span>
                    <span className="text-zinc-400">,
</span>
                    <span className="text-emerald-300">      "quantity"</span>
                    <span className="text-zinc-400">: </span>
                    <span className="text-sky-300">1</span>
                    <span className="text-zinc-400">,
</span>
                    <span className="text-emerald-300">      "netAmount"</span>
                    <span className="text-zinc-400">: </span>
                    <span className="text-sky-300">310</span>
                    <span className="text-zinc-400">
    }
</span>
                    <span className="text-zinc-400">  ]
</span>
                    <span className="text-zinc-400">}
</span>
                  </code>
                </pre>
              </div>

              <div className="rounded-xl border border-zinc-800/80 bg-zinc-950">
                <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-3">
                  <p className="text-xs font-semibold text-zinc-300">
                    Output: UBL 2.1 XML (EN16931)
                  </p>
                  <span className="rounded-full bg-zinc-800 px-2 py-1 text-[10px] font-semibold text-zinc-400">
                    XML
                  </span>
                </div>
                <pre className="overflow-x-auto px-4 py-5 text-[13px] leading-relaxed text-zinc-200">
                  <code>
                    <span className="text-zinc-400">{'<?xml version="1.0" encoding="UTF-8"?>'}
</span>
                    <span className="text-violet-300">&lt;ubl:Invoice</span>
                    <span className="text-zinc-400"> </span>
                    <span className="text-emerald-300">xmlns:ubl</span>
                    <span className="text-zinc-400">=</span>
                    <span className="text-amber-300">"urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"</span>
                    <span className="text-zinc-400">&gt;
</span>
                    <span className="text-violet-300">  &lt;cac:TaxTotal&gt;</span>
                    <span className="text-zinc-400">
</span>
                    <span className="text-violet-300">    &lt;cbc:TaxAmount currencyID="EUR"&gt;</span>
                    <span className="text-sky-300">184.50</span>
                    <span className="text-violet-300">&lt;/cbc:TaxAmount&gt;</span>
                    <span className="text-zinc-400">
</span>
                    <span className="text-violet-300">  &lt;/cac:TaxTotal&gt;</span>
                    <span className="text-zinc-400">
</span>
                    <span className="text-violet-300">  &lt;cac:InvoiceLine&gt;</span>
                    <span className="text-zinc-400">
</span>
                    <span className="text-violet-300">    &lt;cbc:ID&gt;</span>
                    <span className="text-sky-300">1</span>
                    <span className="text-violet-300">&lt;/cbc:ID&gt;</span>
                    <span className="text-zinc-400">
</span>
                    <span className="text-violet-300">    &lt;cbc:LineExtensionAmount currencyID="EUR"&gt;</span>
                    <span className="text-sky-300">1290.00</span>
                    <span className="text-violet-300">&lt;/cbc:LineExtensionAmount&gt;</span>
                    <span className="text-zinc-400">
</span>
                    <span className="text-violet-300">  &lt;/cac:InvoiceLine&gt;</span>
                    <span className="text-zinc-400">
</span>
                    <span className="text-violet-300">&lt;/ubl:Invoice&gt;</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
