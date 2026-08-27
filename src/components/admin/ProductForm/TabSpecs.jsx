import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Settings } from 'lucide-react';

const SPEC_GROUPS = [
  'GENERAL',
  'SPECIFICATIONS',
  'INGREDIENTS',
  'NUTRITION',
  'STORAGE & SHELF LIFE',
  'ENGINE & POWER',
  'PERFORMANCE',
  'DIMENSIONS & WEIGHT',
  'ELECTRICAL',
  'FABRIC & CARE',
  'CERTIFICATIONS'
];

const PRESET_INDUSTRY_SPECS = {
  '🌶️ Spices & Groceries': [
    { group: 'GENERAL', name: 'Form / State', value: 'Ground Powder', unit: '' },
    { group: 'GENERAL', name: 'Net Weight', value: '500', unit: 'gm' },
    { group: 'INGREDIENTS', name: 'Key Ingredients', value: '100% Pure Natural Spices', unit: '' },
    { group: 'STORAGE & SHELF LIFE', name: 'Shelf Life', value: '12', unit: 'Months' },
    { group: 'STORAGE & SHELF LIFE', name: 'Storage Instructions', value: 'Store in a cool, dry place away from sunlight', unit: '' },
    { group: 'CERTIFICATIONS', name: 'FSSAI License', value: '10014011002233', unit: '' },
    { group: 'CERTIFICATIONS', name: 'Dietary Preference', value: 'Vegetarian (100% Natural)', unit: '' }
  ],
  '🌾 Agricultural Machinery': [
    { group: 'ENGINE & POWER', name: 'Engine Power', value: '7 HP (5.2 kW)', unit: 'HP' },
    { group: 'ENGINE & POWER', name: 'Displacement', value: '208', unit: 'cc' },
    { group: 'ENGINE & POWER', name: 'Fuel Type', value: 'Petrol', unit: '' },
    { group: 'ENGINE & POWER', name: 'Starting Mechanism', value: 'Recoil Pull Starter', unit: '' },
    { group: 'ENGINE & POWER', name: 'Fuel Tank Capacity', value: '3.6', unit: 'Liters' },
    { group: 'PERFORMANCE', name: 'Working Width', value: '600 - 900', unit: 'mm' },
    { group: 'PERFORMANCE', name: 'Working Depth', value: '100 - 150', unit: 'mm' },
    { group: 'DIMENSIONS & WEIGHT', name: 'Machine Weight', value: '85', unit: 'kg' }
  ],
  '⚡ Electronics & Appliances': [
    { group: 'ELECTRICAL', name: 'Power Rating', value: '1500', unit: 'Watts' },
    { group: 'ELECTRICAL', name: 'Voltage Input', value: '220 - 240 V AC', unit: 'V' },
    { group: 'ELECTRICAL', name: 'Motor Type', value: '100% Pure Copper Wound', unit: '' },
    { group: 'DIMENSIONS & WEIGHT', name: 'Item Weight', value: '4.5', unit: 'kg' },
    { group: 'CERTIFICATIONS', name: 'ISI / BIS Certified', value: 'Yes (Standard Compliant)', unit: '' }
  ],
  '👕 Fashion & Apparel': [
    { group: 'FABRIC & CARE', name: 'Fabric Material', value: '100% Breathable Cotton', unit: '' },
    { group: 'FABRIC & CARE', name: 'Fit Type', value: 'Regular / Relaxed Fit', unit: '' },
    { group: 'FABRIC & CARE', name: 'Wash Care', value: 'Machine wash warm, do not bleach', unit: '' },
    { group: 'GENERAL', name: 'Occasion', value: 'Casual & Workwear', unit: '' }
  ],
  '🛠️ Hardware & Tools': [
    { group: 'SPECIFICATIONS', name: 'Material Grade', value: 'Forged Chrome Vanadium Steel', unit: '' },
    { group: 'SPECIFICATIONS', name: 'Finish / Coating', value: 'Anti-Rust Phosphate Coating', unit: '' },
    { group: 'DIMENSIONS & WEIGHT', name: 'Product Length', value: '300', unit: 'mm' },
    { group: 'SPECIFICATIONS', name: 'Max Torque / Load', value: '250', unit: 'Nm' }
  ]
};

const TabSpecs = ({ formData, updateField }) => {
  const specs = formData.specifications || [];

  const [activeTab, setActiveTab] = useState('🌶️ Spices & Groceries');
  const [newGroup, setNewGroup] = useState('GENERAL');
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newUnit, setNewUnit] = useState('');

  const addSpec = () => {
    if (!newName.trim() || !newValue.trim()) return;
    const updated = [
      ...specs,
      { group: newGroup, name: newName.trim(), value: newValue.trim(), unit: newUnit.trim(), order: specs.length + 1 }
    ];
    updateField('specifications', updated);
    setNewName('');
    setNewValue('');
    setNewUnit('');
  };

  const removeSpec = (idx) => {
    const updated = specs.filter((_, i) => i !== idx);
    updateField('specifications', updated);
  };

  const moveSpec = (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= specs.length) return;
    const updated = [...specs];
    const temp = updated[idx];
    updated[idx] = updated[target];
    updated[target] = temp;
    updateField('specifications', updated);
  };

  const addPreset = (preset) => {
    const updated = [...specs, { ...preset, order: specs.length + 1 }];
    updateField('specifications', updated);
  };

  const addAllIndustryPresets = (list) => {
    const existingNames = new Set(specs.map(s => s.name.toLowerCase()));
    const newItems = list.filter(item => !existingNames.has(item.name.toLowerCase()));
    updateField('specifications', [...specs, ...newItems]);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Quick Add Presets Ribbon with Industry Tabs */}
      <div style={{ background: 'var(--admin-bg-sidebar)', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1rem' }}>
        <div className="flex items-center justify-between flex-wrap gap-2" style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700 }}>
            ⚡ Industry Specification Templates:
          </div>
          <button
            type="button"
            onClick={() => addAllIndustryPresets(PRESET_INDUSTRY_SPECS[activeTab] || [])}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.72rem', background: '#166534', color: '#86efac', border: '1px solid #16a34a' }}
          >
            + Add All {activeTab} Specs
          </button>
        </div>

        {/* Industry Sub-tabs */}
        <div className="flex gap-1 flex-wrap" style={{ marginBottom: '0.75rem' }}>
          {Object.keys(PRESET_INDUSTRY_SPECS).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.3rem 0.6rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: activeTab === tab ? 800 : 500,
                background: activeTab === tab ? '#2563eb' : 'var(--admin-bg-main)',
                color: activeTab === tab ? '#ffffff' : '#94a3b8'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {(PRESET_INDUSTRY_SPECS[activeTab] || []).map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => addPreset(p)}
              className="btn btn-secondary btn-sm"
              style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#cbd5e1', fontSize: '0.75rem' }}
            >
              + {p.name} {p.unit ? `(${p.unit})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Add Custom Spec Row */}
      <div style={{ background: 'var(--admin-bg-main)', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.25rem' }}>
        <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.75rem' }}>Add Custom Specification Entry</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <select
            className="select-field"
            style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
          >
            {SPEC_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>

          <input
            type="text"
            className="input-field"
            style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Spec Name (e.g. Net Weight / Power)"
          />

          <input
            type="text"
            className="input-field"
            style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value (e.g. 500 or 100% Pure)"
          />

          <input
            type="text"
            className="input-field"
            style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
            placeholder="Unit (e.g. gm, kg, ml, Ltr, HP)"
          />

          <button type="button" onClick={addSpec} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Add Spec</span>
          </button>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Group</th>
              <th>Specification Name</th>
              <th>Value</th>
              <th>Unit</th>
              <th style={{ width: '120px' }}>Reorder / Delete</th>
            </tr>
          </thead>
          <tbody>
            {specs.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No specifications added yet. Use the presets above to add weight, ingredients, shelf life, or technical specs.
                </td>
              </tr>
            ) : (
              specs.map((spec, idx) => (
                <tr key={idx}>
                  <td>
                    <span className="badge badge-primary">{spec.group}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>{spec.name}</td>
                  <td style={{ color: '#86efac' }}>{spec.value}</td>
                  <td><span style={{ color: '#94a3b8' }}>{spec.unit || '—'}</span></td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => moveSpec(idx, -1)} disabled={idx === 0} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <ArrowUp size={15} />
                      </button>
                      <button type="button" onClick={() => moveSpec(idx, 1)} disabled={idx === specs.length - 1} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <ArrowDown size={15} />
                      </button>
                      <button type="button" onClick={() => removeSpec(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', marginLeft: '0.35rem' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabSpecs;
