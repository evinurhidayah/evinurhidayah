
import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { content } from '../data/content';
import { FolderGit2, ArrowRight } from 'lucide-react';

const MotionH3 = motion.h3 as any;
const MotionDiv = motion.div as any;

interface ProjectsProps {
  onProjectClick: (project: Project) => void;
}

const Projects: React.FC<ProjectsProps> = ({ onProjectClick }) => {
  const { projects } = content;

  return (
    <section id="projects" className="relative z-10 py-20 px-4 max-w-6xl mx-auto">
      <MotionH3 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-center mb-16 text-white font-sans text-glow-sm"
      >
        {projects.title}
      </MotionH3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.items.map((project) => (
          <MotionDiv
            key={project.id}
            onClick={() => onProjectClick(project)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (project.id - 1) * 0.1, duration: 0.4 }} 
            whileHover={{ y: -5 }} 
            className="h-full bg-space-900/90 border border-white/10 rounded-2xl p-6 relative overflow-hidden group cursor-pointer flex flex-col shadow-lg hover:shadow-nebula-pink/10 transform-gpu"
          >
            {/* Optimized Hover: Opacity only */}
            <div className="absolute inset-0 bg-nebula-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute inset-0 border border-nebula-pink/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
            
            {/* Content Container - Flex Column for Height Management */}
            <div className="relative z-10 flex-1 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-xl bg-space-950 border border-white/5 group-hover:border-nebula-pink/30 transition-colors">
                    <FolderGit2 className="w-6 h-6 text-nebula-cyan group-hover:text-nebula-pink transition-colors" />
                </div>
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-nebula-pink/20 transition-colors">
                   <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
                </div>
              </div>
              
              <h4 className="text-xl font-bold text-white mb-2 group-hover:text-nebula-light transition-colors line-clamp-1">
                {project.title}
              </h4>
              
              <div className="inline-block self-start px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-nebula-pink mb-4 font-mono">
                {project.role}
              </div>
              
              <p className="text-blue-100/70 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                {project.description}
              </p>

              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-mono text-white/40">ID: PRJ-{project.id.toString().padStart(3, '0')}</span>
                  <span className="text-xs font-bold text-nebula-cyan uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                    View Data
                  </span>
              </div>
            </div>
          </MotionDiv>
        ))}
      </div>
    </section>
  );
};

export default Projects;
