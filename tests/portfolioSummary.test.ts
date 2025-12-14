import { describe, expect, it } from 'vitest';
import { content } from '../data/content';
import { buildDeterministicPortfolioSummary } from '../utils/portfolioSummary';

const lower = (s: string) => (s || '').toLowerCase();

describe('portfolioSummary deterministic grounding', () => {
  it('does not include Kubernetes/Docker/React/Node/Python unless present in content.ts', () => {
    const { factsBlock, allowedTech } = buildDeterministicPortfolioSummary(content);

    const hay = lower(factsBlock);
    expect(hay).not.toContain('kubernetes');
    expect(hay).not.toContain('docker');
    expect(hay).not.toContain('react');
    expect(hay).not.toContain('node');
    expect(hay).not.toContain('python');

    const all = lower(allowedTech.join(' | '));
    expect(all).not.toContain('kubernetes');
    expect(all).not.toContain('docker');
    expect(all).not.toContain('react');
    expect(all).not.toContain('node');
    expect(all).not.toContain('python');
  });

  it('includes BigQuery and Microservices when present', () => {
    const { factsBlock, allowedTech } = buildDeterministicPortfolioSummary(content);
    const hay = lower(factsBlock);

    expect(hay).toContain('bigquery');
    expect(hay).toContain('microservices');

    const all = lower(allowedTech.join(' | '));
    expect(all).toContain('bigquery');
    expect(all).toContain('microservices');
  });

  it('includes all major sections from content.ts in factsBlock', () => {
    const { factsBlock } = buildDeterministicPortfolioSummary(content);
    const hay = lower(factsBlock);

    // About / story
    expect(hay).toContain('about');
    expect(hay).toContain('the origin story');

    // Soft skills / education
    expect(hay).toContain('soft skills');
    expect(hay).toContain('education');

    // Timeline
    expect(hay).toContain('timeline');
    expect(hay).toContain('discovery');

    // Footer + CV
    expect(hay).toContain('footer');
    expect(hay).toContain('cv');
    expect(hay).toContain('evi_nur_hidayah_cv.pdf');
  });
});
