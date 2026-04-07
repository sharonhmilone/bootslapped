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
    max_tokens: 32000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Generate ${count} distinct content briefs. Each brief must follow the brief template defined in the context document exactly. Every field is required. A brief missing any field is incomplete.

Return as a JSON array with this structure for each brief:
{
  "topic": "The specific topic or failure mode being addressed",
  "angle": "The specific editorial angle — what makes this Bootslapped-specific",
  "format": "diagnostic | guide | comparison",
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
