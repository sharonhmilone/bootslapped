import type { SlackEventType } from '@/types'

const WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

interface NotifyOptions {
  event: SlackEventType
  topic?: string
  count?: number
  daysStalled?: number
}

export async function sendSlackNotification(options: NotifyOptions): Promise<void> {
  if (!WEBHOOK_URL) {
    console.warn('[Slack] SLACK_WEBHOOK_URL not set — skipping notification')
    return
  }

  const text = buildMessage(options)

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      console.error(`[Slack] Notification failed: ${response.status}`)
    }
  } catch (error) {
    console.error('[Slack] Failed to send notification:', error)
  }
}

function buildMessage(options: NotifyOptions): string {
  switch (options.event) {
    case 'briefs_generated':
      return `${options.count ?? 3} new briefs are ready for review.`

    case 'brief_approved':
      return `Draft in production: ${options.topic ?? 'untitled'}`

    case 'draft_ready':
      return `New draft ready for review: ${options.topic ?? 'untitled'}`

    case 'item_stalled':
      return `This piece has been waiting ${options.daysStalled ?? '?'} days: ${options.topic ?? 'untitled'}`

    case 'context_doc_proposal':
      return `New editorial pattern detected. Proposed update to context doc ready for review.`

    default:
      return `Bootslapped system notification`
  }
}
