import { Save, X } from 'lucide-react';
import type { Particle } from '../../types/Particle';
import { Modal } from '../Modal';

type DescriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentParticle: Particle | null | undefined;
  updateCurrentParticle: (changes: Partial<Particle>) => Promise<Particle | null>;
};
export function EditDescriptionModal({
  isOpen,
  onClose,
  currentParticle,
  updateCurrentParticle
}: DescriptionModalProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentParticle) return;
    const formData = new FormData(e.currentTarget);
    const description = (formData.get('description') as string) ?? '';

    if (description != '') {
      currentParticle.data.description = description;
      updateCurrentParticle(currentParticle);
    }
    onClose();
  }

  return (
    <Modal open={isOpen} onClose={() => {}}>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Editando Descrição</h1>

          <button
            onClick={() => onClose}
            className="flex cursor-pointer items-center justify-center rounded-2xl p-2 transition-all hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>
        <p className="py-2 text-sm text-neutral-600">Você vai estar modificando o descrição da sua particula!</p>
        <textarea
          name="description"
          className="scrollbar-float resize-none rounded-xl bg-white/5 p-2 px-4 outline-0"
          defaultValue={currentParticle?.data.description}
        />
        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            type="button"
            className="flex cursor-pointer items-center justify-center gap-1 rounded-2xl bg-red-500/10 p-2 px-4 text-sm font-semibold text-red-500 outline outline-red-500/15 transition-all hover:bg-red-500/15"
          >
            <X size={16} strokeWidth={2} /> Cancelar
          </button>
          <button
            type="submit"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-500/10 p-2 px-4 text-sm font-semibold text-blue-600 outline outline-blue-500/15 transition-all hover:bg-blue-500/15"
          >
            <Save size={16} strokeWidth={2} /> Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
