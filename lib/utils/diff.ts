// Simple text diff utility — extracts meaningful changes between original and edited drafts

export interface DiffResult {
  added: string[]
  removed: string[]
  summary: string
}

/**
 * Produces a sentence-level diff between original and edited text.
 * Used to feed into Anthropic diff analysis prompt.
 */
export function computeDiff(original: string, edited: string): DiffResult {
  const originalSentences = tokenize(original)
  const editedSentences = tokenize(edited)

  const removed = originalSentences.filter((s) => !editedSentences.includes(s))
  const added = editedSentences.filter((s) => !originalSentences.includes(s))

  const summary = buildSummary(original, edited, added, removed)

  return { added, removed, summary }
}

function tokenize(text: string): string[] {
  // Split on sentence boundaries, trim, filter empties
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10) // ignore very short fragments
}

function buildSummary(
  original: string,
  edited: string,
  added: string[],
  removed: string[]
): string {
  const originalWords = wordCount(original)
  const editedWords = wordCount(edited)
  const wordDelta = editedWords - originalWords
  const direction = wordDelta > 0 ? 'added' : 'removed'
  const absChange = Math.abs(wordDelta)

  const lines = [
    `Original: ${originalWords} words. Edited: ${editedWords} words. Editor ${direction} ~${absChange} words.`,
  ]

  if (removed.length > 0) {
    lines.push(`\nRemoved ${removed.length} sentence(s):`)
    removed.slice(0, 5).forEach((s) => lines.push(`  - "${s.slice(0, 120)}${s.length > 120 ? '...' : ''}"`))
  }

  if (added.length > 0) {
    lines.push(`\nAdded ${added.length} sentence(s):`)
    added.slice(0, 5).forEach((s) => lines.push(`  + "${s.slice(0, 120)}${s.length > 120 ? '...' : ''}"`))
  }

  return lines.join('\n')
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}
