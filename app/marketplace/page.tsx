'use client'
import { useState } from 'react'
import Link from 'next/link'

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#FACC15" stroke="#FACC15" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)

const ALL_PRODUCTS = [
  { id:'1', name:'Blue Dream — Indoor (AAA)', vendor:'High Desert Farms', category:'Flower', price:650, unit:'lb', minOrder:'1 lb', rating:4.8, reviews:34, badge:'Top Seller', badgeColor:'#22c55e', thc:'24%', available:'48 lbs', emoji:'🌸', type:'Cultivator', location:'Albuquerque, NM' },
  { id:'2', name:'OG Kush — Indoor (AA+)', vendor:'Rio Grande Cannabis Co.', category:'Flower', price:550, unit:'lb', minOrder:'2 lbs', rating:4.6, reviews:21, badge:'Verified', badgeColor:'#3b82f6', thc:'22%', available:'120 lbs', emoji:'🌿', type:'Cultivator', location:'Santa Fe, NM' },
  { id:'3', name:'Live Resin — GSC (1g)', vendor:'Elevated Extracts NM', category:'Concentrates', price:18, unit:'unit', minOrder:'50 units', rating:4.9, reviews:57, badge:'Featured', badgeColor:'#f59e0b', thc:'82%', available:'500 units', emoji:'🟡', type:'Manufacturer', location:'Santa Fe, NM' },
  { id:'4', name:'Pre-Roll Pack — Sativa Mix (10pk)', vendor:'Mesa Verde Manufacturing', category:'Pre-Rolls', price:32, unit:'pack', minOrder:'20 packs', rating:4.7, reviews:18, badge:null, badgeColor:'', thc:'18-22%', available:'200 packs', emoji:'🚬', type:'Manufacturer', location:'Taos, NM' },
  { id:'5', name:'Sour Diesel — Sun-Grown', vendor:'Enchanted Valley Farms', category:'Flower', price:500, unit:'lb', minOrder:'1 lb', rating:4.5, reviews:12, badge:'New', badgeColor:'#8b5cf6', thc:'20%', available:'80 lbs', emoji:'☀️', type:'Cultivator', location:'Las Cruces, NM' },
  { id:'6', name:'Gummies — Mixed Fruit 10mg (20pk)', vendor:'Southwest Sweets LLC', category:'Edibles', price:28, unit:'pack', minOrder:'30 packs', rating:4.6, reviews:29, badge:null, badgeColor:'', thc:'10mg/piece', available:'1,000 packs', emoji:'🍬', type:'Manufacturer', location:'Albuquerque, NM' },
  { id:'7', name:'Trim & Shake — Mixed (Indoor)', vendor:'High Desert Farms', category:'Trim & Shake', price:150, unit:'lb', minOrder:'5 lbs', rating:4.3, reviews:9, badge:null, badgeColor:'', thc:'12-16%', available:'200 lbs', emoji:'🍃', type:'Cultivator', location:'Albuquerque, NM' },
  { id:'8', name:'Distillate Cartridge — 1g OG', vendor:'Elevated Extracts NM', category:'Extracts', price:12, unit:'unit', minOrder:'100 units', rating:4.7, reviews:41, badge:'Top Seller', badgeColor:'#22c55e', thc:'88%', available:'1,200 units', emoji:'💧', type:'Manufacturer', location:'Santa Fe, NM' },
  { id:'9', name:'White Widow — Indoor (AA)', vendor:'Rio Grande Cannabis Co.', category:'Flower', price:520, unit:'lb', minOrder:'1 lb', rating:4.4, reviews:7, badge:null, badgeColor:'', thc:'19%', available:'60 lbs', emoji:'❄️', type:'Cultivator', location:'Santa Fe, NM' },
  { id:'10', name:'RSO Oil — Full Spectrum (1g)', vendor:'Elevated Extracts NM', category:'Extracts', price:22, unit:'unit', minOrder:'25 units', rating:4.8, reviews:33, badge:'Verified', badgeColor:'#3b82f6', thc:'65%', available:'300 units', emoji:'🧪', type:'Manufacturer', location:'Santa Fe, NM' },
  { id:'11', name:'Chocolate Bar — Dark 5mg (10pk)', vendor:'Southwest Sweets LLC', category:'Edibles', price:35, unit:'pack', minOrder:'20 packs', rating:4.5, reviews:16, badge:null, badgeColor:'', thc:'50mg/bar', available:'500 packs', emoji:'🍫', type:'Manufacturer', location:'Albuquerque, NM' },
  { id:'12', name:'Jack Herer — Greenhouse (AA)', vendor:'Enchanted Valley Farms', category:'Flower', price:420, unit:'lb', minOrder:'2 lbs', rating:4.2, reviews:5, badge:'New', badgeColor:'#8b5cf6', thc:'18%', available:'150 lbs', emoji:'🌱', type:'Cultivator', location:'Las Cruces, NM' },
]

const CATEGORIES = ['All', 'Flower', 'Concentrates', 'Pre-Rolls', 'Edibles', 'Extracts', 'Trim & Shake', 'Equipment']
const OPERATOR_TYPES = ['All', 'Cultivator', 'Manufacturer']
const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Top Rated', 'Newest']

export default function MarketplacePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [operatorType, setOperatorType] = useState('All')
  const [sort, setSort] = useState('Featured')
  const [maxPrice, setMaxPrice] = useState(1000)
  const [minRating, setMinRating] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = ALL_PRODUCTS
    .filter(p => category === 'All' || p.category === category)
    .filter(p => operatorType === 'All' || p.type === operatorType)
    .filter(p => p.price <= maxPrice)
    .filter(p => p.rating >= minRating)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.vendor.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'Price: Low to High') return a.price - b.price
      if (sort === 'Price: High to Low') return b.price - a.price
      if (sort === 'Top Rated') return b.rating - a.rating
      return 0
    })

  return (
    <div style={{ background: '#0a0e0b', minHeight: '100vh', color: '#e8f0eb' }}>

      {/* Header */}
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
              <input type="text" placeholder="Search products, vendors, strains..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full text-sm outline-none rounded-lg pl-9 pr-4 py-2.5"
                style={{ background: '#111c15', border: '1px solid #1a3a23', color: '#e8f0eb' }} />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold"
              style={{ background: showFilters ? '#14532d' : '#111c15', color: showFilters ? '#4ade80' : '#9ca3af', border: '1px solid #1a3a23' }}>
              <FilterIcon /> Filters
            </button>
            <Link href="/onboarding" className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: '#22c55e', color: '#fff' }}>
              + List a Product
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 flex gap-6">

        {/* ── FILTERS SIDEBAR ── */}
        <aside className={(showFilters ? 'block' : 'hidden') + ' lg:block flex-shrink-0'} style={{ width: 220 }}>
          <div className="sticky top-20 space-y-6">

            {/* Category */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>Category</div>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors"
                  style={{ background: category === c ? '#14532d' : 'transparent', color: category === c ? '#4ade80' : '#9ca3af', fontWeight: category === c ? 700 : 400 }}>
                  {c}
                </button>
              ))}
            </div>

            {/* Operator type */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>Operator Type</div>
              {OPERATOR_TYPES.map(t => (
                <button key={t} onClick={() => setOperatorType(t)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors"
                  style={{ background: operatorType === t ? '#14532d' : 'transparent', color: operatorType === t ? '#4ade80' : '#9ca3af', fontWeight: operatorType === t ? 700 : 400 }}>
                  {t}
                </button>
              ))}
            </div>

            {/* Min rating */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>Min. Rating</div>
              {[0, 4, 4.5, 4.7].map(r => (
                <button key={r} onClick={() => setMinRating(r)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors flex items-center gap-2"
                  style={{ background: minRating === r ? '#14532d' : 'transparent', color: minRating === r ? '#4ade80' : '#9ca3af', fontWeight: minRating === r ? 700 : 400 }}>
                  {r === 0 ? 'All ratings' : r + '+ ★'}
                </button>
              ))}
            </div>

            {/* Price */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#6b7280' }}>Max Price</div>
              <div className="text-sm font-bold mb-2" style={{ color: '#4ade80' }}>${maxPrice === 1000 ? 'Any' : '$' + maxPrice}</div>
              <input type="range" min={50} max={1000} step={50} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full" style={{ accentColor: '#22c55e' }} />
              <div className="flex justify-between text-xs mt-1" style={{ color: '#4b5563' }}><span>$50</span><span>$1000+</span></div>
            </div>

            {/* Reset */}
            <button onClick={() => { setCategory('All'); setOperatorType('All'); setMinRating(0); setMaxPrice(1000); setSearch(''); }}
              className="w-full py-2 rounded-lg text-sm font-semibold" style={{ background: '#111c15', color: '#6b7280', border: '1px solid #1a3a23' }}>
              Reset Filters
            </button>
          </div>
        </aside>

        {/* ── PRODUCT GRID ── */}
        <main className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm" style={{ color: '#6b7280' }}>{filtered.length} results{category !== 'All' ? ' in ' + category : ''}</div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: '#6b7280' }}>Sort:</span>
              <select value={sort} onChange={e => setSort(e.target.value)} className="text-xs rounded-lg px-3 py-2 outline-none"
                style={{ background: '#111c15', border: '1px solid #1a3a23', color: '#d1fae5' }}>
                {SORT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24" style={{ color: '#6b7280' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div className="font-semibold">No products match your filters</div>
              <div className="text-sm mt-2">Try adjusting your search or filters</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(item => (
                <div key={item.id} className="rounded-xl overflow-hidden flex flex-col transition-all" style={{ background: '#0f1a12', border: '1px solid #1a3a23' }}>
                  <div className="relative flex items-center justify-center" style={{ background: '#111c15', height: 130, fontSize: 52 }}>
                    {item.emoji}
                    {item.badge && (
                      <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: item.badgeColor + '22', color: item.badgeColor, border: '1px solid ' + item.badgeColor + '44' }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <div className="text-xs font-bold mb-0.5" style={{ color: '#6b7280' }}>{item.category}</div>
                    <div className="text-sm font-semibold mb-1 leading-snug" style={{ color: '#d1fae5' }}>{item.name}</div>
                    <div className="text-xs mb-1" style={{ color: '#6b7280' }}>by {item.vendor}</div>
                    <div className="text-xs mb-2" style={{ color: '#4b5563' }}>📍 {item.location}</div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(s => <span key={s} style={{ opacity: s <= Math.round(item.rating) ? 1 : 0.3 }}><StarIcon /></span>)}
                      <span className="text-xs" style={{ color: '#6b7280' }}>({item.reviews})</span>
                    </div>
                    <div className="mt-auto">
                      <div className="text-lg font-black" style={{ color: '#4ade80' }}>${item.price}<span className="text-xs font-normal" style={{ color: '#6b7280' }}>/{item.unit}</span></div>
                      <div className="text-xs mb-3" style={{ color: '#6b7280' }}>Min: {item.minOrder} · THC: {item.thc}</div>
                      <Link href="/onboarding" className="block text-center text-xs font-bold py-2 rounded-lg transition-all"
                        style={{ background: '#22c55e22', color: '#4ade80', border: '1px solid #22c55e44' }}>
                        + Add to Cart
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