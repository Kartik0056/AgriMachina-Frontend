import React from 'react';

/**
 * Premium Eidula Brand Logo Component
 * Incorporates a luxury gold & emerald monogram emblem ('E' + Spice Blossom / Diamond crest),
 * bespoke gold/porcelain typography, and the luxury brand tagline:
 * "PURE SPICES • MODERN LIVING"
 */
const EidulaLogo = ({
  size = 'md',
  showTagline = true,
  variant = 'compact', // 'compact', 'full', 'icon', 'wordmark'
  light = false,
  className = ''
}) => {
  const sizeMap = {
    sm: {
      imgSize: 32,
      titleSize: '1.15rem',
      tagSize: '0.52rem',
      gap: '0.45rem',
      iconPad: 5,
      fullWidth: 120
    },
    md: {
      imgSize: 38,
      titleSize: '1.35rem',
      tagSize: '0.58rem',
      gap: '0.55rem',
      iconPad: 6,
      fullWidth: 150
    },
    lg: {
      imgSize: 48,
      titleSize: '1.65rem',
      tagSize: '0.65rem',
      gap: '0.75rem',
      iconPad: 8,
      fullWidth: 200
    },
    xl: {
      imgSize: 64,
      titleSize: '2.1rem',
      tagSize: '0.75rem',
      gap: '0.9rem',
      iconPad: 10,
      fullWidth: 260
    }
  };

  const current = sizeMap[size] || sizeMap.md;

  // Ultra-crisp vector emblem: Obsidian Emerald shield with Molten Champagne Gold 'E' & Diamond Crest
  const renderEmblem = () => (
    <div
      style={{
        width: `${current.imgSize}px`,
        height: `${current.imgSize}px`,
        borderRadius: size === 'sm' ? '8px' : '10px',
        background: 'radial-gradient(circle at 30% 30%, #0d3824 0%, #041a12 75%, #020f0a 100%)',
        border: '1.5px solid rgba(212, 175, 55, 0.55)',
        boxShadow: '0 4px 14px rgba(4, 26, 18, 0.45), 0 0 0 1px rgba(254, 238, 164, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle background luxury glow */}
      <div
        style={{
          position: 'absolute',
          width: '70%',
          height: '70%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.35) 0%, transparent 70%)',
          top: '15%',
          left: '15%',
          pointerEvents: 'none'
        }}
      />

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '84%', height: '84%', zIndex: 1 }}
      >
        <defs>
          {/* Molten Gold Gradient */}
          <linearGradient id="eidulaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff2a8" />
            <stop offset="30%" stopColor="#d4af37" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#9a6c0c" />
          </linearGradient>

          {/* Emerald Sheen */}
          <linearGradient id="eidulaEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Soft Shadow */}
          <filter id="eidulaDropShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Outer Fine Hexagonal Crest */}
        <polygon
          points="50,6 88,27 88,73 50,94 12,73 12,27"
          stroke="url(#eidulaGoldGrad)"
          strokeWidth="2.5"
          strokeOpacity="0.45"
          fill="none"
        />

        {/* Inner Diamond Star Accents */}
        <circle cx="50" cy="14" r="2.2" fill="url(#eidulaGoldGrad)" />
        <circle cx="50" cy="86" r="2.2" fill="url(#eidulaGoldGrad)" />

        {/* Crown Jewel Top Diamond */}
        <polygon
          points="50,17 54,23 50,29 46,23"
          fill="url(#eidulaGoldGrad)"
          filter="url(#eidulaDropShadow)"
        />

        {/* Stylized Majestic 'E' Monogram with Integrated Spice Leaf / Flame Motif */}
        <path
          d="M 32,30 
             L 68,30 
             C 71,30 73,32 72,35 
             L 70,39 
             C 69,41 67,42 64,42 
             L 44,42 
             L 44,48 
             L 60,48 
             C 62,48 64,50 63,52 
             L 62,55 
             C 61,57 59,58 57,58 
             L 44,58 
             L 44,66 
             L 66,66 
             C 69,66 71,68 70,71 
             L 68,75 
             C 67,78 64,79 61,79 
             L 30,79 
             C 27,79 25,77 25,74 
             L 25,35 
             C 25,32 27,30 30,30 
             Z"
          fill="url(#eidulaGoldGrad)"
          filter="url(#eidulaDropShadow)"
        />

        {/* Signature Spice Leaf Accent tucked inside the E curve */}
        <path
          d="M 64,46 
             C 72,42 78,48 76,56 
             C 70,58 64,54 64,46 Z"
          fill="url(#eidulaEmeraldGrad)"
          stroke="url(#eidulaGoldGrad)"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );

  // Icon only
  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{renderEmblem()}</div>;
  }

  // Wordmark only
  if (variant === 'wordmark') {
    return (
      <div
        className={`inline-flex flex-col ${className}`}
        style={{ userSelect: 'none', lineHeight: 1 }}
      >
        <div
          style={{
            fontSize: current.titleSize,
            fontWeight: 800,
            letterSpacing: '0.04em',
            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
            display: 'flex',
            alignItems: 'baseline'
          }}
        >
          <span
            style={{
              background: 'linear-gradient(135deg, #fbeea4 0%, #d4af37 50%, #b45309 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              fontWeight: 900
            }}
          >
            E
          </span>
          <span
            style={{
              color: light ? '#ffffff' : 'var(--text-main, #0f172a)',
              letterSpacing: '0.03em',
              fontWeight: 800
            }}
          >
            idula
          </span>
        </div>
      </div>
    );
  }

  // Default: Compact layout (Emblem + Wordmark + Tagline)
  return (
    <div
      className={`inline-flex items-center ${className}`}
      style={{
        gap: current.gap,
        userSelect: 'none',
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      {renderEmblem()}

      {/* Brand Typography & Tagline */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <div
          style={{
            fontSize: current.titleSize,
            fontWeight: 800,
            letterSpacing: '0.03em',
            display: 'flex',
            alignItems: 'baseline',
            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif"
          }}
        >
          {/* Molten Gold E */}
          <span
            style={{
              background: 'linear-gradient(135deg, #fff2a8 0%, #d4af37 55%, #b45309 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 1px 2px rgba(0,0,0,0.18)',
              fontWeight: 900,
              fontSize: '1.05em'
            }}
          >
            E
          </span>
          {/* Clean Porcelain / Titanium White 'idula' */}
          <span
            style={{
              color: light ? '#ffffff' : 'var(--text-main, #0f172a)',
              letterSpacing: '0.025em',
              fontWeight: 800
            }}
          >
            idula
          </span>
        </div>

        {showTagline && (
          <div
            style={{
              fontSize: current.tagSize,
              color: light ? 'rgba(254, 240, 138, 0.95)' : 'var(--primary-600, #166534)',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: '2.5px',
              whiteSpace: 'nowrap'
            }}
          >
            Pure Spices & Living
          </div>
        )}
      </div>
    </div>
  );
};

export default EidulaLogo;
