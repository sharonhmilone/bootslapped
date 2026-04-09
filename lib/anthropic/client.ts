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

// Model constants — Vercel Pro, Node.js runtime
export const MODELS = {
  // All generation: briefs, drafts, context doc proposals
  GENERATION: 'claude-sonnet-4-6',
  // Lightweight tasks: diff analysis, pattern extraction
  ANALYSIS: 'claude-haiku-4-5',
} as const
