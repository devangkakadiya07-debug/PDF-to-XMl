import { describe, expect, it } from 'vitest';
import { generateInvoiceXml } from '@/lib/ubl/generator';

const baseInvoice = {
  invoice_number: 'INV-1',
  issue_date: '2026-05-21',
  currency: 'EUR',
  seller: {
    name: 'Seller',
    endpoint: { id: 'seller-id', scheme_id: '0088' },
    vat_id: 'DE123',
  },
  buyer: {
    name: 'Buyer',
    endpoint: { id: 'buyer-id', scheme_id: '0088' },
    vat_id: 'DE456',
  },
  line_items: [
    {
      id: '1',
      description: 'Service',
      quantity: 1,
      price_amount: 100,
      tax_category: 'S',
      tax_rate: 19,
    },
  ],
};

describe('generateInvoiceXml', () => {
  it('generates peppol xml with mandatory identifiers', () => {
    const xml = generateInvoiceXml('peppol', baseInvoice);

    expect(xml).toContain('cbc:CustomizationID');
    expect(xml).toContain('cbc:ProfileID');
    expect(xml).toContain('urn:fdc:peppol.eu:2017:poacc:billing:01:1.0');
    expect(xml).toContain('<cbc:TaxAmount currencyID="EUR">19.00</cbc:TaxAmount>');
  });

  it('requires buyer_reference for xrechnung', () => {
    expect(() => generateInvoiceXml('xrechnung', baseInvoice)).toThrow('buyer_reference is required for xrechnung');
  });

  it('generates xrechnung with buyer reference when provided', () => {
    const xml = generateInvoiceXml('xrechnung', { ...baseInvoice, buyer_reference: 'BR-1' });

    expect(xml).toContain('<cbc:BuyerReference>BR-1</cbc:BuyerReference>');
    expect(xml).toContain('xrechnung_3.0');
  });
});
