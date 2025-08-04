import { create } from 'zustand';
import type { ParticleData } from '../types/Particle';

type Store = {
  // States
  creating: boolean,
  setCreating: (creating: boolean) => void,

  // Data
  particles: ParticleData[],
  deletedParticles: ParticleData[],

  addParticle: (particle: ParticleData) => void,
  updateParticle: (particle: ParticleData) => void,
  deleteParticle: (id: string) => void,
  restoreParticle: (id: string) => void,

  // Current
  currentParticle: ParticleData | null,
  setCurrentParticle: (particle: ParticleData | null) => void
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
      const _particles = state.particles.map((p) => (p.id === updatedParticle.id ? updatedParticle : p));
      localStorage.setItem('particlesData', JSON.stringify(_particles));
      return { particles: _particles };
    }),

  deleteParticle: (id) =>
    set((state) => {
      // Filtra a partícula deletada da lista principal
      const _particles = state.particles.filter((p) => p.id !== id);

      // Busca a partícula deletada para salvar no deletedParticles
      const deletedParticle = state.particles.find((p) => p.id === id);
      if (!deletedParticle) return {}; // Se não achou, não faz nada

      const _deletedParticles = [...state.deletedParticles, deletedParticle];

      // Atualiza localStorage para ambos arrays
      localStorage.setItem('particlesData', JSON.stringify(_particles));
      localStorage.setItem('deletedParticles', JSON.stringify(_deletedParticles));

      return { particles: _particles, deletedParticles: _deletedParticles };
    }),

  restoreParticle: (id) =>
    set((state) => {
      // Busca a partícula a ser restaurada
      const restoredParticle = state.deletedParticles.find((p) => p.id === id);
      if (!restoredParticle) return {};

      // Remove das deletadas
      const _deletedParticles = state.deletedParticles.filter((p) => p.id !== id);
      // Adiciona na lista principal
      const _particles = [...state.particles, restoredParticle];

      // Atualiza localStorage para ambos arrays
      localStorage.setItem('particlesData', JSON.stringify(_particles));
      localStorage.setItem('deletedParticles', JSON.stringify(_deletedParticles));

      return { particles: _particles, deletedParticles: _deletedParticles };
    }),

  currentParticle: null,
  setCurrentParticle: (particle) => set(() => ({ currentParticle: particle }))
}));
