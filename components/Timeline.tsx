
import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Search, FileText, PenTool } from 'lucide-react';
import { content } from '../data/content';

const MotionDiv = motion.div as any;
const MotionH3 = motion.h3 as any;

const Timeline: React.FC = () => {
  const { timeline } = content;
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="timeline" ref={containerRef} className="relative z-10 py-24 px-4 max-w-6xl mx-auto overflow-hidden">
      <MotionH3
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-center mb-16 md:mb-24 text-white font-sans text-glow-sm"
      >
        {timeline.title}
      </MotionH3>

      <div className="relative">
        {/* 
           FIX: Line Overflow & Hard Cuts
           Using a masking image or gradient transparency on the container of the line
           ensures the line fades out at the top and bottom, preventing visual overflow.
        */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 hidden md:block">
            {/* Background track (faint) */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
            
            {/* Active filled line (animated) */}
            <MotionDiv 
                style={{ scaleY, originY: 0 }}
                className="absolute inset-0 w-full bg-gradient-to-b from-transparent via-nebula-pink to-transparent will-change-transform"
            />
        </div>
        
        <div className="flex flex-col gap-12 md:gap-24 relative">
          {timeline.steps.map((step, index) => {
            const isEven = index % 2 === 0;
            const isLast = index === timeline.steps.length - 1;

            return (
              <div 
                key={step.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] gap-6 md:gap-8 items-center"
              >
                {/* Left Side (Content or Spacer) */}
                <div className={`order-2 md:order-1 ${isEven ? 'md:text-right' : ''}`}>
                    {isEven ? (
                        // Hide this on mobile to prevent duplication, show only on desktop
                        <div className="hidden md:block">
                            <Card step={step} align="right" />
                        </div>
                    ) : (
                        <div className="hidden md:block" />
                    )}
                </div>

                {/* Center Icon Node */}
                <div className="order-1 md:order-2 flex justify-center md:justify-center justify-start relative z-10 pl-4 md:pl-0">
                    <MotionDiv
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-space-950 border border-nebula-deep flex items-center justify-center shadow-[0_0_15px_rgba(183,0,255,0.3)] group relative overflow-hidden will-change-transform"
                    >
                        <div className="absolute inset-0 bg-nebula-pink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {step.icon === 'search' && <Search className="w-6 h-6 md:w-8 md:h-8 text-nebula-light relative z-10" />}
                        {step.icon === 'file' && <FileText className="w-6 h-6 md:w-8 md:h-8 text-nebula-light relative z-10" />}
                        {step.icon === 'design' && <PenTool className="w-6 h-6 md:w-8 md:h-8 text-nebula-light relative z-10" />}
                    </MotionDiv>
                    
                    {/* Mobile Only: Connector Line to text */}
                    {/* Fix: left-12 to center align with the icon (16px padding + 32px half-icon width) */}
                    {!isLast && (
                        <div className="md:hidden absolute left-12 top-16 bottom-[-48px] w-[2px] bg-white/10 -z-10" />
                    )}
                </div>

                {/* Right Side (Content or Spacer) */}
                <div className={`order-3 ${isEven ? '' : 'md:text-left'}`}>
                    {!isEven ? (
                         <Card step={step} align="left" />
                    ) : (
                        <>
                            <div className="hidden md:block" />
                            {/* Mobile View for Even items - Render here to maintain flow (Icon -> Content) */}
                            <div className="md:hidden">
                                <Card step={step} align="left" />
                            </div>
                        </>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Optimized Card Component
const Card = ({ step, align }: { step: any, align: 'left' | 'right' }) => (
  <MotionDiv 
    initial={{ opacity: 0, y: 20, x: align === 'left' ? 20 : -20 }}
    whileInView={{ opacity: 1, y: 0, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className={`bg-space-900/80 backdrop-blur-sm border border-white/10 p-6 rounded-2xl group hover:border-nebula-pink/50 transition-colors duration-300 relative overflow-hidden transform-gpu will-change-transform text-left ${align === 'right' ? 'md:text-right' : 'md:text-left'}`}
  >
     <div className="absolute inset-0 bg-gradient-to-br from-nebula-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
     <h4 className="text-xl md:text-2xl font-bold text-white mb-3 relative z-10 group-hover:text-nebula-light transition-colors">{step.title}</h4>
     <p className="text-blue-100/70 text-sm md:text-base leading-relaxed relative z-10">{step.description}</p>
  </MotionDiv>
);

export default Timeline;
