/**
 * AI Optimizer - Smart token management and context optimization
 * Enhanced with ReAct Pattern and Chain of Thought
 */

export interface OptimizedContext {
  systemPrompt: string;
  userContext: string;
  estimatedTokens: number;
}

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters)
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Truncate text smartly (keep start and end, summarize middle)
 */
export function smartTruncate(text: string, maxTokens: number): string {
  const tokens = estimateTokens(text);
  if (tokens <= maxTokens) return text;

  const targetChars = maxTokens * 4;
  const keepStart = Math.floor(targetChars * 0.4);
  const keepEnd = Math.floor(targetChars * 0.4);
  
  const start = text.substring(0, keepStart);
  const end = text.substring(text.length - keepEnd);
  
  return `${start}\n\n[... ${tokens - maxTokens} tokens diringkas ...]\n\n${end}`;
}

/**
 * Summarize search results efficiently
 */
export function summarizeSearchResults(results: any[], maxResults: number = 3): string {
  return results
    .slice(0, maxResults)
    .map((r, i) => `[${i + 1}] ${r.title}\n${r.snippet.substring(0, 150)}...`)
    .join('\n\n');
}

/**
 * Build optimized context for AI
 */
export function buildOptimizedContext(
  portfolioData: any,
  searchResults?: any[],
  maxTokens: number = 1500
): OptimizedContext {
  let context = '';
  let tokens = 0;

  const tryAppend = (block: string, blockTokenLimit?: number) => {
    const trimmed = (block || '').trim();
    if (!trimmed) return;
    const limited = blockTokenLimit ? smartTruncate(trimmed, blockTokenLimit) : trimmed;
    const t = estimateTokens(limited);
    if (tokens + t > maxTokens) return;
    context += (context ? '\n\n' : '') + limited;
    tokens += t;
  };

  const name = portfolioData.hero?.name || 'Evi Nur Hidayah';
  const role = portfolioData.hero?.role || 'System Analyst';
  const tagline = portfolioData.hero?.tagline || '';

  // --- Experience (full list) ---
  const experienceLines = Array.isArray(portfolioData.about?.experience)
    ? portfolioData.about.experience.map((e: any) => {
        const desc = e.description ? ` — ${e.description}` : '';
        return `- ${e.role} — ${e.company} (${e.period})${desc}`;
      })
    : [];

  // --- Tech stack (structured) ---
  const techStack = portfolioData.about?.techStack;
  const techStackBlock = techStack
    ? [
        `Modeling & Architecture: ${(techStack.modeling?.skills || []).join(', ')}`,
        `Data & Development: ${(techStack.data?.skills || []).join(', ')}`,
        `Management & Tools: ${(techStack.tools?.skills || []).join(', ')}`,
      ].filter(Boolean).join('\n')
    : '';

  // --- Projects (summary with key fields) ---
  const projectItems: any[] = Array.isArray(portfolioData.projects?.items)
    ? portfolioData.projects.items
    : [];

  const projectSummaries = projectItems.map((p: any) => {
    const tech = (p.technologies || p.techStack || []).join(', ');
    const results = Array.isArray(p.results) ? p.results.slice(0, 3).join(' | ') : '';
    return [
      `### ${p.title} — ${p.role}`,
      p.description ? `- Ringkas: ${p.description}` : '',
      tech ? `- Tech: ${tech}` : '',
      p.challenge ? `- Challenge: ${p.challenge}` : '',
      p.solution ? `- Solution: ${p.solution}` : '',
      results ? `- Results: ${results}` : '',
    ].filter(Boolean).join('\n');
  });

  // --- Timeline / process ---
  const timelineSteps: any[] = Array.isArray(portfolioData.timeline?.steps)
    ? portfolioData.timeline.steps
    : [];
  const timelineBlock = timelineSteps.length
    ? timelineSteps.map((s: any) => `- ${s.title}: ${s.description}`).join('\n')
    : '';

  // --- Footer / links ---
  const footer = portfolioData.footer;
  const footerBlock = footer
    ? [
        footer.mission ? `Mission: ${footer.mission}` : '',
        Array.isArray(footer.coordinates)
          ? `Sections: ${footer.coordinates.map((c: any) => c.label).join(', ')}`
          : '',
      ].filter(Boolean).join('\n')
    : '';

  // ============ Assemble deterministic context ============
  tryAppend(
    [
      `**EVI NUR HIDAYAH PORTFOLIO DATA (SOURCE OF TRUTH):**`,
      `Name: ${name}`,
      `Primary Role: ${role}`,
      tagline ? `Tagline: ${tagline}` : '',
      '',
      `IMPORTANT: Evi is a System Analyst in SOFTWARE/TECH industry, NOT Electric Vehicle industry!`,
    ].filter(Boolean).join('\n')
  );

  if (portfolioData.about?.storyTitle || Array.isArray(portfolioData.about?.story)) {
    tryAppend(
      [
        `**ABOUT / STORY:**`,
        portfolioData.about?.storyTitle ? `${portfolioData.about.storyTitle}` : '',
        Array.isArray(portfolioData.about?.story)
          ? portfolioData.about.story.map((s: string) => `- ${s}`).join('\n')
          : '',
      ].filter(Boolean).join('\n'),
      260
    );
  }

  if (experienceLines.length > 0) {
    tryAppend(
      [`**WORK EXPERIENCE:**`, ...experienceLines].join('\n'),
      240
    );
  }

  if (techStackBlock) {
    tryAppend(
      `**TECH STACK:**\n${techStackBlock}`,
      240
    );
  }

  if (projectSummaries.length > 0) {
    // Keep within budget: summarize all projects but truncate block if needed.
    tryAppend(
      `**PROJECTS (CASE STUDIES):**\n\n${projectSummaries.join('\n\n')}`,
      520
    );
  }

  if (timelineBlock) {
    tryAppend(
      `**PROCESS / TIMELINE:**\n${timelineBlock}`,
      160
    );
  }

  if (footerBlock) {
    tryAppend(
      `**FOOTER:**\n${footerBlock}`,
      80
    );
  }

  // Add search results if available
  if (searchResults && searchResults.length > 0) {
    const searchSummary = `\n\nWeb Search Results:\n${summarizeSearchResults(searchResults, 3)}`;
    const searchTokens = estimateTokens(searchSummary);
    
    if (tokens + searchTokens <= maxTokens) {
      context += searchSummary;
      tokens += searchTokens;
    }
  }

  return {
    systemPrompt: buildSystemPrompt(),
    userContext: context,
    estimatedTokens: tokens,
  };
}

/**
 * Build system prompt (optimized, concise)
 * Enhanced with ReAct pattern and Chain of Thought - Industry best practices
 */
function buildSystemPrompt(): string {
  return `Luna - AI Assistant Portfolio Evi Nur Hidayah

Evi Nur Hidayah = SYSTEM ANALYST (bukan Electric Vehicle!).
Projects: TING (AI SaaS), RAMA SAKTI (Travel), ISIIN (PPOB), SINDIKAT, dll.
Tech: Microservices, BigQuery, Kubernetes, Docker, React, Node.js, Python.

PERSONALITY:
- Jelaskan portfolio Evi Nur Hidayah
- Cari info dari web jika perlu
- Jawab 100-150 kata

RULES:
- NEVER use web search for personal info about Evi (who/job/bio). Use the provided portfolio data.
- Use web search ONLY for general tech topics, trends, best practices, or definitions.
- If info is in portfolio → answer directly (no search).

MARKDOWN: Use **bold**, lists`;
}

/**
 * Detect if AI should request additional search mid-conversation
 * Supports ReAct pattern - AI can decide to search during reasoning
 */
export function shouldRequestSearch(aiResponse: string): boolean {
  // Pattern 1: Explicit [SEARCH: query] marker (primary)
  if (/\[SEARCH:\s*[^\]]+\]/i.test(aiResponse)) {
    console.log('🤖 AI requested search with [SEARCH:] marker');
    return true;
  }
  
  // Pattern 2: Natural language search indicators
  const searchTriggers = [
    'saya perlu mencari informasi',
    'biarkan saya cari',
    'saya akan search',
    'saya cari dulu',
    'perlu data terkini',
    'mari saya cari',
    'let me search',
    'saya akan mencari',
    'perlu informasi lebih',
  ];

  const hasSearchTrigger = searchTriggers.some(trigger => 
    aiResponse.toLowerCase().includes(trigger.toLowerCase())
  );
  
  if (hasSearchTrigger) {
    console.log('🤖 AI indicated need for search (natural language)');
  }
  
  return hasSearchTrigger;
}

/**
 * Extract search query from AI response (ReAct pattern)
 * Supports multiple formats for flexibility
 */
export function extractSearchFromAI(aiResponse: string): string | null {
  // Pattern 1: [SEARCH: query] - Explicit marker (primary)
  const markerPattern = /\[SEARCH:\s*([^\]]+)\]/i;
  const markerMatch = aiResponse.match(markerPattern);
  if (markerMatch) {
    const query = markerMatch[1].trim();
    console.log(`🔍 Extracted search query from [SEARCH:]: "${query}"`);
    return query;
  }
  
  // Pattern 2: Natural language with quotes
  const quotedPatterns = [
    /(?:cari|search|mencari)(?:\s+dulu)?(?:\s+tentang)?(?:\s+informasi)?\s+"([^"]+)"/i,
    /(?:cari|search|mencari)(?:\s+dulu)?(?:\s+tentang)?(?:\s+informasi)?\s+'([^']+)'/i,
  ];
  
  for (const pattern of quotedPatterns) {
    const match = aiResponse.match(pattern);
    if (match) {
      const query = match[1].trim();
      console.log(`🔍 Extracted search query (quoted): "${query}"`);
      return query;
    }
  }
  
  // Pattern 3: Extract from natural sentence
  const naturalPattern = /(?:mencari|cari|search)(?:\s+informasi)?(?:\s+tentang)\s+([a-zA-Z0-9\s]+?)(?:\.\.\.|\.|\,|$)/i;
  const naturalMatch = aiResponse.match(naturalPattern);
  if (naturalMatch) {
    const query = naturalMatch[1].trim();
    console.log(`🔍 Extracted search query (natural): "${query}"`);
    return query;
  }

  console.log('⚠️ No search query found in AI response');
  return null;
}

/**
 * Build conversation history (optimized for token efficiency)
 */
export function buildConversationHistory(
  messages: Array<{ role: string; content: string }>,
  maxMessages: number = 4
): Array<{ role: string; content: string }> {
  // Keep only last N messages to save tokens
  const recentMessages = messages.slice(-maxMessages);
  
  return recentMessages.map(msg => ({
    role: msg.role,
    content: msg.role === 'user' 
      ? msg.content 
      : smartTruncate(msg.content, 150), // Truncate AI responses
  }));
}

/**
 * Calculate remaining token budget
 */
export function calculateTokenBudget(
  systemTokens: number,
  contextTokens: number,
  historyTokens: number,
  maxTotal: number = 3000
): number {
  const used = systemTokens + contextTokens + historyTokens;
  return Math.max(0, maxTotal - used);
}
