import React, { useState } from 'react';
import { HelpCircle, Phone, Send, CheckCircle2, ShieldCheck, Tractor, MessageSquare } from 'lucide-react';
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
      maxWidth="620px"
    >
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#f0fdf4',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h3 style={{ fontSize: '1.3rem', color: '#062416', fontWeight: 800, marginBottom: '0.5rem' }}>
            Inquiry Submitted Successfully!
          </h3>
          <p style={{ color: '#475569', fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto 1.25rem auto' }}>
            Our certified agricultural engineer for <strong>{product.name}</strong> will call you on <strong>{phone}</strong> within 2 hours with specifications, field demo videos, and best discount options.
          </p>

          <button onClick={handleResetAndClose} className="btn btn-primary btn-sm">
            Close & Back to Product
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Target Product Summary Strip */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}>
            <img
              src={product.mainImage?.url || '/images/machinery/power_weeder.jpg'}
              alt={product.name}
              style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#ffffff', borderRadius: '6px', padding: '2px', border: '1px solid #cbd5e1' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.725rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase' }}>
                Equipment Inquired: SKU {product.sku}
              </div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.875rem' }}>
                {product.name}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="input-group">
              <label className="input-label">Farmer Full Name *</label>
              <input
                type="text"
                required
                className="input-field"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Baldev Patel"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Mobile Number *</label>
              <input
                type="tel"
                required
                className="input-field"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Inquiry Topic *</label>
              <select
                className="select-field"
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
              >
                <option value="Product Query">Technical Specifications & Performance</option>
                <option value="Govt Subsidy Assistance">DBT / SMAM Govt. Subsidy Process</option>
                <option value="0% EMI Financing">0% No-Cost EMI & Bank Loan Options</option>
                <option value="Field Demo Request">Live Video / Field Demonstration</option>
                <option value="Bulk Purchase / Dealer">Bulk Order / Cooperative Society Discount</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Crops Cultivated on Farm</label>
              <input
                type="text"
                className="input-field"
                value={cropGrown}
                onChange={(e) => setCropGrown(e.target.value)}
                placeholder="e.g. Cotton, Sugarcane, Paddy, Vegetables"
              />
            </div>

            <div className="input-group">
              <label className="input-label">State</label>
              <select
                className="select-field"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="Gujarat">Gujarat</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Bihar">Bihar</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">District / City</label>
              <input
                type="text"
                className="input-field"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Rajkot, Gondal"
              />
            </div>
          </div>

          {/* Specific Query Question */}
          <div className="input-group">
            <label className="input-label">What question or detail would you like to ask our specialist?</label>
            <textarea
              className="textarea-field"
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Will this power weeder work in heavy black soil? Can I attach a ridger and water pump to it? How much subsidy is eligible in my state?"
            />
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.65rem 0.85rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.775rem', color: '#166534' }}>
            <ShieldCheck size={16} color="#16a34a" />
            <span>100% Free Consultation. No sales pressure. Direct advice from certified agricultural engineers.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
          >
            <Send size={16} />
            <span>{loading ? 'Submitting Inquiry...' : 'Submit Inquiry for Free Expert Callback'}</span>
          </button>
        </form>
      )}
    </Modal>
  );
};

export default ProductQueryModal;
