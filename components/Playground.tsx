'use client';

import { useState } from 'react';

const sample = {
  profile: 'peppol',
  invoice: {
    invoice_number: 'INV-1000',
    issue_date: '2026-05-21',
    due_date: '2026-06-20',
    currency: 'EUR',
    seller: {
      name: 'Seller GmbH',
      endpoint: { id: '9915:DE123456789', scheme_id: '0088' },
      country_code: 'DE',
      vat_id: 'DE123456789',
    },
    buyer: {
      name: 'Buyer GmbH',
      endpoint: { id: '9915:DE987654321', scheme_id: '0088' },
      country_code: 'DE',
      vat_id: 'DE987654321',
    },
    line_items: [
      {
        id: '1',
        description: 'Consulting',
        quantity: 1,
        price_amount: 100,
        tax_category: 'S',
        tax_rate: 19,
      },
    ],
  },
};

export default function Playground() {
  const [apiKey, setApiKey] = useState('');
  const [jsonInput, setJsonInput] = useState(JSON.stringify(sample, null, 2));
  const [xmlOutput, setXmlOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const runConvert = async () => {
    setLoading(true);
    setError('');
    setXmlOutput('');

    try {
      const payload = JSON.parse(jsonInput);
      const response = await fetch('/api/v1/convert', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      if (!response.ok) {
        setError(text);
      } else {
        setXmlOutput(text);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Invalid JSON payload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-3">
      <input
        className="rounded border p-2"
        placeholder="Paste API key (test_... or live_...)"
        value={apiKey}
        onChange={(event) => setApiKey(event.target.value)}
      />
      <textarea
        className="min-h-72 rounded border p-2 font-mono text-sm"
        value={jsonInput}
        onChange={(event) => setJsonInput(event.target.value)}
      />
      <button
        className="w-fit rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        onClick={runConvert}
        disabled={loading}
      >
        {loading ? 'Converting…' : 'Convert JSON → XML'}
      </button>
      {error ? <pre className="rounded bg-red-50 p-3 text-xs text-red-700">{error}</pre> : null}
      {xmlOutput ? <pre className="overflow-auto rounded bg-zinc-100 p-3 text-xs">{xmlOutput}</pre> : null}
    </div>
  );
}
