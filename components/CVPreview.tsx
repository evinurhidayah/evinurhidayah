
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, FileText, ExternalLink } from 'lucide-react';
import { content } from '../data/content';

interface CVPreviewProps {
  onBack: () => void;
}

// Bypass TS type mismatch
const MotionDiv = motion.div as any;

const CVPreview: React.FC<CVPreviewProps> = ({ onBack }) => {
  const { cv } = content;

  useEffect(() => {
    // Prevent scrolling on the body, but do not reset window position
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Helper to convert Google Drive links to embeddable format
  const getEmbedUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      return url.replace(/\/view.*$/, '/preview').replace(/\/edit.*$/, '/preview');
    }
    return `${url}#toolbar=0&view=FitH`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-space-950/98 flex flex-col"
    >
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col h-full">

        {/* Top Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-nebula-pink transition-colors group font-mono text-sm cursor-pointer self-start md:self-auto"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            BACK TO UNIVERSE
          </button>

          <div className="flex gap-4">
            <a
              href={cv.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-nebula-cyan/10 hover:text-nebula-cyan hover:border-nebula-cyan/50 transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              Open External
            </a>
            <a
              href={cv.url}
              download={cv.filename}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-nebula-pink/20 border border-nebula-pink/50 text-white hover:bg-nebula-pink/40 transition-all cursor-pointer font-bold tracking-wide"
            >
              <Download className="w-4 h-4" />
              DOWNLOAD CV
            </a>
          </div>
        </div>

        {/* Main PDF Container */}
        <MotionDiv
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex-1 bg-space-900/90 border border-white/10 rounded-2xl p-1 md:p-2 shadow-lg relative overflow-hidden group flex flex-col min-h-[60vh] transform-gpu"
        >
          {/* Static Border Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-nebula-pink/20 via-nebula-cyan/20 to-nebula-pink/20 opacity-30 pointer-events-none" />

          {/* Header Bar inside Frame */}
          <div className="relative z-10 bg-space-950/80 p-3 rounded-t-xl border-b border-white/10 flex items-center gap-3">
            <FileText className="w-5 h-5 text-nebula-cyan" />
            <span className="text-sm font-mono text-white/70 tracking-widest uppercase">{cv.filename}</span>
            <div className="ml-auto flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
          </div>

          {/* PDF Embed */}
          <div className="relative z-10 flex-1 bg-white/90 rounded-b-xl overflow-hidden w-full h-full min-h-[500px]">
            <iframe
              src={getEmbedUrl(cv.url)}
              className="w-full h-full border-0"
              title="CV Preview"
              loading="lazy"
            />

            {/* Mobile Fallback overlay */}
            <div className="md:hidden absolute inset-0 flex flex-col items-center justify-center bg-space-900/90 text-center p-6 z-20">
              <FileText className="w-16 h-16 text-nebula-pink mb-4" />
              <p className="text-white mb-6">PDF Preview is optimized for desktop interfaces.</p>
              <a
                href={cv.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-nebula-pink to-nebula-deep text-white font-bold shadow-lg"
              >
                Open PDF Directly
              </a>
            </div>
          </div>
        </MotionDiv>

      </div>
    </motion.div>
  );
};

export default CVPreview;
