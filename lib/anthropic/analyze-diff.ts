import { getAnthropicClient, MODELS } from './client'
import { buildDiffAnalysisPrompt } from '@/lib/utils/prompt-builder'
import { computeDiff } from '@/lib/utils/diff'

interface AnalyzeDiffOptions {
  originalDraft: string
  editedDraft: string
}

interface DiffAnalysisResult {
  inferred_patterns: string[]
  proposed_context_doc_addition: string | null
}

export async function analyzeDiff(options: AnalyzeDiffOptions): Promise<DiffAnalysisResult> {
  const { originalDraft, editedDraft } = options

  const diff = computeDiff(originalDraft, editedDraft)
  const systemPrompt = buildDiffAnalysisPrompt()

  const client = getAnthropicClient()

  const message = await client.messages.create({
    model: MODELS.ANALYSIS,
    max_tokens: 2048,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `An editor revised this draft. Analyze what changed and infer the editorial principles at work. Be specific — not "the editor prefers clarity" but "the editor removes hedging language in opening paragraphs" or "the editor adds a named example wherever a claim is made."

ORIGINAL:
${originalDraft}

EDITED VERSION:
${editedDraft}

DIFF SUMMARY:
${diff.summary}

Return a JSON object:
{
  "inferred_patterns": ["pattern 1", "pattern 2"],
  "proposed_context_doc_addition": "suggested text to add to the context doc, or null"
}

Return only the JSON object. No preamble.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from diff analysis')
  }

  const raw = content.text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()

  try {
    return JSON.parse(raw) as DiffAnalysisResult
  } catch {
    console.error('[Diff analysis] Failed to parse response:', raw)
    return {
      inferred_patterns: [],
      proposed_context_doc_addition: null,
    }
  }
}
