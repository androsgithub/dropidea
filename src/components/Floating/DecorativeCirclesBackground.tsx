import React, { useEffect, useRef } from 'react';
import { getRandomColor } from '../../util/Colors';

type DecorativeCirclesBackgroundProps = {
  count?: number;
  offset?: number;
  /**
   * Opacidade final de cada círculo. Antes era `globalAlpha 0.35` no canvas multiplicado
   * pela classe `opacity-*` do wrapper no `App.tsx`; agora é um número só, aqui.
   */
  alpha?: number;
};

type Circle = {
  x: number;
  y: number;
  size: number;
  color: string;
  phase: number;
  speed: number;
};

/**
 * Taxa de redesenho do campo de fundo.
 *
 * Cada círculo anda `sin(phase) * 12` com `phase += 0.003 * speed` — menos de 1 px por
 * segundo, um ciclo completo por minuto. Redesenhar isso a 165 Hz movia o conteúdo
 * 0,005 px por frame.
 */
const REDRAWS_PER_SECOND = 10;
const FRAME_INTERVAL = 1000 / REDRAWS_PER_SECOND;

/**
 * Largura da borda suave, em pixels de tela. Equivale ao `blur-xs` (`blur(4px)`) que os
 * wrappers aplicavam: um blur de 4px espalha a borda por volta de ±4px e estufa o raio
 * em ~4px. Manter isso em pixels absolutos (e não proporcional ao raio) é o que preserva
 * o visual: nos círculos pequenos vira quase um blob inteiro, nos grandes vira só uma
 * casquinha difusa — exatamente o que o filtro fazia.
 */
const SOFT_EDGE = 4;

export const DecorativeCirclesBackground: React.FC<DecorativeCirclesBackgroundProps> = ({
  count = 20,
  offset = 32,
  alpha = 0.35
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Em CSS pixels. O `ctx` já está escalado por `dpr`, então sortear posição em pixels
    // de dispositivo (como era antes, usando `canvas.width`) jogava parte dos círculos
    // para fora da viewport em telas com dpr > 1.
    let viewport = { width: 0, height: 0 };
    let circles: Circle[] = [];
    let frameId = 0;
    let lastDraw = 0;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const { innerWidth, innerHeight } = window;
      viewport = { width: innerWidth, height: innerHeight };
      canvas.width = Math.round(innerWidth * dpr);
      canvas.height = Math.round(innerHeight * dpr);
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initCircles = () => {
      circles = Array.from({ length: count }, () => {
        const size = Math.max(offset, Math.min(offset * (0.5 + Math.random() * 2), offset + 32));
        return {
          x: Math.random() * viewport.width,
          y: Math.random() * viewport.height,
          size,
          color: getRandomColor(),
          phase: Math.random() * Math.PI * 2,
          speed: 0.2 + Math.random() * 0.3 // velocidades menores
        };
      });
    };

    const draw = (elapsed: number) => {
      ctx.clearRect(0, 0, viewport.width, viewport.height);

      for (const circle of circles) {
        const floatY = Math.sin(circle.phase) * 12;
        const floatX = Math.cos(circle.phase * 0.5) * 8;
        const cx = circle.x + floatX;
        const cy = circle.y + floatY;

        // Borda suave desenhada, não filtrada. Antes a suavidade vinha de um `blur-xs`
        // aplicado sobre o canvas inteiro — um filtro de viewport inteira por redesenho,
        // que sem aceleração de hardware é rasterizado na CPU e sozinho custava ~52ms
        // por frame. Um gradiente radial dá o mesmo resultado por alguns microssegundos.
        const outer = circle.size + SOFT_EDGE;
        const solid = Math.max(0, (circle.size - SOFT_EDGE) / outer);

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, outer);
        gradient.addColorStop(0, circle.color);
        gradient.addColorStop(solid, circle.color);
        // `#rrggbb00`, não `transparent`: o gradiente interpola em sRGB não-premultiplicado,
        // então terminar em `transparent` (preto alfa 0) escurece a borda e deixa um halo
        // sujo em volta de cada círculo. Mesma cor com alfa 0 desaparece limpo.
        gradient.addColorStop(1, `${circle.color}00`);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, outer, 0, Math.PI * 2);
        ctx.fill();

        // Avança por tempo decorrido, não por frame: a velocidade passa a ser a mesma em
        // 60 Hz, 165 Hz ou nos 10 fps deste loop. Antes ela dependia da taxa do monitor.
        circle.phase += 0.003 * circle.speed * (elapsed / (1000 / 60));
      }
    };

    const animate = (now: number) => {
      frameId = requestAnimationFrame(animate);

      const elapsed = now - lastDraw;
      if (elapsed < FRAME_INTERVAL) return;
      lastDraw = now;

      draw(Math.min(elapsed, 250)); // trava o passo após a aba voltar do segundo plano
    };

    const handleResize = () => {
      resizeCanvas();
      initCircles();
    };

    resizeCanvas();
    initCircles();
    lastDraw = performance.now();
    draw(1000 / 60);
    frameId = requestAnimationFrame(animate);

    window.addEventListener('resize', handleResize);
    return () => {
      // Sem isto o loop sobrevive ao unmount. Em StrictMode o efeito roda duas vezes,
      // então cada instância deixava um rAF órfão girando para sempre — eram 4 loops no
      // ar em vez de 2.
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [count, offset, alpha]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />;
};
