import { useEffect, useState } from 'react';

function detectTouch(): boolean {
  if (typeof window === 'undefined') return false;
  const coarsePointer =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(pointer: coarse)').matches
      : false;
  return (
    coarsePointer ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.innerWidth <= 768
  );
}

/**
 * Returns true on touch / coarse-pointer / narrow devices. Reactive to resize.
 * Used to disable cursor-driven effects (magnetic, tilt) where they make no sense.
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(detectTouch);

  useEffect(() => {
    const update = () => setIsTouch(detectTouch());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return isTouch;
}
