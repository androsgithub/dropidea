import Color from 'color';

export const ParticleButton = ({
  color,
  icon,
  onClick
}: {
  color: string;
  icon: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    className="flex size-12 scale-85 cursor-pointer items-center justify-center rounded-full transition-all hover:scale-100"
    onClick={onClick}
    style={{
      backgroundColor: color,
      boxShadow: `0 0 16px 4px ${Color(color).alpha(0.75).hexa()}`
    }}
  >
    {icon}
  </button>
);
