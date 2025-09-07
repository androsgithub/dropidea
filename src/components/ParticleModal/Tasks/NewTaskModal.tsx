import { v1 as uuid } from 'uuid';

import { Check, X } from 'lucide-react';
import { useGlobalStore } from '../../../stores/useGlobalStore';
import type { Task } from '../../../types/Particle';
import { Modal } from '../../Modal';

type NewTaskModalProps = {
  isOpen: boolean;
  setIsOpen: (isCreatingNewTask: boolean) => void;
};
export function NewTaskModal({ isOpen, setIsOpen }: NewTaskModalProps) {
  const currentParticle = useGlobalStore((state) => state.currentParticle);
  const updateParticle = useGlobalStore((state) => state.updateParticle);

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentParticle) return;
    const formData = new FormData(e.currentTarget);
    const taskTitle = (formData.get('title') as string) ?? '';
    const taskDescription = (formData.get('description') as string) ?? '';

    if (taskTitle != '') {
      const task: Task = {
        id: uuid(),
        title: taskTitle,
        description: taskDescription,
        done: false
      };

      if (!currentParticle.data.tasks) currentParticle.data.tasks = [];
      currentParticle.data.tasks?.unshift(task);
      updateParticle(currentParticle);
    }
    setIsOpen(false);
  }

  return (
    <Modal open={isOpen} onClose={() => {}}>
      <form onSubmit={handleCreate} className="flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Criando nova taréfa</h1>
          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="flex cursor-pointer items-center justify-center rounded-2xl p-2 transition-all hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>
        <label htmlFor="title" className="mt-2 text-sm">
          Titulo:
        </label>
        <input type="text" name="title" className="rounded-xl bg-white/2.5 p-2 px-4 text-sm outline outline-white/5" />
        <label htmlFor="title" className="mt-2 text-sm">
          Descrição:
        </label>
        <textarea
          name="description"
          className="scrollbar-float h-32 resize-none rounded-xl bg-white/2.5 p-2 px-4 text-sm outline outline-white/5"
        />
        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="flex cursor-pointer items-center justify-center gap-1 rounded-2xl bg-red-500/10 p-2 px-4 text-sm font-semibold text-red-500 outline outline-red-500/15 transition-all hover:bg-red-500/15"
          >
            <X size={16} strokeWidth={2} /> Cancelar
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="flex cursor-pointer items-center justify-center gap-1 rounded-2xl bg-green-500/10 p-2 px-4 text-sm font-semibold text-green-600 outline outline-green-500/15 transition-all hover:bg-green-500/15"
          >
            <Check size={16} strokeWidth={2} /> Criar
          </button>
        </div>
      </form>
    </Modal>
  );
}
