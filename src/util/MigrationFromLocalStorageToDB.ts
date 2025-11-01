import { particleService } from '../db/particle/particle.service';
import type { Particle } from '../types/Particle';

/**
 * Migra dados de partículas do localStorage para o IndexedDB (Dexie).
 * @param storageKey Nome da chave no localStorage (ex: "particles")
 * @param clearAfterRemove Se true, remove a chave do localStorage após migrar
 */
export async function migrateParticlesFromLocalStorage(storageKey = 'particles', clearAfterRemove = true) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { migrated: 0, message: 'Nenhum dado encontrado no localStorage.' };

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { migrated: 0, message: 'Erro ao parsear JSON do localStorage.' };
    }

    if (!Array.isArray(parsed)) {
      return { migrated: 0, message: 'Formato inválido. Esperado um array.' };
    }

    const particles: Particle[] = parsed;

    // Salva em lote no IndexedDB
    await Promise.all(
      particles.map(async (p) => {
        if (!(await particleService.get(p.data.id))) particleService.add(p);
      })
    );

    if (clearAfterRemove) {
      localStorage.removeItem(storageKey);
    }

    return { migrated: particles.length, message: 'Migração concluída.' };
  } catch (error) {
    console.error('Erro na migração:', error);
    return { migrated: 0, message: 'Falha na migração.' };
  }
}
