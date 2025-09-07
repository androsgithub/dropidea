import { Plus, X } from 'lucide-react';
import { useGlobalStore } from '../../../stores/useGlobalStore';
import { Modal } from '../../Modal';

type TagModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
export function TagModal({ isOpen, onClose }: TagModalProps) {
  const currentParticle = useGlobalStore((state) => state.currentParticle);
  const updateParticle = useGlobalStore((state) => state.updateParticle);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentParticle) return;
    const formData = new FormData(e.currentTarget);
    const tag = (formData.get('tag') as string) ?? '';
    if (tag.length < 4) return;
    if (Array.isArray(currentParticle.data.tags)) {
      currentParticle.data.tags?.push(tag);
    } else {
      currentParticle.data.tags = [];
      currentParticle.data.tags?.push(tag);
    }

    console.log(currentParticle.data.tags);
    updateParticle(currentParticle);
    onClose();
  }

  return (
    <Modal open={isOpen} onClose={() => {}}>
      <div className="flex items-center justify-center">
        <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">Nova tag</h1>
            <button
              onClick={() => onClose()}
              className="flex cursor-pointer items-center justify-center rounded-2xl p-2 transition-all hover:bg-white/5"
            >
              <X size={20} />
            </button>
          </div>

          <input
            type="text"
            name="tag"
            className="rounded-full bg-white/2.5 p-2 px-4 text-sm outline outline-white/5"
            minLength={4}
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="submit"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-green-500/10 p-2 px-4 text-sm font-semibold text-green-600 outline outline-green-500/15 transition-all hover:bg-green-500/15"
            >
              <Plus size={16} strokeWidth={2} /> Adicionar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
