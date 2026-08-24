import React, { useState } from 'react';
import { Package, Plus, Trash2 } from 'lucide-react';

const presets = [
  'Machinery Main Unit',
  '32-Piece Heat Treated Blade Set',
  'Pneumatic Rubber Transport Wheels',
  'Depth Resistance Rod & Bracket',
  'Farmer Maintenance Toolkit & Spanners',
  'Operational Manual & Warranty Card'
];

const TabWhatsIncluded = ({ formData, updateField }) => {
  const whatsIncluded = formData.whatsIncluded || [];
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (!newItem.trim()) return;
    updateField('whatsIncluded', [...whatsIncluded, newItem.trim()]);
    setNewItem('');
  };

  const removeItem = (idx) => {
    updateField('whatsIncluded', whatsIncluded.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-6">
      <div style={{ background: '#070d1a', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>
          📦 Click to Add Standard Package Inclusions:
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => updateField('whatsIncluded', [...whatsIncluded, p])}
              className="btn btn-secondary btn-sm"
              style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#cbd5e1', fontSize: '0.75rem' }}
            >
              + {p}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: '#0b1324', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.25rem' }}>
        <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.75rem' }}>Add In-The-Box Accessory</h4>
        <div className="flex gap-2" style={{ maxWidth: '500px' }}>
          <input
            type="text"
            className="input-field"
            style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="e.g. Safety Goggles & Earplugs"
          />
          <button type="button" onClick={addItem} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {whatsIncluded.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: '#070d1a',
              border: '1px solid #1e2e4f',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ fontSize: '0.875rem', color: '#ffffff' }}>✓ {item}</span>
            <button type="button" onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabWhatsIncluded;
