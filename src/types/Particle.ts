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
