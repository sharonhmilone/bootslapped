'use client'

import { useEffect, useState } from 'react'
import { PipelineBoard } from '@/components/dashboard/PipelineBoard'
import { createClient } from '@/lib/supabase/client'
import type { ContentItem, PipelineCounts } from '@/types'

export default function DashboardPage() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [counts, setCounts] = useState<PipelineCounts>({
    brief_pending: 0,
    draft_review: 0,
    revision_requested: 0,
    ready_to_publish: 0,
    total: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  const fetchItems = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('content_items')
      .select('*')
      .not('status', 'in', '("brief_rejected","draft_rejected")')
      .order('created_at', { ascending: false })
      .limit(100)

    if (data) {
      setItems(data as ContentItem[])
      setCounts({
        brief_pending: data.filter((i) => i.status === 'brief_pending').length,
        draft_review: data.filter((i) => i.status === 'draft_review').length,
        revision_requested: data.filter((i) => i.status === 'revision_requested').length,
        ready_to_publish: data.filter((i) => i.status === 'ready_to_publish').length,
        total: data.length,
      })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  // Auto-poll every 8s while any item is in a generating state
  useEffect(() => {
    const generatingStatuses = ['brief_approved', 'draft_pending']
    const hasGenerating = items.some((i) => generatingStatuses.includes(i.status))
    if (!hasGenerating) return
    const interval = setInterval(fetchItems, 8000)
    return () => clearInterval(interval)
  }, [items])

  const handleGenerateBriefs = async () => {
    setIsGenerating(true)
    const savedCount = typeof window !== 'undefined'
      ? Number(localStorage.getItem('bootslapped:briefCount') ?? '1')
      : 1
    try {
      await fetch('/api/generate-briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: savedCount }),
      })
    } catch (error) {
      // Browser extensions can drop the response even when the server
      // succeeded — always refresh the board regardless so generated
      // briefs appear without requiring a manual page reload.
      console.error('[generate-briefs] fetch error (server may have succeeded):', error)
    } finally {
      // Always refresh — server-side generation is independent of whether
      // the browser successfully received the HTTP response.
      await fetchItems()
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div
        style={{
          fontFamily: 'var(--font-dm-mono, monospace)',
          fontSize: '13px',
          color: 'var(--ink-muted)',
          padding: '48px 0',
          textAlign: 'center',
        }}
      >
        Loading pipeline...
      </div>
    )
  }

  return (
    <PipelineBoard
      items={items}
      counts={counts}
      onGenerateBriefs={handleGenerateBriefs}
      isGenerating={isGenerating}
    />
  )
}
