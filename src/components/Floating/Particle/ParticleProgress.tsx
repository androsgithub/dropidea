import Color from 'color';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

type ParticleProgressProps = {
  percentage?: number;
  baseColor?: string;
  size?: number;
};
export function ParticleProgress({ percentage = 0, baseColor = '#ffffff', size = 64 }: ParticleProgressProps) {
  const rotation = useMotionValue(0);
  useAnimationFrame((t) => rotation.set(((t / 1000) * 30) % 360));

  const progressAngle = (percentage / 100) * 360;
  const color = Color(baseColor);

  const createGradient = () => {
    if (progressAngle === 0) return 'transparent';
    if (percentage === 100) return color.alpha(1).string();

    const maxOpacity = percentage / 100;
    return `conic-gradient(
      from 0deg,
      ${color.alpha(0).string()} 0deg,
      ${color.alpha(0.5 * maxOpacity).string()} ${progressAngle * 0.25}deg,
      ${color.alpha(0.7 * maxOpacity).string()} ${progressAngle * 0.5}deg,
      ${color.alpha(0.9 * maxOpacity).string()} ${progressAngle * 0.75}deg,
      ${color.alpha(maxOpacity).string()} ${progressAngle}deg,
      transparent ${progressAngle}deg,
      transparent 360deg
    )`;
  };

  return (
    <motion.div
      style={{ rotate: rotation, width: size, height: size }}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="absolute rounded-full"
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: createGradient(),
          mask: 'radial-gradient(circle at center, transparent 64%, black 62%, black 100%)',
          WebkitMask: 'radial-gradient(circle at center, transparent 64%, black 62%, black 100%)'
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center"></div>
    </motion.div>
  );
}
