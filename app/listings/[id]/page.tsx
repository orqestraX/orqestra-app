'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Listing {
  id: string
  title: string
  category: string
  price_per_unit: number
  unit: string
  available_qty: number
  min_order_qty: number
  status: string
  strain_name: string | null
  thc_pct: number | null
  cbd_pct: number | null
  description: string | null
  operator_id: string
  operators: { business_name: string; city: string; operator_type: string } | null
}

const CATEGORY_LABELS: Record<string, string> = {
  flower: 'Flower', concentrates: 'Concentrates', pre_rolls: 'Pre-Rolls',
  edibles: 'Edibles', extracts: 'Extracts', trim: 'Trim & Shake',
  equipment: 'Equipment', other: 'Other',
}

const CATEGORY_EMOJI: Record<string, string> = {
  flower: '🌸', concentrates: '🟡', pre_rolls: '🚬',
  edibles: '🍬', extracts: '💧', trim: '🍃',
  equipment: '🔧', other: '📦',
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [ordering, setOrdering] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setFetchError(d.error); return }
        setListing(d.listing)
        setQuantity(d.listing.min_order_qty ?? 1)
      })
      .catch(() => setFetchError('Failed to load listing'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleOrder() {
    if (!listing) return
    setOrdering(true)
    setOrderError(null)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listing.id, quantity }),
      })
      const data = await res.json()
      if (!res.ok) { setOrderError(data.error ?? 'Order failed') }
      else { setOrderSuccess(true) }
    } catch {
      setOrderError('Network error. Please try again.')
    } finally {
      setOrdering(false)
    }
  }

  const bg = '#0a0a0a'
  const mono = 'monospace'

  if (loading) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#888', fontFamily: mono, fontSize: 14 }}>Loading listing...</div>
    </div>
  )

  if (fetchError || !listing) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <div style={{ color: '#ef4444', fontFamily: mono, fontSize: 14 }}>{fetchError ?? 'Listing not found'}</div>
      <Link href="/marketplace" style={{ color: '#22c55e', fontFamily: mono, fontSize: 13 }}>← Back to Marketplace</Link>
    </div>
  )

  if (orderSuccess) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '0 24px' }}>
      <div style={{ fontSize: 48 }}>✅</div>
      <div style={{ color: '#fff', fontFamily: mono, fontSize: 20, fontWeight: 700 }}>Order Placed</div>
      <div style={{ color: '#888', fontFamily: mono, fontSize: 14, textAlign: 'center' }}>
        Your order for {quantity} {listing.unit} of{' '}
        <span style={{ color: '#22c55e' }}>{listing.title}</span> has been submitted.
        <br />The seller will be notified and you'll hear back soon.
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link href="/dashboard" style={{ background: '#22c55e', color: '#000', padding: '10px 20px', borderRadius: 8, fontFamily: mono, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Go to Dashboard</Link>
        <Link href="/marketplace" style={{ background: '#1a1a1a', color: '#fff', padding: '10px 20px', borderRadius: 8, fontFamily: mono, fontSize: 13, textDecoration: 'none', border: '1px solid #333' }}>Keep Browsing</Link>
      </div>
    </div>
  )

  const total = (listing.price_per_unit * quantity).toFixed(2)
  const emoji = CATEGORY_EMOJI[listing.category] ?? '📦'
  const categoryLabel = CATEGORY_LABELS[listing.category] ?? listing.category

  return (
    <div style={{ minHeight: '100vh', background: bg, color: '#fff', fontFamily: mono, padding: '40px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Link href="/marketplace" style={{ color: '#555', fontSize: 13, textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}>← Marketplace</Link>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 40, alignItems: 'start' }}>

          {/* LEFT: details */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#888' }}>{emoji} {categoryLabel}</span>
              <span style={{ background: listing.status === 'active' ? '#052e16' : '#1a1a1a', border: `1px solid ${listing.status === 'active' ? '#16a34a' : '#444'}`, borderRadius: 20, padding: '4px 12px', fontSize: 12, color: listing.status === 'active' ? '#22c55e' : '#888' }}>
                {listing.status === 'active' ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px 0', lineHeight: 1.2 }}>{listing.title}</h1>
            {listing.strain_name && <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>Strain: <span style={{ color: '#ccc' }}>{listing.strain_name}</span></div>}
            <div style={{ display: 'flex', gap: 12, margin: '16px 0', flexWrap: 'wrap' }}>
              {listing.thc_pct != null && <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '8px 14px', fontSize: 13 }}><span style={{ color: '#888' }}>THC </span><span style={{ color: '#22c55e', fontWeight: 700 }}>{listing.thc_pct}%</span></div>}
              {listing.cbd_pct != null && <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, padding: '8px 14px', fontSize: 13 }}><span style={{ color: '#888' }}>CBD </span><span style={{ color: '#60a5fa', fontWeight: 700 }}>{listing.cbd_pct}%</span></div>}
            </div>
            {listing.description && <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: '16px 0 0 0' }}>{listing.description}</p>}
            {listing.operators && (
              <div style={{ marginTop: 32, padding: 20, background: '#111', border: '1px solid #222', borderRadius: 12 }}>
                <div style={{ color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Sold by</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{listing.operators.business_name}</div>
                <div style={{ color: '#666', fontSize: 13, marginTop: 4 }}>{listing.operators.city} · {listing.operators.operator_type}</div>
              </div>
            )}
          </div>

          {/* RIGHT: order card */}
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 16, padding: 24, position: 'sticky', top: 24 }}>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>${listing.price_per_unit.toFixed(2)}<span style={{ color: '#555', fontSize: 14, fontWeight: 400 }}>/{listing.unit}</span></div>
            <div style={{ color: '#555', fontSize: 12, marginBottom: 20 }}>{listing.available_qty} {listing.unit} available · min {listing.min_order_qty}</div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#888', fontSize: 12, marginBottom: 6 }}>QUANTITY ({listing.unit})</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => setQuantity(q => Math.max(listing.min_order_qty, q - 1))} style={{ width: 36, height: 36, background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 18, cursor: 'pointer' }}>−</button>
                <input type="number" value={quantity} min={listing.min_order_qty} max={listing.available_qty}
                  onChange={e => setQuantity(Math.max(listing.min_order_qty, Math.min(listing.available_qty, Number(e.target.value))))}
                  style={{ flex: 1, background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 16, padding: '8px 12px', textAlign: 'center', fontFamily: mono }} />
                <button onClick={() => setQuantity(q => Math.min(listing.available_qty, q + 1))} style={{ width: 36, height: 36, background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff', fontSize: 18, cursor: 'pointer' }}>+</button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #1a1a1a', marginBottom: 16 }}>
              <span style={{ color: '#666', fontSize: 13 }}>Order total</span>
              <span style={{ fontWeight: 700, fontSize: 18 }}>${total}</span>
            </div>
            {orderError && <div style={{ background: '#1a0000', border: '1px solid #7f1d1d', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#ef4444', marginBottom: 12 }}>{orderError}</div>}
            <button onClick={handleOrder} disabled={ordering || listing.status !== 'active'}
              style={{ width: '100%', background: ordering ? '#1a1a1a' : '#22c55e', color: ordering ? '#555' : '#000', border: 'none', borderRadius: 10, padding: '14px 0', fontSize: 15, fontWeight: 700, cursor: ordering ? 'not-allowed' : 'pointer', fontFamily: mono }}>
              {ordering ? 'Placing Order...' : 'Place Order'}
            </button>
            <p style={{ color: '#444', fontSize: 11, textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>Orders are fulfilled B2B. Payment terms agreed directly with seller.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
