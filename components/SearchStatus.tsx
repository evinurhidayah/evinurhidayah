import React from 'react';
import { Search, CheckCircle, Loader2 } from 'lucide-react';

interface SearchStatusProps {
  query: string;
  status: 'searching' | 'processing' | 'completed';
  resultCount?: number;
  sources?: Array<{ title: string }>;
}

export const SearchStatus: React.FC<SearchStatusProps> = ({ 
  query, 
  status, 
  resultCount = 0,
  sources = []
}) => {
  return (
    <div className="mb-3 p-3 rounded-lg bg-white/5 border border-nebula-cyan/20">
      <div className="flex items-start gap-2.5">
        {/* Icon based on status */}
        <div className="shrink-0 mt-0.5">
          {status === 'searching' && (
            <Loader2 className="w-4 h-4 text-nebula-cyan animate-spin" />
          )}
          {status === 'processing' && (
            <Loader2 className="w-4 h-4 text-nebula-pink animate-spin" />
          )}
          {status === 'completed' && (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          )}
        </div>

        {/* Status content */}
        <div className="flex-1 min-w-0">
          {/* Status header */}
          <div className="flex items-center gap-2 mb-1.5">
            <Search className="w-3 h-3 text-nebula-cyan" />
            <span className="text-xs font-mono text-white/70">
              {status === 'searching' && 'Mencari informasi dari web...'}
              {status === 'processing' && 'Memproses hasil pencarian...'}
              {status === 'completed' && 'Pencarian selesai'}
            </span>
          </div>

          {/* Query */}
          <div className="text-[11px] font-medium text-white/90 mb-2">
            "{query}"
          </div>

          {/* Results summary */}
          {status === 'completed' && resultCount > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] text-emerald-400/80 font-mono">
                ✓ Menemukan {resultCount} sumber
              </div>
              {sources.slice(0, 3).length > 0 && (
                <div className="pl-3 space-y-0.5">
                  {sources.slice(0, 3).map((source, idx) => (
                    <div 
                      key={idx} 
                      className="text-[10px] text-white/50 truncate flex items-start gap-1.5"
                    >
                      <span className="text-nebula-pink shrink-0">{idx + 1}.</span>
                      <span className="truncate">{source.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
