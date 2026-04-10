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

const FORMAT_META: Record<ArticleFormat, { title: string; description: string }> = {
  diagnostic: {
    title: 'Diagnostics',
    description: 'Find out exactly what\'s broken and why. Each diagnostic identifies the specific failure mode blocking your growth — no fluff, no theory, just a clear read on the problem.',
  },
  guide: {
    title: 'Guides',
    description: 'Step-by-step fixes for specific problems. Concrete and actionable — written for operators who need results, not a library of content they\'ll never implement.',
  },
  comparison: {
    title: 'Comparisons',
    description: 'Tool decisions made easier. Side-by-side breakdowns of what actually fits your stage, not what has the best marketing budget or affiliate rate.',
  },
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

const DOMAIN_ORDER: TopicDomain[] = [
  'email', 'crm', 'bookkeeping', 'website',
  'content', 'conversion', 'stack', 'ai-tools',
]

async function getArticlesByFormat(format: ArticleFormat): Promise<ContentItem[]> {
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('content_items')
      .select('id, topic, angle, format, slug, topic_domain, draft_text, published_at')
      .eq('status', 'ready_to_publish')
      .eq('format', format)
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
  params: Promise<{ format: string }>
}): Promise<Metadata> {
  const { format } = await params
  if (!VALID_FORMATS.includes(format as ArticleFormat)) {
    return { title: 'Not found — Bootslapped' }
  }
  const meta = FORMAT_META[format as ArticleFormat]
  return {
    title: `${meta.title} — Bootslapped`,
    description: meta.description,
  }
}

export default async function FormatHubPage({
  params,
}: {
  params: Promise<{ format: string }>
}) {
  const { format } = await params

  if (!VALID_FORMATS.includes(format as ArticleFormat)) notFound()

  const articleFormat = format as ArticleFormat
  const meta = FORMAT_META[articleFormat]
  const articles = await getArticlesByFormat(articleFormat)

  // Group articles by domain for the domain filter counts
  const domainCounts = articles.reduce<Partial<Record<TopicDomain, number>>>((acc, a) => {
    if (a.topic_domain) {
      acc[a.topic_domain] = (acc[a.topic_domain] ?? 0) + 1
    }
    return acc
  }, {})

  const activeDomains = DOMAIN_ORDER.filter((d) => (domainCounts[d] ?? 0) > 0)

  return (
    <>
      <Nav />

      <main>
        {/* Header */}
        <header style={{ borderBottom: '1px solid var(--ash)', padding: '48px 0 40px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <span
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--brick)',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              {articleFormat}
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-barlow-condensed, sans-serif)',
                fontSize: 'clamp(32px, 5vw, 52px)',
                fontWeight: 700,
                color: 'var(--bone)',
                lineHeight: 1.05,
                margin: '0 0 16px',
              }}
            >
              {meta.title}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '14px',
                color: 'var(--dust)',
                margin: 0,
                maxWidth: '560px',
                lineHeight: 1.65,
              }}
            >
              {meta.description}
            </p>
          </div>
        </header>

        {/* Domain filter pills */}
        {activeDomains.length > 0 && (
          <div style={{ borderBottom: '1px solid var(--ash)', padding: '16px 0' }}>
            <div
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 24px',
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--dust)',
                  marginRight: '4px',
                }}
              >
                Filter
              </span>
              {activeDomains.map((domain) => (
                <Link
                  key={domain}
                  href={`/${articleFormat}/${domain}`}
                  style={{
                    fontFamily: 'var(--font-dm-mono, monospace)',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '4px 12px',
                    border: '1px solid var(--ash)',
                    color: 'var(--dust)',
                    textDecoration: 'none',
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                  className="domain-pill"
                >
                  {DOMAIN_LABELS[domain]}
                  <span style={{ opacity: 0.5, marginLeft: '6px' }}>{domainCounts[domain]}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Article list */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {articles.length === 0 ? (
            <div style={{ padding: '64px 0', textAlign: 'center' }}>
              <p
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '13px',
                  color: 'var(--dust)',
                }}
              >
                No {articleFormat}s published yet. Check back soon.
              </p>
            </div>
          ) : (
            articles.map((article) => {
              const readTime = article.draft_text
                ? Math.ceil(article.draft_text.split(/\s+/).length / 200)
                : undefined
              const href = article.topic_domain
                ? `/${article.format}/${article.topic_domain}/${article.slug}`
                : `/${article.format}/${article.slug}`
              return (
                <ArticleRow
                  key={article.id}
                  format={article.format}
                  title={article.topic}
                  description={article.angle}
                  topic={article.topic_domain ? DOMAIN_LABELS[article.topic_domain] : ''}
                  href={href}
                  showReadTime
                  readTime={readTime}
                />
              )
            })
          )}
        </div>

        <DiagnosticCtaBand />
      </main>

      <Footer />

      <style>{`
        .domain-pill:hover {
          border-color: var(--brick);
          color: var(--brick);
        }
      `}</style>
    </>
  )
}
