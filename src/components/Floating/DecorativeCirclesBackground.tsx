import { useMemo } from 'react';
import { getRandomColor } from '../../util/Colors';
import { Circle } from './Circle';

type DecorativeCirclesBackgroundProps = {
  count?: number;
  offset?: number;
};

type CircleData = {
  id: string;
  color: string;
  size: number;
  top: number;
  left: number;
  phase: number;
};

export const DecorativeCirclesBackground = ({ count = 20, offset = 32 }: DecorativeCirclesBackgroundProps) => {
  const circles = useMemo(() => {
    const _circles: CircleData[] = [];

    for (let i = 0; i < count; i++) {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.max(offset, Math.min(offset * Math.random() * 5, offset + 16));
      const phase = Math.random() * Math.PI * 2;

      _circles.push({
        color: getRandomColor(),
        size,
        top,
        left,
        phase,
        id: `circle-${i}` // Adiciona ID estável para melhor performance do React
      });
    }

    return _circles;
  }, [count, offset]);

  return (
    <div
      className="absolute flex size-full items-center justify-center"
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        perspective: 1000
      }}
    >
      {circles.map(({ color, size, top, left, phase }, i) => (
        <Circle
          key={`circle-${i}`}
          color={color}
          size={size}
          style={{
            position: 'absolute',
            alignSelf: 'center',
            justifySelf: 'center',
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
          baseTop={top}
          baseLeft={left}
          phase={phase}
        />
      ))}
    </div>
  );
};
