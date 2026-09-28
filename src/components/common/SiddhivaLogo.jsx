import React from 'react';

/**
 * Premium Siddhiva Brand Logo Component
 * Incorporates the official brand emblem (Regal Gold Shield 'S'),
 * distinct gold/white typography, and the brand tagline:
 * "Empowering Growth, Always Moving Forward"
 */
const SiddhivaLogo = ({
  size = 'md',
  showTagline = true,
  variant = 'compact', // 'compact', 'full', 'icon'
  light = false,
  className = ''
}) => {
  const sizeMap = {
    sm: {
      imgSize: 32,
      titleSize: '1.2rem',
      tagSize: '0.58rem',
      gap: '0.5rem',
      fullWidth: 120
    },
    md: {
      imgSize: 42,
      titleSize: '1.45rem',
      tagSize: '0.65rem',
      gap: '0.65rem',
      fullWidth: 150
    },
    lg: {
      imgSize: 56,
      titleSize: '1.85rem',
      tagSize: '0.75rem',
      gap: '0.85rem',
      fullWidth: 200
    },
    xl: {
      imgSize: 72,
      titleSize: '2.4rem',
      tagSize: '0.85rem',
      gap: '1rem',
      fullWidth: 260
    }
  };

  const current = sizeMap[size] || sizeMap.md;

  // Full rectangular badge variant
  if (variant === 'full') {
    return (
      <div
        className={`flex flex-col items-center ${className}`}
        style={{ userSelect: 'none', display: 'inline-flex' }}
      >
        <img
          src="/images/brand/siddhiva-logo.jpg"
          alt="Siddhiva - Premium E-Commerce"
          style={{
            width: `${current.fullWidth}px`,
            height: 'auto',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.35)',
            border: '1px solid rgba(212, 175, 55, 0.25)'
          }}
        />
      </div>
    );
  }

  // Icon only
  if (variant === 'icon') {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{
          width: `${current.imgSize}px`,
          height: `${current.imgSize}px`,
          borderRadius: '10px',
          overflow: 'hidden',
          background: '#09090b',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          flexShrink: 0
        }}
      >
        <img
          src="/images/brand/siddhiva-logo.jpg"
          alt="Siddhiva Logo"
          style={{
            width: '180%',
            height: '180%',
            objectFit: 'cover',
            objectPosition: '50% 32%'
          }}
        />
      </div>
    );
  }

  // Default compact layout for Navbar, Drawers, Footers, and Admin
  return (
    <div
      className={`flex items-center ${className}`}
      style={{
        gap: current.gap,
        userSelect: 'none',
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      {/* Emblem Thumbnail Card */}
      <div
        style={{
          width: `${current.imgSize}px`,
          height: `${current.imgSize}px`,
          borderRadius: '10px',
          overflow: 'hidden',
          background: '#09090b',
          border: '1.5px solid rgba(212, 160, 23, 0.45)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <img
          src="/images/brand/siddhiva-logo.jpg"
          alt="Siddhiva Emblem"
          style={{
            width: '185%',
            height: '185%',
            objectFit: 'cover',
            objectPosition: '50% 32%'
          }}
        />
      </div>

      {/* Brand Typography & Tagline */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <div
          style={{
            fontSize: current.titleSize,
            fontWeight: 900,
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'baseline',
            fontFamily: "'Outfit', 'Inter', sans-serif"
          }}
        >
          {/* Gold S */}
          <span
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}
          >
            S
          </span>
          {/* Chrome / Silver-White IDDHIVA */}
          <span
            style={{
              color: light ? '#ffffff' : 'var(--text-main, #0f172a)',
              letterSpacing: '0.06em'
            }}
          >
            IDDHIVA
          </span>
        </div>

        {showTagline && (
          <div
            style={{
              fontSize: current.tagSize,
              color: light ? 'rgba(254, 240, 138, 0.9)' : '#b45309',
              fontWeight: 700,
              letterSpacing: '0.03em',
              marginTop: '3px',
              whiteSpace: 'nowrap',
              fontStyle: 'normal'
            }}
          >
            Always moving forward
          </div>
        )}
      </div>
    </div>
  );
};

export default SiddhivaLogo;
