
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, FileText } from 'lucide-react';
import { content } from '../data/content';

// Bypass TS type mismatch for motion components
const MotionDiv = motion.div as any;
const MotionP = motion.p as any;
const MotionButton = motion.button as any;

interface HeroProps {
  onOpenCV: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenCV }) => {
  const { hero } = content;

  return (
    <section id="hero" className="relative z-10 h-[100svh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative will-change-transform"
      >
        {/* Optimized: Static radial gradient */}
        <div 
            className="absolute inset-0 rounded-full pointer-events-none" 
            style={{
                background: 'radial-gradient(circle, rgba(255,0,204,0.12) 0%, transparent 60%)',
                transform: 'scale(1.5) translateZ(0)'
            }}
        />
        
        <h1 className="relative text-5xl md:text-8xl font-bold font-sans tracking-tight mb-6 text-white text-glow leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-nebula-pink to-nebula-deep pb-2 block">
            {hero.name}
          </span>
        </h1>
        
        <h2 className="relative text-xl md:text-4xl font-mono text-pink-200 font-light tracking-widest uppercase text-glow-sm">
          {hero.role}
        </h2>
      </MotionDiv>

      <MotionP
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-8 text-pink-100/80 max-w-md text-base md:text-lg mb-12 leading-relaxed px-4"
      >
        {hero.tagline}
      </MotionP>

      <MotionButton
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        onClick={onOpenCV}
        className="group relative px-8 py-3 bg-space-900/90 border border-nebula-pink/30 rounded-full overflow-hidden transition-colors duration-200 cursor-pointer hover:border-nebula-pink will-change-transform"
      >
        <div className="absolute inset-0 bg-nebula-pink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <span className="relative z-10 flex items-center gap-2 font-mono text-sm tracking-widest text-white uppercase">
          <FileText className="w-4 h-4 text-nebula-cyan" />
          {hero.buttonText}
        </span>
      </MotionButton>

      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
            delay: 1, 
            duration: 2, 
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
        }}
        className="absolute bottom-10 cursor-pointer will-change-transform"
        onClick={() => {
            const aboutSection = document.getElementById('about');
            aboutSection?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <ArrowDown className="w-8 h-8 text-pink-200/50 hover:text-pink-200 transition-colors" />
      </MotionDiv>
    </section>
  );
};

export default Hero;
