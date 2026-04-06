'use client'

import { useState } from 'react'
import type { ContextDoc } from '@/types'

interface ContextDocViewerProps {
  doc: ContextDoc
  history: ContextDoc[]
  onSave: (content: string, changeNote: string) => Promise<void>
  isSaving: boolean
}

export function ContextDocViewer({
  doc,
  history,
  onSave,
  isSaving,
}: ContextDocViewerProps) {
  const [content, setContent] = useState(doc.content)
  const [changeNote, setChangeNote] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const handleSave = async () => {
    if (!changeNote.trim()) return
    await onSave(content, changeNote)
    setIsDirty(false)
    setChangeNote('')
  }

  return (
    <div>
      {/* Header — Steel Teal label (context doc page only) */}
      <div
        style={{
          borderBottom: '1px solid var(--rule)',
          paddingBottom: '16px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--steel-teal)',
              display: 'block',
              marginBottom: '4px',
            }}
          >
            Context document
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-barlow-condensed, sans-serif)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--ink)',
              margin: 0,
            }}
          >
            Editorial Playbook — v{doc.version}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '6px 12px',
              border: '1px solid var(--rule)',
              backgroundColor: 'transparent',
              color: 'var(--ink-muted)',
              cursor: 'pointer',
            }}
          >
            {showHistory ? 'Hide history' : `History (${history.length})`}
          </button>
        </div>
      </div>

      {/* Version history */}
      {showHistory && history.length > 0 && (
        <div
          style={{
            border: '1px solid var(--rule)',
            backgroundColor: 'var(--surface)',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-dm-mono, monospace)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--ink-muted)',
              display: 'block',
              marginBottom: '12px',
            }}
          >
            Version history
          </span>
          {history.map((v) => (
            <div
              key={v.id}
              style={{
                borderBottom: '1px solid var(--rule)',
                padding: '10px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-dm-mono, monospace)',
                    fontSize: '12px',
                    color: v.is_active ? 'var(--brick)' : 'var(--ink)',
                    fontWeight: v.is_active ? 700 : 400,
                  }}
                >
                  v{v.version}
                  {v.is_active && ' · Active'}
                </span>
                {v.change_note && (
                  <p
                    style={{
                      fontFamily: 'var(--font-dm-mono, monospace)',
                      fontSize: '12px',
                      color: 'var(--ink-muted)',
                      margin: '4px 0 0',
                    }}
                  >
                    {v.change_note}
                  </p>
                )}
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono, monospace)',
                  fontSize: '11px',
                  color: 'var(--ink-muted)',
                }}
              >
                {new Date(v.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Editable content */}
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
          setIsDirty(true)
        }}
        style={{
          width: '100%',
          minHeight: '600px',
          backgroundColor: 'var(--surface-alt)',
          border: '1px solid var(--rule)',
          color: 'var(--ink)',
          fontFamily: 'var(--font-dm-mono, monospace)',
          fontSize: '13px',
          lineHeight: 1.75,
          padding: '20px',
          resize: 'vertical',
        }}
      />

      {/* Save controls */}
      {isDirty && (
        <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
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
              Change note (required)
            </label>
            <input
              type="text"
              value={changeNote}
              onChange={(e) => setChangeNote(e.target.value)}
              placeholder="What changed and why..."
              style={{
                width: '100%',
                backgroundColor: 'var(--surface-alt)',
                border: '1px solid var(--rule)',
                color: 'var(--ink)',
                fontFamily: 'var(--font-dm-mono, monospace)',
                fontSize: '13px',
                padding: '8px 12px',
              }}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving || !changeNote.trim()}
            className="btn-approve"
            style={{
              marginTop: '22px',
              opacity: isSaving || !changeNote.trim() ? 0.6 : 1,
              cursor: isSaving || !changeNote.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {isSaving ? 'Saving...' : 'Save version →'}
          </button>
        </div>
      )}
    </div>
  )
}
