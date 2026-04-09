import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generateDraft } from '@/lib/anthropic/generate-draft'
import { sendSlackNotification } from '@/lib/slack/notify'

// Vercel Pro: Node.js runtime with 60s max duration.
export const maxDuration = 60

export async function POST(request: Request) {
  // Auth check via session cookie — editor only
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  try {
    const body = await request.json()
    const { item_id } = body

    if (!item_id) {
      return NextResponse.json({ error: 'item_id required' }, { status: 400 })
    }

    // 1. Fetch item — must be stuck in brief_approved or draft_pending
    const { data: item, error: itemError } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', item_id)
      .single()

    if (itemError || !item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    if (!['brief_approved', 'draft_pending', 'draft_review'].includes(item.status)) {
      return NextResponse.json(
        { error: `Cannot regenerate from status: ${item.status}` },
        { status: 400 }
      )
    }

    // 2. Mark as draft_pending (shows generating state on dashboard)
    await supabase
      .from('content_items')
      .update({ status: 'draft_pending', updated_at: new Date().toISOString() })
      .eq('id', item_id)

    // 3. Fetch context doc
    const { data: contextDoc } = await supabase
      .from('context_doc')
      .select('*')
      .eq('is_active', true)
      .single()

    if (!contextDoc) {
      return NextResponse.json({ error: 'No active context doc' }, { status: 400 })
    }

    // 4. Fetch approved examples for prompt context
    const { data: approvedExamples } = await supabase
      .from('editorial_examples')
      .select('*')
      .eq('stage', 'draft')
      .eq('outcome', 'approved')
      .order('created_at', { ascending: false })
      .limit(3)

    // 5. Generate draft (Haiku ~18s, fits in 30s Edge limit)
    const draftText = await generateDraft({
      item,
      contextDoc,
      approvedExamples: approvedExamples ?? [],
    })

    // 6. Save draft and update status
    const { data: updatedItem, error: updateError } = await supabase
      .from('content_items')
      .update({
        draft_text: draftText,
        edited_draft_text: null, // clear any previous edits
        status: 'draft_review',
        updated_at: new Date().toISOString(),
      })
      .eq('id', item_id)
      .select()
      .single()

    if (updateError) {
      console.error('[regenerate-draft] Update error:', updateError)
      return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 })
    }

    await sendSlackNotification({ event: 'draft_ready', topic: item.topic })

    return NextResponse.json({ item: updatedItem })
  } catch (error) {
    console.error('[regenerate-draft] Error:', error)
    return NextResponse.json({ error: 'Draft generation failed' }, { status: 500 })
  }
}
