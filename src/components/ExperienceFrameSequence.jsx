'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

/* ── Frame config — adjust these two lines to match your real files ── */
const FRAME_COUNT = 150;
const framePath = i => `/character/ezgif-frame-${String(i).padStart(3, '0')}.jpg`; // ezgif-frame-001.jpg … ezgif-frame-150.jpg

/**
 * ExperienceFrameSequence
 * ────────────────────────────────────────────────────────────────────────
 * Canvas-based scroll-scrubbed image sequence for the Experience section
 * background. Renders ONE <canvas>, not 150 <img> elements.
 *
 * Owns no scroll/ScrollTrigger logic itself — the parent (Experience.jsx)
 * calls `ref.current.setProgress(p)` from inside its EXISTING onUpdate
 * callback, using the same progress value that already drives the
 * horizontal panel scroll.
 */
export const ExperienceFrameSequence = forwardRef(function ExperienceFrameSequence(_props, ref) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const loadedRef = useRef(new Set());
  const lastDrawnIndexRef = useRef(-1);
  const lastGoodIndexRef = useRef(0);

  const drawIndex = idx => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imagesRef.current[idx];
    if (!img || !img.complete || !img.naturalWidth) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih); // "cover"
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);

    lastDrawnIndexRef.current = idx;
    loadedRef.current.add(idx);
    lastGoodIndexRef.current = idx;
  };

  useImperativeHandle(ref, () => ({
    setProgress(p) {
      const clamped = Math.min(1, Math.max(0, p));
      const idx = Math.min(FRAME_COUNT - 1, Math.round(clamped * (FRAME_COUNT - 1)));
      if (idx === lastDrawnIndexRef.current) return;

      if (loadedRef.current.has(idx)) {
        drawIndex(idx);
      } else {
        drawIndex(lastGoodIndexRef.current);
      }
    }
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      if (lastDrawnIndexRef.current >= 0) drawIndex(lastDrawnIndexRef.current);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 1024) return;

    let cancelled = false;
    const images = new Array(FRAME_COUNT);
    const loadedIndices = loadedRef.current;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.decoding = 'async';
      img.onload = () => {
        if (cancelled) return;
        loadedRef.current.add(i);
        if (i === 0) drawIndex(0);
      };
      img.src = framePath(i + 1);
      images[i] = img;
    }

    imagesRef.current = images;

    return () => {
      cancelled = true;
      imagesRef.current.forEach(img => {
        img.onload = null;
        img.src = '';
      });
      imagesRef.current = [];
      loadedIndices.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="exp-frame-stage absolute inset-0 z-[5] pointer-events-none hidden lg:block overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
});