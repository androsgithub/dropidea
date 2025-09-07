import { Save, X } from 'lucide-react';
import { useGlobalStore } from '../../stores/useGlobalStore';
import { Modal } from '../Modal';

type TitleModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
export function EditTitleModal({ isOpen, onClose }: TitleModalProps) {
  const currentParticle = useGlobalStore((state) => state.currentParticle);
  const updateParticle = useGlobalStore((state) => state.updateParticle);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentParticle) return;
    const formData = new FormData(e.currentTarget);
    const title = (formData.get('title') as string) ?? '';

    if (title != '') {
      currentParticle.data.title = title;
      updateParticle(currentParticle);
    }
    onClose();
  }

  return (
    <Modal open={isOpen} onClose={() => {}}>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Editando Titulo</h1>

          <button
            onClick={() => onClose}
            className="flex cursor-pointer items-center justify-center rounded-2xl p-2 transition-all hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>
        <p className="py-2 text-sm text-neutral-600">Você vai estar modificando o titulo da sua particula!</p>
        <input
          name="title"
          className="scrollbar-float resize-none rounded-xl bg-white/5 p-2 px-4 outline-0"
          defaultValue={currentParticle?.data.title}
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
