import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { analyzeDiff } from '@/lib/anthropic/analyze-diff'

export async function POST(request: Request) {
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()

  try {
    const body = await request.json()
    const { item_id, edited_text } = body

    if (!item_id || !edited_text) {
      return NextResponse.json({ error: 'item_id and edited_text required' }, { status: 400 })
    }

    // 1. Fetch item
    const { data: item, error } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', item_id)
      .single()

    if (error || !item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Compare against the original AI-generated draft (not previous edits)
    const originalDraft = item.draft_text
    if (!originalDraft) {
      return NextResponse.json({ error: 'No draft to compare against' }, { status: 400 })
    }

    // 2. Run diff analysis
    const analysis = await analyzeDiff({
      originalDraft,
      editedDraft: edited_text,
    })

    // 3. Update content item — store edited text and patterns
    await supabase
      .from('content_items')
      .update({
        edited_draft_text: edited_text,
        inferred_patterns: analysis.inferred_patterns,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item_id)

    // 4. If there's an existing approved example for this item, update it with the edited text
    const { data: existingExample } = await supabase
      .from('editorial_examples')
      .select('id')
      .eq('content_item_id', item_id)
      .eq('stage', 'draft')
      .eq('outcome', 'approved')
      .single()

    if (existingExample) {
      await supabase
        .from('editorial_examples')
        .update({
          content_text: edited_text,
          inferred_patterns: analysis.inferred_patterns,
        })
        .eq('id', existingExample.id)
    }

    // 5. Fetch updated item
    const { data: updatedItem } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', item_id)
      .single()

    return NextResponse.json({
      inferred_patterns: analysis.inferred_patterns,
      proposed_context_doc_addition: analysis.proposed_context_doc_addition,
      item: updatedItem,
    })
  } catch (error) {
    console.error('[diff-analysis] Error:', error)
    return NextResponse.json({ error: 'Diff analysis failed' }, { status: 500 })
  }
}
