import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/public/Nav'
import { Footer } from '@/components/public/Footer'
import { ArticleRow } from '@/components/public/ArticleRow'
import { DiagnosticCtaBand } from '@/components/public/DiagnosticCtaBand'
import { createServiceClient } from '@/lib/supabase/server'
import type { ContentItem, ArticleFormat, TopicDomain } from '@/types'

const VALID_FORMATS: ArticleFormat[] = ['diagnostic', 'guide', 'comparison']

const VALID_DOMAINS: TopicDomain[] = [
  'email', 'crm', 'bookkeeping', 'website',
  'content', 'conversion', 'stack', 'ai-tools',
]

const FORMAT_LABELS: Record<ArticleFormat, string> = {
  diagnostic: 'Diagnostics',
  guide: 'Guides',
  comparison: 'Comparisons',
}

const DOMAIN_LABELS: Record<TopicDomain, string> = {
  email: 'Email',
  crm: 'CRM',
  bookkeeping: 'Bookkeeping',
  website: 'Website',
  content: 'Content',
  conversion: 'Conversion',
  stack: 'Stack',
  'ai-tools': 'AI Tools',
}

async function getArticlesByFormatAndDomain(
  format: ArticleFormat,
  domain: TopicDomain
): Promise<ContentItem[]> {
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('content_items')
      .select('id, topic, angle, format, slug, topic_domain, draft_text, published_at')
      .eq('status', 'ready_to_publish')
      .eq('format', format)
      .eq('topic_domain', domain)
      .not('published_at', 'is', null)
      .not('slug', 'is', null)
      .order('published_at', { ascending: false })

    return (data ?? []) as ContentItem[]
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ format: string; domain: string }>
}): Promise<Metadata> {
  const { format, domain } = await params
  if (
    !VALID_FORMATS.includes(format as ArticleFormat) ||
    !VALID_DOMAINS.includes(domain as TopicDomain)
  ) {
    return { title: 'Not found — Bootslapped' }
  }
  const formatLabel = FORMAT_LABELS[format as ArticleFormat]
  const domainLabel = DOMAIN_LABELS[domain as TopicDomain]
  return {
    title: `${domainLabel} ${formatLabel} — Bootslapped`,
    description: `${formatLabel} about ${domainLabel.toLowerCase()} tools, strategy, and fixes for small business operators.`,
  }
}

export default async function FormatDomainHubPage({
  params,
}: {
  params: Promise<{ format: string; domain: string }>
}) {
  const { format, domain } = await params

  if (
    !VALID_FORMATS.includes(format as ArticleFormat) ||
    !VALID_DOMAINS.includes(domain as TopicDomain)
  ) {
    notFound()
  }

  const articleFormat = format as ArticleFormat
  const topicDomain = domain as TopicDomain
  const articles = await getArticlesByFormatAndDomain(articleFormat, topicDomain)

  const formatLabel = FORMAT_LABELS[articleFormat]
  const domainLabel = DOMAIN_LABELS[topicDomain]

  return (
    <>
      <Nav />

      <main>
        {/* Header */}
        <header style={{ borderBottom: '1px solid var(--ash)', padding: '48px 0 40px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            {/* Breadcrumb */}
            <div
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--dust)',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <Link
                href={`/${articleFormat}`}
                style={{ color: 'var(--brick)', textDecoration: 'none' }}
              >
                {formatLabel}
              </Link>
              <span style={{ opacity: 0.4 }}>›</span>
              <span>{domainLabel}</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-barlow-condensed, sans-serif)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 700,
                color: 'var(--bone)',
                lineHeight: 1.05,
                margin: '0 0 12px',
              }}
            >
              {domainLabel} {formatLabel}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '13px',
                color: 'var(--dust)',
                margin: 0,
                lineHeight: 1.65,
              }}
            >
              {articles.length > 0
                ? `${articles.length} article${articles.length === 1 ? '' : 's'}`
                : 'No articles yet'}
            </p>
          </div>
        </header>

        {/* Article list */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {articles.length === 0 ? (
            <div style={{ padding: '64px 0', textAlign: 'center' }}>
              <p
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '13px',
                  color: 'var(--dust)',
                  marginBottom: '16px',
                }}
              >
                No {domainLabel.toLowerCase()} {format}s published yet.
              </p>
              <Link
                href={`/${articleFormat}`}
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '12px',
                  color: 'var(--brick)',
                  textDecoration: 'none',
                }}
              >
                ← All {formatLabel}
              </Link>
            </div>
          ) : (
            articles.map((article) => {
              const readTime = article.draft_text
                ? Math.ceil(article.draft_text.split(/\s+/).length / 200)
                : undefined
              return (
                <ArticleRow
                  key={article.id}
                  format={article.format}
                  title={article.topic}
                  description={article.angle}
                  topic={domainLabel}
                  href={`/${article.format}/${article.topic_domain}/${article.slug}`}
                  showReadTime
                  readTime={readTime}
                />
              )
            })
          )}
        </div>

        {/* Back to format */}
        {articles.length > 0 && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 24px 48px' }}>
            <Link
              href={`/${articleFormat}`}
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '12px',
                color: 'var(--dust)',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              ← All {formatLabel}
            </Link>
          </div>
        )}

        <DiagnosticCtaBand />
      </main>

      <Footer />
    </>
  )
}
