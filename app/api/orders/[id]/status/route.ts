import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase/server'
import { requireOperator } from '@/lib/session'
import { sendEmail } from '@/lib/email'
import { orderStatusEmail } from '@/lib/email/templates'
import { sendPushNotification } from '@/lib/push'

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending:    ['confirmed', 'cancelled'],
  confirmed:  ['in_transit', 'cancelled'],
  in_transit: ['delivered', 'disputed'],
  delivered:  [],
  cancelled:  [],
  disputed:   ['delivered', 'cancelled'],
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const operator = await requireOperator()
  const { status } = await req.json()
  if (!status) return NextResponse.json({ error: 'Missing status' }, { status: 400 })

  const supabase = await createServerSupabaseClient()
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('id, status, total, quantity, buyer_id, seller_id, listing:listings(title)')
    .eq('id', params.id)
    .single()

  if (fetchError || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const allowed = VALID_TRANSITIONS[order.status] ?? []
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: `Cannot transition from ${order.status} to ${status}` }, { status: 422 })
  }

  // Only buyer or seller can update
  const isBuyer = operator.id === order.buyer_id
  const isSeller = operator.id === order.seller_id
  if (!isBuyer && !isSeller) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', params.id)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  // Insert order event
  await supabase.from('order_events').insert({
    order_id: params.id,
    status,
    actor_id: operator.id,
    note: `Status updated to ${status}`,
  })

  // Notify the OTHER party
  const recipientId = isBuyer ? order.seller_id : order.buyer_id
  const adminClient = createAdminClient()

  const { data: recipient } = await adminClient
    .from('operators')
    .select('business_name, email')
    .eq('id', recipientId)
    .single()

  const listingTitle = Array.isArray(order.listing) 
    ? order.listing[0]?.title ?? 'Order'
    : (order.listing as { title?: string } | null)?.title ?? 'Order'

  if (recipient?.email) {
    await sendEmail({
      to: recipient.email,
      subject: `Order update: ${listingTitle} — Orqestra`,
      html: orderStatusEmail({
        businessName: recipient.business_name,
        orderId: params.id,
        productTitle: listingTitle,
        status,
        quantity: order.quantity,
        total: Number(order.total),
      }),
    })
  }

  // Push notification
  await sendPushNotification({
    operatorId: recipientId,
    title: getNotifTitle(status),
    body: `${listingTitle} — ${status.replace('_', ' ')}`,
    data: { orderId: params.id, status },
  })

  return NextResponse.json({ ok: true })
}

function getNotifTitle(status: string): string {
  const titles: Record<string, string> = {
    confirmed: '✅ Order Confirmed',
    in_transit: '🚛 Order Shipped',
    delivered: '📦 Order Delivered',
    cancelled: '🚫 Order Cancelled',
    disputed: '⚠️ Order Disputed',
  }
  return titles[status] ?? '📋 Order Updated'
}
