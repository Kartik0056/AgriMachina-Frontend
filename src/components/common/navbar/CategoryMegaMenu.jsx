import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, ArrowRight } from 'lucide-react';
import CategoryIcon from '../CategoryIcon';

const CategoryMegaMenu = ({
  categoriesList,
  selectedCatId,
  setSelectedCatId,
  setIsMegaMenuOpen,
  navigate,
  activeCategory,
  t
}) => {
  return (
    <div
      className="mega-menu-flyout"
      style={{
        display: 'flex',
        minHeight: '430px',
        maxHeight: '520px'
      }}
    >
      <div
        style={{
          width: '270px',
          background: 'var(--bg-surface-alt)',
          borderRight: '1px solid #e2e8f0',
          padding: '0.75rem',
          overflowY: 'auto'
        }}
      >
        <div
          style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '0.25rem 0.5rem 0.5rem 0.5rem'
          }}
        >
          {t('product_categories', 'Product Categories')}
        </div>

        <div className="flex flex-col gap-1">
          {categoriesList.map((cat) => {
            const isSelected = selectedCatId === cat.id || selectedCatId === cat._id;
            return (
              <div
                key={cat.id || cat._id}
                onMouseEnter={() => setSelectedCatId(cat.id || cat._id)}
                onClick={() => {
                  setIsMegaMenuOpen(false);
                  navigate(`/products?category=${encodeURIComponent(cat.param || cat.name)}`);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: isSelected ? '#166534' : 'transparent',
                  color: isSelected ? '#ffffff' : '#1e293b',
                  border: isSelected ? '1px solid #16a34a' : '1px solid transparent',
                  boxShadow: isSelected ? '0 2px 8px rgba(22, 101, 52, 0.12)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div className="flex items-center gap-2.5" style={{ minWidth: 0 }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                      borderRadius: '6px'
                    }}
                  >
                    <CategoryIcon icon={cat.icon} size={17} color={isSelected ? '#ffffff' : '#166534'} />
                  </div>
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <div
                      style={{
                        fontSize: '0.825rem',
                        fontWeight: isSelected ? 800 : 600,
                        color: isSelected ? '#ffffff' : '#1e293b',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {cat.name}
                    </div>
                    <div style={{ fontSize: '0.675rem', color: isSelected ? '#bbf7d0' : '#64748b', marginTop: '2px' }}>
                      {cat.startingPrice}
                    </div>
                  </div>
                </div>
                <ChevronRight size={14} color={isSelected ? '#86efac' : '#94a3b8'} style={{ flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)'
        }}
      >
        <div>
          <div className="flex items-center justify-between" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '0.85rem' }}>
            <div className="flex items-center gap-2.5">
              <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dcfce7', borderRadius: '8px', flexShrink: 0 }}>
                <CategoryIcon icon={activeCategory.icon} size={22} color="#166534" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  {activeCategory.name}
                </h3>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {activeCategory.tagline}
                </p>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            Popular Variants & Implements
          </div>

          <div className="grid grid-cols-2 gap-2" style={{ marginBottom: '1rem' }}>
            {(activeCategory.subcategories || []).map((sub, idx) => (
              <Link
                key={idx}
                to={`/products?category=${encodeURIComponent(activeCategory.param || activeCategory.name)}&sub=${encodeURIComponent(sub.slug)}`}
                onClick={() => setIsMegaMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.65rem',
                  background: 'var(--bg-surface-alt)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  fontSize: '0.775rem',
                  fontWeight: 600,
                  color: '#334155',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
                className="hover:border-green-500 hover:text-green-800 hover:bg-green-50"
              >
                <Zap size={13} color="#16a34a" />
                <span>{sub.name}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: '0.5rem' }}>
            {(activeCategory.features || []).map((feat, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.7rem',
                  color: '#166534',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '4px',
                  padding: '0.2rem 0.5rem',
                  fontWeight: 600
                }}
              >
                ✓ {feat}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            background: 'linear-gradient(135deg, #14532d, #166534)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#ffffff'
          }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'var(--bg-surface)',
                borderRadius: '6px',
                overflow: 'hidden',
                padding: '2px',
                flexShrink: 0
              }}
            >
              <img
                src={activeCategory.image}
                alt={activeCategory.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff' }}>
                {activeCategory.name}
              </div>
              <div className="flex items-baseline gap-2">
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#fef08a' }}>
                  From {activeCategory.startingPrice}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#86efac' }}>
                  • {activeCategory.emiStarting}
                </span>
              </div>
            </div>
          </div>

          <Link
            to={`/products?category=${encodeURIComponent(activeCategory.param || activeCategory.name)}`}
            onClick={() => setIsMegaMenuOpen(false)}
            className="btn btn-accent btn-sm"
            style={{ background: '#f59e0b', color: '#ffffff', fontWeight: 800, padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
          >
            <span>Explore</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryMegaMenu;
