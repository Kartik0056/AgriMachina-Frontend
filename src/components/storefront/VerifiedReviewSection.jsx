import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, PenSquare, Edit, Trash2, Camera, Video, Play } from 'lucide-react';
import StarRating from '../common/StarRating';
import WriteReviewModal from './WriteReviewModal';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// Helper to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return null;
};

const VerifiedReviewSection = ({ productId, productName, initialRatings = {} }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: initialRatings.averageRating || 0,
    totalReviews: initialRatings.totalReviews || 0,
    breakdown: initialRatings.ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/${productId}`);
      if (res.data.success) {
        const fetchedReviews = res.data.reviews || [];
        setReviews(fetchedReviews);
        setStats({
          averageRating: res.data.averageRating || 0,
          totalReviews: res.data.totalReviews || 0,
          breakdown: res.data.breakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        });

        // Find current user's review if logged in
        if (user && user._id) {
          const myRev = fetchedReviews.find(
            r => String(r.user) === String(user._id) || (r.userName && r.userName === user.name)
          );
          setUserReview(myRev || null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, user]);

  const handleOpenWriteModal = () => {
    if (!isAuthenticated) {
      addToast('Please login to your farmer account to write or edit a review.', 'warning');
      return;
    }
    setEditingReview(userReview || null);
    setIsWriteModalOpen(true);
  };

  const handleEditClick = (rev) => {
    setEditingReview(rev);
    setIsWriteModalOpen(true);
  };

  const handleDeleteClick = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review? You can write a new one anytime.')) {
      return;
    }

    try {
      const res = await api.delete(`/reviews/${reviewId}`);
      if (res.data.success) {
        addToast('Your review has been deleted.', 'success');
        setUserReview(null);
        fetchReviews();
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to delete review.', 'error');
    }
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', color: '#062416' }}>Verified Farmer Ratings & Field Reviews</h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Authentic customer reviews with field photos and live machinery operational videos.
          </p>
        </div>

        <button onClick={handleOpenWriteModal} className="btn btn-primary">
          {userReview ? <Edit size={16} /> : <PenSquare size={16} />}
          <span>{userReview ? 'Edit My Review' : 'Write a Review'}</span>
        </button>
      </div>

      {/* Ratings Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem'
      }}>
        {/* Big Rating Summary */}
        <div className="flex flex-col items-center justify-center text-center">
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#062416', lineHeight: 1 }}>
            {Number(stats.averageRating).toFixed(1)}
          </div>
          <div style={{ margin: '0.5rem 0' }}>
            <StarRating rating={stats.averageRating} size={22} />
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
            Based on {stats.totalReviews} verified farmer reviews
          </div>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="flex flex-col gap-2 justify-center flex-1 md:col-span-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.breakdown[star] || 0;
            const percent = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3" style={{ fontSize: '0.825rem' }}>
                <span style={{ width: '35px', fontWeight: 600, color: '#334155' }}>{star} ★</span>
                <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${percent}%`,
                    height: '100%',
                    background: star >= 4 ? '#166534' : star === 3 ? '#f59e0b' : '#ef4444',
                    borderRadius: '4px'
                  }} />
                </div>
                <span style={{ width: '45px', textAlign: 'right', color: '#64748b', fontWeight: 600 }}>{percent}%</span>
                <span style={{ width: '30px', color: '#94a3b8', fontSize: '0.75rem' }}>({count})</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading verified reviews...</div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', background: '#f8fafc', borderRadius: '12px' }}>
          <ShieldCheck size={36} color="#166534" style={{ margin: '0 auto 0.5rem auto' }} />
          <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>No Field Reviews Yet</div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
            Be the first farmer to share your field experience and video for {productName}!
          </p>
          <button onClick={handleOpenWriteModal} className="btn btn-primary btn-sm">
            <PenSquare size={15} />
            <span>Write the First Review</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((rev) => {
            const isMine = user && (String(rev.user) === String(user._id) || (rev.userName && rev.userName === user.name));
            const embedVid = getYouTubeEmbedUrl(rev.videoUrl);

            return (
              <div
                key={rev._id}
                style={{
                  background: isMine ? '#f0fdf4' : '#ffffff',
                  border: isMine ? '2px solid #86efac' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  position: 'relative'
                }}
              >
                <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div className="flex items-center gap-2.5">
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: isMine ? '#15803d' : '#166534',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.95rem'
                    }}>
                      {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'F'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                          {rev.userName}
                        </span>
                        {isMine && (
                          <span className="badge badge-success" style={{ fontSize: '0.65rem', background: '#166534', color: '#ffffff' }}>
                            Your Review
                          </span>
                        )}
                      </div>
                      {rev.farmContext?.farmType && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          🌾 {rev.farmContext.farmType} {rev.farmContext.acres ? `(${rev.farmContext.acres} Acres)` : ''}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {rev.verifiedPurchase && (
                      <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem' }}>
                        <ShieldCheck size={13} /> VERIFIED PURCHASE
                      </span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>

                    {/* Clean Icon-Only Action Buttons for Review Owner */}
                    {isMine && (
                      <div className="flex items-center gap-1.5" style={{ marginLeft: '0.25rem' }}>
                        <button
                          type="button"
                          onClick={() => handleEditClick(rev)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.4rem', borderRadius: '8px', background: '#ffffff', border: '1px solid #cbd5e1' }}
                          title="Edit your review"
                        >
                          <Edit size={14} color="#166534" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(rev._id)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.4rem', borderRadius: '8px' }}
                          title="Delete your review"
                        >
                          <Trash2 size={14} color="#ffffff" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <StarRating rating={rev.rating} size={15} />
                  {rev.title && (
                    <h4 style={{ fontSize: '1rem', color: '#0f172a', margin: '0.35rem 0 0.25rem 0', fontWeight: 800 }}>
                      {rev.title}
                    </h4>
                  )}
                  <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.55 }}>
                    {rev.comment}
                  </p>
                </div>

                {/* Attached Field Photos */}
                {rev.images && rev.images.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Camera size={13} color="#166534" />
                      <span>Field Photos:</span>
                    </div>
                    <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                      {rev.images.map((img, idx) => (
                        <a key={idx} href={img} target="_blank" rel="noreferrer">
                          <img
                            src={img}
                            alt="Field photo"
                            style={{ width: '85px', height: '85px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                            className="hover:scale-105 transition-transform"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attached Field Working Video */}
                {rev.videoUrl && (
                  <div style={{ marginTop: '0.25rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Video size={13} color="#166534" />
                      <span>Customer Field Demonstration Video:</span>
                    </div>
                    <div style={{ maxWidth: '420px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      {embedVid ? (
                        <iframe
                          src={embedVid}
                          title="Customer Field Video"
                          style={{ width: '100%', height: '220px', border: 'none' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : rev.videoUrl.endsWith('.mp4') || rev.videoUrl.includes('mp4') ? (
                        <video src={rev.videoUrl} controls style={{ width: '100%', height: '220px', objectFit: 'contain', background: '#000000' }} />
                      ) : (
                        <a
                          href={rev.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'inline-flex', margin: '0.5rem' }}
                        >
                          <Play size={13} />
                          <span>Watch Field Video on External Link</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Write / Edit Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => {
          setIsWriteModalOpen(false);
          setEditingReview(null);
        }}
        productId={productId}
        productName={productName}
        initialReview={editingReview}
        onReviewSubmitted={() => {
          fetchReviews();
        }}
      />
    </div>
  );
};

export default VerifiedReviewSection;
