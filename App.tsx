
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import StarBackground from './components/StarBackground';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Timeline from './components/Timeline';
import Footer from './components/Footer';
import MagicCursor from './components/MagicCursor';
import ProjectDetail from './components/ProjectDetail';
import CVPreview from './components/CVPreview';
import { Project } from './types';

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCV, setShowCV] = useState(false);

  // Determines if any modal is open to hide main content interactions
  const isModalOpen = selectedProject !== null || showCV;

  return (
    <main className="min-h-screen bg-space-950 text-white relative selection:bg-nebula-pink selection:text-white md:cursor-none cursor-auto font-sans">
      <MagicCursor />
      <StarBackground />
      
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail 
            key="project-detail"
            project={selectedProject} 
            onBack={() => setSelectedProject(null)} 
          />
        )}
        {showCV && (
          <CVPreview 
            key="cv-preview"
            onBack={() => setShowCV(false)}
          />
        )}
      </AnimatePresence>

      <div className={`relative z-10 transition-opacity duration-500 ${isModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Hero onOpenCV={() => setShowCV(true)} />
        <About />
        <Projects onProjectClick={setSelectedProject} />
        <Timeline />
        <Footer />
      </div>
    </main>
  );
};

export default App;
