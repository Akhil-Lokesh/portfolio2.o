import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  /** Fraction of the cursor offset the element follows (0..1). */
  strength?: number;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className,
  strength = 0.4,
}) => {
  const reduced = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  if (reduced || isTouch) {
    return <span className={`inline-block ${className ?? ''}`}>{children}</span>;
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className ?? ''}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
