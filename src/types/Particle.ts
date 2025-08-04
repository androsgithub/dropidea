export type Particle = {
  data: ParticleData,
  visual: ParticleVisual
};
export type ParticleData = {
  id: string,
  title: string,
  description: string,
  color: string,
  icon: string,
  notes: Note[],
  insight?: string
};

export type ParticleVisual = {
  top: number,
  left: number,
  phase: number
};

export type Note = {
  id: string,
  text: string
};
