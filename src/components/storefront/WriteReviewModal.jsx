import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Camera, Send, Plus, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const WriteReviewModal = ({ 
  isOpen, 
  onClose, 
  productId, 
  productName, 
  orderNumber = null, 
  initialReview = null, 
  onReviewSubmitted 
}) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [imagesList, setImagesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating || 5);
      setTitle(initialReview.title || '');
      setComment(initialReview.comment || '');
      setImagesList(initialReview.images || []);
    } else {
      setRating(5);
      setTitle('');
      setComment('');
      setImagesList([]);
      setImageInput('');
    }
  }, [initialReview, isOpen]);

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!imageInput.trim()) return;
    if (imagesList.length >= 2) {
      addToast('Maximum 2 photos allowed per review.', 'warning');
      return;
    }
    setImagesList(prev => [...prev, imageInput.trim()]);
    setImageInput('');
  };

  const handleRemoveImage = (idx) => {
    setImagesList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment || comment.trim().length < 5) {
      addToast('Please enter at least 5 characters for your review comment.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        rating,
        title: title.trim(),
        comment: comment.trim(),
        images: imagesList
      };

      let res;
      if (initialReview && initialReview._id) {
        res = await api.put(`/reviews/${initialReview._id}`, payload);
      } else {
        res = await api.post(`/reviews/${productId}`, payload);
      }

      if (res.data.success) {
        addToast(initialReview ? 'Aapka review successfully update ho gaya hai!' : 'Dhanyawad! Aapka verified review publish ho gaya hai.', 'success');
        if (onReviewSubmitted) onReviewSubmitted(res.data.review);
        onClose();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to save review. Please verify your delivered purchase.';
      addToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialReview ? 'Edit Verified Review' : 'Write Verified Review'}
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
        {/* Verified Delivered Purchase Badge Ribbon */}
        <div 
          className="skeuo-card"
          style={{
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
            border: '1px solid #a7f3d0',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <div 
            className="skeuo-icon-medallion"
            style={{
              width: '36px',
              height: '36px',
              background: '#ffffff',
              border: '1px solid #a7f3d0',
              color: '#047857'
            }}
          >
            <ShieldCheck size={18} strokeWidth={2.2} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>VERIFIED DELIVERED PURCHASE</span>
              {orderNumber && (
                <span className="skeuo-badge" style={{ background: '#ffffff', color: '#047857', padding: '0.1rem 0.45rem', fontSize: '0.65rem' }}>
                  #{orderNumber}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.825rem', color: '#047857', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {productName}
            </div>
          </div>
        </div>

        {/* 5-Star Tactile Rating Selector */}
        <div>
          <label style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.45rem', display: 'block' }}>
            Your Rating *
          </label>
          <div 
            className="skeuo-well"
            style={{ 
              padding: '0.75rem 1rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              flexWrap: 'wrap', 
              gap: '0.5rem' 
            }}
          >
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: star <= rating ? 'linear-gradient(145deg, #fffbeb, #fef3c7)' : 'transparent',
                    border: star <= rating ? '1px solid #fde68a' : '1px solid transparent',
                    borderRadius: '10px',
                    padding: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    boxShadow: star <= rating ? '0 2px 5px rgba(245, 158, 11, 0.2)' : 'none'
                  }}
                  className="hover:scale-110 active:scale-95"
                >
                  <Star
                    size={24}
                    fill={star <= rating ? '#f59e0b' : 'none'}
                    color={star <= rating ? '#f59e0b' : '#cbd5e1'}
                  />
                </button>
              ))}
            </div>
            <span style={{ fontWeight: 800, color: '#b45309', fontSize: '0.85rem' }}>
              {rating === 5 ? '5 ★ - Outstanding' : rating === 4 ? '4 ★ - Very Good' : rating === 3 ? '3 ★ - Average' : rating === 2 ? '2 ★ - Below Average' : '1 ★ - Poor'}
            </span>
          </div>
        </div>

        {/* Review Title */}
        <div>
          <label style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', display: 'block' }}>
            Review Headline
          </label>
          <input
            type="text"
            className="input-field"
            style={{ 
              padding: '0.65rem 0.85rem', 
              fontSize: '0.875rem', 
              borderRadius: '12px',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)'
            }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Outstanding build quality, swift delivery!"
          />
        </div>

        {/* Review Comment */}
        <div>
          <label style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', display: 'block' }}>
            Your Experience & Feedback *
          </label>
          <textarea
            className="textarea-field"
            rows="3"
            required
            style={{ 
              padding: '0.65rem 0.85rem', 
              fontSize: '0.875rem', 
              borderRadius: '12px', 
              minHeight: '85px', 
              maxHeight: '130px', 
              resize: 'none',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)'
            }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details on product quality, packaging, delivery speed, and how it matched your expectations."
          />
        </div>

        {/* Photos Section */}
        <div>
          <label style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="flex items-center gap-1.5">
              <Camera size={14} color="var(--primary-600)" />
              <span>Attach Photos (Optional, max 2)</span>
            </span>
          </label>

          <div className="flex gap-2">
            <input
              type="url"
              className="input-field"
              style={{ 
                padding: '0.55rem 0.85rem', 
                fontSize: '0.825rem', 
                borderRadius: '12px',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)'
              }}
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="Paste photo image URL"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="skeuo-btn"
              style={{ 
                whiteSpace: 'nowrap', 
                padding: '0.55rem 1rem', 
                fontSize: '0.825rem',
                background: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)'
              }}
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          </div>

          {imagesList.length > 0 && (
            <div className="flex gap-3" style={{ marginTop: '0.6rem' }}>
              {imagesList.map((img, idx) => (
                <div 
                  key={idx} 
                  className="skeuo-card"
                  style={{ 
                    position: 'relative', 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '10px', 
                    overflow: 'hidden', 
                    padding: '2px'
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    style={{
                      position: 'absolute',
                      top: '3px',
                      right: '3px',
                      background: 'rgba(220, 38, 38, 0.9)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '10px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="skeuo-btn skeuo-btn-primary"
          style={{ 
            width: '100%', 
            padding: '0.85rem', 
            fontSize: '0.925rem', 
            fontWeight: 800, 
            marginTop: '0.5rem' 
          }}
        >
          <Send size={16} />
          <span>{loading ? 'Submitting...' : initialReview ? 'Update Verified Review' : 'Submit Verified Review'}</span>
        </button>
      </form>
    </Modal>
  );
};

export default WriteReviewModal;
