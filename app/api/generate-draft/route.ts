import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { generateDraft } from '@/lib/anthropic/generate-draft'
import { sendSlackNotification } from '@/lib/slack/notify'

// Vercel Pro: Node.js runtime with 60s max duration.
// Sonnet needs up to 45s for a full draft — this gives comfortable headroom.
export const maxDuration = 60

export async function POST(request: Request) {
  // Internal-only route — called by /api/decisions with CRON_SECRET
  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  try {
    const body = await request.json()
    const { item_id, revision_note } = body

    if (!item_id) {
      return NextResponse.json({ error: 'item_id required' }, { status: 400 })
    }

    // 1. Fetch the content item
    const { data: item, error: itemError } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', item_id)
      .single()

    if (itemError || !item) {
      return NextResponse.json({ error: 'Content item not found' }, { status: 404 })
    }

    // 2. Fetch active context doc
    const { data: contextDoc } = await supabase
      .from('context_doc')
      .select('*')
      .eq('is_active', true)
      .single()

    if (!contextDoc) {
      return NextResponse.json({ error: 'No active context doc' }, { status: 400 })
    }

    // 3. Fetch approved draft examples for prompt context
    const { data: approvedExamples } = await supabase
      .from('editorial_examples')
      .select('*')
      .eq('stage', 'draft')
      .eq('outcome', 'approved')
      .order('created_at', { ascending: false })
      .limit(5)

    // 4. Generate draft
    const draftText = await generateDraft({
      item,
      contextDoc,
      approvedExamples: approvedExamples ?? [],
      revisionNote: revision_note,
    })

    // 5. Update content item — only schema fields
    const { data: updatedItem, error: updateError } = await supabase
      .from('content_items')
      .update({
        draft_text: draftText,
        status: 'draft_review',
        updated_at: new Date().toISOString(),
      })
      .eq('id', item_id)
      .select()
      .single()

    if (updateError) {
      console.error('[generate-draft] Update error:', updateError)
      return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 })
    }

    // 6. Slack notification
    await sendSlackNotification({ event: 'draft_ready', topic: item.topic })

    return NextResponse.json({ item: updatedItem })
  } catch (error) {
    console.error('[generate-draft] Error:', error)
    return NextResponse.json({ error: 'Draft generation failed' }, { status: 500 })
  }
}
