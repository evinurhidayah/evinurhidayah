import React, { useState, useEffect } from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { SearchResult } from '../utils/webSearch';

interface SourceCitationsProps {
  sources: SearchResult[];
  showAnimation?: boolean;
}

export const SourceCitations: React.FC<SourceCitationsProps> = ({ sources, showAnimation = true }) => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!showAnimation) {
      setVisibleCount(sources.length);
      return;
    }

    // Show sources one by one with smooth stagger animation
    const timers: NodeJS.Timeout[] = [];
    
    sources.slice(0, 3).forEach((_, idx) => {
      const timer = setTimeout(() => {
        setVisibleCount(idx + 1);
      }, idx * 600); // 600ms delay for smoother appearance
      timers.push(timer);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [sources, showAnimation]);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-white/10 animate-in fade-in duration-500">
      <div className="flex items-center gap-1.5 mb-2 animate-in slide-in-from-left duration-300">
        <FileText className="w-3 h-3 text-nebula-cyan animate-pulse" />
        <span className="text-[10px] font-mono text-white/50 uppercase tracking-wide">
          Sources
        </span>
      </div>
      
      <div className="space-y-1.5">
        {sources.slice(0, 3).map((source, idx) => (
          <a
            key={idx}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-start gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-nebula-cyan/30 ${
              idx < visibleCount 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-8 pointer-events-none'
            }`}
            style={{
              transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: idx < visibleCount ? '0ms' : '0ms',
            }}
          >
            <ExternalLink className="w-3 h-3 text-nebula-pink shrink-0 mt-0.5 group-hover:text-nebula-cyan transition-colors" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/80 font-medium line-clamp-1 group-hover:text-nebula-cyan transition-colors">
                {source.title}
              </div>
              <div className="text-[10px] text-white/40 truncate font-mono">
                {new URL(source.url).hostname}
              </div>
            </div>
          </a>
        ))}
      </div>
      
      {sources.length > 3 && visibleCount >= 3 && (
        <div className="text-[10px] text-white/30 font-mono text-center mt-2 animate-in fade-in duration-500">
          +{sources.length - 3} more sources
        </div>
      )}
    </div>
  );
};
