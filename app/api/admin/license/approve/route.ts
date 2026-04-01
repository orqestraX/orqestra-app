import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// POST /api/admin/license/approve
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const formData = await req.formData()
  const id = formData.get('id') as string
  const operatorId = formData.get('operator_id') as string

  const admin = createAdminClient()

  // Update verification record
  await admin.from('license_verifications').update({
    status: 'verified',
    reviewed_at: new Date().toISOString(),
    reviewed_by: user.id,
  }).eq('id', id)

  // Activate the operator account
  await admin.from('operators').update({
    license_status: 'verified',
    license_verified_at: new Date().toISOString(),
    account_status: 'verified',
    approved_at: new Date().toISOString(),
    approved_by: user.id,
  }).eq('id', operatorId)

  // Audit
  await admin.from('audit_log').insert({
    actor_id: user.id,
    action: 'license.approved',
    resource_id: operatorId,
    metadata: { verification_id: id },
  })

  return NextResponse.redirect(new URL('/admin/licenses', req.url))
}