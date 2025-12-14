
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Sparkles, Terminal, Maximize2, Minimize2 } from 'lucide-react';
import { content } from '../data/content';
import { cn } from '../utils/cn';
import { TypewriterText } from './TypewriterText';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SearchIndicator } from './SearchIndicator';
import { SourceCitations } from './SourceCitations';
import { SearchStatus } from './SearchStatus';
import { ReasoningIndicator } from './ReasoningIndicator';
import { 
  formatSearchResults,
  SearchResult,
  searchWeb
} from '../utils/webSearch';
import { 
  getTools,           // Tool definitions for AI function calling
  executeTool,        // Execute search_web when AI requests it
  hasToolCalls,       // Check if AI wants to use tools
  extractToolCalls,   // Extract tool call details from AI response
  extractToolCallsFromAssistantMessage,
  shouldDisableToolsForUserMessage,
  tryParseXmlStyleToolCall
} from '../utils/aiTools';
import { buildOptimizedContext } from '../utils/aiOptimizer';
import { validateOptimizedContext } from '../utils/portfolioContextValidator';
import { buildDeterministicPortfolioSummary } from '../utils/portfolioSummary';
import { 
  createReasoningEngine,
  ReasoningEngine,
  ReasoningStep 
} from '../utils/reasoningEngine';

// ============================================
// DEV TELEMETRY (guardrails observability)
// ============================================
type LunaTelemetryEvent =
  | 'groq_call_ok'
  | 'groq_call_error'
  | 'toolcalls_native'
  | 'toolcalls_xml_recovered'
  | 'toolcalls_repair_retry'
  | 'tool_exec_ok'
  | 'tool_exec_error'
  | 'tools_disabled_identity';

type LunaTelemetry = Record<LunaTelemetryEvent, number>;

const isDev = () => (
  typeof import.meta !== 'undefined' &&
  (import.meta as any).env &&
  Boolean((import.meta as any).env.DEV)
);

const createTelemetry = () => {
  const counters: LunaTelemetry = {
    groq_call_ok: 0,
    groq_call_error: 0,
    toolcalls_native: 0,
    toolcalls_xml_recovered: 0,
    toolcalls_repair_retry: 0,
    tool_exec_ok: 0,
    tool_exec_error: 0,
    tools_disabled_identity: 0,
  };

  const bump = (event: LunaTelemetryEvent, by = 1) => {
    counters[event] += by;

    if (!isDev()) return;

    // Expose for quick inspection in devtools.
    (window as any).__EVI_DEBUG = (window as any).__EVI_DEBUG || {};
    (window as any).__EVI_DEBUG.lunaTelemetry = counters;
  };

  const snapshot = () => ({ ...counters });

  return { bump, snapshot };
};

// ============================================
// CONSTANTS
// ============================================
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_NAME = 'llama-3.3-70b-versatile';
const SEARCH_DELAY = {
  SEARCHING: 500,   // Delay before showing processing status
  PROCESSING: 800,  // Delay before showing completed status
  COMPLETED: 600    // Delay before AI starts responding
};
const MAX_REASONING_ITERATIONS = 3; // Max thinking loops for multi-turn reasoning
const ENABLE_MULTI_TURN = false;    // Feature flag: false = use stable single-turn

// Bypass TS type mismatch for motion components
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

// ============================================
// TYPES
// ============================================
interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  sources?: SearchResult[];
  showSources?: boolean; // New flag to control when sources are visible
  searchMetadata?: {
    query: string;
    status: 'searching' | 'processing' | 'completed';
    resultCount: number;
  };
  reasoningSteps?: ReasoningStep[]; // Multi-turn reasoning steps
  reasoningIterations?: number;     // How many thinking loops
}

const LunaChat: React.FC = () => {
  const telemetryRef = useRef(createTelemetry());

  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Halo! Saya Luna 👋 AI Assistant yang bisa menjawab semua pertanyaan Anda seputar Evi dan portfolionya. Saya juga bisa mencari informasi dari web jika diperlukan! Bagaimana saya bisa membantu Anda hari ini?",
      isStreaming: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Helper: Update search status in UI
  const updateSearchStatus = (
    messageIndex: number, 
    query: string, 
    status: 'searching' | 'processing' | 'completed',
    resultCount: number,
    sources?: SearchResult[]
  ) => {
    setMessages(prev => 
      prev.map((msg, idx) => 
        idx === messageIndex 
          ? { 
              ...msg, 
              content: '', 
              isStreaming: true,
              searchMetadata: { query, status, resultCount },
              sources: sources || msg.sources
            }
          : msg
      )
    );
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    scrollToBottom(false);
  }, [messages, isOpen, isMaximized]);

  // Memoized scroll handler to prevent re-renders during typing
  const handleTypingScroll = useCallback(() => {
    scrollToBottom(true);
  }, []);

  // ============================================
  // SINGLE-TURN REASONING (Stable, Groq-compatible)
  // ============================================

  type SearchMode = 'no-search' | 'local-search-first' | 'model-tools';

  const detectSearchMode = (userMessage: string): SearchMode => {
    if (shouldDisableToolsForUserMessage(userMessage)) return 'no-search';

    // Groq-decides mode: let the model choose to use tools.
    // We keep a fallback/retry path for the intermittent XML tool-call issue.
    return 'model-tools';
  };

  const runLocalSearchWithUI = async (messageIndex: number, query: string) => {
    setIsSearching(true);
    setSearchQuery(query);

    updateSearchStatus(messageIndex, query, 'searching', 0);
    await new Promise((resolve) => setTimeout(resolve, SEARCH_DELAY.SEARCHING));

    const results = await searchWeb(query, 5);

    updateSearchStatus(messageIndex, query, 'processing', results.length);
    await new Promise((resolve) => setTimeout(resolve, SEARCH_DELAY.PROCESSING));

    updateSearchStatus(messageIndex, query, 'completed', results.length, results);
    await new Promise((resolve) => setTimeout(resolve, SEARCH_DELAY.COMPLETED));

    setIsSearching(false);
    setSearchQuery('');

    return results;
  };

  const getStrictToolRepairSystemPrompt = (baseSystemPrompt: string) => {
    return `${baseSystemPrompt}

IMPORTANT TOOL FORMAT:
- If you call a tool, DO NOT output XML like <function=...>.
- You MUST use the API tool call mechanism (tool_calls) only.
- If you cannot call tools safely, answer WITHOUT calling tools.`;
  };

  const handleSingleTurnReasoning = async (
    userMessage: string,
    conversationMessages: any[],
    systemPrompt: string,
    messageIndex: number
  ) => {
    let searchResults: SearchResult[] = [];

    const searchMode = detectSearchMode(userMessage);
    const disableTools = searchMode !== 'model-tools';

    if (disableTools) telemetryRef.current.bump('tools_disabled_identity');

    // For identity/portfolio questions, provide deterministic facts built from content.ts
    // to prevent hallucinated tech stacks.
    const portfolioFacts = disableTools
      ? buildDeterministicPortfolioSummary(content)
      : null;
    const groundedSystemPrompt = portfolioFacts
  ? `${systemPrompt}

MODE: PORTOFOLIO / IDENTITAS (Bahasa Indonesia)

ATURAN KEAKURATAN (WAJIB):
- Kamu HANYA boleh memakai fakta yang tertulis di blok "SOURCE OF TRUTH (content.ts)" di bawah.
- DILARANG menambahkan teknologi, tools, role, company, periode kerja, atau detail project yang tidak tertulis.
- Jika user menanyakan teknologi yang tidak tercantum, jawab persis: "Tidak tercantum di portfolio content.ts".

ATURAN KHUSUS PROJECT:
- Jika user bertanya "semua proyek" / "daftar proyek" / "proyek apa saja", kamu WAJIB menuliskan daftar judul project persis sesuai SOURCE OF TRUTH (tanpa menambah/mengurangi, tanpa salah mapping).
- Jangan pernah menyimpulkan project A = project B. Jika perlu, kutip judulnya apa adanya.

ATURAN BAHASA:
- Jawab dalam Bahasa Indonesia (kecuali user minta bahasa lain).

${portfolioFacts.factsBlock}`
  : systemPrompt;

    // Groq-decides: no pre-search. If the model needs web context it should request it.

    const callGroq = async (promptToUse: string) => {
      const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            { role: 'system', content: promptToUse },
            ...conversationMessages,
            { role: 'user', content: userMessage }
          ],
          // Always send tools for schema stability; choose whether the model may use them.
          tools: getTools(),
          tool_choice: disableTools ? 'none' : 'auto',
          temperature: 0.8,
          max_tokens: 800,
          top_p: 0.95
        })
      });
      return res;
    };

    const readErrorJsonSafe = async (res: Response) => {
      try {
        return await res.json();
      } catch {
        return null;
      }
    };

    const tryRecoverFromToolUseFailed = async (errorPayload: any) => {
      const failedGen: string | undefined = errorPayload?.error?.failed_generation;
      if (!failedGen || typeof failedGen !== 'string') return null;

      const parsed = tryParseXmlStyleToolCall(failedGen);
      if (!parsed || !parsed.name) return null;

      // Execute the requested tool locally (no provider tool calling).
      telemetryRef.current.bump('toolcalls_xml_recovered');
      telemetryRef.current.bump('tool_exec_ok', 0); // ensure key exists

      const query = parsed.arguments?.query;
      if (typeof query === 'string' && query.trim()) {
        setIsSearching(true);
        setSearchQuery(query);
        updateSearchStatus(messageIndex, query, 'searching', 0);
        await new Promise((resolve) => setTimeout(resolve, SEARCH_DELAY.SEARCHING));
      }

      let toolResult: any;
      try {
        toolResult = await executeTool(parsed.name, parsed.arguments);
        telemetryRef.current.bump('tool_exec_ok');
      } catch (e) {
        telemetryRef.current.bump('tool_exec_error');
        throw e;
      }

      // Update UI states for search
      if (toolResult?.success && Array.isArray(toolResult?.results)) {
        searchResults = toolResult.results;
        if (typeof query === 'string' && query.trim()) {
          updateSearchStatus(messageIndex, query, 'processing', searchResults.length);
          await new Promise((resolve) => setTimeout(resolve, SEARCH_DELAY.PROCESSING));
          updateSearchStatus(messageIndex, query, 'completed', searchResults.length, searchResults);
          await new Promise((resolve) => setTimeout(resolve, SEARCH_DELAY.COMPLETED));
        }
      }

      setIsSearching(false);
      setSearchQuery('');

      // Follow-up: ask Groq to answer using the tool results, but forbid tools.
      const updatedContext = buildOptimizedContext(content, searchResults);
      const updatedSystemPrompt = updatedContext.systemPrompt + '\n\n' + updatedContext.userContext;

      const followUp = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            { role: 'system', content: updatedSystemPrompt },
            ...conversationMessages,
            { role: 'user', content: userMessage },
            {
              role: 'assistant',
              content: '',
            },
            {
              role: 'tool',
              tool_call_id: 'recovered_toolcall',
              content: JSON.stringify(toolResult)
            }
          ],
          // critical: do NOT allow additional tools here
          tool_choice: 'none',
          temperature: 0.8,
          max_tokens: 800,
          top_p: 0.95
        })
      });

      if (!followUp.ok) {
        telemetryRef.current.bump('groq_call_error');
        return null;
      }

      telemetryRef.current.bump('groq_call_ok');
      const followData = await followUp.json();
      const reply = followData?.choices?.[0]?.message?.content;
      return typeof reply === 'string' && reply.trim() ? reply : null;
    };

  const response = await callGroq(groundedSystemPrompt);

    if (!response.ok) {
      telemetryRef.current.bump('groq_call_error');
      const errorPayload = await readErrorJsonSafe(response);

      // Hard fix (not avoidance): handle Groq tool_use_failed by recovering the malformed tool call.
      if (response.status === 400 && errorPayload?.error?.code === 'tool_use_failed') {
        const recoveredReply = await tryRecoverFromToolUseFailed(errorPayload);
        if (recoveredReply) {
          setMessages(prev => 
            prev.map((msg, idx) => 
              idx === messageIndex 
                ? { ...msg, content: recoveredReply, isStreaming: true, sources: searchResults, showSources: false }
                : msg
            )
          );
          return;
        }
      }

      if (response.status === 429) {
        throw new Error('Rate limit tercapai. Silakan coba lagi dalam beberapa menit. 🕐');
      }
      throw new Error(`API error: ${response.status}`);
    }

    telemetryRef.current.bump('groq_call_ok');

  const data = await response.json();

    // Extract tool calls (normal tool_calls OR XML-style fallback)
    let assistantMessage = data?.choices?.[0]?.message;
    let recoveredToolCalls = extractToolCallsFromAssistantMessage(assistantMessage);

  const hadNativeToolCalls = Array.isArray(assistantMessage?.tool_calls) && assistantMessage.tool_calls.length > 0;
  if (hadNativeToolCalls) telemetryRef.current.bump('toolcalls_native');
  if (!hadNativeToolCalls && recoveredToolCalls.length > 0) telemetryRef.current.bump('toolcalls_xml_recovered');

    // If the model returned an XML-style tool call, do one repair retry with stricter rules.
    if (!disableTools && recoveredToolCalls.length > 0 && !assistantMessage?.tool_calls) {
      telemetryRef.current.bump('toolcalls_repair_retry');
      const repairedPrompt = getStrictToolRepairSystemPrompt(groundedSystemPrompt);
      const retry = await callGroq(repairedPrompt);
      if (retry.ok) {
        telemetryRef.current.bump('groq_call_ok');
        const retryData = await retry.json();
        assistantMessage = retryData?.choices?.[0]?.message;
        recoveredToolCalls = extractToolCallsFromAssistantMessage(assistantMessage);

        const retryHadNativeToolCalls = Array.isArray(assistantMessage?.tool_calls) && assistantMessage.tool_calls.length > 0;
        if (retryHadNativeToolCalls) telemetryRef.current.bump('toolcalls_native');
        if (!retryHadNativeToolCalls && recoveredToolCalls.length > 0) telemetryRef.current.bump('toolcalls_xml_recovered');
      }
    }

    // PHASE 2: Execute tool calls if needed (only when we allow model-tools)
    if (searchMode === 'model-tools' && (!disableTools) && ((assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) || recoveredToolCalls.length > 0)) {
      // Prefer actual tool_calls; fallback to recovered XML parsing.
      const toolCalls = (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0)
        ? extractToolCalls({ choices: [{ message: assistantMessage }] })
        : recoveredToolCalls;
      
      for (const toolCall of toolCalls) {
        const { query, purpose } = toolCall.arguments;
        
        setIsSearching(true);
        setSearchQuery(query);
        
        updateSearchStatus(messageIndex, query, 'searching', 0);
        await new Promise(resolve => setTimeout(resolve, SEARCH_DELAY.SEARCHING));
        
        let toolResult: any;
        try {
          toolResult = await executeTool(toolCall.name, toolCall.arguments);
          telemetryRef.current.bump('tool_exec_ok');
        } catch (e) {
          telemetryRef.current.bump('tool_exec_error');
          throw e;
        }
        
        if (toolResult.success && toolResult.results) {
          searchResults = toolResult.results;
          
          updateSearchStatus(messageIndex, query, 'processing', searchResults.length);
          await new Promise(resolve => setTimeout(resolve, SEARCH_DELAY.PROCESSING));
          
          updateSearchStatus(messageIndex, query, 'completed', searchResults.length, searchResults);
          await new Promise(resolve => setTimeout(resolve, SEARCH_DELAY.COMPLETED));
        }
        
        setIsSearching(false);
        setSearchQuery('');
      }

      // PHASE 3: Final API call with search results
      const updatedContext = buildOptimizedContext(content, searchResults);
      const updatedSystemPrompt = updatedContext.systemPrompt + '\n\n' + updatedContext.userContext;

      const finalResponse = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            { role: 'system', content: updatedSystemPrompt },
            ...conversationMessages,
            { role: 'user', content: userMessage },
            // IMPORTANT (Groq reliability):
            // If tool calls were recovered from XML (not native tool_calls), do NOT inject them back
            // into a follow-up request. That can lead to "tool call validation failed".
            // Instead, provide the tool output as regular text context and forbid additional tools.
            ...(recoveredToolCalls.length > 0 && !(assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0)
              ? [
                  {
                    role: 'user',
                    content: `HASIL PENCARIAN WEB (search_web):\n${formatSearchResults(searchResults)}\n\nGunakan hasil di atas untuk menjawab pertanyaan terakhir. Jangan melakukan tool call lagi.`,
                  },
                ]
              : [
                  {
                    role: 'assistant',
                    content: assistantMessage?.content || '',
                    tool_calls: assistantMessage?.tool_calls,
                  },
                  ...toolCalls.map((tc) => ({
                    role: 'tool',
                    tool_call_id: tc.id,
                    content: JSON.stringify({
                      success: true,
                      results: searchResults,
                      count: searchResults.length,
                    }),
                  })),
                ]),
          ],
          tool_choice: (recoveredToolCalls.length > 0 && !(assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0)) ? 'none' : 'auto',
          temperature: 0.8,
          max_tokens: 800,
          top_p: 0.95
        })
      });

      if (!finalResponse.ok) {
        throw new Error(`API error: ${finalResponse.status}`);
      }

      const finalData = await finalResponse.json();
      const reply = finalData.choices?.[0]?.message?.content || "Koneksi terputus. Silakan coba lagi.";

      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === messageIndex 
            ? { ...msg, content: reply, isStreaming: true, sources: searchResults, showSources: false }
            : msg
        )
      );
    } else {
      // No search needed
      const reply = data.choices?.[0]?.message?.content || "Koneksi terputus. Silakan coba lagi.";
      
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === messageIndex 
            ? { ...msg, content: reply, isStreaming: true, showSources: false }
            : msg
        )
      );
    }
  };

  // ============================================
  // MULTI-TURN REASONING (Experimental)
  // ============================================
  const handleMultiTurnReasoning = async (
    userMessage: string,
    conversationMessages: any[],
    systemPrompt: string,
    messageIndex: number
  ) => {
    const reasoningEngine = createReasoningEngine(
      process.env.GROQ_API_KEY || '',
      systemPrompt,
      {
        maxIterations: MAX_REASONING_ITERATIONS,
        model: MODEL_NAME,
        apiUrl: GROQ_API_URL
      }
    );

    console.log('🧠 Starting multi-turn reasoning...');

    const reasoningResult = await reasoningEngine.reason(
      userMessage,
      conversationMessages
    );

    console.log('✅ Reasoning complete:', {
      iterations: reasoningResult.totalIterations,
      confidence: reasoningResult.confidence,
      searchesPerformed: reasoningResult.searchResults.length
    });

    // Show thinking process
    if (reasoningResult.steps.length > 1) {
      for (const step of reasoningResult.steps) {
        if (step.action?.type === 'search' && step.action.query) {
          setIsSearching(true);
          setSearchQuery(step.action.query);
          
          updateSearchStatus(messageIndex, step.action.query, 'searching', 0);
          await new Promise(resolve => setTimeout(resolve, SEARCH_DELAY.SEARCHING));
          
          updateSearchStatus(
            messageIndex, 
            step.action.query, 
            'completed', 
            reasoningResult.searchResults.length
          );
          await new Promise(resolve => setTimeout(resolve, SEARCH_DELAY.COMPLETED));
          
          setIsSearching(false);
        }
      }
    }

    // Stream final answer
    const finalAnswer = reasoningResult.finalAnswer;
    let currentText = '';
    const words = finalAnswer.split(' ');
    
    for (const word of words) {
      currentText += word + ' ';
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === messageIndex 
            ? { 
                ...msg, 
                content: currentText.trim(), 
                isStreaming: true,
                sources: reasoningResult.searchResults.length > 0 ? reasoningResult.searchResults : undefined,
                reasoningSteps: reasoningResult.steps,
                reasoningIterations: reasoningResult.totalIterations,
                showSources: false
              }
            : msg
        )
      );
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, isStreaming: false }]);
    setIsLoading(true);

    // Add placeholder for streaming AI response
    const newMessageIndex = messages.length + 1;
    setMessages(prev => [...prev, { role: 'assistant', content: '', isStreaming: true }]);
    setStreamingMessageIndex(newMessageIndex);

    try {
      // Prepare conversation history (exclude streaming messages)
      const conversationMessages = messages
        .filter(m => m.role !== 'assistant' || !m.isStreaming)
        .map(m => ({ role: m.role, content: m.content }));

      // Build system context with portfolio data
      const optimizedContext = buildOptimizedContext(content);

      // Dev-only: validate that the prompt contains key portfolio sections.
      // Some TS setups may not include Vite's ImportMeta typing; keep it safe.
      const isDev = (typeof import.meta !== 'undefined'
        && (import.meta as any).env
        && (import.meta as any).env.DEV) as boolean;
      if (isDev) {
        const validation = validateOptimizedContext(optimizedContext);
        if (!validation.ok) {
          console.warn('⚠️ Portfolio context validation failed:', validation.issues);
        }
      }
      const systemPrompt = optimizedContext.systemPrompt + '\n\n' + optimizedContext.userContext;

      // ============================================
      // CHOOSE REASONING MODE
      // ============================================
      if (ENABLE_MULTI_TURN) {
        // MULTI-TURN REASONING (experimental)
        await handleMultiTurnReasoning(
          userMessage,
          conversationMessages,
          systemPrompt,
          newMessageIndex
        );
      } else {
        // SINGLE-TURN (stable, Groq-compatible)
        await handleSingleTurnReasoning(
          userMessage,
          conversationMessages,
          systemPrompt,
          newMessageIndex
        );
      }

    } catch (error) {
      console.error(error);
      
      // Get error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Error: Neural link tidak stabil. Silakan coba lagi nanti.";
      
      // Update the streaming message with error
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === newMessageIndex 
            ? { ...msg, content: errorMessage, isStreaming: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle typing animation completion
  const handleTypingComplete = useCallback((messageIndex: number) => {
    setMessages(prev => 
      prev.map((msg, idx) => 
        idx === messageIndex 
          ? { ...msg, isStreaming: false, showSources: true } // Show sources after typing completes
          : msg
      )
    );
    setStreamingMessageIndex(prev => prev === messageIndex ? null : prev);
  }, []);

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
                {/* Search Indicator */}
                <SearchIndicator query={searchQuery} isSearching={isSearching} />
                
                {messages.map((msg, idx) => (
                    <motion.div
                        key={`${msg.role}-${idx}-${msg.content.substring(0, 20)}`}
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
                            
                            {/* Show search status if exists */}
                            {msg.role === 'assistant' && msg.searchMetadata && (
                                <SearchStatus 
                                    query={msg.searchMetadata.query}
                                    status={msg.searchMetadata.status}
                                    resultCount={msg.searchMetadata.resultCount}
                                    sources={msg.sources}
                                />
                            )}
                            
                            {/* Show reasoning steps if exists (multi-turn thinking) */}
                            {msg.role === 'assistant' && msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                                <ReasoningIndicator 
                                    steps={msg.reasoningSteps}
                                    currentIteration={msg.reasoningIterations}
                                    isComplete={true}
                                />
                            )}
                            
                            {msg.role === 'assistant' && msg.isStreaming ? (
                                <>
                                    {msg.content && (
                                        <TypewriterText 
                                            content={msg.content} 
                                            speed={15}
                                            onComplete={() => handleTypingComplete(idx)}
                                            onTyping={handleTypingScroll}
                                        />
                                    )}
                                    {/* Only show sources after typing completes */}
                                    {msg.showSources && msg.sources && msg.sources.length > 0 && (
                                        <SourceCitations sources={msg.sources} showAnimation={true} />
                                    )}
                                </>
                            ) : msg.role === 'assistant' ? (
                                <>
                                    {msg.content && <MarkdownRenderer content={msg.content} />}
                                    {msg.sources && msg.sources.length > 0 && (
                                        <SourceCitations sources={msg.sources} showAnimation={false} />
                                    )}
                                </>
                            ) : (
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            )}
                        </div>
                    </motion.div>
                ))}
                
                {isLoading && !isSearching && (
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
