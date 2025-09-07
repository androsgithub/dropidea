import { motion, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};
export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const buttonVariants: Variants = {
    initial: { scale: 0, width: 0 },
    animate: { scale: 1, width: 32 },
    exit: { scale: 0, width: 0 },
    whileHover: { scale: 1.05 },
    whileTap: { scaleX: 1.1, scaleY: 0.75, opacity: 1 }
  };
  return (
    <motion.div layout className="flex items-center space-x-1 text-neutral-300">
      <motion.button
        variants={buttonVariants}
        initial="inital"
        animate="animate"
        exit="exit"
        whileHover="whileHover"
        whileTap="whileTap"
        transition={{ duration: 0.5, type: 'spring' }}
        onClick={() => onPageChange(1)}
        className="flex aspect-square size-8 cursor-pointer items-center justify-center rounded-xl border border-white/2.5 bg-white/5 font-semibold opacity-100 hover:bg-white/5 disabled:pointer-events-none disabled:!opacity-25"
        disabled={!(currentPage > 2)}
      >
        <ChevronsLeft size={20} strokeWidth={3} />
      </motion.button>

      <motion.button
        variants={buttonVariants}
        initial="inital"
        animate="animate"
        exit="exit"
        whileHover="whileHover"
        whileTap="whileTap"
        transition={{ duration: 0.5, type: 'spring' }}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex aspect-square size-8 cursor-pointer items-center justify-center rounded-xl border border-white/2.5 bg-white/5 font-semibold opacity-100 hover:bg-white/5 disabled:pointer-events-none disabled:!opacity-25"
        disabled={!(currentPage > 1)}
      >
        <ChevronLeft size={20} strokeWidth={3} />
      </motion.button>

      <motion.p
        variants={buttonVariants}
        initial="inital"
        animate="animate"
        exit="exit"
        whileHover="whileHover"
        whileTap="whileTap"
        transition={{ duration: 0.5, type: 'spring' }}
        className="pointer-events-none flex aspect-square size-8 cursor-pointer items-center justify-center rounded-xl border border-white/2.5 bg-white/5 font-semibold opacity-100 hover:bg-white/5 disabled:pointer-events-none disabled:!opacity-25"
      >
        {currentPage}
      </motion.p>

      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        variants={buttonVariants}
        initial="inital"
        animate="animate"
        exit="exit"
        whileHover="whileHover"
        whileTap="whileTap"
        transition={{ duration: 0.5, type: 'spring' }}
        className="flex aspect-square size-8 cursor-pointer items-center justify-center rounded-xl border border-white/2.5 bg-white/5 font-semibold opacity-100 hover:bg-white/5 disabled:pointer-events-none disabled:!opacity-25"
        disabled={!(currentPage < totalPages)}
      >
        <ChevronRight size={20} strokeWidth={3} />
      </motion.button>

      <motion.button
        onClick={() => onPageChange(totalPages)}
        variants={buttonVariants}
        initial="inital"
        animate="animate"
        exit="exit"
        whileHover="whileHover"
        whileTap="whileTap"
        transition={{ duration: 0.5, type: 'spring' }}
        className="flex aspect-square size-8 cursor-pointer items-center justify-center rounded-xl border border-white/2.5 bg-white/5 font-semibold opacity-100 hover:bg-white/5 disabled:pointer-events-none disabled:!opacity-25"
        disabled={!(currentPage < totalPages - 1)}
      >
        <ChevronsRight size={20} strokeWidth={3} />
      </motion.button>
    </motion.div>
  );
};
