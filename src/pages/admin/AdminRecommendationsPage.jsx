import React, { useState } from 'react';
import { Sparkles, Package, Save, CheckCircle2, Flame, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const defaultCategoryRules = [
  { intent: 'Everyday Curries & Dal', weight: 45, recommendedCategory: 'Spices & Masale', primaryPairing: 'Organic Lakadong Turmeric + Kashmiri Mirch' },
  { intent: 'Royal Biryani & Festive Dining', weight: 50, recommendedCategory: 'Spices & Masale', primaryPairing: 'Kashmiri Mogra Saffron + Tellicherry Pepper' },
  { intent: 'Gourmet Kitchen Prep', weight: 40, recommendedCategory: 'Kitchen & Appliances', primaryPairing: '1000W Copper Mixer Grinder' },
  { intent: 'Ambient Home Living', weight: 35, recommendedCategory: 'Home Decor & Living', primaryPairing: 'Nordic Minimalist Ceramic Vase' },
  { intent: 'Wireless Work & Music', weight: 40, recommendedCategory: 'Electronics & Smart Tech', primaryPairing: 'Active Noise Cancelling Earbuds' },
  { intent: 'Organic Wellness & Health', weight: 35, recommendedCategory: 'Organic Groceries & Oils', primaryPairing: 'Cold-Pressed Virgin Kachi Ghani Oil' }
];

const AdminRecommendationsPage = () => {
  const { addToast } = useToast();
  const [recommendationRules, setRecommendationRules] = useState(defaultCategoryRules);
  const [globalAlgoConfig, setGlobalAlgoConfig] = useState({
    categoryMatchWeight: 40,
    lifestyleMatchWeight: 30,
    priceProximityWeight: 20,
    brandAffinityWeight: 10,
    maxCrossSellItems: 4
  });

  const handleSave = () => {
    addToast('Eidula AI Recommendation & Cross-Sell Engine Rules Updated!', 'success');
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
            Configure scoring weights for "Frequently Bought Together" and lifestyle spice & kitchen cross-sell suggestions.
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
            Determines how candidate products and spices are ranked on Product Detail Pages and Cart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="input-group">
            <label className="input-label" style={{ color: '#cbd5e1' }}>Category Match Weight (%)</label>
            <input
              type="number"
              className="input-field"
              style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
              value={globalAlgoConfig.categoryMatchWeight}
              onChange={(e) => setGlobalAlgoConfig({ ...globalAlgoConfig, categoryMatchWeight: Number(e.target.value) })}
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ color: '#cbd5e1' }}>Lifestyle & Cooking Weight (%)</label>
            <input
              type="number"
              className="input-field"
              style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
              value={globalAlgoConfig.lifestyleMatchWeight}
              onChange={(e) => setGlobalAlgoConfig({ ...globalAlgoConfig, lifestyleMatchWeight: Number(e.target.value) })}
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ color: '#cbd5e1' }}>Price Proximity Weight (%)</label>
            <input
              type="number"
              className="input-field"
              style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
              value={globalAlgoConfig.priceProximityWeight}
              onChange={(e) => setGlobalAlgoConfig({ ...globalAlgoConfig, priceProximityWeight: Number(e.target.value) })}
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ color: '#cbd5e1' }}>Max Suggested Items</label>
            <input
              type="number"
              className="input-field"
              style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
              value={globalAlgoConfig.maxCrossSellItems}
              onChange={(e) => setGlobalAlgoConfig({ ...globalAlgoConfig, maxCrossSellItems: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="admin-card">
        <h3 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: 700, marginBottom: '1rem' }}>
          2. Category Pairing & Culinary Cross-Sell Rules
        </h3>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer Interest / Cooking Need</th>
                <th>Boost Score</th>
                <th>Primary Product Category</th>
                <th>Frequently Bought Pairing</th>
              </tr>
            </thead>
            <tbody>
              {recommendationRules.map((r, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 800, color: '#34d399' }}>✨ {r.intent}</td>
                  <td><span className="badge badge-accent">+{r.weight} Pts</span></td>
                  <td style={{ color: '#ffffff' }}>{r.recommendedCategory}</td>
                  <td style={{ color: '#fef08a' }}>{r.primaryPairing}</td>
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
