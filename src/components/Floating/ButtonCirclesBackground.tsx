import { useCurrentParticle } from '../../hooks/useCurrentParticle';
import { useParticles } from '../../hooks/useParticles';
import type { Particle } from '../../types/Particle';
import { ParticleButton } from './ParticleButton';

export const ButtonCirclesBackground = () => {
  // const [localParticles, setLocalParticles] = useState<Particle[]>([]);
  // const particles = useGlobalStore((state) => state.particles);
  const { activeParticles } = useParticles();
  const { setCurrentParticle } = useCurrentParticle();

  // useEffect(() => {
  //   setLocalParticles((prevLocalParticles) => {
  //     const currentParticleIds = new Set(particles.map((p) => p.data.id));
  //     const filteredParticles = prevLocalParticles.filter((p) => currentParticleIds.has(p.data.id));

  //     const existingParticleIds = new Set(filteredParticles.map((p) => p.data.id));
  //     const newParticles = particles.filter((p) => !existingParticleIds.has(p.data.id));

  //     // Atualiza dados das partículas existentes (caso tenham mudado)
  //     const updatedExistingParticles = filteredParticles.map((localParticle) => {
  //       const updatedData = particles.find((p) => p.data.id === localParticle.data.id);
  //       return updatedData ? { ...localParticle, data: updatedData } : localParticle;
  //     });

  //     return [...updatedExistingParticles, ...newParticles];
  //   });
  // }, [particles]);
  function onParticleClick(particle: Particle) {
    setCurrentParticle(particle);
  }

  return (
    <div className="absolute flex size-full items-center justify-center">
      {activeParticles.map((particle) => (
        <ParticleButton
          particle={particle}
          onClick={() => onParticleClick(particle)}
          key={particle.data.id}
          style={{
            position: 'absolute',
            top: `${particle.visual.top}%`,
            left: `${particle.visual.left}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
};
