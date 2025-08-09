import { Trash } from 'lucide-react';
import type { Particle } from '../../types/Particle';

export function ParticleHeader({
  currentParticle,
  deleteParticle,
  close
}: {
  currentParticle: Particle;
  deleteParticle: (id: string) => void;
  close: () => void;
}) {
  function removeParticle() {
    if (confirm(`Quer mesmo deletar a particula: ${currentParticle.data.title}?`)) {
      deleteParticle(currentParticle.data.id);
      close();
    }
  }
  return (
    <div className="relative flex items-center justify-between gap-2">
      <p className="w-full truncate px-4 text-xs text-neutral-500">{currentParticle.data.title}</p>
      <button
        type="button"
        onClick={removeParticle}
        className="cursor-pointer rounded-xl bg-red-500 p-2 transition-all hover:bg-red-600 md:absolute md:left-[-5rem] md:p-4"
      >
        <Trash size={20} />
      </button>
    </div>
  );
}
