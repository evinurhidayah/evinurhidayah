
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { ArrowLeft, Layers, CheckCircle2, Cpu } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

// Bypass TS type mismatch
const MotionDiv = motion.div as any;

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  
  useEffect(() => {
    // Prevent scrolling on the body, but do not reset window position
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-space-950/98"
    >
      <div className="max-w-5xl mx-auto px-4 py-12 min-h-screen relative">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-nebula-pink transition-colors mb-8 group font-mono text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          BACK TO UNIVERSE
        </button>

        {/* Header Section */}
        <header className="mb-16 relative">
           <MotionDiv 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.1 }}
           >
             <span className="inline-block px-4 py-1.5 rounded-full bg-nebula-deep/20 border border-nebula-deep/50 text-nebula-light font-mono text-sm mb-4">
               {project.role}
             </span>
             <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-glow">
                {/* Static gradient text */}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-nebula-pink to-nebula-cyan leading-tight pb-2">
                  {project.title}
                </span>
             </h1>
             <p className="text-xl text-blue-100/80 max-w-2xl leading-relaxed">
               {project.description}
             </p>
           </MotionDiv>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Challenge & Solution */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Challenge Card */}
            <MotionDiv 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-space-900/40 border border-white/10 rounded-2xl p-8 relative overflow-hidden group shadow-sm"
            >
              <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 border border-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-300">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">The Challenge</h3>
              </div>
              <p className="text-blue-100/80 leading-relaxed whitespace-pre-line relative z-10">
                {project.challenge}
              </p>
            </MotionDiv>

            {/* Solution Card */}
            <MotionDiv 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-space-900/40 border border-white/10 rounded-2xl p-8 relative overflow-hidden group shadow-sm"
            >
               <div className="absolute inset-0 bg-nebula-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
               <div className="absolute inset-0 border border-nebula-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

               <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2 rounded-lg bg-nebula-cyan/20 text-nebula-cyan">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">The Solution</h3>
              </div>
              <p className="text-blue-100/80 leading-relaxed whitespace-pre-line relative z-10">
                {project.solution}
              </p>
            </MotionDiv>

          </div>

          {/* Right Column: Tech & Results */}
          <div className="space-y-8">
            
            {/* Tech Stack */}
            <MotionDiv 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-space-900/60 border border-white/10 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-white mb-4 font-mono uppercase tracking-wider">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-nebula-light">
                    {tech}
                  </span>
                ))}
              </div>
            </MotionDiv>

            {/* Results */}
            <MotionDiv 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-b from-space-800/50 to-space-900/50 border border-white/10 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-white mb-4 font-mono uppercase tracking-wider flex items-center gap-2">
                Key Results <span className="text-nebula-pink">✨</span>
              </h3>
              <ul className="space-y-4">
                {project.results.map((result, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-blue-100/90">
                    <CheckCircle2 className="w-5 h-5 text-nebula-cyan flex-shrink-0 mt-0.5" />
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </MotionDiv>

          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ProjectDetail;
