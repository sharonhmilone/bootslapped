import Anthropic from '@anthropic-ai/sdk'

// Singleton client — reused across requests
let _client: Anthropic | null = null

export function getAnthropicClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    })
  }
  return _client
}

// Model constants
// On Vercel Hobby (10s limit): use DRAFT_HOBBY for draft generation.
// On Vercel Pro (maxDuration = 60): switch generate-draft.ts to GENERATION.
export const MODELS = {
  // Primary generation — briefs, context doc proposals
  GENERATION: 'claude-sonnet-4-6',
  // Fast draft generation — fits Vercel Hobby 10s limit
  DRAFT_HOBBY: 'claude-haiku-4-5',
  // Lightweight tasks — diff analysis, classification
  ANALYSIS: 'claude-haiku-4-5',
} as const
