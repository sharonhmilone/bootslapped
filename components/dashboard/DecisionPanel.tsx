'use client'

import { useState } from 'react'
type Decision = 'approved' | 'rejected' | 'revision_requested'

interface DecisionPanelProps {
  itemId: string
  decisionType: 'brief' | 'draft'
  decisionTags: Array<{ label: string }>
  onDecision: (decision: Decision, note: string, tags: string[]) => Promise<void>
  isSubmitting: boolean
}

export function DecisionPanel({
  itemId,
  decisionType,
  decisionTags,
  onDecision,
  isSubmitting,
}: DecisionPanelProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [pendingDecision, setPendingDecision] = useState<Decision | null>(null)

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleDecision = async (decision: Decision) => {
    setPendingDecision(decision)
    await onDecision(decision, note, selectedTags)
    setPendingDecision(null)
  }

  return (
    <div
      style={{
        border: '1px solid var(--rule)',
        backgroundColor: 'var(--surface)',
      }}
    >
      {/* Panel header */}
      <div
        style={{
          borderBottom: '1px solid var(--rule)',
          padding: '12px 16px',
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
          Decision
        </span>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Tags */}
        {decisionTags.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <span
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--ink-muted)',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              Tags
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {decisionTags.map(({ label }) => (
                <button
                  key={label}
                  onClick={() => toggleTag(label)}
                  style={{
                    fontFamily: 'var(--font-dm-mono, monospace)',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '4px 10px',
                    border: selectedTags.includes(label)
                      ? '1px solid var(--brick)'
                      : '1px solid var(--rule)',
                    backgroundColor: selectedTags.includes(label)
                      ? 'rgba(196,92,68,0.08)'
                      : 'transparent',
                    color: selectedTags.includes(label) ? 'var(--brick)' : 'var(--ink-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Note field */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--ink-muted)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Note (required on reject/revision)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What specifically needs to change..."
            style={{
              width: '100%',
              minHeight: '80px',
              backgroundColor: 'var(--surface-alt)',
              border: '1px solid var(--rule)',
              color: 'var(--ink)',
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '13px',
              padding: '10px 12px',
              resize: 'vertical',
              lineHeight: 1.5,
            }}
          />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleDecision('approved')}
            disabled={isSubmitting}
            className="btn-approve"
            style={{ opacity: isSubmitting && pendingDecision === 'approved' ? 0.6 : 1 }}
          >
            Approve →
          </button>

          {decisionType === 'draft' && (
            <button
              onClick={() => handleDecision('revision_requested')}
              disabled={isSubmitting || !note.trim()}
              style={{
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '11px',
                padding: '8px 18px',
                border: '1px solid var(--rule)',
                backgroundColor: 'transparent',
                color: 'var(--ink-muted)',
                cursor: isSubmitting || !note.trim() ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                opacity: isSubmitting && pendingDecision === 'revision_requested' ? 0.6 : 1,
                transition: 'all 0.15s',
              }}
            >
              Request revision
            </button>
          )}

          <button
            onClick={() => handleDecision('rejected')}
            disabled={isSubmitting || !note.trim()}
            className="btn-reject"
            style={{
              cursor: isSubmitting || !note.trim() ? 'not-allowed' : 'pointer',
              opacity: isSubmitting && pendingDecision === 'rejected' ? 0.6 : 1,
            }}
          >
            Reject
          </button>
        </div>

        {!note.trim() && (
          <p
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '11px',
              color: 'var(--ink-muted)',
              marginTop: '8px',
            }}
          >
            Note required before rejecting or requesting revision.
          </p>
        )}
      </div>
    </div>
  )
}
