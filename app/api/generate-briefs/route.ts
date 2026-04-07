import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { generateBriefs } from '@/lib/anthropic/generate-briefs'
import { sendSlackNotification } from '@/lib/slack/notify'

export const maxDuration = 60

export async function POST(request: Request) {
  // Auth check via SSR client (reads session cookie)
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  try {

    const body = await request.json().catch(() => ({}))
    const count = body.count ?? 1

    // 1. Fetch active context doc
    const { data: contextDoc, error: contextError } = await supabase
      .from('context_doc')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (contextError || !contextDoc) {
      return NextResponse.json({ error: 'No active context doc found' }, { status: 400 })
    }

    // 2. Fetch examples (approved and rejected briefs)
    const [approvedRes, rejectedRes] = await Promise.all([
      supabase
        .from('editorial_examples')
        .select('*')
        .eq('stage', 'brief')
        .eq('outcome', 'approved')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('editorial_examples')
        .select('*')
        .eq('stage', 'brief')
        .in('outcome', ['rejected', 'revision'])
        .order('created_at', { ascending: false })
        .limit(3),
    ])

    // 3. Generate briefs via Anthropic
    const briefs = await generateBriefs({
      contextDoc,
      approvedExamples: approvedRes.data ?? [],
      rejectedExamples: rejectedRes.data ?? [],
      count,
    })

    // 4. Insert into content_items — only schema fields
    const rows = briefs.map((brief) => ({
      topic: brief.topic,
      angle: brief.angle,
      format: brief.format,
      target_audience: brief.target_audience,
      brief_text: brief.brief_text,
      status: 'brief_pending',
    }))

    const { data: insertedItems, error: insertError } = await supabase
      .from('content_items')
      .insert(rows)
      .select()

    if (insertError) {
      console.error('[generate-briefs] Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save briefs' }, { status: 500 })
    }

    // 5. Slack notification
    await sendSlackNotification({ event: 'briefs_generated', count })

    return NextResponse.json({ items: insertedItems })
  } catch (error) {
    console.error('[generate-briefs] Error:', error)
    return NextResponse.json({ error: 'Brief generation failed' }, { status: 500 })
  }
}
