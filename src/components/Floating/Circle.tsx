import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

type CircleProps = {
  color: string,
  size: number,
  style: React.CSSProperties,
  baseTop: number,
  baseLeft: number,
  phase: number
};

export function Circle({ color, size, style, baseTop, baseLeft, phase }: CircleProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useAnimationFrame((t) => {
    const time = t / 1000;
    x.set(Math.cos(time + phase) * 5);
    y.set(Math.sin(time + phase) * 10);
  });

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
        opacity: 0.6,
        x,
        y
      }}
    />
  );
}
