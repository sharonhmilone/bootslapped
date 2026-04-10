import type { ContentStatus } from '@/types'

interface StatusBadgeProps {
  status: ContentStatus
}

const STATUS_CONFIG: Record<ContentStatus, { label: string; color: string; bg: string }> = {
  brief_pending:      { label: 'BRIEF PENDING',   color: '#9E9893', bg: 'rgba(158,152,147,0.1)' },
  brief_approved:     { label: 'BRIEF APPROVED',  color: '#4A9B8E', bg: 'rgba(74,155,142,0.1)' },
  brief_rejected:     { label: 'BRIEF REJECTED',  color: '#C45C44', bg: 'rgba(196,92,68,0.1)' },
  draft_pending:      { label: 'DRAFT PENDING',   color: '#9E9893', bg: 'rgba(158,152,147,0.1)' },
  draft_review:       { label: 'DRAFT REVIEW',    color: '#C45C44', bg: 'rgba(196,92,68,0.08)' },
  draft_rejected:     { label: 'DRAFT REJECTED',  color: '#C45C44', bg: 'rgba(196,92,68,0.1)' },
  revision_requested: { label: 'REVISION',        color: '#D96B51', bg: 'rgba(217,107,81,0.1)' },
  ready_to_publish:   { label: 'READY',           color: '#4A9B8E', bg: 'rgba(74,155,142,0.15)' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      style={{
        fontFamily: 'var(--font-dm-mono, monospace)',
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: config.color,
        backgroundColor: config.bg,
        padding: '3px 8px',
        border: `1px solid ${config.color}33`,
        display: 'inline-block',
      }}
    >
      {config.label}
    </span>
  )
}
