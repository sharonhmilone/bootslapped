/**
 * Generates a URL-safe slug from a topic + angle string.
 *
 * Used at brief-approval time to set content_items.slug.
 * Pattern: lowercase, hyphens, max 80 chars, no trailing hyphens.
 *
 * Examples:
 *   "Why Your Email Sequence Gets Opens But No Clicks" → "why-your-email-sequence-gets-opens-but-no-clicks"
 *   "SEO Traffic That Never Buys: A Diagnostic" → "seo-traffic-that-never-buys-a-diagnostic"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // remove non-alphanumeric (keep spaces and hyphens)
    .trim()
    .replace(/\s+/g, '-')           // spaces → hyphens
    .replace(/-+/g, '-')            // collapse multiple hyphens
    .slice(0, 80)                   // max length
    .replace(/-$/, '')              // no trailing hyphen
}

/**
 * Generates a slug from a content item's topic and angle combined.
 * Falls back to topic-only if angle is empty.
 */
export function generateArticleSlug(topic: string, angle?: string | null): string {
  const base = angle ? `${topic} ${angle}` : topic
  return generateSlug(base)
}

/**
 * Makes a slug unique by appending a short timestamp suffix if needed.
 * Use when inserting into the DB and a conflict is possible.
 */
export function makeSlugUnique(slug: string): string {
  const suffix = Date.now().toString(36).slice(-4) // e.g. "k7f2"
  return `${slug.slice(0, 75)}-${suffix}`
}
