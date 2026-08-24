import React, { useState, useRef } from 'react';
import { Play, Image as ImageIcon, ZoomIn, Sparkles } from 'lucide-react';
import { getYouTubeEmbedUrl } from '../admin/ProductForm/TabMedia';

const ProductGallery = ({ mainImage, gallery = [], video }) => {
  // Assemble full media list in order
  const allImages = [];
  if (mainImage?.url) {
    allImages.push({ url: mainImage.url, tag: '01 Main View', alt: mainImage.alt || 'Main Machinery View' });
  }

  gallery.forEach((item, idx) => {
    if (item.url && !allImages.some(img => img.url === item.url)) {
      allImages.push({
        url: item.url,
        tag: item.tag || `0${idx + 2} Angle View`,
        alt: item.alt || 'Gallery Angle View'
      });
    }
  });

  if (allImages.length === 0) {
    allImages.push({ url: '/images/machinery/power_weeder.jpg', tag: '01 Main View', alt: 'Machinery View' });
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  // Amazon-style Image Magnification Zoom state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  const activeMedia = allImages[activeIndex] || allImages[0];

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  const videoEmbedUrl = video?.url ? getYouTubeEmbedUrl(video.url) : null;
  const isDirectVideo = video?.url && (video.url.endsWith('.mp4') || video.url.endsWith('.webm') || video.url.includes('/uploads/'));

  return (
    <div className="flex flex-col gap-3">
      {/* Active Main Display Container with Hover Zoom Lens */}
      <div
        ref={containerRef}
        onMouseEnter={() => !showVideo && setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '75%',
          background: '#f8fafc',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          cursor: showVideo ? 'default' : 'crosshair'
        }}
      >
        {showVideo && video?.url ? (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000000', zIndex: 10 }}>
            {isDirectVideo ? (
              <video src={video.url} controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : videoEmbedUrl ? (
              <iframe
                src={`${videoEmbedUrl}${videoEmbedUrl.includes('?') ? '&' : '?'}autoplay=1`}
                title={video.title || 'Product Working Video'}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#ffffff' }}>Video could not be loaded</div>
            )}
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            <img
              src={activeMedia.url}
              alt={activeMedia.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '1rem',
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: isZoomed ? 'scale(2.4)' : 'scale(1)',
                transition: isZoomed ? 'transform 0.08s ease-out' : 'transform 0.3s ease-out',
                pointerEvents: 'none'
              }}
            />
          </div>
        )}

        {/* Hover Zoom Hint Badge */}
        {!showVideo && !isZoomed && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              color: '#166534',
              fontSize: '0.725rem',
              fontWeight: 700,
              padding: '0.3rem 0.6rem',
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              pointerEvents: 'none',
              zIndex: 5
            }}
          >
            <ZoomIn size={13} color="#166534" />
            <span>Hover to Zoom Lens</span>
          </div>
        )}

        {/* Media Tag Indicator */}
        {!showVideo && activeMedia.tag && (
          <span
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: '#ffffff',
              fontSize: '0.725rem',
              padding: '0.25rem 0.6rem',
              borderRadius: '6px',
              fontWeight: 600,
              zIndex: 5,
              pointerEvents: 'none'
            }}
          >
            {activeMedia.tag}
          </span>
        )}
      </div>

      {/* Thumbnails Bar & Video Selector */}
      <div className="flex gap-2" style={{ overflowX: 'auto', padding: '0.35rem 0' }}>
        {allImages.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setActiveIndex(idx);
              setShowVideo(false);
            }}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: activeIndex === idx && !showVideo ? '2px solid #166534' : '1px solid #cbd5e1',
              padding: '2px',
              background: '#ffffff',
              cursor: 'pointer',
              flexShrink: 0,
              position: 'relative',
              boxShadow: activeIndex === idx && !showVideo ? '0 0 0 2px rgba(22, 101, 52, 0.2)' : 'none'
            }}
          >
            <img src={img.url} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }} />
            {img.tag && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  left: '2px',
                  right: '2px',
                  fontSize: '0.55rem',
                  background: 'rgba(0, 0, 0, 0.75)',
                  color: '#ffffff',
                  textAlign: 'center',
                  borderRadius: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden'
                }}
              >
                {img.tag.replace(/^\d+\s*/, '')}
              </span>
            )}
          </button>
        ))}

        {/* Video Thumbnail Button */}
        {video?.url && (
          <button
            type="button"
            onClick={() => setShowVideo(true)}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '10px',
              border: showVideo ? '2px solid #f59e0b' : '1px solid #cbd5e1',
              background: '#070d1a',
              color: '#f59e0b',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: showVideo ? '0 0 0 2px rgba(245, 158, 11, 0.3)' : 'none'
            }}
          >
            <Play size={22} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ffffff' }}>FIELD VIDEO</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
