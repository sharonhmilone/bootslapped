'use client'

import type { ContextDocProposal } from '@/types'

interface ProposalCardProps {
  proposal: ContextDocProposal
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
  isSubmitting: boolean
}

export function ProposalCard({
  proposal,
  onApprove,
  onReject,
  isSubmitting,
}: ProposalCardProps) {
  return (
    <div
      style={{
        border: '1px solid var(--rule)',
        backgroundColor: 'var(--surface)',
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid var(--rule)',
          padding: '10px 16px',
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
            letterSpacing: '0.12em',
            color: 'var(--steel-teal)',
          }}
        >
          Proposed addition
        </span>
        <span
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '10px',
            color: 'var(--ink-muted)',
          }}
        >
          {new Date(proposal.created_at).toLocaleDateString()}
        </span>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Proposed text */}
        <div
          style={{
            borderLeft: '3px solid var(--steel-teal)',
            padding: '12px 16px',
            backgroundColor: 'rgba(74,155,142,0.06)',
            marginBottom: '12px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '13px',
              color: 'var(--ink)',
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            {proposal.proposed_addition}
          </p>
        </div>

        {/* Rationale */}
        {proposal.rationale && (
          <p
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '12px',
              color: 'var(--ink-muted)',
              margin: '0 0 16px',
              lineHeight: 1.6,
            }}
          >
            {proposal.rationale}
          </p>
        )}

        {/* Source patterns */}
        {proposal.source_patterns && proposal.source_patterns.length > 0 && (
          <p
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '11px',
              color: 'var(--ink-muted)',
              margin: '0 0 16px',
            }}
          >
            Based on {proposal.source_patterns.length} inferred pattern
            {proposal.source_patterns.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onApprove(proposal.id)}
            disabled={isSubmitting}
            className="btn-approve"
            style={{ opacity: isSubmitting ? 0.6 : 1 }}
          >
            Approve →
          </button>
          <button
            onClick={() => onReject(proposal.id)}
            disabled={isSubmitting}
            className="btn-reject"
            style={{ opacity: isSubmitting ? 0.6 : 1 }}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}
