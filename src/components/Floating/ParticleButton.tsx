import { AnimatePresence, motion, useAnimationFrame, useMotionValue, type Variants } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import type { Particle } from '../../types/Particle';

interface ParticleButtonProps {
  particle: Particle;
  style: React.CSSProperties;
  onClick: () => void;
}

export function ParticleButton({ particle, style, onClick }: ParticleButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const floatingSize = useMotionValue(42);

  const [isHovered, setIsHovered] = useState(false);
  const [isAnimationEnd, setIsAnimationEnd] = useState(false);

  const delay = useMemo(() => {
    return isAnimationEnd ? 0 : Math.random() * 0.1 + 0.1;
  }, [isAnimationEnd]);

  const lastTime = useRef(0);
  const elapsed = useRef(0);

  useAnimationFrame((t) => {
    if (isHovered) {
      lastTime.current = t;
      return;
    }

    const delta = (t - lastTime.current) / 1000; // em segundos
    lastTime.current = t;
    elapsed.current += delta;

    const time = elapsed.current;

    x.set(Math.cos(time + particle.visual.phase) * 5);
    y.set(Math.sin(time + particle.visual.phase) * 10);

    const pulse = 1 + 0.1 * Math.sin(time * 2 + particle.visual.phase);
    floatingSize.set(42 * pulse);
  });
  const variants: Variants = {
    initial: { scale: 0, filter: 'contrast(0%) brightness(0%)', top: `50%`, left: `50%` },
    animate: {
      scale: 1,
      transition: {
        delay,
        duration: 0.5,
        type: 'spring',
        bounce: 0.25,
        mass: 0.5
      },
      top: `${particle.visual.top}%`,
      left: `${particle.visual.left}%`,
      boxShadow: particle.data.insight && `0 0 32px ${particle.visual.color}`,
      filter: 'contrast(100%) brightness(100%)'
    },
    whileHover: {
      scale: 1.6,
      filter: 'contrast(110%) brightness(110%)',
      transition: { duration: 0.1, delay: 0 }
    },
    whileTap: {
      scale: 1.8,
      filter: 'contrast(130%) brightness(130%)',
      boxShadow: `0 0 48px ${particle.visual.color}`,
      transition: { duration: 0.1, delay: 0 }
    }
  };

  return (
    <motion.button
      onDoubleClick={onClick}
      className="z-50 flex cursor-pointer items-center justify-center text-xl"
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="whileHover"
      whileTap="whileTap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onAnimationComplete={() => setIsAnimationEnd(true)}
      style={{
        ...style,
        top: `${particle.visual.top}%`,
        left: `${particle.visual.left}%`,
        backgroundColor: particle.visual.color,
        borderRadius: '50%',
        width: floatingSize,
        height: floatingSize,
        boxShadow: particle.data.insight && `0 0 32px ${particle.visual.color}`,
        x,
        y
      }}
    >
      {particle.visual.icon}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 40, scaleY: 0, scaleX: 2, rotate: '45deg' }}
            animate={{ opacity: 1, y: 0, scaleY: 1, scaleX: 1, rotate: '0deg' }}
            exit={{ opacity: 0, y: 40, scaleY: 0, scaleX: 2, rotate: '-45deg' }}
            transition={{
              duration: 0.5,
              type: 'spring',
              bounce: 1,
              mass: 0.5
            }}
            className="pointer-events-none absolute bottom-full mb-1 flex justify-self-center rounded-full px-1 py-0.5 text-[8px] font-semibold"
            style={{
              backgroundColor: particle.visual.color + '48'
            }}
          >
            <p className="max-w-24 flex-1 truncate">{particle.data.title}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
