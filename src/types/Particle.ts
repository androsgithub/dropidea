export type Particle = {
  data: ParticleData;
  visual: ParticleVisual;
  states: ParticleState;
};
export type ParticleData = {
  id: string;
  title: string;
  description: string;
  notes: Note[];
  insight?: string;
  tasks?: Task[];
  tags?: string[];
};

export type ParticleVisual = {
  top: number;
  left: number;
  phase: number;
  color: string;
  icon: string;
};

export type ParticleState = {
  generatingInsight?: boolean;
};

export type Note = {
  id: string;
  text: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  done: boolean;
};
