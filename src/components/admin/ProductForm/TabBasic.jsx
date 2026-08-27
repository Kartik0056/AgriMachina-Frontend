import React from 'react';

const TabBasic = ({ formData, updateField, categories = [], brands = [] }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="input-group md:col-span-2">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Product Full Name *</label>
          <input
            type="text"
            required
            className="input-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={formData.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g. Power Weeder 7HP Petrol 4-Stroke (AV-708)"
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>OEM Brand *</label>
          <input
            type="text"
            required
            className="input-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={formData.brand || ''}
            onChange={(e) => updateField('brand', e.target.value)}
            placeholder="e.g. AgriPro Master"
            list="brands-list"
          />
          <datalist id="brands-list">
            {brands.map((b) => <option key={b._id} value={b.name} />)}
          </datalist>
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Model Number / Name</label>
          <input
            type="text"
            className="input-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={formData.modelNumber || ''}
            onChange={(e) => updateField('modelNumber', e.target.value)}
            placeholder="e.g. AV-708"
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>SKU (Stock Keeping Unit) *</label>
          <input
            type="text"
            required
            className="input-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff', textTransform: 'uppercase' }}
            value={formData.sku || ''}
            onChange={(e) => updateField('sku', e.target.value.toUpperCase())}
            placeholder="e.g. AV-708-4S"
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Primary Category *</label>
          <select
            className="select-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={formData.category || ''}
            onChange={(e) => {
              const catName = e.target.value;
              updateField('category', catName);
              const foundCat = categories.find(c => c.name === catName);
              if (foundCat) {
                if (foundCat.categoryType && (!formData.productType || formData.productType === 'Machinery' || formData.productType === 'General')) {
                  updateField('productType', foundCat.categoryType);
                }
                if (foundCat.unitType === 'weight' && (!formData.unit || formData.unit === 'unit' || formData.unit === 'pcs')) {
                  updateField('unit', 'gm');
                } else if (foundCat.unitType === 'volume' && (!formData.unit || formData.unit === 'unit' || formData.unit === 'pcs')) {
                  updateField('unit', 'ltr');
                } else if (foundCat.unitType === 'power' && (!formData.unit || formData.unit === 'unit' || formData.unit === 'pcs')) {
                  updateField('unit', 'HP');
                }
              }
            }}
          >
            <option value="">-- Select Category --</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Product Industry / Category Type</label>
          <select
            className="select-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={formData.productType || 'General'}
            onChange={(e) => updateField('productType', e.target.value)}
          >
            <option value="Agricultural Machinery">🌾 Agricultural Machinery & Implements</option>
            <option value="Spices & Groceries">🌶️ Spices, Masala & Grocery Products</option>
            <option value="Electronics & Appliances">⚡ Electronics, Motors & Gadgets</option>
            <option value="Fashion & Apparel">👕 Fashion & Apparel</option>
            <option value="Hardware & Tools">🛠️ Hardware & Tools</option>
            <option value="General FMCG">📦 General FMCG & Retail</option>
            <option value="General">🏷️ General Product</option>
          </select>
        </div>

        {/* Measurement Unit & Net Quantity */}
        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Measurement Unit</label>
          <select
            className="select-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={formData.unit || 'pcs'}
            onChange={(e) => {
              const u = e.target.value;
              updateField('unit', u);
              if (formData.netQuantity) {
                updateField('unitDisplay', `${formData.netQuantity} ${u}`);
              }
            }}
          >
            <optgroup label="Weight (Spices, Grains, Seeds)">
              <option value="gm">gm (Grams)</option>
              <option value="kg">kg (Kilograms)</option>
              <option value="mg">mg (Milligrams)</option>
              <option value="quintal">quintal</option>
            </optgroup>
            <optgroup label="Volume (Oils, Sprays, Liquids)">
              <option value="ml">ml (Milliliters)</option>
              <option value="ltr">ltr (Liters)</option>
            </optgroup>
            <optgroup label="Count / Packaging">
              <option value="pcs">pcs (Pieces)</option>
              <option value="pack">pack (Pack)</option>
              <option value="box">box (Box)</option>
              <option value="bottle">bottle</option>
              <option value="can">can</option>
              <option value="set">set (Set)</option>
              <option value="unit">unit</option>
            </optgroup>
            <optgroup label="Power & Dimensions">
              <option value="HP">HP (Horsepower)</option>
              <option value="W">Watt</option>
              <option value="kW">kW (Kilowatt)</option>
              <option value="cc">cc (Engine Displacement)</option>
              <option value="meter">meter</option>
            </optgroup>
          </select>
        </div>

        <div className="input-group">
          <div className="flex justify-between items-center" style={{ marginBottom: '0.25rem' }}>
            <label className="input-label" style={{ color: '#cbd5e1', margin: 0 }}>Net Quantity / Size</label>
            {formData.netQuantity && formData.unit && (
              <span style={{ fontSize: '0.75rem', color: 'var(--admin-accent, #22c55e)', fontWeight: 700 }}>
                Display: {formData.netQuantity} {formData.unit}
              </span>
            )}
          </div>
          <input
            type="text"
            className="input-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={formData.netQuantity || ''}
            onChange={(e) => {
              const q = e.target.value;
              updateField('netQuantity', q);
              updateField('unitDisplay', q && formData.unit ? `${q} ${formData.unit}` : q);
            }}
            placeholder="e.g. 500 (for 500gm), 1 (for 1kg or 1Ltr), 7 (for 7HP)"
          />
        </div>

        <div className="input-group">
          <div className="flex justify-between items-center" style={{ marginBottom: '0.25rem' }}>
            <label className="input-label" style={{ color: '#cbd5e1', margin: 0 }}>Subcategory</label>
            {(() => {
              const currentCat = categories.find((c) => c.name === formData.category);
              return currentCat?.subcategories?.length > 0 ? (
                <span style={{ fontSize: '0.7rem', color: 'var(--admin-accent, #22c55e)', fontWeight: 600 }}>
                  {currentCat.subcategories.length} suggestions available
                </span>
              ) : null;
            })()}
          </div>
          <input
            type="text"
            list="subcategories-datalist"
            className="input-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={formData.subcategory || ''}
            onChange={(e) => updateField('subcategory', e.target.value)}
            placeholder="Select from suggestions or type custom subcategory"
          />
          <datalist id="subcategories-datalist">
            {(() => {
              const currentCat = categories.find((c) => c.name === formData.category);
              if (!currentCat?.subcategories) return null;
              return currentCat.subcategories.map((sub, sIdx) => (
                <option key={sIdx} value={sub.name}>{sub.name}</option>
              ));
            })()}
          </datalist>
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>HSN Code</label>
          <input
            type="text"
            className="input-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={formData.hsnCode || '8432'}
            onChange={(e) => updateField('hsnCode', e.target.value)}
            placeholder="e.g. 8432"
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Country of Origin</label>
          <input
            type="text"
            className="input-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={formData.countryOfOrigin || 'India'}
            onChange={(e) => updateField('countryOfOrigin', e.target.value)}
          />
        </div>
      </div>

      <div className="input-group">
        <label className="input-label" style={{ color: '#cbd5e1' }}>Short Technical Summary</label>
        <textarea
          className="textarea-field"
          rows="2"
          style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
          value={formData.shortDescription || ''}
          onChange={(e) => updateField('shortDescription', e.target.value)}
          placeholder="Brief 1-2 sentence engineering overview for search and cards..."
        />
      </div>

      <div className="input-group">
        <label className="input-label" style={{ color: '#cbd5e1' }}>Full Product Technical Description (HTML / Rich Text Supported)</label>
        <textarea
          className="textarea-field"
          rows="6"
          style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
          value={formData.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Detailed engineering highlights, working principles, field benefits, HTML allowed (sanitized on server)..."
        />
      </div>
    </div>
  );
};

export default TabBasic;
