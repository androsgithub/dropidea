import React, { useEffect, useRef } from 'react';
import { getRandomColor } from '../../util/Colors';

type DecorativeCirclesBackgroundProps = {
  count?: number;
  offset?: number;
};

type Circle = {
  x: number;
  y: number;
  size: number;
  color: string;
  phase: number;
  speed: number;
};

export const DecorativeCirclesBackground: React.FC<DecorativeCirclesBackgroundProps> = ({
  count = 20,
  offset = 32
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const circlesRef = useRef<Circle[]>([]);
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    resizeCanvas();
    initCircles();
    animate();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleResize = () => {
    resizeCanvas();
    initCircles();
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { innerWidth, innerHeight } = window;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;

    const ctx = ctxRef.current;
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const initCircles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = canvas;

    circlesRef.current = Array.from({ length: count }, () => {
      const size = Math.max(offset, Math.min(offset * (0.5 + Math.random() * 2), offset + 32));
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        color: getRandomColor(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.3 // velocidades menores
      };
    });
  };

  const animate = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circlesRef.current.forEach((circle) => {
      const floatY = Math.sin(circle.phase) * 12;
      const floatX = Math.cos(circle.phase * 0.5) * 8;

      ctx.beginPath();
      ctx.arc(circle.x + floatX, circle.y + floatY, circle.size, 0, Math.PI * 2);
      ctx.fillStyle = circle.color;
      ctx.globalAlpha = 0.35;
      ctx.fill();

      circle.phase += 0.003 * circle.speed;
    });

    requestAnimationFrame(animate);
  };

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />;
};
