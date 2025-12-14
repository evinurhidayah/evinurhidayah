import type { OptimizedContext } from './aiOptimizer';

export interface ContextValidationIssue {
  code:
    | 'missing_section'
    | 'empty_context'
    | 'too_short'
    | 'missing_experience_company'
    | 'missing_project';
  message: string;
}

export interface ContextValidationResult {
  ok: boolean;
  issues: ContextValidationIssue[];
}

const REQUIRED_SECTION_HEADERS = [
  '**WORK EXPERIENCE:**',
  '**TECH STACK:**',
  '**PROJECTS (CASE STUDIES):**',
  '**PROCESS / TIMELINE:**',
];

/**
 * Lightweight runtime/dev validation to ensure the model always receives
 * the important portfolio sections from `data/content.ts`.
 */
export function validateOptimizedContext(ctx: OptimizedContext): ContextValidationResult {
  const issues: ContextValidationIssue[] = [];

  const userContext = (ctx.userContext || '').trim();
  if (!userContext) {
    issues.push({ code: 'empty_context', message: 'userContext is empty' });
    return { ok: false, issues };
  }

  if (userContext.length < 200) {
    issues.push({ code: 'too_short', message: 'userContext looks unexpectedly short' });
  }

  for (const header of REQUIRED_SECTION_HEADERS) {
    if (!userContext.includes(header)) {
      issues.push({
        code: 'missing_section',
        message: `Missing required section header: ${header}`,
      });
    }
  }

  // Ensure at least one known company exists in experience.
  if (!/PT Horus Technology Indonesia|Libur Ngoding/.test(userContext)) {
    issues.push({
      code: 'missing_experience_company',
      message: 'Expected to find at least one known company in WORK EXPERIENCE',
    });
  }

  // Ensure at least one flagship project present.
  if (!/\bTING\b/.test(userContext)) {
    issues.push({
      code: 'missing_project',
      message: 'Expected to find project "TING" in PROJECTS section',
    });
  }

  return { ok: issues.length === 0, issues };
}
