export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ConversationMemoryState {
  /**
   * Compact summary of older conversation turns.
   * Stored as plain text (deterministic, not LLM-generated).
   */
  summary: string;
  /** How many non-summary messages have already been summarized. */
  summarizedCount: number;
}

export interface SummarizeOptions {
  /** Trigger after this many user messages (turns). Default: 4 */
  maxUserTurnsBeforeSummarize?: number;
  /** Keep this many latest messages verbatim. Default: 6 */
  keepLastMessages?: number;
  /** Trigger if approx tokens exceed this. Default: 1800 */
  maxApproxPromptTokens?: number;
}

const approxTokens = (s: string) => Math.ceil((s || '').length / 4);

const compactLine = (s: string) => (s || '').replace(/\s+/g, ' ').trim();

const extractPreferences = (text: string) => {
  const t = (text || '').toLowerCase();
  const prefs: string[] = [];
  if (t.includes('bahasa indonesia') || t.includes('b indo') || t.includes('bahasa indo')) {
    prefs.push('Prefer Bahasa Indonesia');
  }
  if (t.includes('hemat token') || t.includes('ringkas') || t.includes('singkat')) {
    prefs.push('Prefer jawaban ringkas/hemat token');
  }
  if (t.includes('jangan halu') || t.includes('jangan mengarang') || t.includes('sesuai content.ts')) {
    prefs.push('Wajib grounding ke content.ts (anti halusinasi)');
  }
  return prefs;
};

/**
 * Deterministic summarizer:
 * - Summarizes older turns into bullets (no LLM needed).
 * - Keeps last K messages untouched.
 */
export function summarizeConversationIfNeeded(
  messages: ChatMessage[],
  state: ConversationMemoryState,
  options?: SummarizeOptions
): {
  updatedState: ConversationMemoryState;
  keptMessages: ChatMessage[];
  summaryMessage: ChatMessage | null;
} {
  const maxUserTurnsBeforeSummarize = options?.maxUserTurnsBeforeSummarize ?? 4;
  const keepLastMessages = options?.keepLastMessages ?? 6;
  const maxApproxPromptTokens = options?.maxApproxPromptTokens ?? 1800;

  const userTurns = messages.filter((m) => m.role === 'user').length;
  const tokenEstimate = messages.reduce((acc, m) => acc + approxTokens(m.content), 0);

  const shouldSummarize = userTurns >= maxUserTurnsBeforeSummarize || tokenEstimate >= maxApproxPromptTokens;
  if (!shouldSummarize) {
    return { updatedState: state, keptMessages: messages, summaryMessage: state.summary ? { role: 'assistant', content: state.summary } : null };
  }

  // Keep last K messages verbatim; summarize the head.
  const cutIndex = Math.max(0, messages.length - keepLastMessages);
  const head = messages.slice(0, cutIndex);
  const tail = messages.slice(cutIndex);

  // Avoid re-summarizing the same messages repeatedly.
  const newHead = head.slice(state.summarizedCount);
  if (newHead.length === 0) {
    return { updatedState: state, keptMessages: tail, summaryMessage: state.summary ? { role: 'assistant', content: state.summary } : null };
  }

  const prefs = uniqStrings(newHead.flatMap((m) => extractPreferences(m.content)));

  const topics: string[] = [];
  for (const m of newHead) {
    const line = compactLine(m.content);
    if (!line) continue;
    // Put a short prefix to preserve who said what.
    topics.push(`${m.role === 'user' ? 'User' : 'Luna'}: ${line}`);
  }

  const nextSummary = [
    state.summary ? state.summary : '**RINGKASAN CHAT SEBELUMNYA (otomatis):**',
    !state.summary ? '' : '',
    prefs.length ? `**Preferensi / aturan:**\n${prefs.map((p) => `- ${p}`).join('\n')}` : '',
    topics.length ? `**Ringkasan percakapan:**\n${topics.map((t) => `- ${t}`).join('\n')}` : '',
  ].filter(Boolean).join('\n');

  const updatedState: ConversationMemoryState = {
    summary: nextSummary,
    summarizedCount: state.summarizedCount + newHead.length,
  };

  return {
    updatedState,
    keptMessages: tail,
    summaryMessage: { role: 'assistant', content: nextSummary },
  };
}

function uniqStrings(items: string[]) {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const i of items) {
    const k = (i || '').toLowerCase();
    if (!k) continue;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(i);
  }
  return out;
}
