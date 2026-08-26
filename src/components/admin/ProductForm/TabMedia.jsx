import React, { useState } from 'react';
import { Image, Video, FileText, ArrowUp, ArrowDown, Trash2, Plus, Upload, Play, CheckCircle2 } from 'lucide-react';
import adminApi from '../../../services/adminApi';
import { useToast } from '../../../context/ToastContext';
import { getYouTubeEmbedUrl, extractYouTubeId, isDirectVideoUrl } from '../../../services/videoHelper';

export { getYouTubeEmbedUrl, extractYouTubeId, isDirectVideoUrl };

const standardTags = ['01 Main', '02 Front', '03 Side', '04 Back', '05 Detail', '06 Engine', '07 Application', '08 Accessories'];

const TabMedia = ({ formData, updateField }) => {
  const { addToast } = useToast();
  const gallery = formData.gallery || [];
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageTag, setNewImageTag] = useState('02 Front');
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const addGalleryImage = () => {
    if (!newImageUrl) return;
    const updated = [...gallery, { url: newImageUrl, tag: newImageTag, order: gallery.length + 1 }];
    updateField('gallery', updated);
    setNewImageUrl('');
  };

  const removeGalleryImage = (idx) => {
    const updated = gallery.filter((_, i) => i !== idx);
    updateField('gallery', updated);
  };

  const moveGalleryImage = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= gallery.length) return;
    const updated = [...gallery];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    updateField('gallery', updated);
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('files', files[i]);
    }

    setUploading(true);
    try {
      const res = await adminApi.post('/products/media/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success && res.data.files) {
        const newImages = res.data.files.map((f, i) => ({
          url: f.url,
          tag: standardTags[gallery.length + i] || 'Gallery',
          order: gallery.length + i + 1
        }));
        const updated = [...gallery, ...newImages];
        updateField('gallery', updated);
        if (!formData.mainImage?.url && newImages[0]) {
          updateField('mainImage', { url: newImages[0].url, alt: formData.name || '' });
        }
        addToast('Media images uploaded successfully', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Media upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('files', file);

    setUploadingVideo(true);
    try {
      const res = await adminApi.post('/products/media/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success && res.data.files?.[0]) {
        const videoUrl = res.data.files[0].url;
        updateField('video', {
          ...formData.video,
          url: videoUrl,
          title: formData.video?.title || `${formData.name || 'Machinery'} Field Demo`
        });
        addToast('Video file uploaded successfully!', 'success');
      }
    } catch (err) {
      addToast('Video file upload failed.', 'error');
    } finally {
      setUploadingVideo(false);
    }
  };

  const videoEmbedUrl = getYouTubeEmbedUrl(formData.video?.url);
  const isDirectVideo = isDirectVideoUrl(formData.video?.url);

  return (
    <div className="flex flex-col gap-6">
      {/* Primary Hero Image */}
      <div className="input-group">
        <label className="input-label" style={{ color: '#cbd5e1' }}>Primary Product Hero Image URL *</label>
        <input
          type="text"
          required
          className="input-field"
          style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
          value={formData.mainImage?.url || ''}
          onChange={(e) => updateField('mainImage', { ...formData.mainImage, url: e.target.value, alt: formData.name || '' })}
          placeholder="https://... (JPG, PNG, or WEBP)"
        />
      </div>

      {/* File Upload Zone */}
      <div style={{ background: 'var(--admin-bg-sidebar)', border: '2px dashed #1e2e4f', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
        <input
          type="file"
          id="media-upload-input"
          multiple
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <label htmlFor="media-upload-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
          <Upload size={28} color="#34d399" />
          <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>
            {uploading ? 'Uploading Images to Static Storage...' : 'Click to Upload Machine Photos (JPG, PNG, WEBP)'}
          </span>
          <span style={{ fontSize: '0.75rem' }}>Multiple files supported up to 25MB</span>
        </label>
      </div>

      {/* Gallery Image Manager */}
      <div style={{ background: 'var(--admin-bg-main)', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Image size={18} color="#34d399" />
          <span>Product Gallery Ordering & Angle Tags</span>
        </h4>

        {/* Add Image Row */}
        <div className="flex gap-2" style={{ marginBottom: '1.25rem' }}>
          <input
            type="text"
            className="input-field"
            style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff', flex: 1 }}
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Paste additional image URL (e.g. 02 Front angle view)"
          />
          <select
            className="select-field"
            style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff', width: '180px' }}
            value={newImageTag}
            onChange={(e) => setNewImageTag(e.target.value)}
          >
            {standardTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <button type="button" onClick={addGalleryImage} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Add Angle</span>
          </button>
        </div>

        {/* List of gallery images with reorder */}
        <div className="flex flex-col gap-2">
          {gallery.map((img, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--admin-bg-sidebar)',
                border: '1px solid #1e2e4f',
                borderRadius: '8px',
                padding: '0.65rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <img src={img.url} alt="" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />
              <div style={{ flex: 1 }}>
                <span className="badge badge-primary" style={{ marginRight: '0.5rem' }}>{img.tag}</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{img.url.slice(0, 60)}...</span>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moveGalleryImage(idx, -1)} disabled={idx === 0} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <ArrowUp size={16} />
                </button>
                <button type="button" onClick={() => moveGalleryImage(idx, 1)} disabled={idx === gallery.length - 1} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <ArrowDown size={16} />
                </button>
                <button type="button" onClick={() => removeGalleryImage(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', marginLeft: '0.5rem' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Demonstration Section with On-Platform Embedded Player */}
      <div style={{ background: 'var(--admin-bg-main)', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1.05rem', color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Video size={20} color="#f59e0b" />
          <span>Product Working Video (YouTube Link / MP4 Upload - Plays On Platform)</span>
        </h4>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
          Add a YouTube demonstration link or upload an MP4 file. The video will play directly on the storefront product page with zero external redirects.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: '1rem' }}>
          <div className="input-group">
            <label className="input-label" style={{ color: '#cbd5e1' }}>YouTube Video URL</label>
            <input
              type="text"
              className="input-field"
              style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
              value={formData.video?.url || ''}
              onChange={(e) => updateField('video', { ...formData.video, url: e.target.value })}
              placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ color: '#cbd5e1' }}>Video Title</label>
            <input
              type="text"
              className="input-field"
              style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
              value={formData.video?.title || ''}
              onChange={(e) => updateField('video', { ...formData.video, title: e.target.value })}
              placeholder="e.g. 7HP Power Weeder Live Farm Soil Working Demo"
            />
          </div>
        </div>

        {/* MP4 File Upload Option */}
        <div className="flex items-center gap-3" style={{ marginBottom: '1.25rem' }}>
          <input
            type="file"
            id="video-upload-file"
            accept="video/mp4,video/webm"
            onChange={handleVideoUpload}
            style={{ display: 'none' }}
          />
          <label htmlFor="video-upload-file" className="btn btn-secondary btn-sm" style={{ background: 'var(--admin-bg-sidebar)', borderColor: 'var(--admin-border)', color: '#ffffff', cursor: 'pointer' }}>
            <Upload size={14} color="#f59e0b" />
            <span>{uploadingVideo ? 'Uploading MP4...' : 'Or Upload MP4 Video File'}</span>
          </label>
          {formData.video?.url && (
            <span style={{ fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <CheckCircle2 size={14} /> Video URL Attached
            </span>
          )}
        </div>

        {/* Live On-Platform Video Preview Player */}
        {formData.video?.url && (
          <div style={{ background: 'var(--admin-bg-sidebar)', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#86efac', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Play size={14} color="#f59e0b" />
              <span>Live In-Platform Video Preview:</span>
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '540px', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', background: '#000000' }}>
              {isDirectVideo ? (
                <video src={formData.video.url} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : videoEmbedUrl ? (
                <iframe
                  src={videoEmbedUrl}
                  title="Field Demo"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Invalid Video URL</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PDF Documentation & Manuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>PDF Technical Brochure URL</label>
          <input
            type="text"
            className="input-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={formData.brochureUrl || ''}
            onChange={(e) => updateField('brochureUrl', e.target.value)}
            placeholder="https://.../brochure.pdf"
          />
        </div>

        <div className="input-group">
          <label className="input-label" style={{ color: '#cbd5e1' }}>Farmer Operational Manual URL</label>
          <input
            type="text"
            className="input-field"
            style={{ background: 'var(--admin-bg-main)', borderColor: 'var(--admin-border)', color: '#ffffff' }}
            value={formData.userManualUrl || ''}
            onChange={(e) => updateField('userManualUrl', e.target.value)}
            placeholder="https://.../user-manual.pdf"
          />
        </div>
      </div>
    </div>
  );
};

export default TabMedia;
