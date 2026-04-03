import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'

interface Order {
  id: string
  product_name: string
  product_category: string
  quantity: number
  unit: string
  unit_price: number
  status: string
  created_at: string
}

interface PurchaseOrder extends Order {
  sellers: { business_name: string } | null
}

interface SaleOrder extends Order {
  buyers: { business_name: string } | null
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

function fmt$(n: number) { return '$' + (n).toFixed(2) }
function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function badge(status: string) {
  return STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-800'
}

export default async function OrdersPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/auth/sign-in')

  const { data: operator } = await supabase
    .from('operators')
    .select('id, business_name, operator_type, account_status')
    .eq('user_id', user.id)
    .single()

  if (!operator) redirect('/onboarding')
  if (operator.account_status !== 'active') redirect('/onboarding')

  const { data: purchases } = await supabase
    .from('orders')
    .select('id, product_name, product_category, quantity, unit, unit_price, status, created_at, sellers:operators!seller_id(business_name)')
    .eq('buyer_id', operator.id)
    .order('created_at', { ascending: false })

  const { data: sales } = await supabase
    .from('orders')
    .select('id, product_name, product_category, quantity, unit, unit_price, status, created_at, buyers:operators!buyer_id(business_name)')
    .eq('seller_id', operator.id)
    .order('created_at', { ascending: false })

  const isDispensary = operator.operator_type === 'dispensary'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-500 mt-1 text-sm">Track your purchases and sales</p>
          </div>
          <Link href="/dashboard" className="text-sm text-green-700 hover:underline">← Dashboard</Link>
        </div>

        {/* Purchases */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Purchases{' '}
            <span className="text-gray-400 font-normal text-sm">({purchases?.length ?? 0})</span>
          </h2>
          {!purchases?.length ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
              No purchases yet.{' '}
              <Link href={isDispensary ? '/marketplace' : '/marketplace'} className="text-green-700 hover:underline">
                Browse the marketplace
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {['Product', 'Seller', 'Qty', 'Total', 'Status', 'Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(purchases as PurchaseOrder[]).map(o => (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 text-sm">{o.product_name}</p>
                        <p className="text-xs text-gray-400 capitalize">{o.product_category}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{o.sellers?.business_name ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{o.quantity} {o.unit}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{fmt$(o.quantity * o.unit_price)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badge(o.status)}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{fmtDate(o.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Sales */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Sales{' '}
            <span className="text-gray-400 font-normal text-sm">({sales?.length ?? 0})</span>
          </h2>
          {!sales?.length ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500">
              No sales yet.{' '}
              <Link href="/listings/new" className="text-green-700 hover:underline">
                Create a listing
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    {['Product', 'Buyer', 'Qty', 'Total', 'Status', 'Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(sales as SaleOrder[]).map(o => (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 text-sm">{o.product_name}</p>
                        <p className="text-xs text-gray-400 capitalize">{o.product_category}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{o.buyers?.business_name ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{o.quantity} {o.unit}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{fmt$(o.quantity * o.unit_price)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badge(o.status)}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{fmtDate(o.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
