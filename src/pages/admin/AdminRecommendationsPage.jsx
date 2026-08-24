import React, { useState } from 'react';
import { Sparkles, Tractor, Save, CheckCircle2, Sprout, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const defaultCropWeights = [
  { crop: 'Cotton', weight: 40, recommendedCategory: 'Power Weeder & Tiller', primaryAttachment: 'Inter-row Weeder & Ridger' },
  { crop: 'Sugarcane', weight: 45, recommendedCategory: 'Power Weeder & Tiller', primaryAttachment: '32 Boron Steel Deep Tiller' },
  { crop: 'Paddy & Rice', weight: 50, recommendedCategory: 'Harvesting Machinery', primaryAttachment: '80T Alloy Reaper Blade' },
  { crop: 'Wheat & Grain', weight: 40, recommendedCategory: 'Post Harvesting', primaryAttachment: 'Multi-Crop Grain Thresher' },
  { crop: 'Vegetables', weight: 35, recommendedCategory: 'Sprayers & Crop Protection', primaryAttachment: '16L Dual Motor Knapsack' },
  { crop: 'Horticulture Orchards', weight: 30, recommendedCategory: 'Earth Auger', primaryAttachment: '8" Post Hole Drill Bit' }
];

const AdminRecommendationsPage = () => {
  const { addToast } = useToast();
  const [cropRules, setCropRules] = useState(defaultCropWeights);
  const [globalAlgoConfig, setGlobalAlgoConfig] = useState({
    categoryMatchWeight: 40,
    idealCropMatchWeight: 30,
    priceProximityWeight: 20,
    brandAffinityWeight: 10,
    maxCrossSellItems: 4
  });

  const handleSave = () => {
    addToast('Recommendation & Cross-Sell Engine Rules Updated!', 'success');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={24} color="#34d399" />
            <span>AI Recommendation & Cross-Sell Overrides</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Configure scoring weights for "Frequently Bought Together" and agricultural cross-crop machine suggestions.
          </p>
        </div>

        <button onClick={handleSave} className="btn btn-primary btn-sm">
          <Save size={16} />
          <span>Save Algorithm Rules</span>
        </button>
      </div>

      {/* Algorithm Weights Matrix */}
      <div className="admin-card flex flex-col gap-5">
        <div style={{ borderBottom: '1px solid var(--bg-dark-border)', paddingBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700 }}>
            1. Recommendation Scoring Weights (%)
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Determines how candidate agricultural machines are ranked on Product Detail Pages and Cart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="input-group">
            <label className="input-label" style={{ color: '#cbd5e1' }}>Category Match Weight (%)</label>
            <input
              type="number"
              className="input-field"
              style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
              value={globalAlgoConfig.categoryMatchWeight}
              onChange={(e) => setGlobalAlgoConfig({ ...globalAlgoConfig, categoryMatchWeight: Number(e.target.value) })}
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ color: '#cbd5e1' }}>Crop / Farm Type Weight (%)</label>
            <input
              type="number"
              className="input-field"
              style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
              value={globalAlgoConfig.idealCropMatchWeight}
              onChange={(e) => setGlobalAlgoConfig({ ...globalAlgoConfig, idealCropMatchWeight: Number(e.target.value) })}
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ color: '#cbd5e1' }}>Price Proximity Weight (%)</label>
            <input
              type="number"
              className="input-field"
              style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
              value={globalAlgoConfig.priceProximityWeight}
              onChange={(e) => setGlobalAlgoConfig({ ...globalAlgoConfig, priceProximityWeight: Number(e.target.value) })}
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ color: '#cbd5e1' }}>Max Suggested Items</label>
            <input
              type="number"
              className="input-field"
              style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
              value={globalAlgoConfig.maxCrossSellItems}
              onChange={(e) => setGlobalAlgoConfig({ ...globalAlgoConfig, maxCrossSellItems: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      {/* Crop Rules Table */}
      <div className="admin-card">
        <h3 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700, marginBottom: '1rem' }}>
          2. Crop-Based Recommendation Rules
        </h3>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Crop Type</th>
                <th>Boost Score</th>
                <th>Primary Machinery Category</th>
                <th>Frequently Bought Attachment</th>
              </tr>
            </thead>
            <tbody>
              {cropRules.map((r, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 800, color: '#34d399' }}>🌾 {r.crop}</td>
                  <td><span className="badge badge-accent">+{r.weight} Pts</span></td>
                  <td style={{ color: '#ffffff' }}>{r.recommendedCategory}</td>
                  <td style={{ color: '#fef08a' }}>{r.primaryAttachment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRecommendationsPage;
