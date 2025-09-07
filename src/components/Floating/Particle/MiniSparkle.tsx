import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
interface MiniSparkleProps {
  i: number;
  total?: number;
  baseColor?: string;
}
export function MiniSparkle({ i, total = 12, baseColor = '#ffffff' }: MiniSparkleProps) {
  const floatingSize = useMotionValue(1);
  const rotation = useMotionValue(0);

  useAnimationFrame((t) => {
    const delta = t / 1000;
    floatingSize.set(1.1 * (0.5 + 0.1 * Math.sin(delta)) + 0.01);
    rotation.set((delta * 30) % 360);
  });

  const size = 32 + Math.random() * 8;
  const radius = 24 + size;
  const angle = (i / total) * Math.PI * 2;
  const offsetX = Math.cos(angle) * (radius + Math.random() * 4);
  const offsetY = Math.sin(angle) * (radius + Math.random() * 4);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="absolute p-1"
      style={{ scale: floatingSize, opacity: floatingSize, stroke: baseColor, rotate: rotation }}
      initial={{ x: 0, y: 0 }}
      animate={{
        x: offsetX,
        y: offsetY,
        scale: 1,
        opacity: 0,
        transition: { delay: i * 0.05, duration: 0.1, type: 'spring', stiffness: 100 }
      }}
      exit={{ x: 0, y: 0 }}
    >
      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
    </motion.svg>
  );
}
