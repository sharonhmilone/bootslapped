import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET: return server-side config status the client can't read directly
export async function GET() {
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  return NextResponse.json({
    slack_configured: !!process.env.SLACK_WEBHOOK_URL,
    cron_secret_configured: !!process.env.CRON_SECRET,
    anthropic_configured: !!process.env.ANTHROPIC_API_KEY,
  })
}
