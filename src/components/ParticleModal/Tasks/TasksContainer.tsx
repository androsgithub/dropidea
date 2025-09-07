import { Plus, Search, X, type LucideProps } from 'lucide-react';
import { useState } from 'react';
import { useGlobalStore } from '../../../stores/useGlobalStore';
import type { Task } from '../../../types/Particle';
import { Pagination } from '../../Pagination';
import { EditTaskModal } from './EditTaskModal';
import { NewTaskModal } from './NewTaskModal';
import { TaskTile } from './TaskTile';

type TasksContainerProps = {
  setCurrentTab: (
    tab: {
      id: string;
      title: string;
      icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
    } | null
  ) => void;
};
export function TasksContainer({ setCurrentTab }: TasksContainerProps) {
  const currentParticle = useGlobalStore((state) => state.currentParticle);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreatingNewTask, setIsCreatingNewTask] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const maxItems = 5;
  const totalPages = Math.ceil((currentParticle?.data?.tasks?.length ?? 0) / maxItems);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  function onPageChange(page: number) {
    goToPage(page);
  }

  return (
    <>
      <NewTaskModal isOpen={isCreatingNewTask} setIsOpen={setIsCreatingNewTask} />
      <EditTaskModal isOpen={currentTask != null} setCurrentTask={setCurrentTask} currentTask={currentTask} />
      <div className="flex items-center justify-between px-4 pt-2">
        <div className="flex items-center justify-center gap-1">
          {currentParticle?.data.tasks?.length && currentParticle?.data.tasks?.length > 0 ? (
            <div className="flex items-center justify-between gap-2 rounded-2xl bg-white/5 p-2 px-4 text-sm">
              <Search size={16} className="text-neutral-600" />
              <input type="text" className="outline-0" />
            </div>
          ) : null}
          <button
            className="relative m-2 flex cursor-pointer items-center justify-center gap-1 rounded-xl bg-white/2.5 p-2 font-semibold text-neutral-400 outline outline-white/5 transition-all select-none hover:bg-white/10"
            onClick={() => setIsCreatingNewTask(true)}
          >
            <Plus size={18} />
          </button>
        </div>
        <button
          className="flex cursor-pointer items-center justify-center rounded-2xl p-2 transition-all hover:bg-white/5"
          onClick={() => setCurrentTab(null)}
        >
          <X size={18} />
        </button>
      </div>
      <div className="scrollbar-float my-2 py-2">
        <div className="flex flex-col gap-2">
          {currentParticle?.data?.tasks
            ?.slice((currentPage - 1) * maxItems, (currentPage - 1) * maxItems + maxItems)
            ?.map((task) => (
              <TaskTile key={task.id} setCurrentTask={setCurrentTask} task={task} />
            ))}

          {currentParticle?.data.tasks?.length == 0 && (
            <p className="p-8 text-center text-xs font-semibold text-neutral-400">Sem tarefas</p>
          )}
        </div>
      </div>

      <div className="mx-2 mb-2 flex items-center justify-between p-2 pt-0">
        <p className="text-xs font-semibold text-neutral-500">{currentParticle?.data.tasks?.length} Tarefas</p>

        <Pagination currentPage={currentPage} onPageChange={onPageChange} totalPages={totalPages}></Pagination>
      </div>
    </>
  );
}
