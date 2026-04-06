import Link from 'next/link'
import type { ArticleFormat } from '@/types'

interface RelatedArticle {
  slug: string
  category: ArticleFormat
  title: string
  description: string
  topic: string
}

interface RelatedArticlesProps {
  articles: RelatedArticle[]
}

const formatLabels: Record<ArticleFormat, string> = {
  diagnostic: 'DIAGNOSTIC',
  guide: 'GUIDE',
  comparison: 'COMPARISON',
}

// Structural component — three related articles at foot of every article page
// Populated from content database, not AI-generated
export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null

  return (
    <section style={{ marginTop: '64px' }}>
      <div
        style={{
          borderTop: '1px solid var(--ash)',
          paddingTop: '0',
        }}
      >
        <span
          className="label-text"
          style={{
            color: 'var(--dust)',
            display: 'block',
            padding: '16px 0 8px',
          }}
        >
          Related
        </span>
      </div>
      <div>
        {articles.slice(0, 3).map((article) => (
          <Link
            key={article.slug}
            href={`/${article.category}/${article.slug}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr',
              gap: '0 20px',
              padding: '16px 0',
              borderBottom: '1px solid var(--ash)',
              textDecoration: 'none',
              transition: 'background 0.15s',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '10px',
                color: 'var(--brick)',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                paddingTop: '2px',
              }}
            >
              {formatLabels[article.category]}
            </span>
            <div>
              <span
                className="font-heading"
                style={{
                  fontSize: '18px',
                  color: 'rgba(240,237,230,0.88)',
                  display: 'block',
                  marginBottom: '4px',
                  lineHeight: 1.2,
                }}
              >
                {article.title}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '12px',
                  color: 'var(--dust)',
                }}
              >
                {article.description}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
