'use client';

import { useEffect, useRef } from 'react';

export default function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // captured as non-null for use inside closures
    const c: HTMLCanvasElement = canvas;
    const cx: CanvasRenderingContext2D = ctx;

    let rafId: number;
    let mouse = { x: -9999, y: -9999 };

    const COUNT = 80;
    const LINK_DIST = 150;
    const MOUSE_ATTRACT_DIST = 120;
    const MOUSE_ATTRACT_FORCE = 0.012;
    const DOT_COLOR = '#F97316';

    type Dot = {
      x: number; y: number;
      vx: number; vy: number;
      r: number; opacity: number;
    };

    let dots: Dot[] = [];

    function resize() {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    }

    function init() {
      resize();
      dots = Array.from({ length: COUNT }, () => ({
        x: Math.random() * c.width,
        y: Math.random() * c.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: 1 + Math.random() * 1.5,
        opacity: 0.15 + Math.random() * 0.25,
      }));
    }

    function draw() {
      cx.clearRect(0, 0, c.width, c.height);

      // update positions
      for (const d of dots) {
        // mouse attraction
        const dx = mouse.x - d.x;
        const dy = mouse.y - d.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_ATTRACT_DIST && dist > 0) {
          const force = (1 - dist / MOUSE_ATTRACT_DIST) * MOUSE_ATTRACT_FORCE;
          d.vx += dx * force;
          d.vy += dy * force;
        }

        // dampen velocity
        d.vx *= 0.995;
        d.vy *= 0.995;

        d.x += d.vx;
        d.y += d.vy;

        // bounce off edges
        if (d.x < 0) { d.x = 0; d.vx *= -1; }
        if (d.x > c.width) { d.x = c.width; d.vx *= -1; }
        if (d.y < 0) { d.y = 0; d.vy *= -1; }
        if (d.y > c.height) { d.y = c.height; d.vy *= -1; }
      }

      // draw links
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            cx.beginPath();
            cx.moveTo(dots[i].x, dots[i].y);
            cx.lineTo(dots[j].x, dots[j].y);
            cx.strokeStyle = `rgba(249,115,22,${0.15 * (1 - dist / LINK_DIST)})`;
            cx.lineWidth = 1;
            cx.stroke();
          }
        }
      }

      // draw dots
      for (const d of dots) {
        cx.beginPath();
        cx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        cx.fillStyle = DOT_COLOR;
        cx.globalAlpha = d.opacity;
        cx.fill();
      }
      cx.globalAlpha = 1;

      rafId = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function onResize() {
      resize();
    }

    init();
    draw();
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    />
  );
}
