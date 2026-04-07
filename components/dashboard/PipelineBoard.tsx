'use client'

import { ContentCard } from './ContentCard'
import type { ContentItem, ContentStatus, PipelineCounts } from '@/types'

interface PipelineBoardProps {
  items: ContentItem[]
  counts: PipelineCounts
  onGenerateBriefs: () => void
  isGenerating: boolean
}

const PIPELINE_COLUMNS: Array<{ label: string; statuses: ContentStatus[] }> = [
  { label: 'Brief review', statuses: ['brief_pending'] },
  // brief_approved and draft_pending are transitional — draft is generating
  { label: 'Draft review', statuses: ['brief_approved', 'draft_pending', 'draft_review', 'revision_requested'] },
  { label: 'Ready to publish', statuses: ['ready_to_publish'] },
]

export function PipelineBoard({
  items,
  counts,
  onGenerateBriefs,
  isGenerating,
}: PipelineBoardProps) {
  return (
    <div>
      {/* Pipeline header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 0',
          borderBottom: '1px solid var(--rule)',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <h1
            style={{
              fontFamily: 'var(--font-barlow-condensed, sans-serif)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--ink)',
              margin: 0,
            }}
          >
            Pipeline
          </h1>

          {/* Stage counts */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {[
              { label: 'BRIEFS', count: counts.brief_pending },
              { label: 'DRAFTS', count: counts.draft_review + (counts.revision_requested ?? 0) },
              { label: 'READY', count: counts.ready_to_publish },
            ].map(({ label, count }) => (
              <span
                key={label}
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: count > 0 ? 'var(--brick)' : 'var(--ink-muted)',
                }}
              >
                {count} {label}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onGenerateBriefs}
          disabled={isGenerating}
          className="btn-approve"
          style={{ opacity: isGenerating ? 0.6 : 1 }}
        >
          {isGenerating ? 'Generating...' : 'Generate brief →'}
        </button>
      </div>

      {/* Column layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}
      >
        {PIPELINE_COLUMNS.map((col) => {
          const colItems = items.filter((item) => col.statuses.includes(item.status))
          return (
            <div key={col.label}>
              {/* Column header */}
              <div
                style={{
                  borderBottom: '1px solid var(--rule)',
                  paddingBottom: '10px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-dm-mono, monospace)',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: 'var(--ink-muted)',
                  }}
                >
                  {col.label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-dm-mono, monospace)',
                    fontSize: '10px',
                    color: colItems.length > 0 ? 'var(--brick)' : 'var(--ink-muted)',
                  }}
                >
                  {colItems.length}
                </span>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {colItems.length === 0 ? (
                  <p
                    style={{
                      fontFamily: 'var(--font-dm-mono, monospace)',
                      fontSize: '12px',
                      color: 'var(--ink-muted)',
                      padding: '24px 0',
                      textAlign: 'center',
                    }}
                  >
                    Empty
                  </p>
                ) : (
                  colItems.map((item) => (
                    <ContentCard key={item.id} item={item} />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
