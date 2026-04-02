'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)

const CATEGORY_EMOJI: Record<string, string> = {
  'Flower': '🌸',
  'Concentrates': '🟡',
  'Pre-Rolls': '🚬',
  'Edibles': '🍬',
  'Extracts': '💧',
  'Trim & Shake': '🍃',
  'Equipment': '🔧',
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
  operators: {
    business_name: string
    city: string
    operator_type: string
  } | null
}

const CATEGORIES = ['All', 'Flower', 'Concentrates', 'Pre-Rolls', 'Edibles', 'Extracts', 'Trim & Shake', 'Equipment']
const OPERATOR_TYPES = ['All', 'Cultivator', 'Manufacturer']
const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest']

export default function MarketplacePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [operatorType, setOperatorType] = useState('All')
  const [sort, setSort] = useState('Featured')
  const [maxPrice, setMaxPrice] = useState(10000)
  const [showFilters, setShowFilters] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/listings')
      .then(r => r.json())
      .then(d => setListings(d.listings ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = listings
    .filter(p => p.status === 'active')
    .filter(p => category === 'All' || p.category === category)
    .filter(p => operatorType === 'All' || p.operators?.operator_type === operatorType)
    .filter(p => p.price_per_unit <= maxPrice)
    .filter(p =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.operators?.business_name ?? '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === 'Price: Low to High') return a.price_per_unit - b.price_per_unit
      if (sort === 'Price: High to Low') return b.price_per_unit - a.price_per_unit
      return 0
    })

  return (
    <div style={{ background: '#0a0e0b', minHeight: '100vh', color: '#e8f0eb' }}>
      <header style={{ background: '#0d1f13', borderBottom: '1px solid #1a3a23', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#16a34a,#4ade80)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🌿</div>
            <span className="font-black text-lg" style={{ color: '#4ade80' }}>Orqestra</span>
          </Link>
          <span className="text-sm" style={{ color: '#6b7280' }}>/</span>
          <span className="text-sm font-semibold" style={{ color: '#d1fae5' }}>Marketplace</span>
          <div className="flex-1 flex items-center ml-4" style={{ maxWidth: 500 }}>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7280' }}><SearchIcon /></span>
              <input
                type="text"
                placeholder="Search products, vendors, strains..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full text-sm outline-none rounded-lg pl-9 pr-4 py-2.5"
                style={{ background: '#111c15', border: '1px solid #1a3a23', color: '#e8f0eb' }}
              />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold"
              style={{ background: showFilters ? '#14532d' : '#111c15', color: showFilters ? '#4ade80' : '#9ca3af', border: '1px solid #1a3a23' }}
            >
              <FilterIcon /> Filters
            </button>
            <Link href="/listings/new" className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: '#22c55e', color: '#fff' }}>
              + List a Product
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 flex gap-6">
        <aside className={(showFilters ? 'block' : 'hidden') + ' lg:block flex-shrink-0'} style={{ width: 220 }}>
          <div className="sticky top-20 space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>Category</div>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)} className="w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors"
                  style={{ background: category === c ? '#14532d' : 'transparent', color: category === c ? '#4ade80' : '#9ca3af', fontWeight: category === c ? 700 : 400 }}>
                  {c}
                </button>
              ))}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>Operator Type</div>
              {OPERATOR_TYPES.map(t => (
                <button key={t} onClick={() => setOperatorType(t)} className="w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors"
                  style={{ background: operatorType === t ? '#14532d' : 'transparent', color: operatorType === t ? '#4ade80' : '#9ca3af', fontWeight: operatorType === t ? 700 : 400 }}>
                  {t}
                </button>
              ))}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#6b7280' }}>Max Price</div>
              <div className="text-sm font-bold mb-2" style={{ color: '#4ade80' }}>{maxPrice >= 10000 ? 'Any' : '$' + maxPrice}</div>
              <input type="range" min={50} max={10000} step={50} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full" style={{ accentColor: '#22c55e' }} />
              <div className="flex justify-between text-xs mt-1" style={{ color: '#4b5563' }}><span>$50</span><span>$10k+</span></div>
            </div>
            <button onClick={() => { setCategory('All'); setOperatorType('All'); setMaxPrice(10000); setSearch('') }}
              className="w-full py-2 rounded-lg text-sm font-semibold"
              style={{ background: '#111c15', color: '#6b7280', border: '1px solid #1a3a23' }}>
              Reset Filters
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm" style={{ color: '#6b7280' }}>
              {loading ? 'Loading…' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''}${category !== 'All' ? ' in ' + category : ''}`}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: '#6b7280' }}>Sort:</span>
              <select value={sort} onChange={e => setSort(e.target.value)} className="text-xs rounded-lg px-3 py-2 outline-none"
                style={{ background: '#111c15', border: '1px solid #1a3a23', color: '#d1fae5' }}>
                {SORT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-24" style={{ color: '#6b7280' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
              <div className="font-semibold">Loading listings…</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24" style={{ color: '#6b7280' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div className="font-semibold">{search || category !== 'All' ? 'No listings match your filters' : 'No listings yet'}</div>
              <div className="text-sm mt-2">{search || category !== 'All' ? 'Try adjusting your search or filters' : 'Be the first to list a product'}</div>
              {!search && category === 'All' && (
                <Link href="/listings/new" className="inline-block mt-6 px-6 py-3 rounded-xl font-bold text-sm"
                  style={{ background: '#22c55e', color: '#fff' }}>
                  + List a Product
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(item => (
                <div key={item.id} className="rounded-xl overflow-hidden flex flex-col transition-all"
                  style={{ background: '#0f1a12', border: '1px solid #1a3a23' }}>
                  <div className="flex items-center justify-center"
                    style={{ background: '#111c15', height: 130, fontSize: 52 }}>
                    {CATEGORY_EMOJI[item.category] ?? '📦'}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <div className="text-xs font-bold mb-0.5" style={{ color: '#6b7280' }}>{item.category}</div>
                    <div className="text-sm font-semibold mb-1 leading-snug" style={{ color: '#d1fae5' }}>{item.title}</div>
                    <div className="text-xs mb-1" style={{ color: '#6b7280' }}>by {item.operators?.business_name ?? '—'}</div>
                    <div className="text-xs mb-3" style={{ color: '#4b5563' }}>📍 {item.operators?.city ? item.operators.city + ', NM' : 'New Mexico'}</div>
                    <div className="mt-auto">
                      <div className="text-lg font-black" style={{ color: '#4ade80' }}>
                        ${item.price_per_unit}
                        <span className="text-xs font-normal" style={{ color: '#6b7280' }}>/{item.unit}</span>
                      </div>
                      <div className="text-xs mb-3" style={{ color: '#6b7280' }}>
                        Min: {item.min_order_qty} {item.unit} · Avail: {item.available_qty} {item.unit}
                      </div>
                      <Link href={`/listings/${item.id}`}
                        className="block text-center text-xs font-bold py-2 rounded-lg transition-all"
                        style={{ background: '#22c55e22', color: '#4ade80', border: '1px solid #22c55e44' }}>
                        View &amp; Order
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
