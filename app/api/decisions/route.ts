import { after } from 'next/server'
import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { sendSlackNotification } from '@/lib/slack/notify'
import { proposeContextDocUpdate } from '@/lib/anthropic/propose-update'
import { generateArticleSlug, makeSlugUnique } from '@/lib/utils/slug'

// 30s gives after() enough time to initiate the generate-draft HTTP call
// before the function exits. The actual AI generation runs in generate-draft's
// own 60s window as a separate invocation.
export const maxDuration = 30

const PROPOSAL_THRESHOLD_DECISIONS = 5
const PROPOSAL_THRESHOLD_PATTERNS = 3

export async function POST(request: Request) {
  // Auth check via SSR client (reads session cookie)
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  try {
    const body = await request.json()
    const { item_id, decision, note, tags } = body

    if (!item_id || !decision) {
      return NextResponse.json({ error: 'item_id and decision are required' }, { status: 400 })
    }

    // 1. Fetch current item to determine stage
    const { data: item, error: itemError } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', item_id)
      .single()

    if (itemError || !item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Stage is inferred from current status
    const isBriefStage = ['brief_pending'].includes(item.status)
    const stage = isBriefStage ? 'brief' : 'draft'

    // 2. Determine new status
    const now = new Date().toISOString()
    let newStatus: string

    if (stage === 'brief') {
      newStatus = decision === 'approved' ? 'brief_approved' : 'brief_rejected'
    } else {
      if (decision === 'approved') newStatus = 'ready_to_publish'
      else if (decision === 'revision_requested') newStatus = 'revision_requested'
      else newStatus = 'draft_rejected' // terminal — removed from active pipeline
    }

    // 3. Build update payload — generate slug on brief approval if not already set
    const updatePayload: Record<string, unknown> = {
      status: newStatus,
      decision_note: note ?? null,
      decision_tags: tags ?? null,
      decided_at: now,
      updated_at: now,
    }

    if (stage === 'brief' && decision === 'approved' && !item.slug) {
      const baseSlug = generateArticleSlug(item.topic, item.angle)
      // Check for uniqueness
      const { data: existing } = await supabase
        .from('content_items')
        .select('id')
        .eq('slug', baseSlug)
        .single()
      updatePayload.slug = existing ? makeSlugUnique(baseSlug) : baseSlug
    }

    // 3. Update content item
    await supabase
      .from('content_items')
      .update(updatePayload)
      .eq('id', item_id)

    // 4. Add to editorial_examples pool
    // Only record final decisions (approved/rejected), not revision_requested
    if (decision !== 'revision_requested') {
      const contentText = stage === 'brief' ? item.brief_text : (item.edited_draft_text ?? item.draft_text)
      if (contentText) {
        await supabase.from('editorial_examples').insert({
          content_item_id: item_id,
          stage,
          outcome: decision,
          content_text: contentText,
          decision_note: note ?? null,
          decision_tags: tags ?? null,
        })
      }
    }

    // 5. Trigger draft generation on brief approval
    // Resolve base URL: prefer NEXT_PUBLIC_APP_URL, fall back to VERCEL_URL (auto-set by Vercel),
    // then localhost for local dev. This ensures the fetch URL is always valid.
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/$/, '')
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    let nextAction = null
    if (stage === 'brief' && decision === 'approved') {
      nextAction = 'draft_generation_triggered'
      // Use after() so the fetch is dispatched after the response is sent.
      // generate-draft runs on Edge runtime (30s on Hobby) so it has time to complete.
      // Even if this after() is killed at 10s, the Edge function runs independently.
      after(async () => {
        try {
          await fetch(`${baseUrl}/api/generate-draft`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.CRON_SECRET}`,
            },
            body: JSON.stringify({ item_id }),
          })
        } catch (err) {
          console.error('[decisions] after() generate-draft fetch failed:', err)
        }
      })
      await sendSlackNotification({ event: 'brief_approved', topic: item.topic })
    }

    // 6. Trigger revision draft on revision_requested
    if (stage === 'draft' && decision === 'revision_requested') {
      after(async () => {
        try {
          await fetch(`${baseUrl}/api/generate-draft`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.CRON_SECRET}`,
            },
            body: JSON.stringify({ item_id, revision_note: note }),
          })
        } catch (err) {
          console.error('[decisions] after() revision fetch failed:', err)
        }
      })
    }

    // 7. Check if we should propose a context doc update
    if (stage === 'draft' && decision === 'approved') {
      await checkAndProposeContextDocUpdate(supabase)
    }

    // Fetch updated item
    const { data: updatedItem } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', item_id)
      .single()

    return NextResponse.json({ item: updatedItem, next_action: nextAction })
  } catch (error) {
    console.error('[decisions] Error:', error)
    return NextResponse.json({ error: 'Decision logging failed' }, { status: 500 })
  }
}

async function checkAndProposeContextDocUpdate(supabase: ReturnType<typeof createServiceClient>) {
  // Count draft approvals in last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { count: recentDecisions } = await supabase
    .from('editorial_examples')
    .select('id', { count: 'exact' })
    .eq('stage', 'draft')
    .eq('outcome', 'approved')
    .gte('created_at', thirtyDaysAgo)

  if ((recentDecisions ?? 0) < PROPOSAL_THRESHOLD_DECISIONS) return

  // Collect inferred patterns from recent items
  const { data: itemsWithPatterns } = await supabase
    .from('content_items')
    .select('id, inferred_patterns')
    .not('inferred_patterns', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(10)

  const allPatterns: string[] = []
  const sourceIds: string[] = []

  for (const item of itemsWithPatterns ?? []) {
    if (Array.isArray(item.inferred_patterns)) {
      allPatterns.push(...item.inferred_patterns)
      sourceIds.push(item.id)
    }
  }

  if (allPatterns.length < PROPOSAL_THRESHOLD_PATTERNS) return

  // Skip if there's already a pending proposal
  const { count: pendingProposals } = await supabase
    .from('context_doc_proposals')
    .select('id', { count: 'exact' })
    .eq('status', 'pending')

  if ((pendingProposals ?? 0) > 0) return

  const { data: contextDoc } = await supabase
    .from('context_doc')
    .select('content')
    .eq('is_active', true)
    .single()

  if (!contextDoc) return

  try {
    const proposal = await proposeContextDocUpdate({
      currentDocContent: contextDoc.content,
      patterns: allPatterns.slice(0, 10),
      sourceItemIds: sourceIds,
    })

    await supabase.from('context_doc_proposals').insert({
      proposed_addition: proposal.proposed_addition,
      rationale: proposal.rationale,
      source_patterns: allPatterns.slice(0, 10),
      status: 'pending',
    })

    await sendSlackNotification({ event: 'context_doc_proposal' })
  } catch (e) {
    console.error('[decisions] Proposal generation failed:', e)
  }
}
