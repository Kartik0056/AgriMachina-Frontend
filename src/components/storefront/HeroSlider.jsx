import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { useLiveRefresh } from '../../context/SyncContext';

const FALLBACK_SLIDES = [
  {
    _id: 'pure-indian-spices-collection',
    title: 'Royal Malabar & Kashmiri Gourmet Spices',
    tagline: '100% pure organic whole spices, royal biryani masale, and fresh high-curcumin Lakadong turmeric.',
    badge: '🌶️ 100% PURE & ORGANIC • CERTIFIED QUALITY',
    category: 'Spices & Masale',
    productImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1920&q=85',
    ctaText: 'Explore Spices Collection',
    ctaLink: '/products?category=Spices+%26+Masale'
  },
  {
    _id: 'ultrasound-pro-wireless-earbuds',
    title: 'UltraSound Pro Wireless ANC Earbuds',
    tagline: 'Hybrid 42dB Active Noise Cancellation, 48-hour ultra endurance, and custom bass boost acoustic drivers.',
    badge: '⚡ PREMIUM AUDIO • SMART TECH',
    category: 'Electronics & Smart Tech',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&q=85',
    ctaText: 'Discover Tech Deals',
    ctaLink: '/products?category=Electronics+%26+Smart+Tech'
  },
  {
    _id: 'bohemian-ceramic-ambient-lamp',
    title: 'Artisan Handcrafted Ceramic Ambient Lamp',
    tagline: 'Warm textured stoneware ceramic base with woven natural linen shade for cozy modern living spaces.',
    badge: '🏺 ARTISAN HANDCRAFTED LUXURY',
    category: 'Home Decor & Living',
    productImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1920&q=85',
    ctaText: 'Explore Home Decor',
    ctaLink: '/products?category=Home+Decor+%26+Living'
  },
  {
    _id: 'heavy-duty-mixer-grinder-1000w',
    title: 'Heavy-Duty 1000W Pure Copper Mixer Grinder',
    tagline: 'Commercial-grade 100% copper motor with multi-utility leakproof stainless steel jars for fine grinding.',
    badge: '🍳 BESTSELLER • 5-YEAR WARRANTY',
    category: 'Kitchen & Home Appliances',
    productImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1920&q=85',
    ctaText: 'Shop Kitchen Appliances',
    ctaLink: '/products?category=Kitchen+%26+Home+Appliances'
  }
];

const HeroSlider = () => {
  const { t, tr } = useLanguage();
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const sliderContainerRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const bgImgRef = useRef(null);
  const progressBarRef = useRef(null);

  const fetchDynamicSlides = async () => {
    try {
      const res = await api.get('/banners');
      if (res.data.success && res.data.slides && res.data.slides.length > 0) {
        setSlides(res.data.slides);
      }
    } catch {
      // Keep fallback slides
    }
  };

  useEffect(() => {
    fetchDynamicSlides();
  }, []);

  useLiveRefresh(() => {
    fetchDynamicSlides();
  }, ['BANNER_CHANGED', 'CATALOG_CHANGED']);

  const slide = slides[currentSlide] || slides[0] || FALLBACK_SLIDES[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background Image Subtle Ken-Burns Zoom
      if (bgImgRef.current) {
        gsap.fromTo(
          bgImgRef.current,
          { scale: 1.08, opacity: 0.8 },
          { scale: 1.0, opacity: 1, duration: 5.5, ease: 'power1.out' }
        );
      }

      // Badge Animation
      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { y: -18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
        );
      }

      // Title Animation
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', delay: 0.08 }
        );
      }

      // Subtitle / Tagline Animation
      if (descRef.current) {
        gsap.fromTo(
          descRef.current,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.16 }
        );
      }

      // CTA Button Animation
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 18, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out', delay: 0.24 }
        );
      }

      // Auto-progress bar
      if (progressBarRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { width: '0%' },
          { width: '100%', duration: 6.0, ease: 'none' }
        );
      }
    }, sliderContainerRef);

    return () => ctx.revert();
  }, [currentSlide, slides]);

  useEffect(() => {
    if (isPaused) {
      if (progressBarRef.current) gsap.killTweensOf(progressBarRef.current);
      return;
    }
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const slideTitle = slide.title || slide.name || '';
  const slideDesc = slide.tagline || slide.shortDesc || '';
  const slideImage = slide.productImage || slide.bgImage || slide.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1920&q=85';
  const targetLink = slide.ctaLink || (slide.productSlug ? `/product/${slide.productSlug}` : '/products');

  return (
    <div
      ref={sliderContainerRef}
      className="hero-slider-section hero-banner"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '380px',
        maxHeight: '460px',
        height: '42vw',
        overflow: 'hidden',
        background: '#04160e'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Full Background Image */}
      <img
        ref={bgImgRef}
        key={currentSlide}
        src={slideImage}
        alt={slideTitle}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Modern Gradient Overlay for 100% Readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(2, 18, 10, 0.94) 0%, rgba(2, 18, 10, 0.78) 46%, rgba(2, 18, 10, 0.42) 78%, rgba(2, 18, 10, 0.2) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* Decorative Accent Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(22, 163, 74, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />

      {/* Slide Text Content Container */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          maxWidth: '1280px',
          margin: '0 auto'
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          {/* Category / Offer Badge */}
          <div ref={badgeRef} style={{ marginBottom: '0.85rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(245, 158, 11, 0.18)',
                color: '#fef08a',
                border: '1px solid rgba(245, 158, 11, 0.45)',
                fontWeight: 800,
                fontSize: '0.75rem',
                padding: '0.3rem 0.85rem',
                borderRadius: '999px',
                letterSpacing: '0.04em',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)'
              }}
            >
              <Sparkles size={13} color="#f59e0b" />
              <span>{slide.badge || '🔥 FEATURED COLLECTION'}</span>
            </span>
          </div>

          {/* Headline Title */}
          <h1
            ref={titleRef}
            style={{
              fontSize: 'clamp(1.15rem, 1.8vw, 1.45rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.25,
              marginBottom: '0.45rem',
              letterSpacing: '-0.015em',
              fontFamily: 'var(--font-heading)',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.55)'
            }}
          >
            {tr(slideTitle)}
          </h1>

          {/* Subtitle / Tagline */}
          {slideDesc && (
            <p
              ref={descRef}
              style={{
                fontSize: 'clamp(0.75rem, 0.9vw, 0.85rem)',
                color: 'rgba(255, 255, 255, 0.88)',
                lineHeight: 1.5,
                marginBottom: '1.15rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textShadow: '0 2px 6px rgba(0, 0, 0, 0.45)'
              }}
            >
              {tr(slideDesc)}
            </p>
          )}

          {/* Action CTA Button */}
          <div ref={ctaRef} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to={targetLink}
              style={{
                padding: '0.7rem 1.6rem',
                fontSize: '0.925rem',
                fontWeight: 800,
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)',
                border: 'none',
                textDecoration: 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="hover:scale-105 active:scale-95"
            >
              <span>{t('explore_collection', slide.ctaText || 'Explore Collection')}</span>
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/products"
              style={{
                padding: '0.7rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 700,
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              className="hover:bg-white/20 active:scale-95"
            >
              <span>View All</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sleek Floating Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            title="Previous Slide"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.15s ease'
            }}
            className="hover:scale-110 active:scale-95 hover:bg-black/70"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={handleNext}
            title="Next Slide"
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.15s ease'
            }}
            className="hover:scale-110 active:scale-95 hover:bg-black/70"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Minimalist Dot Indicators */}
      {slides.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            zIndex: 20
          }}
        >
          {slides.map((_, idx) => {
            const isActive = currentSlide === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: isActive ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '999px',
                  background: isActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      )}

      {/* Ultra-Thin Progress Bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.12)', zIndex: 25 }}>
        <div ref={progressBarRef} style={{ height: '100%', width: '0%', background: '#f59e0b' }} />
      </div>
    </div>
  );
};

export default HeroSlider;
