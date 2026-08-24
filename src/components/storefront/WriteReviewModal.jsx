import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Camera, Video, Send, Plus, Trash2, Play, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';
import api from '../../services/api';
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

const WriteReviewModal = ({ isOpen, onClose, productId, productName, initialReview = null, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [farmType, setFarmType] = useState('Vegetable & Horticulture');
  const [cropGrown, setCropGrown] = useState('');
  const [acres, setAcres] = useState(5);

  // Photos & Video
  const [imageInput, setImageInput] = useState('');
  const [imagesList, setImagesList] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating || 5);
      setTitle(initialReview.title || '');
      setComment(initialReview.comment || '');
      setFarmType(initialReview.farmContext?.farmType || 'Vegetable & Horticulture');
      setCropGrown(initialReview.farmContext?.cropGrown || '');
      setAcres(initialReview.farmContext?.acres || 5);
      setImagesList(initialReview.images || []);
      setVideoUrl(initialReview.videoUrl || '');
    } else {
      setRating(5);
      setTitle('');
      setComment('');
      setFarmType('Vegetable & Horticulture');
      setCropGrown('');
      setAcres(5);
      setImagesList([]);
      setVideoUrl('');
      setImageInput('');
    }
  }, [initialReview, isOpen]);

  const handleAddImage = (e) => {
    e.preventDefault();
    if (!imageInput.trim()) return;
    if (imagesList.length >= 4) {
      addToast('Maximum 4 photos allowed per review.', 'warning');
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
      addToast('Please enter at least 5 characters for your review.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        rating,
        title,
        comment,
        farmContext: {
          farmType,
          cropGrown,
          acres: Number(acres) || 0
        },
        images: imagesList,
        videoUrl: videoUrl.trim()
      };

      let res;
      if (initialReview && initialReview._id) {
        // Edit Mode
        res = await api.put(`/reviews/${initialReview._id}`, payload);
      } else {
        // Create Mode
        res = await api.post(`/reviews/${productId}`, payload);
      }

      if (res.data.success) {
        addToast(initialReview ? 'Your review with photos/video has been updated!' : 'Your review with photos/video is now live!', 'success');
        if (onReviewSubmitted) onReviewSubmitted(res.data.review);
        onClose();
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to save review.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const embedVideo = getYouTubeEmbedUrl(videoUrl);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialReview ? 'Edit Your Farmer Review' : 'Write Verified Farmer Review'}
      maxWidth="640px"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Verified Badge Ribbon */}
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: '#166534'
        }}>
          <ShieldCheck size={18} color="#22c55e" />
          <span>
            {initialReview
              ? <span>Editing your published review for <strong>{productName}</strong></span>
              : <span>Reviewing as a <strong>Verified Farmer</strong> of <strong>{productName}</strong></span>
            }
          </span>
        </div>

        {/* 5-Star Rating Selector */}
        <div className="flex flex-col gap-1">
          <label className="input-label">Your Overall Rating *</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <Star
                  size={28}
                  fill={star <= rating ? '#f59e0b' : 'none'}
                  color={star <= rating ? '#f59e0b' : '#cbd5e1'}
                />
              </button>
            ))}
            <span style={{ fontWeight: 700, color: '#b45309', marginLeft: '0.5rem' }}>
              {rating === 5 ? '5 ★ - Outstanding' : rating === 4 ? '4 ★ - Very Good' : rating === 3 ? '3 ★ - Average' : `${rating} ★`}
            </span>
          </div>
        </div>

        {/* Review Title */}
        <div className="input-group">
          <label className="input-label">Review Headline / Summary</label>
          <input
            type="text"
            className="input-field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Excellent machine for black clay soil! Saved 4 laborers"
          />
        </div>

        {/* Review Comment */}
        <div className="input-group">
          <label className="input-label">Detailed Farmer Review & Experience *</label>
          <textarea
            className="textarea-field"
            rows="3"
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your practical experience: How was the fuel consumption? Easy to start? Quality of weeding/tilling? Delivery and service support?"
          />
        </div>

        {/* Farm Context */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div className="input-group">
            <label className="input-label">Crops Grown</label>
            <input
              type="text"
              className="input-field"
              value={cropGrown}
              onChange={(e) => setCropGrown(e.target.value)}
              placeholder="e.g. Cotton, Chilli, Sugarcane"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Farm Size (Acres)</label>
            <input
              type="number"
              className="input-field"
              value={acres}
              onChange={(e) => setAcres(e.target.value)}
              placeholder="e.g. 5"
            />
          </div>
        </div>

        {/* Photos Upload / URL Section */}
        <div className="input-group">
          <label className="input-label flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Camera size={16} color="#166534" />
              <span>Attach Field Photos (Up to 4)</span>
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{imagesList.length}/4 Attached</span>
          </label>

          <div className="flex gap-2">
            <input
              type="url"
              className="input-field"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="Paste photo image URL (e.g. https://...)"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="btn btn-secondary btn-sm"
              style={{ whiteSpace: 'nowrap' }}
            >
              <Plus size={14} />
              <span>Add Photo</span>
            </button>
          </div>

          {/* Photos Thumbnails List */}
          {imagesList.length > 0 && (
            <div className="flex gap-2" style={{ marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {imagesList.map((img, idx) => (
                <div key={idx} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '10px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video / YouTube Field Demonstration URL */}
        <div className="input-group">
          <label className="input-label flex items-center gap-1.5">
            <Video size={16} color="#166534" />
            <span>Field Working Video URL / YouTube Link (Optional)</span>
          </label>
          <input
            type="url"
            className="input-field"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="e.g. https://www.youtube.com/watch?v=... or direct MP4 video link"
          />

          {/* Live In-Modal Video Preview */}
          {videoUrl && (
            <div style={{ marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', maxHeight: '180px' }}>
              {embedVideo ? (
                <iframe
                  src={embedVideo}
                  title="Field Video Preview"
                  style={{ width: '100%', height: '180px', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : videoUrl.endsWith('.mp4') || videoUrl.includes('mp4') ? (
                <video src={videoUrl} controls style={{ width: '100%', height: '180px', objectFit: 'contain', background: '#000000' }} />
              ) : (
                <div style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#166534', background: '#f0fdf4', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Play size={13} /> Video link attached: {videoUrl}
                </div>
              )}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ marginTop: '0.5rem' }}>
          <Send size={18} />
          <span>{loading ? 'Saving Review...' : initialReview ? 'Update My Review' : 'Submit Live Review with Media'}</span>
        </button>
      </form>
    </Modal>
  );
};

export default WriteReviewModal;
