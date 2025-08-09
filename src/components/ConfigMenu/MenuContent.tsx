import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { X } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';

type MenuContentProps = {
  open: boolean;
  setOpened: (opened: boolean) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};
export function MenuContent({ open, setOpened, handleSubmit }: MenuContentProps) {
  const [apiKey] = useLocalStorage('GEMINI_API_KEY', '');
  const variants: Variants = {
    initial: {
      scale: 0.5,
      y: -128,
      opacity: 0
    },
    animate: {
      y: 0,
      scale: 1,
      opacity: 1
    },

    exit: {
      scale: 0.5,
      y: -128,
      opacity: 0
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.form
          layout
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute top-4 right-4 z-500 flex max-w-2xl min-w-xl flex-col rounded-3xl bg-white/10 p-6 backdrop-blur-2xl"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between">
            <p className="mb-4 text-lg font-semibold">Configurações</p>
            <button
              onClick={() => setOpened(false)}
              type="button"
              className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-neutral-400 transition-all hover:bg-white/5 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <label className="text-neutral-400">Gemini - API KEY:</label>
          <input
            type="text"
            name="gemini-api-key"
            className="rounded-2xl bg-white/5 p-4 py-2 outline-none"
            defaultValue={apiKey}
          />
          <div className="mt-4 flex justify-between gap-2">
            <button
              type="submit"
              className="flex-1 cursor-pointer rounded-xl bg-neutral-100/10 p-2 transition-all hover:bg-neutral-100/15"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => setOpened(false)}
              className="flex-1 cursor-pointer rounded-xl bg-red-900 p-2 transition-all hover:bg-red-800"
            >
              Cancelar
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
