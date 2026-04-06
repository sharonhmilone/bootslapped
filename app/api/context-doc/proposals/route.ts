import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// GET: Return pending proposals
export async function GET() {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('context_doc_proposals')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 })
  }

  return NextResponse.json({ proposals: data })
}

// POST: Approve or reject a proposal
export async function POST(request: Request) {
  const supabase = createServiceClient()

  try {
    const body = await request.json()
    const { proposal_id, action } = body // action: 'approve' | 'reject'

    if (!proposal_id || !action) {
      return NextResponse.json({ error: 'proposal_id and action required' }, { status: 400 })
    }

    if (action === 'approve') {
      // Get the proposal
      const { data: proposal } = await supabase
        .from('context_doc_proposals')
        .select('*')
        .eq('id', proposal_id)
        .single()

      if (!proposal) {
        return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
      }

      // Get current doc
      const { data: currentDoc } = await supabase
        .from('context_doc')
        .select('*')
        .eq('is_active', true)
        .single()

      if (currentDoc) {
        // Append proposed addition to context doc
        const newContent = `${currentDoc.content}\n\n---\n\n${proposal.proposed_addition}`
        const nextVersion = currentDoc.version + 1

        // Deactivate current
        await supabase
          .from('context_doc')
          .update({ is_active: false })
          .eq('is_active', true)

        // Insert new version
        await supabase.from('context_doc').insert({
          content: newContent,
          version: nextVersion,
          is_active: true,
          change_note: `Approved proposal: ${proposal.rationale ?? 'Pattern-based addition'}`,
        })
      }

      // Mark proposal as approved
      await supabase
        .from('context_doc_proposals')
        .update({ status: 'approved' })
        .eq('id', proposal_id)
    } else if (action === 'reject') {
      await supabase
        .from('context_doc_proposals')
        .update({ status: 'rejected' })
        .eq('id', proposal_id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[proposals] Error:', error)
    return NextResponse.json({ error: 'Failed to process proposal' }, { status: 500 })
  }
}
