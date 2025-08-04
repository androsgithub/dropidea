import { Trash, X } from 'lucide-react';
import type { ParticleData } from '../../types/Particle';

export function ParticleHeader({
  currentParticle,
  deleteParticle,
  close
}: {
  currentParticle: ParticleData,
  deleteParticle: (id: string) => void,
  close: () => void
}) {
  function removeParticle() {
    if (confirm(`Quer mesmo deletar a particula: ${currentParticle.title}?`)) {
      deleteParticle(currentParticle.id);
      close();
    }
  }
  return (
    <div className="flex items-center justify-between gap-2">
      <button type="button" onClick={removeParticle} className="cursor-pointer rounded-md p-1.5 hover:bg-neutral-400/5">
        <Trash size={16} />
      </button>

      <p className="w-full truncate pr-4 text-xl font-bold">{currentParticle.title}</p>

      <button className="cursor-pointer rounded-md p-1.5 hover:bg-neutral-400/5" onClick={close} type="button">
        <X size={16} />
      </button>
    </div>
  );
}
