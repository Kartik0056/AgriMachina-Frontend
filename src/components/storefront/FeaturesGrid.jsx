import React from 'react';
import { CheckCircle, Zap, Shield, Settings, Award, Cpu, Key, Compass } from 'lucide-react';

const iconMap = {
  Zap: <Zap size={20} color="#166534" />,
  Shield: <Shield size={20} color="#166534" />,
  Settings: <Settings size={20} color="#166534" />,
  Award: <Award size={20} color="#166534" />,
  Cpu: <Cpu size={20} color="#166534" />,
  Key: <Key size={20} color="#166534" />,
  CheckCircle: <CheckCircle size={20} color="#166534" />
};

const FeaturesGrid = ({ features = [] }) => {
  if (!features || features.length === 0) return null;

  return (
    <div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
        Key Engineering Features
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feat, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start'
            }}
          >
            <div style={{
              background: 'var(--primary-50)',
              padding: '0.65rem',
              borderRadius: '10px',
              border: '1px solid #dcfce7',
              flexShrink: 0
            }}>
              {iconMap[feat.icon] || <CheckCircle size={20} color="#166534" />}
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {feat.title}
              </div>
              {feat.description && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  {feat.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesGrid;
