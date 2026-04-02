import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import ListingsClient from './ListingsClient'

interface Operator {
  id: string
  business_name: string
  operator_type: string
  account_status: string
}

interface ListingOperator {
  business_name: string
  city: string | null
  operator_type: string
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
  strain_name: string | null
  thc_pct: number | null
  cbd_pct: number | null
  description: string | null
  operator_id: string
  created_at: string
  operators: ListingOperator | null
}

export default async function ListingsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/signin?redirect=/listings')

  const { data: operatorData } = await supabase
    .from('operators')
    .select('id, business_name, operator_type, account_status')
    .eq('user_id', user.id)
    .single()

  if (!operatorData) redirect('/onboarding')

  const op = operatorData as Operator

  if (op.account_status === 'pending') redirect('/onboarding/pending')
  if (op.account_status === 'rejected') redirect('/onboarding/pending')
  if (op.account_status === 'suspended') redirect('/suspended')

  const isDispensary = op.operator_type === 'dispensary'

  let query = supabase
    .from('listings')
    .select('id, title, category, price_per_unit, unit, available_qty, min_order_qty, status, strain_name, thc_pct, cbd_pct, description, operator_id, created_at, operators(business_name, city, operator_type)')
    .order('created_at', { ascending: false })

  if (isDispensary) {
    // Dispensary sees all active listings from other operators
    query = query.eq('status', 'active').neq('operator_id', op.id)
  } else {
    // Cultivators/manufacturers see their own listings
    query = query.eq('operator_id', op.id)
  }

  const { data: listingsData } = await query
  const listings = (listingsData ?? []) as Listing[]

  return (
    <ListingsClient
      operator={op}
      listings={listings}
      isDispensary={isDispensary}
    />
  )
}
