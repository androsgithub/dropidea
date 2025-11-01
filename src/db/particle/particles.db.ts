import Dexie, { type Table } from 'dexie';
import type { Particle } from '../../types/Particle';
import { ParticleEntity } from './particles.entity';

export class ParticleDB extends Dexie {
  particles!: Table<Particle, string>;

  constructor() {
    super('ParticleDB');

    this.version(1).stores({
      particles: '&data.id, data.title, *data.tags'
    });

    this.particles.mapToClass(ParticleEntity);
  }
}

export const db = new ParticleDB();
