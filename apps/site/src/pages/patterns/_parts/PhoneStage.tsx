import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface PhoneStageProps {
  /** Unscaled width of the composition in px. */
  width: number;
  /** Unscaled height of the composition in px. */
  height: number;
  children: ReactNode;
  className?: string;
}

/**
 * Fits a fixed-size composition (an <AppFrame> at its native 320–390px) into the width the
 * layout offers by scaling it down — never up — from the top-left corner. Used for the
 * side-by-side storyboards that would not fit three phones in a 52rem article otherwise.
 */
export function PhoneStage({ width, height, children, className }: PhoneStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / width));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={ref} className={cn('mx-auto w-full', className)} style={{ maxWidth: width, height: Math.round(height * scale) }}>
      <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div>
    </div>
  );
}
