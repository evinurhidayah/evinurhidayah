import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

describe('Groq tool_use_failed recovery (XML) regression', () => {
  it('does not re-inject recovered XML tool_calls; uses HASIL PENCARIAN WEB text + tool_choice none', () => {
    const lunaChat = fs.readFileSync('components/LunaChat.tsx', 'utf8');

    // We provide search results as plain text when XML recovery is used.
    expect(lunaChat).toContain('HASIL PENCARIAN WEB (search_web)');

    // And we explicitly forbid additional tool calls in that branch.
    expect(lunaChat).toContain("tool_choice: (recoveredToolCalls.length > 0");
    expect(lunaChat).toContain("? 'none' : 'auto'");
  });
});
