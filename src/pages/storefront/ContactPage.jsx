import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  MapPin,
  MessageSquare,
  Clock,
  ShieldCheck,
  Send,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const faqs = [
  {
    q: 'How does Pan-India Express Delivery work?',
    a: 'We provide fast and reliable delivery across 28,000+ pin codes in India. Orders are dispatched within 24 hours via premier courier partners (Delhivery, BlueDart, DTDC). Standard doorstep delivery takes 2 to 5 business days.'
  },
  {
    q: 'What payment options and 0% No-Cost EMI plans are available?',
    a: 'You can pay using UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Cash on Delivery (COD). For larger purchases, 0% No-Cost EMI (3 to 24 months) is available through HDFC, SBI, ICICI, Axis Bank, and Bajaj Finserv.'
  },
  {
    q: 'What is your returns and replacement policy?',
    a: 'We offer an easy 7-day hassle-free replacement or refund guarantee on all damaged, defective, or incorrect items. Simply contact support or initiate a return from your Orders dashboard.'
  },
  {
    q: 'Are all products authentic and quality-certified?',
    a: 'Yes, 100%. Our spices are lab-tested and FSSAI certified, our electronics and appliances come with official OEM warranties, and home decor items undergo strict multi-stage quality inspections.'
  },
  {
    q: 'Can I place bulk or corporate orders?',
    a: 'Yes! We offer wholesale and corporate gifting discounts on bulk orders across spices, electronics, and home living. Select "Bulk Purchase / Corporate" in the contact form to receive a custom quote.'
  }
];

const ContactPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    categoryInterest: 'All Categories / General',
    inquiryType: 'General Inquiry',
    state: user?.addresses && user.addresses[0] ? user.addresses[0].state : 'Gujarat',
    district: user?.addresses && user.addresses[0] ? user.addresses[0].district : '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      addToast('Please enter your full name and mobile number.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/contact', formData);
      if (res.data.success) {
        setSubmitted(true);
        addToast('Your inquiry has been submitted! Our customer care specialist will call you shortly.', 'success');
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to submit inquiry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem 1.25rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="badge badge-primary" style={{ marginBottom: '0.75rem', padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
          💬 Customer Support & Product Advisory
        </span>
        <h1 style={{ fontSize: '1.35rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
          Connect with Our Support Specialists
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '640px', margin: '0 auto' }}>
          Have questions about our products, express doorstep delivery, 0% EMI financing, or bulk orders? Our team is available 6 days a week to help you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: '3rem' }}>
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--primary-50)',
            color: '#166534',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <PhoneCall size={26} color="#166534" />
          </div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '0.35rem' }}>
            24x7 Customer Helpline
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Call directly for order tracking, product recommendations, warranty support, and delivery updates.
          </p>
          <a
            href="tel:6395211953"
            className="btn btn-primary btn-sm"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            📞 +91 63952 11953
          </a>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
            Mon - Sun: 24/7 Helpline Active
          </span>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--primary-50)',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <MessageSquare size={26} color="#16a34a" />
          </div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '0.35rem' }}>
            WhatsApp Live Support
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Receive product brochures, live demo videos, order invoices, and quick answers directly on WhatsApp.
          </p>
          <a
            href="https://wa.me/916395211953?text=Hi%20Eidula,%20I%20need%20assistance%20with%20products."
            target="_blank"
            rel="noreferrer"
            className="btn btn-accent btn-sm"
            style={{ width: '100%', textDecoration: 'none', background: '#22c55e', color: '#ffffff' }}
          >
            💬 Chat on WhatsApp (+91 63952 11953)
          </a>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
            Average response time: 5 Minutes
          </span>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#fef3c7',
            color: '#b45309',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <MapPin size={26} color="#d97706" />
          </div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '0.35rem' }}>
            Email & Operations Hub
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Eidula Commercial Towers & Distribution Center, Sector 62, Noida, India
          </p>
          <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 700 }}>
            ✉️ <a href="mailto:kartikkumar151998@gmail.com" style={{ color: '#166534', textDecoration: 'none' }}>kartikkumar151998@gmail.com</a>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
            Direct Business & Support Mail
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7" style={{
          background: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '0.4rem' }}>
            Submit an Inquiry / Request a Callback
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
            Fill in your details below and our customer support team will contact you with recommendations.
          </p>

          {submitted ? (
            <div style={{
              background: 'var(--primary-50)',
              border: '1px solid var(--primary-400, #86efac)',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 1rem auto' }} />
              <h4 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '0.5rem' }}>
                Thank You, {formData.name}!
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                Your inquiry has been successfully received by our support team. We will call you on <strong>{formData.phone}</strong> shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="btn btn-primary btn-sm"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="input-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Patel"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Mobile Contact Number *</label>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Email Address (Optional)</label>
                  <input
                    type="email"
                    className="input-field"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. customer@example.com"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Inquiry Reason *</label>
                  <select
                    className="select-field"
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  >
                    <option value="General Inquiry">General Product Consultation</option>
                    <option value="Order Tracking">Order Tracking & Delivery Status</option>
                    <option value="0% EMI Financing">0% No-Cost EMI & Payment Inquiries</option>
                    <option value="Bulk Purchase / Corporate">Bulk Purchase / Corporate Inquiries</option>
                    <option value="Warranty & Replacement">Warranty Claim & Replacement</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Category of Interest</label>
                  <select
                    className="select-field"
                    value={formData.categoryInterest}
                    onChange={(e) => setFormData({ ...formData, categoryInterest: e.target.value })}
                  >
                    <option value="All Categories / General">All Categories / General</option>
                    <option value="Spices & Masale">Spices & Masale</option>
                    <option value="Electronics & Smart Tech">Electronics & Smart Tech</option>
                    <option value="Home Decor & Living">Home Decor & Living</option>
                    <option value="Kitchen & Home Appliances">Kitchen & Home Appliances</option>
                    <option value="Hardware & Tools">Hardware & Power Tools</option>
                    <option value="Organic Groceries">Organic Groceries & Oils</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">State</label>
                  <select
                    className="select-field"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  >
                    <option value="Gujarat">Gujarat</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="West Bengal">West Bengal</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Your Message / Query Details</label>
                <textarea
                  className="textarea-field"
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what you are looking for or any questions regarding your order..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                <Send size={18} />
                <span>{loading ? 'Submitting...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>

        {/* FAQs Accordion (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div style={{
            background: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '1.75rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={20} color="#166534" />
              <span>Frequently Asked Questions</span>
            </h3>

            <div className="flex flex-col gap-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.85rem 1rem',
                        background: isOpen ? '#f0fdf4' : '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        color: isOpen ? '#166534' : '#0f172a'
                      }}
                    >
                      <span style={{ paddingRight: '0.5rem' }}>{faq.q}</span>
                      <ChevronDown
                        size={16}
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s ease',
                          flexShrink: 0
                        }}
                      />
                    </button>

                    {isOpen && (
                      <div style={{ padding: '0.85rem 1rem', fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5, background: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)' }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Warranty Ribbon */}
          <div style={{
            background: 'linear-gradient(135deg, #062416, #166534)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <ShieldCheck size={36} color="#34d399" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fef08a' }}>
                100% Genuine & Certified Quality Guarantee
              </div>
              <div style={{ fontSize: '0.8rem', color: '#dcfce7', marginTop: '0.2rem' }}>
                Every order is backed by genuine manufacturer warranty, batch quality certification, and secure packaging.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
