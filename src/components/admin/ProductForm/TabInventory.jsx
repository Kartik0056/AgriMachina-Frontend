import React from 'react';

const TabInventory = ({ formData, updateField, isEdit = false }) => {
  const stock = Number(formData.stockQuantity) || 0;
  const threshold = Number(formData.lowStockThreshold) || 5;

  let computedStatus = 'IN STOCK';
  if (stock <= 0) computedStatus = 'OUT OF STOCK';
  else if (stock <= threshold) computedStatus = 'LOW STOCK';

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Stock Quantity in Warehouse *</label>
          <input
            type="number"
            required
            className="input-field"
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={formData.stockQuantity ?? ''}
            onChange={(e) => updateField('stockQuantity', Number(e.target.value))}
            placeholder="e.g. 25"
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Low Stock Alert Threshold</label>
          <input
            type="number"
            className="input-field"
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={formData.lowStockThreshold ?? 5}
            onChange={(e) => updateField('lowStockThreshold', Number(e.target.value))}
            placeholder="e.g. 5"
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Warehouse Location</label>
          <input
            type="text"
            className="input-field"
            style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={formData.warehouse || 'Central Agro Hub'}
            onChange={(e) => updateField('warehouse', e.target.value)}
          />
        </div>
      </div>

      {isEdit && (
        <div className="input-group">
          <label className="input-label" style={{ color: '#f59e0b' }}>Stock Change Reason (For Audit & Inventory Log)</label>
          <input
            type="text"
            className="input-field"
            style={{ background: '#0b1324', borderColor: '#f59e0b', color: '#ffffff' }}
            value={formData.stockChangeReason || ''}
            onChange={(e) => updateField('stockChangeReason', e.target.value)}
            placeholder="e.g. Received shipment batch #9 from OEM factory"
          />
        </div>
      )}

      <div style={{ background: '#070d1a', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Computed Stock Status:</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: computedStatus === 'OUT OF STOCK' ? '#ef4444' : computedStatus === 'LOW STOCK' ? '#f59e0b' : '#34d399' }}>
            {computedStatus}
          </div>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          Status automatically updates based on threshold rules.
        </div>
      </div>
    </div>
  );
};

export default TabInventory;
