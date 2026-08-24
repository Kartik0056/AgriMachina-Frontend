import React from 'react';

const TabWarranty = ({ formData, updateField }) => {
  const warranty = formData.warranty || {
    period: '1 Year Full Manufacturer Warranty',
    type: 'Comprehensive OEM Support',
    provider: 'OEM Pan-India Service Center Network',
    terms: 'Complete coverage on engine, transmission gearbox, and frame. Blade wear covered for 30 days.'
  };

  const updateWarranty = (key, value) => {
    updateField('warranty', { ...warranty, [key]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Warranty Period *</label>
          <input
            type="text"
            className="input-field"
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={warranty.period || '1 Year Manufacturer Warranty'}
            onChange={(e) => updateWarranty('period', e.target.value)}
            placeholder="e.g. 1 Year Manufacturer Warranty"
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Warranty Coverage Type</label>
          <input
            type="text"
            className="input-field"
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={warranty.type || 'Comprehensive'}
            onChange={(e) => updateWarranty('type', e.target.value)}
          />
        </div>

        <div className="input-group md:col-span-2">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Authorized Service Provider</label>
          <input
            type="text"
            className="input-field"
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={warranty.provider || 'OEM Authorized Service Network'}
            onChange={(e) => updateWarranty('provider', e.target.value)}
          />
        </div>

        <div className="input-group md:col-span-2">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Detailed Warranty Terms & Inclusions</label>
          <textarea
            className="textarea-field"
            rows="3"
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={warranty.terms || ''}
            onChange={(e) => updateWarranty('terms', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default TabWarranty;
