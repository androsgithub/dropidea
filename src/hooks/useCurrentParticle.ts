import { useLiveQuery } from 'dexie-react-hooks';
import { create } from 'zustand';
import { db } from '../db/particle';
import type { Particle } from '../types/Particle';

// Store que mantém tanto o ID quanto a particle em cache
type CurrentParticleStore = {
  currentParticleId: string | null;
  currentParticle: Particle | null;
  setCurrentParticleId: (id: string | null) => void;
  setCurrentParticle: (particle: Particle | null) => void;
  clearCache: () => void;
};

const useCurrentParticleStore = create<CurrentParticleStore>((set) => ({
  currentParticleId: null,
  currentParticle: null,
  setCurrentParticleId: (id) => set({ currentParticleId: id }),
  setCurrentParticle: (particle) => set({ currentParticle: particle }),
  clearCache: () => set({ currentParticle: null, currentParticleId: null })
}));

export const useCurrentParticle = () => {
  const {
    currentParticleId,
    currentParticle: cachedParticle,
    setCurrentParticleId,
    setCurrentParticle,
    clearCache
  } = useCurrentParticleStore();

  // Só faz a consulta reativa quando há um ID e não temos cache
  const liveParticle = useLiveQuery(async () => {
    if (!currentParticleId) return null;

    // Se já temos a particle em cache, não consulta novamente
    if (cachedParticle && cachedParticle.data.id === currentParticleId) {
      return cachedParticle;
    }

    console.log('Buscando particle no BD:', currentParticleId);
    const particle = await db.particles.where('data.id').equals(currentParticleId).first();

    // Atualiza o cache quando encontrar
    if (particle) {
      setCurrentParticle(particle);
    }

    return particle;
  }, [currentParticleId, cachedParticle?.data.id]);

  // Usa o cache quando disponível, senão usa o resultado da query
  const currentParticle = cachedParticle || liveParticle;

  const actions = {
    setCurrentParticle: (particle: Particle | null) => {
      setCurrentParticleId(particle?.data.id || null);
      setCurrentParticle(particle);
    },

    async updateCurrentParticle(changes: Partial<Particle>) {
      if (!currentParticleId) return null;

      // Always fetch latest from DB first to avoid stale-cache overwrite races
      const freshest = await db.particles.where('data.id').equals(currentParticleId).first();
      const existing = freshest || currentParticle;
      if (!existing) return null;

      const updated: Particle = {
        data: { ...existing.data, ...changes.data },
        visual: { ...existing.visual, ...changes.visual },
        states: { ...existing.states, ...changes.states }
      };

      console.log('Atualizando particle:', currentParticleId);
      await db.particles.put(updated);

      // Atualiza o cache imediatamente
      setCurrentParticle(updated);

      return updated;
    },

    async addTagToCurrentParticle(tag: string) {
      if (!currentParticle || currentParticle.data.tags?.includes(tag)) return;

      const newTags = [...(currentParticle.data.tags || []), tag];
      return await actions.updateCurrentParticle({
        data: { ...currentParticle.data, tags: newTags }
      });
    },

    async removeTagFromCurrentParticle(tag: string) {
      if (!currentParticle) return;

      const newTags = currentParticle.data.tags?.filter((t) => t !== tag) || [];
      return await actions.updateCurrentParticle({
        data: { ...currentParticle.data, tags: newTags }
      });
    },

    async addNoteToCurrentParticle(text: string) {
      if (!currentParticle) return;

      const newNote = {
        id: crypto.randomUUID(),
        text
      };

      const newNotes = [...currentParticle.data.notes, newNote];
      return await actions.updateCurrentParticle({
        data: { ...currentParticle.data, notes: newNotes }
      });
    },

    async updateNoteInCurrentParticle(noteId: string, text: string) {
      if (!currentParticle) return;

      const newNotes = currentParticle.data.notes.map((note) => (note.id === noteId ? { ...note, text } : note));

      return await actions.updateCurrentParticle({
        data: { ...currentParticle.data, notes: newNotes }
      });
    },

    async removeNoteFromCurrentParticle(noteId: string) {
      if (!currentParticle) return;

      const newNotes = currentParticle.data.notes.filter((note) => note.id !== noteId);
      return await actions.updateCurrentParticle({
        data: { ...currentParticle.data, notes: newNotes }
      });
    },

    async addTaskToCurrentParticle(title: string, description: string = '') {
      if (!currentParticle) return;

      const newTask = {
        id: crypto.randomUUID(),
        title,
        description,
        done: false
      };

      const newTasks = [...(currentParticle.data.tasks || []), newTask];
      return await actions.updateCurrentParticle({
        data: { ...currentParticle.data, tasks: newTasks }
      });
    },

    async toggleTaskInCurrentParticle(taskId: string) {
      if (!currentParticle) return;

      const newTasks =
        currentParticle.data.tasks?.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)) || [];

      return await actions.updateCurrentParticle({
        data: { ...currentParticle.data, tasks: newTasks }
      });
    },

    async removeTaskFromCurrentParticle(taskId: string) {
      if (!currentParticle) return;

      const newTasks = currentParticle.data.tasks?.filter((task) => task.id !== taskId) || [];
      return await actions.updateCurrentParticle({
        data: { ...currentParticle.data, tasks: newTasks }
      });
    },

    async updateInsightInCurrentParticle(insight: string | string[]) {
      if (!currentParticle) return;

      return await actions.updateCurrentParticle({ data: { ...currentParticle.data, insight } });
    },

    async setGeneratingInsight(generating: boolean) {
      if (!currentParticle) return;

      return await actions.updateCurrentParticle({
        states: { ...currentParticle.states, generatingInsight: generating }
      });
    },

    // Função para limpar o cache quando necessário
    clearParticleCache: () => {
      clearCache();
    }
  };

  return {
    currentParticle,
    currentParticleId,
    isLoading: false, // Não há mais loading já que usamos cache
    ...actions
  };
};
