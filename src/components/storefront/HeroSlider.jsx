import React, { useState, useEffect, useRef } from 'react';
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
  Tractor
} from 'lucide-react';
import { formatINR } from '../../services/emiHelper';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import EMICalculatorModal from './EMICalculatorModal';

const slides = [
  {
    id: 'power-weeder-7hp',
    slug: 'power-weeder-7hp-petrol-av-708',
    category: 'Power Weeder & Tiller',
    badge: '🔥 DEAL OF THE DAY • 20% OFF',
    name: 'Power Weeder 7HP Petrol 4-Stroke (AV-708)',
    shortDesc: 'High-torque 208cc power weeder engineered for deep inter-row soil cultivation across tough clay, cotton, and sugarcane fields.',
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
    image: '/images/machinery/power_weeder.jpg'
  },
  {
    id: 'solar-pump-5hp',
    slug: '5hp-solar-submersible-pump-set',
    category: 'Pumps & Irrigation',
    badge: '☀️ 100% SOLAR • ZERO ELECTRICITY BILL',
    name: '5HP Solar Submersible Pump Set (DC Brushless)',
    shortDesc: 'Heavy-duty stainless steel solar pump set with smart MPPT controller for reliable, uninterrupted farm canal and borewell irrigation.',
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
    image: '/images/machinery/solar_pump.jpg'
  },
  {
    id: 'rotavator-6ft',
    slug: 'heavy-duty-6-foot-rotavator',
    category: 'Accessories & Attachment',
    badge: '⚙️ TRACTOR PTO • MULTI-SPEED GEARBOX',
    name: 'Heavy-Duty 6-Foot Rotavator (Multi-Speed)',
    shortDesc: 'Dual-speed heavy tractor rotavator for single-pass seedbed preparation in wet puddle and hard dry soil.',
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
    image: '/images/machinery/rotavator.jpg'
  },
  {
    id: 'brush-cutter-50cc',
    slug: '50cc-multi-crop-backpack-brush-cutter',
    category: 'Harvesting Machinery',
    badge: '🌾 MULTI-CROP HARVESTING • 2.2 HP 2-STROKE',
    name: '50cc Backpack Multi-Crop Brush Cutter & Harvester',
    shortDesc: 'Harvest paddy, wheat, sugarcane, fodder grass, and dense thicket shrubs effortlessly with multi-blade attachments.',
    specs: [
      '50cc 2.2 HP High-Torque Engine',
      'Backpack Shock-Absorbing Frame',
      '80-Teeth Alloy Crop Harvester',
      'Tap & Go Nylon Trimmer Head'
    ],
    price: 23999,
    mrp: 28500,
    discountPercent: 16,
    monthlyEmi: 1027,
    image: '/images/machinery/brush_cutter.jpg'
  },
  {
    id: 'sprayer-16l',
    slug: '2-in-1-battery-cum-manual-knapsack-agriculture-sprayer-16l',
    category: 'Sprayers & Crop Protection',
    badge: '💧 BEST VALUE • DUAL MOTOR 16L',
    name: '2-in-1 Battery cum Manual Knapsack Sprayer 16L',
    shortDesc: 'High-pressure 12V rechargeable battery sprayer with telescopic brass lance for uniform pesticide & fertilizer spraying.',
    specs: [
      '12V 12Ah Rechargeable Battery',
      'Up to 8 Hours Continuous Spray',
      'Telescopic Brass Spray Wand',
      'Dual High-Pressure Motor'
    ],
    price: 3499,
    mrp: 4999,
    discountPercent: 30,
    monthlyEmi: 299,
    image: '/images/machinery/sprayer.jpg'
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedEmiProduct, setSelectedEmiProduct] = useState(null);
  const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);

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

  const slide = slides[currentSlide];

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

      // 8. Progress Bar animation for current slide duration (5500ms)
      if (progressBarRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { width: '0%' },
          { width: '100%', duration: 5.5, ease: 'none' }
        );
      }
    }, sliderContainerRef);

    return () => ctx.revert();
  }, [currentSlide]);

  // Continuous Auto-Slide Interval
  useEffect(() => {
    if (isPaused) {
      if (progressBarRef.current) gsap.killTweensOf(progressBarRef.current);
      return;
    }
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

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
          minHeight: '620px',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: `url(${slide.image})`,
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
                {slide.badge}
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
                  Ends in {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
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
              {slide.name}
            </h1>

            {/* Short Description */}
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
              {slide.shortDesc}
            </p>

            {/* Key Spec Chips Layer */}
            <div className="flex flex-wrap gap-2" style={{ marginBottom: '1.35rem' }}>
              {slide.specs.map((spec, idx) => (
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
                  <span>{spec}</span>
                </span>
              ))}
            </div>

            {/* Pricing & Razorpay EMI Layer */}
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
                  Special Direct Farm Price
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: '#fef08a' }}>
                    {formatINR(slide.price)}
                  </span>
                  <span style={{ fontSize: '1.05rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    {formatINR(slide.mrp)}
                  </span>
                  <span className="badge badge-accent" style={{ background: '#f59e0b', color: '#ffffff', fontSize: '0.75rem' }}>
                    Save {slide.discountPercent}%
                  </span>
                </div>
              </div>

              {/* Razorpay EMI Callout */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#86efac', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                  <Sparkles size={13} color="#f59e0b" />
                  <span>0% No-Cost EMI via Razorpay</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                  EMI from <span style={{ color: '#86efac' }}>{formatINR(slide.monthlyEmi)}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#dcfce7' }}>/mo</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link to={`/product/${slide.slug}`} className="btn btn-accent btn-lg gsap-hero-btn">
                <span>Explore Full Machine Details</span>
                <ArrowRight size={18} />
              </Link>

              <button
                type="button"
                onClick={() => handleOpenEmi(slide)}
                className="btn btn-secondary btn-lg gsap-hero-btn"
                style={{ background: 'rgba(255, 255, 255, 0.95)', color: '#062416', fontWeight: 700 }}
              >
                <CreditCard size={18} color="#166534" />
                <span>View Bank EMI Plans</span>
              </button>

              <a
                href={`https://wa.me/919027799171?text=${encodeURIComponent(
                  `Namaste AgriMachina! 🙏\nI am interested in ${slide.name}.\n💰 Price: ${slide.price}\n🔗 Product Link: ${window.location.origin}/product/${slide.slug}\n\nPlease share video demonstration and field advice!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-dark btn-lg gsap-hero-btn"
                style={{ background: 'rgba(7, 94, 84, 0.85)', borderColor: '#075e54', color: '#ffffff' }}
              >
                <PhoneCall size={18} color="#86efac" />
                <span>Agronomy Advice</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrow Controls */}
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

      {/* GSAP Animated Progress Bar */}
      <div style={{ position: 'absolute', bottom: '66px', left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.15)', zIndex: 25 }}>
        <div ref={progressBarRef} style={{ height: '100%', width: '0%', background: '#86efac' }} />
      </div>

      {/* Bottom Thumbnail Selector Bar (Built seamlessly into the slider) */}
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
            return (
              <button
                key={s.id}
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
                  src={s.image}
                  alt=""
                  style={{ width: '38px', height: '38px', objectFit: 'contain', background: '#ffffff', borderRadius: '6px', padding: '2px' }}
                />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: isActive ? '#86efac' : '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: isActive ? '#fef08a' : '#94a3b8' }}>
                    {formatINR(s.price)} • {formatINR(s.monthlyEmi)}/mo
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

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
