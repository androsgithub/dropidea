import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronRight, Pencil, Trash } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { useInterval } from 'usehooks-ts';
import type { Particle, Task } from '../../../types/Particle';

export function TaskTile({
  task,
  setCurrentTask,
  currentParticle,
  updateCurrentParticle
}: {
  task: Task;
  setCurrentTask: (task: Task) => void;
  currentParticle: Particle | null | undefined;
  updateCurrentParticle: (changes: Partial<Particle>) => Promise<Particle | null>;
}) {
  const [isOptionsOpened, setIsOptionsOpened] = useState(false);

  useInterval(() => setIsOptionsOpened(false), isOptionsOpened ? 5000 : null);

  function onTaskDelete(id: string) {
    if (!currentParticle) return;
    if (confirm('Deseja mesmo deletar essa tarefa?')) {
      currentParticle.data.tasks = currentParticle.data.tasks?.filter((task) => task.id !== id);
      updateCurrentParticle(currentParticle);
    }
  }

  return (
    <div className="flex items-center px-4">
      <motion.label
        key={task.id}
        animate={{
          backgroundColor: task.done ? '#ffffff5' : '#ffffff14'
        }}
        whileHover={{
          backgroundColor: task.done ? '#ffffffc' : '#ffffff22'
        }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="group/task relative flex h-16 flex-1 cursor-pointer items-center gap-2 rounded-2xl border border-white/2 px-4 select-none"
      >
        <input
          id={task.id}
          type="checkbox"
          className="peer sr-only"
          defaultChecked={task.done}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (!currentParticle) return;
            const { id, checked } = e.currentTarget;
            currentParticle.data.tasks = currentParticle.data.tasks?.map((task) =>
              task.id === id ? { ...task, done: checked } : task
            );

            updateCurrentParticle(currentParticle);
            task.done = checked;
          }}
        />
        <Check
          strokeWidth={4}
          className="pointer-events-none absolute right-4 z-50 size-4 self-center rounded-full bg-white/5 p-0.25 text-transparent transition-all duration-250 ease-in-out peer-checked:bg-transparent peer-checked:text-green-500"
        />

        <div className="flex-1 decoration-neutral-200 peer-checked:line-through">
          <p className="text-sm">{task.title}</p>
          <p className="line-clamp-2 text-xs text-neutral-500">
            {task.description ? task.description : 'Sem descrição'}
          </p>
        </div>
      </motion.label>
      <motion.div
        className="flex h-14 p-2"
        animate={{ scale: 1, gap: isOptionsOpened ? '8px' : '0px' }}
        transition={{
          duration: 0.5,
          type: 'spring'
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.button
            key={task.id + 'morebtn'}
            className="flex aspect-square flex-1 cursor-pointer items-center justify-center rounded-2xl bg-white/5 text-white/50 outline outline-white/7.5 brightness-100 hover:brightness-125"
            onClick={() => setIsOptionsOpened((prev) => !prev)}
            animate={{ scale: 1, width: 'auto', rotate: isOptionsOpened ? 180 : 0 }}
            exit={{ scale: 0, width: 0, rotate: 90 }}
            transition={{
              duration: 1,
              bounce: 0.5,
              type: 'spring'
            }}
          >
            <ChevronRight size={20} />
          </motion.button>

          {isOptionsOpened && (
            <>
              <motion.button
                key={task.id + 'deletebtn'}
                className="flex aspect-square flex-1 cursor-pointer items-center justify-center rounded-2xl bg-red-500/10 text-red-500 outline outline-red-500/15 brightness-100 hover:brightness-125"
                onClick={() => onTaskDelete(task.id)}
                initial={{ scale: 0, width: 0, rotate: 90, x: -64 }}
                animate={{ scale: 1, width: 'auto', rotate: 0, x: 0 }}
                exit={{ scale: 0, width: 0, rotate: -90, x: -64 }}
                transition={{
                  duration: 0.5,
                  bounce: 0.25,
                  type: 'spring'
                }}
              >
                <Trash size={16} />
              </motion.button>
              <motion.button
                key={task.id + 'editbtn'}
                className="flex aspect-square flex-1 cursor-pointer items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 outline outline-blue-500/15 brightness-100 hover:brightness-125"
                onClick={() => setCurrentTask(task)}
                initial={{ scale: 0, width: 0, rotate: 90, x: -64 }}
                animate={{ scale: 1, width: 'auto', rotate: 0, x: 0 }}
                exit={{ scale: 0, width: 0, rotate: -90, x: -64 }}
                transition={{
                  duration: 0.5,
                  bounce: 0.25,
                  type: 'spring'
                }}
              >
                <Pencil size={16} />
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
