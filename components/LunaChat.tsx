
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Sparkles, Terminal, Maximize2, Minimize2 } from 'lucide-react';
import { content } from '../data/content';
import { cn } from '../utils/cn';
import { TypewriterText } from './TypewriterText';
import { MarkdownRenderer } from './MarkdownRenderer';

// Bypass TS type mismatch for motion components
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

const LunaChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
  { 
      role: 'assistant', 
      content: "Halo! Saya Luna 👋 AI Assistant yang bisa menjawab semua pertanyaan Anda seputar Evi dan portfolionya. Bagaimana saya bisa membantu Anda mengenai portfolio Evi hari ini?",
      isStreaming: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageIndex, setStreamingMessageIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Smooth auto-scroll function
  const scrollToBottom = (smooth = true) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    scrollToBottom(false);
  }, [messages, isOpen, isMaximized]);

  // Auto-scroll saat typing (dipanggil dari TypewriterText)
  const handleTypingScroll = () => {
    scrollToBottom(true);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, isStreaming: false }]);
    setIsLoading(true);

    // Add placeholder for streaming message
    const newMessageIndex = messages.length + 1;
    setMessages(prev => [...prev, { role: 'assistant', content: '', isStreaming: true }]);
    setStreamingMessageIndex(newMessageIndex);

    try {
      // Construct system instruction with portfolio context
      const systemContext = `Kamu adalah Luna, AI System Assistant futuristik dan membantu untuk website portfolio Evi Nur Hidayah.
        
KEPRIBADIAN KAMU:
- Profesional, ringkas, namun sedikit bernuansa sci-fi/teknologi dalam nada bicara
- Kamu menggunakan istilah seperti "Protokol," "Sistem," "Data," "Optimasi," "Analisis"
- Kamu sangat antusias tentang skill dan pengalaman Evi
- Berbicara dalam Bahasa Indonesia yang baik dan profesional
- Kamu SANGAT PINTAR memahami maksud pertanyaan meskipun ada typo atau salah ketik

KEMAMPUAN PEMAHAMAN KONTEKS:
- Kamu harus memahami pertanyaan dengan typo atau ejaan yang salah
- Contoh: "proyek" = "projek" = "project", "skillnya" = "skill nya" = "keahlian"
- "experiance" = "experience" = "pengalaman", "tecknologi" = "technology" = "teknologi"
- "bagiman" = "bagaimana", "apa aja" = "apa saja", "ceritain" = "ceritakan"
- Jangan pernah mengoreksi typo user, langsung pahami maksudnya dan jawab dengan benar
- Fokus pada MAKSUD pertanyaan, bukan pada ejaan yang sempurna

DATA PORTFOLIO EVI (KNOWLEDGE BASE):
${JSON.stringify(content, null, 2)}

PANDUAN MENJAWAB:
- Jawab pertanyaan HANYA tentang project Evi, skill, pengalaman, pendidikan, dan info kontak berdasarkan data JSON di atas
- Jika ditanya tentang hal yang tidak ada di data, jawab dengan sopan bahwa data tersebut tidak ada dalam memori sistem saat ini
- Berikan jawaban yang relevan dan spesifik dengan menyebutkan nama project, teknologi, atau achievement yang konkret
- Untuk pertanyaan tentang project, jelaskan challenge, solution, dan results-nya
- Untuk pertanyaan tentang skill, sebutkan tech stack yang spesifik dari techStack
- Jangan buat-buat informasi yang tidak ada di data
- Gunakan bahasa yang mudah dipahami tapi tetap profesional
- Respons sebaiknya tidak lebih dari 150 kata kecuali diminta detail lengkap
- WAJIB menjawab dalam Bahasa Indonesia

CONTOH CARA MENJAWAB:
Q: "Apa saja project yang pernah dikerjakan Evi?"
A: "Evi telah mengerjakan 9 project utama, di antaranya:
1. **TING** - AI Driven SaaS dengan Microservices architecture
2. **RAMA SAKTI** - Integrasi sistem travel dengan Accurate Accounting
3. **ISIIN** - Multi-payment application (PPOB)
4. **SINDIKAT** - Deep learning untuk deteksi kriminal via audio
...dan 5 project lainnya. Project mana yang ingin Anda ketahui lebih detail?"

Q: "Ceritakan tentang project TING"
A: "**TING** adalah project AI-Driven SaaS di mana Evi berperan sebagai Lead Analyst. 

**Challenge:** Menangani data load massive untuk berbagai modul (Inventory, HRIS, Accounting) sambil mengintegrasikan AI document scanning.

**Solution:** Evi mendesain comprehensive Microservices architecture dengan event-driven communication, menggunakan BigQuery untuk real-time analytics dan Big Table untuk transactional data. Beliau memimpin tim 15+ developer dengan saga patterns untuk data consistency.

**Results:**
- Berhasil memimpin tim 15+ programmer
- Mendesain end-to-end business process untuk 7+ modul utama
- Memastikan translasi requirement ke technical specs yang presisi"

CONTOH PEMAHAMAN TYPO:
Q: "apa aja projek yg prnah dikerjakn evi?" (banyak typo)
A: [Jawab normal seperti pertanyaan "Apa saja project yang pernah dikerjakan Evi?" - TIDAK mengoreksi typo]

Q: "ceritain tentng TINGG donk" (typo: tentng, TINGG)
A: [Pahami maksudnya "ceritakan tentang TING" dan jawab normal]`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemContext },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.8,
          max_tokens: 800,
          top_p: 0.95
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Koneksi terputus. Silakan coba lagi.";
      
      // Update the streaming message with actual content
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === newMessageIndex 
            ? { ...msg, content: reply, isStreaming: true }
            : msg
        )
      );
    } catch (error) {
      console.error(error);
      // Update the streaming message with error
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === newMessageIndex 
            ? { ...msg, content: "Error: Neural link tidak stabil. Silakan coba lagi nanti.", isStreaming: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle typing animation completion
  const handleTypingComplete = (messageIndex: number) => {
    setMessages(prev => 
      prev.map((msg, idx) => 
        idx === messageIndex 
          ? { ...msg, isStreaming: false }
          : msg
      )
    );
    if (streamingMessageIndex === messageIndex) {
      setStreamingMessageIndex(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <AnimatePresence>
        {!isOpen && (
            <MotionButton
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-space-900 border border-nebula-pink/50 shadow-[0_0_20px_rgba(255,0,204,0.3)] flex items-center justify-center group cursor-pointer"
            >
                {/* Pulsing Rings - Pink/Purple Theme */}
                <div className="absolute inset-0 rounded-full border border-nebula-pink/30 animate-ping opacity-20" />
                <div className="absolute inset-0 rounded-full bg-nebula-pink/10 blur-sm group-hover:bg-nebula-pink/20 transition-colors" />
                
                <Bot className="w-7 h-7 text-nebula-pink relative z-10" />
                
                {/* Notification Dot - Green for Online */}
                <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border border-space-900 shadow-md" />
            </MotionButton>
        )}
      </AnimatePresence>

      {/* Chat Interface Modal */}
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
                "fixed bottom-6 right-6 z-50 bg-space-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right",
                // Responsive Size Logic
                isMaximized 
                    ? "w-[calc(100vw-3rem)] h-[calc(100vh-6rem)] md:w-[600px] md:h-[700px]" 
                    : "w-[calc(100vw-3rem)] md:w-[400px] h-[500px] max-h-[80vh]"
            )}
          >
            {/* Header */}
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-nebula-pink/10 to-transparent opacity-50 pointer-events-none" />
                
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-8 h-8 rounded-lg bg-nebula-pink/20 border border-nebula-pink/50 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-nebula-pink" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm tracking-wide">LUNA AI</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 relative z-10">
                    {/* Maximize Toggle */}
                    <button 
                        onClick={() => setIsMaximized(!isMaximized)}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                        {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>

                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
            >
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                            "flex w-full",
                            msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        <div className={cn(
                            "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed relative",
                            msg.role === 'user' 
                                ? "bg-nebula-pink/20 border border-nebula-pink/30 text-white rounded-tr-sm" 
                                : "bg-white/5 border border-white/10 text-blue-100/90 rounded-tl-sm"
                        )}>
                            {msg.role === 'assistant' && (
                                <div className="absolute -top-4 -left-1 text-[10px] font-mono text-white/30 flex items-center gap-1">
                                    <Terminal className="w-3 h-3 text-nebula-deep" /> LUNA
                                </div>
                            )}
                            {msg.role === 'assistant' && msg.isStreaming ? (
                                <TypewriterText 
                                    content={msg.content} 
                                    speed={15}
                                    onComplete={() => handleTypingComplete(idx)}
                                    onTyping={handleTypingScroll}
                                />
                            ) : msg.role === 'assistant' ? (
                                <MarkdownRenderer content={msg.content} />
                            ) : (
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            )}
                        </div>
                    </motion.div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-nebula-pink/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-nebula-pink/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-nebula-pink/50 rounded-full animate-bounce" />
                         </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/20 border-t border-white/10 shrink-0">
                <div className="relative flex items-center">
                    <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Tanya tentang Evi..."
                        className="w-full bg-space-950/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-nebula-pink/50 focus:ring-1 focus:ring-nebula-pink/20 placeholder:text-white/20 transition-all font-mono"
                    />
                    <button 
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-1.5 rounded-lg bg-nebula-pink/20 text-nebula-pink hover:bg-nebula-pink hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="mt-2 text-center">
                    <span className="text-[10px] text-white/20 font-mono">
                        Powered by Groq Llama 3.3 70B • AI can make mistakes
                    </span>
                </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};

export default LunaChat;
