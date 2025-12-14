import React, { useState, useEffect, useRef } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface TypewriterProps {
  content: string;
  speed?: number;
  onComplete?: () => void;
  onTyping?: () => void;
}

export const TypewriterText: React.FC<TypewriterProps> = ({ 
  content, 
  speed = 15,
  onComplete,
  onTyping
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);
  const isTypingRef = useRef(true);
  const contentRef = useRef(content);

  useEffect(() => {
    // Only start typing if content changes
    if (contentRef.current === content && !isTypingRef.current) {
      return;
    }

    if (!content) return;

    // Update content ref
    contentRef.current = content;
    currentIndexRef.current = 0;
    isTypingRef.current = true;
    setDisplayedContent('');
    setIsTyping(true);

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (currentIndexRef.current < content.length) {
        setDisplayedContent(content.slice(0, currentIndexRef.current + 1));
        currentIndexRef.current++;
        onTyping?.();
      } else {
        isTypingRef.current = false;
        setIsTyping(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        onComplete?.();
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [content]); // Only depend on content change

  return (
    <div className="relative">
      <MarkdownRenderer content={displayedContent} />
      
      {/* Typing cursor */}
      {isTyping && (
        <span className="inline-block w-1.5 h-4 bg-nebula-pink animate-pulse ml-0.5" />
      )}
    </div>
  );
};
