"use client";

import { useEffect, useRef } from "react";

type Point = [number, number];

type RouteDef = {
  points: Point[];
  color: string;
  glow: string;
  accent: string;
  width: number;
  phase: number;
  speed: number;
  drawDelay: number;
};

const VIEW_W = 1000;
const VIEW_H = 562;

const ROUTES: RouteDef[] = [
  {
    points: [
      [120, 520],
      [200, 460],
      [280, 420],
      [360, 380],
      [420, 340],
      [480, 300],
      [520, 260],
      [560, 220],
      [600, 190],
      [640, 170],
    ],
    color: "#a78bfa",
    glow: "#7c3aed",
    accent: "#f97316",
    width: 2.2,
    phase: 0,
    speed: 0.35,
    drawDelay: 0,
  },
  {
    points: [
      [360, 380],
      [340, 320],
      [300, 270],
      [250, 230],
      [200, 200],
      [150, 175],
      [100, 155],
    ],
    color: "#a78bfa",
    glow: "#7c3aed",
    accent: "#a78bfa",
    width: 1.8,
    phase: 1.2,
    speed: 0.28,
    drawDelay: 0.4,
  },
  {
    points: [
      [480, 300],
      [540, 260],
      [600, 240],
      [680, 230],
      [760, 240],
      [840, 270],
      [920, 310],
    ],
    color: "#c4b5fd",
    glow: "#8b5cf6",
    accent: "#fbbf24",
    width: 2,
    phase: 2.1,
    speed: 0.32,
    drawDelay: 0.7,
  },
  {
    points: [
      [280, 420],
      [220, 390],
      [160, 370],
      [100, 360],
      [50, 355],
    ],
    color: "#8b5cf6",
    glow: "#6d28d9",
    accent: "#8b5cf6",
    width: 1.6,
    phase: 0.8,
    speed: 0.25,
    drawDelay: 1.0,
  },
  {
    points: [
      [520, 260],
      [500, 210],
      [470, 165],
      [430, 130],
      [380, 105],
      [330, 90],
    ],
    color: "#a78bfa",
    glow: "#7c3aed",
    accent: "#fb923c",
    width: 1.7,
    phase: 3.0,
    speed: 0.3,
    drawDelay: 1.2,
  },
  {
    points: [
      [600, 190],
      [650, 160],
      [710, 140],
      [780, 130],
      [850, 135],
    ],
    color: "#c4b5fd",
    glow: "#8b5cf6",
    accent: "#c4b5fd",
    width: 1.5,
    phase: 1.8,
    speed: 0.22,
    drawDelay: 1.4,
  },
];

const CONTOURS: Point[][] = [
  [
    [0, 180],
    [120, 160],
    [240, 175],
    [360, 150],
    [500, 165],
    [640, 140],
    [780, 155],
    [1000, 130],
  ],
  [
    [0, 280],
    [150, 260],
    [300, 275],
    [450, 250],
    [600, 265],
    [750, 245],
    [1000, 260],
  ],
  [
    [0, 400],
    [180, 380],
    [360, 395],
    [540, 370],
    [720, 385],
    [1000, 375],
  ],
  [
    [0, 480],
    [200, 460],
    [400, 475],
    [600, 455],
    [800, 470],
    [1000, 450],
  ],
];

function pathLength(points: Point[]): number {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i]![0] - points[i - 1]![0];
    const dy = points[i]![1] - points[i - 1]![1];
    len += Math.hypot(dx, dy);
  }
  return len;
}

function slicePath(points: Point[], startT: number, endT: number): Point[] {
  const total = pathLength(points);
  const startLen = total * startT;
  const endLen = total * endT;
  const result: Point[] = [];
  let dist = 0;

  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!;
    const b = points[i]!;
    const seg = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const segStart = dist;
    const segEnd = dist + seg;

    if (segEnd < startLen) {
      dist += seg;
      continue;
    }
    if (segStart > endLen) break;

    const from = Math.max(0, (startLen - segStart) / seg);
    const to = Math.min(1, (endLen - segStart) / seg);

    if (result.length === 0) {
      result.push([
        a[0] + (b[0] - a[0]) * from,
        a[1] + (b[1] - a[1]) * from,
      ]);
    }
    result.push([
      a[0] + (b[0] - a[0]) * to,
      a[1] + (b[1] - a[1]) * to,
    ]);
    dist += seg;
  }

  return result;
}

function pointAtProgress(points: Point[], t: number): Point {
  const slice = slicePath(points, 0, t);
  return slice[slice.length - 1] ?? points[0]!;
}

function traceLinePath(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length === 0) return;
  ctx.moveTo(points[0]![0], points[0]![1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i]![0], points[i]![1]);
  }
}

function strokePath(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  style: {
    color: string;
    width: number;
    alpha: number;
    dash?: [number, number];
    dashOffset?: number;
  }
) {
  if (points.length < 2) return;
  ctx.save();
  ctx.beginPath();
  traceLinePath(ctx, points);
  ctx.strokeStyle = style.color;
  ctx.globalAlpha = style.alpha;
  ctx.lineWidth = style.width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (style.dash) {
    ctx.setLineDash(style.dash);
    ctx.lineDashOffset = style.dashOffset ?? 0;
  }
  ctx.stroke();
  ctx.restore();
}

function drawRoute(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  color: string,
  glow: string,
  accent: string,
  width: number,
  progress: number,
  dashOffset: number
) {
  const visible = slicePath(points, 0, progress);
  if (visible.length < 2) return;

  strokePath(ctx, visible, { color: glow, width: width * 8, alpha: 0.12 });
  strokePath(ctx, visible, { color: glow, width: width * 4.5, alpha: 0.2 });
  strokePath(ctx, visible, { color, width, alpha: 0.9 });
  strokePath(ctx, visible, {
    color,
    width: width * 0.65,
    alpha: 0.5,
    dash: [5, 13],
    dashOffset: -dashOffset,
  });

  const accentSlice = slicePath(points, 0.52, Math.min(progress, 0.68));
  if (accentSlice.length >= 2 && progress > 0.55) {
    strokePath(ctx, accentSlice, {
      color: accent,
      width: width * 1.05,
      alpha: 0.95,
    });
  }
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  scroll: number
) {
  const cx = w * 0.5;
  const cy = h * 0.42;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.65);
  grad.addColorStop(0, "#1a1230");
  grad.addColorStop(0.45, "#110e1c");
  grad.addColorStop(1, "#080610");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.globalAlpha = 0.03;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1;
  const gridSize = 48;
  const offsetX = scroll % gridSize;
  const offsetY = (scroll * 0.6) % gridSize;

  for (let x = -gridSize + offsetX; x < w + gridSize; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = -gridSize + offsetY; y < h + gridSize; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.045;
  ctx.fillStyle = "#fff";
  for (let i = 0; i < 24; i++) {
    const sx = (i * 137.5 + scroll * 0.15) % w;
    const sy = (i * 97.3 + scroll * 0.1) % h;
    ctx.fillRect(sx, sy, 1, 1);
  }
  ctx.restore();
}

function drawContours(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  scroll: number,
  scaleX: number,
  scaleY: number
) {
  ctx.save();
  ctx.strokeStyle = "#a78bfa";
  ctx.lineWidth = 1;
  ctx.lineCap = "round";
  ctx.globalAlpha = 0.055;

  for (let layer = 0; layer < CONTOURS.length; layer++) {
    const contour = CONTOURS[layer]!;
    const yShift = (scroll * (0.3 + layer * 0.08)) % (VIEW_H * 0.45);
    ctx.beginPath();
    for (let i = 0; i < contour.length; i++) {
      const [x, y] = contour[i]!;
      const px = x * scaleX;
      const py = (y + yShift) * scaleY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawTraveler(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  t: number,
  color: string,
  scale: number
) {
  const pos = pointAtProgress(points, t % 1);
  const pulse = 0.75 + Math.sin(t * Math.PI * 2) * 0.25;

  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.2 * pulse;
  ctx.beginPath();
  ctx.arc(pos[0], pos[1], 5 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(pos[0], pos[1], 2 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export function HeroMapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const visibleRef = useRef(true);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let width = 0;
    let height = 0;
    let dpr = 1;
    const startTime = performance.now();

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const parent = canvas.parentElement;
    if (!parent) return;

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();

    const frame = (now: number) => {
      rafRef.current = requestAnimationFrame(frame);
      if (!visibleRef.current) return;

      const elapsed = (now - startTime) / 1000;
      const scroll = reducedMotionRef.current ? 0 : elapsed * 18;
      const scaleX = width / VIEW_W;
      const scaleY = height / VIEW_H;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawBackground(ctx, width, height, scroll);

      ctx.save();
      ctx.transform(1, 0, -0.06, 0.92, width * 0.03, height * 0.02);
      drawContours(ctx, width, height, scroll, scaleX, scaleY);

      for (const route of ROUTES) {
        const drawT = reducedMotionRef.current
          ? 1
          : easeOutCubic(
              Math.min(1, Math.max(0, (elapsed - route.drawDelay) / 2.2))
            );
        const dashOffset = reducedMotionRef.current
          ? 0
          : elapsed * 38 * route.speed + route.phase * 20;

        const scaled = route.points.map(
          ([x, y]): Point => [x * scaleX, y * scaleY]
        );

        drawRoute(
          ctx,
          scaled,
          route.color,
          route.glow,
          route.accent,
          route.width * scaleX,
          drawT,
          dashOffset
        );

        if (drawT > 0.85 && !reducedMotionRef.current) {
          const travelerT =
            ((elapsed - route.drawDelay) * route.speed * 0.12 +
              route.phase * 0.1) %
            1;
          drawTraveler(ctx, scaled, travelerT, route.color, scaleX);
        }
      }
      ctx.restore();

      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        height * 0.15,
        width * 0.5,
        height * 0.45,
        width * 0.72
      );
      vignette.addColorStop(0, "rgba(8,6,16,0)");
      vignette.addColorStop(1, "rgba(8,6,16,0.5)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
