'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Operator {
  id: string
  business_name: string
  operator_type: string
  account_status: string
}

interface ListingOperator {
  business_name: string
  city: string | null
  operator_type: string
}

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
  created_at: string
  operators: ListingOperator | null
}

interface CartItem {
  listing: Listing
  qty: number
}

const CATEGORY_LABELS: Record<string, string> = {
  flower: 'Flower',
  concentrates: 'Concentrates',
  pre_rolls: 'Pre-Rolls',
  edibles: 'Edibles',
  extracts: 'Extracts',
  trim: 'Trim',
  equipment: 'Equipment',
  other: 'Other',
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  active: { bg: '#14532d', color: '#86efac' },
  paused: { bg: '#1e3a5f', color: '#93c5fd' },
  sold_out: { bg: '#3b1f1f', color: '#f87171' },
  archived: { bg: '#1e2235', color: '#64748b' },
}

export default function ListingsClient({
  operator,
  listings,
  isDispensary,
}: {
  operator: Operator
  listings: Listing[]
  isDispensary: boolean
}) {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [filterCat, setFilterCat] = useState('all')
  const [checkingOut, setCheckingOut] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  const filtered = filterCat === 'all' ? listings : listings.filter((l) => l.category === filterCat)
  const categories = ['all', ...Array.from(new Set(listings.map((l) => l.category)))]

  const addToCart = (listing: Listing) => {
    setCart((prev) => {
      if (prev.some((i) => i.listing.id === listing.id)) return prev
      return [...prev, { listing, qty: Math.max(listing.min_order_qty || 1, 1) }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.listing.id !== id))

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.listing.id === id
          ? { ...i, qty: Math.max(i.listing.min_order_qty || 1, i.qty + delta) }
          : i
      )
    )
  }

  const subtotal = cart.reduce((s, i) => s + i.listing.price_per_unit * i.qty, 0)
  const fee = subtotal * 0.03

  const checkout = async () => {
    setCheckingOut(true)
    setCheckoutError('')
    try {
      const results = await Promise.all(
        cart.map((item) =>
          fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listing_id: item.listing.id, quantity: item.qty }),
          }).then((r) => r.json())
        )
      )
      const errors = results.filter((r: { error?: string }) => r.error).map((r: { error?: string }) => r.error)
      if (errors.length) {
        setCheckoutError(errors.join('; '))
      } else {
        setCart([])
        setCartOpen(false)
        router.push('/dashboard')
      }
    } catch {
      setCheckoutError('Network error — please try again.')
    } finally {
      setCheckingOut(false)
    }
  }

  const nav = [
    { href: '/dashboard', label: 'Dashboard', icon: '⊞' },
    { href: '/listings', label: isDispensary ? 'Marketplace' : 'My Listings', icon: isDispensary ? '🛒' : '📦' },
    { href: '/orders', label: isDispensary ? 'My Orders' : 'Sales', icon: '📋' },
    { href: '/compliance', label: 'Compliance', icon: '✓' },
    { href: '/settings', label: 'Settings', icon: '⚙' },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f1117', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: 200, background: '#1a1d2e', borderRight: '1px solid #2d3148', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 16px 20px', borderBottom: '1px solid #2d3148' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#7c3aed' }}>Orqestra</div>
          <div style={{ fontSize: 10, color: '#64748b', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cannabis OS</div>
        </div>
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 8,
                color: item.href === '/listings' ? '#e2e8f0' : '#94a3b8',
                textDecoration: 'none', fontSize: 13, marginBottom: 2,
                background: item.href === '/listings' ? '#2d3148' : 'transparent',
              }}
            >
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #2d3148', fontSize: 11, color: '#64748b' }}>
          {operator.business_name}
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', padding: '32px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
              {isDispensary ? 'Marketplace' : 'My Listings'}
            </h1>
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>
              {isDispensary
                ? `${filtered.length} product${filtered.length !== 1 ? 's' : ''} available in New Mexico`
                : `${listings.length} listing${listings.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {isDispensary && cart.length > 0 && (
              <button
                onClick={() => setCartOpen(true)}
                style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                🛒 Cart ({cart.length}) — ${subtotal.toFixed(2)}
              </button>
            )}
            {!isDispensary && (
              <Link
                href="/listings/new"
                style={{ background: '#7c3aed', color: '#fff', padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
              >
                + New Listing
              </Link>
            )}
          </div>
        </div>

        {isDispensary && categories.length > 1 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                style={{
                  padding: '5px 14px', borderRadius: 999, border: '1px solid',
                  borderColor: filterCat === cat ? '#7c3aed' : '#2d3148',
                  background: filterCat === cat ? '#3b1f7e30' : 'transparent',
                  color: filterCat === cat ? '#a78bfa' : '#64748b',
                  fontSize: 12, cursor: 'pointer',
                }}
              >
                {cat === 'all' ? 'All' : CATEGORY_LABELS[cat] ?? cat}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#475569' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
            <p style={{ fontSize: 15 }}>{isDispensary ? 'No listings available yet.' : 'No listings yet.'}</p>
            {!isDispensary && (
              <Link
                href="/listings/new"
                style={{ display: 'inline-block', marginTop: 16, background: '#7c3aed', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}
              >
                Create your first listing
              </Link>
            )}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {filtered.map((listing) => {
            const inCart = cart.some((i) => i.listing.id === listing.id)
            const ss = STATUS_STYLES[listing.status] ?? STATUS_STYLES.archived
            return (
              <div
                key={listing.id}
                style={{ background: '#1a1d2e', border: '1px solid #2d3148', borderRadius: 12, padding: '18px', display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: '#2d3148', color: '#94a3b8' }}>
                    {CATEGORY_LABELS[listing.category] ?? listing.category}
                  </span>
                  {!isDispensary && (
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: ss.bg, color: ss.color }}>
                      {listing.status}
                    </span>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9' }}>{listing.title}</div>
                  {listing.strain_name && <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{listing.strain_name}</div>}
                  {isDispensary && listing.operators && (
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
                      {listing.operators.business_name}
                      {listing.operators.city ? ` · ${listing.operators.city}` : ''}
                    </div>
                  )}
                </div>

                {(listing.thc_pct != null || listing.cbd_pct != null) && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    {listing.thc_pct != null && (
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#14532d30', color: '#86efac', border: '1px solid #14532d' }}>
                        THC {listing.thc_pct}%
                      </span>
                    )}
                    {listing.cbd_pct != null && (
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#1e3a5f30', color: '#93c5fd', border: '1px solid #1e3a5f' }}>
                        CBD {listing.cbd_pct}%
                      </span>
                    )}
                  </div>
                )}

                {listing.description && (
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                    {listing.description.length > 80 ? listing.description.slice(0, 80) + '…' : listing.description}
                  </p>
                )}

                <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #2d3148' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <span style={{ fontSize: 20, fontWeight: 700, color: '#7c3aed' }}>${listing.price_per_unit.toFixed(2)}</span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>/{listing.unit}</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#475569' }}>{listing.available_qty} {listing.unit} avail.</span>
                  </div>
                  {listing.min_order_qty > 1 && (
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>Min: {listing.min_order_qty} {listing.unit}</div>
                  )}
                  {isDispensary && (
                    <button
                      onClick={() => addToCart(listing)}
                      disabled={inCart}
                      style={{
                        marginTop: 10, width: '100%', padding: '8px', borderRadius: 8, border: 'none',
                        background: inCart ? '#2d3148' : '#7c3aed',
                        color: inCart ? '#64748b' : '#fff',
                        fontWeight: 600, fontSize: 12, cursor: inCart ? 'default' : 'pointer',
                      }}
                    >
                      {inCart ? '✓ Added to Cart' : '+ Add to Cart'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Cart Drawer */}
      {isDispensary && cartOpen && (
        <div style={{ width: 320, background: '#1a1d2e', borderLeft: '1px solid #2d3148', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #2d3148', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', margin: 0 }}>Your Cart ({cart.length})</h2>
            <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
            {cart.length === 0 ? (
              <p style={{ color: '#475569', fontSize: 13 }}>Cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item.listing.id} style={{ background: '#0f1117', borderRadius: 8, padding: '12px', marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}>{item.listing.title}</span>
                    <button onClick={() => removeFromCart(item.listing.id)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
                  </div>
                  {item.listing.operators && (
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>{item.listing.operators.business_name}</div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateQty(item.listing.id, -1)} style={{ background: '#2d3148', border: 'none', color: '#e2e8f0', width: 22, height: 22, borderRadius: 4, cursor: 'pointer', fontSize: 14 }}>−</button>
                      <span style={{ fontSize: 12, color: '#e2e8f0', minWidth: 48, textAlign: 'center' }}>{item.qty} {item.listing.unit}</span>
                      <button onClick={() => updateQty(item.listing.id, 1)} style={{ background: '#2d3148', border: 'none', color: '#e2e8f0', width: 22, height: 22, borderRadius: 4, cursor: 'pointer', fontSize: 14 }}>+</button>
                    </div>
                    <span style={{ fontSize: 13, color: '#7c3aed', fontWeight: 600 }}>${(item.listing.price_per_unit * item.qty).toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div style={{ padding: '16px', borderTop: '1px solid #2d3148' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                <span>Platform fee (3%)</span><span>${fee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 14 }}>
                <span>Total</span><span>${(subtotal + fee).toFixed(2)}</span>
              </div>
              {checkoutError && <p style={{ color: '#f87171', fontSize: 11, marginBottom: 8 }}>{checkoutError}</p>}
              <button
                onClick={checkout}
                disabled={checkingOut}
                style={{ width: '100%', padding: '11px', background: checkingOut ? '#4c1d95' : '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: checkingOut ? 'default' : 'pointer' }}
              >
                {checkingOut ? 'Placing Orders…' : `Place ${cart.length} Order${cart.length > 1 ? 's' : ''}`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
