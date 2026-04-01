const BASE = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#e5e5e5;border-radius:12px;overflow:hidden;">
    <div style="background:#16a34a;padding:24px 32px;">
      <h1 style="margin:0;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.5px;">🌿 Orqestra</h1>
      <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.75);">New Mexico Cannabis Operating System</p>
    </div>
    <div style="padding:32px;">
      {{BODY}}
    </div>
    <div style="padding:16px 32px;border-top:1px solid #262626;font-size:12px;color:#666;">
      Orqestra · New Mexico · <a href="https://orqestrax.com" style="color:#16a34a;">orqestrax.com</a>
    </div>
  </div>
`

function layout(body: string) {
  return BASE.replace('{{BODY}}', body)
}

export function welcomeEmail(opts: { businessName: string; operatorType: string }) {
  return layout(`
    <h2 style="margin:0 0 8px;font-size:20px;color:#fff;">Welcome to Orqestra, ${opts.businessName}!</h2>
    <p style="color:#999;margin:0 0 24px;font-size:15px;">Your <strong style="color:#e5e5e5;">${opts.operatorType}</strong> account has been created. Here's what happens next:</p>
    <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:24px;">
      <div style="margin-bottom:16px;display:flex;align-items:flex-start;gap:12px;">
        <span style="background:#16a34a;color:#fff;border-radius:50%;width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">1</span>
        <div><strong style="color:#fff;">Submit your NM license</strong><br/><span style="color:#999;font-size:13px;">Upload your New Mexico Cannabis Control Division license for verification.</span></div>
      </div>
      <div style="margin-bottom:16px;display:flex;align-items:flex-start;gap:12px;">
        <span style="background:#16a34a;color:#fff;border-radius:50%;width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">2</span>
        <div><strong style="color:#fff;">Wait for approval</strong><br/><span style="color:#999;font-size:13px;">Our compliance team reviews your license within 1-2 business days.</span></div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <span style="background:#16a34a;color:#fff;border-radius:50%;width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">3</span>
        <div><strong style="color:#fff;">Start trading</strong><br/><span style="color:#999;font-size:13px;">Access the full marketplace, place orders, and grow your business.</span></div>
      </div>
    </div>
    <a href="https://orqestrax.com/onboarding" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Complete your profile →</a>
  `)
}

export function licenseApprovedEmail(opts: { businessName: string }) {
  return layout(`
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;margin-bottom:8px;">✅</div>
      <h2 style="margin:0 0 8px;font-size:20px;color:#fff;">License Verified!</h2>
      <p style="color:#999;margin:0;font-size:15px;">Great news, ${opts.businessName} — your NM cannabis license has been verified.</p>
    </div>
    <div style="background:#14532d;border:1px solid #16a34a;border-radius:8px;padding:20px;margin-bottom:24px;text-align:center;">
      <p style="margin:0;color:#86efac;font-size:15px;">Your account is now <strong>fully active</strong>. You have access to the complete Orqestra marketplace.</p>
    </div>
    <a href="https://orqestrax.com/marketplace" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Browse the marketplace →</a>
  `)
}

export function licenseRejectedEmail(opts: { businessName: string; reason: string }) {
  return layout(`
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;margin-bottom:8px;">❌</div>
      <h2 style="margin:0 0 8px;font-size:20px;color:#fff;">License Verification Issue</h2>
      <p style="color:#999;margin:0;font-size:15px;">We were unable to verify your license for ${opts.businessName}.</p>
    </div>
    <div style="background:#450a0a;border:1px solid #dc2626;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;color:#fca5a5;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Reason</p>
      <p style="margin:0;color:#fecaca;font-size:15px;">${opts.reason}</p>
    </div>
    <p style="color:#999;font-size:14px;margin-bottom:24px;">Please resubmit with the correct documentation. If you believe this is an error, reply to this email.</p>
    <a href="https://orqestrax.com/onboarding" style="display:inline-block;background:#dc2626;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Resubmit license →</a>
  `)
}

export function orderStatusEmail(opts: {
  businessName: string
  orderId: string
  productTitle: string
  status: string
  quantity?: number
  total?: number
}) {
  const statusMessages: Record<string, { emoji: string; title: string; body: string; color: string }> = {
    confirmed: { emoji: '✅', title: 'Order Confirmed', body: 'Your order has been confirmed by the seller and is being prepared.', color: '#16a34a' },
    in_transit: { emoji: '🚛', title: 'Order In Transit', body: 'Your order is on its way. You will be notified when it is delivered.', color: '#9333ea' },
    delivered: { emoji: '📦', title: 'Order Delivered', body: 'Your order has been delivered successfully. Thank you for using Orqestra!', color: '#0ea5e9' },
    cancelled: { emoji: '🚫', title: 'Order Cancelled', body: 'This order has been cancelled. If you have questions, contact support.', color: '#dc2626' },
    disputed: { emoji: '⚠️', title: 'Order Disputed', body: 'A dispute has been raised on this order. Our team will review it within 24 hours.', color: '#f59e0b' },
  }
  const info = statusMessages[opts.status] ?? { emoji: '📋', title: 'Order Update', body: 'Your order status has been updated.', color: '#6b7280' }
  return layout(`
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;margin-bottom:8px;">${info.emoji}</div>
      <h2 style="margin:0 0 8px;font-size:20px;color:#fff;">${info.title}</h2>
      <p style="color:#999;margin:0;font-size:15px;">${info.body}</p>
    </div>
    <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:24px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
        <span style="color:#666;font-size:13px;">Product</span>
        <span style="color:#e5e5e5;font-size:13px;">${opts.productTitle}</span>
      </div>
      ${opts.quantity ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:#666;font-size:13px;">Quantity</span><span style="color:#e5e5e5;font-size:13px;">${opts.quantity}</span></div>` : ''}
      ${opts.total ? `<div style="display:flex;justify-content:space-between;"><span style="color:#666;font-size:13px;">Total</span><span style="color:#e5e5e5;font-size:13px;font-weight:600;">$${(opts.total/100).toFixed(2)}</span></div>` : ''}
    </div>
    <a href="https://orqestrax.com/orders" style="display:inline-block;background:${info.color};color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View order →</a>
  `)
}
