'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ContentItem } from '@/types'
import Link from 'next/link'

export default function PublishQueuePage() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('content_items')
      .select('*')
      .eq('status', 'ready_to_publish')
      .order('decided_at', { ascending: false })
      .then(({ data }) => {
        if (data) setItems(data as ContentItem[])
        setIsLoading(false)
      })
  }, [])

  const handleExportMarkdown = (item: ContentItem) => {
    const finalText = item.edited_draft_text ?? item.draft_text ?? ''
    const content = `# ${item.topic}\n\n**Format:** ${item.format}\n**Audience:** ${item.target_audience}\n**Slug:** ${item.slug ?? 'not-assigned'}\n\n---\n\n${finalText}`
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${item.slug ?? item.topic?.toLowerCase().replace(/\s+/g, '-') ?? 'draft'}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--ink-muted)', fontFamily: 'var(--font-dm-mono, monospace)', fontSize: '13px' }}>
        Loading queue...
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid var(--rule)',
          paddingBottom: '16px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-barlow-condensed, sans-serif)',
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--ink)',
            margin: 0,
          }}
        >
          Publish queue
        </h1>
        <span
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '12px',
            color: items.length > 0 ? 'var(--brick)' : 'var(--ink-muted)',
          }}
        >
          {items.length} ready
        </span>
      </div>

      {items.length === 0 ? (
        <p
          style={{
            fontFamily: 'var(--font-dm-mono, monospace)',
            fontSize: '13px',
            color: 'var(--ink-muted)',
            padding: '48px 0',
            textAlign: 'center',
          }}
        >
          Nothing ready to publish yet.{' '}
          <Link href="/dashboard" style={{ color: 'var(--brick)' }}>
            Check the pipeline →
          </Link>
        </p>
      ) : (
        <div>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid var(--rule)',
                marginBottom: '8px',
              }}
            >
              {/* Item header */}
              <div
                style={{
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: expandedId === item.id ? 'var(--surface)' : 'transparent',
                  borderBottom: expandedId === item.id ? '1px solid var(--rule)' : 'none',
                }}
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-barlow-condensed, sans-serif)',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: 'var(--ink)',
                    }}
                  >
                    {item.topic}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-mono, monospace)',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--brick)',
                      marginLeft: '12px',
                    }}
                  >
                    {item.format}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleExportMarkdown(item)
                    }}
                    className="btn-ghost"
                    style={{ fontSize: '11px', padding: '5px 12px' }}
                  >
                    Export .md →
                  </button>
                  <button
                    style={{
                      fontFamily: 'var(--font-dm-mono, monospace)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      padding: '5px 12px',
                      border: '1px solid var(--rule)',
                      backgroundColor: 'transparent',
                      color: 'var(--ink-muted)',
                      cursor: 'not-allowed',
                      opacity: 0.5,
                    }}
                    disabled
                    title="CMS push — coming soon"
                  >
                    Push to CMS
                  </button>
                </div>
              </div>

              {/* Expanded draft */}
              {expandedId === item.id && (
                <div style={{ padding: '20px' }}>
                  <pre
                    style={{
                      fontFamily: 'var(--font-dm-mono, monospace)',
                      fontSize: '13px',
                      color: 'var(--ink)',
                      lineHeight: 1.75,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      margin: 0,
                    }}
                  >
                    {item.edited_draft_text ?? item.draft_text}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
