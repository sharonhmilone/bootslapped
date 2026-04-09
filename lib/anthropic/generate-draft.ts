import { getAnthropicClient, MODELS } from './client'
import { buildDraftGenerationPrompt } from '@/lib/utils/prompt-builder'
import type { ContentItem, ContextDoc, EditorialExample } from '@/types'

interface GenerateDraftOptions {
  item: ContentItem
  contextDoc: ContextDoc
  approvedExamples: EditorialExample[]
  revisionNote?: string
}

export async function generateDraft(options: GenerateDraftOptions): Promise<string> {
  const { item, contextDoc, approvedExamples, revisionNote } = options

  if (!item.brief_text) {
    throw new Error('Cannot generate draft: no brief text on item')
  }

  const systemPrompt = buildDraftGenerationPrompt({
    contextDoc,
    approvedExamples,
    rejectedExamples: [],
  })

  const userMessage = revisionNote
    ? buildRevisionUserMessage(item, revisionNote)
    : buildInitialUserMessage(item)

  const client = getAnthropicClient()

  const message = await client.messages.create({
    // Sonnet on Pro — full quality, no artificial limits.
    // max_tokens: 8192 is a safety ceiling, not a target. Check console.anthropic.com
    // after the first few runs to see actual output length and cost per draft,
    // then adjust if needed based on real data.
    model: MODELS.GENERATION,
    max_tokens: 8192,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userMessage,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from draft generation')
  }

  return content.text
}

function buildInitialUserMessage(item: ContentItem): string {
  return `Write a full draft from this brief:

${item.brief_text}

Target word count: 1200
Format: ${item.format ?? 'guide'}

The draft must include all required article components as defined in the context document: citable claim block and Ask AI block. If the brief nominates a primary recommended tool, include the recommended tool block content. If the brief specifies no primary tool, include the platform tier table content instead.

Do not include the diagnostic CTA band, related articles section, or any other structural page elements — these are rendered by the CMS automatically.

Format the output as markdown. Use these component markers:

For the citable claim block:
[CITABLE_CLAIM]
Your claim here.
[/CITABLE_CLAIM]

For the Ask AI block:
[ASK_AI]
Your AI assistant prompt here with [bracketed placeholders] for reader-specific inputs.
[/ASK_AI]

For the recommended tool block (only if brief nominates a primary tool):
[RECOMMENDED_TOOL]
Tool name: X
Description: X
Tags: tag1, tag2
Pricing: X
CTA URL: X
[/RECOMMENDED_TOOL]

For the platform tier table (diagnostics and comparisons only):
[TIER_TABLE]
Built for this: Tool A, Tool B
Can do it with effort: Tool C
Will fight you: Tool D, Tool E
[/TIER_TABLE]`
}

function buildRevisionUserMessage(item: ContentItem, revisionNote: string): string {
  return `PREVIOUS DRAFT:
${item.draft_text}

EDITOR'S NOTE:
${revisionNote}

Rewrite the draft addressing the editor's note. Do not pad or add content that wasn't in the brief. Keep all required components (citable claim block, Ask AI block) and any conditional components from the original brief.

BRIEF (for reference):
${item.brief_text}

Use the same component markers as the original draft.`
}
