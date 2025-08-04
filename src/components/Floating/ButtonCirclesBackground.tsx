import { useCallback, useEffect, useRef, useState } from 'react';
import { useGlobalStore } from '../../stores/useGlobalStore';
import type { Particle, ParticleData } from '../../types/Particle';
import { ParticleButton } from './ParticleButton';

export const ButtonCirclesBackground = () => {
  const [localParticles, setLocalParticles] = useState<Particle[]>([]);
  const particles = useGlobalStore((state) => state.particles);
  const setCurrentParticle = useGlobalStore((state) => state.setCurrentParticle);
  const containerRef = useRef<HTMLDivElement>(null);

  const generatePosition = useCallback((existingParticles: Particle[]) => {
    const offset = 20;
    const containerWidth = containerRef.current?.clientWidth ?? window.innerWidth;
    const containerHeight = containerRef.current?.clientHeight ?? window.innerHeight;

    const deadZone = {
      top: 35,
      bottom: 65,
      left: 35,
      right: 65
    };

    const minLeft = ((offset * 6) / containerWidth) * 100;
    const maxLeft = 100 - minLeft;
    const minTop = ((offset * 6) / containerHeight) * 100;
    const maxTop = 100 - minTop;
    const distanceThreshold = 5;

    let top: number, left: number, phase: number;
    let isColliding: boolean;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      left = Math.random() * (maxLeft - minLeft) + minLeft;
      top = Math.random() * (maxTop - minTop) + minTop;
      phase = Math.random() * Math.PI * 2;

      isColliding = existingParticles.some((c) => {
        const dtop = c.visual.top - top;
        const dleft = c.visual.left - left;
        const distance = Math.sqrt(dtop * dtop + dleft * dleft);
        return distance < distanceThreshold;
      });

      attempts++;
    } while ((isColliding || isInsideDeadZone(deadZone, left, top)) && attempts < maxAttempts);

    return { top, left, phase };
  }, []);

  useEffect(() => {
    setLocalParticles((prevLocalParticles) => {
      const currentParticleIds = new Set(particles.map((p) => p.id));
      const filteredParticles = prevLocalParticles.filter((p) => currentParticleIds.has(p.data.id));

      const existingParticleIds = new Set(filteredParticles.map((p) => p.data.id));
      const newParticleData = particles.filter((p) => !existingParticleIds.has(p.id));

      // Gera posições apenas para as novas partículas
      const newParticles = newParticleData.map((particleData) => {
        const position = generatePosition(filteredParticles);
        return {
          data: particleData,
          visual: {
            ...position
          }
        };
      });

      // Atualiza dados das partículas existentes (caso tenham mudado)
      const updatedExistingParticles = filteredParticles.map((localParticle) => {
        const updatedData = particles.find((p) => p.id === localParticle.data.id);
        return updatedData ? { ...localParticle, data: updatedData } : localParticle;
      });

      return [...updatedExistingParticles, ...newParticles];
    });
  }, [particles, generatePosition]);
  function onParticleClick(data: ParticleData) {
    setCurrentParticle(data);
  }

  return (
    <div ref={containerRef} className="absolute flex size-full items-center justify-center">
      {localParticles.map(({ data, visual }) => (
        <ParticleButton
          onClick={() => onParticleClick(data)}
          key={data.id}
          data={data}
          visual={visual}
          style={{
            position: 'absolute',
            top: `${visual.top}%`,
            left: `${visual.left}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
};

const isInsideDeadZone = (
  deadZone: {
    top: number,
    bottom: number,
    left: number,
    right: number
  },
  left: number,
  top: number
) => {
  return left >= deadZone.left && left <= deadZone.right && top >= deadZone.top && top <= deadZone.bottom;
};
