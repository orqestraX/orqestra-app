'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { value: 'flower', label: 'Flower' },
  { value: 'concentrates', label: 'Concentrates' },
  { value: 'pre_rolls', label: 'Pre-Rolls' },
  { value: 'edibles', label: 'Edibles' },
  { value: 'extracts', label: 'Extracts' },
  { value: 'trim', label: 'Trim' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'other', label: 'Other' },
]

const UNITS = ['lb', 'oz', 'g', 'kg', 'unit', 'case', 'ml', 'L']

export default function NewListingForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    category: 'flower',
    price_per_unit: '',
    unit: 'lb',
    available_qty: '',
    min_order_qty: '1',
    description: '',
    strain_name: '',
    thc_pct: '',
    cbd_pct: '',
  })

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category,
          price_per_unit: parseFloat(form.price_per_unit),
          unit: form.unit,
          available_qty: parseFloat(form.available_qty),
          min_order_qty: form.min_order_qty ? parseFloat(form.min_order_qty) : 1,
          description: form.description.trim() || null,
          strain_name: form.strain_name.trim() || null,
          thc_pct: form.thc_pct ? parseFloat(form.thc_pct) : null,
          cbd_pct: form.cbd_pct ? parseFloat(form.cbd_pct) : null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create listing')
      router.push('/listings')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  const input: React.CSSProperties = {
    width: '100%', padding: '10px 14px', background: '#0f1117',
    border: '1px solid #2d3148', borderRadius: 8, color: '#e2e8f0',
    fontSize: 14, boxSizing: 'border-box',
  }
  const label: React.CSSProperties = { fontSize: 13, color: '#94a3b8', marginBottom: 6, display: 'block' }
  const card: React.CSSProperties = { background: '#1a1d2e', borderRadius: 12, padding: '24px', border: '1px solid #2d3148' }
  const cardTitle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 0, marginBottom: 20 }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif', padding: '40px 0' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ marginBottom: 32 }}>
          <Link href="/listings" style={{ color: '#64748b', textDecoration: 'none', fontSize: 13 }}>← Back to listings</Link>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9', marginTop: 12, marginBottom: 4 }}>Create Listing</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>List your product on the Orqestra marketplace</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Product Details */}
          <div style={card}>
            <h2 style={cardTitle}>Product Details</h2>

            <div style={{ marginBottom: 16 }}>
              <label style={label}>Product Title *</label>
              <input style={input} value={form.title} onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Blue Dream Flower — Batch #24" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={label}>Category *</label>
                <select style={input} value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={label}>Strain Name</label>
                <input style={input} value={form.strain_name} onChange={(e) => set('strain_name', e.target.value)}
                  placeholder="e.g. Blue Dream" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={label}>THC %</label>
                <input style={input} type="number" step="0.1" min="0" max="100"
                  value={form.thc_pct} onChange={(e) => set('thc_pct', e.target.value)} placeholder="e.g. 22.5" />
              </div>
              <div>
                <label style={label}>CBD %</label>
                <input style={input} type="number" step="0.1" min="0" max="100"
                  value={form.cbd_pct} onChange={(e) => set('cbd_pct', e.target.value)} placeholder="e.g. 0.3" />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div style={card}>
            <h2 style={cardTitle}>Pricing &amp; Inventory</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={label}>Price per Unit ($) *</label>
                <input style={input} type="number" step="0.01" min="0"
                  value={form.price_per_unit} onChange={(e) => set('price_per_unit', e.target.value)}
                  placeholder="0.00" required />
              </div>
              <div>
                <label style={label}>Unit *</label>
                <select style={input} value={form.unit} onChange={(e) => set('unit', e.target.value)}>
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={label}>Available Quantity *</label>
                <input style={input} type="number" step="0.01" min="0"
                  value={form.available_qty} onChange={(e) => set('available_qty', e.target.value)}
                  placeholder="0" required />
              </div>
              <div>
                <label style={label}>Min Order Quantity</label>
                <input style={input} type="number" step="0.01" min="0"
                  value={form.min_order_qty} onChange={(e) => set('min_order_qty', e.target.value)}
                  placeholder="1" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={card}>
            <h2 style={cardTitle}>Description</h2>
            <textarea
              style={{ ...input, minHeight: 100, resize: 'vertical' }}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe your product, grow conditions, compliance info…"
            />
          </div>

          {error && <p style={{ color: '#f87171', fontSize: 14, margin: 0 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 12 }}>
            <Link
              href="/listings"
              style={{ flex: 1, textAlign: 'center', padding: '12px', border: '1px solid #2d3148', borderRadius: 8, color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              style={{ flex: 2, padding: '12px', background: submitting ? '#4c1d95' : '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: submitting ? 'default' : 'pointer' }}
            >
              {submitting ? 'Creating…' : 'Create Listing'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
