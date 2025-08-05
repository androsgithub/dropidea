import { Trash } from 'lucide-react';
import type { ParticleData } from '../../types/Particle';

export function ParticleHeader({
  currentParticle,
  deleteParticle,
  close
}: {
  currentParticle: ParticleData;
  deleteParticle: (id: string) => void;
  close: () => void;
}) {
  function removeParticle() {
    if (confirm(`Quer mesmo deletar a particula: ${currentParticle.title}?`)) {
      deleteParticle(currentParticle.id);
      close();
    }
  }
  return (
    <div className="relative flex items-center justify-between gap-2">
      <p className="w-full truncate px-4 text-xs text-neutral-500">{currentParticle.title}</p>
      <button
        type="button"
        onClick={removeParticle}
        className="absolute left-[-5rem] cursor-pointer rounded-xl bg-red-500 p-4 transition-all hover:bg-red-600"
      >
        <Trash size={20} />
      </button>
    </div>
  );
}
