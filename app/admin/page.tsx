import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'

type AuditEvent = {
  created_at: string
  action: string
  target_id?: string | null
  actor_id?: string | null
}

async function getStats() {
  const supabase = createAdminClient()
  const [operators, orders, licenses, revenue] = await Promise.all([
    supabase.from('operators').select('account_status'),
    supabase.from('orders').select('status, total'),
    supabase.from('license_verifications').select('status'),
    supabase.from('orders').select('total').eq('status', 'delivered'),
  ])
  const ops = (operators.data ?? []) as { account_status: string }[]
  const ords = (orders.data ?? []) as { status: string; total: number }[]
  const licVerifs = (licenses.data ?? []) as { status: string }[]
  const rev = (revenue.data ?? []) as { total: number }[]
  return {
    totalOperators: ops.length,
    activeOperators: ops.filter((o) => o.account_status === 'active').length,
    pendingOperators: ops.filter((o) => o.account_status === 'pending').length,
    totalOrders: ords.length,
    activeOrders: ords.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length,
    pendingLicenses: licVerifs.filter((l) => l.status === 'pending').length,
    totalRevenue: rev.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
  }
}

async function getRecentActivity() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('audit_log')
    .select('created_at, action, target_id, actor_id')
    .order('created_at', { ascending: false })
    .limit(10)
  return (data ?? []) as AuditEvent[]
}

export default async function AdminPage() {
  const [stats, activity] = await Promise.all([getStats(), getRecentActivity()])

  const statCards = [
    { label: 'Total Operators', value: stats.totalOperators, sub: stats.activeOperators + ' active', color: 'text-green-400', href: '/admin/operators' },
    { label: 'Pending Approvals', value: stats.pendingOperators, sub: 'awaiting review', color: 'text-yellow-400', href: '/admin/operators?status=pending' },
    { label: 'License Queue', value: stats.pendingLicenses, sub: 'need verification', color: 'text-orange-400', href: '/admin/licenses' },
    { label: 'Active Orders', value: stats.activeOrders, sub: stats.totalOrders + ' total', color: 'text-blue-400', href: '/admin/orders' },
    { label: 'Platform Revenue', value: '$' + (stats.totalRevenue / 100).toLocaleString(), sub: '3% of GMV delivered', color: 'text-purple-400', href: '/admin/orders' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">New Mexico cannabis operator network</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 mb-10">
        {statCards.map(card => (
          <Link key={card.label} href={card.href} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{card.label}</p>
            <p className={"text-3xl font-bold " + card.color}>{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
          </Link>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-white">Recent Audit Activity</h2>
          <span className="text-xs text-gray-500">Last 10 events</span>
        </div>
        {activity.length === 0 ? (
          <p className="px-6 py-8 text-gray-500 text-sm text-center">No activity yet</p>
        ) : (
          <ul className="divide-y divide-gray-800">
            {activity.map((event, i) => (
              <li key={i} className="px-6 py-3 flex items-center gap-3">
                <span className="text-xs text-gray-500 font-mono w-44 shrink-0">
                  {new Date(event.created_at).toLocaleString()}
                </span>
                <span className="text-sm text-gray-300 flex-1">
                  <span className="text-green-400 font-medium">{event.action}</span>
                  {event.target_id ? <span className="text-gray-500"> → {event.target_id}</span> : null}
                </span>
                {event.actor_id ? (
                  <span className="text-xs text-gray-600 font-mono shrink-0">{event.actor_id.slice(0, 8)}</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
