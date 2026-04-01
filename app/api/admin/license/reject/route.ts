import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/session'
import { sendEmail } from '@/lib/email'
import { licenseRejectedEmail } from '@/lib/email/templates'

export async function POST(req: NextRequest) {
  await requireAdmin()
  const { operator_id, verification_id, reason } = await req.json()
  if (!operator_id || !verification_id || !reason) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const supabaseServer = await createServerSupabaseClient()
  const { data: { user } } = await supabaseServer.auth.getUser()

  const [{ error: verError }, { error: opError, data: operator }] = await Promise.all([
    supabase
      .from('license_verifications')
      .update({ status: 'rejected', rejection_reason: reason, reviewed_at: new Date().toISOString(), reviewed_by: user?.id ?? null })
      .eq('id', verification_id),
    supabase
      .from('operators')
      .update({ license_status: 'rejected' })
      .eq('id', operator_id)
      .select('business_name, email')
      .single(),
  ])

  if (verError || opError) {
    return NextResponse.json({ error: verError?.message ?? opError?.message }, { status: 500 })
  }

  await supabase.from('audit_log').insert({
    action: 'license_rejected',
    target_id: operator_id,
    actor_id: user?.id ?? null,
    metadata: { verification_id, reason },
  })

  if (operator?.email) {
    await sendEmail({
      to: operator.email,
      subject: 'Action required: License verification issue — Orqestra',
      html: licenseRejectedEmail({ businessName: operator.business_name, reason }),
    })
  }

  return NextResponse.json({ ok: true })
}
