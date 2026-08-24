import React, { useState, useEffect } from 'react';
import { Layers, AlertTriangle, RefreshCw, Plus, ArrowUpRight, ArrowDownRight, History } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../services/emiHelper';

const AdminInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [inventoryLogs, setInventoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stock'); // 'stock' or 'logs'

  // Restock modal state
  const [restockProduct, setRestockProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');
  const [changeReason, setChangeReason] = useState('Stock replenishment batch');
  const [updating, setUpdating] = useState(false);

  const { addToast } = useToast();

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const [prodRes, logRes] = await Promise.all([
        adminApi.get('/products?limit=100'),
        adminApi.get('/dashboard/stats') // We can also fetch dedicated audit logs
      ]);
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
          <h1 style={{ fontSize: '1.75rem', color: '#ffffff', fontWeight: 800 }}>
            Machinery Inventory & Warehouse Management
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Real-time equipment stock telemetry, automated threshold alerts, and audit logging
          </p>
        </div>

        <button onClick={fetchInventoryData} className="btn btn-secondary btn-sm" style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}>
          <RefreshCw size={14} />
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
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    Loading warehouse stock levels...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <img
                          src={p.mainImage?.url || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=100&q=80'}
                          alt=""
                          style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 700, color: '#ffffff' }}>{p.name}</span>
                      </div>
                    </td>
                    <td><code>{p.sku}</code></td>
                    <td><span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>{p.category}</span></td>
                    <td>{p.warehouse || 'Central Agro Hub'}</td>
                    <td>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: p.stockQuantity <= 0 ? '#ef4444' : p.stockQuantity <= (p.lowStockThreshold || 4) ? '#f59e0b' : '#34d399' }}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td><span style={{ color: '#94a3b8' }}>{p.lowStockThreshold || 4} units</span></td>
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
                        className="btn btn-secondary btn-sm"
                        style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}
                      >
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
          <div className="modal-content dark-theme" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              Adjust Stock: {restockProduct.name}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
              SKU: <strong>{restockProduct.sku}</strong> • Current Count: <strong>{restockProduct.stockQuantity} units</strong>
            </p>

            <form onSubmit={handleUpdateStock} className="flex flex-col gap-4">
              <div className="input-group">
                <label className="input-label" style={{ color: '#cbd5e1' }}>New Physical Stock Count *</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="input-field"
                  style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label" style={{ color: '#cbd5e1' }}>Audit Reason Note *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  style={{ background: '#0b1324', borderColor: '#1e2e4f', color: '#ffffff' }}
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
                  style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}
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
