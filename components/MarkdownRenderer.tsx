import React, { lazy, Suspense } from 'react';
import remarkGfm from 'remark-gfm';

// Lazy load react-markdown to reduce initial bundle size
const ReactMarkdown = lazy(() => import('react-markdown'));

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <Suspense fallback={<div className="text-blue-100/70">{content}</div>}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-white mb-2 mt-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-white mb-2 mt-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold text-nebula-cyan mb-1 mt-2">{children}</h3>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="mb-2 last:mb-0">{children}</p>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-blue-100/90">{children}</li>
          ),
          // Code blocks
          code: ({ inline, children, ...props }: any) => {
            return inline ? (
              <code 
                className="bg-nebula-deep/20 text-nebula-pink px-1.5 py-0.5 rounded text-xs font-mono"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code 
                className="block bg-space-950/80 border border-white/10 p-3 rounded-lg text-xs font-mono overflow-x-auto my-2"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Strong/Bold
          strong: ({ children }) => (
            <strong className="font-bold text-white">{children}</strong>
          ),
          // Emphasis/Italic
          em: ({ children }) => (
            <em className="italic text-nebula-light">{children}</em>
          ),
          // Links
          a: ({ children, href }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-nebula-cyan hover:text-nebula-pink underline transition-colors"
            >
              {children}
            </a>
          ),
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-nebula-pink/50 pl-3 italic text-blue-100/70 my-2">
              {children}
            </blockquote>
          ),
          // Horizontal rule
          hr: () => (
            <hr className="border-white/10 my-3" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Suspense>
  );
};
