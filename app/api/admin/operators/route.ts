import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/session'

export async function GET() {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('operators')
    .select('id, business_name, operator_type, account_status, license_status, email, nm_license_number, created_at')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ operators: data })
}

export async function PATCH(req: NextRequest) {
  await requireAdmin()
  const { id, account_status } = await req.json()
  if (!id || !account_status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const validStatuses = ['active', 'pending', 'suspended', 'rejected']
  if (!validStatuses.includes(account_status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const supabaseServer = await import('@/lib/supabase/server').then(m => m.createServerSupabaseClient())
  const { data: { user } } = await supabaseServer.auth.getUser()

  const { error } = await supabase
    .from('operators')
    .update({ account_status })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Audit log
  await supabase.from('audit_log').insert({
    action: `operator_status_${account_status}`,
    target_id: id,
    actor_id: user?.id,
    metadata: { account_status },
  })

  return NextResponse.json({ ok: true })
}
