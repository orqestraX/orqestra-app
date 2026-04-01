// Orqestra Payment Layer
// Cannabis-friendly payment processing via ACH/bank transfer
// Primary processor: Paytron (paytron.io) - cannabis-licensed
// Fallback: Manual ACH via operator bank details on file

export type PaymentMethod = 'ach' | 'wire' | 'cash_equivalent'

export type PaymentIntent = {
  id: string
  orderId: string
  amount: number          // in cents
  platformFee: number     // 3% of amount
  method: PaymentMethod
  status: 'pending' | 'processing' | 'completed' | 'failed'
  externalRef?: string    // Paytron payment ID
  createdAt: string
}

// Create a payment intent for an order
export async function createPaymentIntent(opts: {
  orderId: string
  amount: number
  buyerOperatorId: string
  method: PaymentMethod
}): Promise<{ ok: true; intentId: string } | { ok: false; error: string }> {
  const platformFee = Math.round(opts.amount * 0.03)

  // In production: call Paytron API here
  // POST https://api.paytron.io/v1/payments with cannabis business credentials
  // For now: record in Supabase and return pending status
  const { createAdminClient } = await import('@/lib/supabase/server')
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('payment_intents')
    .insert({
      order_id: opts.orderId,
      amount: opts.amount,
      platform_fee: platformFee,
      method: opts.method,
      status: 'pending',
      buyer_operator_id: opts.buyerOperatorId,
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }
  return { ok: true, intentId: data!.id }
}

// Get ACH instructions for an operator
export function getAchInstructions(amount: number) {
  return {
    bankName: 'First Internet Bank of Indiana',
    routingNumber: '074014187',
    accountType: 'Checking',
    memo: 'Orqestra Platform Payment',
    amountDue: (amount / 100).toFixed(2),
    platformFee: (amount * 0.03 / 100).toFixed(2),
    netAmount: (amount * 0.97 / 100).toFixed(2),
    instructions: [
      'Initiate ACH transfer from your business banking portal',
      'Use routing and account numbers above',
      'Include order ID in the memo field',
      'Transfer will clear in 1-3 business days',
      'Funds released to seller upon delivery confirmation',
    ],
  }
}
