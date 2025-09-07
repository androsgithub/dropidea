import { forwardRef, type HTMLAttributes } from 'react';

export type OverlayProps = HTMLAttributes<HTMLDivElement>;

const Overlay = forwardRef<HTMLDivElement, OverlayProps>(({ className = '', children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`absolute inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-neutral-950/75 backdrop-blur-xl transition-all ${className}`}
      {...props}
    >
      <div className="max-w-lg p-4">{children}</div>
    </div>
  );
});

Overlay.displayName = 'Overlay';

export { Overlay };
