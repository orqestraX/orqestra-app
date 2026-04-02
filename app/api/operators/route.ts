import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'

const VALID_TYPES = ['cultivator', 'manufacturer', 'dispensary', 'courier'] as const
type OperatorType = typeof VALID_TYPES[number]

export async function POST(req: NextRequest) {
  // 1. Verify session
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Guard: one profile per user
  const { data: existing } = await supabase
    .from('operators')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (existing) {
    return NextResponse.json({ error: 'Profile already exists' }, { status: 409 })
  }

  // 3. Parse + validate body
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { operator_type, business_name, contact_name, phone, city, nm_license_number } = body

  if (!operator_type || !business_name || !contact_name) {
    return NextResponse.json(
      { error: 'operator_type, business_name, and contact_name are required' },
      { status: 400 }
    )
  }
  if (!(VALID_TYPES as readonly string[]).includes(operator_type as string)) {
    return NextResponse.json({ error: 'Invalid operator_type' }, { status: 400 })
  }

  // 4. Insert via admin client (bypasses missing INSERT RLS policy)
  const admin = createAdminClient()
  const { data: operator, error: insertError } = await admin
    .from('operators')
    .insert({
      user_id: user.id,
      email: user.email,
      operator_type: operator_type as OperatorType,
      business_name: String(business_name).trim(),
      contact_name: String(contact_name).trim(),
      phone: phone ? String(phone).trim() : null,
      city: city ? String(city).trim() : null,
      nm_license_number: nm_license_number ? String(nm_license_number).trim() : null,
      account_status: 'pending',
    })
    .select()
    .single()

  if (insertError) {
    console.error('[POST /api/operators]', insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ operator }, { status: 201 })
}
