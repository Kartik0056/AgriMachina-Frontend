import React, { useState, useEffect } from 'react';
import { Layers, AlertTriangle, RefreshCw, Plus, ArrowUpRight, ArrowDownRight, History } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { useSync } from '../../context/SyncContext';
import { formatINR } from '../../services/emiHelper';

const AdminInventoryPage = () => {
  const { broadcastLocal } = useSync();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Restock modal state
  const [restockProduct, setRestockProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');
  const [changeReason, setChangeReason] = useState('Stock replenishment batch');
  const [updating, setUpdating] = useState(false);

  const { addToast } = useToast();

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const prodRes = await adminApi.get('/products?limit=100');
      if (prodRes.data.success) {
        setProducts(prodRes.data.products || []);
      }
    } catch (err) {
      addToast('Failed to load inventory data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    if (!restockProduct || newQuantity === '') return;

    setUpdating(true);
    try {
      const res = await adminApi.put(`/products/${restockProduct._id}`, {
        stockQuantity: Number(newQuantity),
        stockChangeReason: changeReason
      });
      if (res.data.success) {
        addToast(`Stock for ${restockProduct.name} updated to ${newQuantity} units!`, 'success');
        broadcastLocal('INVENTORY_UPDATED', { productId: restockProduct._id, stockQuantity: Number(newQuantity) });
        setRestockProduct(null);
        fetchInventoryData();
      }
    } catch (err) {
      addToast('Failed to update stock', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--admin-text-main)', fontWeight: 800 }}>
            Machinery Inventory & Warehouse Management
          </h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            Real-time equipment stock telemetry, automated threshold alerts, and audit logging
          </p>
        </div>

        <button
          onClick={fetchInventoryData}
          className="btn btn-secondary btn-sm"
          style={{
            background: 'var(--admin-bg-card)',
            borderColor: 'var(--admin-border)',
            color: 'var(--admin-text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Inventory Stock Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="admin-table-container" style={{ border: 'none' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Machine Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Warehouse</th>
                <th>Available Units</th>
                <th>Threshold</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Restock Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)' }}>
                    Loading warehouse stock levels...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--admin-text-muted)' }}>
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="flex items-center" style={{ gap: '0.85rem' }}>
                        <img
                          src={p.mainImage?.url || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=100&q=80'}
                          alt=""
                          style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--admin-border)', flexShrink: 0 }}
                        />
                        <span style={{ fontWeight: 700, color: 'var(--admin-text-main)', lineHeight: 1.25, minWidth: 0 }}>{p.name}</span>
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
                      }}>
                        {p.sku}
                      </code>
                    </td>
                    <td>
                      <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>{p.category}</span>
                    </td>
                    <td style={{ color: 'var(--admin-text-main)', fontSize: '0.85rem' }}>
                      {p.warehouse || 'Central Agro Hub'}
                    </td>
                    <td>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: p.stockQuantity <= 0 ? '#ef4444' : p.stockQuantity <= (p.lowStockThreshold || 4) ? '#f59e0b' : 'var(--admin-accent, #34d399)' }}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>{p.lowStockThreshold || 4} units</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        p.stockStatus === 'OUT OF STOCK' ? 'badge-danger' :
                        p.stockStatus === 'LOW STOCK' ? 'badge-warning' : 'badge-success'
                      }`}>
                        {p.stockStatus}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setRestockProduct(p);
                          setNewQuantity(p.stockQuantity);
                          setChangeReason('Received shipment batch from OEM');
                        }}
                        className="btn btn-sm"
                        style={{
                          background: 'var(--admin-accent-glow, rgba(16,185,129,0.2))',
                          border: '1.5px solid var(--admin-accent, #10b981)',
                          color: 'var(--admin-accent, #10b981)',
                          padding: '0.4rem 0.85rem',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.18s ease',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Plus size={13} />
                        <span>Adjust Stock</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Adjustment Modal */}
      {restockProduct && (
        <div className="modal-overlay" onClick={() => setRestockProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', background: 'var(--admin-bg-card)', border: '1px solid var(--admin-border, #334155)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--admin-text-main)', marginBottom: '0.5rem', fontWeight: 800 }}>
              Adjust Stock: {restockProduct.name}
            </h3>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
              SKU: <strong style={{ color: 'var(--admin-text-main)' }}>{restockProduct.sku}</strong> • Current Count: <strong style={{ color: 'var(--admin-accent, #34d399)' }}>{restockProduct.stockQuantity} units</strong>
            </p>

            <form onSubmit={handleUpdateStock} className="flex flex-col gap-4">
              <div className="input-group">
                <label className="input-label" style={{ color: 'var(--admin-text-muted)' }}>New Physical Stock Count *</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="input-field"
                  style={{
                    backgroundColor: 'var(--admin-input-bg)',
                    borderColor: 'var(--admin-input-border)',
                    color: 'var(--admin-text-main)'
                  }}
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label" style={{ color: 'var(--admin-text-muted)' }}>Audit Reason Note *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  style={{
                    backgroundColor: 'var(--admin-input-bg)',
                    borderColor: 'var(--admin-input-border)',
                    color: 'var(--admin-text-main)'
                  }}
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  placeholder="e.g. Factory dispatch receipt / physical audit adjustment"
                />
              </div>

              <div className="flex justify-end gap-2" style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setRestockProduct(null)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    background: 'var(--admin-bg-card-alt)',
                    borderColor: 'var(--admin-border)',
                    color: 'var(--admin-text-main)'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn btn-primary btn-sm"
                >
                  {updating ? 'Saving...' : 'Update & Log Audit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventoryPage;
