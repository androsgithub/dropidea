import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Plus } from 'lucide-react';
import { type ChangeEvent } from 'react';
import { v1 as uuid } from 'uuid';
import { useGlobalStore } from '../../../stores/useGlobalStore';
import type { Particle, Task } from '../../../types/Particle';
import ParticleTask from './ParticleTask';

export const ParticleTasks = ({ currentParticle }: { currentParticle: Particle }) => {
  const updateParticle = useGlobalStore((state) => state.updateParticle);
  function onTaskChange(e: ChangeEvent<HTMLInputElement>) {
    const { id, checked } = e.currentTarget;
    currentParticle.data.tasks = currentParticle.data.tasks?.map((task) =>
      task.id === id ? { ...task, done: checked } : task
    );
    updateParticle(currentParticle);
  }
  function handleCreate() {
    const taskTitle = prompt('Tarefa') ?? '';
    const taskDescription = prompt('Descrição') ?? '';
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
  }
  function onTaskDelete(id: string) {
    if (confirm('Deseja mesmo deletar essa tarefa?')) {
      currentParticle.data.tasks = currentParticle.data.tasks?.filter((task) => task.id !== id);
      updateParticle(currentParticle);
    }
  }

  const totalTasksCount = currentParticle.data?.tasks?.length ?? 0;
  const completedTasksCount = currentParticle.data?.tasks?.filter((task) => task.done)?.length ?? 0;

  const listVariants: Variants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {}
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4 overflow-x-visible p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex w-full items-center justify-between">
        {totalTasksCount > 0 ? (
          <p className="font-semibold text-neutral-400">
            {completedTasksCount}/{totalTasksCount} Tarefas finalizadas
          </p>
        ) : (
          <p className="font-semibold text-neutral-400">Sem tarefas</p>
        )}
        <button
          onClick={handleCreate}
          type="button"
          className="flex size-12 scale-95 cursor-pointer items-center justify-between gap-2 self-end justify-self-end rounded-2xl bg-white/5 px-4 py-2 transition-all duration-200 hover:scale-100"
        >
          <Plus />
        </button>
      </div>
      {totalTasksCount > 0 && (
        <motion.div
          className="scrollbar-float max-h-124 w-full flex-1 overflow-x-visible overflow-y-auto pr-2"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {currentParticle.data.tasks &&
              currentParticle.data.tasks.map((task) => (
                <ParticleTask
                  key={task.id}
                  particleTask={task}
                  onTaskChange={onTaskChange}
                  onTaskDelete={onTaskDelete}
                />
              ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};
