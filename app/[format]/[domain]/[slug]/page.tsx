import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Nav } from '@/components/public/Nav'
import { Footer } from '@/components/public/Footer'
import { CategoryTag } from '@/components/public/CategoryTag'
import { CitableClaimBlock } from '@/components/public/CitableClaimBlock'
import { AskAiBlock } from '@/components/public/AskAiBlock'
import { ToolRecommendationBlock } from '@/components/public/ToolRecommendationBlock'
import { PlatformTierTable } from '@/components/public/PlatformTierTable'
import { RelatedArticles } from '@/components/public/RelatedArticles'
import { DiagnosticCtaBand } from '@/components/public/DiagnosticCtaBand'
import { createServiceClient } from '@/lib/supabase/server'
import type { ContentItem, ArticleFormat, Tool, PlatformTier } from '@/types'

// ── Data fetching ───────────────────────────────────────────

async function getArticle(slug: string): Promise<(ContentItem & { tool?: Tool }) | null> {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('content_items')
      .select('*, tool:primary_tool_id(*)')
      .eq('slug', slug)
      .eq('status', 'ready_to_publish')
      .not('published_at', 'is', null)
      .single()

    if (error || !data) return null
    return data as ContentItem & { tool?: Tool }
  } catch {
    return null
  }
}

async function getRelatedArticles(currentId: string, format: ArticleFormat, domain: string | null): Promise<ContentItem[]> {
  try {
    const supabase = createServiceClient()
    let query = supabase
      .from('content_items')
      .select('id, topic, angle, format, slug, topic_domain, published_at')
      .eq('status', 'ready_to_publish')
      .eq('format', format)
      .not('slug', 'is', null)
      .neq('id', currentId)
      .order('published_at', { ascending: false })

    // Prefer same domain for related — closer topical match
    if (domain) {
      query = query.eq('topic_domain', domain)
    }

    const { data } = await query.limit(3)

    // If fewer than 3 in same domain, fill from across the format
    if ((data ?? []).length < 3 && domain) {
      const existingIds = [currentId, ...(data ?? []).map((r) => r.id)]
      const { data: fallback } = await supabase
        .from('content_items')
        .select('id, topic, angle, format, slug, topic_domain, published_at')
        .eq('status', 'ready_to_publish')
        .eq('format', format)
        .not('slug', 'is', null)
        .not('id', 'in', `(${existingIds.join(',')})`)
        .order('published_at', { ascending: false })
        .limit(3 - (data ?? []).length)
      return [...(data ?? []), ...(fallback ?? [])] as ContentItem[]
    }

    return (data ?? []) as ContentItem[]
  } catch {
    return []
  }
}

// ── Content rendering ───────────────────────────────────────

function renderBody(
  content: string,
  tool?: Tool
): React.ReactNode[] {
  const elements: React.ReactNode[] = []

  const parts = content.split(/(\[CITABLE_CLAIM\][\s\S]*?\[\/CITABLE_CLAIM\]|\[ASK_AI\][\s\S]*?\[\/ASK_AI\]|\[RECOMMENDED_TOOL\][\s\S]*?\[\/RECOMMENDED_TOOL\]|\[TIER_TABLE\][\s\S]*?\[\/TIER_TABLE\])/g)

  parts.forEach((part, i) => {
    if (part.startsWith('[CITABLE_CLAIM]')) {
      const claim = part.replace('[CITABLE_CLAIM]', '').replace('[/CITABLE_CLAIM]', '').trim()
      elements.push(<CitableClaimBlock key={i} claim={claim} />)
    } else if (part.startsWith('[ASK_AI]')) {
      const prompt = part.replace('[ASK_AI]', '').replace('[/ASK_AI]', '').trim()
      elements.push(<AskAiBlock key={i} prompt={prompt} />)
    } else if (part.startsWith('[TIER_TABLE]')) {
      const tableText = part.replace('[TIER_TABLE]', '').replace('[/TIER_TABLE]', '').trim()
      const tiers = tableText.split('\n').filter(Boolean).flatMap((line) => {
        const colonIdx = line.indexOf(':')
        if (colonIdx === -1) return []
        const label = line.slice(0, colonIdx).trim() as PlatformTier['label']
        const tools = line.slice(colonIdx + 1).split(',').map((t) => t.trim()).filter(Boolean)
        return [{ label, tools }]
      })
      if (tiers.length > 0) {
        elements.push(<PlatformTierTable key={i} tiers={tiers} />)
      }
    } else if (part.startsWith('[RECOMMENDED_TOOL]') && tool) {
      elements.push(
        <ToolRecommendationBlock
          key={i}
          tool={tool}
          contextNote={part.replace('[RECOMMENDED_TOOL]', '').replace('[/RECOMMENDED_TOOL]', '').trim()}
        />
      )
    } else if (part.trim()) {
      const paragraphs = part.split(/\n\n+/).filter(Boolean)
      paragraphs.forEach((para, j) => {
        const trimmed = para.trim()
        if (!trimmed) return

        if (trimmed.startsWith('## ')) {
          elements.push(
            <h2
              key={`${i}-${j}-h2`}
              style={{
                fontFamily: 'var(--font-barlow-condensed, sans-serif)',
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--bone)',
                margin: '40px 0 14px',
                lineHeight: 1.1,
              }}
            >
              {trimmed.replace('## ', '')}
            </h2>
          )
        } else if (trimmed.startsWith('### ') || (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2, -2).includes('**'))) {
          const text = trimmed.startsWith('### ')
            ? trimmed.replace('### ', '')
            : trimmed.replace(/\*\*/g, '')
          elements.push(
            <h3
              key={`${i}-${j}-h3`}
              style={{
                fontFamily: 'var(--font-barlow-condensed, sans-serif)',
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--bone)',
                margin: '32px 0 10px',
                lineHeight: 1.15,
              }}
            >
              {text}
            </h3>
          )
        } else {
          elements.push(
            <p
              key={`${i}-${j}-p`}
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '15px',
                lineHeight: 1.75,
                color: 'rgba(240, 237, 230, 0.92)',
                margin: '0 0 20px',
              }}
            >
              {trimmed}
            </p>
          )
        }
      })
    }
  })

  return elements
}

// ── Metadata ────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ format: string; domain: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) return { title: 'Not found — Bootslapped' }

  return {
    title: `${article.topic} — Bootslapped`,
    description: article.meta_description ?? article.angle,
    openGraph: {
      title: article.topic,
      description: article.meta_description ?? article.angle ?? undefined,
    },
  }
}

// ── Page ─────────────────────────────────────────────────────

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ format: string; domain: string; slug: string }>
}) {
  const { slug, domain } = await params
  const article = await getArticle(slug)

  if (!article) notFound()

  const related = await getRelatedArticles(article.id, article.format, domain)

  const readingTime = article.draft_text
    ? Math.ceil(article.draft_text.split(/\s+/).length / 200)
    : null

  const contentText = article.edited_draft_text ?? article.draft_text ?? ''
  const hasAffiliate = article.tool?.affiliate ?? false

  return (
    <>
      <Nav />

      <main>
        {/* Article header */}
        <header style={{ borderBottom: '1px solid var(--ash)', padding: '48px 0 40px' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <CategoryTag format={article.format} />
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-barlow-condensed, sans-serif)',
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 700,
                color: 'var(--bone)',
                lineHeight: 1.05,
                margin: '0 0 20px',
              }}
            >
              {article.topic}
            </h1>

            {article.angle && (
              <p
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '15px',
                  color: 'var(--dust)',
                  margin: '0 0 20px',
                  lineHeight: 1.6,
                }}
              >
                {article.angle}
              </p>
            )}

            <div
              style={{
                display: 'flex',
                gap: '16px',
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '11px',
                color: 'var(--dust)',
                opacity: 0.6,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                flexWrap: 'wrap',
              }}
            >
              <span>{article.format.charAt(0).toUpperCase() + article.format.slice(1)}</span>
              {readingTime && <span>·</span>}
              {readingTime && <span>{readingTime} min read</span>}
            </div>
          </div>
        </header>

        {/* Affiliate disclosure */}
        {hasAffiliate && (
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: '16px 24px 0' }}>
            <p
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '11px',
                color: 'var(--dust)',
                opacity: 0.5,
                borderLeft: '2px solid var(--ash)',
                paddingLeft: '12px',
                margin: 0,
              }}
            >
              Some links earn commission — doesn&apos;t change the recommendation
            </p>
          </div>
        )}

        {/* Article body */}
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 64px' }}>
          {renderBody(contentText, article.tool)}
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div style={{ borderTop: '1px solid var(--ash)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
              <RelatedArticles
                articles={related.map((r) => ({
                  slug: r.slug!,
                  category: r.format,
                  domain: r.topic_domain ?? domain,
                  title: r.topic,
                  description: r.angle,
                  topic: r.format.charAt(0).toUpperCase() + r.format.slice(1),
                }))}
              />
            </div>
          </div>
        )}

        <DiagnosticCtaBand />
      </main>

      <Footer />
    </>
  )
}
