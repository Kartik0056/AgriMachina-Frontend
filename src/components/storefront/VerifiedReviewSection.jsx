import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  PenSquare, 
  Edit, 
  Trash2, 
  Camera, 
  Video, 
  Play, 
  X, 
  Lock, 
  ShoppingBag, 
  Truck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import StarRating from '../common/StarRating';
import WriteReviewModal from './WriteReviewModal';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getYouTubeEmbedUrl } from '../../services/videoHelper';

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
  const [previewImage, setPreviewImage] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [eligibility, setEligibility] = useState({
    loading: true,
    eligible: false,
    reason: null, // 'DELIVERED', 'ORDER_NOT_DELIVERED', 'NOT_PURCHASED', or 'NOT_LOGGED_IN'
    message: '',
    orderNumber: null,
    currentOrderStatus: null
  });

  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

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
        } else {
          setUserReview(null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async () => {
    if (!isAuthenticated) {
      setEligibility({
        loading: false,
        eligible: false,
        reason: 'NOT_LOGGED_IN',
        message: 'Review dene ke liye login hona zaroori hai. Sirf verified buyers jinka order deliver ho chuka hai, wahi review de sakte hain.',
        orderNumber: null,
        currentOrderStatus: null
      });
      return;
    }

    try {
      setEligibility(prev => ({ ...prev, loading: true }));
      const res = await api.get(`/reviews/${productId}/review-eligibility`);
      if (res.data.success) {
        setEligibility({
          loading: false,
          eligible: !!res.data.eligible,
          reason: res.data.reason,
          message: res.data.message || '',
          orderNumber: res.data.orderNumber || null,
          currentOrderStatus: res.data.currentOrderStatus || null
        });

        if (res.data.existingReview) {
          setUserReview(res.data.existingReview);
        }
      }
    } catch (err) {
      setEligibility({
        loading: false,
        eligible: false,
        reason: 'NOT_LOGGED_IN',
        message: err.response?.data?.message || 'Please log in to verify your review eligibility.',
        orderNumber: null,
        currentOrderStatus: null
      });
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
      checkEligibility();
    }
  }, [productId, user, isAuthenticated]);

  const handleOpenWriteModal = () => {
    if (!isAuthenticated) {
      addToast('Review dene ke liye login hona zaroori hai.', 'warning');
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!eligibility.eligible) {
      if (eligibility.reason === 'NOT_PURCHASED') {
        addToast('Review dene ke liye pehle is product ko buy karna zaroori hai.', 'warning');
      } else if (eligibility.reason === 'ORDER_NOT_DELIVERED') {
        addToast(`Aapka order deliver hone ke baad hi review de sakte hain. Current status: ${eligibility.currentOrderStatus}`, 'warning');
      } else {
        addToast(eligibility.message || 'You are not eligible to review this product yet.', 'warning');
      }
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
    if (!window.confirm('Are you sure you want to delete your review? You can write a new one anytime once your delivered order is verified.')) {
      return;
    }

    try {
      const res = await api.delete(`/reviews/${reviewId}`);
      if (res.data.success) {
        addToast('Your review has been deleted.', 'success');
        setUserReview(null);
        fetchReviews();
        checkEligibility();
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to delete review.', 'error');
    }
  };

  return (
    <div className="skeuo-card" style={{ padding: '2.5rem 2.25rem', marginBottom: '3.5rem' }}>
      {/* 1. Header with Title & Action */}
      <div 
        className="flex justify-between items-center" 
        style={{ 
          marginBottom: '2rem', 
          flexWrap: 'wrap', 
          gap: '1.25rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1.5rem'
        }}
      >
        <div>
          <div className="flex items-center gap-2.5" style={{ marginBottom: '0.4rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: 0 }}>
              Verified Customer Ratings & Reviews
            </h3>
            <span className="skeuo-badge skeuo-badge-verified">
              <ShieldCheck size={14} /> 100% Genuine Buyers
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            Authentic customer reviews with photos, videos, and verified delivery status.
          </p>
        </div>

        {/* Dynamic CTA Button based on Login, Purchase, and Delivery status */}
        {!isAuthenticated ? (
          <button 
            onClick={() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)} 
            className="skeuo-btn skeuo-btn-primary"
            style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem' }}
          >
            <Lock size={15} />
            <span>Login to Review</span>
          </button>
        ) : eligibility.eligible ? (
          <button 
            onClick={handleOpenWriteModal} 
            className="skeuo-btn skeuo-btn-primary"
            style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem' }}
          >
            {userReview ? <Edit size={15} /> : <PenSquare size={15} />}
            <span>{userReview ? 'Edit My Review' : 'Write a Review'}</span>
          </button>
        ) : (
          <button 
            onClick={handleOpenWriteModal} 
            className="skeuo-btn"
            style={{ 
              padding: '0.65rem 1.4rem', 
              fontSize: '0.85rem',
              background: 'var(--bg-surface-alt)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              cursor: 'not-allowed',
              opacity: 0.85
            }}
            title={eligibility.message}
          >
            <Lock size={14} />
            <span>
              {eligibility.reason === 'ORDER_NOT_DELIVERED' 
                ? 'Delivery Pending' 
                : 'Purchase Required'}
            </span>
          </button>
        )}
      </div>

      {/* 2. Skeuomorphic Verification Policy & Order Status Callout Banner */}
      {!isAuthenticated ? (
        <div 
          className="skeuo-card" 
          style={{ 
            padding: '1.4rem 1.75rem', 
            marginBottom: '2.25rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: '1.25rem',
            borderLeft: '5px solid #f59e0b'
          }}
        >
          <div className="flex items-center gap-4" style={{ flex: 1, minWidth: '260px' }}>
            <div 
              className="skeuo-icon-medallion" 
              style={{ 
                width: '52px', 
                height: '52px', 
                background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', 
                border: '1px solid #fde68a', 
                color: '#b45309',
                '--skeuo-glow': 'rgba(245, 158, 11, 0.25)'
              }}
            >
              <Lock size={24} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                Login Required to Write a Review
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                Review dene ke liye login hona zaroori hai. Sirf verified buyers jinka order <strong>Delivered</strong> ho chuka hai, wahi genuine reviews de sakte hain.
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)} 
            className="skeuo-btn skeuo-btn-primary" 
            style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            <span>Login to Review</span>
          </button>
        </div>
      ) : eligibility.reason === 'NOT_PURCHASED' ? (
        <div 
          className="skeuo-card" 
          style={{ 
            padding: '1.4rem 1.75rem', 
            marginBottom: '2.25rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.25rem',
            borderLeft: '5px solid #0284c7'
          }}
        >
          <div 
            className="skeuo-icon-medallion" 
            style={{ 
              width: '52px', 
              height: '52px', 
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
              border: '1px solid #bae6fd', 
              color: '#0284c7',
              '--skeuo-glow': 'rgba(14, 165, 233, 0.25)'
            }}
          >
            <ShoppingBag size={24} strokeWidth={2.2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              Verified Purchase Required (Buy to Review)
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              Product review dene ke liye is product ko buy karna zaroori hai. Order complete aur doorstep delivery hone ke baad aapka review unlock hoga.
            </div>
          </div>
        </div>
      ) : eligibility.reason === 'ORDER_NOT_DELIVERED' ? (
        <div 
          className="skeuo-card" 
          style={{ 
            padding: '1.4rem 1.75rem', 
            marginBottom: '2.25rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.25rem',
            borderLeft: '5px solid #d97706'
          }}
        >
          <div 
            className="skeuo-icon-medallion" 
            style={{ 
              width: '52px', 
              height: '52px', 
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', 
              border: '1px solid #fde68a', 
              color: '#d97706',
              '--skeuo-glow': 'rgba(217, 119, 6, 0.25)'
            }}
          >
            <Truck size={24} strokeWidth={2.2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span>Order In-Transit: Review Unlocks Upon Delivery</span>
              <span className="skeuo-badge" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                Order #{eligibility.orderNumber} • Status: {eligibility.currentOrderStatus}
              </span>
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              Aapka order abhi deliver nahi hua hai. Product doorstep deliver hone ke baad hi aap review de sakte hain taaki genuine usage feedback ho sake.
            </div>
          </div>
        </div>
      ) : eligibility.eligible ? (
        <div 
          className="skeuo-card" 
          style={{ 
            padding: '1.4rem 1.75rem', 
            marginBottom: '2.25rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: '1.25rem',
            borderLeft: '5px solid #16a34a'
          }}
        >
          <div className="flex items-center gap-4" style={{ flex: 1, minWidth: '260px' }}>
            <div 
              className="skeuo-icon-medallion" 
              style={{ 
                width: '52px', 
                height: '52px', 
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', 
                border: '1px solid #a7f3d0', 
                color: '#047857',
                '--skeuo-glow': 'rgba(16, 185, 129, 0.3)'
              }}
            >
              <CheckCircle2 size={26} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span>Verified Buyer Confirmed</span>
                <span className="skeuo-badge skeuo-badge-verified">
                  Order #{eligibility.orderNumber} Delivered
                </span>
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                {userReview 
                  ? 'Aapne is delivered purchase ka review share kiya hua hai. Aap ise anytime update kar sakte hain.' 
                  : 'Aapko is product ki delivery ho chuki hai! Please apna authentic experience and ratings share karein.'}
              </div>
            </div>
          </div>
          <button 
            onClick={handleOpenWriteModal} 
            className="skeuo-btn skeuo-btn-primary" 
            style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            {userReview ? <Edit size={15} /> : <PenSquare size={15} />}
            <span>{userReview ? 'Edit My Review' : 'Write a Review'}</span>
          </button>
        </div>
      ) : null}

      {/* 3. Rating Stats & Breakdown (Skeuomorphic Well) */}
      <div 
        className="skeuo-well grid grid-cols-1 md:grid-cols-3 gap-8" 
        style={{
          padding: '1.75rem 2rem',
          marginBottom: '2.5rem'
        }}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div style={{ fontSize: '2.75rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1, letterSpacing: '-0.02em' }}>
            {Number(stats.averageRating).toFixed(1)}
          </div>
          <div style={{ margin: '0.65rem 0' }}>
            <StarRating rating={stats.averageRating} size={24} />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Based on {stats.totalReviews} verified delivered buyer reviews
          </div>
        </div>

        <div className="flex flex-col gap-2.5 justify-center flex-1 md:col-span-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.breakdown[star] || 0;
            const percent = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3.5" style={{ fontSize: '0.825rem' }}>
                <span style={{ width: '40px', fontWeight: 700, color: 'var(--text-main)' }}>{star} ★</span>
                <div style={{ flex: 1, height: '10px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)' }}>
                  <div style={{
                    width: `${percent}%`,
                    height: '100%',
                    background: star >= 4 ? 'linear-gradient(90deg, #166534, #22c55e)' : star === 3 ? 'linear-gradient(90deg, #d97706, #f59e0b)' : 'linear-gradient(90deg, #b91c1c, #ef4444)',
                    borderRadius: '999px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
                <span style={{ width: '45px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 700 }}>{percent}%</span>
                <span style={{ width: '35px', color: 'var(--text-light)', fontSize: '0.78rem' }}>({count})</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Reviews List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 1rem auto' }} />
          Loading verified buyer reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div 
          className="skeuo-well" 
          style={{ 
            textAlign: 'center', 
            padding: '3rem 2rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '0.75rem' 
          }}
        >
          <div 
            className="skeuo-icon-medallion" 
            style={{ 
              width: '56px', 
              height: '56px', 
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', 
              border: '1px solid #a7f3d0', 
              color: '#047857' 
            }}
          >
            <ShieldCheck size={30} strokeWidth={2.2} />
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
            No Customer Reviews Yet
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '440px', lineHeight: 1.5, margin: 0 }}>
            {eligibility.eligible 
              ? `Aap is product ke verified buyer hain! Pehla verified review likh kar doosre customers ki help karein.` 
              : `Order deliver hone ke baad verified buyers apne genuine feedback yahan share karte hain.`}
          </p>
          {eligibility.eligible && (
            <button onClick={handleOpenWriteModal} className="skeuo-btn skeuo-btn-primary" style={{ marginTop: '0.5rem', padding: '0.65rem 1.4rem' }}>
              <PenSquare size={15} />
              <span>Write the First Review</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((rev) => {
            const isMine = user && (String(rev.user) === String(user._id) || (rev.userName && rev.userName === user.name));
            const embedVid = getYouTubeEmbedUrl(rev.videoUrl);

            return (
              <div
                key={rev._id}
                className="skeuo-card"
                style={{
                  padding: '1.75rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.15rem',
                  border: isMine ? '2px solid var(--primary-500, #16a34a)' : undefined
                }}
              >
                {/* User Header */}
                <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div className="flex items-center gap-3.5">
                    <div 
                      className="skeuo-icon-medallion"
                      style={{
                        width: '44px',
                        height: '44px',
                        background: isMine 
                          ? 'linear-gradient(135deg, #15803d 0%, #166534 100%)' 
                          : 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '1.05rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.975rem' }}>
                          {rev.userName}
                        </span>
                        {isMine && (
                          <span className="skeuo-badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '0.68rem', padding: '0.2rem 0.6rem' }}>
                            Your Review
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Customer Review • {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {rev.verifiedPurchase && (
                      <span className="skeuo-badge skeuo-badge-verified">
                        <ShieldCheck size={13} strokeWidth={2.5} /> VERIFIED BUYER
                      </span>
                    )}

                    {/* Action buttons for review author */}
                    {isMine && (
                      <div className="flex items-center gap-2" style={{ marginLeft: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => handleEditClick(rev)}
                          className="skeuo-btn"
                          style={{
                            padding: '0.45rem 0.65rem',
                            fontSize: '0.78rem',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--primary-600, #166534)'
                          }}
                          title="Edit your review"
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(rev._id)}
                          className="skeuo-btn"
                          style={{
                            padding: '0.45rem 0.65rem',
                            fontSize: '0.78rem',
                            background: '#fee2e2',
                            border: '1px solid #fca5a5',
                            color: '#b91c1c'
                          }}
                          title="Delete your review"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rating & Content */}
                <div>
                  <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                    <StarRating rating={rev.rating} size={16} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {rev.rating} out of 5 stars
                    </span>
                  </div>

                  {rev.title && (
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', margin: '0.25rem 0 0.5rem 0', fontWeight: 800 }}>
                      {rev.title}
                    </h4>
                  )}
                  <p style={{ fontSize: '0.925rem', color: 'var(--text-main)', lineHeight: 1.6, margin: 0 }}>
                    {rev.comment}
                  </p>
                </div>

                {/* Attached Customer Photos */}
                {rev.images && rev.images.length > 0 && (
                  <div style={{ marginTop: '0.25rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-600, #166534)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Camera size={14} />
                      <span>Customer Verified Photos:</span>
                    </div>
                    <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
                      {rev.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPreviewImage(img)}
                          className="skeuo-card skeuo-card-interactive"
                          style={{
                            padding: '3px',
                            background: '#ffffff',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            overflow: 'hidden'
                          }}
                          title="Click to view full photo"
                        >
                          <img
                            src={img}
                            alt="Customer review photo"
                            style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '10px' }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attached Customer Video */}
                {rev.videoUrl && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-600, #166534)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Video size={14} />
                      <span>Customer Video Experience:</span>
                    </div>
                    <div 
                      className="skeuo-card"
                      style={{ 
                        maxWidth: '440px', 
                        borderRadius: '14px', 
                        overflow: 'hidden', 
                        padding: '4px',
                        background: '#0f172a'
                      }}
                    >
                      {embedVid ? (
                        <iframe
                          src={embedVid}
                          title="Customer Review Video"
                          style={{ width: '100%', height: '230px', border: 'none', borderRadius: '10px' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : rev.videoUrl.endsWith('.mp4') || rev.videoUrl.includes('mp4') ? (
                        <video src={rev.videoUrl} controls style={{ width: '100%', height: '230px', objectFit: 'contain', background: '#000000', borderRadius: '10px' }} />
                      ) : (
                        <a
                          href={rev.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="skeuo-btn skeuo-btn-primary"
                          style={{ display: 'inline-flex', margin: '0.75rem', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                        >
                          <Play size={13} />
                          <span>Watch Video on External Link</span>
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
        orderNumber={eligibility.orderNumber}
        initialReview={editingReview}
        onReviewSubmitted={() => {
          fetchReviews();
          checkEligibility();
        }}
      />

      {/* Fullscreen Review Photo Lightbox */}
      {previewImage && createPortal(
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(3, 7, 18, 0.96)',
            backdropFilter: 'blur(16px)',
            zIndex: 99999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.2s ease-out forwards'
          }}
        >
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            className="skeuo-btn"
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              width: '46px',
              height: '46px',
              color: '#ffffff',
              cursor: 'pointer',
              zIndex: 100000000
            }}
            title="Close Fullscreen View"
          >
            <X size={26} />
          </button>

          <img
            src={previewImage}
            alt="Customer Photo Fullscreen"
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: '16px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </div>
  );
};

export default VerifiedReviewSection;
