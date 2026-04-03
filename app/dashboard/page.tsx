—import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'

interface Operator {
  id: string
  business_name: string
  operator_type: string
  account_status: string
  license_status: string | null
  subscription_active: boolean | null
  city: string | null
}

interface Listing {
  id: string
  status: string
}

interface Order {
  id: string
  status: string
  total: number
  created_at: string
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/signin?redirect=/dashboard')

  const { data: operatorData } = await supabase
    .from('operators')
    .select('id, business_name, operator_type, account_status, license_status, subscription_active, city')
    .eq('user_id', user.id)
    .single()

  if (!operatorData) redirect('/onboarding')

  const op = operatorData as Operator

  if (op.account_status === 'pending') redirect('/onboarding/pending')
  if (op.account_status === 'rejected') redirect('/onboarding/pending')
  if (op.account_status === 'suspended') redirect('/suspended')

  const [listingsResult, sellerOrdersResult, buyerOrdersResult] = await Promise.all([
    supabase
      .from('listings')
      .select('id, status')
      .eq('operator_id', op.id)
      .eq('status', 'active'),
    supabase
      .from('orders')
      .select('id, status, total, created_at')
      .eq('seller_id', op.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('orders')
      .select('id, status, total, created_at')
      .eq('buyer_id', op.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const listings = (listingsResult.data ?? []) as Listing[]
  const sellerOrders = (sellerOrdersResult.data ?? []) as Order[]
  const buyerOrders = (buyerOrdersResult.data ?? []) as Order[]

  const isDispensary = op.operator_type === 'dispensary'
  const myOrders = isDispensary ? buyerOrders : sellerOrders
  const pendingOrders = myOrders.filter((o) => o.status === 'pending').length

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const mtdTotal = myOrders
    .filter((o) => o.created_at >= monthStart && o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0)

  const hasActivity = myOrders.length > 0 || listings.length > 0
  const complianceOk = op.license_status === 'verified' && op.subscription_active === true

  const typeLabel: Record<string, string> = {
    cultivator: 'Cultivator',
    manufacturer: 'Manufacturer',
    dispensary: 'Dispensary',
    courier: 'Courier',
  }
  const typeIcon: Record<string, string> = {
    cultivator: '🌱',
    manufacturer: '⚙️',
    dispensary: '🏪',
    courier: '🚚',
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '⊞' },
    { href: isDispensary ? '/marketplace' : '/listings', label: isDispensary ? 'Marketplace' : 'My Listings', icon: isDispensary ? '🛒' : '📦' },
    
    { href: '/orders', label: 'Orders', icon: '📋' },
    { href: '/settings', label: 'Settings', icon: '⚙' },
    { href: '/settings', label: 'Settings', icon: '⚙' },
  ]

  const stats = [
    {
      label: isDispensary ? 'Open Orders' : 'Active Listings',
      value: isDispensary
        ? myOrders.filter((o) => ['pending', 'confirmed', 'in_transit'].includes(o.status)).length
        : listings.length,
      sub: isDispensary ? 'in progress' : 'available to buy',
      color: '#7c3aed',
    },
    {
      label: 'Pending',
      value: pendingOrders,
      sub: 'awaiting confirmation',
      color: '#d97706',
    },
    {
      label: isDispensary ? 'Spend MTD' : 'Revenue MTD',
      value: `$${mtdTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
      color: '#059669',
    },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f1117', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <aside style={{ width: 240, background: '#1a1d2e', borderRight: '1px solid #2d3148', display: 'flex', flexDirection: 'column', padding: '24px 0' }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #2d3148' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#7c3aed', letterSpacing: '-0.5px' }}>Orqestra</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cannabis OS</div>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#94a3b8', textDecoration: 'none', fontSize: 14, marginBottom: 2 }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #2d3148' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{op.business_name}</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
            {typeIcon[op.operator_type]} {typeLabel[op.operator_type] ?? op.operator_type}
            {op.city ? ` · ${op.city}` : ''}
          </div>
          <div style={{ marginTop: 8 }}>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: op.account_status === 'active' ? '#14532d' : '#713f12', color: op.account_status === 'active' ? '#86efac' : '#fde68a' }}>
              {op.account_status}
            </span>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: 'auto', padding: '32px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
              Welcome back, {op.business_name}
            </h1>
            <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>
              {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          {!complianceOk && (
            <div style={{ background: '#451a03', border: '1px solid #92400e', borderRadius: 8, padding: '10px 16px', fontSize: 13, color: '#fde68a', maxWidth: 280 }}>
              Compliance action required — check your license and subscription status.
            </div>
          )}
        </div>

        {!hasActivity && (
          <div style={{ background: '#1a1d2e', border: '1px dashed #2d3148', borderRadius: 12, padding: '40px 32px', textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{typeIcon[op.operator_type] ?? '🌿'}</div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#f1f5f9', margin: '0 0 8px' }}>
              {isDispensary ? 'Ready to source?' : 'Ready to sell?'}
            </h2>
            <p style={{ color: '#64748b', fontSize: 14, margin: '0 auto 20px', maxWidth: 400 }}>
              {isDispensary
                ? 'Browse the marketplace to find cultivators and manufacturers in New Mexico.'
                : 'Create your first listing to start selling to dispensaries across New Mexico.'}
            </p>
            <Link
              href={isDispensary ? '/listings' : '/listings/new'}
              style={{ display: 'inline-block', background: '#7c3aed', color: '#fff', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}
            >
              {isDispensary ? 'Browse Marketplace' : 'Create Listing'}
            </Link>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ background: '#1a1d2e', border: '1px solid #2d3148', borderRadius: 12, padding: '24px' }}>
              <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{stat.label}</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#1a1d2e', border: '1px solid #2d3148', borderRadius: 12, padding: '24px' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', margin: '0 0 16px' }}>Recent Activity</h2>
          {myOrders.length === 0 ? (
            <p style={{ color: '#475569', fontSize: 14 }}>No orders yet — activity will appear here once transactions begin.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2d3148' }}>
                  {['Order ID', 'Status', 'Total', 'Date'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myOrders.slice(0, 10).map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #1e2235' }}>
                    <td style={{ padding: '10px 12px', color: '#94a3b8', fontFamily: 'monospace' }}>{order.id.slice(0, 8)}&hellip;</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        padding: '2px 10px', borderRadius: 999, fontSize: 11, border: '1px solid #2d3148',
                        background: order.status === 'delivered' ? '#14532d' : order.status === 'pending' ? '#1e3a5f' : '#1a1d2e',
                        color: order.status === 'delivered' ? '#86efac' : order.status === 'pending' ? '#93c5fd' : '#94a3b8',
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#e2e8f0' }}>{(order.total || 0).toFixed(2)}</td>
                    <td style={{ padding: '10px 12px', color: '#64748b' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
