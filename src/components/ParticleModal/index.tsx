import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { validate as isUuid } from 'uuid';
import { useGlobalStore } from '../../stores/useGlobalStore';
import type { Note } from '../../types/Particle';
import { ParticleContent } from './ParticleContent';
import { ParticleFooter } from './ParticleFooter';
import { ParticleHeader } from './ParticleHeader';
import { ParticleInsight } from './ParticleInsight';

export function ParticleModal() {
  const particles = useGlobalStore((state) => state.particles);
  const updateParticle = useGlobalStore((state) => state.updateParticle);
  const deleteParticle = useGlobalStore((state) => state.deleteParticle);
  const currentParticle = useGlobalStore((state) => state.currentParticle);
  const setCurrentParticle = useGlobalStore((state) => state.setCurrentParticle);
  const dialogVariants: Variants = {
    closed: {
      opacity: 0
    },
    opened: {
      opacity: 1
    }
  };
  function close() {
    setCurrentParticle(null);
  }
  function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (currentParticle) {
      const formData = new FormData(e.currentTarget);
      const _p = particles.find((p) => p.id === currentParticle.id);
      if (_p) {
        _p.title = formData.get('newTitle') as string;
        _p.description = formData.get('newDescription') as string;
        _p.color = formData.get('color') as string;
        _p.icon = formData.get('icon') as string;
        const newNotes: Note[] = [];
        for (const [key, value] of formData.entries()) {
          if (isUuid(key)) {
            const existingNote = _p.notes.find((n) => n.id === key);
            console.log(existingNote);
            if (existingNote && value != '') {
              existingNote.text = value as string;
              newNotes.push(existingNote);
            } else if (value != '') {
              newNotes.push({ id: key, text: value as string });
            }
          }
        }

        _p.notes = newNotes;
        updateParticle(_p);
      }
      close();
    }
  }

  return (
    <AnimatePresence>
      {currentParticle && (
        <motion.dialog
          open
          className="absolute inset-0 z-999 flex size-full items-center justify-center bg-black/10 backdrop-blur-lg"
          variants={dialogVariants}
          initial="closed"
          animate="opened"
          exit="closed"
          transition={{
            duration: 0.1
          }}
        >
          <div className="flex max-h-2/3 gap-4">
            <motion.form
              initial={{
                scale: 0,
                opacity: 0,
                rotate: '30deg',
                skewX: '30deg'
              }}
              animate={{ scale: 1, opacity: 1, rotate: '0deg', skewX: '0deg' }}
              exit={{ scale: 0, opacity: 0, rotate: '-30deg', skewX: '-30deg' }}
              transition={{
                duration: 0.75,
                bounce: 0.25,
                type: 'spring'
              }}
              onSubmit={onSave}
              className="z-20 flex w-2xl flex-col rounded-4xl p-6"
              style={{
                backgroundColor: `color-mix(in srgb, ${currentParticle.color} 5%,  color-mix(in srgb, transparent 25%, var(--color-neutral-800) 75%) 95%)`
              }}
            >
              <ParticleHeader close={close} currentParticle={currentParticle} deleteParticle={deleteParticle} />
              <ParticleContent currentParticle={currentParticle} />
              <ParticleFooter close={close} currentParticle={currentParticle} />
            </motion.form>
            <ParticleInsight currentParticle={currentParticle} />
          </div>
        </motion.dialog>
      )}
    </AnimatePresence>
  );
}
