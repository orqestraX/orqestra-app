'use client'
import { useState } from 'react'
import Link from 'next/link'

// ── Icons ───────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)
const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
)
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#FACC15" stroke="#FACC15" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)
const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

// ── Data ────────────────────────────────────────────────────────────────────
const categories = [
  { label: 'All Products', icon: '🌿', slug: 'all' },
  { label: 'Flower', icon: '🌸', slug: 'flower' },
  { label: 'Concentrates', icon: '🟡', slug: 'concentrates' },
  { label: 'Pre-Rolls', icon: '🚬', slug: 'pre-rolls' },
  { label: 'Edibles', icon: '🍬', slug: 'edibles' },
  { label: 'Trim & Shake', icon: '🍃', slug: 'trim' },
  { label: 'Extracts', icon: '💧', slug: 'extracts' },
  { label: 'Equipment', icon: '⚙️', slug: 'equipment' },
]

const featuredListings = [
  {
    id: '1',
    name: 'Blue Dream — Indoor (AAA)',
    vendor: 'High Desert Farms',
    license: 'NM-CUL-2024-001',
    category: 'Flower',
    price: 650,
    unit: 'lb',
    minOrder: '1 lb',
    rating: 4.8,
    reviews: 34,
    badge: 'Top Seller',
    badgeColor: '#22c55e',
    thc: '24%',
    available: '48 lbs',
    emoji: '🌸',
  },
  {
    id: '2',
    name: 'OG Kush — Indoor (AA+)',
    vendor: 'Rio Grande Cannabis Co.',
    license: 'NM-CUL-2024-008',
    category: 'Flower',
    price: 550,
    unit: 'lb',
    minOrder: '2 lbs',
    rating: 4.6,
    reviews: 21,
    badge: 'Verified',
    badgeColor: '#3b82f6',
    thc: '22%',
    available: '120 lbs',
    emoji: '🌿',
  },
  {
    id: '3',
    name: 'Live Resin — GSC (1g)',
    vendor: 'Elevated Extracts NM',
    license: 'NM-MAN-2024-015',
    category: 'Concentrates',
    price: 18,
    unit: 'unit',
    minOrder: '50 units',
    rating: 4.9,
    reviews: 57,
    badge: 'Featured',
    badgeColor: '#f59e0b',
    thc: '82%',
    available: '500 units',
    emoji: '🟡',
  },
  {
    id: '4',
    name: 'Pre-Roll Pack — Sativa Mix (10pk)',
    vendor: 'Mesa Verde Manufacturing',
    license: 'NM-MAN-2024-022',
    category: 'Pre-Rolls',
    price: 32,
    unit: 'pack',
    minOrder: '20 packs',
    rating: 4.7,
    reviews: 18,
    badge: null,
    badgeColor: '',
    thc: '18-22%',
    available: '200 packs',
    emoji: '🚬',
  },
  {
    id: '5',
    name: 'Sour Diesel — Sun-Grown',
    vendor: 'Enchanted Valley Farms',
    license: 'NM-CUL-2024-033',
    category: 'Flower',
    price: 500,
    unit: 'lb',
    minOrder: '1 lb',
    rating: 4.5,
    reviews: 12,
    badge: 'New',
    badgeColor: '#8b5cf6',
    thc: '20%',
    available: '80 lbs',
    emoji: '☀️',
  },
  {
    id: '6',
    name: 'Gummies — Mixed Fruit 10mg (20pk)',
    vendor: 'Southwest Sweets LLC',
    license: 'NM-MAN-2024-041',
    category: 'Edibles',
    price: 28,
    unit: 'pack',
    minOrder: '30 packs',
    rating: 4.6,
    reviews: 29,
    badge: null,
    badgeColor: '',
    thc: '10mg/piece',
    available: '1,000 packs',
    emoji: '🍬',
  },
]

const featuredVendors = [
  { name: 'High Desert Farms', type: 'Cultivator', location: 'Albuquerque, NM', rating: 4.9, products: 12, badge: 'Top Rated', emoji: '🌾' },
  { name: 'Elevated Extracts NM', type: 'Manufacturer', location: 'Santa Fe, NM', rating: 4.8, products: 8, badge: 'Verified', emoji: '🏭' },
  { name: 'Duke City Dispensary', type: 'Dispensary', location: 'Albuquerque, NM', rating: 4.7, products: 0, badge: 'Active Buyer', emoji: '🏪' },
  { name: 'Rio Grande Runs', type: 'Courier', location: 'Las Cruces, NM', rating: 4.9, products: 0, badge: 'Licensed', emoji: '🚚' },
]

const marketPulse = [
  { product: 'Indoor Flower (AAA)', low: 600, high: 750, unit: '/lb', trend: 'up' },
  { product: 'Indoor Flower (AA)', low: 500, high: 650, unit: '/lb', trend: 'stable' },
  { product: 'Sun-Grown Flower', low: 350, high: 500, unit: '/lb', trend: 'down' },
  { product: 'Live Resin', low: 15, high: 22, unit: '/g', trend: 'up' },
  { product: 'Distillate', low: 8, high: 14, unit: '/g', trend: 'stable' },
  { product: 'Pre-Rolls (10pk)', low: 28, high: 40, unit: '/pack', trend: 'stable' },
]
// ── Main Component ──────────────────────────────────────────────────────────
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [cartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: '#0a0e0b', color: '#e8f0eb' }}>

      {/* ── TOP ANNOUNCEMENT BAR ── */}
      <div style={{ background: '#14532d', borderBottom: '1px solid #166534' }} className="text-center py-2 px-4">
        <span className="text-xs font-semibold" style={{ color: '#86efac' }}>
          🌿 Now accepting early access applications — New Mexico operators only · <Link href="/onboarding" className="underline">Apply free →</Link>
        </span>
      </div>

      {/* ── PRIMARY NAVIGATION (Amazon-style) ── */}
      <header style={{ background: '#0d1f13', borderBottom: '1px solid #1a3a23', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#16a34a,#4ade80)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌿</div>
              <span className="font-black text-xl" style={{ color: '#4ade80', letterSpacing: '-0.5px' }}>Orqestra</span>
            </Link>

            {/* Deliver to location */}
            <div className="hidden lg:flex flex-col flex-shrink-0" style={{ color: '#9ca3af' }}>
              <span className="text-xs">Deliver to</span>
              <span className="text-sm font-bold" style={{ color: '#e8f0eb' }}>New Mexico</span>
            </div>

            {/* Search bar */}
            <div className="flex-1 flex items-center" style={{ maxWidth: 700 }}>
              <select className="hidden md:block text-xs font-semibold px-3 py-3 rounded-l-lg outline-none cursor-pointer flex-shrink-0"
                style={{ background: '#22c55e', color: '#fff', border: 'none', height: 44 }}>
                <option>All</option>
                <option>Flower</option>
                <option>Concentrates</option>
                <option>Pre-Rolls</option>
                <option>Edibles</option>
                <option>Equipment</option>
              </select>
              <input
                type="text"
                placeholder="Search products, vendors, or strains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-sm outline-none"
                style={{ background: '#fff', color: '#111', padding: '10px 16px', height: 44, minWidth: 0 }}
              />
              <button className="flex items-center justify-center flex-shrink-0"
                style={{ background: '#22c55e', width: 46, height: 44, borderRadius: '0 8px 8px 0', color: '#fff' }}>
                <SearchIcon />
              </button>
            </div>

            {/* Right nav */}
            <div className="hidden md:flex items-center gap-5 flex-shrink-0 ml-auto">
              <Link href="/onboarding" className="flex flex-col" style={{ color: '#d1fae5' }}>
                <span className="text-xs" style={{ color: '#9ca3af' }}>Hello, operator</span>
                <span className="text-sm font-bold">Sign in</span>
              </Link>
              <Link href="/onboarding" className="flex flex-col" style={{ color: '#d1fae5' }}>
                <span className="text-xs" style={{ color: '#9ca3af' }}>Orders &</span>
                <span className="text-sm font-bold">Returns</span>
              </Link>
              <Link href="/onboarding" className="relative flex items-center gap-1" style={{ color: '#4ade80' }}>
                <div className="relative">
                  <CartIcon />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{ background: '#22c55e', color: '#fff' }}>{cartCount}</span>
                  )}
                </div>
                <span className="text-sm font-bold" style={{ color: '#e8f0eb' }}>Cart</span>
              </Link>
            </div>

            {/* Mobile menu */}
            <button className="md:hidden ml-auto" style={{ color: '#9ca3af' }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* ── CATEGORY NAV BAR ── */}
        <div style={{ background: '#111c15', borderTop: '1px solid #1a3a23' }}>
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="flex items-center gap-1 overflow-x-auto pb-0" style={{ scrollbarWidth: 'none' }}>
              <button className="flex items-center gap-2 px-3 py-3 text-xs font-bold flex-shrink-0 transition-colors"
                style={{ color: '#4ade80', borderBottom: '2px solid #22c55e' }}>
                <MenuIcon /> All Categories
              </button>
              {categories.map(cat => (
                <button key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className="flex items-center gap-1 px-4 py-3 text-xs font-semibold flex-shrink-0 transition-colors whitespace-nowrap"
                  style={{
                    color: activeCategory === cat.slug ? '#4ade80' : '#9ca3af',
                    borderBottom: activeCategory === cat.slug ? '2px solid #22c55e' : '2px solid transparent',
                  }}
                >
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
      {/* ── HERO BANNER ── */}
      <section style={{ background: 'linear-gradient(135deg, #0a1f10 0%, #0d2b18 50%, #0a1f10 100%)', borderBottom: '1px solid #1a3a23' }}>
        <div className="max-w-screen-xl mx-auto px-4 py-12 md:py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: '#14532d', color: '#86efac', border: '1px solid #166534' }}>
              🌿 Live in New Mexico · More states coming soon
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight" style={{ color: '#f0fdf4' }}>
              The B2B Cannabis<br/>
              <span style={{ color: '#4ade80' }}>Marketplace</span> for<br/>
              New Mexico Operators
            </h1>
            <p className="text-lg mb-8" style={{ color: '#86efac', opacity: 0.8 }}>
              Buy and sell flower, concentrates, edibles, and more — directly between licensed operators. No middleman. Real-time pricing. Fully compliant.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/onboarding"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all"
                style={{ background: '#22c55e', color: '#fff' }}>
                Sign In
              </Link>
              <Link href="#products"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all"
                style={{ background: 'transparent', color: '#4ade80', border: '1px solid #166534' }}>
                Browse Products
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-8">
              {[['$34.99/mo', 'Flat rate'], ['Unlimited', 'Listings'], ['3%', 'Transaction fee'], ['NM Licensed', 'Operators only']].map(([val, label]) => (
                <div key={label}>
                  <div className="text-lg font-bold" style={{ color: '#4ade80' }}>{val}</div>
                  <div className="text-xs" style={{ color: '#6b7280' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-3 flex-shrink-0" style={{ width: 320 }}>
            {['Indoor Flower (AAA) · $600–750/lb', 'Live Resin · $15–22/g', 'Pre-Rolls 10pk · $28–40/pack'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: '#0f2318', border: '1px solid #1a3a23' }}>
                <span style={{ fontSize: 22 }}>{['🌸','🟡','🚬'][i]}</span>
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#d1fae5' }}>{item}</div>
                  <div className="text-xs" style={{ color: '#6b7280' }}>NM Market Price · Updated daily</div>
                </div>
                <span className="ml-auto text-xs font-semibold" style={{ color: '#4ade80' }}>↑</span>
              </div>
            ))}
            <div className="text-center mt-2">
              <Link href="#market-pulse" className="text-xs" style={{ color: '#6b7280' }}>View full Market Pulse →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ── */}
      <section className="max-w-screen-xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold mb-6" style={{ color: '#f0fdf4' }}>Shop by Category</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
              style={{
                background: activeCategory === cat.slug ? '#14532d' : '#0f1a12',
                border: activeCategory === cat.slug ? '1px solid #22c55e' : '1px solid #1a3a23',
              }}
            >
              <span style={{ fontSize: 24 }}>{cat.icon}</span>
              <span className="text-xs font-semibold text-center" style={{ color: activeCategory === cat.slug ? '#4ade80' : '#9ca3af' }}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>
      {/* ── FEATURED PRODUCTS (Amazon product grid) ── */}
      <section id="products" className="max-w-screen-xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: '#f0fdf4' }}>Trending in New Mexico</h2>
          <Link href="/onboarding" className="text-sm font-semibold" style={{ color: '#4ade80' }}>See all products →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredListings.map((item) => (
            <div key={item.id} className="rounded-xl overflow-hidden flex flex-col transition-all hover:scale-105" style={{ background: '#0f1a12', border: '1px solid #1a3a23' }}>
              {/* Product image area */}
              <div className="relative flex items-center justify-center" style={{ background: '#111c15', height: 140, fontSize: 56 }}>
                {item.emoji}
                {item.badge && (
                  <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: item.badgeColor + '22', color: item.badgeColor, border: '1px solid ' + item.badgeColor + '44' }}>
                    {item.badge}
                  </span>
                )}
              </div>
              {/* Product info */}
              <div className="p-3 flex flex-col flex-1">
                <div className="text-xs font-bold mb-0.5" style={{ color: '#6b7280' }}>{item.category}</div>
                <div className="text-sm font-semibold mb-1 leading-snug" style={{ color: '#d1fae5' }}>{item.name}</div>
                <div className="text-xs mb-1" style={{ color: '#6b7280' }}>by {item.vendor}</div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{ opacity: s <= Math.round(item.rating) ? 1 : 0.3 }}>
                      <StarIcon />
                    </span>
                  ))}
                  <span className="text-xs" style={{ color: '#6b7280' }}>({item.reviews})</span>
                </div>
                {/* Price */}
                <div className="mt-auto">
                  <div className="text-lg font-black" style={{ color: '#4ade80' }}>${item.price}<span className="text-xs font-normal" style={{ color: '#6b7280' }}>/{item.unit}</span></div>
                  <div className="text-xs mb-3" style={{ color: '#6b7280' }}>Min order: {item.minOrder} · THC: {item.thc}</div>
                  <Link href="/onboarding"
                    className="block text-center text-xs font-bold py-2 rounded-lg transition-all"
                    style={{ background: '#22c55e22', color: '#4ade80', border: '1px solid #22c55e44' }}>
                    + Add to Cart
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED VENDORS ── */}
      <section className="max-w-screen-xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: '#f0fdf4' }}>Featured Operators</h2>
          <Link href="/onboarding" className="text-sm font-semibold" style={{ color: '#4ade80' }}>View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredVendors.map((v) => (
            <div key={v.name} className="p-5 rounded-xl flex flex-col gap-3 transition-all hover:scale-105 cursor-pointer" style={{ background: '#0f1a12', border: '1px solid #1a3a23' }}>
              <div className="flex items-center gap-3">
                <div style={{ width: 44, height: 44, background: '#111c15', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{v.emoji}</div>
                <div>
                  <div className="text-sm font-bold" style={{ color: '#d1fae5' }}>{v.name}</div>
                  <div className="text-xs" style={{ color: '#6b7280' }}>{v.type}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#14532d', color: '#86efac', border: '1px solid #166534' }}>{v.badge}</span>
              </div>
              <div className="text-xs" style={{ color: '#6b7280' }}>
                <div>📍 {v.location}</div>
                <div className="mt-1 flex items-center gap-1">{'★'.repeat(Math.round(v.rating))} <span>{v.rating}/5</span></div>
                {v.products > 0 && <div className="mt-1">{v.products} active listings</div>}
              </div>
              <Link href="/onboarding" className="text-xs font-bold text-center py-2 rounded-lg" style={{ background: '#111c15', color: '#4ade80', border: '1px solid #1a3a23' }}>
                View Storefront
              </Link>
            </div>
          ))}
        </div>
      </section>
      {/* ── MARKET PULSE ── */}
      <section id="market-pulse" className="max-w-screen-xl mx-auto px-4 pb-12">
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0f1a12', border: '1px solid #1a3a23' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ background: '#111c15', borderBottom: '1px solid #1a3a23' }}>
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#f0fdf4' }}>📊 NM Market Pulse</h2>
              <p className="text-xs" style={{ color: '#6b7280' }}>Live wholesale price ranges · Updated daily from active listings</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#14532d', color: '#86efac' }}>LIVE</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #1a3a23' }}>
                  {['Product', 'Low', 'High', 'Trend'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-bold" style={{ color: '#6b7280' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {marketPulse.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #111c15' }}>
                    <td className="px-6 py-3 font-medium" style={{ color: '#d1fae5' }}>{row.product}</td>
                    <td className="px-6 py-3" style={{ color: '#4ade80' }}>${row.low}{row.unit}</td>
                    <td className="px-6 py-3" style={{ color: '#4ade80' }}>${row.high}{row.unit}</td>
                    <td className="px-6 py-3">
                      <span style={{ color: row.trend === 'up' ? '#4ade80' : row.trend === 'down' ? '#ef4444' : '#9ca3af' }}>
                        {row.trend === 'up' ? '↑ Rising' : row.trend === 'down' ? '↓ Falling' : '→ Stable'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="max-w-screen-xl mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold" style={{ color: '#f0fdf4' }}>How Ordering Works</h2>
          <p className="text-sm mt-2" style={{ color: '#6b7280' }}>Buy from any licensed operator in 4 simple steps</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { step: '1', icon: '🔍', title: 'Search & Browse', desc: 'Find products by category, strain, price range, or vendor. Filter by license type and location.' },
            { step: '2', icon: '🛒', title: 'Add to Cart', desc: 'Order from multiple vendors in one cart. Each vendor fulfills separately with full compliance.' },
            { step: '3', icon: '✅', title: 'Confirm & Pay', desc: 'Review your order summary, confirm quantities, and pay securely through the platform.' },
            { step: '4', icon: '🚚', title: 'Track & Receive', desc: 'Get real-time updates as your order moves through licensed transport to your location.' },
          ].map(s => (
            <div key={s.step} className="flex flex-col items-center text-center p-6 rounded-xl" style={{ background: '#0f1a12', border: '1px solid #1a3a23' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm mb-4" style={{ background: '#14532d', color: '#4ade80', border: '1px solid #22c55e' }}>
                {s.step}
              </div>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
              <div className="font-bold mb-2" style={{ color: '#d1fae5' }}>{s.title}</div>
              <div className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="max-w-screen-xl mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold" style={{ color: '#f0fdf4' }}>Simple Pricing for Every Operator</h2>
          <p className="text-sm mt-2" style={{ color: '#6b7280' }}>One flat rate. Unlimited listings. No hidden fees.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Main plan */}
          <div className="p-8 rounded-2xl" style={{ background: '#0f1a12', border: '2px solid #22c55e' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: '#14532d', color: '#86efac' }}>All Operators</div>
            <div className="text-5xl font-black mb-1" style={{ color: '#4ade80' }}>$34<span className="text-2xl">.99</span></div>
            <div className="text-sm mb-6" style={{ color: '#6b7280' }}>per month</div>
            <ul className="space-y-3 mb-8">
              {['Full B2B marketplace access', 'Unlimited listings', '3% transaction fee on completed orders', 'Dashboard & analytics', 'Order management system', 'Compliance & license tools', 'Email & chat support'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm" style={{ color: '#d1fae5' }}>
                  <span style={{ color: '#22c55e' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/onboarding" className="block text-center py-4 rounded-xl font-bold" style={{ background: '#22c55e', color: '#fff' }}>
              Get Early Access
            </Link>
          </div>
          {/* Promo add-on */}
          <div className="p-8 rounded-2xl" style={{ background: '#0f1a12', border: '1px solid #1a3a23' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: '#1c1400', color: '#fbbf24', border: '1px solid #92400e' }}>Add-on</div>
            <div className="text-3xl font-black mb-1" style={{ color: '#fbbf24' }}>Promo Boost</div>
            <div className="text-sm mb-6" style={{ color: '#6b7280' }}>Featured placement across the marketplace</div>
            <ul className="space-y-3 mb-8">
              {['Featured listing placement', 'Homepage product spotlight', 'Priority search ranking', 'Promoted in Market Pulse', 'Extended analytics & reach'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm" style={{ color: '#d1fae5' }}>
                  <span style={{ color: '#fbbf24' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/onboarding" className="block text-center py-4 rounded-xl font-bold" style={{ background: 'transparent', color: '#fbbf24', border: '1px solid #92400e' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section style={{ background: '#0f1a12', borderTop: '1px solid #1a3a23', borderBottom: '1px solid #1a3a23' }}>
        <div className="max-w-screen-xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🔒', title: 'License Verified', desc: 'Every operator is verified with NMRLD before listing.' },
            { icon: '📋', title: 'Manifest Ready', desc: 'All orders generate compliant transport manifests.' },
            { icon: '⚡', title: 'Real-Time Orders', desc: 'Instant order notifications and status updates.' },
            { icon: '💳', title: 'Secure Payments', desc: 'ACH & business payment options for B2B transactions.' },
          ].map(t => (
            <div key={t.title} className="flex items-start gap-3">
              <span style={{ fontSize: 24, flexShrink: 0 }}>{t.icon}</span>
              <div>
                <div className="text-sm font-bold" style={{ color: '#d1fae5' }}>{t.title}</div>
                <div className="text-xs mt-1" style={{ color: '#6b7280' }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#060e08', borderTop: '1px solid #111c15' }}>
        <div className="max-w-screen-xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#16a34a,#4ade80)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🌿</div>
              <span className="font-black text-lg" style={{ color: '#4ade80' }}>Orqestra</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#4b5563' }}>The B2B operating system for New Mexico's cannabis industry.</p>
          </div>
          {[
            { title: 'Marketplace', links: ['Browse Products', 'Vendors', 'Market Pulse', 'Post a Listing'] },
            { title: 'Operators', links: ['Cultivators', 'Manufacturers', 'Dispensaries', 'Couriers'] },
            { title: 'Company', links: ['About', 'Pricing', 'Early Access', 'Contact'] },
          ].map(col => (
            <div key={col.title}>
              <div className="text-sm font-bold mb-4" style={{ color: '#d1fae5' }}>{col.title}</div>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}><Link href="/onboarding" className="text-xs hover:text-green-400 transition" style={{ color: '#4b5563' }}>{link}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-screen-xl mx-auto px-4 pb-8 flex flex-col md:flex-row items-center justify-between gap-2" style={{ borderTop: '1px solid #111c15', paddingTop: 24 }}>
          <p className="text-xs" style={{ color: '#374151' }}>© 2025 Orqestra · Cannazon, LLC. All rights reserved.</p>
          <p className="text-xs" style={{ color: '#374151' }}>For licensed New Mexico cannabis operators only.</p>
        </div>
      </footer>

    </div>
  )
}
