import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('listings')
    .select('id, title, category, price_per_unit, unit, available_qty, min_order_qty, status, strain_name, thc_pct, cbd_pct, description, operator_id, created_at, operators(business_name, city, operator_type)')
    .eq('id', params.id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  return NextResponse.json({ listing: data })
}
