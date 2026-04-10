import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { sendSlackNotification } from '@/lib/slack/notify'

export const maxDuration = 30

export async function POST(request: Request) {
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

    const { data: item, error: itemError } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', item_id)
      .single()

    if (itemError || !item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    if (!item.published_at) {
      return NextResponse.json({ error: 'Item is not published' }, { status: 400 })
    }

    const { data: updatedItem, error: updateError } = await supabase
      .from('content_items')
      .update({
        published_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item_id)
      .select()
      .single()

    if (updateError) {
      console.error('[unpublish] Update error:', updateError)
      return NextResponse.json({ error: 'Failed to unpublish' }, { status: 500 })
    }

    await sendSlackNotification({ event: 'article_unpublished', topic: item.topic })

    return NextResponse.json({ item: updatedItem })
  } catch (error) {
    console.error('[unpublish] Error:', error)
    return NextResponse.json({ error: 'Unpublish failed' }, { status: 500 })
  }
}
