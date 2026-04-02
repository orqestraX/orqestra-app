import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'

const VALID_CATEGORIES = ['flower', 'concentrates', 'pre_rolls', 'edibles', 'extracts', 'trim', 'equipment', 'other'] as const
type ProductCategory = typeof VALID_CATEGORIES[number]

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient()

  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const operatorId = searchParams.get('operator_id')
  const mine = searchParams.get('mine')

  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('listings')
    .select('id, title, category, price_per_unit, unit, available_qty, min_order_qty, status, strain_name, thc_pct, cbd_pct, description, operator_id, created_at, operators(business_name, city, operator_type)')
    .order('created_at', { ascending: false })

  if (mine === 'true' && user) {
    const { data: op } = await supabase.from('operators').select('id').eq('user_id', user.id).single()
    if (op) query = query.eq('operator_id', op.id)
    else return NextResponse.json({ listings: [] })
  } else {
    query = query.eq('status', 'active')
  }

  if (category) query = query.eq('category', category)
  if (operatorId) query = query.eq('operator_id', operatorId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ listings: data ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: operator } = await supabase
    .from('operators')
    .select('id, operator_type, account_status')
    .eq('user_id', user.id)
    .single()

  if (!operator) return NextResponse.json({ error: 'Operator profile not found' }, { status: 404 })
  if (operator.account_status !== 'verified') return NextResponse.json({ error: 'Account must be verified to create listings' }, { status: 403 })
  if (operator.operator_type === 'dispensary') return NextResponse.json({ error: 'Dispensaries cannot create listings' }, { status: 403 })

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { title, category, price_per_unit, unit, available_qty, min_order_qty, description, strain_name, thc_pct, cbd_pct } = body

  if (!title || !category || price_per_unit == null || !unit || available_qty == null) {
    return NextResponse.json({ error: 'title, category, price_per_unit, unit, and available_qty are required' }, { status: 400 })
  }
  if (!(VALID_CATEGORIES as readonly string[]).includes(category as string)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: listing, error: insertError } = await admin
    .from('listings')
    .insert({
      operator_id: operator.id,
      title: String(title).trim(),
      category: category as ProductCategory,
      price_per_unit: Number(price_per_unit),
      unit: String(unit).trim(),
      available_qty: Number(available_qty),
      min_order_qty: min_order_qty ? Number(min_order_qty) : 1,
      description: description ? String(description).trim() : null,
      strain_name: strain_name ? String(strain_name).trim() : null,
      thc_pct: thc_pct != null ? Number(thc_pct) : null,
      cbd_pct: cbd_pct != null ? Number(cbd_pct) : null,
      status: 'active',
    })
    .select()
    .single()

  if (insertError) {
    console.error('[POST /api/listings]', insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ listing }, { status: 201 })
}
