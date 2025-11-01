import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { v1 as uuid } from 'uuid';
import { ConfigMenu } from './components/ConfigMenu';
import { ButtonCirclesBackground } from './components/Floating/ButtonCirclesBackground';
import { DecorativeCirclesBackground } from './components/Floating/DecorativeCirclesBackground';
import { Input } from './components/Input';
import { ParticleModal } from './components/ParticleModal';
import { particleService } from './db/particle/particle.service';
import { useParticles } from './hooks/useParticles';
import { TagGeneratorFactory } from './services/TagGenerator';
import { useGlobalStore } from './stores/useGlobalStore';
import type { Particle } from './types/Particle';
import { migrateParticlesFromLocalStorage } from './util/MigrationFromLocalStorageToDB';
import { generatePosition } from './util/Position';

function App() {
  const { activeParticles } = useParticles();
  const setCreating = useGlobalStore((state) => state.setCreating);

  const [apiKey] = useLocalStorage('GEMINI_API_KEY', '');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = (formData.get('idea') as string) ?? '';
    const color = (formData.get('color') as string) ?? '';

    if (formData.get('idea') == '') return;
    setCreating(true);
    e.currentTarget.reset();
    await new Promise((r) => setTimeout(r, 2000));
    try {
      const _particle: Particle = {
        data: {
          id: uuid(),
          title: title,
          description: '',
          notes: [],
          insight: '',
          tasks: [],
          tags: [],
          deleted: false
        },
        visual: { ...generatePosition(activeParticles), color, icon: '' },
        states: { generatingInsight: false }
      };
      particleService.add(_particle);
      const tagGenerator = TagGeneratorFactory.create({ apiKey });
      tagGenerator
        .generateTags(title)
        .then((tags: string[]) => {
          _particle.data.tags = tags;
        })
        .finally(() => particleService.update(_particle.data.id, _particle));
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    (async () => {
      await migrateParticlesFromLocalStorage('particlesData', false).finally();
      // loadParticles();
    })();
  }, []);

  return (
    <main className="relative flex h-dvh w-dvw items-center justify-center overflow-hidden bg-neutral-950">
      <ParticleModal />
      <form onSubmit={handleSubmit} className="z-50">
        <Input />
      </form>
      <ConfigMenu />
      <ButtonCirclesBackground />
      <Background />
    </main>
  );
}

export default App;

function Background() {
  return (
    <>
      <div className="absolute size-full opacity-30 blur-xs">
        <DecorativeCirclesBackground count={32} offset={12} />
      </div>
      <div className="absolute size-full opacity-20 blur-xs">
        <DecorativeCirclesBackground count={64} offset={8} />
      </div>
    </>
  );
}
