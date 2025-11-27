
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Code, Database, Layout, 
  Terminal, Brain, Zap, 
  MessageSquare, GraduationCap, Award,
  Users, Briefcase, Instagram
} from 'lucide-react';
import { content } from '../data/content';
import { cn } from '../utils/cn';

const MotionDiv = motion.div as any;
const MotionH3 = motion.h3 as any;

const About: React.FC = () => {
  const { about } = content;
  
  // Refs for Education Line Calculation
  const eduContainerRef = useRef<HTMLDivElement>(null);
  const eduFirstIconRef = useRef<HTMLDivElement>(null);
  const eduLastIconRef = useRef<HTMLDivElement>(null);
  const [eduLineConfig, setEduLineConfig] = useState({ height: 0, top: 0 });

  useEffect(() => {
    const calculateEduLine = () => {
        if (!eduContainerRef.current || !eduFirstIconRef.current || !eduLastIconRef.current) return;
        
        const containerRect = eduContainerRef.current.getBoundingClientRect();
        const firstIconRect = eduFirstIconRef.current.getBoundingClientRect();
        const lastIconRect = eduLastIconRef.current.getBoundingClientRect();
        
        // Calculate relative top position based on the first icon center relative to container
        const relativeTop = (firstIconRect.top + firstIconRect.height / 2) - containerRect.top;
        
        // Calculate height: Distance between centers of first and last icon
        const height = (lastIconRect.top + lastIconRect.height / 2) - (firstIconRect.top + firstIconRect.height / 2);
        
        setEduLineConfig({ height: Math.max(0, height), top: relativeTop });
    };

    // Calculate initially and on resize
    calculateEduLine();
    window.addEventListener('resize', calculateEduLine);
    
    // Observer for layout shifts
    const observer = new ResizeObserver(calculateEduLine);
    if (eduContainerRef.current) observer.observe(eduContainerRef.current);

    // Initial timeout to ensure rendering is complete
    const timer = setTimeout(calculateEduLine, 200);

    return () => {
        window.removeEventListener('resize', calculateEduLine);
        observer.disconnect();
        clearTimeout(timer);
    };
  }, []);

  // Icon Mapper for dynamic rendering
  const getIcon = (name: string, className: string) => {
    const icons: Record<string, React.ReactNode> = {
        brain: <Brain className={className} />,
        message: <MessageSquare className={className} />,
        zap: <Zap className={className} />, 
        grad: <GraduationCap className={className} />,
        award: <Award className={className} />,
        layout: <Layout className={className} />,
        database: <Database className={className} />,
        terminal: <Terminal className={className} />,
        users: <Users className={className} />,
        instagram: <Instagram className={className} />,
    };
    return icons[name] || <User className={className} />;
  };

  return (
    <section id="about" className="relative z-10 py-20 px-4 max-w-6xl mx-auto">
      
      <MotionH3 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-white font-sans text-glow-sm"
      >
        {about.title}
      </MotionH3>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-8 md:mb-12">
        
        {/* Left Col: The Story & Experience */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          
          {/* Origin Story */}
          <MotionDiv
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-space-900/90 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden group transform-gpu will-change-opacity"
          >
            {/* Optimized Hover */}
            <div className="absolute inset-0 bg-nebula-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-full bg-nebula-deep/20 text-nebula-light border border-nebula-deep/50">
                  <User className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-white">{about.storyTitle}</h4>
              </div>
              
              <div className="space-y-4 text-blue-100/80 leading-relaxed text-base md:text-lg">
                {about.story.map((paragraph, idx) => (
                    <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph.replace('console.log', '<span class="text-nebula-cyan font-mono bg-nebula-cyan/10 px-1 rounded">console.log</span>').replace('communication', '<strong class="text-white">communication</strong>') }} />
                ))}
              </div>
            </div>
          </MotionDiv>

          {/* Mission Logs (Experience) */}
          <MotionDiv
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-space-900/90 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden group transform-gpu"
          >
              <div className="absolute inset-0 bg-nebula-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-full bg-nebula-deep/20 text-nebula-pink border border-nebula-deep/50">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <h4 className="text-2xl font-bold text-white">{about.experienceTitle}</h4>
                 </div>
                 
                 <div className="space-y-4">
                     {about.experience.map((exp) => (
                         <div 
                            key={exp.id} 
                            className={cn(
                                "relative p-5 rounded-xl bg-space-950/50 border border-white/5",
                                "hover:border-nebula-pink/30 hover:bg-space-800/50 transition-all duration-300 group/card"
                            )}
                         >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div>
                                    <h5 className="text-lg font-bold text-white group-hover/card:text-nebula-light transition-colors">{exp.role}</h5>
                                    <span className="text-nebula-cyan text-sm font-medium">{exp.company}</span>
                                </div>
                                <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-100/60 w-fit">
                                    {exp.period}
                                </span>
                            </div>
                            <p className="text-sm text-blue-100/70 leading-relaxed">
                                {exp.description}
                            </p>
                         </div>
                     ))}
                 </div>
              </div>
          </MotionDiv>

          {/* Soft Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {about.softSkills.map((skill, idx) => (
              <MotionDiv
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-space-900/90 border border-white/10 p-5 md:p-6 rounded-xl group relative overflow-hidden transform-gpu will-change-opacity"
              >
                <div className="absolute inset-0 bg-nebula-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="mb-4 p-2 bg-space-950 w-fit rounded-lg border border-white/10">
                    {getIcon(skill.iconName, `w-6 h-6 ${skill.iconName === 'zap' ? 'text-yellow-400' : skill.iconName === 'brain' ? 'text-nebula-cyan' : skill.iconName === 'users' ? 'text-green-400' : 'text-nebula-pink'}`)}
                  </div>
                  <h5 className="text-white font-bold mb-2 group-hover:text-nebula-cyan transition-colors">{skill.title}</h5>
                  <p className="text-sm text-blue-100/60 leading-snug">{skill.desc}</p>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>

        {/* Right Col: Education & Certs */}
        <div className="lg:col-span-4 h-full">
          <MotionDiv
             initial={{ opacity: 0, x: 10 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="h-full bg-space-900/90 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden group transform-gpu flex flex-col"
          >
             <div className="absolute inset-0 bg-nebula-deep/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                   <div className="p-2 bg-nebula-cyan/10 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-nebula-cyan" />
                   </div>
                   <h4 className="text-xl font-bold text-white">Flight Academy</h4>
                </div>

                <div className="space-y-6 relative" ref={eduContainerRef}>
                   {/* Dynamic Connecting Line */}
                   <div 
                        className="absolute left-[19px] w-[2px] bg-gradient-to-b from-nebula-cyan/50 via-nebula-pink/50 to-nebula-pink/10 transition-all duration-300 rounded-full"
                        style={{ 
                            top: `${eduLineConfig.top}px`,
                            height: `${eduLineConfig.height}px` 
                        }} 
                   />

                   {about.education.map((edu, idx) => {
                     const isLast = idx === about.education.length - 1;
                     return (
                        <div key={idx} className="relative flex gap-4 group/item">
                            {/* Icon Circle */}
                            <div 
                                ref={idx === 0 ? eduFirstIconRef : isLast ? eduLastIconRef : null}
                                className="relative z-10 w-10 h-10 rounded-full bg-space-950 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:border-nebula-cyan/50 group-hover/item:scale-110 transition-all duration-300 shadow-lg"
                            >
                                {getIcon(edu.iconName, "w-4 h-4 text-white/50 group-hover/item:text-nebula-cyan transition-colors")}
                            </div>
                            
                            {/* Card Content */}
                            <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 hover:border-nebula-pink/30 transition-all duration-300 cursor-default">
                                <span className="text-xs font-mono text-nebula-pink/80 bg-nebula-pink/10 px-2 py-0.5 rounded border border-nebula-pink/20 mb-2 inline-block">
                                    {edu.year}
                                </span>
                                <h5 className="text-white font-bold text-base leading-tight mb-1 group-hover/item:text-nebula-light transition-colors">
                                    {edu.degree}
                                </h5>
                                <p className="text-blue-100/60 text-sm">
                                    {edu.school}
                                </p>
                            </div>
                        </div>
                     );
                   })}
                </div>
             </div>
          </MotionDiv>
        </div>
      </div>

      {/* Tech Stack */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-space-900/90 border border-white/10 rounded-2xl p-6 md:p-10 relative overflow-hidden group transform-gpu"
      >
         <div className="absolute inset-0 bg-nebula-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
         
         <div className="relative z-10">
            <h4 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
                <Code className="w-6 h-6 text-nebula-pink" />
                Mission Loadout
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Object.values(about.techStack).map((category, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      {getIcon(category.iconName, `w-5 h-5 ${category.iconName === 'database' ? 'text-nebula-pink' : category.iconName === 'terminal' ? 'text-purple-400' : 'text-nebula-cyan'}`)}
                      <h5 className="text-lg font-bold text-white/90">{category.title}</h5>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, sIdx) => (
                        <span 
                          key={sIdx} 
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-sm text-blue-100/70 hover:bg-nebula-pink/10 hover:text-white transition-colors duration-200 cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
         </div>
      </MotionDiv>
    </section>
  );
};

export default About;
