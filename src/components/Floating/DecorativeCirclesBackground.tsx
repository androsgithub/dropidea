import { useEffect, useRef, useState } from 'react';
import { getRandomColor } from '../../util/Colors';
import { Circle } from './Circle';


type DecorativeCirclesBackgroundProps = {
  count?: number
  offset?: number
};

type CircleData = {
  color: string,
  size: number,
  top: number,
  left: number,
  phase: number
};

export const DecorativeCirclesBackground = ({ count = 30, offset = 32 }: DecorativeCirclesBackgroundProps) => {
  const [circles, setCircles] = useState<CircleData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const _circles: CircleData[] = [];

    for (let i = 0; i < count; i++) {
      const left = Math.random() * 100;
      const top = Math.random() * 100
      const size = Math.max(offset, Math.min(offset * Math.random() * 5, offset + 16));
      const phase = Math.random() * Math.PI * 2;

      _circles.push({
        color: getRandomColor(),
        size,
        top,
        left,
        phase
      });
    }

    setCircles(_circles);
  }, [count,offset]);

  return (
    <div ref={containerRef} className="absolute flex size-full items-center justify-center">
      {circles.map(({ color, size, top, left, phase }, i) => (
        <Circle
          key={i}
          color={color}
          size={size}
          style={{ position: 'absolute', alignSelf:"center", justifySelf:"center" }}
          baseTop={top}
          baseLeft={left}
          phase={phase}
        />
      ))}
    </div>
  );
};
