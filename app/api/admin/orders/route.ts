import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/session'

export async function GET() {
  await requireAdmin()
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, status, total, platform_fee, created_at,
      buyer:operators!orders_buyer_id_fkey(business_name, email),
      seller:operators!orders_seller_id_fkey(business_name, email),
      listing:listings(title, category)
    `)
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ orders: data })
}
