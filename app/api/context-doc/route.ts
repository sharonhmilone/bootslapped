import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// GET: Return active context doc + version history
export async function GET() {
  const supabase = createServiceClient()

  const [activeRes, historyRes] = await Promise.all([
    supabase
      .from('context_doc')
      .select('*')
      .eq('is_active', true)
      .single(),
    supabase
      .from('context_doc')
      .select('*')
      .order('version', { ascending: false })
      .limit(20),
  ])

  if (activeRes.error) {
    return NextResponse.json({ error: 'No active context doc found' }, { status: 404 })
  }

  return NextResponse.json({
    active: activeRes.data,
    history: historyRes.data ?? [],
  })
}

// PUT: Save new version
export async function PUT(request: Request) {
  const supabase = createServiceClient()

  try {
    const body = await request.json()
    const { content, change_note } = body

    if (!content || !change_note) {
      return NextResponse.json({ error: 'content and change_note required' }, { status: 400 })
    }

    // Get current version number
    const { data: currentDoc } = await supabase
      .from('context_doc')
      .select('version')
      .eq('is_active', true)
      .single()

    const nextVersion = (currentDoc?.version ?? 0) + 1

    // Deactivate current
    await supabase
      .from('context_doc')
      .update({ is_active: false })
      .eq('is_active', true)

    // Insert new version
    const { data: newDoc, error } = await supabase
      .from('context_doc')
      .insert({
        content,
        version: nextVersion,
        is_active: true,
        change_note,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to save context doc' }, { status: 500 })
    }

    return NextResponse.json({ doc: newDoc })
  } catch (error) {
    console.error('[context-doc PUT] Error:', error)
    return NextResponse.json({ error: 'Failed to update context doc' }, { status: 500 })
  }
}
