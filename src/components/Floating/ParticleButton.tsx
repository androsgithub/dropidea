import Color from 'color';
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, type Variants } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import type { Particle } from '../../types/Particle';
import { ParticleProgress } from './Particle/ParticleProgress';

interface ParticleButtonProps {
  particle: Particle;
  style: React.CSSProperties;
  onClick: () => void;
}

export function ParticleButton({ particle, style, onClick }: ParticleButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const floatingScale = useMotionValue(1);

  const [isHovered, setIsHovered] = useState(false);
  const [isAnimationEnd, setIsAnimationEnd] = useState(false);

  const delay = useMemo(() => {
    return isAnimationEnd ? 0 : Math.random() * 0.5 + 0.1;
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

    x.set(Math.cos(time + particle.visual.phase) * 20);
    y.set(Math.sin(time + particle.visual.phase) * 20);

    const pulse = 1 + 0.15 * Math.sin(time * 2 + particle.visual.phase);
    floatingScale.set(1 * pulse);
  });
  const variants: Variants = {
    initial: { scaleY: 0, scaleX: 0, top: `50%`, left: `50%`, skewX: particle.visual.left > 50 ? 90 : -90 },
    animate: {
      scaleY: 1,
      scaleX: 1,
      skewX: 0,
      top: `${particle.visual.top}%`,
      left: `${particle.visual.left}%`,
      boxShadow: particle.data.insight
        ? `0 0 32px 4px ${particle.visual.color}`
        : `0 0 0px 0px ${particle.visual.color}`,

      animation: `${particle.states.generatingInsight && 'var(--animate-pulse)'}`,
      transition: {
        delay,
        duration: 0.5,
        type: 'spring',
        bounce: 0.25,
        mass: 0.5
      }
    },
    whileHover: {
      scaleY: 1.5,
      scaleX: 1.5,
      transition: { duration: 0.1, delay: 0 }
    },
    whileTap: {
      scaleX: 1.75,
      scaleY: 1.25,
      boxShadow: `0 0 48px ${particle.visual.color}`,
      transition: { duration: 0.1, delay: 0 }
    }
  };

  return (
    <motion.button
      onDoubleClick={onClick}
      className="z-50 flex cursor-pointer items-center justify-center rounded-full p-2 text-xl"
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
        scale: floatingScale,
        top: `${particle.visual.top}%`,
        left: `${particle.visual.left}%`,
        backgroundColor: particle.visual.color,
        boxShadow: particle.data.insight && `0 0 32px ${particle.visual.color}`,
        x,
        y
      }}
    >
      {particle.data.tasks && particle.data.tasks.length > 0 && (
        <ParticleProgress
          key={particle.data.id}
          percentage={(particle.data.tasks.filter((p) => p.done).length / particle.data.tasks.length) * 100}
          baseColor={particle.visual.color}
        />
      )}

      {particle.visual.icon}
      <AnimatePresence>{isHovered && <ParticleTooltip particle={particle} />}</AnimatePresence>
    </motion.button>
  );
}

function ParticleTooltip({ particle }: { particle: Particle }) {
  return (
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
      className="pointer-events-none absolute bottom-full mb-1 flex justify-self-center rounded-full px-1.5 py-1 text-[8px] font-semibold backdrop-blur-3xl"
      style={{
        backgroundColor: Color(particle.visual.color).alpha(0.25).hexa(),
        color: Color(particle.visual.color).lighten(0.75).hexa()
      }}
    >
      <p className="max-w-24 flex-1 truncate">{particle.data.title}</p>
    </motion.div>
  );
}
