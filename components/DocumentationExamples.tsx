'use client';

import CodePanel from '@/components/CodePanel';

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

export default function DocumentationExamples() {
  return (
    <div className="min-w-0 max-w-full rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm sm:p-5">
      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
        <CodePanel title="POST /api/v1/convert" language="JSON" code={convertRequestExample} />
        <CodePanel title="Response: UBL 2.1 XML" language="XML" code={convertResponseExample} />
      </div>
    </div>
  );
}