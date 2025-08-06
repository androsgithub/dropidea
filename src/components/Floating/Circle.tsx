import { motion } from 'framer-motion';
import { memo } from 'react';

type CircleProps = {
  color: string;
  size: number;
  style: React.CSSProperties;
  baseTop: number;
  baseLeft: number;
  phase: number;
};

export const Circle = memo(function Circle({ color, size, style, baseTop, baseLeft, phase }: CircleProps) {
  return (
    <motion.div
      style={{
        ...style,
        top: `${baseTop}%`,
        left: `${baseLeft}%`,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '50%',
        opacity: 0.6
      }}
      animate={{
        x: [Math.cos(phase) * 5, Math.cos(phase + Math.PI) * 5, Math.cos(phase + Math.PI * 2) * 5],
        y: [Math.sin(phase) * 10, Math.sin(phase + Math.PI) * 10, Math.sin(phase + Math.PI * 2) * 10]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
});
