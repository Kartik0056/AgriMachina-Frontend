import React, { useRef } from 'react';
import {
  Printer,
  Download,
  FileSpreadsheet,
  FileCode,
  X,
  CheckCircle2,
  Building2,
  ShieldCheck,
  CreditCard,
  QrCode
} from 'lucide-react';
import SiddhivaLogo from './SiddhivaLogo';
import {
  COMPANY_DETAILS,
  numberToWords,
  calculateGST,
  generateTallyXml,
  generateMyBillBookCsv,
  downloadFile
} from '../../services/invoiceHelper';
import { formatINR } from '../../services/emiHelper';
import { useToast } from '../../context/ToastContext';

const GSTInvoiceModal = ({ isOpen, onClose, order }) => {
  const invoiceRef = useRef(null);
  const { addToast } = useToast();

  if (!isOpen || !order) return null;

  const invoiceNumber = `INV-${order.orderNumber || order._id?.slice(-8).toUpperCase()}`;
  const invoiceDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-IN');

  const buyerState = order.shippingAddress?.state || 'Uttar Pradesh';
  const isIntraState =
    !buyerState ||
    buyerState.toLowerCase().includes('uttar pradesh') ||
    buyerState.toLowerCase().includes('u.p.');

  const items = order.items || [];
  const grandTotal = order.pricing?.grandTotal || 0;
  const subtotal = order.pricing?.subtotal || grandTotal;
  const totalGst = order.pricing?.gstTotal || 0;
  const shippingFee = order.pricing?.shippingFee || 0;
  const discountTotal = (order.pricing?.discountTotal || 0) + (order.pricing?.couponDiscount || 0);

  const amountInWords = numberToWords(grandTotal);

  const handlePrint = () => {
    window.print();
  };

  const handleExportTally = () => {
    try {
      const xml = generateTallyXml(order);
      downloadFile(xml, `Tally-Voucher-${order.orderNumber}.xml`, 'application/xml');
      addToast('Tally Prime XML voucher exported successfully!', 'success');
    } catch (err) {
      addToast('Failed to export Tally XML', 'error');
    }
  };

  const handleExportMyBillBook = () => {
    try {
      const csv = generateMyBillBookCsv(order);
      downloadFile(csv, `MyBillBook-${order.orderNumber}.csv`, 'text/csv;charset=utf-8;');
      addToast('MyBillBook CSV invoice exported successfully!', 'success');
    } catch (err) {
      addToast('Failed to export MyBillBook CSV', 'error');
    }
  };

  return (
    <div
      className="gst-invoice-modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(5px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto'
      }}
    >
      {/* Print Stylesheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .gst-invoice-printable, .gst-invoice-printable * {
            visibility: visible;
          }
          .gst-invoice-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .gst-invoice-modal-backdrop {
            position: static !important;
            background: transparent !important;
            padding: 0 !important;
          }
          .hide-on-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        className="gst-invoice-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden'
        }}
      >
        {/* Top Floating Action Bar */}
        <div
          className="hide-on-print flex items-center justify-between"
          style={{
            padding: '1rem 1.5rem',
            background: 'linear-gradient(135deg, #091e14, #14532d)',
            color: '#ffffff',
            borderBottom: '2px solid #22c55e',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={22} color="#86efac" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
                GST Tax Invoice & Accounting Portal
              </div>
              <div style={{ fontSize: '0.725rem', color: '#bbf7d0' }}>
                Official GST Compliant Invoice • Ready for Print, Tally Prime & MyBillBook
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-sm"
              style={{
                background: '#22c55e',
                color: '#ffffff',
                fontWeight: 800,
                border: 'none',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem'
              }}
              title="Print A4 Tax Invoice / Save as PDF"
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>

            {/* MyBillBook Export */}
            <button
              type="button"
              onClick={handleExportMyBillBook}
              className="btn btn-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                fontWeight: 700,
                gap: '0.4rem',
                padding: '0.45rem 0.75rem'
              }}
              title="Export formatted CSV for MyBillBook & Vyapar"
            >
              <FileSpreadsheet size={15} color="#fef08a" />
              <span>MyBillBook CSV</span>
            </button>

            {/* Tally XML Export */}
            <button
              type="button"
              onClick={handleExportTally}
              className="btn btn-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                fontWeight: 700,
                gap: '0.4rem',
                padding: '0.45rem 0.75rem'
              }}
              title="Export XML Voucher for Tally Prime / Tally ERP 9"
            >
              <FileCode size={15} color="#38bdf8" />
              <span>Tally XML</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer'
              }}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Content */}
        <div
          ref={invoiceRef}
          className="gst-invoice-printable"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '2rem 2.25rem',
            color: '#1e293b',
            background: '#ffffff',
            fontSize: '0.825rem',
            lineHeight: 1.45
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              borderBottom: '2px solid #0f172a',
              paddingBottom: '1.25rem',
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ marginBottom: '0.5rem' }}>
                <SiddhivaLogo size="md" />
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                {COMPANY_DETAILS.name}
              </div>
              <div style={{ color: '#475569', fontSize: '0.785rem' }}>
                {COMPANY_DETAILS.addressLine1}
              </div>
              <div style={{ color: '#475569', fontSize: '0.785rem' }}>
                {COMPANY_DETAILS.addressLine2}
              </div>
              <div style={{ marginTop: '0.35rem', fontWeight: 700, color: '#0f172a', fontSize: '0.8rem' }}>
                GSTIN: <span style={{ color: '#166534' }}>{COMPANY_DETAILS.gstin}</span> | State: {COMPANY_DETAILS.state} ({COMPANY_DETAILS.stateCode})
              </div>
              <div style={{ color: '#475569', fontSize: '0.75rem' }}>
                CIN: {COMPANY_DETAILS.cin} | PAN: {COMPANY_DETAILS.pan}
              </div>
              <div style={{ color: '#475569', fontSize: '0.75rem' }}>
                Email: {COMPANY_DETAILS.email} | Phone: {COMPANY_DETAILS.phone}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: '#0f172a',
                  color: '#ffffff',
                  padding: '0.35rem 1rem',
                  borderRadius: '6px',
                  fontWeight: 900,
                  fontSize: '1rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem'
                }}
              >
                TAX INVOICE
              </div>
              <div style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                (Original for Recipient)
              </div>

              <div style={{ marginTop: '0.75rem', fontSize: '0.825rem' }}>
                <div>
                  <strong>Invoice No:</strong> <span style={{ color: '#166534', fontWeight: 800 }}>{invoiceNumber}</span>
                </div>
                <div>
                  <strong>Invoice Date:</strong> {invoiceDate}
                </div>
                <div>
                  <strong>Order ID:</strong> #{order.orderNumber}
                </div>
                <div>
                  <strong>Place of Supply:</strong> {buyerState}
                </div>
              </div>
            </div>
          </div>

          {/* Buyer & Consignee Details */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1.25rem'
            }}
          >
            <div>
              <div style={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
                Billed To (Customer Details):
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                {order.customerName || order.shippingAddress?.fullName || 'Customer'}
              </div>
              <div style={{ color: '#475569' }}>
                {order.shippingAddress?.street || ''}
                {order.shippingAddress?.villageCity ? `, ${order.shippingAddress.villageCity}` : ''}
              </div>
              <div style={{ color: '#475569' }}>
                {order.shippingAddress?.district ? `${order.shippingAddress.district}, ` : ''}
                {order.shippingAddress?.state || buyerState} - {order.shippingAddress?.pincode || ''}
              </div>
              <div style={{ color: '#475569', marginTop: '0.2rem' }}>
                <strong>Mobile:</strong> {order.customerPhone || order.shippingAddress?.phone || 'N/A'}
              </div>
              {order.customerEmail && (
                <div style={{ color: '#475569' }}>
                  <strong>Email:</strong> {order.customerEmail}
                </div>
              )}
            </div>

            <div>
              <div style={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', fontSize: '0.75rem', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
                Payment & Dispatch Info:
              </div>
              <div style={{ color: '#475569' }}>
                <strong>Payment Mode:</strong> {order.payment?.method || 'Online'}
              </div>
              <div style={{ color: '#475569' }}>
                <strong>Payment Status:</strong>{' '}
                <span
                  style={{
                    color: order.payment?.status === 'Paid' ? '#166534' : '#b45309',
                    fontWeight: 700
                  }}
                >
                  {order.payment?.status || 'Pending'}
                </span>
              </div>
              {order.payment?.transactionId && (
                <div style={{ color: '#475569' }}>
                  <strong>Txn Ref:</strong> {order.payment.transactionId}
                </div>
              )}
              <div style={{ color: '#475569' }}>
                <strong>Carrier:</strong> {order.tracking?.courierName || 'Siddhiva Express Dispatch'}
              </div>
              {order.tracking?.trackingNumber && (
                <div style={{ color: '#475569' }}>
                  <strong>AWB No:</strong> {order.tracking.trackingNumber}
                </div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '1.25rem',
              fontSize: '0.785rem'
            }}
          >
            <thead>
              <tr style={{ background: '#0f172a', color: '#ffffff' }}>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'center', width: '35px' }}>#</th>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Item Description & SKU</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>HSN/SAC</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>Rate (₹)</th>
                <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>Taxable (₹)</th>
                {isIntraState ? (
                  <>
                    <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>CGST</th>
                    <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>SGST</th>
                  </>
                ) : (
                  <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>IGST</th>
                )}
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const qty = item.quantity || 1;
                const price = item.price || 0;
                const itemTotal = item.subtotal || price * qty;
                const gstRate = item.gstPercent || 18;
                const gst = calculateGST(itemTotal, gstRate, buyerState);

                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      background: idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                    }}
                  >
                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center', color: '#64748b' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        SKU: {item.sku || 'N/A'} {item.variantName ? `• ${item.variantName}` : ''}
                      </div>
                    </td>
                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center', color: '#475569' }}>
                      {item.hsnCode || '8432'}
                    </td>
                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center', fontWeight: 700 }}>
                      {qty} {item.unit || 'PCS'}
                    </td>
                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#475569' }}>
                      {formatINR(price)}
                    </td>
                    <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', fontWeight: 600 }}>
                      {formatINR(gst.taxableAmount)}
                    </td>
                    {isIntraState ? (
                      <>
                        <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#475569' }}>
                          <div>{formatINR(gst.cgstAmount)}</div>
                          <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>@{gst.cgstRate}%</div>
                        </td>
                        <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#475569' }}>
                          <div>{formatINR(gst.sgstAmount)}</div>
                          <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>@{gst.sgstRate}%</div>
                        </td>
                      </>
                    ) : (
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#475569' }}>
                        <div>{formatINR(gst.igstAmount)}</div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>@{gst.igstRate}%</div>
                      </td>
                    )}
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                      {formatINR(itemTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals & Tax Summary Breakdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.25rem'
            }}
          >
            {/* Amount In Words & Bank Details */}
            <div className="flex flex-col justify-between" style={{ gap: '0.75rem' }}>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '0.75rem'
                }}
              >
                <div style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Invoice Total in Words:
                </div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem', marginTop: '2px' }}>
                  {amountInWords}
                </div>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '0.75rem'
                }}
              >
                <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                  Company Bank Details (for NEFT / RTGS):
                </div>
                <div><strong>Bank Name:</strong> {COMPANY_DETAILS.bankName}</div>
                <div><strong>A/C No:</strong> {COMPANY_DETAILS.accountNumber}</div>
                <div><strong>IFSC Code:</strong> {COMPANY_DETAILS.ifscCode}</div>
                <div><strong>Branch:</strong> {COMPANY_DETAILS.branch}</div>
              </div>
            </div>

            {/* Financial Summary */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: '#475569' }}>Total Taxable Value:</span>
                <span style={{ fontWeight: 700 }}>{formatINR(subtotal - totalGst)}</span>
              </div>
              {isIntraState ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ color: '#475569' }}>Total CGST:</span>
                    <span style={{ fontWeight: 700 }}>{formatINR(totalGst / 2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ color: '#475569' }}>Total SGST:</span>
                    <span style={{ fontWeight: 700 }}>{formatINR(totalGst / 2)}</span>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#475569' }}>Total IGST:</span>
                  <span style={{ fontWeight: 700 }}>{formatINR(totalGst)}</span>
                </div>
              )}
              {shippingFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#475569' }}>Delivery / Freight:</span>
                  <span style={{ fontWeight: 700 }}>{formatINR(shippingFee)}</span>
                </div>
              )}
              {discountTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: '#166534' }}>
                  <span>Discount / Promo:</span>
                  <span style={{ fontWeight: 700 }}>- {formatINR(discountTotal)}</span>
                </div>
              )}
              <div
                style={{
                  borderTop: '2px solid #0f172a',
                  paddingTop: '0.5rem',
                  marginTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline'
                }}
              >
                <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>
                  Grand Total (Incl. GST):
                </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#166534' }}>
                  {formatINR(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions + Digital Signatory Stamp */}
          <div
            style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ maxWidth: '440px', fontSize: '0.725rem', color: '#64748b' }}>
              <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                Terms & Conditions:
              </div>
              <ol style={{ paddingLeft: '1.1rem', margin: 0 }}>
                <li>Goods once sold will only be replaced as per Siddhiva 7-Day Replacement Policy.</li>
                <li>All products carry official OEM brand warranty backed by manufacturer.</li>
                <li>Payment verified digitally. Subject to Noida/UP jurisdiction only.</li>
              </ol>
            </div>

            <div style={{ textAlign: 'center', minWidth: '180px' }}>
              <div
                style={{
                  border: '1.5px dashed #166534',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  background: 'rgba(34, 197, 94, 0.05)',
                  marginBottom: '0.35rem'
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#166534', letterSpacing: '0.04em' }}>
                  ✓ DIGITALLY VERIFIED
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                  Siddhiva Commerce E-Seal
                </div>
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.75rem', color: '#0f172a' }}>
                Authorized Signatory
              </div>
              <div style={{ fontSize: '0.675rem', color: '#64748b' }}>
                For {COMPANY_DETAILS.brand}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GSTInvoiceModal;
