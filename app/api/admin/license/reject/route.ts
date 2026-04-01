import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// POST /api/admin/license/reject
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const formData = await req.formData()
  const id = formData.get('id') as string
  const operatorId = formData.get('operator_id') as string
  const reason = formData.get('reason') as string || 'License could not be verified with NMRLD records.'

  const admin = createAdminClient()

  await admin.from('license_verifications').update({
    status: 'invalid',
    reviewed_at: new Date().toISOString(),
    reviewed_by: user.id,
    rejection_reason: reason,
  }).eq('id', id)

  await admin.from('operators').update({
    license_status: 'invalid',
    account_status: 'rejected',
  }).eq('id', operatorId)

  await admin.from('audit_log').insert({
    actor_id: user.id,
    action: 'license.rejected',
    resource_id: operatorId,
    metadata: { verification_id: id, reason },
  })

  return NextResponse.redirect(new URL('/admin/licenses', req.url))
}