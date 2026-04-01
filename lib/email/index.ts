import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Orqestra <noreply@orqestrax.com>'

export type EmailPayload = {
  to: string
  subject: string
  html: string
}

export async function sendEmail(payload: EmailPayload) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping email send')
    return { ok: false, reason: 'no_api_key' }
  }
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    })
    if (error) {
      console.error('[email] Resend error:', error)
      return { ok: false, reason: error.message }
    }
    return { ok: true, id: data?.id }
  } catch (err) {
    console.error('[email] Unexpected error:', err)
    return { ok: false, reason: 'unexpected' }
  }
}
