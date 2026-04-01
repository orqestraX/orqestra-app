import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Operator } from '@/lib/types'

// Returns current operator or null (for server components)
export async function getOperator(): Promise<Operator | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('operators').select('*').eq('user_id', user.id).single()
  return data
}

// Redirects to sign-in if not authenticated or not approved
export async function requireOperator(): Promise<Operator> {
  const op = await getOperator()
  if (!op) redirect('/auth/signin')
  if (op.account_status === 'pending') redirect('/onboarding/pending')
  if (op.account_status === 'suspended') redirect('/suspended')
  return op
}

// Requires admin role set in Supabase user_metadata
export async function requireAdmin(): Promise<Operator> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.role !== 'admin') redirect('/')
  const op = await getOperator()
  if (!op) redirect('/')
  return op
}