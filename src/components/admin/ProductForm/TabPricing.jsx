import React from 'react';
import { formatINR } from '../../../services/emiHelper';
import { Flame, Tag, Percent, Sparkles, Calendar } from 'lucide-react';

const TabPricing = ({ formData, updateField }) => {
  const mrp = Number(formData.mrp) || 0;
  const sellingPrice = Number(formData.sellingPrice) || 0;
  const discountAmount = Math.max(0, mrp - sellingPrice);
  const discountPercent = mrp > 0 ? Math.round((discountAmount / mrp) * 100) : 0;

  // Extra Discount Calculation
  const hasExtra = Boolean(formData.hasExtraDiscount);
  const extraType = formData.extraDiscountType || 'FLAT';
  const extraVal = Number(formData.extraDiscountValue) || 0;
  let calculatedExtraAmt = 0;
  if (hasExtra && extraVal > 0) {
    if (extraType === 'PERCENT') {
      calculatedExtraAmt = Math.round((sellingPrice * extraVal) / 100);
    } else {
      calculatedExtraAmt = Math.min(extraVal, sellingPrice);
    }
  }
  const effectiveFinalPrice = Math.max(0, sellingPrice - calculatedExtraAmt);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Standard Price Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>MRP (Maximum Retail Price) ₹ *</label>
          <input
            type="number"
            required
            className="input-field"
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={formData.mrp || ''}
            onChange={(e) => updateField('mrp', Number(e.target.value))}
            placeholder="e.g. 48500"
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Standard Selling Price (Incl. GST) ₹ *</label>
          <input
            type="number"
            required
            className="input-field"
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={formData.sellingPrice || ''}
            onChange={(e) => updateField('sellingPrice', Number(e.target.value))}
            placeholder="e.g. 39999"
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Cost Price (Internal Margin) ₹</label>
          <input
            type="number"
            className="input-field"
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={formData.costPrice || ''}
            onChange={(e) => updateField('costPrice', Number(e.target.value))}
            placeholder="e.g. 28000"
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>GST Rate (%) *</label>
          <select
            className="select-field"
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={formData.gstPercent || 12}
            onChange={(e) => updateField('gstPercent', Number(e.target.value))}
          >
            <option value={0}>0% (Tax Exempt)</option>
            <option value={5}>5% (Special Agricultural Parts)</option>
            <option value={12}>12% (Standard Agricultural Machinery)</option>
            <option value={18}>18% (Commercial Implements & Engines)</option>
            <option value={28}>28% (Luxury Tractors/Motors)</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Seasonal Special Price ₹</label>
          <input
            type="number"
            className="input-field"
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={formData.specialPrice || ''}
            onChange={(e) => updateField('specialPrice', Number(e.target.value))}
            placeholder="Optional festival price"
          />
        </div>
      </div>

      {/* 2. Deals of the Day & Hot Deal Campaign */}
      <div style={{ background: '#0b1324', border: '1px solid #e11d48', borderRadius: '12px', padding: '1.25rem' }}>
        <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
          <Flame size={20} color="#f43f5e" />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Kisan Deal of the Day & Hot Offers Feature
          </h3>
          <span className="badge" style={{ background: '#881337', color: '#fda4af', fontSize: '0.65rem' }}>HOMEPAGE DEALS SECTION</span>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2.5" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              style={{ width: '18px', height: '18px', accentColor: '#e11d48' }}
              checked={Boolean(formData.isDealOfTheDay)}
              onChange={(e) => updateField('isDealOfTheDay', e.target.checked)}
            />
            <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>
              🔥 Show this product in "Today's Super Deals / Hot Deals" Carousel
            </span>
          </label>

          {formData.isDealOfTheDay && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: '0.5rem', background: '#070d1a', padding: '1rem', borderRadius: '10px', border: '1px solid #2e1065' }}>
              <div className="input-group">
                <label className="input-label" style={{ color: '#cbd5e1' }}>Deal Badge Text (Shown on Product Card)</label>
                <input
                  type="text"
                  className="input-field"
                  style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
                  value={formData.dealBadge || ''}
                  onChange={(e) => updateField('dealBadge', e.target.value)}
                  placeholder="e.g. 🔥 HOT DEAL • 48H ONLY"
                />
              </div>

              <div className="input-group">
                <label className="input-label" style={{ color: '#cbd5e1' }}>Deal Expiry Date / Countdown</label>
                <input
                  type="date"
                  className="input-field"
                  style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
                  value={formData.dealEndsAt ? new Date(formData.dealEndsAt).toISOString().slice(0, 10) : ''}
                  onChange={(e) => updateField('dealEndsAt', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Extra Discount / Farmer Cash Rebate */}
      <div style={{ background: '#0b1324', border: '1px solid #16a34a', borderRadius: '12px', padding: '1.25rem' }}>
        <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
          <Tag size={20} color="#34d399" />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Extra Discount & Subsidy Cash Rebate
          </h3>
          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>PRODUCT BADGE & SAVINGS</span>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2.5" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              style={{ width: '18px', height: '18px', accentColor: '#16a34a' }}
              checked={Boolean(formData.hasExtraDiscount)}
              onChange={(e) => updateField('hasExtraDiscount', e.target.checked)}
            />
            <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>
              🎁 Offer Extra Instant Discount on this specific product
            </span>
          </label>

          {formData.hasExtraDiscount && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginTop: '0.5rem', background: '#070d1a', padding: '1rem', borderRadius: '10px', border: '1px solid #064e3b' }}>
              <div className="input-group">
                <label className="input-label" style={{ color: '#cbd5e1' }}>Extra Discount Type</label>
                <select
                  className="select-field"
                  style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
                  value={formData.extraDiscountType || 'FLAT'}
                  onChange={(e) => updateField('extraDiscountType', e.target.value)}
                >
                  <option value="FLAT">Flat Amount (₹)</option>
                  <option value="PERCENT">Percentage (%)</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label" style={{ color: '#cbd5e1' }}>Extra Discount Value</label>
                <input
                  type="number"
                  min="0"
                  className="input-field"
                  style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
                  value={formData.extraDiscountValue || ''}
                  onChange={(e) => updateField('extraDiscountValue', Number(e.target.value))}
                  placeholder={formData.extraDiscountType === 'PERCENT' ? 'e.g. 5 (%)' : 'e.g. 2000 (₹)'}
                />
              </div>

              <div className="input-group">
                <label className="input-label" style={{ color: '#cbd5e1' }}>Offer Highlight Label</label>
                <input
                  type="text"
                  className="input-field"
                  style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
                  value={formData.extraDiscountLabel || ''}
                  onChange={(e) => updateField('extraDiscountLabel', e.target.value)}
                  placeholder="e.g. Extra ₹2,000 Off on SBI Kisan Card"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Live Calculated Pricing Summary */}
      <div style={{ background: '#070d1a', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.25rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
          Authoritative Real-Time Pricing Summary
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
          <div>
            <span style={{ color: '#94a3b8' }}>Catalog Discount:</span>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f59e0b' }}>
              {discountPercent}% ({formatINR(discountAmount)})
            </div>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>Extra Discount:</span>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#34d399' }}>
              {hasExtra && calculatedExtraAmt > 0 ? `-${formatINR(calculatedExtraAmt)}` : 'None'}
            </div>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>Final Effective Farmer Price:</span>
            <div style={{ fontWeight: 900, fontSize: '1.25rem', color: '#86efac' }}>
              {formatINR(effectiveFinalPrice)}
            </div>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>Estimated Gross Margin:</span>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#10b981' }}>
              {formData.costPrice ? formatINR(effectiveFinalPrice - formData.costPrice) : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabPricing;
