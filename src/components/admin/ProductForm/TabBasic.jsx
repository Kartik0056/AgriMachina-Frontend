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
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
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
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
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
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
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
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff', textTransform: 'uppercase' }}
            value={formData.sku || ''}
            onChange={(e) => updateField('sku', e.target.value.toUpperCase())}
            placeholder="e.g. AV-708-4S"
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Product Machinery Type</label>
          <input
            type="text"
            className="input-field"
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={formData.productType || 'Machinery'}
            onChange={(e) => updateField('productType', e.target.value)}
            placeholder="e.g. Power Weeder & Cultivator"
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Primary Category *</label>
          <select
            className="select-field"
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={formData.category || ''}
            onChange={(e) => updateField('category', e.target.value)}
          >
            <option value="">-- Select Category --</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Subcategory</label>
          <input
            type="text"
            className="input-field"
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={formData.subcategory || ''}
            onChange={(e) => updateField('subcategory', e.target.value)}
            placeholder="e.g. Petrol Power Weeders"
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>HSN Code</label>
          <input
            type="text"
            className="input-field"
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
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
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
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
          style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
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
          style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
          value={formData.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Detailed engineering highlights, working principles, field benefits, HTML allowed (sanitized on server)..."
        />
      </div>
    </div>
  );
};

export default TabBasic;
