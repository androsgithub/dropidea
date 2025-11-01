import type { Particle } from '../../types/Particle';
import { db } from './particles.db';

export class ParticleService {
  private readonly database;

  constructor(database = db) {
    this.database = database;
  }

  async add(particle: Particle) {
    return this.database.particles.add(particle);
  }

  async get(id: string) {
    return this.database.particles.get({ 'data.id': id });
  }

  async update(id: string, changes: Partial<Particle>) {
    return this.database.particles.update(id, changes);
  }

  async remove(id: string) {
    return this.database.particles.delete(id);
  }

  async getAll() {
    return this.database.particles.toArray();
  }

  async getByTag(tag: string) {
    return this.database.particles.where('data.tags').equals(tag).toArray();
  }

  async getIncompleteTasks() {
    return this.database.particles.filter((p) => p.data.tasks?.some((t) => !t.done) ?? false).toArray();
  }
}

export const particleService = new ParticleService();
