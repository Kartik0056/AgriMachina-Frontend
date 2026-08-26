import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Edit2, CheckCircle2, XCircle, Percent, DollarSign, Calendar, RefreshCw, Copy, Loader2, Sparkles } from 'lucide-react';
import { formatINR } from '../../services/emiHelper';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';
import adminApi from '../../services/adminApi';

const AdminCouponsPage = () => {
  const { addToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'FLAT',
    discountValue: '',
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    maxUsageLimit: 1000,
    validUntil: '2026-12-31',
    isActive: true
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/coupons');
      if (res.data.success) {
        setCoupons(res.data.coupons || []);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load coupons from database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setForm({
      code: '',
      description: '',
      discountType: 'FLAT',
      discountValue: '',
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      maxUsageLimit: 1000,
      validUntil: '2026-12-31',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cpn) => {
    setEditingCoupon(cpn);
    setForm({
      code: cpn.code || '',
      description: cpn.description || '',
      discountType: cpn.discountType || 'FLAT',
      discountValue: cpn.discountValue || '',
      minOrderAmount: cpn.minOrderAmount || 0,
      maxDiscountAmount: cpn.maxDiscountAmount || 0,
      maxUsageLimit: cpn.maxUsageLimit || cpn.usageLimit || 1000,
      validUntil: cpn.validUntil ? new Date(cpn.validUntil).toISOString().slice(0, 10) : '2026-12-31',
      isActive: cpn.isActive !== undefined ? cpn.isActive : true
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discountValue) {
      addToast('Coupon code and discount value are required.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        description: form.description,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        maxDiscountAmount: Number(form.maxDiscountAmount) || 0,
        maxUsageLimit: Number(form.maxUsageLimit) || 1000,
        validUntil: form.validUntil,
        isActive: Boolean(form.isActive)
      };

      if (editingCoupon) {
        const res = await adminApi.put(`/coupons/${editingCoupon._id}`, payload);
        if (res.data.success) {
          addToast(`Coupon ${payload.code} updated in MongoDB database!`, 'success');
          fetchCoupons();
          setIsModalOpen(false);
        }
      } else {
        const res = await adminApi.post('/coupons', payload);
        if (res.data.success) {
          addToast(`New Coupon ${payload.code} saved to MongoDB database! 🌾`, 'success');
          fetchCoupons();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save coupon.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Are you sure you want to permanently delete coupon code "${code}" from the database?`)) return;
    try {
      const res = await adminApi.delete(`/coupons/${id}`);
      if (res.data.success) {
        addToast(`Coupon ${code} deleted permanently.`, 'info');
        setCoupons(prev => prev.filter(c => c._id !== id));
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete coupon.', 'error');
    }
  };

  const toggleStatus = async (id, currentStatus, code) => {
    try {
      const res = await adminApi.patch(`/coupons/${id}/toggle`);
      if (res.data.success) {
        const updated = res.data.coupon;
        setCoupons(prev => prev.map(c => c._id === id ? { ...c, isActive: updated.isActive } : c));
        addToast(`Coupon ${code} is now ${updated.isActive ? 'ACTIVE' : 'INACTIVE'}.`, 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status.', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={24} color="#34d399" />
            <span>Coupons & Farmer Promotional Codes</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Manage machinery discounts, subsidy vouchers, and seasonal promotional coupon campaigns (MongoDB Synced).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchCoupons} className="btn btn-secondary btn-sm" title="Refresh from Database">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button onClick={handleOpenAdd} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Create New Coupon</span>
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
            <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 1rem auto', color: '#34d399' }} />
            <p>Loading real-time coupons from database...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
            <Tag size={42} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <h3 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>No Coupons Found in Database</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Create your first seasonal farmer discount coupon code.</p>
            <button onClick={handleOpenAdd} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Create First Coupon</span>
            </button>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Description</th>
                <th>Discount</th>
                <th>Min Order</th>
                <th>Redemptions</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '0.95rem', color: '#86efac', background: 'var(--admin-bg-sidebar)', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #1e2e4f' }}>
                      {c.code}
                    </span>
                  </td>
                  <td style={{ maxWidth: '240px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                    {c.description || 'Agricultural machinery promotional discount'}
                  </td>
                  <td style={{ fontWeight: 800, color: '#fef08a' }}>
                    {c.discountType === 'PERCENT' || c.discountType === 'percentage'
                      ? `${c.discountValue}% OFF${c.maxDiscountAmount > 0 ? ` (Up to ${formatINR(c.maxDiscountAmount)})` : ''}`
                      : `${formatINR(c.discountValue)} OFF`}
                  </td>
                  <td>{c.minOrderAmount > 0 ? formatINR(c.minOrderAmount) : 'No Min.'}</td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>
                      <strong>{c.usedCount || 0}</strong> / {c.maxUsageLimit || c.usageLimit || 1000} used
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {c.validUntil ? new Date(c.validUntil).toLocaleDateString('en-IN') : 'Ongoing'}
                  </td>
                  <td>
                    <button
                      onClick={() => toggleStatus(c._id, c.isActive, c.code)}
                      className={`badge ${c.isActive ? 'badge-success' : 'badge-danger'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Click to toggle active/inactive status"
                    >
                      {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.6rem', background: 'var(--admin-bg-card-alt)', borderColor: 'var(--admin-border)' }}
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(c._id, c.code)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.3rem 0.6rem' }}
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal: Add / Edit Coupon */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCoupon ? `Edit Coupon Code: ${editingCoupon.code}` : 'Create New Promotional Coupon (Database Stored)'}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="input-group">
              <label className="input-label">Coupon Code *</label>
              <input
                type="text"
                required
                className="input-field"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. KISAN1000"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Discount Type *</label>
              <select
                className="select-field"
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value })}
              >
                <option value="FLAT">Flat Amount (₹)</option>
                <option value="PERCENT">Percentage Discount (%)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Discount Value *</label>
              <input
                type="number"
                required
                min="1"
                className="input-field"
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                placeholder={form.discountType === 'PERCENT' ? 'e.g. 10 (%)' : 'e.g. 1000 (₹)'}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Minimum Order Amount (₹)</label>
              <input
                type="number"
                min="0"
                className="input-field"
                value={form.minOrderAmount}
                onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                placeholder="e.g. 25000"
              />
            </div>

            {form.discountType === 'PERCENT' && (
              <div className="input-group sm:col-span-2">
                <label className="input-label">Max Discount Cap Amount (₹) (0 for no cap)</label>
                <input
                  type="number"
                  min="0"
                  className="input-field"
                  value={form.maxDiscountAmount}
                  onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                  placeholder="e.g. 5000"
                />
              </div>
            )}

            <div className="input-group sm:col-span-2">
              <label className="input-label">Coupon Description</label>
              <input
                type="text"
                className="input-field"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. Flat ₹1,000 OFF on Heavy Duty Power Weeders & Tillers"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Total Max Usage Limit</label>
              <input
                type="number"
                min="1"
                className="input-field"
                value={form.maxUsageLimit}
                onChange={(e) => setForm({ ...form, maxUsageLimit: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Expiry Date</label>
              <input
                type="date"
                className="input-field"
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
              />
            </div>
          </div>

          <label className="flex items-center gap-2" style={{ cursor: 'pointer', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            <span style={{ fontWeight: 600, color: '#0f172a' }}>Active Coupon (Available for farmer checkout)</span>
          </label>

          <div className="flex justify-end gap-2" style={{ marginTop: '1rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
              {submitting ? 'Saving to Database...' : editingCoupon ? 'Update Coupon' : 'Save Coupon to Database'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCouponsPage;
