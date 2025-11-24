
import React, { useMemo, useState, useEffect } from 'react';

// PART 1: STATIC STARS
// Memoized to prevent re-rendering when the shooting star moves
const StaticStars = React.memo(() => {
  const stars = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      animationDelay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.7 + 0.3,
      color: Math.random() > 0.8 ? '#ff99cc' : '#ffffff'
    }));
  }, []);

  return (
    <>
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="absolute rounded-full animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
            animationDelay: star.animationDelay,
            opacity: star.opacity,
            transform: 'translateZ(0)' 
          }}
        />
      ))}
    </>
  );
});

// PART 2: RANDOM SHOOTING STAR LOGIC
const ShootingStarController = () => {
  const [star, setStar] = useState<{ id: number, top: string, left: string } | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleStar = () => {
      // Random delay between 4000ms (4s) and 10000ms (10s)
      const delay = Math.random() * 6000 + 4000;
      
      timeoutId = setTimeout(() => {
        // Trigger Star
        setStar({
          id: Date.now(),
          top: `${Math.random() * 40}%`, // Only in top 40% of screen
          left: `${Math.random() * 90}%`, // Keep slightly away from right edge
        });

        // Hide star after animation finishes (3s) and schedule next
        setTimeout(() => {
            setStar(null);
            scheduleStar();
        }, 3000); // Matches animation duration in tailwind config

      }, delay);
    };

    scheduleStar();

    return () => clearTimeout(timeoutId);
  }, []);

  if (!star) return null;

  return (
    <div
      key={star.id} // Changing key forces React to remount and restart animation
      className="absolute h-[2px] bg-gradient-to-r from-transparent via-white to-transparent animate-shoot z-0"
      style={{
        top: star.top,
        left: star.left,
        width: '100px',
        transform: 'translateZ(0)',
      }}
    />
  );
};

// MAIN COMPONENT
const StarBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-space-950">
      
      {/* 
         EXTREME OPTIMIZATION:
         Browser paints gradients much faster than calculating Gaussian blurs on transparent divs.
      */}
      
      {/* Static Nebula - Top Left */}
      <div 
        className="absolute top-0 left-0 w-[500px] h-[500px] translate-x-[-20%] translate-y-[-20%]"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,204,0.08) 0%, transparent 70%)',
          transform: 'translateZ(0)'
        }}
      />
      
      {/* Static Nebula - Bottom Right */}
      <div 
        className="absolute bottom-0 right-0 w-[600px] h-[600px] translate-x-[20%] translate-y-[20%]"
        style={{
          background: 'radial-gradient(circle, rgba(183,0,255,0.08) 0%, transparent 70%)',
          transform: 'translateZ(0)'
        }}
      />
      
      {/* Center Glow */}
      <div 
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,204,0.03) 0%, transparent 60%)',
          transform: 'translate3d(-50%, -50%, 0)'
        }}
      />

      {/* Layer 1: Static Stars (Memoized) */}
      <StaticStars />

      {/* Layer 2: Random Shooting Star (Controlled) */}
      <ShootingStarController />

    </div>
  );
};

export default React.memo(StarBackground);
