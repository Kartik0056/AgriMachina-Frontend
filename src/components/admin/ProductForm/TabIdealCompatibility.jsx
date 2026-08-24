import React, { useState } from 'react';
import { Sprout, CheckCircle2, Wrench, Plus, X } from 'lucide-react';

const idealPresets = [
  'Small Farms',
  'Medium Farms',
  'Large Farms',
  'Vegetable Farming',
  'Orchards',
  'Nurseries',
  'Gardening',
  'Paddy',
  'Wheat',
  'Sugarcane',
  'Cotton',
  'Fruit Farming',
  'Commercial Farming'
];

const TabIdealCompatibility = ({ formData, updateField }) => {
  const currentIdeal = formData.idealFor || [];
  const compatibility = formData.compatibility || {
    compatibleMachines: [],
    compatibleModels: [],
    compatibleBrands: [],
    compatibleAttachments: []
  };

  const [customIdeal, setCustomIdeal] = useState('');
  const [newAttachment, setNewAttachment] = useState('');
  const [newBrand, setNewBrand] = useState('');

  const toggleIdeal = (preset) => {
    if (currentIdeal.includes(preset)) {
      updateField('idealFor', currentIdeal.filter(item => item !== preset));
    } else {
      updateField('idealFor', [...currentIdeal, preset]);
    }
  };

  const addCustomIdeal = () => {
    if (!customIdeal.trim()) return;
    if (!currentIdeal.includes(customIdeal.trim())) {
      updateField('idealFor', [...currentIdeal, customIdeal.trim()]);
    }
    setCustomIdeal('');
  };

  const addAttachment = () => {
    if (!newAttachment.trim()) return;
    const list = compatibility.compatibleAttachments || [];
    updateField('compatibility', { ...compatibility, compatibleAttachments: [...list, newAttachment.trim()] });
    setNewAttachment('');
  };

  const removeAttachment = (idx) => {
    const list = (compatibility.compatibleAttachments || []).filter((_, i) => i !== idx);
    updateField('compatibility', { ...compatibility, compatibleAttachments: list });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* SECTION 1: IDEAL FOR (REQUIRED) */}
      <div style={{ background: '#0b1324', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sprout size={18} color="#34d399" />
          <span>"Ideal For" Farm Holdings & Crops (Required)</span>
        </h4>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
          Select the farm sizes and crop categories where this machine operates at peak efficiency. Displays as visual chips on PDP.
        </p>

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2" style={{ marginBottom: '1rem' }}>
          {idealPresets.map((preset) => {
            const isSelected = currentIdeal.includes(preset);
            return (
              <button
                key={preset}
                type="button"
                onClick={() => toggleIdeal(preset)}
                className={`chip ${isSelected ? 'active' : ''}`}
                style={{
                  background: isSelected ? '#166534' : '#070d1a',
                  borderColor: isSelected ? '#22c55e' : '#1e2e4f',
                  color: isSelected ? '#ffffff' : '#cbd5e1',
                  cursor: 'pointer'
                }}
              >
                {isSelected && <CheckCircle2 size={14} color="#34d399" />}
                <span>{preset}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Ideal For Input */}
        <div className="flex gap-2" style={{ maxWidth: '400px' }}>
          <input
            type="text"
            className="input-field"
            style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={customIdeal}
            onChange={(e) => setCustomIdeal(e.target.value)}
            placeholder="Add custom crop (e.g. Chilli, Turmeric)"
          />
          <button type="button" onClick={addCustomIdeal} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: COMPATIBILITY ATTACHMENTS & BRANDS */}
      <div style={{ background: '#0b1324', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Wrench size={18} color="#34d399" />
          <span>Compatibility Attachments & Implements</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="input-label" style={{ color: '#cbd5e1', marginBottom: '0.5rem', display: 'block' }}>
              Compatible Attachments (Powers Bundles)
            </label>
            <div className="flex gap-2" style={{ marginBottom: '0.75rem' }}>
              <input
                type="text"
                className="input-field"
                style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
                value={newAttachment}
                onChange={(e) => setNewAttachment(e.target.value)}
                placeholder="e.g. Adjustable Ridger, Iron Wheels"
              />
              <button type="button" onClick={addAttachment} className="btn btn-primary btn-sm">
                <Plus size={16} />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(compatibility.compatibleAttachments || []).map((att, idx) => (
                <span key={idx} className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {att}
                  <button type="button" onClick={() => removeAttachment(idx)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabIdealCompatibility;
