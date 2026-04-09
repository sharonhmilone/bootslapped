import Link from 'next/link'
import { StatusBadge } from './StatusBadge'
import type { ContentItem } from '@/types'

interface ContentCardProps {
  item: ContentItem
}

function getDaysOld(dateStr: string): number {
  const date = new Date(dateStr)
  const now = new Date()
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
}

function getDetailHref(item: ContentItem): string {
  // brief_pending and brief_rejected → brief review page
  // brief_approved, draft_pending, and all draft statuses → draft page
  // (brief_approved items are generating — draft page has the manual trigger button)
  if (item.status === 'brief_pending' || item.status === 'brief_rejected') {
    return `/dashboard/briefs/${item.id}`
  }
  return `/dashboard/drafts/${item.id}`
}

export function ContentCard({ item }: ContentCardProps) {
  const daysOld = getDaysOld(item.updated_at)
  const isStale = daysOld >= 5
  const isGenerating = item.status === 'brief_approved' || item.status === 'draft_pending'
  const href = getDetailHref(item)

  return (
    <Link
      href={href}
      style={{
        display: 'block',
        backgroundColor: 'var(--surface)',
        border: `1px solid ${isStale ? 'var(--brick)' : 'var(--rule)'}`,
        padding: '16px',
        textDecoration: 'none',
        transition: 'border-color 0.15s',
        opacity: isGenerating ? 0.65 : 1,
      }}
    >
      {/* Top row: format tag + status badge */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--brick)',
          }}
        >
          {item.format ?? 'TBD'}
        </span>
        {isGenerating ? (
          <span style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '10px',
            color: 'var(--ink-muted)',
            letterSpacing: '0.08em',
          }}>
            Generating draft...
          </span>
        ) : (
          <StatusBadge status={item.status} />
        )}
      </div>

      {/* Topic / title */}
      <p
        style={{
          fontFamily: 'var(--font-barlow-condensed, sans-serif)',
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--ink)',
          margin: '0 0 6px',
          lineHeight: 1.2,
        }}
      >
        {item.topic ?? 'Untitled'}
      </p>

      {/* Angle */}
      {item.angle && (
        <p
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '12px',
            color: 'var(--ink-muted)',
            margin: '0 0 12px',
            lineHeight: 1.5,
          }}
        >
          {item.angle}
        </p>
      )}

      {/* Footer: stale flag + date */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--rule)',
          paddingTop: '10px',
          marginTop: '4px',
        }}
      >
        {isStale ? (
          <span
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              color: 'var(--brick)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Stalled {daysOld}d
          </span>
        ) : (
          <span />
        )}
        <span
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '10px',
            color: 'var(--ink-muted)',
          }}
        >
          {new Date(item.updated_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
    </Link>
  )
}
