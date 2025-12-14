export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

/**
 * Tech terms database for intelligent detection
 */
const TECH_TERMS = [
  'bigquery', 'big query', 'microservices', 'micro services',
  'kubernetes', 'docker', 'react', 'nodejs', 'node.js',
  'typescript', 'javascript', 'python', 'mongodb', 'postgresql',
  'mysql', 'redis', 'aws', 'azure', 'gcp', 'machine learning',
  'ai', 'deep learning', 'api', 'graphql', 'kafka', 'ci/cd'
];

/**
 * Check if message asks about tech in portfolio context
 * Example: "jelaskan evi dan bigquery" = YES (need search for BigQuery)
 */
function isTechInPortfolioContext(message: string): { isMixed: boolean; techTerm?: string } {
  const lowerMessage = message.toLowerCase();
  
  // Find tech terms
  const foundTech = TECH_TERMS.find(term => lowerMessage.includes(term));
  if (!foundTech) return { isMixed: false };
  
  // Check if also mentions portfolio
  const portfolioTerms = ['evi', 'project', 'penggunaan', 'pakai', 'menggunakan', 'di'];
  const hasPortfolio = portfolioTerms.some(term => lowerMessage.includes(term));
  
  return {
    isMixed: hasPortfolio,
    techTerm: foundTech
  };
}

/**
 * Search the web using Brave Search API via backend proxy
 * @param query - Search query string
 * @param count - Number of results (default: 5, max: 20)
 * @returns Array of search results with title, url, and snippet
 */
export async function searchWeb(query: string, count: number = 5): Promise<SearchResult[]> {
  try {
    // Always use backend proxy to avoid CORS
    // Development: http://localhost:3001/api/search (dev-proxy.js)
    // Production: /api/search (Vercel serverless function)
    const isProduction = window.location.hostname !== 'localhost';
    const apiEndpoint = isProduction 
      ? '/api/search' 
      : 'http://localhost:3001/api/search';

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, count }),
    });

    if (!response.ok) {
      console.error(`Search API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching web:', error);
    return [];
  }
}

/**
 * Detect if a user query needs web search
 * @param message - User message
 * @returns true if web search is needed
 */
export function needsWebSearch(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  // PRIORITY 0: Explicit search request from user
  // Example: "cari tau evi", "search for evi", "cari dari website", "google evi"
  const explicitSearchKeywords = [
    'cari tau', 'cari tahu', 'carikan', 'search for', 'search website',
    'cari dari', 'google', 'browsing', 'cek website', 'cek di web',
    'lihat di internet', 'info terbaru', 'info terkini'
  ];
  
  const isExplicitSearch = explicitSearchKeywords.some(keyword => lowerMessage.includes(keyword));
  if (isExplicitSearch) {
    console.log(`🔍 Explicit search request detected → SEARCH`);
    return true;  // User explicitly asks for web search
  }
  
  // PRIORITY 1: Check for tech terms in portfolio context
  // Example: "jelaskan evi dan bigquery" or "penggunaan bigquery di project"
  const techContext = isTechInPortfolioContext(message);
  if (techContext.isMixed && techContext.techTerm) {
    console.log(`🎯 Mixed query detected: portfolio + ${techContext.techTerm} → SEARCH`);
    return true;  // ALWAYS search for tech terms, even with "evi"
  }
  
  // PRIORITY 2: Pure tech queries with explanation request
  // Example: "apa itu bigquery", "jelaskan kubernetes", "details bigquery"
  const hasPureTech = TECH_TERMS.some(term => lowerMessage.includes(term));
  const isExplanationRequest = /(apa itu|jelaskan|explain|details?|detail|aktual|actual)/i.test(message);
  
  if (hasPureTech && isExplanationRequest) {
    console.log(`🎯 Pure tech query detected → SEARCH`);
    return true;
  }
  
  // Keywords that indicate need for web search
  const webSearchIndicators = [
    'terkini', 'terbaru', 'berita', 'sekarang', 'saat ini',
    'tahun 2025', 'tahun 2024', 'trend', 'latest', 'current'
  ];

  // Pure portfolio terms (BLOCK search if ONLY these)
  const purePortfolioPatterns = [
    /^(siapa|tentang|profil)\s+evi/i,
    /^(project|projek)\s+(evi|apa saja|yang)/i,
    /^(skill|keahlian)\s+evi/i,
    /^(contact|kontak|email)/i
  ];

  // Check if PURE portfolio query (no tech terms)
  const isPurePortfolio = purePortfolioPatterns.some(pattern => pattern.test(message));
  if (isPurePortfolio && !hasPureTech) {
    console.log(`📝 Pure portfolio query → NO SEARCH`);
    return false;
  }
  
  // Check general web indicators
  const hasWebIndicator = webSearchIndicators.some(indicator => lowerMessage.includes(indicator));
  
  return hasWebIndicator;
}

/**
 * Extract search query from user message
 * @param message - User message
 * @returns Clean search query
 */
export function extractSearchQuery(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Check if tech term is mentioned - extract just that for focused search
  const techContext = isTechInPortfolioContext(message);
  if (techContext.techTerm) {
    console.log(`🔍 Extracting tech term: ${techContext.techTerm}`);
    return techContext.techTerm;  // Search just "bigquery" instead of full message
  }
  
  // Special case 1: If asking about "evi diluar portfolio" or similar
  if (/(cari|search).*(evi).*(diluar|di luar|outside).*(portfolio|portofolio)/i.test(message)) {
    console.log(`🔍 Search Evi outside portfolio → "Evi Nur Hidayah System Analyst professional profile"`);
    return 'Evi Nur Hidayah System Analyst professional profile';
  }
  
  // Special case 2: If asking about "evi di website" or "evi dari website"
  if (/(cari|search).*(evi|tentang evi).*(di|dari|website|web)/i.test(message)) {
    console.log(`🔍 Search Evi from website → "Evi Nur Hidayah System Analyst professional profile"`);
    return 'Evi Nur Hidayah System Analyst professional profile';
  }
  
  // Remove common prefixes but PRESERVE core query
  let query = message
    .replace(/^(cari|carikan|cari tau|cari tahu|search|google|apa itu|jelaskan|jelaskan tentang|info tentang|informasi tentang|penggunaan|details?|detail)\s+/i, '')
    .replace(/(diluar|di luar)\s+(portfolio|portofolio)/gi, '')  // Remove "diluar portfolio"
    .replace(/\s+(dari website|dari web|di website|di web)$/i, '')  // Remove trailing "dari website"
    .replace(/\s+(juga|jga|dong|donk|yaa|ya)$/i, '')  // Remove casual words
    .trim();
  
  // If mentions "evi" in query (and not too long), assume they want Evi Nur Hidayah
  if (lowerMessage.includes('evi')) {
    // Check if it's a short query or just about "evi"
    if (query.length < 15 || query.match(/^(tentang\s+)?evi$/i)) {
      console.log(`🔍 Evi-focused search → "Evi Nur Hidayah System Analyst"`);
      return 'Evi Nur Hidayah System Analyst professional profile';
    }
  }
  
  // If query is too short or empty, return meaningful search
  if (query.length < 3) {
    return message;
  }

  console.log(`🔍 Extracted query: "${query}"`);
  return query;
}

/**
 * Format search results for AI context
 * @param results - Search results
 * @returns Formatted string for AI prompt
 */
export function formatSearchResults(results: SearchResult[]): string {
  if (results.length === 0) {
    return 'Tidak ada hasil pencarian web yang ditemukan.';
  }

  let formatted = '**HASIL PENCARIAN WEB:**\n\n';
  
  results.forEach((result, index) => {
    formatted += `${index + 1}. **${result.title}**\n`;
    formatted += `   URL: ${result.url}\n`;
    formatted += `   Snippet: ${result.snippet}\n\n`;
  });

  formatted += '\n**INSTRUKSI:** Gunakan informasi di atas untuk menjawab pertanyaan user dengan konteks yang akurat. Sebutkan sumber jika relevan.\n';

  return formatted;
}
