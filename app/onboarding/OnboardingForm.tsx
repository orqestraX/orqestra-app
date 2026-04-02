'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const OPERATOR_TYPES = [
  { id: 'cultivator',   label: 'Cultivator',   icon: '🌱', desc: 'Growing & harvesting cannabis' },
  { id: 'manufacturer', label: 'Manufacturer',  icon: '⚗️',  desc: 'Processing & production' },
  { id: 'dispensary',   label: 'Dispensary',    icon: '🏪', desc: 'Retail & patient sales' },
  { id: 'courier',      label: 'Courier',       icon: '🚚', desc: 'Licensed cannabis transport' },
]

interface Props {
  userEmail: string
}

export default function OnboardingForm({ userEmail }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [operatorType, setOperatorType] = useState('')
  const [form, setForm] = useState({
    business_name: '',
    contact_name: '',
    phone: '',
    city: '',
    nm_license_number: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const update = (key: string, val: string) =>
    setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const { data: { user }, error: authErr } = await supabase.auth.getUser()
      if (authErr || !user) throw new Error('Session expired — please sign in again.')
      const res = await fetch('/api/operators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operator_type: operatorType,
          business_name: form.business_name.trim(),
          contact_name: form.contact_name.trim(),
          phone: form.phone.trim() || null,
          city: form.city.trim() || null,
          nm_license_number: form.nm_license_number.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create profile.')
      router.push('/onboarding/pending')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#070d09]">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <span className="text-white font-bold text-lg tracking-tight">Orqestra</span>
        <span className="text-gray-500 text-sm">{userEmail}</span>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-12">
        <div className="flex gap-2 mb-10">
          {[1, 2].map(s => (
            <div
              key={s}
              className={[
                'flex-1 h-1 rounded-full transition-all',
                s <= step ? 'bg-[#4ade80]' : 'bg-white/10',
              ].join(' ')}
            />
          ))}
        </div>

        {step === 1 && (
          <>
            <div className="mb-8">
              <p className="text-[#4ade80] text-sm font-medium mb-2">Step 1 of 2</p>
              <h1 className="text-3xl font-bold text-white mb-2">What type of operator are you?</h1>
              <p className="text-gray-400">Orqestra connects every part of the New Mexico cannabis supply chain.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {OPERATOR_TYPES.map(op => (
                <button
                  key={op.id}
                  onClick={() => setOperatorType(op.id)}
                  className={[
                    'text-left p-4 rounded-2xl border transition-all',
                    operatorType === op.id
                      ? 'bg-[#4ade80]/10 border-[#4ade80]'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20',
                  ].join(' ')}
                >
                  <span className="text-2xl block mb-2">{op.icon}</span>
                  <p className={['font-semibold mb-0.5', operatorType === op.id ? 'text-white' : 'text-gray-200'].join(' ')}>
                    {op.label}
                  </p>
                  <p className="text-gray-500 text-xs">{op.desc}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => operatorType && setStep(2)}
              disabled={!operatorType}
              className={[
                'w-full py-4 rounded-2xl font-semibold text-base transition-all',
                operatorType
                  ? 'bg-[#4ade80] text-black hover:bg-[#4ade80]/90'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed',
              ].join(' ')}
            >
              Continue →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-8">
              <p className="text-[#4ade80] text-sm font-medium mb-2">Step 2 of 2</p>
              <h1 className="text-3xl font-bold text-white mb-2">Tell us about your operation</h1>
              <p className="text-gray-400">
                Your profile will be reviewed within 1–2 business days before marketplace access is granted.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'business_name', label: 'Business name', placeholder: 'Mesa Verde Farms LLC', required: true },
                { key: 'contact_name',  label: 'Your name',     placeholder: 'Xavier Roberts',        required: true },
                { key: 'phone',         label: 'Phone',         placeholder: '(505) 555-0100',         required: false },
                { key: 'city',          label: 'City (NM)',     placeholder: 'Albuquerque',            required: false },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-gray-400 text-sm block mb-1.5">
                    {f.label}
                    {!f.required && <span className="text-gray-600 ml-1">(optional)</span>}
                  </label>
                  <input
                    required={f.required}
                    value={(form as Record<string, string>)[f.key]}
                    onChange={e => update(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4ade80]/50 transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="text-gray-400 text-sm block mb-1.5">
                  NM license number
                  <span className="text-gray-600 ml-1">(optional — can add later)</span>
                </label>
                <input
                  value={form.nm_license_number}
                  onChange={e => update('nm_license_number', e.target.value)}
                  placeholder="NM-XXXX-00000"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4ade80]/50 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <span className="text-gray-500 text-sm">Registering as:</span>
                <span className="bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80] text-sm px-3 py-1 rounded-full capitalize">
                  {OPERATOR_TYPES.find(o => o.id === operatorType)?.icon} {operatorType}
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-600 hover:text-gray-400 text-xs underline ml-auto"
                >
                  Change
                </button>
              </div>

              {error && (
                <div className="bg-red-950/60 border border-red-800/50 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !form.business_name || !form.contact_name}
                className={[
                  'w-full py-4 rounded-2xl font-bold text-base transition-all mt-2',
                  !submitting && form.business_name && form.contact_name
                    ? 'bg-[#4ade80] text-black hover:bg-[#4ade80]/90'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed',
                ].join(' ')}
              >
                {submitting ? 'Creating your profile…' : 'Create My Profile →'}
              </button>
              <p className="text-gray-600 text-xs text-center pt-1">
                No payment required. You&apos;ll hear from us within 1–2 business days.
              </p>
            </form>
          </>
        )}
      </div>
    </main>
  )
}
