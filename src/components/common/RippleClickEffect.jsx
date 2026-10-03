'use client';

import React, { useEffect, useRef } from 'react';

/**
 * RippleClickEffect
 * Clean, realistic water drop ripple & splash effect strictly on click (mousedown),
 * keeping cursor movement completely clean and elegant.
 */
const RippleClickEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let ripples = [];
    let droplets = [];
    let animationFrameId = null;
    let isRunning = false;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const spawnWaterDrop = (x, y) => {
      // 1. Concentric water ripple waves
      ripples.push({
        x,
        y,
        radius: 2,
        maxRadius: 65,
        speed: 3.2,
        opacity: 0.85,
        decay: 0.024,
        lineWidth: 2.5,
        color: '56, 189, 248' // Sky cyan water
      });

      setTimeout(() => {
        ripples.push({
          x,
          y,
          radius: 2,
          maxRadius: 50,
          speed: 2.6,
          opacity: 0.65,
          decay: 0.026,
          lineWidth: 1.8,
          color: '14, 165, 233' // Ocean blue
        });
      }, 70);

      setTimeout(() => {
        ripples.push({
          x,
          y,
          radius: 3,
          maxRadius: 40,
          speed: 2.0,
          opacity: 0.45,
          decay: 0.03,
          lineWidth: 1.2,
          color: '186, 230, 253' // Translucent light crest
        });
      }, 140);

      // 2. Micro water splash droplets
      const dropletCount = 6 + Math.floor(Math.random() * 4);
      for (let i = 0; i < dropletCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1.2;
        droplets.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          radius: Math.random() * 2 + 1.5,
          life: 1.0,
          decay: Math.random() * 0.03 + 0.025,
          gravity: 0.12
        });
      }

      if (!isRunning) {
        isRunning = true;
        render();
      }
    };

    const handleMouseDown = (e) => {
      spawnWaterDrop(e.clientX, e.clientY);
    };

    window.addEventListener('mousedown', handleMouseDown, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let hasActive = false;

      // Draw and update ripple waves
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.opacity -= r.decay;
        r.lineWidth = Math.max(0.5, r.lineWidth * 0.985);

        if (r.opacity <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
        } else {
          hasActive = true;
          ctx.save();
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r.color}, ${Math.max(0, r.opacity)})`;
          ctx.lineWidth = r.lineWidth;
          ctx.shadowColor = `rgba(${r.color}, 0.5)`;
          ctx.shadowBlur = 6;
          ctx.stroke();
          ctx.restore();
        }
      }

      // Draw and update splash droplets
      for (let i = droplets.length - 1; i >= 0; i--) {
        const d = droplets[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vy += d.gravity;
        d.life -= d.decay;

        if (d.life <= 0) {
          droplets.splice(i, 1);
        } else {
          hasActive = true;
          ctx.save();
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);

          const grad = ctx.createRadialGradient(
            d.x - d.radius * 0.35,
            d.y - d.radius * 0.35,
            0,
            d.x,
            d.y,
            d.radius
          );
          grad.addColorStop(0, `rgba(255, 255, 255, ${d.life * 0.95})`);
          grad.addColorStop(0.5, `rgba(56, 189, 248, ${d.life * 0.85})`);
          grad.addColorStop(1, `rgba(14, 165, 233, ${d.life * 0.4})`);

          ctx.fillStyle = grad;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
          ctx.shadowBlur = 4;
          ctx.fill();
          ctx.restore();
        }
      }

      if (hasActive) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        isRunning = false;
        ctx.clearRect(0, 0, width, height);
      }
    };

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', handleMouseDown);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 2147483647
      }}
    />
  );
};

export default RippleClickEffect;
