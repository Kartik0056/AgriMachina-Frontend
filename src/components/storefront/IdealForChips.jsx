import React from 'react';
import { Sprout, CheckCircle2 } from 'lucide-react';

const IdealForChips = ({ idealFor = [] }) => {
  if (!idealFor || idealFor.length === 0) return null;

  return (
    <div style={{ background: '#f0fdf4', padding: '1.25rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
      <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
        <Sprout size={20} color="#166534" />
        <h4 style={{ fontSize: '1rem', color: '#062416', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Ideal For Farm Types & Crops
        </h4>
      </div>

      <div className="flex flex-wrap gap-2">
        {idealFor.map((item, idx) => (
          <span
            key={idx}
            className="chip active"
            style={{
              background: '#ffffff',
              border: '1px solid #86efac',
              color: '#14532d',
              fontWeight: 600,
              fontSize: '0.85rem',
              padding: '0.45rem 0.85rem'
            }}
          >
            <CheckCircle2 size={15} color="#22c55e" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default IdealForChips;
