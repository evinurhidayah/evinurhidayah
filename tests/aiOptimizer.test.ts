import { describe, expect, it } from 'vitest';
import { buildOptimizedContext } from '../utils/aiOptimizer';
import { content } from '../data/content';

const flattenText = (s: string) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

describe('aiOptimizer grounding', () => {
  it('does not hardcode Kubernetes/Docker/React/Node/Python in system prompt', () => {
    const ctx = buildOptimizedContext(content);
    const sys = flattenText(ctx.systemPrompt);

    // Previously hardcoded line we must never bring back:
    expect(sys).not.toContain('tech: microservices, bigquery, kubernetes');
    expect(sys).not.toContain('tech: microservices, bigquery, kubernetes, docker, react, node.js, python');
  });

  it('userContext tech stack comes from content.ts', () => {
    const ctx = buildOptimizedContext(content);
    const u = flattenText(ctx.userContext);

    // From content.ts techStack.data.skills
    expect(u).toContain('bigquery');
    expect(u).toContain('big table');
    expect(u).toContain('postgresql');

    // Should not appear unless present in content.ts
    expect(u).not.toContain('kubernetes');
  });
});
