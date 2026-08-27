import React, { useState } from 'react';
import { formatINR } from '../../../services/emiHelper';
import { Flame, Tag, Percent, Sparkles, Calendar, Layers, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const VARIANT_PRESETS = {
  '🌶️ Spices & Weight': [
    { name: '100g Pack', unit: 'gm', quantity: '100', mrpFactor: 0.25, priceFactor: 0.25 },
    { name: '250g Pack', unit: 'gm', quantity: '250', mrpFactor: 0.55, priceFactor: 0.55 },
    { name: '500g Pack', unit: 'gm', quantity: '500', mrpFactor: 1.0, priceFactor: 1.0, isDefault: true },
    { name: '1 Kg Family Pack', unit: 'kg', quantity: '1', mrpFactor: 1.9, priceFactor: 1.9 },
    { name: '5 Kg Bulk Bag', unit: 'kg', quantity: '5', mrpFactor: 9.0, priceFactor: 9.0 }
  ],
  '💧 Liquids & Oils': [
    { name: '100 ml Bottle', unit: 'ml', quantity: '100', mrpFactor: 0.25, priceFactor: 0.25 },
    { name: '250 ml Bottle', unit: 'ml', quantity: '250', mrpFactor: 0.55, priceFactor: 0.55 },
    { name: '500 ml Bottle', unit: 'ml', quantity: '500', mrpFactor: 1.0, priceFactor: 1.0, isDefault: true },
    { name: '1 Liter Jar', unit: 'ltr', quantity: '1', mrpFactor: 1.9, priceFactor: 1.9 },
    { name: '5 Liter Can', unit: 'ltr', quantity: '5', mrpFactor: 9.0, priceFactor: 9.0 }
  ],
  '📦 Packs & Units': [
    { name: 'Single (1 Pc)', unit: 'pcs', quantity: '1', mrpFactor: 1.0, priceFactor: 1.0, isDefault: true },
    { name: 'Pack of 2', unit: 'pack', quantity: '2', mrpFactor: 1.9, priceFactor: 1.85 },
    { name: 'Pack of 5', unit: 'pack', quantity: '5', mrpFactor: 4.5, priceFactor: 4.2 },
    { name: 'Box of 10', unit: 'box', quantity: '10', mrpFactor: 9.0, priceFactor: 8.0 }
  ],
  '⚙️ Machinery & Power': [
    { name: '50cc Model', unit: 'cc', quantity: '50', mrpFactor: 1.0, priceFactor: 1.0, isDefault: true },
    { name: '68cc Heavy Duty', unit: 'cc', quantity: '68', mrpFactor: 1.3, priceFactor: 1.25 },
    { name: '7 HP Petrol', unit: 'HP', quantity: '7', mrpFactor: 1.0, priceFactor: 1.0 },
    { name: '9 HP Diesel', unit: 'HP', quantity: '9', mrpFactor: 1.45, priceFactor: 1.4 }
  ]
};

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

  // Variant Draft State
  const variants = Array.isArray(formData.variants) ? formData.variants : [];
  const [varName, setVarName] = useState('');
  const [varUnit, setVarUnit] = useState(formData.unit || 'gm');
  const [varQty, setVarQty] = useState('');
  const [varMrp, setVarMrp] = useState('');
  const [varPrice, setVarPrice] = useState('');
  const [varStock, setVarStock] = useState('20');
  const [varSku, setVarSku] = useState('');
  const [activePresetTab, setActivePresetTab] = useState('🌶️ Spices & Weight');

  const addCustomVariant = () => {
    if (!varName.trim() || !varPrice) return;
    const priceNum = Number(varPrice) || 0;
    const mrpNum = Number(varMrp) || priceNum;
    const discPct = mrpNum > 0 ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;
    const cleanSku = varSku.trim() || (formData.sku ? `${formData.sku}-${varName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}` : '');

    const newVar = {
      name: varName.trim(),
      unit: varUnit || formData.unit || '',
      quantity: varQty.trim(),
      mrp: mrpNum,
      sellingPrice: priceNum,
      discountPercent: discPct,
      stockQuantity: Number(varStock) || 10,
      stockStatus: (Number(varStock) || 10) > 0 ? 'IN STOCK' : 'OUT OF STOCK',
      sku: cleanSku,
      isDefault: variants.length === 0
    };

    updateField('variants', [...variants, newVar]);
    setVarName('');
    setVarQty('');
    setVarMrp('');
    setVarPrice('');
    setVarSku('');
  };

  const removeVariant = (idx) => {
    const updated = variants.filter((_, i) => i !== idx);
    if (updated.length > 0 && !updated.some(v => v.isDefault)) {
      updated[0].isDefault = true;
    }
    updateField('variants', updated);
  };

  const setDefaultVariant = (idx) => {
    const updated = variants.map((v, i) => ({
      ...v,
      isDefault: i === idx
    }));
    updateField('variants', updated);
    // Also sync base price from default variant if desired
    if (updated[idx]) {
      updateField('sellingPrice', updated[idx].sellingPrice);
      updateField('mrp', updated[idx].mrp);
      if (updated[idx].unit) updateField('unit', updated[idx].unit);
      if (updated[idx].quantity) updateField('netQuantity', updated[idx].quantity);
      if (updated[idx].quantity && updated[idx].unit) {
        updateField('unitDisplay', `${updated[idx].quantity} ${updated[idx].unit}`);
      }
    }
  };

  const applyPresetBatch = (presetList) => {
    const baseMrp = mrp || 500;
    const basePrice = sellingPrice || 400;
    const generated = presetList.map((p, idx) => {
      const pMrp = Math.round(baseMrp * (p.mrpFactor || 1));
      const pPrice = Math.round(basePrice * (p.priceFactor || 1));
      const pDisc = pMrp > 0 ? Math.round(((pMrp - pPrice) / pMrp) * 100) : 0;
      return {
        name: p.name,
        unit: p.unit,
        quantity: p.quantity,
        mrp: pMrp,
        sellingPrice: pPrice,
        discountPercent: pDisc,
        stockQuantity: 25,
        stockStatus: 'IN STOCK',
        sku: formData.sku ? `${formData.sku}-${p.quantity}${p.unit.toUpperCase()}` : '',
        isDefault: Boolean(p.isDefault || idx === 0)
      };
    });
    updateField('variants', generated);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Standard Price Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Base MRP (Maximum Retail Price) ₹ *</label>
          <input
            type="number"
            required
            className="input-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={formData.mrp || ''}
            onChange={(e) => updateField('mrp', Number(e.target.value))}
            placeholder="e.g. 500 or 48500"
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Base Selling Price (Incl. GST) ₹ *</label>
          <input
            type="number"
            required
            className="input-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={formData.sellingPrice || ''}
            onChange={(e) => updateField('sellingPrice', Number(e.target.value))}
            placeholder="e.g. 380 or 39999"
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Cost Price (Internal Margin) ₹</label>
          <input
            type="number"
            className="input-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={formData.costPrice || ''}
            onChange={(e) => updateField('costPrice', Number(e.target.value))}
            placeholder="e.g. 280 or 28000"
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>GST Rate (%) *</label>
          <select
            className="select-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={formData.gstPercent !== undefined ? formData.gstPercent : 12}
            onChange={(e) => updateField('gstPercent', Number(e.target.value))}
          >
            <option value={0}>0% (Exempt / Grains / Raw Spices)</option>
            <option value={5}>5% (Packaged Spices, Tea, Food Items)</option>
            <option value={12}>12% (Standard Agricultural & Food Products)</option>
            <option value={18}>18% (Electronics, Machinery, Appliances)</option>
            <option value={28}>28% (Luxury Items / High Motors)</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Seasonal Special Price ₹</label>
          <input
            type="number"
            className="input-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={formData.specialPrice || ''}
            onChange={(e) => updateField('specialPrice', Number(e.target.value))}
            placeholder="Optional festival price"
          />
        </div>
      </div>

      {/* 2. PACK SIZES, WEIGHTS & VARIANTS MANAGER */}
      <div style={{ background: 'var(--admin-bg-main)', border: '1px solid #3b82f6', borderRadius: '12px', padding: '1.25rem' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div className="flex items-center gap-2">
            <Layers size={20} color="#60a5fa" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Product Variants & Pack Sizes (Weight / Volume / Size Options)
            </h3>
            <span className="badge" style={{ background: '#1e3a8a', color: '#93c5fd', fontSize: '0.65rem' }}>
              MULTI-WEIGHT / SIZE SUPPORT
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {variants.length} variant{variants.length === 1 ? '' : 's'} configured
          </span>
        </div>

        {/* Quick Batch Presets */}
        <div style={{ background: 'var(--admin-bg-sidebar)', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #1e2e4f' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            ⚡ One-Click Pack Size & Weight Presets Generator:
          </div>
          <div className="flex gap-2 flex-wrap" style={{ marginBottom: '0.5rem' }}>
            {Object.keys(VARIANT_PRESETS).map((pKey) => (
              <button
                key={pKey}
                type="button"
                onClick={() => applyPresetBatch(VARIANT_PRESETS[pKey])}
                className="btn btn-secondary btn-sm"
                style={{
                  background: 'var(--admin-bg-main)',
                  borderColor: 'var(--admin-border)',
                  color: '#cbd5e1',
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.65rem'
                }}
              >
                + Auto-Generate {pKey} (5 Sizes)
              </button>
            ))}
          </div>
        </div>

        {/* Custom Variant Adder Row */}
        <div style={{ background: 'var(--admin-bg-sidebar)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #1e2e4f' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
            + Add Individual Variant / Pack Size
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2.5 items-end">
            <div>
              <label className="input-label" style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Pack / Variant Name *</label>
              <input
                type="text"
                className="input-field"
                style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff', fontSize: '0.8rem' }}
                placeholder="e.g. 500g Pack"
                value={varName}
                onChange={(e) => setVarName(e.target.value)}
              />
            </div>

            <div>
              <label className="input-label" style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Unit</label>
              <select
                className="select-field"
                style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff', fontSize: '0.8rem' }}
                value={varUnit}
                onChange={(e) => setVarUnit(e.target.value)}
              >
                <option value="gm">gm</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="ltr">ltr</option>
                <option value="pcs">pcs</option>
                <option value="pack">pack</option>
                <option value="box">box</option>
                <option value="HP">HP</option>
              </select>
            </div>

            <div>
              <label className="input-label" style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Qty / Net</label>
              <input
                type="text"
                className="input-field"
                style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff', fontSize: '0.8rem' }}
                placeholder="e.g. 500"
                value={varQty}
                onChange={(e) => setVarQty(e.target.value)}
              />
            </div>

            <div>
              <label className="input-label" style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>MRP ₹</label>
              <input
                type="number"
                className="input-field"
                style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff', fontSize: '0.8rem' }}
                placeholder="e.g. 250"
                value={varMrp}
                onChange={(e) => setVarMrp(e.target.value)}
              />
            </div>

            <div>
              <label className="input-label" style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Selling Price ₹ *</label>
              <input
                type="number"
                className="input-field"
                style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff', fontSize: '0.8rem' }}
                placeholder="e.g. 200"
                value={varPrice}
                onChange={(e) => setVarPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="input-label" style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Stock Qty</label>
              <input
                type="number"
                className="input-field"
                style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff', fontSize: '0.8rem' }}
                placeholder="20"
                value={varStock}
                onChange={(e) => setVarStock(e.target.value)}
              />
            </div>

            <div>
              <button
                type="button"
                onClick={addCustomVariant}
                className="btn btn-primary btn-sm"
                style={{ width: '100%', padding: '0.5rem 0.65rem', justifyContent: 'center' }}
              >
                <Plus size={15} /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Variants List Table */}
        {variants.length > 0 ? (
          <div className="admin-table-container" style={{ margin: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Default</th>
                  <th>Variant / Pack Name</th>
                  <th>Measurement</th>
                  <th>MRP</th>
                  <th>Selling Price</th>
                  <th>Discount</th>
                  <th>Stock</th>
                  <th style={{ width: '60px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((v, vIdx) => (
                  <tr key={vIdx} style={{ background: v.isDefault ? 'rgba(59, 130, 246, 0.12)' : 'transparent' }}>
                    <td>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', margin: 0 }}>
                        <input
                          type="radio"
                          name="default-variant"
                          checked={Boolean(v.isDefault)}
                          onChange={() => setDefaultVariant(vIdx)}
                        />
                        {v.isDefault && <span style={{ fontSize: '0.65rem', color: '#60a5fa', fontWeight: 800 }}>PRIMARY</span>}
                      </label>
                    </td>
                    <td style={{ fontWeight: 800, color: '#ffffff' }}>
                      {v.name}
                      {v.sku && <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>SKU: {v.sku}</div>}
                    </td>
                    <td>
                      <span className="badge badge-primary">{v.quantity ? `${v.quantity} ${v.unit}` : v.unit || '—'}</span>
                    </td>
                    <td style={{ textDecoration: 'line-through', color: '#94a3b8' }}>
                      {formatINR(v.mrp)}
                    </td>
                    <td style={{ fontWeight: 800, color: '#86efac', fontSize: '0.95rem' }}>
                      {formatINR(v.sellingPrice)}
                    </td>
                    <td>
                      <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
                        {v.discountPercent || (v.mrp > v.sellingPrice ? Math.round(((v.mrp - v.sellingPrice) / v.mrp) * 100) : 0)}% OFF
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: v.stockQuantity > 0 ? '#86efac' : '#ef4444', fontWeight: 700 }}>
                        {v.stockQuantity > 0 ? `${v.stockQuantity} in stock` : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => removeVariant(vIdx)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        title="Remove Variant"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.25rem', color: '#94a3b8', fontSize: '0.85rem' }}>
            No pack sizes added. This product will be sold as a single item with base price {formatINR(sellingPrice)}. Use presets above if selling in multiple pack sizes/weights (e.g. 100g, 250g, 500g, 1kg).
          </div>
        )}
      </div>

      {/* 3. Deals of the Day & Hot Deal Campaign */}
      <div style={{ background: 'var(--admin-bg-main)', border: '1px solid #e11d48', borderRadius: '12px', padding: '1.25rem' }}>
        <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
          <Flame size={20} color="#f43f5e" />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Deal of the Day & Hot Offers Feature
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: '0.5rem', background: 'var(--admin-bg-sidebar)', padding: '1rem', borderRadius: '10px', border: '1px solid #2e1065' }}>
              <div className="input-group">
                <label className="input-label" style={{ color: '#cbd5e1' }}>Deal Badge Text (Shown on Product Card)</label>
                <input
                  type="text"
                  className="input-field"
                  style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
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
                  style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
                  value={formData.dealEndsAt ? new Date(formData.dealEndsAt).toISOString().slice(0, 10) : ''}
                  onChange={(e) => updateField('dealEndsAt', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Extra Discount / Instant Cash Rebate */}
      <div style={{ background: 'var(--admin-bg-main)', border: '1px solid #16a34a', borderRadius: '12px', padding: '1.25rem' }}>
        <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
          <Tag size={20} color="#34d399" />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Extra Discount & Special Rebate Offer
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginTop: '0.5rem', background: 'var(--admin-bg-sidebar)', padding: '1rem', borderRadius: '10px', border: '1px solid #064e3b' }}>
              <div className="input-group">
                <label className="input-label" style={{ color: '#cbd5e1' }}>Extra Discount Type</label>
                <select
                  className="select-field"
                  style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
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
                  style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
                  value={formData.extraDiscountValue || ''}
                  onChange={(e) => updateField('extraDiscountValue', Number(e.target.value))}
                  placeholder={formData.extraDiscountType === 'PERCENT' ? 'e.g. 5 (%)' : 'e.g. 50 (₹)'}
                />
              </div>

              <div className="input-group">
                <label className="input-label" style={{ color: '#cbd5e1' }}>Offer Highlight Label</label>
                <input
                  type="text"
                  className="input-field"
                  style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
                  value={formData.extraDiscountLabel || ''}
                  onChange={(e) => updateField('extraDiscountLabel', e.target.value)}
                  placeholder="e.g. Extra ₹50 Off on UPI / First Order"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Live Calculated Pricing Summary */}
      <div style={{ background: 'var(--admin-bg-sidebar)', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.25rem' }}>
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
            <span style={{ color: '#94a3b8' }}>Final Effective Customer Price:</span>
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
