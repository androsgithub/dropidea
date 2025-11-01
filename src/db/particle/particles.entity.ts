import type { Particle, ParticleData, ParticleState, ParticleVisual } from '../../types/Particle';

export class ParticleEntity implements Particle {
  data: ParticleData;
  visual: ParticleVisual;
  states: ParticleState;

  constructor(p: Particle) {
    this.data = p.data;
    this.visual = p.visual;
    this.states = p.states;
  }

  // Exemplo: progresso de tasks
  get taskProgress() {
    const tasks = this.data.tasks ?? [];
    if (!tasks.length) return 0;
    const done = tasks.filter((t) => t.done).length;
    return Math.round((done / tasks.length) * 100);
  }
}
