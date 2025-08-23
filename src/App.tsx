import { useLocalStorage } from 'usehooks-ts';
import { v1 as uuid } from 'uuid';
import { ConfigMenu } from './components/ConfigMenu';
import { ButtonCirclesBackground } from './components/Floating/ButtonCirclesBackground';
import { DecorativeCirclesBackground } from './components/Floating/DecorativeCirclesBackground';
import { Input } from './components/Input';
import { ParticleModal } from './components/ParticleModal';
import { TagGeneratorFactory } from './services/TagGenerator';
import { useGlobalStore } from './stores/useGlobalStore';
import type { Particle } from './types/Particle';
import { generatePosition } from './util/Position';

function App() {
  const particles = useGlobalStore((state) => state.particles);
  const setCreating = useGlobalStore((state) => state.setCreating);
  const addCircle = useGlobalStore((state) => state.addParticle);
  const updateParticle = useGlobalStore((state) => state.updateParticle);
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
        data: { id: uuid(), title: title, description: '', notes: [], insight: '', tasks: [], tags: [] },
        visual: { ...generatePosition(particles), color, icon: '' },
        states: { generatingInsight: false }
      };
      addCircle(_particle);
      const tagGenerator = TagGeneratorFactory.create({ apiKey });
      tagGenerator
        .generateTags(title)
        .then((tags: string[]) => {
          _particle.data.tags = tags;
        })
        .finally(() => updateParticle(_particle));
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="relative flex h-dvh w-dvw items-center justify-center overflow-hidden bg-neutral-950">
      <form onSubmit={handleSubmit} className="z-50">
        <Input />
      </form>
      <ParticleModal />
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
        <DecorativeCirclesBackground count={16} offset={32} />
      </div>
      <div className="absolute size-full opacity-20 blur-xs">
        <DecorativeCirclesBackground count={32} offset={24} />
      </div>
      <div className="absolute size-full opacity-10 blur-xs">
        <DecorativeCirclesBackground count={64} offset={16} />
      </div>
    </>
  );
}
