import Link from 'next/link'
import type { ArticleFormat } from '@/types'

interface ArticleRowProps {
  href: string
  format: ArticleFormat
  title: string
  description: string
  topic: string
  showReadTime?: boolean
  readTime?: number
}

const formatLabels: Record<ArticleFormat, string> = {
  diagnostic: 'DIAGNOSTIC',
  guide: 'GUIDE',
  comparison: 'COMPARISON',
}

export function ArticleRow({
  href,
  format,
  title,
  description,
  topic,
  showReadTime = false,
  readTime,
}: ArticleRowProps) {
  return (
    <Link
      href={href}
      style={{
        display: 'grid',
        gridTemplateColumns: '100px 1fr 80px',
        gap: '0 20px',
        padding: '20px 0',
        borderBottom: '1px solid var(--ash)',
        textDecoration: 'none',
        transition: 'background 0.15s',
        position: 'relative',
      }}
      className="article-row"
    >
      {/* Left: format label */}
      <div
        style={{
          paddingTop: '2px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '10px',
            color: 'var(--brick)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
          }}
        >
          {formatLabels[format]}
        </span>
      </div>

      {/* Center: title + description */}
      <div>
        <h3
          className="font-heading"
          style={{
            fontSize: '22px',
            color: 'rgba(240,237,230,0.88)',
            margin: '0 0 6px',
            lineHeight: 1.15,
            fontWeight: 700,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '12px',
            color: 'var(--dust)',
            margin: 0,
            lineHeight: 1.55,
          }}
        >
          {description}
        </p>
      </div>

      {/* Right: topic (+ read time on article pages) */}
      <div style={{ textAlign: 'right', paddingTop: '2px' }}>
        <span
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '10px',
            color: 'var(--dust)',
            display: 'block',
          }}
        >
          {topic}
        </span>
        {showReadTime && readTime && (
          <span
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              color: 'var(--dust)',
              display: 'block',
              marginTop: '4px',
            }}
          >
            {readTime} min read
          </span>
        )}
      </div>

      <style>{`
        .article-row:hover {
          background: var(--cinder);
          padding-left: 8px;
          padding-right: 8px;
          margin-left: -8px;
          margin-right: -8px;
        }
        .article-row:hover::after {
          content: '→';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          color: var(--brick);
          font-family: var(--font-dm-mono, monospace);
          font-size: 14px;
        }
      `}</style>
    </Link>
  )
}
