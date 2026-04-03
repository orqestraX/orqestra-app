import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/auth/sign-in')

  const { data: operator } = await supabase
    .from('operators')
    .select('id, business_name, operator_type, account_status, city, license_status, subscription_active')
    .eq('user_id', user.id)
    .single()

  if (!operator) redirect('/onboarding')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-1 text-sm">Manage your account and business profile</p>
          </div>
          <Link href="/dashboard" className="text-sm text-green-700 hover:underline">← Dashboard</Link>
        </div>

        {/* Business Profile */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Business Profile</h2>
          <dl className="space-y-3">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Business Name</dt>
              <dd className="font-medium text-gray-900">{operator.business_name}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Type</dt>
              <dd className="font-medium text-gray-900 capitalize">{operator.operator_type}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">City</dt>
              <dd className="font-medium text-gray-900">{operator.city ?? '—'}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Account Status</dt>
              <dd>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  operator.account_status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {operator.account_status}
                </span>
              </dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">License Status</dt>
              <dd>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  operator.license_status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : operator.license_status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {operator.license_status ?? 'not submitted'}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Account */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Account</h2>
          <dl className="space-y-3">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-gray-900">{user.email}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-500">Subscription</dt>
              <dd>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  operator.subscription_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {operator.subscription_active ? 'Active' : 'Inactive'}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-400 text-sm">
          More settings coming soon — notifications, payment methods, team members.
        </div>

      </div>
    </div>
  )
}
