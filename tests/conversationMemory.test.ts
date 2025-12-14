import { describe, expect, it } from 'vitest';
import { summarizeConversationIfNeeded } from '../utils/conversationMemory';

describe('conversationMemory rolling summary', () => {
  it('does not summarize before threshold', () => {
    const messages = [
      { role: 'user' as const, content: 'siapa evi' },
      { role: 'assistant' as const, content: 'Evi adalah...' },
      { role: 'user' as const, content: 'proyek apa saja' },
    ];

    const res = summarizeConversationIfNeeded(messages, { summary: '', summarizedCount: 0 }, {
      maxUserTurnsBeforeSummarize: 4,
      keepLastMessages: 6,
      maxApproxPromptTokens: 99999,
    });

    expect(res.summaryMessage).toBeNull();
    expect(res.keptMessages.length).toBe(messages.length);
  });

  it('summarizes after 4 user turns and keeps only last messages', () => {
    const messages = [
      { role: 'user' as const, content: 'siapa evi' },
      { role: 'assistant' as const, content: 'Evi adalah...' },
      { role: 'user' as const, content: 'proyek apa saja' },
      { role: 'assistant' as const, content: 'Daftarnya...' },
      { role: 'user' as const, content: 'jelaskan TING' },
      { role: 'assistant' as const, content: 'TING itu...' },
      { role: 'user' as const, content: 'timeline kerja' },
      { role: 'assistant' as const, content: 'Discovery/Analysis/Design...' },
    ];

    const res = summarizeConversationIfNeeded(messages, { summary: '', summarizedCount: 0 }, {
      maxUserTurnsBeforeSummarize: 4,
      keepLastMessages: 4,
      maxApproxPromptTokens: 99999,
    });

    expect(res.summaryMessage).not.toBeNull();
    expect(res.keptMessages.length).toBe(4);
    expect(res.summaryMessage!.content).toContain('RINGKASAN CHAT SEBELUMNYA');
    expect(res.summaryMessage!.content).toContain('User: siapa evi');
  });

  it('triggers by token threshold even with fewer user turns', () => {
    const big = 'x'.repeat(5000);
    const messages = [
      { role: 'user' as const, content: big },
      { role: 'assistant' as const, content: big },
    ];

    const res = summarizeConversationIfNeeded(messages, { summary: '', summarizedCount: 0 }, {
      maxUserTurnsBeforeSummarize: 99,
      keepLastMessages: 1,
      maxApproxPromptTokens: 10,
    });

    expect(res.summaryMessage).not.toBeNull();
    expect(res.keptMessages.length).toBe(1);
  });
});
