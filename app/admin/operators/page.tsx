'use client'
import { useEffect, useState, useCallback } from 'react'

type Operator = {
  id: string
  business_name: string
  operator_type: string
  account_status: string
  license_status: string
  email: string
  created_at: string
  nm_license_number?: string
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-900 text-green-300',
  pending: 'bg-yellow-900 text-yellow-300',
  suspended: 'bg-red-900 text-red-300',
  rejected: 'bg-gray-800 text-gray-400',
}
const LICENSE_COLORS: Record<string, string> = {
  verified: 'bg-green-900 text-green-300',
  pending: 'bg-yellow-900 text-yellow-300',
  rejected: 'bg-red-900 text-red-300',
  unsubmitted: 'bg-gray-800 text-gray-400',
}

export default function OperatorsPage() {
  const [operators, setOperators] = useState<Operator[]>([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/operators')
    const json = await res.json()
    setOperators(json.operators ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function updateStatus(id: string, status: string) {
    setActing(id)
    await fetch('/api/admin/operators', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, account_status: status }),
    })
    await load()
    setActing(null)
  }

  const filtered = operators.filter(op => {
    const matchStatus = filter === 'all' || op.account_status === filter
    const matchSearch = !search || op.business_name.toLowerCase().includes(search.toLowerCase()) || op.email.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Operators</h1>
          <p className="text-gray-400 mt-1">{operators.length} total on the network</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
        />
        {['all','pending','active','suspended'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === s ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Business</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Account</th>
              <th className="px-4 py-3 text-left">License</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-500">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-500">No operators found</td></tr>
            ) : filtered.map(op => (
              <tr key={op.id} className="hover:bg-gray-850 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{op.business_name}</div>
                  {op.nm_license_number && <div className="text-xs text-gray-500 font-mono">{op.nm_license_number}</div>}
                </td>
                <td className="px-4 py-3 text-gray-400 capitalize">{op.operator_type}</td>
                <td className="px-4 py-3 text-gray-400">{op.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[op.account_status] ?? 'bg-gray-800 text-gray-400'}`}>
                    {op.account_status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${LICENSE_COLORS[op.license_status] ?? 'bg-gray-800 text-gray-400'}`}>
                    {op.license_status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(op.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {op.account_status !== 'active' && (
                      <button onClick={() => updateStatus(op.id, 'active')} disabled={acting === op.id}
                        className="px-2 py-1 text-xs bg-green-900 text-green-300 rounded hover:bg-green-800 disabled:opacity-50">
                        Activate
                      </button>
                    )}
                    {op.account_status !== 'suspended' && (
                      <button onClick={() => updateStatus(op.id, 'suspended')} disabled={acting === op.id}
                        className="px-2 py-1 text-xs bg-red-900 text-red-300 rounded hover:bg-red-800 disabled:opacity-50">
                        Suspend
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
