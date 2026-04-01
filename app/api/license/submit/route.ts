import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { licenseVerifSchema, validateInput } from '@/lib/validations'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// POST /api/license/submit — operator submits their license for review
export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Get operator
    const { data: operator, error: opError } = await supabase
      .from('operators')
      .select('id, license_status')
      .eq('user_id', user.id)
      .single()

    if (opError || !operator) {
      return NextResponse.json({ error: 'Operator profile not found' }, { status: 404 })
    }

    // 3. Block if already verified
    if (operator.license_status === 'verified') {
      return NextResponse.json({ error: 'License already verified' }, { status: 409 })
    }

    // 4. Validate input
    const body = await req.json()
    const { data, error } = validateInput(licenseVerifSchema, body)
    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    // 5. Insert into verification queue
    const { error: insertError } = await supabase
      .from('license_verifications')
      .insert({
        operator_id: operator.id,
        license_number: data.license_number,
        notes: data.notes,
        status: 'pending',
      })

    if (insertError) {
      console.error('License submission error:', insertError.message)
      return NextResponse.json({ error: 'Failed to submit license' }, { status: 500 })
    }

    // 6. Audit log
    const adminClient = createAdminClient()
    await adminClient.from('audit_log').insert({
      actor_id: user.id,
      action: 'license.submitted',
      resource: 'license_verifications',
      metadata: { license_number: data.license_number },
    })

    return NextResponse.json({ success: true, message: 'License submitted for review. You will be notified within 1-2 business days.' })

  } catch (err) {
    console.error('License API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}