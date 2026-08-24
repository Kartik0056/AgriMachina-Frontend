import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Settings } from 'lucide-react';

const specGroups = ['ENGINE', 'PERFORMANCE', 'DIMENSIONS', 'TRANSMISSION', 'ELECTRICAL', 'GENERAL'];

const presetSpecs = [
  { group: 'ENGINE', name: 'Engine Power', value: '7 HP (5.2 kW)', unit: 'HP' },
  { group: 'ENGINE', name: 'Displacement', value: '208', unit: 'cc' },
  { group: 'ENGINE', name: 'Fuel Type', value: 'Petrol', unit: '' },
  { group: 'ENGINE', name: 'Starting Mechanism', value: 'Recoil Pull Starter', unit: '' },
  { group: 'ENGINE', name: 'Fuel Tank Capacity', value: '3.6', unit: 'Liters' },
  { group: 'PERFORMANCE', name: 'Working Width', value: '600 - 900', unit: 'mm' },
  { group: 'PERFORMANCE', name: 'Working Depth', value: '100 - 150', unit: 'mm' },
  { group: 'PERFORMANCE', name: 'Fuel Consumption', value: '650', unit: 'ml/hr' },
  { group: 'DIMENSIONS', name: 'Machine Weight', value: '85', unit: 'kg' },
  { group: 'DIMENSIONS', name: 'Dimensions (L x W x H)', value: '1400 x 850 x 1050', unit: 'mm' },
  { group: 'TRANSMISSION', name: 'Gearbox', value: '2 Forward + 1 Reverse', unit: '' }
];

const TabSpecs = ({ formData, updateField }) => {
  const specs = formData.specifications || [];

  const [newGroup, setNewGroup] = useState('ENGINE');
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newUnit, setNewUnit] = useState('');

  const addSpec = () => {
    if (!newName || !newValue) return;
    const updated = [
      ...specs,
      { group: newGroup, name: newName, value: newValue, unit: newUnit, order: specs.length + 1 }
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

  return (
    <div className="flex flex-col gap-6">
      {/* Quick Add Presets Ribbon */}
      <div style={{ background: '#070d1a', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>
          ⚡ Click to Rapidly Add Agricultural Spec Presets:
        </div>
        <div className="flex flex-wrap gap-2">
          {presetSpecs.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => addPreset(p)}
              className="btn btn-secondary btn-sm"
              style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#cbd5e1', fontSize: '0.75rem' }}
            >
              + {p.name} ({p.group})
            </button>
          ))}
        </div>
      </div>

      {/* Add Custom Spec Row */}
      <div style={{ background: '#0b1324', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.25rem' }}>
        <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.75rem' }}>Add Custom Specification Entry</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <select
            className="select-field"
            style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
          >
            {specGroups.map(g => <option key={g} value={g}>{g}</option>)}
          </select>

          <input
            type="text"
            className="input-field"
            style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Spec Name (e.g. Working Depth)"
          />

          <input
            type="text"
            className="input-field"
            style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value (e.g. 150)"
          />

          <input
            type="text"
            className="input-field"
            style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
            placeholder="Unit (e.g. mm, HP, kg)"
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
                  No specifications added yet. Use the presets above to add engine, performance, or dimension specs.
                </td>
              </tr>
            ) : (
              specs.map((spec, idx) => (
                <tr key={idx}>
                  <td>
                    <span className="badge badge-primary">{spec.group}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>{spec.name}</td>
                  <td>{spec.value}</td>
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
