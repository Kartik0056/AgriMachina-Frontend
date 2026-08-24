import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Zap, Shield, Settings, Award } from 'lucide-react';

const icons = ['Zap', 'Shield', 'Settings', 'Award', 'CheckCircle'];

const TabFeatures = ({ formData, updateField }) => {
  const features = formData.features || [];
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Zap');

  const addFeature = () => {
    if (!title) return;
    const updated = [...features, { title, description, icon, order: features.length + 1 }];
    updateField('features', updated);
    setTitle('');
    setDescription('');
  };

  const removeFeature = (idx) => {
    const updated = features.filter((_, i) => i !== idx);
    updateField('features', updated);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Add Feature Row */}
      <div style={{ background: '#0b1324', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.25rem' }}>
        <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.75rem' }}>Add Product Feature Highlight</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            className="select-field"
            style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          >
            {icons.map(ic => <option key={ic} value={ic}>Icon: {ic}</option>)}
          </select>

          <input
            type="text"
            className="input-field"
            style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Feature Title (e.g. 208cc 4-Stroke Engine)"
          />

          <input
            type="text"
            className="input-field"
            style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (e.g. Uninterrupted 8+ hours field run)"
          />

          <button type="button" onClick={addFeature} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Add Feature</span>
          </button>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {features.map((feat, idx) => (
          <div
            key={idx}
            style={{
              background: '#070d1a',
              border: '1px solid #1e2e4f',
              borderRadius: '10px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>{feat.title}</div>
              {feat.description && (
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>{feat.description}</div>
              )}
            </div>
            <button type="button" onClick={() => removeFeature(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabFeatures;
