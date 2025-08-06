import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Droplet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGlobalStore } from '../stores/useGlobalStore';
import { getRandomColor } from '../util/Colors';
export const Input = () => {
  const [color, setColor] = useState<string>('');
  const [inputInFocus, setInputInFocus] = useState(false);
  const creating = useGlobalStore((state) => state.creating);

  const containerVariants: Variants = {
    initial: {
      opacity: 0,
      scale: 0,
      y: 400
    },
    animate: {
      scale: 0.85,

      height: 'auto',
      minWidth: `var(--container-2xs)`,
      opacity: 1,
      borderRadius: `var(--radius-3xl)`,
      backgroundColor: color + '24',
      filter: `grayscale(50%)`,
      width: 'auto',
      y: 0
    },
    creating: {
      scale: 1,
      opacity: 1,
      minWidth: '2rem',
      backgroundColor: color,
      borderRadius: '1rem',
      height: '2rem',
      width: '2rem',
      y: 0
    },
    focus: {
      scale: 1,
      height: 'auto',
      minWidth: `var(--container-2xs)`,
      opacity: 1,
      borderRadius: `var(--radius-3xl)`,
      backgroundColor: color + '24',
      filter: `grayscale(25%)`,
      width: 'auto',
      y: 0
    }
  };
  const textareaVariants: Variants = {
    animate: {
      opacity: 1,
      pointerEvents: 'all',
      scale: 1
    },
    creating: {
      opacity: 0,
      scale: 0,
      pointerEvents: 'none'
    }
  };
  const buttonVariants: Variants = {
    animate: {
      opacity: 1,
      pointerEvents: 'all',
      backgroundColor: color + '48'
    },
    creating: {
      opacity: 0,
      pointerEvents: 'none'
    }
  };
  useEffect(() => {
    if (!creating) setColor(getRandomColor());
  }, [creating]);
  return (
    <motion.div
      variants={containerVariants}
      transition={{
        type: 'spring',
        duration: 0.75,
        bounce: 0.25
      }}
      layout
      initial="initial"
      animate={creating ? 'creating' : inputInFocus ? 'focus' : 'animate'}
      className="relative flex field-sizing-content max-h-[calc(100vh-12rem)] items-stretch justify-between overflow-hidden bg-neutral-600/75 backdrop-blur-xl"
    >
      <input type="hidden" name="color" value={color} />
      <AnimatePresence>
        {!creating && (
          <>
            <motion.textarea
              onFocus={() => setInputInFocus(true)}
              onBlur={() => setInputInFocus(false)}
              minLength={8}
              variants={textareaVariants}
              initial="creating"
              animate="animate"
              exit="creating"
              transition={{
                ease: 'linear',
                duration: 0.1,
                bounce: 0,
                mass: 0
              }}
              id="idea"
              name="idea"
              rows={1}
              placeholder="💡 Digite aqui..."
              className="scrollbar-float flex field-sizing-content w-full max-w-sm flex-1 resize-none overflow-auto rounded px-4 py-3 transition-all outline-none"
            />
            <motion.button
              variants={buttonVariants}
              initial="creating"
              animate="animate"
              exit="creating"
              transition={{
                ease: 'linear',
                delay: 0,
                duration: 0
              }}
              className="cursor-pointer rounded-3xl p-4 transition-all outline-none hover:bg-white/5 hover:brightness-125 hover:saturate-125"
              type="submit"
            >
              <Droplet />
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
