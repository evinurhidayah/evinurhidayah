import React from 'react';
import { Search, Globe, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchIndicatorProps {
  query: string;
  isSearching: boolean;
}

export const SearchIndicator: React.FC<SearchIndicatorProps> = ({ query, isSearching }) => {
  if (!isSearching) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-gradient-to-r from-nebula-pink/10 to-nebula-deep/20 border border-nebula-pink/30 rounded-xl p-3 mb-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="relative">
          <Globe className="w-4 h-4 text-nebula-pink" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1 -right-1"
          >
            <Loader2 className="w-3 h-3 text-nebula-cyan" />
          </motion.div>
        </div>
        <span className="text-xs font-mono text-white/90 font-semibold">
          🔍 SEARCHING WEB...
        </span>
      </div>
      
      <div className="flex items-start gap-2 text-[10px] font-mono text-white/60">
        <Search className="w-3 h-3 mt-0.5 shrink-0 text-nebula-cyan" />
        <span className="line-clamp-2 break-all">{query}</span>
      </div>
      
      {/* Animated progress bar */}
      <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-nebula-pink to-nebula-cyan"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};
