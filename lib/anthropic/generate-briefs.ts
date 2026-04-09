import { getAnthropicClient, MODELS } from './client'
import { buildBriefGenerationPrompt } from '@/lib/utils/prompt-builder'
import type { ContextDoc, EditorialExample, GeneratedBrief } from '@/types'

interface GenerateBriefsOptions {
  contextDoc: ContextDoc
  approvedExamples: EditorialExample[]
  rejectedExamples: EditorialExample[]
  count?: number
}

export async function generateBriefs(
  options: GenerateBriefsOptions
): Promise<GeneratedBrief[]> {
  const { contextDoc, approvedExamples, rejectedExamples, count = 3 } = options

  const systemPrompt = buildBriefGenerationPrompt({
    contextDoc,
    approvedExamples,
    rejectedExamples,
  })

  const client = getAnthropicClient()

  const message = await client.messages.create({
    model: MODELS.GENERATION,
    max_tokens: 8192,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Generate ${count} content brief${count === 1 ? '' : 's'}. Each brief must follow the brief template defined in the context document exactly. Every field is required. A brief missing any field is incomplete.

Be concise within each section — every word must earn its place. Write to the depth the section genuinely requires, not to a word count target. Some sections will be short; others will need more detail. Never pad.

FORMAT SELECTION — this is critical: Do not default to "diagnostic" for every brief. The three formats (diagnostic, guide, comparison) must be used in genuine rotation based on what serves the topic best. If generating multiple briefs, each must use a different format. If generating 1 brief, choose the format that genuinely fits — and actively avoid defaulting to diagnostic unless the topic specifically calls for it. Comparisons should be used for tool/approach decisions. Guides should be used for process or framework topics. Diagnostics for failure-mode identification.

Return as a JSON array with this structure for each brief:
{
  "topic": "The specific topic or failure mode being addressed",
  "angle": "The specific editorial angle — what makes this Bootslapped-specific",
  "format": "diagnostic or guide or comparison — one of these three exact strings, chosen intentionally",
  "target_audience": "Who specifically this is for and what stage they're at",
  "brief_text": "The full brief text following the template in the context document"
}

Return only the JSON array. No preamble, no explanation.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from brief generation')
  }

  // Strip markdown code blocks if present
  const raw = content.text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()

  try {
    const briefs = JSON.parse(raw) as GeneratedBrief[]
    if (!Array.isArray(briefs)) {
      throw new Error('Response was not an array')
    }
    return briefs
  } catch (e) {
    console.error('[Brief generation] Failed to parse AI response:', raw)
    throw new Error('Brief generation returned invalid JSON')
  }
}
