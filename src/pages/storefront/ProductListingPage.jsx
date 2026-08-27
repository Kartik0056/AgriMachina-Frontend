import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, RefreshCw, X, SlidersHorizontal, IndianRupee, Tag, Check } from 'lucide-react';
import ProductCard from '../../components/storefront/ProductCard';
import CategoryIcon from '../../components/common/CategoryIcon';
import api from '../../services/api';
import { useLiveRefresh } from '../../context/SyncContext';
import { formatINR } from '../../services/emiHelper';

const QUICK_PRICE_RANGES = [
  { label: 'Under ₹500', min: '0', max: '500' },
  { label: '₹500 - ₹2,000', min: '500', max: '2000' },
  { label: '₹2,000 - ₹10,000', min: '2000', max: '10000' },
  { label: '₹10,000 - ₹50,000', min: '10000', max: '50000' },
  { label: 'Above ₹50,000', min: '50000', max: '' }
];

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filter query parameters
  const selectedCategory = searchParams.get('category') || '';
  const selectedBrand = searchParams.get('brand') || '';
  const selectedIdealFor = searchParams.get('idealFor') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'popular';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  // Local state for price inputs & brand search
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [brandSearchTerm, setBrandSearchTerm] = useState('');

  // Selected brands array (supports comma-separated multi-brand)
  const selectedBrandsList = selectedBrand ? selectedBrand.split(',').map((b) => b.trim()).filter(Boolean) : [];

  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  const idealForOptions = [
    'Small Farms',
    'Medium Farms',
    'Large Farms',
    'Vegetable Farming',
    'Orchards',
    'Spices & Food Processing',
    'Commercial & Retail',
    'Gardening'
  ];

  const fetchMetadata = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        api.get('/categories'),
        api.get('/brands')
      ]);
      if (catRes.data.success) setCategories(catRes.data.categories || []);
      if (brandRes.data.success) setBrands(brandRes.data.brands || []);
    } catch (err) {}
  };

  const fetchFilteredProducts = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const queryParams = new URLSearchParams(searchParams);
      const res = await api.get(`/products?${queryParams.toString()}`);
      if (res.data.success) {
        setProducts(res.data.products || []);
        setTotal(res.data.total || 0);
      }
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchFilteredProducts(false);
  }, [searchParams]);

  // Live real-time sync
  useLiveRefresh(() => {
    fetchFilteredProducts(true);
    fetchMetadata();
  }, ['CATALOG_CHANGED', 'INVENTORY_UPDATED', 'CATEGORY_CHANGED']);

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value !== undefined && value !== null && value !== '') {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams);
  };

  const toggleBrandFilter = (brandName) => {
    let updated;
    if (selectedBrandsList.includes(brandName)) {
      updated = selectedBrandsList.filter((b) => b !== brandName);
    } else {
      updated = [...selectedBrandsList, brandName];
    }
    updateFilter('brand', updated.join(','));
  };

  const handleApplyPriceFilter = (e) => {
    if (e) e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (localMinPrice) nextParams.set('minPrice', localMinPrice);
    else nextParams.delete('minPrice');

    if (localMaxPrice) nextParams.set('maxPrice', localMaxPrice);
    else nextParams.delete('maxPrice');

    setSearchParams(nextParams);
  };

  const handleQuickPriceSelect = (range) => {
    const nextParams = new URLSearchParams(searchParams);
    if (range.min) nextParams.set('minPrice', range.min);
    else nextParams.delete('minPrice');

    if (range.max) nextParams.set('maxPrice', range.max);
    else nextParams.delete('maxPrice');

    setLocalMinPrice(range.min || '');
    setLocalMaxPrice(range.max || '');
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setBrandSearchTerm('');
    setSearchParams({});
  };

  // Filtered brands list by search
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(brandSearchTerm.toLowerCase().trim())
  );

  // Dynamic Page Title
  const getPageTitle = () => {
    if (selectedCategory) return selectedCategory;
    if (selectedBrandsList.length === 1) return `Products by ${selectedBrandsList[0]}`;
    if (selectedBrandsList.length > 1) return `Brands: ${selectedBrandsList.join(', ')}`;
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (selectedIdealFor) return `${selectedIdealFor} Products`;
    return 'All Products Catalog';
  };

  const hasActiveFilters = Boolean(
    selectedCategory || selectedBrand || selectedIdealFor || searchQuery || minPrice || maxPrice
  );

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem 1.25rem' }}>
      {/* Top Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>
            {getPageTitle()}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
            Showing <strong>{total}</strong> verified products in stock
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="select-field"
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="flex gap-2 flex-wrap items-center" style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: 'var(--bg-surface-alt)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Filters:</span>

          {selectedCategory && (
            <span className="badge" style={{ background: '#dcfce7', color: '#166534', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.6rem' }}>
              Category: {selectedCategory}
              <X size={13} style={{ cursor: 'pointer' }} onClick={() => updateFilter('category', '')} />
            </span>
          )}

          {selectedBrandsList.map((b) => (
            <span key={b} className="badge" style={{ background: '#dbeafe', color: '#1e40af', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.6rem' }}>
              Brand: {b}
              <X size={13} style={{ cursor: 'pointer' }} onClick={() => toggleBrandFilter(b)} />
            </span>
          ))}

          {(minPrice || maxPrice) && (
            <span className="badge" style={{ background: '#fef3c7', color: '#92400e', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.6rem' }}>
              Price: {minPrice ? `₹${minPrice}` : '₹0'} - {maxPrice ? `₹${maxPrice}` : 'Any'}
              <X
                size={13}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setLocalMinPrice('');
                  setLocalMaxPrice('');
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.delete('minPrice');
                  nextParams.delete('maxPrice');
                  setSearchParams(nextParams);
                }}
              />
            </span>
          )}

          {searchQuery && (
            <span className="badge" style={{ background: '#f1f5f9', color: '#334155', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.6rem' }}>
              Keyword: "{searchQuery}"
              <X size={13} style={{ cursor: 'pointer' }} onClick={() => updateFilter('search', '')} />
            </span>
          )}

          <button
            onClick={clearAllFilters}
            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', marginLeft: 'auto' }}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Fixed-width Sidebar + Robust Auto-Fit Products Grid */}
      <div className="catalog-layout" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Filter Sidebar */}
        <div
          style={{
            width: '290px',
            flexShrink: 0,
            background: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            padding: '1.5rem',
            position: 'sticky',
            top: '85px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.45rem', margin: 0, fontWeight: 800 }}>
              <Filter size={18} color="#166534" />
              <span>Filters</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Reset All
              </button>
            )}
          </div>

          {/* Search Query Input */}
          <div className="input-group" style={{ margin: 0 }}>
            <label className="input-label" style={{ fontWeight: 700, fontSize: '0.8rem' }}>Keyword / Model Search</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search products, brands, units..."
                className="input-field"
                style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
                value={searchQuery}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
              <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Price Range Filter (Slider & Inputs & Quick Chips) */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <label className="input-label" style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <IndianRupee size={14} color="#166534" />
              <span>Price Range</span>
            </label>

            {/* Quick Price Chips */}
            <div className="flex flex-wrap gap-1.5" style={{ marginBottom: '0.75rem' }}>
              {QUICK_PRICE_RANGES.map((r, idx) => {
                const isCur = minPrice === r.min && maxPrice === r.max;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickPriceSelect(r)}
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.25rem 0.55rem',
                      borderRadius: '6px',
                      border: isCur ? '1.5px solid #166534' : '1px solid var(--border-color)',
                      background: isCur ? '#dcfce7' : 'var(--bg-surface-alt)',
                      color: isCur ? '#166534' : 'var(--text-main)',
                      fontWeight: isCur ? 800 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>

            {/* Min-Max Input Form */}
            <form onSubmit={handleApplyPriceFilter} className="flex gap-2 items-center">
              <div style={{ flex: 1 }}>
                <input
                  type="number"
                  placeholder="Min ₹"
                  min="0"
                  className="input-field"
                  style={{ padding: '0.4rem 0.5rem', fontSize: '0.8rem' }}
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                />
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>-</span>
              <div style={{ flex: 1 }}>
                <input
                  type="number"
                  placeholder="Max ₹"
                  min="0"
                  className="input-field"
                  style={{ padding: '0.4rem 0.5rem', fontSize: '0.8rem' }}
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ padding: '0.4rem 0.65rem', fontSize: '0.75rem', fontWeight: 800 }}
              >
                Go
              </button>
            </form>
          </div>

          {/* Searchable Brand Filter */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ fontWeight: 700, fontSize: '0.8rem', margin: 0 }}>
                Brands ({brands.length})
              </label>
              {selectedBrandsList.length > 0 && (
                <button
                  type="button"
                  onClick={() => updateFilter('brand', '')}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Clear ({selectedBrandsList.length})
                </button>
              )}
            </div>

            {/* Brand Search Input */}
            {brands.length > 6 && (
              <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Search brand (e.g. Tata, Everest)..."
                  className="input-field"
                  style={{ padding: '0.35rem 0.5rem 0.35rem 1.85rem', fontSize: '0.75rem', height: '30px' }}
                  value={brandSearchTerm}
                  onChange={(e) => setBrandSearchTerm(e.target.value)}
                />
                <Search size={12} color="#94a3b8" style={{ position: 'absolute', left: '0.55rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            )}

            <div className="flex flex-col gap-1.5" style={{ maxHeight: '180px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {filteredBrands.length === 0 ? (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                  No brand matches "{brandSearchTerm}"
                </div>
              ) : (
                filteredBrands.map((b) => {
                  const isChecked = selectedBrandsList.includes(b.name);
                  return (
                    <label
                      key={b._id}
                      className="flex items-center gap-2"
                      style={{
                        fontSize: '0.825rem',
                        cursor: 'pointer',
                        padding: '0.2rem 0.35rem',
                        borderRadius: '6px',
                        background: isChecked ? 'rgba(22, 101, 52, 0.08)' : 'transparent'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleBrandFilter(b.name)}
                        style={{ accentColor: '#166534', width: '15px', height: '15px' }}
                      />
                      <span style={{ fontWeight: isChecked ? 800 : 500, color: isChecked ? '#166534' : 'var(--text-main)' }}>
                        {b.name}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Categories Filter with CategoryIcon */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <label className="input-label" style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem', display: 'block' }}>
              Categories ({categories.length})
            </label>
            <div className="flex flex-col gap-1" style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              <label
                className="flex items-center gap-2"
                style={{
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '6px',
                  background: !selectedCategory ? '#166534' : 'transparent',
                  color: !selectedCategory ? '#ffffff' : 'var(--text-main)',
                  fontWeight: !selectedCategory ? 800 : 500
                }}
              >
                <input
                  type="radio"
                  name="cat"
                  style={{ display: 'none' }}
                  checked={!selectedCategory}
                  onChange={() => updateFilter('category', '')}
                />
                <span style={{ width: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌟</span>
                <span>All Categories</span>
              </label>

              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <label
                    key={cat._id}
                    className="flex items-center gap-2"
                    style={{
                      fontSize: '0.825rem',
                      cursor: 'pointer',
                      padding: '0.35rem 0.5rem',
                      borderRadius: '6px',
                      background: isSelected ? '#166534' : 'transparent',
                      color: isSelected ? '#ffffff' : 'var(--text-main)',
                      fontWeight: isSelected ? 800 : 500
                    }}
                  >
                    <input
                      type="radio"
                      name="cat"
                      style={{ display: 'none' }}
                      checked={isSelected}
                      onChange={() => updateFilter('category', cat.name)}
                    />
                    <div style={{ width: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CategoryIcon icon={cat.icon} size={15} color={isSelected ? '#ffffff' : '#166534'} />
                    </div>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Applications / Usage Filter */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <label className="input-label" style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.5rem', display: 'block' }}>
              Applications & Use Cases
            </label>
            <div className="flex flex-wrap gap-1.5">
              {idealForOptions.map((opt) => {
                const isSelected = selectedIdealFor === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateFilter('idealFor', isSelected ? '' : opt)}
                    className={`chip ${isSelected ? 'active' : ''}`}
                    style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem', cursor: 'pointer' }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Products Grid Column */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <RefreshCw className="animate-spin" size={32} color="#166534" style={{ margin: '0 auto 1rem auto' }} />
              <div>Loading product catalog...</div>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <Search size={40} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Products Match Your Filters</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Try adjusting your brand, category selection, search keywords, or clearing price filters.
              </p>
              <button onClick={clearAllFilters} className="btn btn-primary btn-sm">
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
