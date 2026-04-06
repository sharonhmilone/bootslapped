'use client'

import { useState, useEffect, useRef } from 'react'

interface DraftEditorProps {
  initialText: string
  onSave: (text: string) => Promise<void>
  isSaving: boolean
}

export function DraftEditor({ initialText, onSave, isSaving }: DraftEditorProps) {
  const [text, setText] = useState(initialText)
  const [isDirty, setIsDirty] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [text])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    setIsDirty(true)
  }

  const handleSave = async () => {
    await onSave(text)
    setIsDirty(false)
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--rule)',
          padding: '10px 0',
          marginBottom: '16px',
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
          Draft
          {isDirty && (
            <span style={{ color: 'var(--brick)', marginLeft: '8px' }}>
              · Unsaved changes
            </span>
          )}
        </span>

        {isDirty && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-approve"
            style={{ fontSize: '10px', padding: '5px 12px', opacity: isSaving ? 0.6 : 1 }}
          >
            {isSaving ? 'Saving...' : 'Save edits →'}
          </button>
        )}
      </div>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        style={{
          width: '100%',
          minHeight: '480px',
          backgroundColor: 'var(--surface-alt)',
          border: '1px solid var(--rule)',
          color: 'var(--ink)',
          fontFamily: 'var(--font-dm-mono, monospace)',
          fontSize: '13px',
          lineHeight: 1.75,
          padding: '16px',
          resize: 'none',
          overflow: 'hidden',
        }}
        placeholder="Draft text appears here..."
        spellCheck={true}
      />

      <p
        style={{
          fontFamily: 'var(--font-dm-mono, monospace)',
          fontSize: '10px',
          color: 'var(--ink-muted)',
          marginTop: '8px',
        }}
      >
        {text.trim().split(/\s+/).filter(Boolean).length} words
        {isDirty && ' · Save to run diff analysis and update learning pool'}
      </p>
    </div>
  )
}
