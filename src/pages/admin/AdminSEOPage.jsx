import React, { useState } from 'react';
import { Search, Globe, Sparkles, CheckCircle2, Save, FileText, Code } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AdminSEOPage = () => {
  const { addToast } = useToast();

  const [seoConfig, setSeoConfig] = useState({
    siteTitle: 'AgriMachina India | Agricultural Machinery, Power Weeders & Solar Pumps',
    metaDescription: "India's premier agricultural machinery e-commerce platform. Buy power weeders, solar submersible pumps, rotavators, sprayers, and brush cutters with genuine OEM warranty, doorstep delivery, and easy monthly Kisan EMI.",
    canonicalBase: 'https://agrimachina.in',
    ogImageUrl: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=1200&q=85',
    googleAnalyticsId: 'G-AGRI2026IN',
    sitemapEnabled: true,
    schemaOrgProductEnabled: true
  });

  const handleSave = () => {
    addToast('Global SEO Meta & Rich Snippet Settings Updated!', 'success');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={24} color="#34d399" />
            <span>Search Engine Optimization (SEO) & Rich Meta Suite</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Manage global SERP titles, Google Product Schema.org structured data, and search crawler settings.
          </p>
        </div>

        <button onClick={handleSave} className="btn btn-primary btn-sm">
          <Save size={16} />
          <span>Save SEO Settings</span>
        </button>
      </div>

      {/* Google Search Live SERP Card */}
      <div style={{ background: '#ffffff', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e2e8f0', color: '#1e293b' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Globe size={15} color="#166534" />
          <span>Live Google Search SERP Desktop & Mobile Preview</span>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#202124', marginBottom: '2px' }}>
          https://agrimachina.in
        </div>
        <div style={{ fontSize: '1.25rem', color: '#1a0dab', fontWeight: 600, lineHeight: 1.3, marginBottom: '6px', cursor: 'pointer' }}>
          {seoConfig.siteTitle}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#4d5156', lineHeight: 1.5 }}>
          {seoConfig.metaDescription}
        </div>
      </div>

      {/* Form Settings */}
      <div className="admin-card flex flex-col gap-5">
        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Default Global Meta Title (Recommended 55-65 characters)</label>
          <input
            type="text"
            className="input-field"
            style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={seoConfig.siteTitle}
            onChange={(e) => setSeoConfig({ ...seoConfig, siteTitle: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Default Meta Description (Recommended 150-160 characters)</label>
          <textarea
            rows="3"
            className="textarea-field"
            style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={seoConfig.metaDescription}
            onChange={(e) => setSeoConfig({ ...seoConfig, metaDescription: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="input-group">
            <label className="input-label" style={{ color: '#cbd5e1' }}>Canonical Base Domain</label>
            <input
              type="text"
              className="input-field"
              style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
              value={seoConfig.canonicalBase}
              onChange={(e) => setSeoConfig({ ...seoConfig, canonicalBase: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ color: '#cbd5e1' }}>Google Analytics 4 Measurement ID</label>
            <input
              type="text"
              className="input-field"
              style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
              value={seoConfig.googleAnalyticsId}
              onChange={(e) => setSeoConfig({ ...seoConfig, googleAnalyticsId: e.target.value })}
            />
          </div>
        </div>

        {/* Schema.org Rich Snippet Preview */}
        <div style={{ background: '#070d1a', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.25rem' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem', color: '#34d399', fontWeight: 700, fontSize: '0.85rem' }}>
            <Code size={16} />
            <span>Automatic Schema.org / JSON-LD Product Rich Snippets</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
            Every product detail page automatically emits Google Structured Data with aggregateRating, offers (price & currency), availability, and brand parameters for rich Google Shopping stars.
          </p>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2" style={{ fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={seoConfig.schemaOrgProductEnabled}
                onChange={(e) => setSeoConfig({ ...seoConfig, schemaOrgProductEnabled: e.target.checked })}
              />
              <span>Enable JSON-LD Product Microdata</span>
            </label>
            <label className="flex items-center gap-2" style={{ fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={seoConfig.sitemapEnabled}
                onChange={(e) => setSeoConfig({ ...seoConfig, sitemapEnabled: e.target.checked })}
              />
              <span>Auto-Generate XML Sitemap (/sitemap.xml)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSEOPage;
