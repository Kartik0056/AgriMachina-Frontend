import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, RefreshCw, X, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/storefront/ProductCard';
import api from '../../services/api';

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters state
  const selectedCategory = searchParams.get('category') || '';
  const selectedBrand = searchParams.get('brand') || '';
  const selectedIdealFor = searchParams.get('idealFor') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'popular';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const idealForOptions = [
    'Small Farms',
    'Medium Farms',
    'Large Farms',
    'Vegetable Farming',
    'Orchards',
    'Sugarcane',
    'Cotton',
    'Paddy',
    'Wheat',
    'Gardening'
  ];

  useEffect(() => {
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
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };
    fetchFilteredProducts();
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem 1.25rem' }}>
      {/* Top Header */}
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: '#062416' }}>
            {selectedCategory ? `${selectedCategory}` : selectedIdealFor ? `${selectedIdealFor} Machinery` : 'Agricultural Machinery Catalog'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Showing <strong>{total}</strong> verified farm machinery models in stock
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Sort by:</span>
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

      {/* Main Layout: Fixed-width Sidebar + Robust Auto-Fit Products Grid */}
      <div className="catalog-layout" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Filter Sidebar */}
        <div
          style={{
            width: '280px',
            flexShrink: 0,
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            position: 'sticky',
            top: '85px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div className="flex justify-between items-center" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Filter size={18} color="#166534" />
              <span>Filter Equipment</span>
            </h3>
            {(selectedCategory || selectedBrand || selectedIdealFor || searchQuery || minPrice || maxPrice) && (
              <button
                onClick={clearAllFilters}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Reset All
              </button>
            )}
          </div>

          {/* Search Query Input */}
          <div className="input-group">
            <label className="input-label">Keyword / Model Search</label>
            <input
              type="text"
              placeholder="e.g. 7HP, AV-708, Solar..."
              className="input-field"
              value={searchQuery}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
          </div>

          {/* Categories Filter */}
          <div>
            <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Categories</label>
            <div className="flex flex-col gap-1.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <label className="flex items-center gap-2" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="cat"
                  checked={!selectedCategory}
                  onChange={() => updateFilter('category', '')}
                />
                <span>All Categories</span>
              </label>
              {categories.map((cat) => (
                <label key={cat._id} className="flex items-center gap-2" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="cat"
                    checked={selectedCategory === cat.name}
                    onChange={() => updateFilter('category', cat.name)}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ideal For Crop / Farm Type Filter */}
          <div>
            <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Ideal For Farm Types</label>
            <div className="flex flex-wrap gap-1.5">
              {idealForOptions.map((opt) => {
                const isSelected = selectedIdealFor === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateFilter('idealFor', isSelected ? '' : opt)}
                    className={`chip ${isSelected ? 'active' : ''}`}
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', cursor: 'pointer' }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>OEM Brands</label>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="brand"
                  checked={!selectedBrand}
                  onChange={() => updateFilter('brand', '')}
                />
                <span>All Brands</span>
              </label>
              {brands.map((b) => (
                <label key={b._id} className="flex items-center gap-2" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === b.name}
                    onChange={() => updateFilter('brand', b.name)}
                  />
                  <span>{b.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid Column */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
              <RefreshCw className="animate-spin" size={32} color="#166534" style={{ margin: '0 auto 1rem auto' }} />
              <div>Loading agricultural machinery catalog...</div>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <Search size={40} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem' }}>No Farm Machinery Matches Your Filters</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Try adjusting your category selection, search keyword, or clearing price filters.
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
