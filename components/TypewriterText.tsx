import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!content) return;

    let currentIndex = 0;
    setDisplayedContent('');
    setIsTyping(true);

    const timer = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        currentIndex++;
        onTyping?.();
      } else {
        setIsTyping(false);
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [content, speed, onComplete, onTyping]);

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
