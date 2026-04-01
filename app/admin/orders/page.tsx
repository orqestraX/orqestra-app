'use client'
import { useEffect, useState, useCallback } from 'react'

type Order = {
  id: string
  status: string
  total: number
  platform_fee: number
  created_at: string
  buyer?: { business_name: string; email: string }
  seller?: { business_name: string; email: string }
  listing?: { title: string; category: string }
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-900 text-yellow-300',
  confirmed: 'bg-blue-900 text-blue-300',
  in_transit: 'bg-purple-900 text-purple-300',
  delivered: 'bg-green-900 text-green-300',
  cancelled: 'bg-gray-800 text-gray-400',
  disputed: 'bg-red-900 text-red-300',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/orders')
    const json = await res.json()
    setOrders(json.orders ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter
    const matchSearch = !search || 
      o.buyer?.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.seller?.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.listing?.title?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const gmv = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + (Number(o.total) || 0), 0)
  const fees = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + (Number(o.platform_fee) || 0), 0)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-gray-400 mt-1">{orders.length} total orders on the network</p>
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Delivered GMV</p>
          <p className="text-2xl font-bold text-green-400 mt-1">${(gmv / 100).toLocaleString()}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Platform Fees (3%)</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">${(fees / 100).toLocaleString()}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Active Orders</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{orders.filter(o => !['delivered','cancelled'].includes(o.status)).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search buyer, seller, or product..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
        />
        {['all','pending','confirmed','in_transit','delivered','disputed','cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filter === s ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {s.replace('_',' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Buyer → Seller</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Fee (3%)</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-500">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-500">No orders found</td></tr>
            ) : filtered.map(order => (
              <tr key={order.id} className="hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{order.id.slice(0,8)}</td>
                <td className="px-4 py-3">
                  <div className="text-white">{order.listing?.title ?? '—'}</div>
                  <div className="text-xs text-gray-500 capitalize">{order.listing?.category}</div>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  <div>{order.buyer?.business_name ?? '—'}</div>
                  <div className="text-gray-600">→ {order.seller?.business_name ?? '—'}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] ?? 'bg-gray-800 text-gray-400'}`}>
                    {order.status.replace('_',' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-white">${((Number(order.total) || 0)/100).toFixed(2)}</td>
                <td className="px-4 py-3 text-right text-purple-400">${((Number(order.platform_fee) || 0)/100).toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
