'use client';

import { useEffect, useRef } from 'react';

type ParticleKind = 'heart' | 'sparkle' | 'dot';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  age: number;
  maxAge: number;
  kind: ParticleKind;
  base: string;
  glow: string;
  baseOpacity: number;
  wobble: number;
  wobbleAmp: number;
}

interface ColorPair {
  base: string;
  glow: string;
}

const PALETTE: ColorPair[] = [
  { base: '#a894ec', glow: '#e6ddff' },
  { base: '#c9bff2', glow: '#f5f1ff' },
  { base: '#ef8fb8', glow: '#ffe1ee' },
  { base: '#f0b56e', glow: '#ffe7c4' },
  { base: '#ffffff', glow: '#ffffff' },
];

const MAX_PARTICLES = 55;
const MOVE_SPAWN_MIN_MS = 70;
const MOVE_SPAWN_MAX_MS = 130;
const IDLE_MS = 1300;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickKind(): ParticleKind {
  const roll = Math.random();
  if (roll < 0.45) return 'heart';
  if (roll < 0.88) return 'sparkle';
  return 'dot';
}

function drawHeart(ctx: CanvasRenderingContext2D, size: number) {
  const s = size;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.32);
  ctx.bezierCurveTo(-s * 0.55, -s * 0.35, -s * 1.1, s * 0.28, 0, s * 0.95);
  ctx.bezierCurveTo(s * 1.1, s * 0.28, s * 0.55, -s * 0.35, 0, s * 0.32);
  ctx.closePath();
  ctx.fill();
}

function drawSparkle(ctx: CanvasRenderingContext2D, size: number) {
  const s = size;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.quadraticCurveTo(s * 0.18, -s * 0.18, s, 0);
  ctx.quadraticCurveTo(s * 0.18, s * 0.18, 0, s);
  ctx.quadraticCurveTo(-s * 0.18, s * 0.18, -s, 0);
  ctx.quadraticCurveTo(-s * 0.18, -s * 0.18, 0, -s);
  ctx.closePath();
  ctx.fill();
  ctx.save();
  ctx.rotate(Math.PI / 4);
  ctx.scale(0.5, 0.5);
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.quadraticCurveTo(s * 0.18, -s * 0.18, s, 0);
  ctx.quadraticCurveTo(s * 0.18, s * 0.18, 0, s);
  ctx.quadraticCurveTo(-s * 0.18, s * 0.18, -s, 0);
  ctx.quadraticCurveTo(-s * 0.18, -s * 0.18, 0, -s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDot(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2);
  ctx.fill();
}

function fillGradient(ctx: CanvasRenderingContext2D, size: number, base: string, glow: string) {
  const gradient = ctx.createRadialGradient(-size * 0.15, -size * 0.25, size * 0.05, 0, 0, size * 1.15);
  gradient.addColorStop(0, glow);
  gradient.addColorStop(1, base);
  ctx.fillStyle = gradient;
}

/**
 * Particles are drawn in page (document) coordinates on a canvas sized to
 * the full scrollable height and positioned with the document flow, rather
 * than a viewport-fixed canvas — this scrolls naturally with the page
 * instead of needing to be repainted on every scroll frame.
 */
export default function CursorMagic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let particles: Particle[] = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let lastSpawn = 0;
    let nextSpawnGap = MOVE_SPAWN_MIN_MS;
    let lastMoveAt = 0;
    let idleSparkleDone = true;
    let pointer: { x: number; y: number } | null = null;
    let haloX = 0;
    let haloY = 0;
    let haloVisible = false;
    let frame = 0;
    let disposed = false;
    let pageWidth = 0;
    let pageHeight = 0;
    let startTime = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      pageWidth = window.innerWidth;
      pageHeight = Math.max(window.innerHeight, document.documentElement.scrollHeight);
      canvas.width = pageWidth * dpr;
      canvas.height = pageHeight * dpr;
      canvas.style.width = `${pageWidth}px`;
      canvas.style.height = `${pageHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number, opts?: { burst?: boolean }) => {
      if (reducedMotion.matches) return;
      if (particles.length >= MAX_PARTICLES) return;
      const kind = pickKind();
      const size = kind === 'dot' ? 3.5 + Math.random() * 3.5 : 6 + Math.random() * 7;
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * (opts?.burst ? Math.PI : Math.PI * 0.6);
      const speed = opts?.burst ? 0.35 + Math.random() * 0.5 : 0.15 + Math.random() * 0.25;
      const colors = pick(PALETTE);
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.025,
        age: 0,
        maxAge: 950 + Math.random() * 750,
        kind,
        base: colors.base,
        glow: colors.glow,
        baseOpacity: 0.55 + Math.random() * 0.32,
        wobble: Math.random() * Math.PI * 2,
        wobbleAmp: 0.35 + Math.random() * 0.5,
      });
    };

    const spawnBurst = (x: number, y: number) => {
      if (reducedMotion.matches) return;
      spawn(x, y, { burst: true });
      const extras = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < extras; i += 1) {
        const ox = x + (Math.random() - 0.5) * 26;
        const oy = y + (Math.random() - 0.5) * 26;
        spawn(ox, oy, { burst: true });
      }
    };

    const toPage = (clientX: number, clientY: number) => ({
      x: clientX + window.scrollX,
      y: clientY + window.scrollY,
    });

    const handlePointerMove = (event: PointerEvent) => {
      pointer = toPage(event.clientX, event.clientY);
      haloVisible = true;
      lastMoveAt = performance.now();
      idleSparkleDone = false;
      if (lastMoveAt - lastSpawn >= nextSpawnGap) {
        spawn(pointer.x, pointer.y);
        lastSpawn = lastMoveAt;
        nextSpawnGap = MOVE_SPAWN_MIN_MS + Math.random() * (MOVE_SPAWN_MAX_MS - MOVE_SPAWN_MIN_MS);
      }
    };

    const handlePointerLeave = () => {
      haloVisible = false;
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('button, a, input, textarea, select, [role="button"]')) return;
      const { x, y } = toPage(event.clientX, event.clientY);
      spawnBurst(x, y);
    };

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, pageWidth, pageHeight);

      if (pointer) {
        haloX += (pointer.x - haloX) * 0.16;
        haloY += (pointer.y - haloY) * 0.16;
      }

      if (haloVisible && !reducedMotion.matches) {
        const pulse = 0.85 + Math.sin(elapsed * 0.0022) * 0.15;
        const radius = 34 * pulse;
        const halo = ctx.createRadialGradient(haloX, haloY, 0, haloX, haloY, radius);
        halo.addColorStop(0, 'rgba(230,221,255,0.30)');
        halo.addColorStop(0.5, 'rgba(239,143,184,0.14)');
        halo.addColorStop(1, 'rgba(239,143,184,0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(haloX, haloY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      particles = particles.filter((p) => p.age < p.maxAge);
      for (const p of particles) {
        p.age += 16.7;
        p.x += p.vx * 16.7;
        p.y += p.vy * 16.7;
        p.vy -= 0.00055;
        p.rotation += p.rotationSpeed;

        const t = p.age / p.maxAge;
        const drawX = p.x + Math.sin(p.age * 0.006 + p.wobble) * p.wobbleAmp * 2.4;
        const drawY = p.y;

        const twinkle = p.kind === 'sparkle' ? 0.82 + Math.sin(p.age * 0.018 + p.wobble * 5) * 0.18 : 1;
        const opacity = p.baseOpacity * (1 - t) * twinkle;
        const scale = (t < 0.15 ? t / 0.15 : 1 - (t - 0.15) * 0.38) * twinkle;

        ctx.save();
        ctx.translate(drawX, drawY);
        ctx.rotate(p.rotation);
        ctx.scale(scale, scale);
        ctx.globalAlpha = Math.max(opacity, 0);
        ctx.shadowColor = p.base;
        ctx.shadowBlur = p.kind === 'dot' ? 6 : 12;
        fillGradient(ctx, p.size, p.base, p.glow);
        if (p.kind === 'heart') drawHeart(ctx, p.size);
        else if (p.kind === 'sparkle') drawSparkle(ctx, p.size);
        else drawDot(ctx, p.size);
        ctx.restore();
      }

      if (!reducedMotion.matches && !idleSparkleDone && pointer && now - lastMoveAt > IDLE_MS) {
        spawn(pointer.x, pointer.y);
        idleSparkleDone = true;
      }

      frame = requestAnimationFrame(tick);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.body);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('click', handleClick);
    frame = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-magic" aria-hidden="true" />;
}
