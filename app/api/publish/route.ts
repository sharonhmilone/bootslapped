import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { sendSlackNotification } from '@/lib/slack/notify'

// Vercel Pro: short operation, no AI call needed
export const maxDuration = 30

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

    // Fetch item — must be in ready_to_publish to publish
    const { data: item, error: itemError } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', item_id)
      .single()

    if (itemError || !item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    if (item.status !== 'ready_to_publish') {
      return NextResponse.json(
        { error: `Cannot publish from status: ${item.status}` },
        { status: 400 }
      )
    }

    if (!item.slug) {
      return NextResponse.json(
        { error: 'Item has no slug — cannot publish without a URL' },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    const { data: updatedItem, error: updateError } = await supabase
      .from('content_items')
      .update({
        published_at: now,
        updated_at: now,
      })
      .eq('id', item_id)
      .select()
      .single()

    if (updateError) {
      console.error('[publish] Update error:', updateError)
      return NextResponse.json({ error: 'Failed to publish' }, { status: 500 })
    }

    await sendSlackNotification({ event: 'article_published', topic: item.topic })

    return NextResponse.json({ item: updatedItem })
  } catch (error) {
    console.error('[publish] Error:', error)
    return NextResponse.json({ error: 'Publish failed' }, { status: 500 })
  }
}
