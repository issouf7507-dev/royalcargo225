"use client";

import { useEffect, useRef, useState } from "react";

interface Point {
  /** Position en fraction de la largeur / hauteur du panneau */
  x: number;
  y: number;
  delay: number;
}

const ROUTE_COLOR = "#2563eb";
const ROUTE_DURATION = 3; // secondes par trajet
const LOOP = 15; // l'animation recommence toutes les 15 s

// Trajets animés : de la Chine vers l'Afrique de l'Ouest
const ROUTES: { start: Point; end: Point }[] = [
  { start: { x: 0.62, y: 0.3, delay: 0 }, end: { x: 0.38, y: 0.48, delay: 3 } }, // Chine → Abidjan
  { start: { x: 0.66, y: 0.36, delay: 1.5 }, end: { x: 0.4, y: 0.42, delay: 4.5 } }, // Guangzhou → Bamako
  { start: { x: 0.38, y: 0.48, delay: 5 }, end: { x: 0.42, y: 0.56, delay: 8 } },
  { start: { x: 0.55, y: 0.22, delay: 2.5 }, end: { x: 0.36, y: 0.5, delay: 5.5 } },
];

/** Grille de points dessinant une silhouette de carte du monde. */
function generateDots(width: number, height: number) {
  const dots: { x: number; y: number; opacity: number }[] = [];
  const gap = 12;
  const inBox = (x: number, y: number, x0: number, x1: number, y0: number, y1: number) =>
    x > width * x0 && x < width * x1 && y > height * y0 && y < height * y1;

  for (let x = 0; x < width; x += gap) {
    for (let y = 0; y < height; y += gap) {
      const inMap =
        inBox(x, y, 0.05, 0.25, 0.1, 0.4) || // Amérique du Nord
        inBox(x, y, 0.15, 0.25, 0.4, 0.8) || // Amérique du Sud
        inBox(x, y, 0.3, 0.45, 0.15, 0.35) || // Europe
        inBox(x, y, 0.35, 0.5, 0.35, 0.65) || // Afrique
        inBox(x, y, 0.45, 0.7, 0.1, 0.5) || // Asie
        inBox(x, y, 0.65, 0.8, 0.6, 0.8); // Océanie
      if (inMap && Math.random() > 0.3) dots.push({ x, y, opacity: Math.random() * 0.5 + 0.2 });
    }
  }
  return dots;
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

/** Carte de points animée (décorative) — statique si l'utilisateur préfère réduire les animations. */
export default function DotMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const parent = canvasRef.current?.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !size.width || !size.height) return;

    // Netteté sur écrans haute densité
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const { width: w, height: h } = size;
    const dots = generateDots(w, h);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let start = performance.now();
    let frame = 0;

    const draw = (elapsedSec: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) dot(ctx, d.x, d.y, 1, `rgba(37, 99, 235, ${d.opacity})`);

      for (const { start: s, end: e } of ROUTES) {
        const elapsed = elapsedSec - s.delay;
        if (elapsed <= 0) continue;
        const progress = Math.min(elapsed / ROUTE_DURATION, 1);
        const sx = s.x * w;
        const sy = s.y * h;
        const x = sx + (e.x * w - sx) * progress;
        const y = sy + (e.y * h - sy) * progress;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = ROUTE_COLOR;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        dot(ctx, sx, sy, 3, ROUTE_COLOR);
        dot(ctx, x, y, 6, "rgba(59, 130, 246, 0.4)"); // halo
        dot(ctx, x, y, 3, "#3b82f6");
        if (progress === 1) dot(ctx, e.x * w, e.y * h, 3, ROUTE_COLOR);
      }
    };

    if (reduceMotion) {
      draw(LOOP); // tous les trajets affichés, sans animation
      return;
    }

    const animate = (now: number) => {
      let t = (now - start) / 1000;
      if (t > LOOP) {
        start = now;
        t = 0;
      }
      draw(t);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [size]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
