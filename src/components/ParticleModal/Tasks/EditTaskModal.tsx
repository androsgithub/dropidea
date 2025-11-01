import { Pencil, X } from 'lucide-react';
import type { Particle, Task } from '../../../types/Particle';
import { Modal } from '../../Modal';

type NewTaskModalProps = {
  isOpen: boolean;
  setCurrentTask: (isCreatingNewTask: Task | null) => void;
  currentTask: Task | null;
  currentParticle: Particle | null | undefined;
  updateCurrentParticle: (changes: Partial<Particle>) => Promise<Particle | null>;
};
export function EditTaskModal({
  isOpen,
  setCurrentTask,
  currentTask,
  currentParticle,
  updateCurrentParticle
}: NewTaskModalProps) {
  function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentParticle) return;
    if (!currentTask) return;
    const formData = new FormData(e.currentTarget);
    const taskTitle = (formData.get('title') as string) ?? '';
    const taskDescription = (formData.get('description') as string) ?? '';

    if (taskTitle != '') {
      const editedTask: Task = {
        id: currentTask?.id,
        title: taskTitle,
        description: taskDescription,
        done: currentTask?.done
      };

      if (!currentParticle.data.tasks) currentParticle.data.tasks = [];
      currentParticle.data.tasks = currentParticle.data.tasks?.map((task) =>
        task.id == currentTask?.id ? editedTask : task
      );
      updateCurrentParticle(currentParticle);
    }
    setCurrentTask(null);
  }

  return (
    <Modal open={isOpen} onClose={() => {}}>
      <form onSubmit={handleEdit} className="flex flex-col p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">{currentTask ? `Editando nova taréfa` : `Criando nova taréfa`}</h1>
          <button
            onClick={() => setCurrentTask(null)}
            className="flex cursor-pointer items-center justify-center rounded-2xl p-2 transition-all hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>
        <label htmlFor="title" className="mt-2 text-sm">
          Titulo:
        </label>
        <input
          type="text"
          name="title"
          className="rounded-xl bg-white/2.5 p-2 px-4 outline outline-white/5"
          defaultValue={currentTask?.title}
        />
        <label htmlFor="title" className="mt-2 text-sm">
          Descrição:
        </label>
        <textarea
          name="description"
          className="scrollbar-float h-32 resize-none rounded-xl bg-white/2.5 p-2 px-4 outline outline-white/5"
          defaultValue={currentTask?.description}
        />
        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            onClick={() => setCurrentTask(null)}
            type="button"
            className="flex cursor-pointer items-center justify-center gap-1 rounded-2xl bg-red-500/10 p-2 px-4 text-sm font-semibold text-red-500 outline outline-red-500/15 transition-all hover:bg-red-500/15"
          >
            <X size={16} strokeWidth={2} /> Cancelar
          </button>
          <button
            type="submit"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-500/10 p-2 px-4 font-semibold text-blue-600 transition-all hover:bg-blue-500/15"
          >
            <Pencil size={20} strokeWidth={3} /> Editar
          </button>
        </div>
      </form>
    </Modal>
  );
}
