import { create } from 'xmlbuilder2';
import type { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

export type InvoiceProfile = 'peppol' | 'xrechnung';

type Endpoint = { id: string; scheme_id: string };
type Party = {
  name: string;
  endpoint: Endpoint;
  street?: string;
  city?: string;
  postal_code?: string;
  country_code?: string;
  vat_id?: string;
};

type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unit_code?: string;
  price_amount: number;
  tax_category: string;
  tax_rate: number;
};

export type InvoicePayload = {
  invoice_number: string;
  issue_date: string;
  due_date?: string;
  currency: string;
  buyer_reference?: string;
  seller: Party;
  buyer: Party;
  line_items: LineItem[];
};

function profileMeta(profile: InvoiceProfile) {
  if (profile === 'peppol') {
    return {
      customizationId:
        'urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0',
      profileId: 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0',
    };
  }

  return {
    customizationId: 'urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0',
    profileId: 'urn:fdc:xoev-de:kosit:standard:xrechnung_3.0',
  };
}

function money(value: number) {
  return value.toFixed(2);
}

function requireEndpoint(name: string, endpoint: Endpoint) {
  if (!endpoint?.id || !endpoint?.scheme_id) {
    throw new Error(`${name} endpoint id and scheme_id are required`);
  }
}

function appendAddress(parent: XMLBuilder, party: Party) {
  if (!party.street && !party.city && !party.postal_code && !party.country_code) return;

  const address = parent.ele('cac:PostalAddress');
  if (party.street) address.ele('cbc:StreetName').txt(party.street);
  if (party.city) address.ele('cbc:CityName').txt(party.city);
  if (party.postal_code) address.ele('cbc:PostalZone').txt(party.postal_code);
  if (party.country_code) {
    address.ele('cac:Country').ele('cbc:IdentificationCode').txt(party.country_code);
  }
}

function appendParty(parent: XMLBuilder, party: Party) {
  const partyEl = parent.ele('cac:Party');
  partyEl.ele('cbc:EndpointID', { schemeID: party.endpoint.scheme_id }).txt(party.endpoint.id);
  partyEl.ele('cac:PartyName').ele('cbc:Name').txt(party.name);

  appendAddress(partyEl, party);

  if (party.vat_id) {
    partyEl
      .ele('cac:PartyTaxScheme')
      .ele('cbc:CompanyID')
      .txt(party.vat_id)
      .up()
      .ele('cac:TaxScheme')
      .ele('cbc:ID')
      .txt('VAT');
  }
}

export function generateInvoiceXml(profile: InvoiceProfile, invoice: InvoicePayload) {
  requireEndpoint('Seller', invoice.seller.endpoint);
  requireEndpoint('Buyer', invoice.buyer.endpoint);

  if (profile === 'xrechnung' && !invoice.buyer_reference) {
    throw new Error('buyer_reference is required for xrechnung');
  }

  const meta = profileMeta(profile);

  const lineTotals = invoice.line_items.map((item) => item.quantity * item.price_amount);
  const taxableAmount = lineTotals.reduce((sum, current) => sum + current, 0);

  const groupedTax = invoice.line_items.reduce<Record<string, { category: string; rate: number; taxable: number; tax: number }>>(
    (acc, item) => {
      const key = `${item.tax_category}:${item.tax_rate}`;
      const taxable = item.quantity * item.price_amount;
      const tax = taxable * (item.tax_rate / 100);

      if (!acc[key]) {
        acc[key] = {
          category: item.tax_category,
          rate: item.tax_rate,
          taxable: 0,
          tax: 0,
        };
      }

      acc[key].taxable += taxable;
      acc[key].tax += tax;
      return acc;
    },
    {},
  );

  const totalTaxAmount = Object.values(groupedTax).reduce((sum, current) => sum + current.tax, 0);
  const payableAmount = taxableAmount + totalTaxAmount;

  const root = create({ version: '1.0', encoding: 'UTF-8' }).ele('Invoice', {
    xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
    'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
    'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
  });

  root.ele('cbc:CustomizationID').txt(meta.customizationId);
  root.ele('cbc:ProfileID').txt(meta.profileId);
  root.ele('cbc:ID').txt(invoice.invoice_number);
  root.ele('cbc:IssueDate').txt(invoice.issue_date);
  if (invoice.due_date) root.ele('cbc:DueDate').txt(invoice.due_date);
  root.ele('cbc:InvoiceTypeCode').txt('380');
  root.ele('cbc:DocumentCurrencyCode').txt(invoice.currency);

  if (invoice.buyer_reference) root.ele('cbc:BuyerReference').txt(invoice.buyer_reference);

  appendParty(root.ele('cac:AccountingSupplierParty'), invoice.seller);
  appendParty(root.ele('cac:AccountingCustomerParty'), invoice.buyer);

  const taxTotal = root.ele('cac:TaxTotal');
  taxTotal.ele('cbc:TaxAmount', { currencyID: invoice.currency }).txt(money(totalTaxAmount));

  Object.values(groupedTax).forEach((group) => {
    const subtotal = taxTotal.ele('cac:TaxSubtotal');
    subtotal.ele('cbc:TaxableAmount', { currencyID: invoice.currency }).txt(money(group.taxable));
    subtotal.ele('cbc:TaxAmount', { currencyID: invoice.currency }).txt(money(group.tax));

    const category = subtotal.ele('cac:TaxCategory');
    category.ele('cbc:ID').txt(group.category);
    category.ele('cbc:Percent').txt(money(group.rate));
    category.ele('cac:TaxScheme').ele('cbc:ID').txt('VAT');
  });

  const legalMonetaryTotal = root.ele('cac:LegalMonetaryTotal');
  legalMonetaryTotal
    .ele('cbc:LineExtensionAmount', { currencyID: invoice.currency })
    .txt(money(taxableAmount));
  legalMonetaryTotal.ele('cbc:TaxExclusiveAmount', { currencyID: invoice.currency }).txt(money(taxableAmount));
  legalMonetaryTotal.ele('cbc:TaxInclusiveAmount', { currencyID: invoice.currency }).txt(money(payableAmount));
  legalMonetaryTotal.ele('cbc:PayableAmount', { currencyID: invoice.currency }).txt(money(payableAmount));

  invoice.line_items.forEach((item, index) => {
    const lineExtension = item.quantity * item.price_amount;
    const taxAmount = lineExtension * (item.tax_rate / 100);

    const line = root.ele('cac:InvoiceLine');
    line.ele('cbc:ID').txt(item.id || String(index + 1));
    line.ele('cbc:InvoicedQuantity', { unitCode: item.unit_code || 'EA' }).txt(money(item.quantity));
    line.ele('cbc:LineExtensionAmount', { currencyID: invoice.currency }).txt(money(lineExtension));

    const taxTotalLine = line.ele('cac:TaxTotal');
    taxTotalLine.ele('cbc:TaxAmount', { currencyID: invoice.currency }).txt(money(taxAmount));

    const itemEl = line.ele('cac:Item');
    itemEl.ele('cbc:Name').txt(item.description);

    const classifiedTax = itemEl.ele('cac:ClassifiedTaxCategory');
    classifiedTax.ele('cbc:ID').txt(item.tax_category);
    classifiedTax.ele('cbc:Percent').txt(money(item.tax_rate));
    classifiedTax.ele('cac:TaxScheme').ele('cbc:ID').txt('VAT');

    line.ele('cac:Price').ele('cbc:PriceAmount', { currencyID: invoice.currency }).txt(money(item.price_amount));
  });

  return root.end({ prettyPrint: true });
}
