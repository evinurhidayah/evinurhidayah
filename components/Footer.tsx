
import React from 'react';
import { Mail, Linkedin, Github, Twitter, Globe } from 'lucide-react';
import { content } from '../data/content';

const Footer: React.FC = () => {
  const { footer } = content;
  const currentYear = new Date().getFullYear();

  const getIcon = (name: string) => {
      switch(name) {
          case 'mail': return <Mail className="w-5 h-5" />;
          case 'linkedin': return <Linkedin className="w-5 h-5" />;
          case 'github': return <Github className="w-5 h-5" />;
          case 'twitter': return <Twitter className="w-5 h-5" />;
          case 'globe': return <Globe className="w-5 h-5" />;
          default: return <Mail className="w-5 h-5" />;
      }
  }

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    if (href.startsWith('#')) {
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };

  return (
    <footer className="relative z-10 mt-20 bg-space-950 overflow-hidden">
      {/* Static Border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-nebula-pink/30 to-transparent" />
      
      <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-sans">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-nebula-pink to-nebula-cyan">
                {footer.brandName}
              </span>
            </h2>
            <p className="text-blue-100/60 max-w-xs leading-relaxed">
              {footer.mission}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full w-fit border border-emerald-400/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              ALL SYSTEMS OPERATIONAL
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-white font-bold mb-6 font-sans tracking-wide">{footer.coordinatesTitle}</h3>
            <ul className="space-y-4">
              {footer.coordinates.map((item, idx) => (
                <li key={idx}>
                  <a 
                    href={item.href} 
                    onClick={(e) => handleScroll(e, item.href)}
                    className="text-blue-100/60 hover:text-nebula-pink transition-colors flex items-center gap-2 group w-fit cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-nebula-deep/50 group-hover:bg-nebula-pink transition-colors" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="text-white font-bold mb-6 font-sans tracking-wide">{footer.connectTitle}</h3>
            <p className="text-blue-100/60 mb-6">
              {footer.connectText}
            </p>
            
            <div className="flex gap-4">
              {footer.socials.map((link, index) => (
                <a 
                  key={index}
                  href={link.href}
                  aria-label={link.label}
                  className="p-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-nebula-deep/20 transition-all duration-300 group relative"
                >
                  {getIcon(link.iconName)}
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-nebula-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-100/40 font-mono">
          <p>© {currentYear} {footer.brandName}. {footer.copyright}</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-nebula-pink cursor-pointer transition-colors">Privacy Protocol</span>
            <span className="hover:text-nebula-pink cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
      
      {/* Optimized Background Glow: Static Gradient with masking to prevent overflow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] pointer-events-none opacity-60" 
        style={{
             background: 'radial-gradient(ellipse at bottom, rgba(183,0,255,0.15) 0%, transparent 70%)',
             transform: 'translateZ(0)'
        }}
      />
    </footer>
  );
};

export default Footer;
