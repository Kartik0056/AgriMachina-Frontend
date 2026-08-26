import React, { useState } from 'react';
import { HelpCircle, Phone, Send, CheckCircle2, ShieldCheck, Tractor, User, MapPin, Sprout, Sparkles, Clock, RefreshCw } from 'lucide-react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ProductQueryModal = ({ isOpen, onClose, product }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [state, setState] = useState(user?.addresses && user.addresses[0] ? user.addresses[0].state : 'Gujarat');
  const [district, setDistrict] = useState(user?.addresses && user.addresses[0] ? user.addresses[0].district : '');
  const [cropGrown, setCropGrown] = useState('');
  const [inquiryType, setInquiryType] = useState('Product Query');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !phone) {
      addToast('Please enter your name and contact mobile number.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/contact', {
        name: fullName,
        phone,
        email,
        productId: product._id,
        productTitle: product.name,
        productSku: product.sku,
        machineryInterest: product.name,
        inquiryType,
        farmType: cropGrown,
        state,
        district,
        message: message || `Farmer inquiry regarding ${product.name} (SKU: ${product.sku}). Topic: ${inquiryType}`
      });

      if (res.data.success) {
        setSubmitted(true);
        addToast('Your machinery inquiry has been registered with our agricultural technical team!', 'success');
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
      title="Ask Machine Specialist • Free Technical Consultation"
      maxWidth="680px"
    >
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'var(--primary-50, #f0fdf4)',
            border: '2px solid #86efac',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            boxShadow: '0 8px 20px rgba(34, 197, 94, 0.2)'
          }}>
            <CheckCircle2 size={38} color="#16a34a" />
          </div>

          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', fontWeight: 900, marginBottom: '0.5rem' }}>
            Inquiry Submitted Successfully!
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '480px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
            Our certified agricultural engineer for <strong>{product.name}</strong> will call you on <strong style={{ color: 'var(--primary-600)' }}>{phone}</strong> within 2 hours with live performance specs, field video links, and eligible subsidy benefits.
          </p>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="btn btn-primary btn-md"
            style={{ minWidth: '180px' }}
          >
            Close & Back to Product
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Target Product Summary Strip */}
          <div style={{
            background: 'var(--bg-surface-alt)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '0.65rem 0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}>
            <img
              src={product.mainImage?.url || '/images/machinery/power_weeder.jpg'}
              alt={product.name}
              style={{
                width: '46px',
                height: '46px',
                objectFit: 'contain',
                background: 'var(--bg-surface)',
                borderRadius: '8px',
                padding: '2px',
                border: '1px solid var(--border-color)',
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex items-center gap-2" style={{ marginBottom: '0.15rem' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem' }}>
                  SKU: {product.sku || 'AG-MACH'}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary-600)', fontWeight: 700 }}>
                  Certified OEM Equipment
                </span>
              </div>
              <div style={{
                fontWeight: 800,
                color: 'var(--text-main)',
                fontSize: '0.875rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {product.name}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Full Name */}
            <div className="input-group">
              <label className="input-label flex items-center gap-1.5" style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                <User size={13} color="var(--primary-600)" />
                <span>Farmer Full Name *</span>
              </label>
              <input
                type="text"
                required
                className="input-field"
                style={{ padding: '0.55rem 0.85rem', fontSize: '0.875rem', borderRadius: '10px' }}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rampal Singh"
              />
            </div>

            {/* Mobile Number */}
            <div className="input-group">
              <label className="input-label flex items-center gap-1.5" style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                <Phone size={13} color="var(--primary-600)" />
                <span>Mobile Number *</span>
              </label>
              <input
                type="tel"
                required
                className="input-field"
                style={{ padding: '0.55rem 0.85rem', fontSize: '0.875rem', borderRadius: '10px' }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 7823354321"
              />
            </div>

            {/* Inquiry Topic */}
            <div className="input-group">
              <label className="input-label flex items-center gap-1.5" style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                <HelpCircle size={13} color="var(--primary-600)" />
                <span>Inquiry Topic *</span>
              </label>
              <select
                className="select-field"
                style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem', borderRadius: '10px' }}
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
              >
                <option value="Product Query">Technical Specifications & Soil Suitability</option>
                <option value="Govt Subsidy Assistance">DBT / SMAM Govt. Subsidy Process</option>
                <option value="0% EMI Financing">0% No-Cost EMI & Bank Loan Options</option>
                <option value="Field Demo Request">Live Video / Field Demonstration</option>
                <option value="Bulk Purchase / Dealer">Bulk Order / Cooperative Society Discount</option>
              </select>
            </div>

            {/* Crops Grown */}
            <div className="input-group">
              <label className="input-label flex items-center gap-1.5" style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                <Sprout size={13} color="var(--primary-600)" />
                <span>Crops Cultivated on Farm</span>
              </label>
              <input
                type="text"
                className="input-field"
                style={{ padding: '0.55rem 0.85rem', fontSize: '0.875rem', borderRadius: '10px' }}
                value={cropGrown}
                onChange={(e) => setCropGrown(e.target.value)}
                placeholder="e.g. Cotton, Sugarcane, Paddy, Wheat"
              />
            </div>

            {/* State */}
            <div className="input-group">
              <label className="input-label flex items-center gap-1.5" style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                <MapPin size={13} color="var(--primary-600)" />
                <span>State</span>
              </label>
              <select
                className="select-field"
                style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem', borderRadius: '10px' }}
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Bihar">Bihar</option>
              </select>
            </div>

            {/* District */}
            <div className="input-group">
              <label className="input-label flex items-center gap-1.5" style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                <MapPin size={13} color="var(--primary-600)" />
                <span>District / City</span>
              </label>
              <input
                type="text"
                className="input-field"
                style={{ padding: '0.55rem 0.85rem', fontSize: '0.875rem', borderRadius: '10px' }}
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Saharanpur"
              />
            </div>
          </div>

          {/* Specific Query Question */}
          <div className="input-group">
            <label className="input-label flex items-center gap-1.5" style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              <HelpCircle size={13} color="var(--primary-600)" />
              <span>What question or detail would you like to ask our specialist?</span>
            </label>
            <textarea
              className="textarea-field"
              rows="2"
              style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem', borderRadius: '10px', minHeight: '65px', resize: 'vertical' }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Will this power weeder work in heavy clay soil? Can I attach a water pump to it?"
            />
          </div>

          {/* Security Guarantee Strip */}
          <div style={{
            background: 'var(--primary-50, #f0fdf4)',
            border: '1px solid var(--primary-100, #dcfce7)',
            padding: '0.55rem 0.85rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.785rem',
            color: 'var(--primary-700, #15803d)'
          }}>
            <ShieldCheck size={16} color="#16a34a" style={{ flexShrink: 0 }} />
            <span><strong>100% Free Consultation:</strong> Direct guidance from certified agronomists with 0 sales pressure.</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              borderRadius: '12px',
              padding: '0.8rem',
              fontSize: '0.95rem',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(22, 101, 52, 0.3)'
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Submitting Your Inquiry...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Submit Inquiry for Free Expert Callback</span>
              </>
            )}
          </button>
        </form>
      )}
    </Modal>
  );
};

export default ProductQueryModal;

