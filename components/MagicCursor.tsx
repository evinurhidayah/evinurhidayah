
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const MagicCursor: React.FC = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const checkTouch = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };
    setIsTouchDevice(checkTouch());
  }, []);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }; // Stiffer spring for less calculation trail
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [mouseX, mouseY, isVisible, isTouchDevice]);

  if (isTouchDevice) return null;

  const starPath = "M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z";

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden hidden md:block">
      {/* Layer 1: Sharp Cursor */}
      <motion.div
        className="absolute z-20 text-white will-change-transform"
        style={{
          left: mouseX,
          top: mouseY,
          x: "-50%",
          y: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
           <path d={starPath} />
        </svg>
      </motion.div>
      
      {/* Layer 2: Trail - Removed blur and mix-blend for performance */}
      <motion.div
        className="absolute z-10 text-nebula-pink/40 will-change-transform"
        style={{
          left: glowX,
          top: glowY,
          x: "-50%",
          y: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
           <path d={starPath} />
        </svg>
      </motion.div>
    </div>
  );
};

export default MagicCursor;
