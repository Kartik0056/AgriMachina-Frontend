import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Check, X, Trash2, RefreshCw, Eye, EyeOff, MessageSquare } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import StarRating from '../../components/common/StarRating';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const { addToast } = useToast();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/reviews', {
        params: { status: statusFilter }
      });
      if (res.data.success) {
        setReviews(res.data.reviews || []);
      }
    } catch (err) {
      addToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const handleModerate = async (reviewId, newStatus) => {
    try {
      const res = await adminApi.put(`/reviews/${reviewId}/moderate`, {
        status: newStatus
      });
      if (res.data.success) {
        addToast(`Review marked as ${newStatus}. Product ratings updated!`, 'success');
        fetchReviews();
      }
    } catch (err) {
      addToast('Failed to moderate review', 'error');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to permanently remove this review?')) return;
    try {
      const res = await adminApi.delete(`/reviews/${reviewId}`);
      if (res.data.success) {
        addToast('Review deleted and ratings recalculated.', 'success');
        fetchReviews();
      }
    } catch (err) {
      addToast('Failed to delete review', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: '#ffffff', fontWeight: 800 }}>
            Customer Reviews Moderation Center
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Moderate verified buyer feedback, ratings, and farmer field testimonials
          </p>
        </div>

        <button onClick={fetchReviews} className="btn btn-secondary btn-sm" style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}>
          <RefreshCw size={14} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="admin-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Moderation Queue:</span>
        {['Pending', 'Approved', 'Rejected', 'Hidden', ''].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              background: statusFilter === st ? '#166534' : '#0b1324',
              borderColor: statusFilter === st ? '#22c55e' : '#1e2e4f',
              color: '#ffffff'
            }}
          >
            {st === '' ? 'All Reviews' : st}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            Loading moderation queue...
          </div>
        ) : reviews.length === 0 ? (
          <div className="admin-card" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <MessageSquare size={36} color="#64748b" style={{ margin: '0 auto 0.75rem auto' }} />
            <div>No reviews found under "{statusFilter || 'All'}" status.</div>
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev._id}
              className="admin-card"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
            >
              <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                <div className="flex items-center gap-3">
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#166534',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}>
                    {rev.userName?.charAt(0) || 'F'}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                      {rev.userName} <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.8rem' }}>({rev.userEmail})</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                      Product: <strong style={{ color: '#38bdf8' }}>{rev.product?.name || rev.productName || 'Machinery Item'}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {rev.verifiedPurchase && (
                    <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem' }}>
                      <ShieldCheck size={13} /> VERIFIED PURCHASE
                    </span>
                  )}
                  <span className={`badge ${
                    rev.status === 'Approved' ? 'badge-success' :
                    rev.status === 'Pending' ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {rev.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Review Content */}
              <div>
                <div className="flex items-center gap-2">
                  <StarRating rating={rev.rating} size={15} />
                  {rev.title && (
                    <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{rev.title}</strong>
                  )}
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5, marginTop: '0.35rem' }}>
                  "{rev.comment}"
                </p>
                {rev.farmContext?.farmType && (
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                    🌾 Farm Details: {rev.farmContext.farmType} • Crops: {rev.farmContext.cropGrown || 'All'} • Size: {rev.farmContext.acres || 0} Acres
                  </div>
                )}
              </div>

              {/* Actions Strip */}
              <div className="flex justify-end gap-2" style={{ borderTop: '1px solid #1e2e4f', paddingTop: '0.75rem' }}>
                {rev.status !== 'Approved' && (
                  <button
                    type="button"
                    onClick={() => handleModerate(rev._id, 'Approved')}
                    className="btn btn-sm"
                    style={{ background: '#166534', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Check size={14} />
                    <span>Approve & Publish</span>
                  </button>
                )}

                {rev.status !== 'Rejected' && (
                  <button
                    type="button"
                    onClick={() => handleModerate(rev._id, 'Rejected')}
                    className="btn btn-secondary btn-sm"
                    style={{ background: '#1e293b', borderColor: '#334155', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <X size={14} />
                    <span>Reject</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(rev._id)}
                  className="btn btn-secondary btn-sm"
                  style={{ background: '#1e293b', borderColor: '#334155', color: '#ef4444' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReviewsPage;
