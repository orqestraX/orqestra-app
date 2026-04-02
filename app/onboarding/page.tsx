import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import OnboardingForm from './OnboardingForm'

export default async function OnboardingPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin?redirect=/onboarding')
  }

  const { data: operator } = await supabase
    .from('operators')
    .select('id, account_status')
    .eq('user_id', user.id)
    .single()

  if (operator) {
    if (operator.account_status === 'verified') redirect('/dashboard')
    redirect('/onboarding/pending')
  }

  return <OnboardingForm userEmail={user.email ?? ''} />
}
