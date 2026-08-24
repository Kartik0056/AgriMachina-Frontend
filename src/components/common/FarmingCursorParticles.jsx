import React, { useEffect, useRef, useState } from 'react';

const particleEmojis = ['🍃', '🌱', '🌾', '✨', '🌼'];

const FarmingCursorParticles = () => {
  const canvasRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let lastParticleTime = 0;
    let animationFrameId;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const createParticle = (x, y, isClick = false) => {
      const angle = isClick ? Math.random() * Math.PI * 2 : (Math.random() - 0.5) * 1.5 - Math.PI / 2;
      const speed = isClick ? Math.random() * 3.5 + 2 : Math.random() * 1.2 + 0.6;

      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: isClick ? 0.08 : -0.02,
        emoji: particleEmojis[Math.floor(Math.random() * particleEmojis.length)],
        size: isClick ? Math.random() * 6 + 14 : Math.random() * 4 + 10,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.12,
        life: 1.0,
        decay: isClick ? 0.04 : 0.03
      };
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update instant precision dot immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check hovering targets
      const target = e.target;
      if (target) {
        const isInteractive =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button' ||
          target.onclick;

        const isInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable;

        setIsHovered(!!isInteractive);
        setIsTextMode(!!isInput);
      }

      // Spawn subtle trailing particles on movement
      const now = performance.now();
      if (now - lastParticleTime > 90) {
        lastParticleTime = now;
        if (particles.length < 24) {
          particles.push(createParticle(mouseX, mouseY, false));
        }
      }
    };

    const handleMouseDown = (e) => {
      setIsClicking(true);
      for (let i = 0; i < 4; i++) {
        if (particles.length < 24) {
          particles.push(createParticle(e.clientX, e.clientY, true));
        }
      }
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    // Smooth Lerp Render Loop for Fluid Magnetic Ring
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Lerp ring position with smooth trailing
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      // Render floating leaf / harvest sparkle particles
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
          ctx.globalAlpha = p.life * 0.85;
          ctx.font = `${p.size}px sans-serif`;
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
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Background Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 2147483640
        }}
      />

      {/* Instant Precision Core Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 2147483647,
          willChange: 'transform',
          transform: 'translate3d(-100px, -100px, 0)'
        }}
      >
        <div
          style={{
            width: isHovered ? '8px' : isTextMode ? '4px' : '6px',
            height: isHovered ? '8px' : isTextMode ? '14px' : '6px',
            borderRadius: isTextMode ? '2px' : '50%',
            background: isHovered
              ? '#f59e0b'
              : 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: isHovered
              ? '0 0 10px #f59e0b, 0 0 4px #ffffff'
              : '0 0 8px #10b981, 0 0 3px #ffffff',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.15s ease, height 0.15s ease, background 0.15s ease'
          }}
        />
      </div>

      {/* Smooth Magnetic Emerald Glowing Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 2147483646,
          willChange: 'transform',
          transform: 'translate3d(-100px, -100px, 0)'
        }}
      >
        <div
          style={{
            width: isHovered ? '46px' : isClicking ? '22px' : isTextMode ? '0px' : '30px',
            height: isHovered ? '46px' : isClicking ? '22px' : isTextMode ? '0px' : '30px',
            borderRadius: '50%',
            border: isHovered
              ? '1.5px solid #34d399'
              : isClicking
              ? '2px solid #f59e0b'
              : '1.5px solid rgba(16, 185, 129, 0.65)',
            background: isHovered
              ? 'rgba(16, 185, 129, 0.12)'
              : isClicking
              ? 'rgba(245, 158, 11, 0.2)'
              : 'rgba(16, 185, 129, 0.04)',
            boxShadow: isHovered
              ? '0 0 16px rgba(52, 211, 153, 0.5), inset 0 0 8px rgba(52, 211, 153, 0.3)'
              : '0 0 8px rgba(16, 185, 129, 0.2)',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), border 0.2s ease, background 0.2s ease, opacity 0.2s ease',
            opacity: isTextMode ? 0 : 1
          }}
        />
      </div>
    </>
  );
};

export default FarmingCursorParticles;
