import type { ContextDoc, EditorialExample } from '@/types'

export interface PromptParts {
  contextDoc: ContextDoc
  approvedExamples: EditorialExample[]
  rejectedExamples: EditorialExample[]
}

/**
 * Assembles the brief generation system prompt.
 * Injects: context doc + approved examples + rejected examples.
 */
export function buildBriefGenerationPrompt(parts: PromptParts): string {
  const { contextDoc, approvedExamples, rejectedExamples } = parts

  const docContent = contextDoc.content

  const approvedBlock =
    approvedExamples.length > 0
      ? approvedExamples
          .map(
            (ex, i) =>
              `EXAMPLE ${i + 1} (approved${ex.decision_note ? ` — editor note: "${ex.decision_note}"` : ''}):\n${ex.content_text}`
          )
          .join('\n\n---\n\n')
      : 'No approved examples yet. Generate briefs strictly according to the context document.'

  const rejectedBlock =
    rejectedExamples.length > 0
      ? rejectedExamples
          .map(
            (ex, i) =>
              `EXAMPLE ${i + 1} (rejected${ex.decision_note ? ` — reason: "${ex.decision_note}"` : ''}):\n${ex.content_text}`
          )
          .join('\n\n---\n\n')
      : 'No rejected examples yet.'

  return `You are an editorial AI for Bootslapped — a content resource for bootstrapped founders. Your job is to generate content briefs that meet the editorial standard defined in the context document below.

CONTEXT DOCUMENT (version ${contextDoc.version}):
${docContent}

APPROVED BRIEF EXAMPLES (what works):
${approvedBlock}

REJECTED BRIEF EXAMPLES (what to avoid):
${rejectedBlock}`
}

// No context doc limit on Pro — full doc sent to Sonnet.
// Sonnet's context window is 200k tokens; the full editorial doc is ~12,500 tokens.
// After a few runs, check console.anthropic.com to confirm actual input token
// counts and cost per generation.

/**
 * Assembles the draft generation system prompt.
 */
export function buildDraftGenerationPrompt(parts: PromptParts): string {
  const { contextDoc, approvedExamples } = parts

  const docContent = contextDoc.content

  const approvedBlock =
    approvedExamples.length > 0
      ? approvedExamples
          .map(
            (ex, i) =>
              `EXAMPLE ${i + 1} (approved draft${ex.decision_note ? ` — note: "${ex.decision_note}"` : ''}):\n${ex.content_text}`
          )
          .join('\n\n---\n\n')
      : 'No approved draft examples yet. Write strictly according to the context document standard.'

  return `You are a writer for Bootslapped. Write to the editorial standard in the context document. Be specific, opinionated, and useful. No hedging, no padding.

CONTEXT DOCUMENT (version ${contextDoc.version}):
${docContent}

APPROVED DRAFT EXAMPLES (match this quality and voice):
${approvedBlock}`
}

/**
 * Assembles the diff analysis system prompt.
 */
export function buildDiffAnalysisPrompt(): string {
  return `You are analyzing editorial changes to extract principles. Your job is to identify specific, actionable patterns — not general observations. Focus on what the editor consistently does or avoids.`
}

/**
 * Assembles the context doc proposal system prompt.
 */
export function buildProposalPrompt(currentDoc: string): string {
  return `You are helping evolve the editorial context document for Bootslapped based on observed editorial patterns. The context document is the system's editorial memory.

CURRENT CONTEXT DOCUMENT:
${currentDoc}

Your job is to draft a proposed addition to the context document based on the patterns provided. The addition should:
- Be specific and actionable, not vague
- Match the existing document's direct, instructional tone
- Not duplicate guidance already present
- Be short: 2-4 sentences maximum`
}
