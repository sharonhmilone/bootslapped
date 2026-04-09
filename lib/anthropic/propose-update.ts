import { getAnthropicClient, MODELS } from './client'
import { buildProposalPrompt } from '@/lib/utils/prompt-builder'

interface ProposeUpdateOptions {
  currentDocContent: string
  patterns: string[]
  sourceItemIds: string[]
}

interface ProposalResult {
  proposed_addition: string
  rationale: string
}

export async function proposeContextDocUpdate(
  options: ProposeUpdateOptions
): Promise<ProposalResult> {
  const { currentDocContent, patterns, sourceItemIds } = options

  const systemPrompt = buildProposalPrompt(currentDocContent)
  const client = getAnthropicClient()

  const message = await client.messages.create({
    model: MODELS.GENERATION,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Based on these ${patterns.length} editorial patterns observed across ${sourceItemIds.length} content item(s), propose an addition to the context document.

OBSERVED PATTERNS:
${patterns.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Return a JSON object:
{
  "proposed_addition": "The text to add to the context document",
  "rationale": "Why this pattern warrants codification (1-2 sentences)"
}

Return only the JSON object.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from proposal generation')
  }

  const raw = content.text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()

  try {
    return JSON.parse(raw) as ProposalResult
  } catch {
    console.error('[Propose update] Failed to parse response:', raw)
    return {
      proposed_addition: patterns.join('\n'),
      rationale: 'Pattern observed across multiple editorial decisions.',
    }
  }
}
