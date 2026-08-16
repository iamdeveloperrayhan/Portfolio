'use client';

import { useEffect, useRef } from 'react';

/* ── Frame config — must match ExperienceFrameSequence.jsx ── */
const FRAME_COUNT = 150;
const framePath = i => `/character/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;

/* Mobile uses a thinned-out subset of the real frames (every 3rd one) to
   cut data usage roughly 3x, while still stepping through the same real
   sequence — no separate asset set needed. */
const MOBILE_STEP = 3;
const mobileIndices = [];
for (let i = 1; i <= FRAME_COUNT; i += MOBILE_STEP) mobileIndices.push(i);

/**
 * ExperienceCharacterMobile
 * ────────────────────────────────────────────────────────────────────────
 * Mobile counterpart to ExperienceFrameSequence — deliberately NOT pinned
 * (scroll-hijacking is bad UX on touch) and NOT preloaded upfront (150
 * images is meaningful mobile data). Progress is derived from the
 * section's own position in the viewport as the user scrolls normally,
 * and each needed frame is fetched only the first time it's requested.
 */
export function ExperienceCharacterMobile() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const cacheRef = useRef({});
  const lastDrawnRef = useRef(-1);
  const lastRequestedRef = useRef(0);
  const rafPendingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const drawFrame = mi => {
      const img = cacheRef.current[mi];
      if (!img || !img.complete || !img.naturalWidth) return;
      const ctx = canvas.getContext('2d');
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      lastDrawnRef.current = mi;
    };

    const ensureLoaded = mi => {
      if (cacheRef.current[mi]) return;
      const img = new window.Image();
      img.decoding = 'async';
      img.onload = () => {
        if (mi === lastRequestedRef.current) drawFrame(mi);
      };
      img.src = framePath(mobileIndices[mi]);
      cacheRef.current[mi] = img;
    };

    const handleProgress = progress => {
      const clamped = Math.min(1, Math.max(0, progress));
      const mi = Math.min(mobileIndices.length - 1, Math.round(clamped * (mobileIndices.length - 1)));
      lastRequestedRef.current = mi;

      const img = cacheRef.current[mi];
      if (img && img.complete && img.naturalWidth) {
        drawFrame(mi);
      } else {
        ensureLoaded(mi);
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      if (lastDrawnRef.current >= 0) drawFrame(lastDrawnRef.current);
    };
    resize();

    const computeAndApply = () => {
      rafPendingRef.current = false;
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const traveled = vh - rect.top;
      handleProgress(traveled / total);
    };

    const onScroll = () => {
      if (rafPendingRef.current) return;
      rafPendingRef.current = true;
      requestAnimationFrame(computeAndApply);
    };

    const io = new IntersectionObserver(entries => {
      const visible = entries[0].isIntersecting;
      if (visible) {
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', resize);
        computeAndApply();
      } else {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', resize);
      }
    }, { threshold: 0 });
    io.observe(container);

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      Object.values(cacheRef.current).forEach(img => {
        img.onload = null;
        img.src = '';
      });
      cacheRef.current = {};
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-[5] pointer-events-none overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}