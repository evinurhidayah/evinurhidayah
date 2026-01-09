/**
 * AI Tools with Function Calling for Groq
 * Modern AI-to-AI communication using tool/function calling
 */

import { searchWeb, formatSearchResults, SearchResult } from './webSearch';

// ============================================
// TOOL-CALL GUARDRAILS (Groq reliability)
// ============================================

/**
 * Groq sometimes emits XML-style tool calls like:
 * <function=search_web{"query":"...","purpose":"..."}</function>
 * This helper extracts the JSON payload so we can recover gracefully.
 */
export function tryParseXmlStyleToolCall(content: string):
  | { name: string; arguments: Record<string, any> }
  | null {
  if (!content) return null;

  const trimmed = content.trim();
  // Accept both raw and escaped forms that might appear in error payloads.
  const normalized = trimmed
    .replace(/\\u003c/g, '<')
    .replace(/\\u003e/g, '>')
    .replace(/\u003c/g, '<')
    .replace(/\u003e/g, '>')
    .trim();

  // Find an XML-style tool call block even if the provider wraps it in other text.
  // We look for <function=NAME{...}> or <function=NAME({...})>
  const blockMatch = normalized.match(/<function=([a-zA-Z0-9_\-]+)\s*(\(?\{[\s\S]*?\}\)?)\s*>?\s*<\/function>/);
  
  if (!blockMatch) {
    // Fallback: search for just the tag start if the end is missing or malformed
    const startMatch = normalized.match(/<function=([a-zA-Z0-9_\-]+)\s*(\(?\{[\s\S]*?\}\)?)/);
    if (!startMatch) return null;
    
    const name = startMatch[1];
    let jsonPart = startMatch[2].trim();
    
    // Remove wrapping parentheses if present
    if (jsonPart.startsWith('(') && jsonPart.endsWith(')')) {
      jsonPart = jsonPart.substring(1, jsonPart.length - 1).trim();
    }
    
    try {
      return { name, arguments: JSON.parse(jsonPart) };
    } catch {
      return null;
    }
  }

  const name = blockMatch[1];
  let jsonPart = blockMatch[2].trim();

  // Remove wrapping parentheses if present
  if (jsonPart.startsWith('(') && jsonPart.endsWith(')')) {
    jsonPart = jsonPart.substring(1, jsonPart.length - 1).trim();
  }

  try {
    const args = JSON.parse(jsonPart);
    return { name, arguments: args };
  } catch {
    // Last resort: try to extract a JSON object within the tag.
    const looseJsonMatch = jsonPart.match(/\{[\s\S]*\}/);
    if (!looseJsonMatch) return null;
    try {
      const args = JSON.parse(looseJsonMatch[0]);
      return { name, arguments: args };
    } catch {
      return null;
    }
  }
}

/**
 * For certain queries we should NEVER attempt web search/tool calling.
 * Example: "evi itu siapa", "evi kerja apa" → answer from portfolio content.
 */
export function shouldDisableToolsForUserMessage(userMessage: string): boolean {
  const m = (userMessage || '').toLowerCase().trim();

  // Queries about Evi identity/job/portfolio basics → no tools.
  const eviIdentityPatterns: RegExp[] = [
    /^evi\s+itu\s+siapa\b/i,
    /^siapa\s+evi\b/i,
    /^evi\s+kerja\s+apa\b/i,
    /^kerja\s+apa\s+evi\b/i,
    /^profil\s+evi\b/i,
    /^tentang\s+evi\b/i,
    /^bio\s+evi\b/i,
  ];
  if (eviIdentityPatterns.some((r) => r.test(m))) return true;

  // Also block tool calling when user explicitly asks about "Evi" without any
  // trend/time-sensitive intent.
  // NOTE: Do NOT treat random tech words as a signal to enable tools, because
  // it can lead to the assistant accidentally asserting that Evi used them.
  const hasTrendIntent = /(trend|terkini|terbaru|2024|2025|latest|current)/i.test(m);
  if (m.includes('evi') && !hasTrendIntent) return true;

  return false;
}

/**
 * Define available tools for AI with STRICT MODE
 * Enhanced with ReAct pattern and OpenAI/Anthropic best practices
 * Groq will intelligently decide when to call these
 */
export function getTools() {
  return [
    {
      type: "function" as const,
      function: {
        name: "search_web",
        description: "Search web for information about technologies, trends, or best practices.",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query in English"
            },
            purpose: {
              type: "string", 
              description: "Why you need this search"
            }
          },
          required: ["query", "purpose"]
        }
      }
    }
  ];
}

/**
 * Get tools with dynamic configuration
 * Allows parallel calls and custom tool_choice
 */
export function getToolsConfig(options?: {
  parallel?: boolean;
  toolChoice?: 'auto' | 'required' | 'none';
}) {
  return {
    tools: getTools(),
    tool_choice: options?.toolChoice || 'auto',
    parallel_tool_calls: options?.parallel !== false  // ✅ Default: allow parallel
  };
}

/**
 * Execute tool calls made by AI
 */
export async function executeTool(toolName: string, args: any): Promise<any> {
  console.log(`🔧 Executing tool: ${toolName}`);
  console.log(`📝 Arguments:`, args);

  if (toolName === 'search_web') {
    const { query, purpose } = args;
    console.log(`🔍 Search Query: "${query}"`);
    console.log(`💭 Purpose: "${purpose}"`);
    
    try {
      const results = await searchWeb(query, 5);
      
      if (results.length > 0) {
        console.log(`✅ Found ${results.length} results`);
        return {
          success: true,
          results_count: results.length,
          results: results,
          formatted: formatSearchResults(results)
        };
      } else {
        console.log(`⚠️ No results found`);
        return {
          success: false,
          error: 'No results found'
        };
      }
    } catch (error) {
      console.error(`❌ Search error:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed'
      };
    }
  }

  return {
    success: false,
    error: `Unknown tool: ${toolName}`
  };
}

/**
 * Build messages array for function calling flow
 */
export function buildFunctionCallMessages(
  systemPrompt: string,
  conversationHistory: Array<{role: string, content: string}>,
  userMessage: string,
  toolResults?: Array<{toolCallId: string, result: any}>
) {
  const messages: any[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-3), // Last 3 messages for context
    { role: 'user', content: userMessage }
  ];

  // Add tool results if any
  if (toolResults && toolResults.length > 0) {
    for (const { toolCallId, result } of toolResults) {
      messages.push({
        role: 'tool',
        tool_call_id: toolCallId,
        content: JSON.stringify(result)
      });
    }
  }

  return messages;
}

/**
 * Check if response has tool calls
 */
export function hasToolCalls(response: any): boolean {
  const toolCalls = response?.choices?.[0]?.message?.tool_calls;
  return Array.isArray(toolCalls) && toolCalls.length > 0;
}

/**
 * Extract tool calls from response
 */
export function extractToolCalls(response: any) {
  const message = response?.choices?.[0]?.message;
  const toolCalls = message?.tool_calls || [];
  
  return toolCalls.map((call: any) => {
    let args;
    try {
      args = typeof call.function.arguments === 'string' 
        ? JSON.parse(call.function.arguments)
        : call.function.arguments;
    } catch (e) {
      console.error('Failed to parse tool arguments:', e);
      args = {};
    }

    return {
      id: call.id,
      name: call.function.name,
      arguments: args,
      rawMessage: message // Keep full message for subsequent calls
    };
  });
}

/**
 * Extract a tool call from an assistant message even if it comes in XML format.
 * Returns [] when no tool call is present.
 */
export function extractToolCallsFromAssistantMessage(message: any) {
  if (!message) return [];

  // Normal tool_calls
  if (Array.isArray(message.tool_calls) && message.tool_calls.length > 0) {
    return message.tool_calls.map((call: any) => {
      let args;
      try {
        args = typeof call.function.arguments === 'string'
          ? JSON.parse(call.function.arguments)
          : call.function.arguments;
      } catch {
        args = {};
      }

      return {
        id: call.id || `toolcall_${Math.random().toString(36).slice(2)}`,
        name: call.function?.name,
        arguments: args,
        rawMessage: message,
      };
    });
  }

  // XML-style fallback
  const maybeXml = typeof message.content === 'string'
    ? tryParseXmlStyleToolCall(message.content)
    : null;
  if (maybeXml) {
    return [{
      id: `xmltool_${Math.random().toString(36).slice(2)}`,
      name: maybeXml.name,
      arguments: maybeXml.arguments,
      rawMessage: message,
    }];
  }

  return [];
}

/**
 * Format tool results for display
 */
export function formatToolResults(results: SearchResult[]): string {
  if (results.length === 0) return 'No results found.';
  
  return formatSearchResults(results);
}
