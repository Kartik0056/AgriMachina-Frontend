import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Copy,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import adminApi from '../../services/adminApi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import { useSync } from '../../context/SyncContext';
import { formatINR } from '../../services/emiHelper';

const AdminProductsPage = () => {
  const { broadcastLocal } = useSync();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [categories, setCategories] = useState([]);

  // Selected products for bulk operations
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkValue, setBulkValue] = useState('');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const { adminPanelPath, hasPermission } = useAdminAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/products', {
        params: {
          page,
          limit: 15,
          search,
          category,
          status,
          stockStatus
        }
      });
      if (res.data.success) {
        setProducts(res.data.products || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      addToast('Failed to load machinery catalog', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await adminApi.get('/categories');
        if (res.data.success) setCategories(res.data.categories || []);
      } catch (e) {}
    };
    fetchCats();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, category, status, stockStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDuplicate = async (productId) => {
    try {
      const res = await adminApi.post(`/products/${productId}/duplicate`);
      if (res.data.success) {
        addToast('Product duplicated as Draft with unique SKU!', 'success');
        broadcastLocal('CATALOG_CHANGED', { action: 'create', productId });
        fetchProducts();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Duplication failed', 'error');
    }
  };

  const handleTogglePublish = async (productId) => {
    try {
      const res = await adminApi.post(`/products/${productId}/publish`);
      if (res.data.success) {
        addToast(`Product status updated to ${res.data.product.status}`, 'success');
        broadcastLocal('CATALOG_CHANGED', { action: 'update', productId });
        fetchProducts();
      }
    } catch (err) {
      addToast('Failed to toggle status', 'error');
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${productName}?`)) return;

    try {
      const res = await adminApi.delete(`/products/${productId}`);
      if (res.data.success) {
        addToast(res.data.message, 'success');
        broadcastLocal('CATALOG_CHANGED', { action: 'delete', productId });
        fetchProducts();
      }
    } catch (err) {
      addToast('Failed to delete product', 'error');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map(p => p._id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const executeBulkUpdate = async () => {
    if (selectedIds.length === 0 || !bulkAction) return;

    let updateFields = {};
    if (bulkAction === 'status') updateFields = { status: bulkValue };
    if (bulkAction === 'stock') updateFields = { stockQuantity: Number(bulkValue) };
    if (bulkAction === 'category') updateFields = { category: bulkValue };

    try {
      const res = await adminApi.post('/bulk/bulk-update', {
        productIds: selectedIds,
        updateFields,
        stockChangeReason: `Bulk ${bulkAction} update by admin`
      });
      if (res.data.success) {
        addToast(res.data.message, 'success');
        setSelectedIds([]);
        setIsBulkModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Bulk update failed', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--admin-text-main)', fontWeight: 800 }}>
            Agricultural Machinery Listings
          </h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Manage commercial equipment specifications, pricing, inventory, and publication workflows
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`${adminPanelPath}/products/bulk-import`}
            className="btn btn-secondary btn-sm"
            style={{ background: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-main)' }}
          >
            <FileSpreadsheet size={15} />
            <span>Bulk Import (XLSX/CSV)</span>
          </Link>

          <Link
            to={`${adminPanelPath}/products/new`}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            <span>Add New Machinery</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card" style={{ padding: '1rem' }}>
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search Name, SKU, Model..."
              className="input-field"
              style={{ backgroundColor: 'var(--admin-input-bg)', borderColor: 'var(--admin-input-border)', color: 'var(--admin-text-main)', paddingLeft: '2.2rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={15} color="var(--admin-text-muted, #94a3b8)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <select
            className="select-field"
            style={{ backgroundColor: 'var(--admin-input-bg)', borderColor: 'var(--admin-input-border)', color: 'var(--admin-text-main)' }}
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>

          <select
            className="select-field"
            style={{ backgroundColor: 'var(--admin-input-bg)', borderColor: 'var(--admin-input-border)', color: 'var(--admin-text-main)' }}
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Discontinued">Discontinued</option>
          </select>

          <select
            className="select-field"
            style={{ backgroundColor: 'var(--admin-input-bg)', borderColor: 'var(--admin-input-border)', color: 'var(--admin-text-main)' }}
            value={stockStatus}
            onChange={(e) => { setStockStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Stock Levels</option>
            <option value="IN STOCK">IN STOCK</option>
            <option value="LOW STOCK">LOW STOCK</option>
            <option value="OUT OF STOCK">OUT OF STOCK</option>
          </select>

          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary btn-sm flex-1">Filter</button>
            <button
              type="button"
              onClick={() => { setSearch(''); setCategory(''); setStatus(''); setStockStatus(''); setPage(1); }}
              className="btn btn-secondary btn-sm"
              style={{ background: 'var(--admin-bg-card-alt)', borderColor: 'var(--admin-border)', color: '#cbd5e1' }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Bulk Action Strip if items selected */}
      {selectedIds.length > 0 && (
        <div style={{ background: '#166534', color: '#ffffff', padding: '0.75rem 1.25rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
            {selectedIds.length} Products Selected
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setBulkAction('status'); setBulkValue('Published'); setIsBulkModalOpen(true); }}
              className="btn btn-sm"
              style={{ background: '#ffffff', color: '#062416' }}
            >
              Bulk Publish / Update Status
            </button>
            <button
              onClick={() => { setBulkAction('stock'); setBulkValue('20'); setIsBulkModalOpen(true); }}
              className="btn btn-sm"
              style={{ background: '#ffffff', color: '#062416' }}
            >
              Bulk Stock Quantity
            </button>
          </div>
        </div>
      )}

      {/* Products Data Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-container" style={{ border: 'none' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === products.length && products.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Image</th>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>MRP</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Rating</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    Loading machinery records from MongoDB...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No machinery matches your filter criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p._id)}
                        onChange={() => toggleSelectOne(p._id)}
                      />
                    </td>
                    <td>
                      <img
                        src={p.mainImage?.url || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=100&q=80'}
                        alt=""
                        style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--admin-border)', flexShrink: 0 }}
                      />
                    </td>
                    <td style={{ paddingLeft: '0.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--admin-text-main)', maxWidth: '220px', lineHeight: 1.2 }}>
                        {p.name?.replace(/&amp;/g, '&')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                        {p.brand?.replace(/&amp;/g, '&')} {p.modelNumber ? `(${p.modelNumber})` : ''}
                      </div>
                    </td>
                    <td>
                      <code style={{
                        fontSize: '0.75rem',
                        color: 'var(--admin-text-main)',
                        backgroundColor: 'var(--admin-input-bg)',
                        padding: '0.25rem 0.55rem',
                        borderRadius: '5px',
                        border: '1px solid var(--admin-border)',
                        whiteSpace: 'nowrap',
                        display: 'inline-block',
                        letterSpacing: '0.03em',
                        fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace"
                      }}>{p.sku}</code>
                    </td>
                    <td><span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>{p.category?.replace(/&amp;/g, '&')}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--admin-accent, #34d399)' }}>{formatINR(p.sellingPrice)}</td>
                    <td style={{ color: 'var(--admin-text-muted)' }}>{formatINR(p.mrp)}</td>
                    <td>
                      <span className={`badge ${
                        p.stockStatus === 'OUT OF STOCK' ? 'badge-danger' :
                        p.stockStatus === 'LOW STOCK' ? 'badge-warning' : 'badge-success'
                      }`}>
                        {p.stockQuantity} ({p.stockStatus})
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        p.status === 'Published' ? 'badge-success' :
                        p.status === 'Draft' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#f59e0b' }}>
                        {p.ratings?.averageRating > 0 ? `${p.ratings.averageRating} ★` : '—'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Preview */}
                        <a
                          href={`/product/${p.slug || p._id}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Preview Product PDP"
                          style={{ color: '#94a3b8', padding: '4px' }}
                        >
                          <Eye size={15} />
                        </a>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicate(p._id)}
                          title="Duplicate Product & Generate SKU"
                          style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '4px' }}
                        >
                          <Copy size={15} />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => navigate(`${adminPanelPath}/products/edit/${p._id}`)}
                          title="Edit 15-Tab Specifications"
                          style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer', padding: '4px' }}
                        >
                          <Edit size={15} />
                        </button>

                        {/* Publish/Unpublish toggle */}
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(p._id)}
                          title={p.status === 'Published' ? 'Unpublish to Draft' : 'Publish Live'}
                          style={{ background: 'none', border: 'none', color: p.status === 'Published' ? '#f59e0b' : '#10b981', cursor: 'pointer', padding: '4px' }}
                        >
                          {p.status === 'Published' ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDelete(p._id, p.name)}
                          title="Delete Product"
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--bg-dark-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Page {page} of {totalPages} ({total} Total Products)
          </span>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="btn btn-secondary btn-sm"
              style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            >
              <ChevronLeft size={15} />
              <span>Previous</span>
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="btn btn-secondary btn-sm"
              style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            >
              <span>Next</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Update Modal */}
      {isBulkModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBulkModalOpen(false)}>
          <div className="modal-content dark-theme" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#ffffff' }}>
              Bulk Update {selectedIds.length} Products
            </h3>

            <div className="flex flex-col gap-4">
              <div className="input-group">
                <label className="input-label" style={{ color: '#cbd5e1' }}>Select Property to Update</label>
                <select
                  className="select-field"
                  style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                >
                  <option value="status">Status</option>
                  <option value="stock">Stock Quantity</option>
                  <option value="category">Category</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label" style={{ color: '#cbd5e1' }}>New Value</label>
                {bulkAction === 'status' ? (
                  <select
                    className="select-field"
                    style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
                    value={bulkValue}
                    onChange={(e) => setBulkValue(e.target.value)}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Discontinued">Discontinued</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    className="input-field"
                    style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
                    value={bulkValue}
                    onChange={(e) => setBulkValue(e.target.value)}
                  />
                )}
              </div>

              <div className="flex justify-end gap-2" style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                  style={{ background: 'var(--admin-bg-card-alt)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeBulkUpdate}
                  className="btn btn-primary btn-sm"
                >
                  Apply to {selectedIds.length} Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
