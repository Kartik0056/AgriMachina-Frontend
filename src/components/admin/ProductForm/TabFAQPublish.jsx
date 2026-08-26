import React, { useState } from 'react';
import { Eye, Save, Send, HelpCircle, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const statuses = ['Draft', 'Pending Review', 'Published', 'Scheduled', 'Unpublished', 'Out of Stock', 'Discontinued'];

const TabFAQPublish = ({ formData, updateField, onSave, onPublish, onPreview, isSaving }) => {
  const faqs = formData.faqs || [];
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');

  const addFAQ = () => {
    if (!newQ || !newA) return;
    updateField('faqs', [...faqs, { question: newQ, answer: newA }]);
    setNewQ('');
    setNewA('');
  };

  const removeFAQ = (idx) => {
    updateField('faqs', faqs.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Product Specific FAQs */}
      <div style={{ background: 'var(--admin-bg-main)', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={18} color="#34d399" />
          <span>Product-Specific Technical FAQ</span>
        </h4>

        {/* Add FAQ */}
        <div className="flex flex-col gap-2" style={{ marginBottom: '1.25rem' }}>
          <input
            type="text"
            className="input-field"
            style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={newQ}
            onChange={(e) => setNewQ(e.target.value)}
            placeholder="Farmer Question (e.g. Can this run on wet clay soil?)"
          />
          <textarea
            className="textarea-field"
            rows="2"
            style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={newA}
            onChange={(e) => setNewA(e.target.value)}
            placeholder="Agronomy Technical Answer"
          />
          <button type="button" onClick={addFAQ} className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>
            <Plus size={16} />
            <span>Add FAQ Entry</span>
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--admin-bg-sidebar)',
                border: '1px solid #1e2e4f',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>Q: {faq.question}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>A: {faq.answer}</div>
              </div>
              <button type="button" onClick={() => removeFAQ(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Status Workflow & Publishing Card */}
      <div style={{
        background: 'var(--admin-bg-sidebar)',
        border: '1px solid #1e2e4f',
        borderRadius: '16px',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.25rem' }}>Listing Publication & Workflow</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Only listings set to <strong>"Published"</strong> are live and purchasable in the public farmer storefront.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="input-group">
            <label className="input-label" style={{ color: '#cbd5e1' }}>Catalog Publication Status</label>
            <select
              className="select-field"
              style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
              value={formData.status || 'Draft'}
              onChange={(e) => updateField('status', e.target.value)}
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3" style={{ borderTop: '1px solid #1e2e4f', paddingTop: '1.25rem' }}>
          {onPreview && (
            <button
              type="button"
              onClick={onPreview}
              className="btn btn-secondary"
              style={{ background: 'var(--admin-bg-card-alt)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            >
              <Eye size={16} />
              <span>Preview Product Page</span>
            </button>
          )}

          <button
            type="button"
            disabled={isSaving}
            onClick={() => onSave('Draft')}
            className="btn btn-secondary"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
          >
            <Save size={16} />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => onPublish('Published')}
            className="btn btn-primary btn-lg"
          >
            <Send size={18} />
            <span>Publish to Storefront</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabFAQPublish;
