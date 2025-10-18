import React, { useEffect, useState, useCallback, memo } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface CustomCursorProps {
  enabled?: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = memo(({ enabled = true }) => {
  // Fixed to dark theme
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isRocketMode, setIsRocketMode] = useState(false);
  const [isTrailMode, setIsTrailMode] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [trailParticles, setTrailParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 350 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle mouse movement with throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!enabled || isMobile) return;
    
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);

    // Trail mode when shift is held
    if (e.shiftKey && !isTrailMode) {
      setIsTrailMode(true);
    } else if (!e.shiftKey && isTrailMode) {
      setIsTrailMode(false);
    }

    // Add trail particles when in trail mode
    if (e.shiftKey) {
      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      };
      setTrailParticles(prev => [...prev.slice(-10), newParticle]);
    }

    // Reset sleep mode on movement
    setIsSleeping(false);
  }, [enabled, isMobile, mouseX, mouseY, isTrailMode]);

  // Handle triple-click for rocket mode
  const handleClick = useCallback(() => {
    setClickCount(prev => prev + 1);
    
    // Reset click count after 1 second
    setTimeout(() => setClickCount(0), 1000);
  }, []);

  // Check for triple-click
  useEffect(() => {
    if (clickCount >= 3) {
      setIsRocketMode(true);
      setTimeout(() => setIsRocketMode(false), 10000); // 10 seconds
      setClickCount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickCount]); // handleClick is stable callback

  // Idle detection for sleeping cursor
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      setIsSleeping(false);
      idleTimer = setTimeout(() => {
        setIsSleeping(true);
      }, 30000); // 30 seconds
    };

    const handleActivity = () => resetIdleTimer();

    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keypress', handleActivity);
    document.addEventListener('scroll', handleActivity);
    
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keypress', handleActivity);
      document.removeEventListener('scroll', handleActivity);
    };
  }, []);

  // Clean up trail particles
  useEffect(() => {
    if (!isTrailMode) {
      const timer = setTimeout(() => setTrailParticles([]), 500);
      return () => clearTimeout(timer);
    }
  }, [isTrailMode]);

  // Handle hover states using event delegation
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Check if the target or any parent is an interactive element
    const isInteractive = target.closest('a, button, [data-cursor-hover], [data-cursor], [role="button"], input, textarea');
    setIsHovering(!!isInteractive);
  }, []);

  useEffect(() => {
    if (!enabled || isMobile) {
      document.body.removeAttribute('data-custom-cursor');
      return;
    }

    // Set custom cursor active
    document.body.setAttribute('data-custom-cursor', 'true');

    // Add event listeners with throttling
    let ticking = false;
    const throttledMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleMouseMove(e);
          ticking = false;
        });
        ticking = true;
      }
    };

    document.addEventListener('mousemove', throttledMouseMove);
    document.addEventListener('click', handleClick);
    
    // Use event delegation for hover detection
    // This works for dynamically added elements too
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.removeAttribute('data-custom-cursor');
      document.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [enabled, isMobile, handleMouseMove, handleMouseOver, handleClick]);

  // Don't render on mobile
  if (isMobile || !enabled) return null;

  return (
    <>
      {/* Trail Particles - Simple dots */}
      {trailParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed top-0 left-0 pointer-events-none z-[9998] w-1 h-1 rounded-full bg-white/60"
          style={{
            x: particle.x - 2,
            y: particle.y - 2,
          }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 1.2 }}
        />
      ))}

      {/* Main Cursor - Clean geometric design */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ x, y }}
      >
        {/* Rocket Mode */}
        {isRocketMode ? (
          <motion.div
            className="w-6 h-6 -ml-3 -mt-3 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="text-lg">🚀</div>
          </motion.div>
        ) : isSleeping ? (
          /* Sleeping Mode */
          <motion.div
            className="w-4 h-4 -ml-2 -mt-2 flex items-center justify-center"
            animate={{ scale: [1, 0.9, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="text-sm">💤</div>
          </motion.div>
        ) : (
          /* Normal Cursor - Minimal crosshair design */
          <motion.div
            className="relative"
            animate={{
              scale: isHovering ? 1.4 : 1,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Horizontal line */}
            <motion.div
              className="absolute bg-white/90 rounded-full"
              style={{
                width: isHovering ? 16 : 12,
                height: 1,
                left: isHovering ? -8 : -6,
                top: -0.5,
              }}
              animate={{
                width: isHovering ? 16 : 12,
                left: isHovering ? -8 : -6,
              }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Vertical line */}
            <motion.div
              className="absolute bg-white/90 rounded-full"
              style={{
                width: 1,
                height: isHovering ? 16 : 12,
                left: -0.5,
                top: isHovering ? -8 : -6,
              }}
              animate={{
                height: isHovering ? 16 : 12,
                top: isHovering ? -8 : -6,
              }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Center dot */}
            <motion.div
              className="absolute bg-white rounded-full"
              style={{
                width: isHovering ? 3 : 2,
                height: isHovering ? 3 : 2,
                left: isHovering ? -1.5 : -1,
                top: isHovering ? -1.5 : -1,
              }}
              animate={{
                width: isHovering ? 3 : 2,
                height: isHovering ? 3 : 2,
                left: isHovering ? -1.5 : -1,
                top: isHovering ? -1.5 : -1,
              }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Hover ring */}
            {isHovering && (
              <motion.div
                className="absolute border border-white/40 rounded-full"
                style={{
                  width: 24,
                  height: 24,
                  left: -12,
                  top: -12,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Trail mode indicator - subtle ring */}
      {isTrailMode && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9998] border border-white/20 rounded-full"
          style={{
            x,
            y,
            width: 32,
            height: 32,
            marginLeft: -16,
            marginTop: -16,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </>
  );
});

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;
