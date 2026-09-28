import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, PhoneCall, ArrowRight, ShieldCheck, FileText, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatINR } from '../../services/emiHelper';
import api from '../../services/api';
import GSTInvoiceModal from '../../components/common/GSTInvoiceModal';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/${id}`);
          if (res.data.success) {
            setOrder(res.data.order);
          }
        } catch (err) {
          console.error('Failed to load order', err);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  return (
    <div className="container" style={{ padding: '4rem 1.25rem', maxWidth: '750px' }}>
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        padding: '2.5rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          background: '#dcfce7',
          color: '#166534',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          <CheckCircle2 size={40} />
        </div>

        <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Your Order is Confirmed!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.5rem' }}>
          Thank you for choosing Siddhiva. Your order has been confirmed and registered for priority warehouse dispatch.
        </p>

        {/* Order Details Card */}
        <div style={{
          background: 'var(--bg-surface-alt)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '1.5rem',
          textAlign: 'left',
          marginBottom: '1.5rem'
        }}>
          <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Order Reference:</span>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>{order?.orderNumber || 'AG-CONFIRMED'}</span>
          </div>

          <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Customer Name:</span>
            <span style={{ fontWeight: 600 }}>{order?.customerName || order?.shippingAddress?.fullName}</span>
          </div>

          <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Delivery Destination:</span>
            <span style={{ fontWeight: 600 }}>{order?.shippingAddress?.villageCity || order?.shippingAddress?.city}, {order?.shippingAddress?.state} ({order?.shippingAddress?.pincode})</span>
          </div>

          <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
            <span style={{ fontWeight: 700, color: '#166534' }}>{order?.payment?.method || 'COD'}</span>
          </div>

          <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Grand Total:</span>
            <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)' }}>{formatINR(order?.pricing?.grandTotal || 0)}</span>
          </div>
        </div>

        {/* GST Invoice Action Ribbon */}
        {order && (
          <div style={{
            background: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div className="flex items-center gap-2" style={{ textAlign: 'left' }}>
              <FileText size={22} color="#166534" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>Official GST Tax Invoice</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GSTIN verified invoice with HSN codes & warranty</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsInvoiceOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ fontWeight: 800, background: '#ffffff', color: '#166534', borderColor: '#86efac' }}
            >
              <Printer size={15} />
              <span>Print / Download Invoice</span>
            </button>
          </div>
        )}

        {/* Tracking Flow */}
        <div style={{ background: 'var(--primary-50)', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', textAlign: 'left' }}>
          <Truck size={24} color="#166534" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.85rem', color: '#166534' }}>
            <strong>Estimated Delivery: 4 - 7 Business Days.</strong> You will receive SMS & WhatsApp status updates as your package moves through transit hubs.
          </div>
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/orders" className="btn btn-primary btn-lg">
            <span>View My Orders & Delivery Status</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/" className="btn btn-secondary btn-lg">
            Return Home
          </Link>
        </div>
      </div>

      {/* GST Invoice Modal */}
      {order && (
        <GSTInvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          order={order}
        />
      )}
    </div>
  );
};

export default OrderConfirmationPage;
