import React from 'react';
import { Sprout } from 'lucide-react';
import CategoryIcon from '../common/CategoryIcon';

const ApplicationsGrid = ({ applications = [] }) => {
  if (!applications || applications.length === 0) return null;

  return (
    <div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
        Applications & Ideal Use Cases
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {applications.map((app, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {app.image ? (
              <img src={app.image} alt={app.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
            ) : (
              <div style={{ height: '70px', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CategoryIcon icon={app.icon} size={24} color="#166534" fallback={<Sprout size={24} color="#166534" />} />
              </div>
            )}

            <div style={{ padding: '0.85rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {app.name}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {app.description || 'Optimized for high-efficiency field performance.'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsGrid;
