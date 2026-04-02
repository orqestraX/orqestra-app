import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import NewListingForm from './NewListingForm'

export default async function NewListingPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/signin?redirect=/listings/new')

  const { data: operatorData } = await supabase
    .from('operators')
    .select('id, operator_type, account_status')
    .eq('user_id', user.id)
    .single()

  if (!operatorData) redirect('/onboarding')

  // Only verified non-dispensary operators can create listings
  if (operatorData.account_status !== 'verified') redirect('/dashboard')
  if (operatorData.operator_type === 'dispensary') redirect('/dashboard')

  return <NewListingForm />
}
