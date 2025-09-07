import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useGlobalStore } from '../../../stores/useGlobalStore';
import { Tooltip } from '../../Tooltip';
import { TagModal } from './TagModal';

export const TagsSection = () => {
  const currentParticle = useGlobalStore((state) => state.currentParticle);
  const updateParticle = useGlobalStore((state) => state.updateParticle);
  const [isAddingTag, setIsAddingTag] = useState(false);

  function removeTag(tag: string) {
    if (!currentParticle) return;
    if (confirm(`Deseja remover a tag "${tag}"?`)) {
      currentParticle.data.tags = currentParticle.data.tags?.filter((tg) => tg != tag);
      updateParticle(currentParticle);
    }
  }
  return (
    <>
      <TagModal isOpen={isAddingTag} onClose={() => setIsAddingTag(false)} />

      <motion.div
        className="flex items-center gap-1 text-center"
        layout
        transition={{ duration: 0.5, type: 'spring' }}
        animate={{
          width: ''
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {currentParticle?.data.tags?.map((tag) => (
            <motion.button
              key={tag}
              initial={{
                y: 32,
                opacity: 0,
                rotate: 45
              }}
              animate={{
                filter: 'brightness(1)',
                y: 0,
                opacity: 1,
                rotate: 0
              }}
              exit={{
                y: 32,
                opacity: 0,
                rotate: -45
              }}
              whileHover={{
                filter: 'brightness(1.5)'
              }}
              transition={{ duration: 0.75, bounce: 0.5, type: 'spring' }}
              className="group flex cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-white/2 bg-neutral-700/50 p-1 px-2 text-xs hover:gap-1"
              onClick={() => removeTag(tag)}
            >
              <X
                size={12}
                strokeWidth={3}
                className="w-0 scale-0 rotate-180 transition-all ease-in-out group-hover:w-3 group-hover:scale-100 group-hover:rotate-0"
              />
              <p>{tag}</p>
            </motion.button>
          ))}
        </AnimatePresence>
        <Tooltip content="Nova tag" color="#ffffff">
          <button
            onClick={() => setIsAddingTag(true)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-white/2 bg-neutral-700/50"
          >
            <Plus size={16} />
          </button>
        </Tooltip>
      </motion.div>
    </>
  );
};
