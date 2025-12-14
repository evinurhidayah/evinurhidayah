import { describe, expect, it } from 'vitest';
import { content } from '../data/content';
import { buildRoutedPortfolioContext } from '../utils/portfolioSummary';

const lower = (s: string) => (s || '').toLowerCase();

describe('portfolio context router (token saving)', () => {
  it('base mode is compact (no full project challenge/solution text)', () => {
    const ctx = buildRoutedPortfolioContext(content, 'siapa evi');
    const hay = lower(ctx.factsBlock);

    expect(ctx.mode).toBe('base');
    expect(hay).toContain('project titles');
    // Avoid big blocks in base mode
    expect(hay).not.toContain('challenge:');
    expect(hay).not.toContain('solution:');
  });

  it('project mode includes the selected project details', () => {
    const ctx = buildRoutedPortfolioContext(content, 'jelaskan project TING');
    const hay = lower(ctx.factsBlock);

    expect(ctx.mode).toBe('project');
    expect(hay).toContain('project: ting');
    expect(hay).toContain('challenge:');
    expect(hay).toContain('solution:');
  });

  it('all-projects mode enumerates project titles', () => {
    const ctx = buildRoutedPortfolioContext(content, 'semua proyek nya apa saja?');
    const hay = lower(ctx.factsBlock);

    expect(ctx.mode).toBe('all-projects');
    expect(hay).toContain('semua proyek');
    // Spot-check a few known titles:
    expect(hay).toContain('ting');
    expect(hay).toContain('uty creative hub app');
    expect(hay).toContain('crediwise');
  });
});
