import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

type ParticleProgressProps = {
  percentage?: number;
  baseColor?: string;
  size?: number;
};

export function ParticleProgress({ percentage = 0, baseColor = '#ffffff', size = 56 }: ParticleProgressProps) {
  const rotation = useMotionValue(0);
  useAnimationFrame((t) => rotation.set(((t / 1000) * 30) % 360));

  const radius = size / 2;
  const strokeWidth = size * 0.02;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      style={{ rotate: percentage == 100 ? 0 : rotation, width: size, height: size }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="absolute"
    >
      <svg width={size} height={size}>
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={baseColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </svg>
    </motion.div>
  );
}
