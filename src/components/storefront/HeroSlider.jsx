import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Flame,
  PhoneCall,
  Sparkles,
  CheckCircle2,
  Timer,
  Tractor,
  Play,
  X
} from 'lucide-react';
import api from '../../services/api';
import { formatINR } from '../../services/emiHelper';
import { useLanguage } from '../../context/LanguageContext';
import { useLiveRefresh } from '../../context/SyncContext';
import { getYouTubeEmbedUrl, isDirectVideoUrl } from '../../services/videoHelper';
import EMICalculatorModal from './EMICalculatorModal';

const FALLBACK_SLIDES = [
  {
    _id: 'power-weeder-7hp',
    title: 'Power Weeder 7HP Petrol 4-Stroke (AV-708)',
    tagline: 'High-torque 208cc power weeder engineered for deep inter-row soil cultivation across tough clay, cotton, and sugarcane fields.',
    badge: '🔥 DEAL OF THE DAY • 20% OFF',
    category: 'Power Weeder & Tiller',
    bgImage: '/images/machinery/power_weeder.jpg',
    productImage: '/images/machinery/power_weeder.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    specs: [
      '208cc 4-Stroke OHV Engine',
      '900mm Adjustable Tilling Width',
      '32 Heat-Treated Boron Blades',
      '2 Forward + 1 Reverse Gearbox'
    ],
    price: 38499,
    mrp: 48500,
    discountPercent: 20,
    monthlyEmi: 1171,
    productSlug: 'power-weeder-7hp-petrol-av-708',
    ctaText: 'Explore Full Machine Details',
    ctaLink: '/product/power-weeder-7hp-petrol-av-708'
  },
  {
    _id: 'solar-pump-5hp',
    title: '5HP Solar Submersible Pump Set (DC Brushless)',
    tagline: 'Heavy-duty stainless steel solar pump set with smart MPPT controller for reliable, uninterrupted farm canal and borewell irrigation.',
    badge: '☀️ 100% SOLAR • ZERO ELECTRICITY BILL',
    category: 'Pumps & Irrigation',
    bgImage: '/images/machinery/solar_pump.jpg',
    productImage: '/images/machinery/solar_pump.jpg',
    videoUrl: '',
    specs: [
      '35,000 Liters/Hour Discharge',
      'Up to 120 Meters Head Depth',
      'IP68 Stainless Steel Body',
      'Smart MPPT Solar Tracking'
    ],
    price: 74999,
    mrp: 89999,
    discountPercent: 17,
    monthlyEmi: 2280,
    productSlug: '5hp-solar-submersible-pump-set',
    ctaText: 'Explore Full Machine Details',
    ctaLink: '/product/5hp-solar-submersible-pump-set'
  },
  {
    _id: 'rotavator-6ft',
    title: 'Heavy-Duty 6-Foot Rotavator (Multi-Speed)',
    tagline: 'Dual-speed heavy tractor rotavator for single-pass seedbed preparation in wet puddle and hard dry soil.',
    badge: '⚙️ TRACTOR PTO • MULTI-SPEED GEARBOX',
    category: 'Accessories & Attachment',
    bgImage: '/images/machinery/rotavator.jpg',
    productImage: '/images/machinery/rotavator.jpg',
    videoUrl: '',
    specs: [
      '48 Boron Steel L-Type Blades',
      'Multi-Speed Heavy Cast Iron Gearbox',
      '35 - 55 HP Tractor Compatible',
      'Depth Control Side Skids'
    ],
    price: 94500,
    mrp: 112000,
    discountPercent: 16,
    monthlyEmi: 2875,
    productSlug: 'heavy-duty-6-foot-rotavator',
    ctaText: 'Explore Full Machine Details',
    ctaLink: '/product/heavy-duty-6-foot-rotavator'
  }
];

const HeroSlider = () => {
  const { t, tr } = useLanguage();
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedEmiProduct, setSelectedEmiProduct] = useState(null);
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  // Live Deal Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 42, seconds: 18 });

  // DOM Refs for GSAP
  const sliderContainerRef = useRef(null);
  const bgImageRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const priceCardRef = useRef(null);
  const progressBarRef = useRef(null);

  const fetchDynamicSlides = async () => {
    try {
      const res = await api.get('/banners');
      if (res.data.success && res.data.slides && res.data.slides.length > 0) {
        setSlides(res.data.slides);
      }
    } catch (err) {
      console.error('Failed to load dynamic hero banners', err);
    }
  };

  useEffect(() => {
    fetchDynamicSlides();
  }, []);

  // Listen for real-time banner update events from Admin
  useLiveRefresh(() => {
    fetchDynamicSlides();
  }, ['BANNER_CHANGED', 'CATALOG_CHANGED']);

  const slide = slides[currentSlide] || slides[0] || FALLBACK_SLIDES[0];

  // Deal Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // GSAP Entrance Animations triggered on currentSlide change
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Background image zoom & fade
      if (bgImageRef.current) {
        gsap.fromTo(
          bgImageRef.current,
          { scale: 1.12, opacity: 0.7 },
          { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' }
        );
      }

      // 2. Badge pop
      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.7)' }
        );
      }

      // 3. Title slide up
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', delay: 0.1 }
        );
      }

      // 4. Description slide up
      if (descRef.current) {
        gsap.fromTo(
          descRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out', delay: 0.2 }
        );
      }

      // 5. Spec chips stagger
      gsap.fromTo(
        '.gsap-spec-chip',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.45, ease: 'power2.out', delay: 0.25 }
      );

      // 6. Price card entrance
      if (priceCardRef.current) {
        gsap.fromTo(
          priceCardRef.current,
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.3 }
        );
      }

      // 7. Buttons stagger
      gsap.fromTo(
        '.gsap-hero-btn',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.45, ease: 'power2.out', delay: 0.35 }
      );

      // 8. Progress Bar animation for current slide duration (6000ms)
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

  // Continuous Auto-Slide Interval
  useEffect(() => {
    if (isPaused || activeVideoModal) {
      if (progressBarRef.current) gsap.killTweensOf(progressBarRef.current);
      return;
    }
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length, activeVideoModal]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleOpenEmi = (slideData) => {
    setSelectedEmiProduct(slideData);
    setIsEmiModalOpen(true);
  };

  const slideTitle = slide.title || slide.name || '';
  const slideDesc = slide.tagline || slide.shortDesc || '';
  const slideSpecs = slide.specs || [];
  const slideImage = slide.bgImage || slide.productImage || slide.image || '/images/machinery/power_weeder.jpg';
  const targetLink = slide.ctaLink || (slide.productSlug ? `/product/${slide.productSlug}` : '/products');

  return (
    <div
      ref={sliderContainerRef}
      style={{ position: 'relative', width: '100%', overflow: 'hidden', backgroundColor: '#062416' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Layer with Gradient Overlay */}
      <div
        ref={bgImageRef}
        style={{
          position: 'relative',
          minHeight: '640px',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `url(${slideImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform, opacity'
        }}
      >
        {/* Dark Cinematic Gradient Overlay for crisp text legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(6, 36, 22, 0.96) 0%, rgba(6, 36, 22, 0.88) 48%, rgba(6, 36, 22, 0.45) 80%, rgba(0, 0, 0, 0.25) 100%)',
            backdropFilter: 'blur(1px)'
          }}
        />

        {/* Content Container Layer */}
        <div className="container" style={{ position: 'relative', zIndex: 10, padding: '3.5rem 1.25rem 7.5rem 1.25rem' }}>
          <div style={{ maxWidth: '680px' }}>
            {/* Top Deal & Countdown Badge */}
            <div ref={badgeRef} className="flex items-center gap-2" style={{ marginBottom: '0.85rem', flexWrap: 'wrap' }}>
              <span
                className="badge"
                style={{
                  background: '#f59e0b',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.75rem',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
                }}
              >
                {slide.badge || '🔥 FEATURED MACHINERY'}
              </span>

              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.65)',
                  backdropFilter: 'blur(6px)',
                  color: '#fef08a',
                  border: '1px solid rgba(254, 240, 138, 0.4)',
                  borderRadius: '999px',
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Timer size={13} color="#f59e0b" />
                <span>
                  {t('deal_ends_in', 'Ends in')} {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            {/* Title */}
            <h1
              ref={titleRef}
              style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: '0.85rem',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 12px rgba(0,0,0,0.6)'
              }}
            >
              {tr(slideTitle)}
            </h1>

            {/* Short Description */}
            {slideDesc && (
              <p
                ref={descRef}
                style={{
                  fontSize: '1.05rem',
                  color: '#dcfce7',
                  lineHeight: 1.55,
                  marginBottom: '1.25rem',
                  textShadow: '0 1px 4px rgba(0,0,0,0.4)'
                }}
              >
                {tr(slideDesc)}
              </p>
            )}

            {/* Key Spec Chips Layer */}
            {slideSpecs.length > 0 && (
              <div className="flex flex-wrap gap-2" style={{ marginBottom: '1.35rem' }}>
                {slideSpecs.map((spec, idx) => (
                  <span
                    key={idx}
                    className="gsap-spec-chip"
                    style={{
                      background: 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <CheckCircle2 size={13} color="#86efac" />
                    <span>{tr(spec)}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Pricing & Razorpay EMI Layer */}
            {slide.price > 0 && (
              <div
                ref={priceCardRef}
                style={{
                  background: 'rgba(0, 0, 0, 0.55)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '14px',
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1.5rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 700 }}>
                    {t('special_farm_price', 'Special Direct Farm Price')}
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: '#fef08a' }}>
                      {formatINR(slide.price)}
                    </span>
                    {slide.mrp > slide.price && (
                      <span style={{ fontSize: '1.05rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                        {formatINR(slide.mrp)}
                      </span>
                    )}
                    {slide.discountPercent > 0 && (
                      <span className="badge badge-accent" style={{ background: '#f59e0b', color: '#ffffff', fontSize: '0.75rem' }}>
                        {t('save', 'Save')} {slide.discountPercent}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Razorpay EMI Callout */}
                {slide.monthlyEmi > 0 && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#86efac', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                      <Sparkles size={13} color="#f59e0b" />
                      <span>{t('no_cost_emi_badge', '0% No-Cost EMI via Razorpay')}</span>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                      {t('monthly_emi_text', 'EMI from')} <span style={{ color: '#86efac' }}>{formatINR(slide.monthlyEmi)}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#dcfce7' }}>/mo</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link to={targetLink} className="btn btn-accent btn-lg gsap-hero-btn">
                <span>{t('explore_machine', slide.ctaText || 'Explore Full Machine Details')}</span>
                <ArrowRight size={18} />
              </Link>

              {/* Video Demo Button if video URL exists */}
              {slide.videoUrl && (
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(slide.videoUrl)}
                  className="btn btn-lg gsap-hero-btn"
                  style={{
                    background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                    borderColor: '#38bdf8',
                    color: '#ffffff',
                    fontWeight: 800,
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                  }}
                  title="Watch Field Working Video"
                >
                  <Play size={18} fill="#ffffff" />
                  <span>{t('watch_video_demo', 'Watch Video Demo')}</span>
                </button>
              )}

              {slide.price > 0 && (
                <button
                  type="button"
                  onClick={() => handleOpenEmi(slide)}
                  className="btn btn-secondary btn-lg gsap-hero-btn"
                  style={{ background: 'rgba(255, 255, 255, 0.95)', color: '#062416', fontWeight: 700 }}
                >
                  <CreditCard size={18} color="#166534" />
                  <span>{t('view_emi_plans_btn', 'View Bank EMI Plans')}</span>
                </button>
              )}

              <a
                href={`https://wa.me/919027799171?text=${encodeURIComponent(
                  `Namaste AgriMachina! 🙏\nI am interested in ${slideTitle}.\n💰 Price: ${slide.price ? formatINR(slide.price) : 'Inquiry'}\n🔗 Product Link: ${window.location.origin}${targetLink}\n\nPlease share video demonstration and field advice!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-dark btn-lg gsap-hero-btn"
                style={{ background: 'rgba(7, 94, 84, 0.85)', borderColor: '#075e54', color: '#ffffff' }}
              >
                <PhoneCall size={18} color="#86efac" />
                <span>{t('agronomy_advice', 'Agronomy Advice')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrow Controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            title="Previous Machine"
            style={{
              position: 'absolute',
              left: '15px',
              top: '45%',
              transform: 'translateY(-50%)',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(4px)'
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            title="Next Machine"
            style={{
              position: 'absolute',
              right: '15px',
              top: '45%',
              transform: 'translateY(-50%)',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 20,
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(4px)'
            }}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* GSAP Animated Progress Bar */}
      <div style={{ position: 'absolute', bottom: '66px', left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.15)', zIndex: 25 }}>
        <div ref={progressBarRef} style={{ height: '100%', width: '0%', background: '#86efac' }} />
      </div>

      {/* Bottom Thumbnail Selector Bar */}
      {slides.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(6, 36, 22, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '0.65rem 1.25rem',
            zIndex: 20,
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="container flex items-center justify-between gap-3 overflow-x-auto">
            {slides.map((s, idx) => {
              const isActive = currentSlide === idx;
              const sTitle = s.title || s.name || '';
              const sImg = s.bgImage || s.productImage || s.image || '/images/machinery/power_weeder.jpg';
              return (
                <button
                  key={s._id || idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    background: isActive ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                    border: isActive ? '2px solid #86efac' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '0.35rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    cursor: 'pointer',
                    flex: 1,
                    minWidth: '180px',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img
                    src={sImg}
                    alt=""
                    style={{ width: '38px', height: '38px', objectFit: 'contain', background: '#ffffff', borderRadius: '6px', padding: '2px' }}
                  />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: isActive ? '#86efac' : '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sTitle}
                    </div>
                    {s.price > 0 && (
                      <div style={{ fontSize: '0.7rem', color: isActive ? '#fef08a' : '#94a3b8' }}>
                        {formatINR(s.price)} {s.monthlyEmi > 0 ? `• ${formatINR(s.monthlyEmi)}/mo` : ''}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Video Demonstration Modal (via React Portal) */}
      {activeVideoModal && createPortal(
        <div
          onClick={() => setActiveVideoModal(null)}
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
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '850px',
              background: '#000000',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
            }}
          >
            <div style={{ padding: '0.85rem 1.25rem', background: '#0b1324', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' }}>
              <div style={{ color: '#ffffff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                <Play size={17} color="#f59e0b" fill="#f59e0b" />
                <span>Customer Farm Demonstration Video</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ width: '100%', height: '460px' }}>
              {isDirectVideoUrl(activeVideoModal) ? (
                <video src={activeVideoModal} controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : getYouTubeEmbedUrl(activeVideoModal) ? (
                <iframe
                  src={`${getYouTubeEmbedUrl(activeVideoModal)}?autoplay=1`}
                  title="Field Video Demo"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div style={{ padding: '4rem', textAlign: 'center', color: '#ffffff' }}>
                  Video could not be loaded. Please check URL.
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* EMI Calculator Modal */}
      {selectedEmiProduct && (
        <EMICalculatorModal
          isOpen={isEmiModalOpen}
          onClose={() => setIsEmiModalOpen(false)}
          productPrice={selectedEmiProduct.price}
          emiConfig={{
            minMonthlyEmi: selectedEmiProduct.monthlyEmi,
            interestRate: 13.5
          }}
        />
      )}
    </div>
  );
};

export default HeroSlider;
