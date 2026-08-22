'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const COLORS = ['#FFBFD8', '#F2739F', '#FF9FC3', '#A8D8F4', '#7FD1E6', '#C9BCEF', '#DFB964', '#FFFFFF'];

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface FireworksBurstProps {
  fireKey: number;
  duration?: number;
}

export function FireworksBurst({ fireKey, duration = 5200 }: FireworksBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (fireKey === 0 || reduced) return;

    setVisible(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const rockets: Rocket[] = [];
    const sparks: Spark[] = [];
    let frame = 0;
    const started = performance.now();
    let lastLaunch = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);

    const launch = () => {
      rockets.push({
        x: width * (0.18 + Math.random() * 0.64),
        y: height + 8,
        vx: (Math.random() - 0.5) * 1.6,
        vy: -(7.5 + Math.random() * 3.5),
        life: 0,
        maxLife: 52 + Math.random() * 18,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
      });
    };

    const explode = (x: number, y: number, color: string) => {
      const count = 36 + Math.floor(Math.random() * 24);
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
        const speed = 1.8 + Math.random() * 3.8;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 48 + Math.random() * 36,
          color,
          size: 1.6 + Math.random() * 2.2,
        });
      }
    };

    const draw = (now: number) => {
      if (now - started > duration) {
        ctx.clearRect(0, 0, width, height);
        setVisible(false);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      if (now - lastLaunch > 320 + Math.random() * 280) {
        launch();
        lastLaunch = now;
      }

      for (let i = rockets.length - 1; i >= 0; i -= 1) {
        const rocket = rockets[i]!;
        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        rocket.vy += 0.07;
        rocket.life += 1;

        ctx.globalAlpha = 0.95;
        ctx.fillStyle = rocket.color;
        ctx.beginPath();
        ctx.arc(rocket.x, rocket.y, 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.arc(rocket.x, rocket.y + 8, 1.5, 0, Math.PI * 2);
        ctx.fill();

        if (rocket.life >= rocket.maxLife || rocket.vy >= -0.5) {
          explode(rocket.x, rocket.y, rocket.color);
          rockets.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const spark = sparks[i]!;
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy += 0.045;
        spark.vx *= 0.985;
        spark.life += 1;

        const alpha = 1 - spark.life / spark.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = spark.color;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fill();

        if (spark.life >= spark.maxLife) sparks.splice(i, 1);
      }

      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frame);
      setVisible(false);
    };
  }, [fireKey, reduced, duration]);

  if (reduced || fireKey === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[60] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}
