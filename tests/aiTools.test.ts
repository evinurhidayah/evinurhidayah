import { describe, expect, it } from 'vitest';
import {
  shouldDisableToolsForUserMessage,
  tryParseXmlStyleToolCall,
  extractToolCallsFromAssistantMessage,
} from '../utils/aiTools';

describe('aiTools guardrails', () => {
  it('disables tools for Evi identity questions', () => {
    expect(shouldDisableToolsForUserMessage('Evi itu siapa?')).toBe(true);
    expect(shouldDisableToolsForUserMessage('Evi kerja apa?')).toBe(true);
    expect(shouldDisableToolsForUserMessage('Profil Evi')).toBe(true);
  });

  it('allows tools for tech/trend questions even if Evi is mentioned', () => {
    expect(shouldDisableToolsForUserMessage('Evi pakai React versi terbaru 2025?')).toBe(false);
    expect(shouldDisableToolsForUserMessage('Evi dan Kubernetes trend 2024 gimana?')).toBe(false);
  });

  it('still disables tools when Evi is mentioned without trend intent', () => {
    expect(shouldDisableToolsForUserMessage('Evi pakai Kubernetes?')).toBe(true);
    expect(shouldDisableToolsForUserMessage('Evi pakai Docker?')).toBe(true);
  });

  it('parses XML-style tool calls', () => {
    const xml = '<function=search_web{"query":"GraphQL vs REST","purpose":"compare"}</function>';
    const parsed = tryParseXmlStyleToolCall(xml);
    expect(parsed).not.toBeNull();
    expect(parsed?.name).toBe('search_web');
    expect(parsed?.arguments.query).toBe('GraphQL vs REST');
  });

  it('parses failed_generation payload from tool_use_failed', () => {
    const failedGeneration = '<function=search_web {"purpose": "Compare TING with other applications", "query": "TING vs other SaaS applications"} </function>';
    const parsed = tryParseXmlStyleToolCall(failedGeneration);
    expect(parsed).not.toBeNull();
    expect(parsed?.name).toBe('search_web');
    expect(parsed?.arguments.query).toContain('TING');
  });

  it('parses escaped XML-style tool calls (\\u003c/\\u003e)', () => {
    const escaped =
      "\\u003cfunction=search_web{\"purpose\": \"Mengetahui project terbesar Evi Nur Hidayah\", \"query\": \"Evi Nur Hidayah project terbesar\"}\\u003e\\u003c/function\\u003e";
    const parsed = tryParseXmlStyleToolCall(escaped);
    expect(parsed).not.toBeNull();
    expect(parsed?.name).toBe('search_web');
    expect(String(parsed?.arguments.query)).toContain('project terbesar');
  });

  it('parses escaped XML without > before closing tag', () => {
    const escaped =
      "\\u003cfunction=search_web{\"purpose\":\"cek\",\"query\":\"test query\"}\\u003c/function\\u003e";
    const parsed = tryParseXmlStyleToolCall(escaped);
    expect(parsed).not.toBeNull();
    expect(parsed?.name).toBe('search_web');
    expect(parsed?.arguments.purpose).toBe('cek');
  });

  it('parses XML tool call even with surrounding noise', () => {
    const noisy =
      "some prefix... <function=search_web{\"purpose\":\"cek\",\"query\":\"noisy\"}</function> ...suffix";
    const parsed = tryParseXmlStyleToolCall(noisy);
    expect(parsed).not.toBeNull();
    expect(parsed?.name).toBe('search_web');
    expect(parsed?.arguments.query).toBe('noisy');
  });

  it('extracts tool call from assistant message when in XML content', () => {
    const message = {
      role: 'assistant',
      content: '<function=search_web{"query":"Vercel edge functions","purpose":"deployment"}</function>',
    };

    const calls = extractToolCallsFromAssistantMessage(message);
    expect(calls).toHaveLength(1);
    expect(calls[0].name).toBe('search_web');
    expect(calls[0].arguments.purpose).toBe('deployment');
  });

  it('extracts normal tool_calls unchanged', () => {
    const message = {
      role: 'assistant',
      tool_calls: [
        {
          id: 'call_1',
          function: {
            name: 'search_web',
            arguments: '{"query":"Brave Search API","purpose":"docs"}',
          },
        },
      ],
    };

    const calls = extractToolCallsFromAssistantMessage(message);
    expect(calls).toHaveLength(1);
    expect(calls[0].id).toBe('call_1');
    expect(calls[0].name).toBe('search_web');
    expect(calls[0].arguments.query).toBe('Brave Search API');
  });
});
