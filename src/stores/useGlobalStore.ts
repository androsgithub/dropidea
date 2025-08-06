import { create } from 'zustand';
import type { Particle } from '../types/Particle';

type Store = {
  // States
  creating: boolean;
  setCreating: (creating: boolean) => void;

  // Data
  particles: Particle[];
  deletedParticles: Particle[];

  addParticle: (particle: Particle) => void;
  updateParticle: (particle: Particle) => void;
  deleteParticle: (id: string) => void;
  restoreParticle: (id: string) => void;

  // Current
  currentParticle: Particle | null;
  setCurrentParticle: (particle: Particle | null) => void;
};

export const useGlobalStore = create<Store>((set) => ({
  creating: false,
  setCreating: (creating) => set(() => ({ creating })),

  particles: JSON.parse(localStorage.getItem('particlesData') ?? '[]'),
  deletedParticles: JSON.parse(localStorage.getItem('deletedParticles') ?? '[]'),

  addParticle: (particle) =>
    set((state) => {
      const _particles = [...state.particles, particle];
      localStorage.setItem('particlesData', JSON.stringify(_particles));
      return { particles: _particles };
    }),

  updateParticle: (updatedParticle) =>
    set((state) => {
      const _particles = state.particles.map((p) => (p.data.id === updatedParticle.data.id ? updatedParticle : p));
      localStorage.setItem('particlesData', JSON.stringify(_particles));
      return { particles: _particles };
    }),

  deleteParticle: (id) =>
    set((state) => {
      const _particles = state.particles.filter((p) => p.data.id !== id);

      const deletedParticle = state.particles.find((p) => p.data.id === id);
      if (!deletedParticle) return {};

      const _deletedParticles = [...state.deletedParticles, deletedParticle];

      localStorage.setItem('particlesData', JSON.stringify(_particles));
      localStorage.setItem('deletedParticles', JSON.stringify(_deletedParticles));

      return { particles: _particles, deletedParticles: _deletedParticles };
    }),

  restoreParticle: (id) =>
    set((state) => {
      const restoredParticle = state.deletedParticles.find((p) => p.data.id === id);
      if (!restoredParticle) return {};

      const _deletedParticles = state.deletedParticles.filter((p) => p.data.id !== id);
      const _particles = [...state.particles, restoredParticle];

      // Atualiza localStorage para ambos arrays
      localStorage.setItem('particlesData', JSON.stringify(_particles));
      localStorage.setItem('deletedParticles', JSON.stringify(_deletedParticles));

      return { particles: _particles, deletedParticles: _deletedParticles };
    }),

  currentParticle: null,
  setCurrentParticle: (particle) => set(() => ({ currentParticle: particle }))
}));
