import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { generateBriefs } from '@/lib/anthropic/generate-briefs'
import { sendSlackNotification } from '@/lib/slack/notify'

// Runs every Monday at 8am UTC via Vercel Cron
// Protected by CRON_SECRET env var
// Vercel Pro: 60s covers brief generation (Sonnet, short output)
export const maxDuration = 60

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = createServiceClient()

  try {
    // Check for stale items and notify
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    const { data: staleItems } = await supabase
      .from('content_items')
      .select('id, topic, status, updated_at')
      .not('status', 'in', '("ready_to_publish","brief_rejected")')
      .lt('updated_at', fiveDaysAgo)

    for (const item of staleItems ?? []) {
      const daysStalled = Math.floor(
        (Date.now() - new Date(item.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      )
      await sendSlackNotification({
        event: 'item_stalled',
        topic: item.topic,
        daysStalled,
      })
    }

    // Fetch active context doc
    const { data: contextDoc } = await supabase
      .from('context_doc')
      .select('*')
      .eq('is_active', true)
      .single()

    if (!contextDoc) {
      return NextResponse.json({ error: 'No active context doc' }, { status: 400 })
    }

    // Fetch examples
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

    const briefs = await generateBriefs({
      contextDoc,
      approvedExamples: approvedRes.data ?? [],
      rejectedExamples: rejectedRes.data ?? [],
      count: 1,
    })

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
      console.error('[cron/generate-briefs] Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save briefs' }, { status: 500 })
    }

    await sendSlackNotification({ event: 'briefs_generated', count: 1 })

    return NextResponse.json({ success: true, items: insertedItems })
  } catch (error) {
    console.error('[cron/generate-briefs] Error:', error)
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 })
  }
}
