
import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Code, Database, Layout, 
  Terminal, Brain, Zap, 
  MessageSquare, GraduationCap, Award
} from 'lucide-react';
import { content } from '../data/content';

const MotionDiv = motion.div as any;
const MotionH3 = motion.h3 as any;

const About: React.FC = () => {
  const { about } = content;

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
        
        {/* Left Col: The Story */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
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
                    <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph.replace('console.log', '<span class="text-nebula-cyan font-mono">console.log</span>').replace('communication', '<strong>communication</strong>') }} />
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
                    {getIcon(skill.iconName, `w-6 h-6 ${skill.iconName === 'zap' ? 'text-yellow-400' : skill.iconName === 'brain' ? 'text-nebula-cyan' : 'text-nebula-pink'}`)}
                  </div>
                  <h5 className="text-white font-bold mb-2 group-hover:text-nebula-cyan transition-colors">{skill.title}</h5>
                  <p className="text-sm text-blue-100/60 leading-snug">{skill.desc}</p>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>

        {/* Right Col: Education & Certs */}
        <div className="lg:col-span-4 space-y-6">
          <MotionDiv
             initial={{ opacity: 0, x: 10 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="h-full bg-space-900/90 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden group transform-gpu"
          >
             <div className="absolute inset-0 bg-nebula-deep/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                   <GraduationCap className="w-6 h-6 text-nebula-cyan" />
                   <h4 className="text-xl font-bold text-white">Flight Academy</h4>
                </div>

                <div className="space-y-8 relative">
                   {/* Vertical Line */}
                   <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-white/10" />

                   {about.education.map((edu, idx) => (
                     <div key={idx} className="relative flex gap-4 group/item">
                       <div className="relative z-10 w-10 h-10 rounded-full bg-space-950 border border-nebula-cyan/50 flex items-center justify-center shrink-0">
                         {getIcon(edu.iconName, "w-4 h-4 text-nebula-cyan")}
                       </div>
                       <div>
                         <h5 className="text-white font-bold text-lg leading-tight group-hover/item:text-nebula-cyan transition-colors">{edu.degree}</h5>
                         <p className="text-nebula-pink text-sm mb-1">{edu.school}</p>
                         <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded">{edu.year}</span>
                       </div>
                     </div>
                   ))}
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
