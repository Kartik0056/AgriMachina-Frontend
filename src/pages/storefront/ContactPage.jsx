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
  Tractor,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const faqs = [
  {
    q: 'How does DBT / SMAM Govt. Subsidy approval work on farm equipment?',
    a: 'All our power weeders, solar pumps, and crop protection equipment are pre-tested and approved under central & state DBT (SMAM / Sub-Mission on Agricultural Mechanization) schemes. Upon order confirmation, we generate an authorized GST commercial invoice with complete engine and chassis numbers required for instant subsidy claim on your state agriculture portal.'
  },
  {
    q: 'What are the requirements for 0% No-Cost EMI financing?',
    a: 'Farmers can avail 0% No-Cost EMI tenures (3 to 36 months) online during checkout using Razorpay Affordability. Supported payment modes include SBI Kisan Credit Cards, HDFC Agri Finance, ICICI Bank, Axis Bank, and Bajaj Finserv EMI Cards with zero down-payment.'
  },
  {
    q: 'How is heavy machinery delivered to rural farm locations?',
    a: 'We provide 100% Free Palletized Farm Delivery across all pin codes in India. Machinery is dispatched in heavy wooden crate packing via dedicated hydraulic tail-lift transport trucks directly to your village or farm gate within 4 to 7 business days.'
  },
  {
    q: 'What is the engine warranty and spare parts availability policy?',
    a: 'Every machine comes with a 1-Year Comprehensive OEM Engine & Gearbox Warranty. We maintain a full 10-year replacement stock for all wearing parts (rotary blades, carburetors, recoil starters, drive belts, spray nozzles) dispatchable within 24 hours.'
  },
  {
    q: 'Can I request a live video demonstration before purchasing?',
    a: 'Yes! You can connect with our certified agricultural engineers over WhatsApp video call (+91 90277 99171) to inspect the machine operation, soil compatibility, starting procedure, and maintenance tips live from our demo testing grounds.'
  }
];

const ContactPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    machineryInterest: 'Power Weeder & Tiller',
    inquiryType: 'General Inquiry',
    farmType: '',
    acres: 5,
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
        addToast('Your inquiry has been submitted! Our agronomy specialist will call you shortly.', 'success');
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
          🌾 Kisan Technical Advisory & Customer Support
        </span>
        <h1 style={{ fontSize: '2.4rem', color: '#062416', fontWeight: 900, marginBottom: '0.75rem' }}>
          Connect with Agricultural Machinery Specialists
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '680px', margin: '0 auto' }}>
          Have questions about field compatibility, subsidy documentation, 0% EMI financing, or custom implements? Our certified agricultural engineers are available 6 days a week.
        </p>
      </div>

      {/* 3 Quick Contact Helpline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: '3rem' }}>
        {/* Card 1: Toll-Free Helpline */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
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
            background: '#f0fdf4',
            color: '#166534',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <PhoneCall size={26} color="#166534" />
          </div>
          <h3 style={{ fontSize: '1.2rem', color: '#062416', fontWeight: 800, marginBottom: '0.35rem' }}>
            Toll-Free Kisan Helpline
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
            Call toll-free for product recommendations, warranty support, and delivery status.
          </p>
          <a
            href="tel:1800123456"
            className="btn btn-primary btn-sm"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            📞 1800-AGRI-FARM (Toll-Free)
          </a>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            Mon - Sat: 8:00 AM to 8:00 PM
          </span>
        </div>

        {/* Card 2: WhatsApp Engineer Chat */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
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
            background: '#f0fdf4',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <MessageSquare size={26} color="#16a34a" />
          </div>
          <h3 style={{ fontSize: '1.2rem', color: '#062416', fontWeight: 800, marginBottom: '0.35rem' }}>
            WhatsApp Technical Support
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
            Receive video field demonstrations, machine manuals, and spare parts catalogs on WhatsApp.
          </p>
          <a
            href="https://wa.me/919027799171?text=Hi%20AgriMachina,%20I%20need%20assistance%20with%20farm%20machinery."
            target="_blank"
            rel="noreferrer"
            className="btn btn-accent btn-sm"
            style={{ width: '100%', textDecoration: 'none', background: '#22c55e', color: '#ffffff' }}
          >
            💬 Chat on WhatsApp (+91 90277 99171)
          </a>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            Average response time: 5 Minutes
          </span>
        </div>

        {/* Card 3: Central Warehouse & Factory */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
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
          <h3 style={{ fontSize: '1.2rem', color: '#062416', fontWeight: 800, marginBottom: '0.35rem' }}>
            Central Warehouse & Factory
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
            AgriMachina Industrial Zone, National Highway 27, Shapar-Veraval, Rajkot, Gujarat - 360024
          </p>
          <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 700 }}>
            ✉️ support@agrimachina.in
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            Central Depot & Testing Yard
          </span>
        </div>
      </div>

      {/* Main Grid: Contact Form (Left) & FAQs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7" style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '1.4rem', color: '#062416', fontWeight: 800, marginBottom: '0.5rem' }}>
            Submit an Inquiry / Request a Callback
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Fill in your farm details below and an agricultural engineer will contact you with recommendations.
          </p>

          {submitted ? (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 1rem auto' }} />
              <h4 style={{ fontSize: '1.25rem', color: '#062416', fontWeight: 800, marginBottom: '0.5rem' }}>
                Thank You, {formData.name}!
              </h4>
              <p style={{ color: '#475569', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                Your inquiry has been successfully assigned to our agricultural engineering team. We will call you on <strong>{formData.phone}</strong> shortly.
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
                  <label className="input-label">Farmer Full Name *</label>
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
                    placeholder="e.g. farmer@kisanmail.in"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Inquiry Reason *</label>
                  <select
                    className="select-field"
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  >
                    <option value="General Inquiry">General Machinery Consultation</option>
                    <option value="Govt Subsidy Assistance">Govt. SMAM / DBT Subsidy Guidance</option>
                    <option value="0% EMI Financing">0% No-Cost EMI & Bank Loans</option>
                    <option value="Field Demo Request">Request Live Field Demonstration</option>
                    <option value="Bulk Purchase / Dealer">Bulk Purchase / Farmer Cooperative</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Equipment Category of Interest</label>
                  <select
                    className="select-field"
                    value={formData.machineryInterest}
                    onChange={(e) => setFormData({ ...formData, machineryInterest: e.target.value })}
                  >
                    <option value="Power Weeder & Tiller">Power Weeder & Tiller</option>
                    <option value="Earth Auger">Earth Auger (Soil Driller)</option>
                    <option value="Pumps & Irrigation">Solar & Submersible Pumps</option>
                    <option value="Sprayers & Crop Protection">Battery & HTP Sprayers</option>
                    <option value="Harvesting Machinery">Brush Cutters & Harvesters</option>
                    <option value="Post Harvesting">Chaff Cutters & Threshers</option>
                    <option value="Power Reaper">Power Reaper</option>
                    <option value="Lawn Mower & Gardening Tools">Lawn Mower & Gardening</option>
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
              </div>

              <div className="input-group">
                <label className="input-label">Your Specific Question / Farm Details</label>
                <textarea
                  className="textarea-field"
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your soil type (e.g. black cotton soil, sandy loam), crops grown, and any technical questions you have..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                <Send size={18} />
                <span>{loading ? 'Submitting...' : 'Submit Inquiry for Free Expert Consultation'}</span>
              </button>
            </form>
          )}
        </div>

        {/* FAQs Accordion (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.75rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '1.3rem', color: '#062416', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                      border: '1px solid #e2e8f0',
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
                      <div style={{ padding: '0.85rem 1rem', fontSize: '0.825rem', color: '#475569', lineHeight: 1.5, background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
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
                100% Genuine Machinery Direct Guarantee
              </div>
              <div style={{ fontSize: '0.8rem', color: '#dcfce7', marginTop: '0.2rem' }}>
                Every equipment order is accompanied by an authorized manufacturer warranty card, tool kit, and user guide.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
