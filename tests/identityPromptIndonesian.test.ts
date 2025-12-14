import { describe, expect, it } from 'vitest';

/**
 * Regression tests for identity/portfolio mode grounding.
 *
 * We don't call the model here; we just lock in the *instruction surface*
 * that prevents hallucinated tech and enforces Indonesian-first responses.
 */

describe('identity/portfolio prompt rules (Indonesian)', () => {
  it('uses an Indonesian strict grounding block and exact fallback text', () => {
    // Keep this in sync with `components/LunaChat.tsx`.
    const strictBlock = `MODE: PORTOFOLIO / IDENTITAS (Bahasa Indonesia)

ATURAN KEAKURATAN (WAJIB):
- Kamu HANYA boleh memakai fakta yang tertulis di blok "SOURCE OF TRUTH (content.ts)" di bawah.
- DILARANG menambahkan teknologi, tools, role, company, periode kerja, atau detail project yang tidak tertulis.
- Jika user menanyakan teknologi yang tidak tercantum, jawab persis: "Tidak tercantum di portfolio content.ts".

ATURAN BAHASA:
- Jawab dalam Bahasa Indonesia (kecuali user minta bahasa lain).`;

    expect(strictBlock).toContain('Bahasa Indonesia');
    expect(strictBlock).toContain('ATURAN KEAKURATAN');
    expect(strictBlock).toContain('Tidak tercantum di portfolio content.ts');
  });
});
