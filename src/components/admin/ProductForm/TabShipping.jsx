import React from 'react';

const TabShipping = ({ formData, updateField }) => {
  const shipping = formData.shipping || {
    available: true,
    panIndia: true,
    estimatedDeliveryDays: '4 - 7 Business Days',
    shippingCharge: 0,
    freeShippingThreshold: 4999,
    installationAvailable: true
  };

  const updateShipping = (key, value) => {
    updateField('shipping', { ...shipping, [key]: value });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Estimated Transit & Delivery Days</label>
          <input
            type="text"
            className="input-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={shipping.estimatedDeliveryDays || '4 - 7 Business Days'}
            onChange={(e) => updateShipping('estimatedDeliveryDays', e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Standard Shipping Charge (₹)</label>
          <input
            type="number"
            className="input-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={shipping.shippingCharge ?? 0}
            onChange={(e) => updateShipping('shippingCharge', Number(e.target.value))}
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Free Shipping Order Threshold (₹)</label>
          <input
            type="number"
            className="input-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={shipping.freeShippingThreshold ?? 4999}
            onChange={(e) => updateShipping('freeShippingThreshold', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3" style={{ background: 'var(--admin-bg-sidebar)', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.25rem' }}>
        <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: '#ffffff', fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={shipping.panIndia !== false}
            onChange={(e) => updateShipping('panIndia', e.target.checked)}
          />
          <span>Pan-India Doorstep Farm Logistics Delivery Enabled</span>
        </label>

        <label className="flex items-center gap-2" style={{ cursor: 'pointer', color: '#ffffff', fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={shipping.installationAvailable !== false}
            onChange={(e) => updateShipping('installationAvailable', e.target.checked)}
          />
          <span>Free Field Installation, Assembly & Operating Demonstration Supported</span>
        </label>
      </div>
    </div>
  );
};

export default TabShipping;
