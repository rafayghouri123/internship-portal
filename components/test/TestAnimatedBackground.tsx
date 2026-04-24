"use client";

import { useEffect, useRef } from "react";

type IconType = "cap" | "book" | "pencil" | "paper" | "diploma" | "star" | "bulb" | "ruler";

type Blob = {
  x: number;
  y: number;
  r: number;
  color: string;
  speed: number;
  phase: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
};

type CornerItem = {
  type: IconType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vrot: number;
  alpha: number;
  phase: number;
  sway: number;
  corner: "topRight" | "bottomLeft";
};

const BLOBS: Blob[] = [
  { x: 0.15, y: 0.25, r: 0.32, color: "45,140,58", speed: 0.0004, phase: 0 },
  { x: 0.8, y: 0.6, r: 0.28, color: "26,92,46", speed: 0.0003, phase: 2.1 },
  { x: 0.5, y: 0.85, r: 0.35, color: "13,59,30", speed: 0.0005, phase: 4.3 },
  { x: 0.9, y: 0.15, r: 0.22, color: "63,168,82", speed: 0.0006, phase: 1.2 }
];

const TYPES: IconType[] = [
  "cap",
  "book",
  "pencil",
  "paper",
  "diploma",
  "star",
  "bulb",
  "ruler",
  "cap",
  "book",
  "pencil",
  "paper",
  "diploma",
  "star"
];

export function TestAnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let frame = 0;
    let raf = 0;
    let particles: Particle[] = [];
    let items: CornerItem[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
      spawnItems();
    };

    const initParticles = () => {
      particles = Array.from({ length: 45 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.4 + 0.4,
        alpha: Math.random() * 0.22 + 0.06
      }));
    };

    const spawnItems = () => {
      items = TYPES.map((type, index) => {
        const topRight = index % 2 === 0;
        const corner = topRight ? "topRight" : "bottomLeft";
        const x = topRight
          ? canvas.width * (0.78 + Math.random() * 0.2)
          : canvas.width * (0.02 + Math.random() * 0.2);
        const y = topRight
          ? canvas.height * (0.02 + Math.random() * 0.28)
          : canvas.height * (0.72 + Math.random() * 0.26);
        return {
          type,
          corner,
          x,
          y,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.18,
          size: Math.random() * 20 + 16,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.012,
          alpha: Math.random() * 0.22 + 0.09,
          phase: Math.random() * Math.PI * 2,
          sway: Math.random() * 0.6 + 0.2
        };
      });
    };

    const drawCap = (s: number) => {
      const h = s * 0.55;
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.55);
      ctx.lineTo(s * 0.52, 0);
      ctx.lineTo(0, h * 0.35);
      ctx.lineTo(-s * 0.52, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-s * 0.32, h * 0.05);
      ctx.lineTo(s * 0.32, h * 0.05);
      ctx.lineTo(s * 0.24, h * 0.62);
      ctx.lineTo(-s * 0.24, h * 0.62);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    const drawBook = (s: number) => {
      const w = s * 0.9;
      const h = s * 0.68;
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.5);
      ctx.bezierCurveTo(-w * 0.08, -h * 0.5, -w * 0.5, -h * 0.44, -w * 0.52, -h * 0.3);
      ctx.lineTo(-w * 0.52, h * 0.5);
      ctx.lineTo(0, h * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -h * 0.5);
      ctx.bezierCurveTo(w * 0.08, -h * 0.5, w * 0.5, -h * 0.44, w * 0.52, -h * 0.3);
      ctx.lineTo(w * 0.52, h * 0.5);
      ctx.lineTo(0, h * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    const drawPencil = (s: number) => {
      const len = s * 1.1;
      const thick = s * 0.22;
      ctx.beginPath();
      ctx.rect(-len * 0.5, -thick * 0.5, len * 0.75, thick);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(len * 0.25, -thick * 0.5);
      ctx.lineTo(len * 0.5, 0);
      ctx.lineTo(len * 0.25, thick * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    const drawPaper = (s: number) => {
      const w = s * 0.72;
      const h = s * 0.95;
      const fold = w * 0.22;
      ctx.beginPath();
      ctx.moveTo(-w * 0.5, -h * 0.5);
      ctx.lineTo(w * 0.5 - fold, -h * 0.5);
      ctx.lineTo(w * 0.5, -h * 0.5 + fold);
      ctx.lineTo(w * 0.5, h * 0.5);
      ctx.lineTo(-w * 0.5, h * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    const drawDiploma = (s: number) => {
      const w = s * 0.85;
      const h = s * 0.62;
      ctx.beginPath();
      ctx.ellipse(-w * 0.42, 0, w * 0.1, h * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(w * 0.42, 0, w * 0.1, h * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.rect(-w * 0.35, -h * 0.5, w * 0.7, h);
      ctx.fill();
      ctx.stroke();
    };

    const drawStar = (s: number) => {
      const outer = s * 0.48;
      const inner = s * 0.22;
      ctx.beginPath();
      for (let i = 0; i < 10; i += 1) {
        const a = (i * Math.PI) / 5 - Math.PI / 2;
        const r = i % 2 ? inner : outer;
        if (i === 0) {
          ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        } else {
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    const drawBulb = (s: number) => {
      ctx.beginPath();
      ctx.arc(0, -s * 0.1, s * 0.34, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.rect(-s * 0.18, s * 0.22, s * 0.36, s * 0.12);
      ctx.fill();
      ctx.stroke();
    };

    const drawRuler = (s: number) => {
      const len = s * 1.15;
      const thick = s * 0.28;
      ctx.beginPath();
      ctx.rect(-len * 0.5, -thick * 0.5, len, thick);
      ctx.fill();
      ctx.stroke();
    };

    const drawIcon = (item: CornerItem) => {
      const s = item.size;
      switch (item.type) {
        case "cap":
          drawCap(s);
          break;
        case "book":
          drawBook(s);
          break;
        case "pencil":
          drawPencil(s);
          break;
        case "paper":
          drawPaper(s);
          break;
        case "diploma":
          drawDiploma(s);
          break;
        case "star":
          drawStar(s);
          break;
        case "bulb":
          drawBulb(s);
          break;
        case "ruler":
          drawRuler(s);
          break;
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#050e08";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      BLOBS.forEach((b) => {
        const cx = b.x * canvas.width + Math.sin(frame * b.speed + b.phase) * 60;
        const cy = b.y * canvas.height + Math.cos(frame * b.speed * 0.7 + b.phase) * 50;
        const r = b.r * Math.min(canvas.width, canvas.height);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(${b.color},0.16)`);
        g.addColorStop(1, `rgba(${b.color},0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = "rgba(168,213,176,1)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      items.forEach((item) => {
        item.x += item.vx + Math.sin(frame * 0.012 + item.phase) * item.sway * 0.05;
        item.y += item.vy + Math.cos(frame * 0.01 + item.phase) * 0.06;
        item.rot += item.vrot;

        const xMin = item.corner === "topRight" ? canvas.width * 0.72 : -item.size;
        const xMax = item.corner === "topRight" ? canvas.width + item.size : canvas.width * 0.28;
        const yMin = item.corner === "topRight" ? -item.size : canvas.height * 0.66;
        const yMax = item.corner === "topRight" ? canvas.height * 0.34 : canvas.height + item.size;

        if (item.x < xMin) item.x = xMax - item.size;
        if (item.x > xMax) item.x = xMin + item.size;
        if (item.y < yMin) item.y = yMax - item.size;
        if (item.y > yMax) item.y = yMin + item.size;

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rot);
        ctx.globalAlpha = item.alpha;
        ctx.strokeStyle = "rgba(168,213,176,0.9)";
        ctx.fillStyle = "rgba(45,122,58,0.45)";
        ctx.lineWidth = 1.2;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        drawIcon(item);
        ctx.restore();
      });

      frame += 1;
      raf = window.requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas aria-hidden="true" className="test-canvas" ref={canvasRef} />;
}

