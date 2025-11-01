import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo } from 'react';
import { create } from 'zustand';
import { db } from '../db/particle';
import type { Particle } from '../types/Particle';

// Store para cache das particles
type ParticlesStore = {
  particles: Particle[];
  setParticles: (particles: Particle[]) => void;
  updateParticle: (particle: Particle) => void;
  addParticle: (particle: Particle) => void;
  removeParticle: (id: string) => void;
  clearCache: () => void;
};

const useParticlesStore = create<ParticlesStore>((set) => ({
  particles: [],
  setParticles: (particles) => set({ particles }),
  updateParticle: (updatedParticle) =>
    set((state) => ({
      particles: state.particles.map((p) => (p.data.id === updatedParticle.data.id ? updatedParticle : p))
    })),
  addParticle: (newParticle) =>
    set((state) => ({
      particles: [...state.particles, newParticle]
    })),
  removeParticle: (id) =>
    set((state) => ({
      particles: state.particles.filter((p) => p.data.id !== id)
    })),
  clearCache: () => set({ particles: [] })
}));

export const useParticles = () => {
  const {
    particles: cachedParticles,
    setParticles,
    updateParticle,
    addParticle,
    removeParticle,
    clearCache
  } = useParticlesStore();

  // Só faz query inicial se não temos cache
  const liveParticles = useLiveQuery(async () => {
    console.log('adsdsdsdsdssadasds');
    if (cachedParticles.length > 0) {
      // Se já temos cache, apenas sincroniza em background
      const dbParticles = await db.particles.toArray();
      if (JSON.stringify(dbParticles) !== JSON.stringify(cachedParticles)) {
        console.log('Sincronizando particles com BD');
        setParticles(dbParticles);
        return dbParticles;
      }
      return cachedParticles;
    }

    console.log('Carregando particles inicial do BD');
    const dbParticles = await db.particles.toArray();
    setParticles(dbParticles);
    return dbParticles;
  }, []);

  // Usa sempre o cache
  const particles = cachedParticles.length > 0 ? cachedParticles : liveParticles || [];

  // Derivações computadas do cache
  const activeParticles = useMemo(() => particles.filter((p) => !p.data.deleted), [particles]);

  const deletedParticles = useMemo(() => particles.filter((p) => p.data.deleted), [particles]);

  // Actions otimizadas
  const actions = useMemo(
    () => ({
      async add(particle: Particle) {
        await db.particles.add(particle);
        addParticle(particle);
        return particle;
      },

      async update(id: string, changes: Partial<Particle>) {
        const existing = particles.find((p) => p.data.id === id);
        if (!existing) throw new Error('Particle não encontrada');

        const updated: Particle = {
          data: { ...existing.data, ...changes.data },
          visual: { ...existing.visual, ...changes.visual },
          states: { ...existing.states, ...changes.states }
        };

        await db.particles.put(updated);
        updateParticle(updated);
        return updated;
      },

      async remove(id: string) {
        // Soft delete - marca data.deleted como true
        const existing = particles.find((p) => p.data.id === id);
        if (!existing) return;

        const updated: Particle = {
          ...existing,
          data: {
            ...existing.data,
            deleted: true
          }
        };

        await db.particles.put(updated);
        updateParticle(updated);
        return updated;
      },

      async hardDelete(id: string) {
        // Delete permanente
        const existing = particles.find((p) => p.data.id === id);
        if (!existing) return;

        await db.particles.delete(existing.data.id!);
        removeParticle(id);
        return id;
      },

      async restore(id: string) {
        const existing = particles.find((p) => p.data.id === id);
        if (!existing) return;

        const updated: Particle = {
          ...existing,
          data: {
            ...existing.data,
            deleted: false
          }
        };

        await db.particles.put(updated);
        updateParticle(updated);
        return updated;
      },

      async getById(id: string) {
        // Primeiro tenta do cache
        const cached = particles.find((p) => p.data.id === id);
        if (cached) return cached;

        // Se não encontrar no cache, busca no BD
        return await db.particles.where('data.id').equals(id).first();
      },

      async getByTag(tag: string) {
        // Filtra do cache primeiro
        const cachedResults = particles.filter((p) => p.data.tags?.includes(tag));
        if (cachedResults.length > 0 || particles.length > 0) {
          return cachedResults;
        }

        // Se não tem cache, busca no BD
        return await db.particles.where('data.tags').equals(tag).toArray();
      },

      getIncompleteTasks() {
        // Agora é síncrono usando o cache
        return particles.filter((p) => !p.data.deleted && (p.data.tasks?.some((t) => !t.done) ?? false));
      },

      // Função para recarregar do BD quando necessário
      async refreshFromDB() {
        console.log('Recarregando particles do BD');
        const dbParticles = await db.particles.toArray();
        setParticles(dbParticles);
        return dbParticles;
      },

      // Função para limpar cache
      clearParticlesCache() {
        clearCache();
      }
    }),
    [particles, addParticle, updateParticle, removeParticle, setParticles, clearCache]
  );

  return {
    // Data
    particles,
    activeParticles,
    deletedParticles,

    // Actions
    ...actions,

    // Loading state - simplificado
    isLoading: particles.length === 0 && liveParticles === undefined
  };
};
