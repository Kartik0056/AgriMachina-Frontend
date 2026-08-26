import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Trash2 } from 'lucide-react';
import adminApi from '../../../services/adminApi';

const TabRecommendations = ({ formData, updateField }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState('');

  const recommendations = formData.recommendations || {
    manualRecommendations: [],
    frequentlyBoughtTogether: []
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await adminApi.get('/products?limit=100');
        if (res.data.success) {
          setAllProducts(res.data.products.filter(p => p._id !== formData._id));
        }
      } catch (err) {}
    };
    loadProducts();
  }, [formData._id]);

  const addManualRec = (productId) => {
    const list = recommendations.manualRecommendations || [];
    if (!list.includes(productId)) {
      updateField('recommendations', {
        ...recommendations,
        manualRecommendations: [...list, productId]
      });
    }
  };

  const removeManualRec = (productId) => {
    const list = (recommendations.manualRecommendations || []).filter(id => id !== productId && id?._id !== productId);
    updateField('recommendations', {
      ...recommendations,
      manualRecommendations: list
    });
  };

  const addBoughtTogether = (productId) => {
    const list = recommendations.frequentlyBoughtTogether || [];
    if (!list.includes(productId)) {
      updateField('recommendations', {
        ...recommendations,
        frequentlyBoughtTogether: [...list, productId]
      });
    }
  };

  const removeBoughtTogether = (productId) => {
    const list = (recommendations.frequentlyBoughtTogether || []).filter(id => id !== productId && id?._id !== productId);
    updateField('recommendations', {
      ...recommendations,
      frequentlyBoughtTogether: list
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Manual Recommendations Override */}
      <div style={{ background: 'var(--admin-bg-main)', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="#34d399" />
          <span>Manual "You May Also Like" Product Overrides</span>
        </h4>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
          If left empty, the smart multi-signal recommendation engine automatically scores category, subcategory, application, and price matches.
        </p>

        {/* Selected Recommendations */}
        <div className="flex flex-wrap gap-2" style={{ marginBottom: '1rem' }}>
          {(recommendations.manualRecommendations || []).map((item) => {
            const prod = typeof item === 'object' ? item : allProducts.find(p => p._id === item);
            return (
              <span key={prod?._id || item} className="badge badge-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>{prod?.name || item}</span>
                <button type="button" onClick={() => removeManualRec(prod?._id || item)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                  ✕
                </button>
              </span>
            );
          })}
        </div>

        {/* Select Dropdown to Add */}
        <select
          className="select-field"
          style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff', maxWidth: '400px' }}
          onChange={(e) => {
            if (e.target.value) addManualRec(e.target.value);
            e.target.value = '';
          }}
        >
          <option value="">-- Add Manual Recommendation --</option>
          {allProducts.map(p => (
            <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
          ))}
        </select>
      </div>

      {/* Frequently Bought Together Bundle Configuration */}
      <div style={{ background: 'var(--admin-bg-main)', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '0.5rem' }}>
          Frequently Bought Together (Combo Bundle Accessories)
        </h4>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
          Select matching blades, spray attachments, or accessories that appear in the 1-click bundle card on PDP.
        </p>

        <div className="flex flex-wrap gap-2" style={{ marginBottom: '1rem' }}>
          {(recommendations.frequentlyBoughtTogether || []).map((item) => {
            const prod = typeof item === 'object' ? item : allProducts.find(p => p._id === item);
            return (
              <span key={prod?._id || item} className="badge badge-gold" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>{prod?.name || item}</span>
                <button type="button" onClick={() => removeBoughtTogether(prod?._id || item)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                  ✕
                </button>
              </span>
            );
          })}
        </div>

        <select
          className="select-field"
          style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff', maxWidth: '400px' }}
          onChange={(e) => {
            if (e.target.value) addBoughtTogether(e.target.value);
            e.target.value = '';
          }}
        >
          <option value="">-- Add Bundle Implement / Part --</option>
          {allProducts.map(p => (
            <option key={p._id} value={p._id}>{p.name} ({p.sku})</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TabRecommendations;
