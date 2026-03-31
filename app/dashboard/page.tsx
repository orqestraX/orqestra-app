'use client'
import { useState } from 'react'
import Link from 'next/link'

// ─── Types & Data ──────────────────────────────────────────────────────────────
type OperatorRole = 'cultivator' | 'manufacturer' | 'dispensary' | 'contractor' | 'logistics' | 'fulfillment'

const roleConfig: Record<OperatorRole, {
  label: string; emoji: string; color: string; borderColor: string; textColor: string;
  stats: { label: string; value: string; change: string; up: boolean }[];
  quickActions: { label: string; icon: string }[];
  recentActivity: { text: string; time: string; type: string }[];
}> = {
  cultivator: {
    label: 'Cultivator', emoji: '🌱', color: 'emerald', borderColor: 'border-emerald-700/40', textColor: 'text-emerald-400',
    stats: [
      { label: 'Active Listings', value: '12', change: '+3 this week', up: true },
      { label: 'Pending Orders', value: '4', change: '2 new today', up: true },
      { label: 'Revenue MTD', value: '$24,800', change: '+18% vs last month', up: true },
      { label: 'Available Inventory', value: '284 lbs', change: '-12 lbs sold', up: false },
    ],
    quickActions: [
      { label: 'Add Harvest Listing', icon: '+ 🌿' },
      { label: 'View Orders', icon: '📋' },
      { label: 'Upload COA', icon: '📄' },
      { label: 'Book Logistics', icon: '🚚' },
    ],
    recentActivity: [
      { text: 'New order from Mesa Verde Dispensary — 40 lbs Blue Dream', time: '2h ago', type: 'order' },
      { text: 'COA uploaded for Batch #2026-04A', time: '5h ago', type: 'doc' },
      { text: 'NM Extracts Lab placed inquiry — 60 lbs trim', time: '1d ago', type: 'inquiry' },
      { text: 'Listing "OG Kush Flower" approved', time: '2d ago', type: 'approved' },
    ],
  },
  manufacturer: {
    label: 'Manufacturer', emoji: '🏭', color: 'blue', borderColor: 'border-blue-700/40', textColor: 'text-blue-400',
    stats: [
      { label: 'Active SKUs', value: '28', change: '+5 this month', up: true },
      { label: 'Production Runs', value: '3', change: '1 in progress', up: true },
      { label: 'Revenue MTD', value: '$87,200', change: '+22% vs last month', up: true },
      { label: 'Raw Material Stock', value: '180 lbs', change: 'Order needed soon', up: false },
    ],
    quickActions: [
      { label: 'Source Raw Material', icon: '🌿' },
      { label: 'Add Product', icon: '+ 📦' },
      { label: 'Production Log', icon: '🏭' },
      { label: 'Distribute Products', icon: '→' },
    ],
    recentActivity: [
      { text: 'Order placed — 80 lbs flower from Sunburst Farms', time: '3h ago', type: 'order' },
      { text: 'Production Run #14 completed — 2,400 cartridges', time: '1d ago', type: 'production' },
      { text: 'Dispensary order — Desert Rose RX, 500 pre-rolls', time: '1d ago', type: 'order' },
      { text: 'New SKU "Watermelon Gummies 10mg" listed', time: '3d ago', type: 'listing' },
    ],
  },
  dispensary: {
    label: 'Dispensary', emoji: '🏪', color: 'purple', borderColor: 'border-purple-700/40', textColor: 'text-purple-400',
    stats: [
      { label: 'Open Purchase Orders', value: '6', change: '2 arriving today', up: true },
      { label: 'Products in Cart', value: '14 items', change: '$3,200 value', up: true },
      { label: 'Spend MTD', value: '$52,400', change: '-8% vs last month', up: false },
      { label: 'Approved Vendors', value: '19', change: '+4 new vendors', up: true },
    ],
    quickActions: [
      { label: 'Browse Marketplace', icon: '🛒' },
      { label: 'Reorder Favorites', icon: '🔄' },
      { label: 'Track Deliveries', icon: '📍' },
      { label: 'Hire Contractor', icon: '👷' },
    ],
    recentActivity: [
      { text: 'Delivery arriving today — High Desert Mfg, $2,800 order', time: '1h ago', type: 'delivery' },
      { text: 'Reorder triggered — Blue Dream Flower (auto)', time: '6h ago', type: 'auto' },
      { text: 'New vendor approved — Sunset Labs NM', time: '1d ago', type: 'vendor' },
      { text: 'Invoice paid — Mesa Verde Farms, $1,400', time: '2d ago', type: 'payment' },
    ],
  },
  contractor: {
    label: 'Contractor', emoji: '👷', color: 'amber', borderColor: 'border-amber-700/40', textColor: 'text-amber-400',
    stats: [
      { label: 'Active Jobs', value: '2', change: '1 ending this week', up: false },
      { label: 'Open Bids', value: '5', change: '3 new opportunities', up: true },
      { label: 'Earnings MTD', value: '$8,640', change: '+12% vs last month', up: true },
      { label: 'Worker Rating', value: '4.9★', change: 'Top 5% on platform', up: true },
    ],
    quickActions: [
      { label: 'Browse Job Board', icon: '📋' },
      { label: 'Submit Bid', icon: '✍️' },
      { label: 'Log Hours', icon: '⏱️' },
      { label: 'Update Profile', icon: '👤' },
    ],
    recentActivity: [
      { text: 'New job posted — Trim crew needed, Rio Rancho Farm, 2 weeks', time: '30m ago', type: 'job' },
      { text: 'Bid accepted — Packaging at Albuquerque Extracts', time: '1d ago', type: 'bid' },
      { text: 'Hours approved — Desert Sun Farm, 40hrs @ $20/hr', time: '2d ago', type: 'payment' },
      { text: 'License renewal reminder — expires in 45 days', time: '3d ago', type: 'alert' },
    ],
  },
  logistics: {
    label: 'Logistics', emoji: '🚚', color: 'cyan', borderColor: 'border-cyan-700/40', textColor: 'text-cyan-400',
    stats: [
      { label: 'Active Routes', value: '3', change: '1 en route now', up: true },
      { label: 'Deliveries Today', value: '8', change: '3 completed', up: true },
      { label: 'Revenue MTD', value: '$18,400', change: '+9% vs last month', up: true },
      { label: 'Compliance Rate', value: '100%', change: 'No violations', up: true },
    ],
    quickActions: [
      { label: 'New Transport Job', icon: '+ 🚚' },
      { label: 'Generate Manifest', icon: '📄' },
      { label: 'Track Vehicles', icon: '📍' },
      { label: 'View Schedule', icon: '📅' },
    ],
    recentActivity: [
      { text: 'Manifest generated — Albuquerque → Santa Fe, $4,200 order', time: '1h ago', type: 'manifest' },
      { text: 'Delivery confirmed — Mesa Verde Dispensary, 8:42am', time: '4h ago', type: 'delivery' },
      { text: 'New transport job posted — $380, 45mi route', time: '6h ago', type: 'job' },
      { text: 'Vehicle inspection passed — Unit #3', time: '1d ago', type: 'compliance' },
    ],
  },
  fulfillment: {
    label: 'Fulfillment Hub', emoji: '📦', color: 'rose', borderColor: 'border-rose-700/40', textColor: 'text-rose-400',
    stats: [
      { label: 'Units in Storage', value: '12,400', change: '+800 received today', up: true },
      { label: 'Orders to Pick', value: '34', change: '8 urgent', up: false },
      { label: 'Revenue MTD', value: '$31,200', change: '+15% vs last month', up: true },
      { label: 'Storage Utilization', value: '74%', change: '26% capacity left', up: false },
    ],
    quickActions: [
      { label: 'Receive Inventory', icon: '📥' },
      { label: 'Pick & Pack Queue', icon: '📦' },
      { label: 'Schedule Pickup', icon: '🚚' },
      { label: 'Inventory Report', icon: '📊' },
    ],
    recentActivity: [
      { text: 'Inbound received — High Desert Mfg, 1,200 units', time: '2h ago', type: 'receive' },
      { text: 'Order packed — Desert Rose RX, 80 units, awaiting pickup', time: '4h ago', type: 'packed' },
      { text: 'New storage contract — Sunset Labs, 3 months', time: '1d ago', type: 'contract' },
      { text: 'Inventory count completed — Zone A, 99.8% accuracy', time: '2d ago', type: 'audit' },
    ],
  },
}

const activityColors: Record<string, string> = {
  order: 'bg-emerald-500', inquiry: 'bg-blue-500', doc: 'bg-purple-500', approved: 'bg-amber-500',
  production: 'bg-blue-500', listing: 'bg-emerald-500', delivery: 'bg-cyan-500', payment: 'bg-amber-500',
  auto: 'bg-purple-500', vendor: 'bg-rose-500', job: 'bg-amber-500', bid: 'bg-emerald-500',
  alert: 'bg-red-500', manifest: 'bg-cyan-500', compliance: 'bg-emerald-500', receive: 'bg-blue-500',
  packed: 'bg-purple-500', contract: 'bg-amber-500', audit: 'bg-emerald-500',
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ role, onRoleChange }: { role: OperatorRole; onRoleChange: (r: OperatorRole) => void }) {
  const navItems = [
    { icon: '⬜', label: 'Dashboard', active: true },
    { icon: '🛒', label: 'Marketplace', active: false },
    { icon: '📋', label: 'Orders', active: false },
    { icon: '📦', label: 'Inventory', active: false },
    { icon: '🚚', label: 'Logistics', active: false },
    { icon: '👷', label: 'Contractors', active: false },
    { icon: '💳', label: 'Payments', active: false },
    { icon: '📊', label: 'Analytics', active: false },
    { icon: '⚙️', label: 'Settings', active: false },
  ]

  const roles: OperatorRole[] = ['cultivator', 'manufacturer', 'dispensary', 'contractor', 'logistics', 'fulfillment']

  return (
    <div className="w-64 min-h-screen bg-orq-surface border-r border-orq-border flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-orq-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orq-green flex items-center justify-center">
            <span className="text-black font-black text-sm">O</span>
          </div>
          <div>
            <div className="font-bold text-orq-text text-sm">Orqestra</div>
            <div className="text-xs text-orq-text-3">Operator Portal</div>
          </div>
        </div>
      </div>

      {/* Role switcher (demo only) */}
      <div className="p-4 border-b border-orq-border">
        <div className="text-xs text-orq-text-3 mb-2 uppercase tracking-wider font-semibold">Preview as:</div>
        <select
          value={role}
          onChange={e => onRoleChange(e.target.value as OperatorRole)}
          className="w-full bg-orq-elevated border border-orq-border rounded-lg px-3 py-2 text-xs text-orq-text focus:outline-none focus:border-orq-green/50"
        >
          {roles.map(r => (
            <option key={r} value={r}>{roleConfig[r].emoji} {roleConfig[r].label}</option>
          ))}
        </select>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3">
        {navItems.map(item => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition ${
              item.active
                ? 'bg-orq-green/10 border border-orq-green/20 text-orq-green font-medium'
                : 'text-orq-text-2 hover:bg-orq-elevated hover:text-orq-text'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-orq-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-orq-green/20 flex items-center justify-center text-orq-green text-sm font-bold">
            D
          </div>
          <div>
            <div className="text-xs font-semibold text-orq-text">Demo Operator</div>
            <div className="text-xs text-orq-text-3">New Mexico · Verified ✓</div>
          </div>
        </div>
        <Link href="/onboarding" className="block w-full text-center bg-orq-green hover:bg-green-400 text-black text-xs font-semibold py-2 rounded-lg transition">
          Complete Signup →
        </Link>
      </div>
    </div>
  )
}

// ─── Dashboard Content ─────────────────────────────────────────────────────────
function DashboardContent({ role }: { role: OperatorRole }) {
  const config = roleConfig[role]

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-[#070D09]/95 backdrop-blur-md border-b border-orq-border px-8 py-4 flex items-center justify-between z-10">
        <div>
          <h1 className="text-xl font-bold text-orq-text">{config.emoji} {config.label} Dashboard</h1>
          <p className="text-xs text-orq-text-3">Welcome back · New Mexico · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="w-9 h-9 rounded-lg bg-orq-elevated border border-orq-border flex items-center justify-center text-orq-text-2 hover:border-orq-green/40 transition">
              🔔
            </button>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orq-green rounded-full flex items-center justify-center text-black text-xs font-bold">3</div>
          </div>
          <button className="w-9 h-9 rounded-lg bg-orq-elevated border border-orq-border flex items-center justify-center text-orq-text-2 hover:border-orq-green/40 transition">
            ⚙️
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Banner for demo */}
        <div className="bg-orq-green/10 border border-orq-green/30 rounded-xl p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-orq-green text-xl">🚀</span>
            <div>
              <div className="text-sm font-semibold text-orq-text">You're viewing a preview dashboard</div>
              <div className="text-xs text-orq-text-2">Complete onboarding to activate your account and access live data.</div>
            </div>
          </div>
          <Link href="/onboarding" className="bg-orq-green hover:bg-green-400 text-black text-xs font-bold px-4 py-2 rounded-lg transition whitespace-nowrap">
            Complete Setup
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {config.stats.map((stat, i) => (
            <div key={i} className="bg-orq-surface border border-orq-border rounded-xl p-5">
              <div className="text-xs text-orq-text-3 uppercase tracking-wider mb-2">{stat.label}</div>
              <div className="text-2xl font-black text-orq-text mb-1">{stat.value}</div>
              <div className={`text-xs flex items-center gap-1 ${stat.up ? 'text-emerald-400' : 'text-orq-text-3'}`}>
                {stat.up ? '↑' : '↓'} {stat.change}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-orq-surface border border-orq-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-orq-text mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {config.quickActions.map((action, i) => (
                  <button
                    key={i}
                    className="bg-orq-elevated border border-orq-border rounded-xl p-4 text-center hover:border-orq-green/30 hover:bg-orq-elevated/80 transition group"
                  >
                    <div className="text-2xl mb-2">{action.icon}</div>
                    <div className="text-xs text-orq-text-2 group-hover:text-orq-text transition leading-tight">{action.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Marketplace spotlight */}
            <div className="bg-orq-surface border border-orq-border rounded-xl p-5 mt-4">
              <h3 className="text-sm font-semibold text-orq-text mb-4">Marketplace Spotlight</h3>
              <div className="space-y-3">
                {[
                  { name: 'Blue Dream Flower', price: '$1,200/lb', vendor: 'Mesa Verde Farms' },
                  { name: 'Live Resin Carts', price: '$14.50/unit', vendor: 'NM Extract Labs' },
                  { name: 'Pre-Roll 20ct Boxes', price: '$380/box', vendor: 'High Desert Mfg' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-orq-border last:border-0">
                    <div>
                      <div className="text-xs font-medium text-orq-text">{item.name}</div>
                      <div className="text-xs text-orq-text-3">{item.vendor}</div>
                    </div>
                    <div className="text-xs font-semibold text-orq-green">{item.price}</div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-xs text-orq-green hover:text-emerald-300 transition font-medium">
                View Full Marketplace →
              </button>
            </div>
          </div>

          {/* Activity feed + chart */}
          <div className="lg:col-span-2 space-y-5">
            {/* Revenue chart (simplified visual) */}
            <div className="bg-orq-surface border border-orq-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-orq-text">Revenue Overview</h3>
                <div className="flex gap-2">
                  {['7D', '30D', '90D'].map(p => (
                    <button key={p} className={`text-xs px-2.5 py-1 rounded-md transition ${p === '30D' ? 'bg-orq-green/20 text-orq-green border border-orq-green/30' : 'text-orq-text-3 hover:text-orq-text'}`}>{p}</button>
                  ))}
                </div>
              </div>
              {/* Simplified bar chart */}
              <div className="flex items-end gap-2 h-28">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100, 80, 88, 72, 92, 68, 85, 95, 78, 90, 82, 88, 94, 79, 86, 91, 98, 84, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all"
                    style={{
                      height: `${h}%`,
                      background: i >= 27
                        ? 'linear-gradient(to top, #22C55E, #86EFAC)'
                        : '#1E3326',
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-orq-text-3">
                <span>Mar 1</span><span>Mar 10</span><span>Mar 20</span><span>Mar 31</span>
              </div>
            </div>

            {/* Activity feed */}
            <div className="bg-orq-surface border border-orq-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-orq-text">Recent Activity</h3>
                <button className="text-xs text-orq-green hover:text-emerald-300 transition">View All</button>
              </div>
              <div className="space-y-4">
                {config.recentActivity.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activityColors[item.type] || 'bg-orq-green'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-orq-text-2 leading-relaxed">{item.text}</p>
                      <span className="text-xs text-orq-text-3">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance status */}
            <div className="bg-orq-surface border border-orq-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-orq-text mb-4">Compliance Status</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'License', status: 'Active', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50' },
                  { label: 'METRC', status: 'Synced', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50' },
                  { label: 'COAs', status: '12 on file', color: 'text-blue-400 bg-blue-950/60 border-blue-800/50' },
                ].map((c, i) => (
                  <div key={i} className={`rounded-lg border p-3 ${c.color}`}>
                    <div className="text-xs opacity-70 mb-1">{c.label}</div>
                    <div className="text-sm font-semibold">{c.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard Page ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const [role, setRole] = useState<OperatorRole>('cultivator')

  return (
    <div className="min-h-screen bg-[#070D09] flex">
      <Sidebar role={role} onRoleChange={setRole} />
      <DashboardContent role={role} />
    </div>
  )
}
