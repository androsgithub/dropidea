import type { Particle } from '../types/Particle';

export function generatePosition(existingParticles: Particle[]) {
  const offset = 20;
  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;

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
}
export const isInsideDeadZone = (
  deadZone: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  },
  left: number,
  top: number
) => {
  return left >= deadZone.left && left <= deadZone.right && top >= deadZone.top && top <= deadZone.bottom;
};
