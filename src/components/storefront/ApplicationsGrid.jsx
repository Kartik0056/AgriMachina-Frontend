import React from 'react';
import { Sprout, Scissors, Layers, Sun, Droplets, Sparkles, CheckCircle2 } from 'lucide-react';

const iconMap = {
  Sprout: <Sprout size={24} color="#166534" />,
  Scissors: <Scissors size={24} color="#166534" />,
  Layers: <Layers size={24} color="#166534" />,
  Sun: <Sun size={24} color="#166534" />,
  Droplets: <Droplets size={24} color="#166534" />,
  Sparkles: <Sparkles size={24} color="#166534" />
};

const ApplicationsGrid = ({ applications = [] }) => {
  if (!applications || applications.length === 0) return null;

  return (
    <div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#0f172a' }}>
        Agricultural Applications & Use Cases
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {applications.map((app, idx) => (
          <div
            key={idx}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
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
              <div style={{ height: '70px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {iconMap[app.icon] || <Sprout size={24} color="#166534" />}
              </div>
            )}

            <div style={{ padding: '0.85rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                {app.name}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
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
