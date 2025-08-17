import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Check, Edit, MoreVertical, Trash } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { useInterval } from 'usehooks-ts';
import type { Task } from '../../../types/Particle';

type ParticleTaskProps = {
  particleTask: Task;
  onTaskChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTaskDelete: (id: string) => void;
};
export default function ParticleTask({ particleTask, onTaskChange, onTaskDelete }: ParticleTaskProps) {
  const [isShowingOptions, setIsShowingOptions] = useState(false);
  const [isHoveringOptions, setIsHoveringOptions] = useState(false);
  const taskVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0,
      height: 0,
      x: -100,
      marginBottom: '0rem'
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      height: '5rem',
      marginBottom: '1rem'
    }
  };

  useInterval(
    () => {
      if (!isHoveringOptions) setIsShowingOptions(false);
    },
    isShowingOptions ? 5000 : null
  );
  return (
    <motion.div
      className="flex w-full gap-2"
      variants={taskVariants}
      exit={{
        opacity: 0,
        height: 0,
        scale: 0,
        marginBottom: '0rem',
        transition: {
          duration: 0.3
        }
      }}
      layout
    >
      <motion.label className="group/task relative flex flex-1 cursor-pointer items-center gap-2 select-none">
        <input
          id={particleTask.id}
          type="checkbox"
          className="peer sr-only"
          defaultChecked={particleTask.done}
          onChange={onTaskChange}
        />
        <Check
          size={16}
          strokeWidth={3}
          className="pointer-events-none absolute top-4 right-4 z-50 scale-0 text-white opacity-0 transition-all duration-250 ease-in-out peer-checked:scale-100 peer-checked:opacity-100"
        />

        <div className="flex h-20 flex-1 justify-between rounded-2xl bg-neutral-800 px-4 py-2 decoration-neutral-400 brightness-100 transition-all group-hover/task:brightness-110 peer-checked:line-through peer-checked:brightness-50">
          <div className="flex flex-1 flex-col items-start">
            <p className="font-semibold">{particleTask.title}</p>
            <p className="text-xs font-semibold text-neutral-500">{particleTask.description}</p>
          </div>
        </div>
      </motion.label>

      <motion.div
        className="flex flex-col items-center justify-between overflow-hidden rounded-xl bg-white/5"
        initial={{ width: '0', opacity: 0 }}
        animate={{ width: '2rem', opacity: 1 }}
        exit={{ width: '0', opacity: 0 }}
      >
        <AnimatePresence mode="wait">
          {!isShowingOptions ? (
            <motion.button
              key="options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.05 }}
              className="flex size-10 h-full cursor-pointer items-center justify-center brightness-100 transition hover:bg-white/5 hover:brightness-150"
              onClick={() => setIsShowingOptions(true)}
              type="button"
            >
              <MoreVertical className="text-neutral-400" size={20} />
            </motion.button>
          ) : (
            <>
              <motion.button
                key="options-1"
                exit={{ scale: 0, opacity: 0 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.05 }}
                className="flex size-10 cursor-pointer items-center justify-center self-center brightness-100 transition hover:bg-white/5 hover:brightness-150"
                onHoverEnd={() => setIsHoveringOptions(false)}
                onHoverStart={() => setIsHoveringOptions(true)}
                type="button"
                onClick={() => onTaskDelete(particleTask.id)}
              >
                <Trash className="text-neutral-400" size={18} />
              </motion.button>
              <motion.button
                key="options-2"
                exit={{ scale: 0, opacity: 0 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.05 }}
                className="flex size-10 cursor-pointer items-center justify-center self-center brightness-100 transition hover:bg-white/5 hover:brightness-150"
                onHoverEnd={() => setIsHoveringOptions(false)}
                onHoverStart={() => setIsHoveringOptions(true)}
                type="button"
              >
                <Edit className="text-neutral-400" size={18} />
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
