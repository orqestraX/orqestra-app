import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'

interface ListingRow {
  id: string
  title: string
  category: string
  price_per_unit: number
  unit: string
  available_qty: number
  min_order_qty: number
  status: string
  operator_id: string
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: buyer } = await supabase
    .from('operators')
    .select('id, operator_type, account_status')
    .eq('user_id', user.id)
    .single()

  if (!buyer) return NextResponse.json({ error: 'Operator profile not found' }, { status: 404 })
  if (buyer.account_status !== 'verified') {
    return NextResponse.json({ error: 'Account must be verified to place orders' }, { status: 403 })
  }

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { listing_id, quantity } = body
  if (!listing_id || quantity == null) {
    return NextResponse.json({ error: 'listing_id and quantity are required' }, { status: 400 })
  }

  const { data: listingData } = await supabase
    .from('listings')
    .select('id, title, category, price_per_unit, unit, available_qty, min_order_qty, status, operator_id')
    .eq('id', String(listing_id))
    .single()

  if (!listingData) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })

  const listing = listingData as ListingRow
  if (listing.status !== 'active') return NextResponse.json({ error: 'Listing is not available' }, { status: 409 })
  if (listing.operator_id === buyer.id) return NextResponse.json({ error: 'Cannot order your own listing' }, { status: 400 })

  const qty = Number(quantity)
  if (isNaN(qty) || qty <= 0) return NextResponse.json({ error: 'Quantity must be a positive number' }, { status: 400 })
  if (qty < listing.min_order_qty) {
    return NextResponse.json({ error: `Minimum order is ${listing.min_order_qty} ${listing.unit}` }, { status: 400 })
  }
  if (qty > listing.available_qty) {
    return NextResponse.json({ error: `Only ${listing.available_qty} ${listing.unit} available` }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: order, error: insertError } = await admin
    .from('orders')
    .insert({
      buyer_id: buyer.id,
      seller_id: listing.operator_id,
      listing_id: listing.id,
      product_name: listing.title,
      product_category: listing.category,
      unit: listing.unit,
      quantity: qty,
      unit_price: listing.price_per_unit,
      status: 'pending',
    })
    .select()
    .single()

  if (insertError) {
    console.error('[POST /api/orders]', insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ order }, { status: 201 })
}
