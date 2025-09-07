import Color from 'color';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

type TooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  color?: string;
};

export function Tooltip({ children, content, color = '#ffffff' }: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}

      <AnimatePresence>
        {open && (
          <motion.div
            style={{
              backgroundColor: Color(color).darken(0.5).alpha(0.5).hexa(),
              color: Color(color).lighten(0.5).hexa() // sempre mais claro que a cor base,
            }}
            initial={{ opacity: 0, y: 25, scaleX: 0.25, scale: 0, borderRadius: 32 }}
            animate={{ opacity: 1, y: 0, scaleX: 1, scale: 1, borderRadius: 16 }}
            exit={{ opacity: 0, y: 25, scaleX: 0, scale: 0, borderRadius: 32 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 1000, damping: 50, mass: 1.5 }}
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap shadow-lg backdrop-blur-3xl"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
