import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const maxDuration = 15

// GET /api/affiliate-programs — list all programs
export async function GET() {
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('affiliate_programs')
    .select('*, tool:tool_id(id, name, category)')
    .order('topic_domain')
    .order('program_name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ programs: data ?? [] })
}

// POST /api/affiliate-programs — create new program
export async function POST(request: Request) {
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const body = await request.json()
  const {
    program_name,
    tool_id,
    topic_domain,
    commission_type,
    commission_rate,
    signup_url,
    enrollment_status,
    notes,
  } = body

  if (!program_name || !topic_domain || !commission_type) {
    return NextResponse.json(
      { error: 'program_name, topic_domain, and commission_type are required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('affiliate_programs')
    .insert({
      program_name,
      tool_id: tool_id || null,
      topic_domain,
      commission_type,
      commission_rate: commission_rate || null,
      signup_url: signup_url || null,
      enrollment_status: enrollment_status ?? 'not_enrolled',
      notes: notes || null,
    })
    .select('*, tool:tool_id(id, name, category)')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A program with that name already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ program: data }, { status: 201 })
}
