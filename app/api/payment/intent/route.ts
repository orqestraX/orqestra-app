import { NextRequest, NextResponse } from 'next/server'
import { requireOperator } from '@/lib/session'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'
import { createPaymentIntent } from '@/lib/payment'

export async function POST(req: NextRequest) {
  const operator = await requireOperator()
  const { order_id, method } = await req.json()

  if (!order_id || !method) {
    return NextResponse.json({ error: 'Missing order_id or method' }, { status: 400 })
  }

  const supabase = await createServerSupabaseClient()
  const { data: order, error } = await supabase
    .from('orders')
    .select('id, total, buyer_id, status')
    .eq('id', order_id)
    .single()

  if (error || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (order.buyer_id !== operator.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (order.status !== 'confirmed') return NextResponse.json({ error: 'Order must be confirmed first' }, { status: 422 })

  const result = await createPaymentIntent({
    orderId: order_id,
    amount: Number(order.total),
    buyerOperatorId: operator.id,
    method,
  })

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })
  return NextResponse.json({ intentId: result.intentId })
}
