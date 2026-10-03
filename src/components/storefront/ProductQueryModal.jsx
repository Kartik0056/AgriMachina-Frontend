import React, { useState } from 'react';
import { Phone, Send, CheckCircle2, User, MapPin, RefreshCw, MessageSquare } from 'lucide-react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ProductQueryModal = ({ isOpen, onClose, product }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.addresses && user.addresses[0] ? user.addresses[0].city || '' : '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      addToast('Please enter your name and mobile number.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/contact', {
        name: fullName.trim(),
        phone: phone.trim(),
        productId: product._id,
        productTitle: product.name,
        productSku: product.sku,
        cityState: city.trim(),
        message: message.trim() || `Inquiry for ${product.name} (SKU: ${product.sku || 'N/A'})`
      });

      if (res.data.success) {
        setSubmitted(true);
        addToast('Your inquiry has been submitted!', 'success');
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to submit inquiry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setMessage('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title="Product Inquiry"
      maxWidth="440px"
    >
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '1.25rem 0.5rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'var(--primary-50, #f0fdf4)',
            border: '2px solid var(--primary-400, #86efac)',
            color: 'var(--primary-600, #16a34a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.85rem auto'
          }}>
            <CheckCircle2 size={30} color="var(--primary-600, #16a34a)" />
          </div>

          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '0.35rem' }}>
            Inquiry Submitted!
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '340px', margin: '0 auto 1.25rem auto', lineHeight: 1.45 }}>
            Our team will connect with you on <strong style={{ color: 'var(--primary-600)' }}>{phone}</strong> regarding <strong>{product.name}</strong> shortly.
          </p>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="btn btn-primary btn-md"
            style={{ minWidth: '140px' }}
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'hidden' }}>
          {/* Compact Product Snippet */}
          <div style={{
            background: 'var(--bg-surface-alt)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '0.45rem 0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}>
            <img
              src={product.mainImage?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80'}
              alt={product.name}
              style={{
                width: '36px',
                height: '36px',
                objectFit: 'contain',
                background: 'var(--bg-surface)',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 700,
                color: 'var(--text-main)',
                fontSize: '0.825rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {product.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {product.brand ? `${product.brand} • ` : ''}{product.sku ? `SKU: ${product.sku}` : 'Verified'}
              </div>
            </div>
          </div>

          {/* Full Name & Mobile Number (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="input-group">
              <label className="input-label flex items-center gap-1" style={{ fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                <User size={12} color="var(--primary-600)" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                required
                className="input-field"
                style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem', borderRadius: '8px' }}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Patel"
              />
            </div>

            <div className="input-group">
              <label className="input-label flex items-center gap-1" style={{ fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                <Phone size={12} color="var(--primary-600)" />
                <span>Mobile Number *</span>
              </label>
              <input
                type="tel"
                required
                className="input-field"
                style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem', borderRadius: '8px' }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
              />
            </div>
          </div>

          {/* City / Locality (Optional) */}
          <div className="input-group">
            <label className="input-label flex items-center gap-1" style={{ fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.2rem' }}>
              <MapPin size={12} color="var(--primary-600)" />
              <span>City / Locality (Optional)</span>
            </label>
            <input
              type="text"
              className="input-field"
              style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem', borderRadius: '8px' }}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Ahmedabad, Gujarat"
            />
          </div>

          {/* Short Note or Question */}
          <div className="input-group">
            <label className="input-label flex items-center gap-1" style={{ fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.2rem' }}>
              <MessageSquare size={12} color="var(--primary-600)" />
              <span>Note / Question (Optional)</span>
            </label>
            <textarea
              className="textarea-field"
              rows="2"
              style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem', borderRadius: '8px', minHeight: '50px', maxHeight: '70px', resize: 'none' }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Details regarding delivery timeline, bulk inquiry, etc."
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              borderRadius: '9px',
              padding: '0.65rem',
              fontSize: '0.875rem',
              fontWeight: 800,
              marginTop: '0.2rem'
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>Submit Inquiry</span>
              </>
            )}
          </button>
        </form>
      )}
    </Modal>
  );
};

export default ProductQueryModal;
