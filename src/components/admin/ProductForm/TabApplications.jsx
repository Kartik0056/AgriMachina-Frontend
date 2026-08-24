import React, { useState } from 'react';
import { Plus, Trash2, Sprout } from 'lucide-react';

const presetApplications = [
  'Weeding & Inter-Cultivation',
  'Soil Loosening & Aeration',
  'Bed & Furrow Preparation',
  'Drip & Flood Irrigation',
  'Pesticide & Fertilizer Spraying',
  'Crop Harvesting & Cutting',
  'Post-Harvest Fodder Cutting'
];

const TabApplications = ({ formData, updateField }) => {
  const applications = formData.applications || [];
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const addApplication = () => {
    if (!name) return;
    const updated = [...applications, { name, description, image, icon: 'Sprout' }];
    updateField('applications', updated);
    setName('');
    setDescription('');
    setImage('');
  };

  const removeApplication = (idx) => {
    const updated = applications.filter((_, i) => i !== idx);
    updateField('applications', updated);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Quick Add Presets */}
      <div style={{ background: '#070d1a', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>
          🌾 Click to Quickly Add Standard Farm Applications:
        </div>
        <div className="flex flex-wrap gap-2">
          {presetApplications.map((app, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                const updated = [...applications, { name: app, description: `High efficiency ${app.toLowerCase()}`, icon: 'Sprout' }];
                updateField('applications', updated);
              }}
              className="btn btn-secondary btn-sm"
              style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#cbd5e1', fontSize: '0.75rem' }}
            >
              + {app}
            </button>
          ))}
        </div>
      </div>

      {/* Add Custom Application Row */}
      <div style={{ background: '#0b1324', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.25rem' }}>
        <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.75rem' }}>Add Custom Farm Application Card</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            className="input-field"
            style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Application (e.g. Sugarcane Weeding)"
          />

          <input
            type="text"
            className="input-field"
            style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short Description"
          />

          <div className="flex gap-2">
            <input
              type="text"
              className="input-field"
              style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff', flex: 1 }}
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Image URL (optional)"
            />
            <button type="button" onClick={addApplication} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* List of Applications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {applications.map((app, idx) => (
          <div
            key={idx}
            style={{
              background: '#070d1a',
              border: '1px solid #1e2e4f',
              borderRadius: '10px',
              padding: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem'
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>{app.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{app.description}</div>
            </div>
            <button type="button" onClick={() => removeApplication(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabApplications;
