import { Nav } from '@/components/public/Nav'
import { Footer } from '@/components/public/Footer'
import { ArticleRow } from '@/components/public/ArticleRow'
import { DiagnosticCtaBand } from '@/components/public/DiagnosticCtaBand'
import { createServiceClient } from '@/lib/supabase/server'
import type { ContentItem, ArticleFormat } from '@/types'

// Fetch the 5 most recently published articles
async function getLatestArticles(): Promise<ContentItem[]> {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('status', 'ready_to_publish')
      .not('published_at', 'is', null)
      .not('slug', 'is', null)
      .order('published_at', { ascending: false })
      .limit(5)

    if (error) throw error
    return data ?? []
  } catch (err) {
    console.error('[homepage] Failed to fetch articles:', err)
    return []
  }
}

// Each cell maps to a content category — not a specific article.
const FAILURE_MODES = [
  {
    id: 'diagnostic',
    title: 'I have no idea what\'s wrong',
    body: 'Diagnose where your marketing is leaking, so nothing can stand in the way of your revenue.',
    cta: 'Read a diagnostic →',
    href: '/diagnostic',
  },
  {
    id: 'guide',
    title: "Something's broke, and I ain't fixed it",
    body: "You know what needs doing, you want it done well, and you need guidance through it.",
    cta: 'Read a guide →',
    href: '/guide',
  },
  {
    id: 'comparison',
    title: "It's time for a tool upgrade",
    body: 'Tool comparisons sorted by the challenge, stage and model of bootstrapped businesses.',
    cta: 'Compare tools →',
    href: '/comparison',
  },
]

// Format label for article rail
const FORMAT_LABELS: Record<ArticleFormat, string> = {
  diagnostic: 'Diagnostic',
  guide: 'Guide',
  comparison: 'Comparison',
}

export default async function HomePage() {
  const articles = await getLatestArticles()

  return (
    <>
      <Nav />

      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="hero-section">
          <div className="hero-inner">
            {/* Left: headline + CTAs */}
            <div>
              <p
                className="label-text"
                style={{
                  color: 'var(--dust)',
                  marginBottom: '16px',
                  opacity: 0.7,
                  letterSpacing: '0.1em',
                }}
              >
                Marketing resource for bootstrapped founders
              </p>

              <h1 className="hero-headline">
                Your marketing is{' '}
                <span style={{ color: 'var(--brick)' }}>broken</span>
              </h1>

              <p className="hero-body">
                Bootslapped is a diagnostic resource for bootstrapped founders.
                Not more tactics — frameworks for finding exactly what&apos;s
                failing and what to fix first.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <a href="/diagnostic" className="btn-primary">
                  Take the Diagnostic →
                </a>
                <a href="/tools" className="btn-ghost">
                  Browse tools
                </a>
              </div>
            </div>

            {/* Right: article rail */}
            {articles.length > 0 && (
              <aside className="hero-aside">
                <p className="label-text" style={{ marginBottom: '16px', opacity: 0.6 }}>
                  Featured
                </p>
                {articles.slice(0, 3).map((article) => (
                  <a
                    key={article.id}
                    href={`/${article.format}/${article.slug}`}
                    className="hero-aside-link"
                  >
                    <span className="label-text" style={{ color: 'var(--brick)', display: 'block', marginBottom: '4px' }}>
                      {FORMAT_LABELS[article.format]}
                    </span>
                    <span className="font-heading" style={{ fontSize: '16px', color: 'var(--bone)', lineHeight: 1.2, display: 'block' }}>
                      {article.topic}
                    </span>
                  </a>
                ))}
              </aside>
            )}
          </div>
        </section>

        {/* ── Failure mode selector ─────────────────────────── */}
        <section style={{ borderBottom: '1px solid var(--ash)', padding: '56px 0' }}>
          <div className="content-wide">
            <h2
              className="font-heading"
              style={{
                fontSize: 'clamp(28px, 5vw, 48px)',
                color: 'var(--bone)',
                margin: '0 0 32px',
                lineHeight: 1.05,
              }}
            >
              What&apos;s the problem?
            </h2>
            <div className="failure-grid">
              {FAILURE_MODES.map((mode, i) => (
                <a
                  key={mode.id}
                  href={mode.href}
                  className={`failure-cell${i > 0 ? ' failure-cell--border' : ''}`}
                >
                  <h3 className="font-heading" style={{ fontSize: '20px', color: 'var(--bone)', margin: '0 0 10px', lineHeight: 1.15 }}>
                    {mode.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '13px', color: 'var(--dust)', lineHeight: 1.6, margin: '0 0 16px' }}>
                    {mode.body}
                  </p>
                  <span style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '12px', color: 'var(--brick)', letterSpacing: '0.04em' }}>
                    {mode.cta}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Article list ─────────────────────────────────── */}
        {articles.length > 0 && (
          <section style={{ borderBottom: '1px solid var(--ash)', padding: '56px 0' }}>
            <div className="content-wide">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--ash)', paddingBottom: '12px' }}>
                <span className="label-text" style={{ opacity: 0.6 }}>Latest</span>
                <a href="/articles" style={{ fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '11px', color: 'var(--dust)', textDecoration: 'none', letterSpacing: '0.05em' }}>
                  View all →
                </a>
              </div>

              {articles.map((article) => (
                <ArticleRow
                  key={article.id}
                  format={article.format}
                  title={article.topic}
                  description={article.angle}
                  topic={FORMAT_LABELS[article.format]}
                  href={`/${article.format}/${article.slug}`}
                />
              ))}
            </div>
          </section>
        )}

        <DiagnosticCtaBand />
      </main>

      <Footer />

      <style>{`
        .hero-section {
          border-bottom: 1px solid var(--ash);
          padding: 64px 0 56px;
        }
        .hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 64px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .hero-inner {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .hero-aside {
            border-left: none !important;
            border-top: 1px solid var(--ash);
            padding-left: 0 !important;
            padding-top: 24px;
          }
        }
        .hero-headline {
          font-family: var(--font-barlow-condensed, sans-serif);
          font-size: clamp(40px, 6vw, 64px);
          font-weight: 700;
          line-height: 1.05;
          color: var(--bone);
          margin: 0 0 24px;
          letter-spacing: -0.01em;
        }
        .hero-body {
          font-family: var(--font-dm-mono, monospace);
          font-size: 15px;
          line-height: 1.7;
          color: var(--dust);
          margin: 0 0 36px;
          max-width: 520px;
        }
        .hero-aside {
          border-left: 1px solid var(--ash);
          padding-left: 32px;
        }
        .hero-aside-link {
          display: block;
          border-bottom: 1px solid var(--ash);
          padding: 12px 0;
          text-decoration: none;
        }
        .hero-aside-link:hover span:last-child {
          color: var(--bone);
          text-decoration: underline;
        }
        .content-wide {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .failure-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1px solid var(--ash);
        }
        @media (max-width: 768px) {
          .failure-grid {
            grid-template-columns: 1fr;
          }
          .failure-cell--border {
            border-left: none !important;
            border-top: 1px solid var(--ash) !important;
          }
        }
        .failure-cell {
          display: block;
          padding: 28px 24px;
          text-decoration: none;
          background-color: var(--brick-tint);
          transition: background-color 0.15s;
        }
        .failure-cell--border {
          border-left: 1px solid var(--ash);
        }
        .failure-cell:hover {
          background-color: rgba(196, 92, 68, 0.2);
        }
        .btn-primary {
          display: inline-block;
          background-color: var(--brick);
          color: var(--bone);
          font-family: var(--font-dm-mono, monospace);
          font-size: 13px;
          padding: 12px 24px;
          text-decoration: none;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: background-color 0.15s;
        }
        .btn-primary:hover { background-color: var(--kiln); }
        .btn-ghost {
          display: inline-block;
          border: 1px solid var(--ash);
          color: var(--dust);
          font-family: var(--font-dm-mono, monospace);
          font-size: 13px;
          padding: 12px 24px;
          text-decoration: none;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: border-color 0.15s, color 0.15s;
        }
        .btn-ghost:hover { border-color: var(--dust); color: var(--bone); }
      `}</style>
    </>
  )
}
