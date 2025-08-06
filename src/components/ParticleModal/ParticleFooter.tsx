import type { Particle } from '../../types/Particle';
import { uuidV1ToDate } from '../../util/UuidDate';

export function ParticleFooter({ currentParticle, close }: { currentParticle: Particle; close: () => void }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 px-4">
        <button
          type="submit"
          className="flex-1 cursor-pointer rounded-xl bg-neutral-100/10 p-2 transition-all hover:bg-neutral-100/15"
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={close}
          className="flex-1 cursor-pointer rounded-xl bg-red-900 p-2 transition-all hover:bg-red-800"
        >
          Cancelar
        </button>
      </div>
      <div className="flex items-center justify-end gap-4">
        <p className="text-xs font-extralight text-neutral-300/25">
          Data: {uuidV1ToDate(currentParticle.data.id)?.toLocaleString()}
        </p>
        <p className="text-xs font-extralight text-neutral-300/25">ID: {currentParticle.data.id}</p>
      </div>
    </div>
  );
}
