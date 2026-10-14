import React from 'react';

import emblemImg from '../../assets/eidula-emblem.png';
import wordmarkNavyImg from '../../assets/eidula-wordmark-navy.png';
import wordmarkWhiteImg from '../../assets/eidula-wordmark-white.png';
import fullLogoImg from '../../assets/eidula-full-logo.png';

/**
 * Official Eidula Brand Logo Component
 * Master 3D 'E' emblem (Navy spine, Gold leaf, Emerald leaf)
 * with regal Roman serif wordmark ("EIDULA" with golden apex in 'A')
 * and clean tracked-out brand tagline.
 */
const EidulaLogo = ({
  size = 'md',
  showTagline = true,
  variant = 'compact', // 'compact', 'full', 'icon', 'wordmark', 'app-icon'
  light = false,
  className = '',
  tagline = 'EVERYTHING YOU NEED, ALL IN ONE PLACE'
}) => {
  const sizeMap = {
    sm: {
      emblemHeight: 30,
      wordmarkHeight: 18,
      tagSize: '0.40rem',
      letterSpacing: '0.08em',
      gap: '0.35rem',
      tagMarginTop: '2px'
    },
    md: {
      emblemHeight: 38,
      wordmarkHeight: 22,
      tagSize: '0.46rem',
      letterSpacing: '0.09em',
      gap: '0.45rem',
      tagMarginTop: '2.5px'
    },
    lg: {
      emblemHeight: 46,
      wordmarkHeight: 28,
      tagSize: '0.54rem',
      letterSpacing: '0.10em',
      gap: '0.5rem',
      tagMarginTop: '3px'
    },
    xl: {
      emblemHeight: 64,
      wordmarkHeight: 38,
      tagSize: '0.65rem',
      letterSpacing: '0.11em',
      gap: '0.65rem',
      tagMarginTop: '4px'
    }
  };

  const current = sizeMap[size] || sizeMap.md;

  // Icon only
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center ${className}`} style={{ userSelect: 'none' }}>
        <img
          src={emblemImg}
          alt="Eidula Emblem"
          style={{
            height: `${current.emblemHeight}px`,
            width: 'auto',
            objectFit: 'contain',
            display: 'block'
          }}
        />
      </div>
    );
  }

  // App icon squircle
  if (variant === 'app-icon') {
    return (
      <div className={`inline-flex items-center ${className}`} style={{ userSelect: 'none' }}>
        <img
          src="/images/eidula-app-icon.png"
          alt="Eidula App Icon"
          style={{
            height: `${current.emblemHeight}px`,
            width: `${current.emblemHeight}px`,
            borderRadius: `${Math.round(current.emblemHeight * 0.22)}px`,
            objectFit: 'cover',
            display: 'block',
            boxShadow: '0 4px 12px rgba(10, 25, 47, 0.25)'
          }}
        />
      </div>
    );
  }

  // Full banner logo
  if (variant === 'full') {
    return (
      <div className={`inline-flex items-center ${className}`} style={{ userSelect: 'none' }}>
        <img
          src={fullLogoImg}
          alt="Eidula Logo"
          style={{
            height: `${current.emblemHeight + 8}px`,
            width: 'auto',
            objectFit: 'contain',
            display: 'block'
          }}
        />
      </div>
    );
  }

  // Wordmark only
  if (variant === 'wordmark') {
    return (
      <div className={`inline-flex flex-col ${className}`} style={{ userSelect: 'none' }}>
        <img
          src={wordmarkNavyImg}
          alt="Eidula"
          className="eidula-wordmark-navy"
          style={{
            height: `${current.wordmarkHeight}px`,
            width: 'auto',
            objectFit: 'contain',
            display: light ? 'none' : 'block'
          }}
        />
        <img
          src={wordmarkWhiteImg}
          alt="Eidula"
          className="eidula-wordmark-white"
          style={{
            height: `${current.wordmarkHeight}px`,
            width: 'auto',
            objectFit: 'contain',
            display: light ? 'block' : 'none'
          }}
        />
      </div>
    );
  }

  // Default: Compact layout (Emblem + Wordmark + Tagline)
  return (
    <div
      className={`eidula-brand-logo inline-flex items-center ${light ? 'eidula-logo-light' : ''} ${className}`}
      style={{
        gap: current.gap,
        userSelect: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle'
      }}
    >
      {/* 3D Master Emblem (Navy + Gold + Emerald) */}
      <img
        src={emblemImg}
        alt="Eidula Emblem"
        style={{
          height: `${current.emblemHeight}px`,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          flexShrink: 0,
          filter: 'drop-shadow(0 2px 5px rgba(10, 25, 47, 0.18))'
        }}
      />

      {/* Brand Typography & Tagline */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, justifyContent: 'center', alignItems: 'flex-start', textAlign: 'left' }}>
        {/* Navy Wordmark (displayed on light backgrounds) */}
        <img
          src={wordmarkNavyImg}
          alt="Eidula"
          className="eidula-wordmark-navy"
          style={{
            height: `${current.wordmarkHeight}px`,
            width: 'auto',
            objectFit: 'contain',
            display: light ? 'none' : 'block'
          }}
        />

        {/* White Wordmark (displayed on dark backgrounds / when light={true}) */}
        <img
          src={wordmarkWhiteImg}
          alt="Eidula"
          className="eidula-wordmark-white"
          style={{
            height: `${current.wordmarkHeight}px`,
            width: 'auto',
            objectFit: 'contain',
            display: light ? 'block' : 'none'
          }}
        />

        {/* Official Tagline */}
        {showTagline && (
          <div
            className="eidula-tagline"
            style={{
              fontSize: current.tagSize,
              color: light ? 'rgba(255, 255, 255, 0.88)' : '#0b1e36',
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              letterSpacing: current.letterSpacing,
              textTransform: 'uppercase',
              marginTop: current.tagMarginTop,
              whiteSpace: 'nowrap',
              lineHeight: 1.15,
              textAlign: 'left'
            }}
          >
            {tagline}
          </div>
        )}
      </div>
    </div>
  );
};

export default EidulaLogo;
