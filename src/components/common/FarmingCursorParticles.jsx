import React, { useEffect, useRef, useState } from 'react';

const MAX_PARTICLES = 24; // Hard ceiling to prevent any memory or frame drops
const particleEmojis = ['🍃', '🌱', '🌸', '🌾', '🌼'];

const FarmingCursorParticles = () => {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    let lastMoveTime = 0;
    let lastPos = { x: -100, y: -100 };
    let animationFrameId;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Optimized Particle Object
    const createParticle = (x, y, isClick) => {
      const angle = isClick ? Math.random() * Math.PI * 2 : (Math.random() - 0.5) * 1.2 - Math.PI / 2;
      const speed = isClick ? Math.random() * 3 + 1.5 : Math.random() * 1.2 + 0.5;

      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: isClick ? 0.08 : -0.02,
        emoji: particleEmojis[Math.floor(Math.random() * particleEmojis.length)],
        size: isClick ? Math.random() * 6 + 14 : Math.random() * 4 + 10,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.1,
        life: 1.0,
        decay: isClick ? 0.045 : 0.035 // Fades out in < 0.4s to maintain 60fps
      };
    };

    // Smooth Cursor Position update (hardware CSS transform)
    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check if hovering clickable elements
      const target = e.target;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.closest('button') ||
          target.closest('a') ||
          target.onclick ||
          target.getAttribute('role') === 'button')
      ) {
        setIsHoveringClickable(true);
      } else {
        setIsHoveringClickable(false);
      }

      // Throttle movement particles (min 60ms between spawns)
      const now = performance.now();
      const dist = Math.hypot(mouseX - lastPos.x, mouseY - lastPos.y);

      if (now - lastMoveTime > 65 && dist > 20) {
        lastMoveTime = now;
        lastPos = { x: mouseX, y: mouseY };

        if (particles.length >= MAX_PARTICLES) {
          particles.shift(); // Evict oldest immediately
        }
        particles.push(createParticle(mouseX, mouseY, false));
      }
    };

    // Rapid-click friendly burst (capped to 4 lightweight particles)
    const handleMouseDownEvent = (e) => {
      setIsMouseDown(true);
      const burstCount = 4;
      for (let i = 0; i < burstCount; i++) {
        if (particles.length >= MAX_PARTICLES) {
          particles.shift();
        }
        particles.push(createParticle(e.clientX, e.clientY, true));
      }
    };

    const handleMouseUpEvent = () => {
      setIsMouseDown(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDownEvent, { passive: true });
    window.addEventListener('mouseup', handleMouseUpEvent, { passive: true });

    // High performance render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vRot;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.life;
          ctx.font = `${p.size}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.emoji, 0, 0);
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDownEvent);
      window.removeEventListener('mouseup', handleMouseUpEvent);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 99998
        }}
      />

      {/* Bespoke Agricultural Sprout / Golden Wheat Custom Cursor */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          transform: 'translate3d(-100px, -100px, 0)'
        }}
      >
        <div
          style={{
            position: 'relative',
            transform: `translate(-6px, -4px) ${
              isHoveringClickable
                ? 'scale(1.3)'
                : isMouseDown
                ? 'scale(0.85)'
                : 'scale(1)'
            }`,
            transformOrigin: '6px 4px',
            transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Custom Styled Agricultural SVG Pointer (Emerald Sprout + Gold Core) */}
          <svg
            width="30"
            height="30"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: isHoveringClickable
                ? 'drop-shadow(0 0 8px #34d399) drop-shadow(0 2px 5px rgba(0,0,0,0.4))'
                : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
          >
            {/* Main Sprout Blade */}
            <path
              d="M6 4C6 4 10 12 18 14C24 15.5 28 12 28 12C28 12 26 22 17 24C10 25.5 6 20 6 20L6 4Z"
              fill={isHoveringClickable ? '#10b981' : '#166534'}
              stroke="#ffffff"
              strokeWidth="1.75"
            />
            {/* Center Golden Vein */}
            <path
              d="M6 4C11 11 16 16 26 19"
              stroke="#fef08a"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Sparkle / Sprout Bud */}
            <circle cx="6" cy="4" r="2.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default FarmingCursorParticles;
