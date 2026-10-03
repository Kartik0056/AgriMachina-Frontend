/**
 * Helper utilities for GST Tax Invoices, Number-to-Words, and Accounting Export (Tally XML, MyBillBook CSV)
 */

export const COMPANY_DETAILS = {
  name: 'Eidula Lifestyle & Spices Pvt. Ltd.',
  brand: 'Eidula',
  addressLine1: 'Eidula Commercial Towers, Sector 62',
  addressLine2: 'Noida, Uttar Pradesh - 201309, India',
  gstin: '07AABCY1234F1Z8',
  cin: 'U72900UP2026PTC198421',
  pan: 'AABCY1234F',
  state: 'Uttar Pradesh',
  stateCode: '09',
  phone: '+91 63952 11953',
  email: 'kartikkumar151998@gmail.com',
  website: 'https://eidula.in',
  bankName: 'HDFC Bank Ltd.',
  accountNumber: '50200084729104',
  ifscCode: 'HDFC0000128',
  branch: 'Commercial Hub Branch'
};

/**
 * Converts numbers into Indian Currency Words (e.g. 24999 -> "Twenty Four Thousand Nine Hundred Ninety Nine Rupees Only")
 */
export const numberToWords = (num) => {
  if (num === null || num === undefined || isNaN(num)) return 'Zero Rupees Only';
  const n = Math.round(Number(num));
  if (n === 0) return 'Zero Rupees Only';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const twoDigits = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tensMultiple = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertTwoDigits = (val) => {
    if (val < 10) return singleDigits[val];
    if (val >= 10 && val < 20) return twoDigits[val - 10];
    const tens = Math.floor(val / 10);
    const ones = val % 10;
    return `${tensMultiple[tens]}${ones ? ' ' + singleDigits[ones] : ''}`;
  };

  const convertThreeDigits = (val) => {
    const hundreds = Math.floor(val / 100);
    const rest = val % 100;
    let res = '';
    if (hundreds > 0) res += `${singleDigits[hundreds]} Hundred`;
    if (rest > 0) res += `${res ? ' and ' : ''}${convertTwoDigits(rest)}`;
    return res;
  };

  let crore = Math.floor(n / 10000000);
  let remainder = n % 10000000;
  let lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;
  let thousand = Math.floor(remainder / 1000);
  let hundreds = remainder % 1000;

  let words = '';
  if (crore > 0) words += `${convertTwoDigits(crore)} Crore `;
  if (lakh > 0) words += `${convertTwoDigits(lakh)} Lakh `;
  if (thousand > 0) words += `${convertTwoDigits(thousand)} Thousand `;
  if (hundreds > 0) words += `${convertThreeDigits(hundreds)} `;

  return `Rupees ${words.trim()} Only`;
};

/**
 * Calculates GST components based on Buyer State vs Seller State (UP - Code 09)
 */
export const calculateGST = (itemTotal, gstPercent = 18, buyerState = 'Uttar Pradesh') => {
  const isIntraState = !buyerState || buyerState.toLowerCase().includes('uttar pradesh') || buyerState.toLowerCase().includes('u.p.');
  const total = Number(itemTotal) || 0;
  const rate = Number(gstPercent) || 18;

  // Tax inclusive formula: Taxable = Total / (1 + Rate / 100)
  const taxableAmount = Math.round((total / (1 + rate / 100)) * 100) / 100;
  const totalTax = Math.round((total - taxableAmount) * 100) / 100;

  if (isIntraState) {
    const halfTax = Math.round((totalTax / 2) * 100) / 100;
    return {
      taxableAmount,
      totalTax,
      cgstRate: rate / 2,
      cgstAmount: halfTax,
      sgstRate: rate / 2,
      sgstAmount: halfTax,
      igstRate: 0,
      igstAmount: 0,
      isIntraState: true
    };
  } else {
    return {
      taxableAmount,
      totalTax,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      igstRate: rate,
      igstAmount: totalTax,
      isIntraState: false
    };
  }
};

/**
 * Generates an XML string formatted for direct import into Tally Prime / Tally.ERP 9 (Gateway of Tally > Import Data > Vouchers)
 */
export const generateTallyXml = (order) => {
  const invoiceNumber = `INV-${order.orderNumber || order._id?.slice(-8).toUpperCase()}`;
  const dateStr = order.createdAt ? new Date(order.createdAt).toISOString().slice(0, 10).replace(/-/g, '') : new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const customerName = order.customerName || order.shippingAddress?.fullName || 'Walk-in Customer';
  const grandTotal = order.pricing?.grandTotal || 0;
  const buyerState = order.shippingAddress?.state || 'Uttar Pradesh';
  const isIntraState = buyerState.toLowerCase().includes('uttar pradesh');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
        <STATICVARIABLES>
          <SVCURRENTCOMPANY>${COMPANY_DETAILS.name}</SVCURRENTCOMPANY>
        </STATICVARIABLES>
      </REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER VCHTYPE="Sales" ACTION="Create" OBJVIEW="Invoice Voucher View">
            <DATE>${dateStr}</DATE>
            <GUID>EIDULA-${order._id || order.orderNumber}</GUID>
            <VOUCHERTYPENAME>Sales</VOUCHERTYPENAME>
            <VOUCHERNUMBER>${invoiceNumber}</VOUCHERNUMBER>
            <REFERENCE>${order.orderNumber || order._id}</REFERENCE>
            <PARTYLEDGERNAME>${customerName}</PARTYLEDGERNAME>
            <PARTYNAME>${customerName}</PARTYNAME>
            <STATENAME>${buyerState}</STATENAME>
            <COUNTRYNAME>India</COUNTRYNAME>
            <PLACEOFSUPPLY>${buyerState}</PLACEOFSUPPLY>
            <BASICBUYERADDRESS>${order.shippingAddress?.street || ''}, ${order.shippingAddress?.villageCity || ''}, ${order.shippingAddress?.district || ''} - ${order.shippingAddress?.pincode || ''}</BASICBUYERADDRESS>
            <NARRATION>E-Commerce Sales Order #${order.orderNumber} via Eidula Platform. Payment Mode: ${order.payment?.method || 'Online'}</NARRATION>
            
            <!-- Customer Debit Ledger -->
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>${customerName}</LEDGERNAME>
              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
              <AMOUNT>-${grandTotal}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>

            <!-- Sales Revenue Credit Ledger -->
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Sales Account - GST</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>${order.pricing?.subtotal || grandTotal}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>

            ${isIntraState ? `
            <!-- CGST Ledger Entry -->
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Output CGST</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>${(order.pricing?.gstTotal / 2) || 0}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>

            <!-- SGST Ledger Entry -->
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Output SGST</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>${(order.pricing?.gstTotal / 2) || 0}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            ` : `
            <!-- IGST Ledger Entry -->
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>Output IGST</LEDGERNAME>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <AMOUNT>${order.pricing?.gstTotal || 0}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            `}
          </VOUCHER>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;

  return xml;
};

/**
 * Generates MyBillBook & Vyapar compatible CSV data from single or multiple orders
 */
export const generateMyBillBookCsv = (ordersInput) => {
  const orders = Array.isArray(ordersInput) ? ordersInput : [ordersInput];

  const headers = [
    'Invoice No',
    'Invoice Date',
    'Customer Name',
    'Customer Phone',
    'Customer Email',
    'Billing Address',
    'State',
    'Pincode',
    'Item Name',
    'Item SKU',
    'HSN Code',
    'Quantity',
    'Unit',
    'Unit Price (₹)',
    'Discount (₹)',
    'Taxable Amount (₹)',
    'GST Rate (%)',
    'CGST (₹)',
    'SGST (₹)',
    'IGST (₹)',
    'Total Amount (₹)',
    'Payment Mode',
    'Payment Status'
  ];

  const rows = [];

  orders.forEach((order) => {
    const invNo = `INV-${order.orderNumber || order._id?.slice(-8).toUpperCase()}`;
    const invDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
    const custName = order.customerName || order.shippingAddress?.fullName || 'Customer';
    const phone = order.customerPhone || order.shippingAddress?.phone || '';
    const email = order.customerEmail || '';
    const address = `"${(order.shippingAddress?.street || '')} ${(order.shippingAddress?.villageCity || '')} ${(order.shippingAddress?.district || '')}"`;
    const state = order.shippingAddress?.state || 'Uttar Pradesh';
    const pincode = order.shippingAddress?.pincode || '';
    const payMode = order.payment?.method || 'COD';
    const payStatus = order.payment?.status || 'Paid';

    (order.items || []).forEach((item) => {
      const gst = calculateGST(item.subtotal || (item.price * item.quantity), item.gstPercent || 18, state);
      rows.push([
        invNo,
        invDate,
        `"${custName}"`,
        phone,
        email,
        address,
        state,
        pincode,
        `"${item.name || 'Product'}"`,
        item.sku || 'N/A',
        item.hsnCode || '8432',
        item.quantity || 1,
        item.unit || 'PCS',
        item.price || 0,
        0,
        gst.taxableAmount,
        item.gstPercent || 18,
        gst.cgstAmount,
        gst.sgstAmount,
        gst.igstAmount,
        item.subtotal || (item.price * item.quantity),
        payMode,
        payStatus
      ].join(','));
    });
  });

  return [headers.join(','), ...rows].join('\n');
};

/**
 * Browser file download helper
 */
export const downloadFile = (content, filename, mimeType = 'text/plain;charset=utf-8;') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
