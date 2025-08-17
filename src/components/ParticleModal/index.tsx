import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Home, ListTodo, Sparkles, X } from 'lucide-react';
import { validate as isUuid } from 'uuid';
import { useGlobalStore } from '../../stores/useGlobalStore';
import type { Note } from '../../types/Particle';
import { Tab, TabButton, TabButtons, TabList, Tabs } from '../Tabs';
import { ParticleContent } from './ParticleDetails/ParticleContent';
import { ParticleFooter } from './ParticleDetails/ParticleFooter';
import { ParticleHeader } from './ParticleDetails/ParticleHeader';
import { ParticleInsight } from './ParticleInsight';
import { ParticleTasks } from './ParticleTasks';

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
    if (!confirm('Deseja alterar essa particula?')) return;
    if (currentParticle) {
      const formData = new FormData(e.currentTarget);
      const _p = particles.find((p) => p.data.id === currentParticle.data.id);
      if (_p) {
        _p.data.title = formData.get('newTitle') as string;
        _p.data.description = formData.get('newDescription') as string;
        _p.visual.color = formData.get('color') as string;
        _p.visual.icon = formData.get('icon') as string;
        const newNotes: Note[] = [];
        for (const [key, value] of formData.entries()) {
          if (isUuid(key)) {
            const existingNote = _p.data.notes.find((n) => n.id === key);
            console.log(existingNote);
            if (existingNote && value != '') {
              existingNote.text = value as string;
              newNotes.push(existingNote);
            } else if (value != '') {
              newNotes.push({ id: key, text: value as string });
            }
          }
        }

        _p.data.notes = newNotes;
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
          className="absolute inset-0 z-999 flex size-full items-center justify-center bg-black/90"
          variants={dialogVariants}
          initial="closed"
          animate="opened"
          exit="closed"
          transition={{
            duration: 0.1
          }}
        >
          <motion.form onSubmit={onSave} className="flex gap-4 md:max-w-[calc(100vw-12rem)]">
            <Tabs>
              <TabButtons>
                {[
                  { id: 'home', title: 'Home', icon: Home },
                  { id: 'insights', title: 'Insights', icon: Sparkles },
                  { id: 'tasks', title: 'Tasks', icon: ListTodo }
                ].map((tb) => (
                  <TabButton key={tb.id} id={tb.id}>
                    <tb.icon /> {tb.title}
                  </TabButton>
                ))}
                <div className="flex flex-1 items-center justify-end">
                  <TabButton onClick={close}>
                    <X color="white" />
                  </TabButton>
                </div>
              </TabButtons>

              <TabList>
                <Tab id="home">
                  <ParticleHeader close={close} currentParticle={currentParticle} deleteParticle={deleteParticle} />
                  <ParticleContent currentParticle={currentParticle} />
                  <ParticleFooter close={close} currentParticle={currentParticle} />
                </Tab>
                <Tab id="insights">
                  <ParticleInsight currentParticle={currentParticle} />
                </Tab>
                <Tab id="tasks">
                  <ParticleTasks currentParticle={currentParticle} />
                </Tab>
              </TabList>
            </Tabs>
          </motion.form>
        </motion.dialog>
      )}
    </AnimatePresence>
  );
}
