import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Settings } from 'lucide-react';

type MenuTriggerProps = { open: boolean; setOpened: (opened: boolean) => void };
export function MenuTrigger({ open, setOpened }: MenuTriggerProps) {
  const variants: Variants = {
    initial: {
      scale: 0,
      opacity: 0,
      y: -100
    },
    animate: {
      scale: 0.75,
      opacity: 1,
      filter: 'brightness(50%)',
      y: 0
    },
    whileTap: {
      scale: 1.15,
      opacity: 1,
      filter: 'brightness(150%)',
      y: 0
    },
    whileHover: {
      scale: 1,
      opacity: 1,
      filter: 'brightness(100%)',
      y: 0
    }
  };
  return (
    <AnimatePresence>
      {!open && (
        <motion.button
          variants={variants}
          initial="initial"
          animate={open ? 'whileHover' : 'animate'}
          whileHover="whileHover"
          whileTap="whileTap"
          exit="initial"
          className="absolute top-4 right-4 z-500 flex size-16 cursor-pointer items-center justify-center rounded-3xl bg-white/5 text-neutral-200 backdrop-blur-3xl"
          onClick={() => setOpened(!open)}
        >
          <Settings />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
