import { v1 as uuid } from 'uuid';
import { ButtonCirclesBackground } from './components/Floating/ButtonCirclesBackground';
import { DecorativeCirclesBackground } from './components/Floating/DecorativeCirclesBackground';
import { Input } from './components/Input';
import { ParticleModal } from './components/ParticleModal';
import { useGlobalStore } from './stores/useGlobalStore';

function App() {
  const setCreating = useGlobalStore((state) => state.setCreating);
  const addCircle = useGlobalStore((state) => state.addParticle);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = (formData.get('idea') as string) ?? '';
    const color = (formData.get('color') as string) ?? '';
    if (formData.get('idea') == '') return;
    setCreating(true);
    e.currentTarget.reset();
    await new Promise((r) => setTimeout(r, 2000));
    addCircle({ id: uuid(), title: title, description: '', color, icon: '', notes: [] });
    setCreating(false);
  }

  return (
    <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-neutral-950">
      <form onSubmit={handleSubmit} className="z-50">
        <Input />
      </form>
      <ParticleModal />
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
