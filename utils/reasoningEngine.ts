/**
 * Multi-Turn Reasoning Engine
 * 
 * Implements iterative AI reasoning with self-reflection and continuous thinking.
 * Based on ReAct pattern (Reason + Act) with self-evaluation loops.
 * 
 * Flow:
 * 1. AI receives query → Thinks about approach
 * 2. AI takes action (search/analyze)
 * 3. AI reflects: "Is this enough? Need more info?"
 * 4. If not enough → Loop back to step 1 with new context
 * 5. If sufficient → Generate final answer
 * 
 * @module ReasoningEngine
 */

import { searchWeb, formatSearchResults, SearchResult } from './webSearch';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ReasoningStep {
  stepNumber: number;
  thought: string;          // What AI is thinking
  action?: {                // What AI decides to do
    type: 'search' | 'analyze' | 'synthesize';
    query?: string;
    purpose?: string;
  };
  observation?: string;     // What AI learned from action
  reflection?: string;      // AI's self-evaluation
  isComplete: boolean;      // Whether AI thinks reasoning is done
}

export interface ReasoningResult {
  steps: ReasoningStep[];
  finalAnswer: string;
  searchResults: SearchResult[];
  totalIterations: number;
  confidence: 'low' | 'medium' | 'high';
}

export interface ReasoningConfig {
  maxIterations: number;    // Max thinking loops (prevent infinite)
  model: string;
  apiUrl: string;
  apiKey: string;
  systemPrompt: string;
  enableSelfReflection: boolean;
}

// ============================================
// REASONING ENGINE
// ============================================

/**
 * Execute multi-turn reasoning with iterative thinking
 * AI can search → reflect → search again → reflect → answer
 */
export class ReasoningEngine {
  private config: ReasoningConfig;
  private steps: ReasoningStep[] = [];
  private allSearchResults: SearchResult[] = [];
  private currentIteration = 0;

  constructor(config: ReasoningConfig) {
    this.config = config;
  }

  /**
   * Main reasoning loop - AI thinks iteratively until satisfied
   */
  async reason(userQuery: string, conversationHistory: any[]): Promise<ReasoningResult> {
    console.log('🧠 Starting multi-turn reasoning for:', userQuery);
    
    let isComplete = false;
    let finalAnswer = '';

    // Iterative reasoning loop
    while (!isComplete && this.currentIteration < this.config.maxIterations) {
      this.currentIteration++;
      console.log(`🔄 Iteration ${this.currentIteration}/${this.config.maxIterations}`);

      // Execute one thinking step
      const stepResult = await this.executeReasoningStep(
        userQuery,
        conversationHistory,
        this.steps,
        this.allSearchResults
      );

      this.steps.push(stepResult);

      // Check if AI is satisfied with its reasoning
      if (stepResult.isComplete) {
        isComplete = true;
        finalAnswer = stepResult.observation || '';
        console.log('✅ Reasoning complete after', this.currentIteration, 'iterations');
      } else if (this.currentIteration >= this.config.maxIterations) {
        console.log('⚠️ Max iterations reached, synthesizing answer');
        // Force synthesis if max iterations reached
        finalAnswer = await this.forceSynthesis(userQuery, conversationHistory);
        isComplete = true;
      }
    }

    // Calculate confidence based on iterations and search quality
    const confidence = this.calculateConfidence();

    return {
      steps: this.steps,
      finalAnswer,
      searchResults: this.allSearchResults,
      totalIterations: this.currentIteration,
      confidence
    };
  }

  /**
   * Execute one reasoning step (think → act → observe → reflect)
   */
  private async executeReasoningStep(
    userQuery: string,
    conversationHistory: any[],
    previousSteps: ReasoningStep[],
    searchResults: SearchResult[]
  ): Promise<ReasoningStep> {
    
    // Build context with previous reasoning steps
    const reasoningContext = this.buildReasoningContext(previousSteps, searchResults);

    // Call AI with reasoning instructions
    const messages = [
      {
        role: 'system',
        content: this.buildReasoningSystemPrompt()
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userQuery
      }
    ];

    if (reasoningContext) {
      messages.push({
        role: 'system',
        content: reasoningContext
      });
    }

    // Call AI with tool support
    const response = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        tools: this.getReasoningTools(),
        tool_choice: 'auto',
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`Reasoning API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message;

    // Parse AI's reasoning step
    const step: ReasoningStep = {
      stepNumber: this.currentIteration,
      thought: aiMessage.content || '',
      isComplete: false
    };

    // Check if AI wants to use tools (search)
    if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
      const toolCall = aiMessage.tool_calls[0];
      
      if (toolCall.function.name === 'search_web') {
        const args = JSON.parse(toolCall.function.arguments);
        step.action = {
          type: 'search',
          query: args.query,
          purpose: args.purpose
        };

        // Execute search
        console.log('🔍 Executing search:', args.query);
        const results = await searchWeb(args.query);
        this.allSearchResults.push(...results);

        step.observation = formatSearchResults(results);
        console.log('📊 Found', results.length, 'results');
      } else if (toolCall.function.name === 'reflect_on_findings') {
        // AI is doing self-reflection
        const args = JSON.parse(toolCall.function.arguments);
        step.reflection = args.reflection;
        step.isComplete = args.is_sufficient;
        
        if (step.isComplete) {
          step.observation = args.final_answer;
        }
      }
    } else {
      // No tool calls = AI is providing final answer
      step.isComplete = true;
      step.observation = aiMessage.content;
    }

    return step;
  }

  /**
   * Build system prompt for reasoning mode
   */
  private buildReasoningSystemPrompt(): string {
    return `${this.config.systemPrompt}

**ITERATIVE MODE**: You can search multiple times if needed.

If you need more info after first search, call search_web again with refined query.
When you have enough info, call reflect_on_findings with is_sufficient=true.

Max iterations: ${this.config.maxIterations}`;
  }

  /**
   * Build context from previous reasoning steps
   */
  private buildReasoningContext(steps: ReasoningStep[], searchResults: SearchResult[]): string {
    if (steps.length === 0) return '';

    let context = '\n**🔄 PREVIOUS REASONING STEPS:**\n\n';

    steps.forEach(step => {
      context += `**Step ${step.stepNumber}:**\n`;
      if (step.thought) context += `💭 Thought: ${step.thought}\n`;
      if (step.action) context += `⚡ Action: ${step.action.type} - ${step.action.query || step.action.purpose}\n`;
      if (step.observation) context += `👁️ Observed: ${step.observation.substring(0, 200)}...\n`;
      if (step.reflection) context += `🤔 Reflection: ${step.reflection}\n`;
      context += '\n';
    });

    if (searchResults.length > 0) {
      context += `\n**📚 ALL SEARCH RESULTS SO FAR (${searchResults.length} sources):**\n`;
      context += formatSearchResults(searchResults);
    }

    return context;
  }

  /**
   * Get tools for reasoning mode (including self-reflection)
   */
  private getReasoningTools() {
    return [
      {
        type: 'function',
        function: {
          name: 'search_web',
          description: 'Search web for information. Use when you need external data.',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query in English'
              },
              purpose: {
                type: 'string',
                description: 'Why you need this search (1 sentence)'
              }
            },
            required: ['query', 'purpose']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'reflect_on_findings',
          description: 'Evaluate if you have enough information to answer completely. Use this to check if you need more iterations or can provide final answer.',
          parameters: {
            type: 'object',
            properties: {
              reflection: {
                type: 'string',
                description: 'Your self-evaluation: what do you know? what is missing?'
              },
              is_sufficient: {
                type: 'boolean',
                description: 'true if you have enough info for complete answer, false if need more'
              },
              final_answer: {
                type: 'string',
                description: 'If is_sufficient=true, provide your complete final answer here'
              }
            },
            required: ['reflection', 'is_sufficient']
          }
        }
      }
    ];
  }

  /**
   * Force synthesis if max iterations reached
   */
  private async forceSynthesis(userQuery: string, conversationHistory: any[]): Promise<string> {
    console.log('🔧 Forcing synthesis from accumulated knowledge');

    const synthesisPrompt = `You've gathered information through ${this.currentIteration} reasoning steps.
Now SYNTHESIZE everything you learned and provide a complete answer to: "${userQuery}"

Use all search results and observations from your previous steps.`;

    const response = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: 'system', content: this.config.systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userQuery },
          { role: 'system', content: this.buildReasoningContext(this.steps, this.allSearchResults) },
          { role: 'user', content: synthesisPrompt }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Calculate confidence based on reasoning quality
   */
  private calculateConfidence(): 'low' | 'medium' | 'high' {
    const hasSearches = this.steps.some(s => s.action?.type === 'search');
    const hasReflection = this.steps.some(s => s.reflection);
    const completedNormally = this.currentIteration < this.config.maxIterations;

    if (hasSearches && hasReflection && completedNormally) return 'high';
    if (hasSearches && completedNormally) return 'medium';
    return 'low';
  }
}

// ============================================
// HELPER: CREATE REASONING ENGINE
// ============================================

export function createReasoningEngine(
  apiKey: string,
  systemPrompt: string,
  options?: Partial<ReasoningConfig>
): ReasoningEngine {
  const config: ReasoningConfig = {
    maxIterations: options?.maxIterations || 3,
    model: options?.model || 'llama-3.3-70b-versatile',
    apiUrl: options?.apiUrl || 'https://api.groq.com/openai/v1/chat/completions',
    apiKey,
    systemPrompt,
    enableSelfReflection: options?.enableSelfReflection ?? true
  };

  return new ReasoningEngine(config);
}
