import React from 'react';
import { Settings, Cpu, Gauge, Layers, Zap } from 'lucide-react';

const SpecificationTable = ({ specifications = [] }) => {
  if (!specifications || specifications.length === 0) return null;

  // Group specs by group name
  const groups = specifications.reduce((acc, spec) => {
    const groupName = (spec.group || 'GENERAL').toUpperCase();
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(spec);
    return acc;
  }, {});

  const getGroupIcon = (group) => {
    switch (group) {
      case 'ENGINE': return <Zap size={18} color="#166534" />;
      case 'PERFORMANCE': return <Gauge size={18} color="#166534" />;
      case 'DIMENSIONS': return <Layers size={18} color="#166534" />;
      case 'ELECTRICAL': return <Cpu size={18} color="#166534" />;
      default: return <Settings size={18} color="#166534" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(groups).map(([groupName, specs]) => (
        <div key={groupName} style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <div style={{
            background: 'var(--bg-surface-alt)',
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: 'var(--text-main)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {getGroupIcon(groupName)}
            <span>{groupName} Specifications</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <tbody>
              {specs.map((spec, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: idx === specs.length - 1 ? 'none' : '1px solid #f1f5f9',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa'
                  }}
                >
                  <td style={{ padding: '0.75rem 1.25rem', color: 'var(--text-muted)', width: '40%', fontWeight: 500 }}>
                    {spec.name}
                  </td>
                  <td style={{ padding: '0.75rem 1.25rem', color: 'var(--text-main)', fontWeight: 600 }}>
                    {spec.value} {spec.unit ? <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({spec.unit})</span> : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default SpecificationTable;
