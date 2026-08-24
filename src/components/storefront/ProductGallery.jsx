import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Play, ZoomIn, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getYouTubeEmbedUrl, isDirectVideoUrl } from '../../services/videoHelper';

const ProductGallery = ({ mainImage, gallery = [], video }) => {
  const allImages = [];
  if (mainImage?.url) {
    allImages.push({ url: mainImage.url, tag: '01 Main View', alt: mainImage.alt || 'Main Machinery View' });
  }

  gallery.forEach((item, idx) => {
    if (item.url && !allImages.some(img => img.url === item.url)) {
      allImages.push({
        url: item.url,
        tag: item.tag || `0${idx + 2} View`,
        alt: item.alt || 'Gallery View'
      });
    }
  });

  if (allImages.length === 0) {
    allImages.push({ url: '/images/machinery/power_weeder.jpg', tag: '01 Main View', alt: 'Machinery View' });
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Smooth Zoom Lens
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

  const handleNextImage = () => {
    if (showVideo) {
      setShowVideo(false);
      setActiveIndex(0);
    } else {
      setActiveIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const handlePrevImage = () => {
    if (showVideo) {
      setShowVideo(false);
      setActiveIndex(allImages.length - 1);
    } else {
      setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  const videoEmbedUrl = video?.url ? getYouTubeEmbedUrl(video.url) : null;
  const isDirectVideo = isDirectVideoUrl(video?.url);

  return (
    <div className="flex flex-col gap-4" style={{ width: '100%' }}>
      {/* Seamless Floating Machinery Showcase Frame */}
      <div
        ref={containerRef}
        onMouseEnter={() => !showVideo && setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '420px',
          height: '460px',
          background: 'var(--bg-surface)',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1.5px solid var(--border-color)',
          boxShadow: '0 8px 30px -8px rgba(0, 0, 0, 0.08)',
          cursor: showVideo ? 'default' : isZoomed ? 'zoom-out' : 'crosshair',
          transition: 'all 0.25s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {showVideo && video?.url ? (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#070d1a', zIndex: 10 }}>
            {/* Close Video / Return to Photos Button */}
            <button
              type="button"
              onClick={() => setShowVideo(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(6px)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 15,
                transition: 'transform 0.15s ease'
              }}
              className="hover:scale-110"
              title="Return to Photos"
            >
              <X size={18} />
            </button>

            {isDirectVideo ? (
              <video src={video.url} controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : videoEmbedUrl ? (
              <iframe
                src={`${videoEmbedUrl}${videoEmbedUrl.includes('?') ? '&' : '?'}autoplay=1`}
                title={video.title || 'Product Working Video'}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#ffffff' }}>Video could not be loaded</div>
            )}
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: '1.75rem'
            }}
          >
            <img
              src={activeMedia.url}
              alt={activeMedia.alt}
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                transition: isZoomed ? 'transform 0.06s ease-out' : 'transform 0.3s ease-out',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.12))'
              }}
            />
          </div>
        )}

        {/* Top Badges & Controls */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
          zIndex: 8
        }}>
          {/* Media Angle Tag */}
          {!showVideo && activeMedia.tag && (
            <span
              style={{
                background: 'rgba(15, 23, 42, 0.72)',
                backdropFilter: 'blur(8px)',
                color: '#f8fafc',
                fontSize: '0.725rem',
                padding: '0.3rem 0.7rem',
                borderRadius: '8px',
                fontWeight: 700,
                letterSpacing: '0.02em',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              📷 {activeMedia.tag}
            </span>
          )}

          {/* Right Action Icons (Zoom & Fullscreen) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto' }}>
            {!showVideo && !isZoomed && (
              <div
                style={{
                  background: 'rgba(22, 101, 52, 0.85)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.3rem 0.65rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  border: '1px solid rgba(134, 239, 172, 0.3)'
                }}
              >
                <ZoomIn size={13} color="#86efac" />
                <span>Hover to Zoom</span>
              </div>
            )}

            {!showVideo && (
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                style={{
                  background: 'rgba(15, 23, 42, 0.72)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  transition: 'transform 0.15s ease'
                }}
                className="hover:scale-110"
                title="Fullscreen Image View"
              >
                <Maximize2 size={15} color="#f8fafc" />
              </button>
            )}
          </div>
        </div>

        {/* Carousel Arrow Navigation */}
        {allImages.length > 1 && !isZoomed && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(6px)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 8,
                transition: 'all 0.15s ease'
              }}
              className="hover:scale-110"
              title="Previous Photo"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(6px)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 8,
                transition: 'all 0.15s ease'
              }}
              className="hover:scale-110"
              title="Next Photo"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row with Clean, Unobstructed Previews & No Clipping */}
      <div
        className="flex gap-3"
        style={{
          overflowX: 'auto',
          padding: '6px 4px',
          scrollbarWidth: 'thin'
        }}
      >
        {allImages.map((img, idx) => {
          const isSelected = activeIndex === idx && !showVideo;
          return (
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
                borderRadius: '12px',
                border: isSelected ? '2px solid #16a34a' : '1.5px solid var(--border-color)',
                padding: '5px',
                background: 'var(--bg-surface)',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: isSelected ? '0 0 0 2.5px rgba(22, 163, 74, 0.3)' : 'var(--shadow-sm)',
                transition: 'all 0.18s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="hover:scale-105"
              title={img.tag || `View ${idx + 1}`}
            >
              <img
                src={img.url}
                alt={img.alt}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '6px'
                }}
              />
            </button>
          );
        })}

        {/* Video Thumbnail Button */}
        {video?.url && (
          <button
            type="button"
            onClick={() => setShowVideo(true)}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '12px',
              border: showVideo ? '2px solid #f59e0b' : '1.5px solid var(--border-color)',
              background: 'linear-gradient(135deg, #0c3e27, #070d1a)',
              color: '#f59e0b',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: showVideo ? '0 0 0 2.5px rgba(245, 158, 11, 0.35)' : 'var(--shadow-sm)',
              transition: 'all 0.18s ease'
            }}
            className="hover:scale-105"
            title="Field Working Video Demo"
          >
            <Play size={20} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#fef08a' }}>DEMO</span>
          </button>
        )}
      </div>

      {/* Lightbox / Fullscreen High-Resolution Viewer Portal (Completely bypasses stacking context) */}
      {isFullscreen && createPortal(
        <div
          onClick={() => setIsFullscreen(false)}
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
          {/* Close Fullscreen Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              width: '46px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              zIndex: 100000000,
              transition: 'all 0.15s ease'
            }}
            className="hover:scale-110 hover:bg-white/25"
            title="Close Fullscreen View (Esc)"
          >
            <X size={26} />
          </button>

          {/* Left / Right Carousel Navigation in Fullscreen */}
          {allImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                style={{
                  position: 'absolute',
                  left: '24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '50%',
                  width: '52px',
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  zIndex: 100000000,
                  transition: 'all 0.15s ease'
                }}
                className="hover:scale-110 hover:bg-white/25"
                title="Previous Photo"
              >
                <ChevronLeft size={30} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                style={{
                  position: 'absolute',
                  right: '24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '50%',
                  width: '52px',
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  zIndex: 100000000,
                  transition: 'all 0.15s ease'
                }}
                className="hover:scale-110 hover:bg-white/25"
                title="Next Photo"
              >
                <ChevronRight size={30} />
              </button>
            </>
          )}

          {/* Fullscreen High-Res Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              maxWidth: '92vw',
              maxHeight: '90vh'
            }}
          >
            <img
              src={activeMedia.url}
              alt={activeMedia.alt}
              style={{
                maxWidth: '90vw',
                maxHeight: '82vh',
                objectFit: 'contain',
                borderRadius: '16px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            />

            {activeMedia.tag && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  padding: '0.4rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                📷 {activeMedia.tag} ({activeIndex + 1} / {allImages.length})
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProductGallery;
