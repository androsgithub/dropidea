import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
interface MiniParticleProps {
  i: number;
  total?: number;
  baseColor?: string;
}
export function MiniParticle({ i, total = 12, baseColor = '#ffffff' }: MiniParticleProps) {
  const floatingSize = useMotionValue(1);
  useAnimationFrame((t) => floatingSize.set(1.1 * (0.5 + 0.1 * Math.sin(t / 1000)) + 0.01));

  const size = 8 + Math.random() * 8;
  const radius = 16 + size;
  const angle = (i / total) * Math.PI * 2;
  const offsetX = Math.cos(angle) * (radius + Math.random() * 4);
  const offsetY = Math.sin(angle) * (radius + Math.random() * 4);

  return (
    <motion.div
      key={i}
      className="absolute rounded-full"
      style={{ scale: floatingSize, opacity: floatingSize, backgroundColor: baseColor, width: size, height: size }}
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={{
        x: offsetX,
        y: offsetY,
        scale: 1,
        opacity: 1,
        transition: { delay: i * 0.05, duration: 0.1, type: 'spring', stiffness: 100 }
      }}
      exit={{ x: 0, y: 0, opacity: 0 }}
    />
  );
}
