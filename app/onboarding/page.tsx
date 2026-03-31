'use client'
import { useState } from 'react'
import Link from 'next/link'

const OPERATOR_TYPES = [
  { id: 'cultivator', label: 'Cultivator', icon: '🌱', desc: 'Growing & harvesting' },
  { id: 'manufacturer', label: 'Manufacturer', icon: '⚗️', desc: 'Processing & production' },
  { id: 'dispensary', label: 'Dispensary', icon: '🏪', desc: 'Retail & distribution' },
  { id: 'courier', label: 'Courier', icon: '🚚', desc: 'Transport & delivery' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [operatorType, setOperatorType] = useState('')
  const [form, setForm] = useState({ name: '', business: '', email: '', license: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true) }

  if (submitted) {
    return (
      <main className="min-h-screen bg-orq-black flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-orq-green/10 border border-orq-green/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">You&apos;re on the list</h1>
          <p className="text-gray-400 mb-2">We&apos;ll reach out to <span className="text-white font-medium">{form.email}</span> when Orqestra opens in New Mexico.</p>
          <p className="text-gray-500 text-sm mb-8">Early operators get priority access and reduced transaction fees for the first 12 months.</p>
          <Link href="/" className="text-orq-green hover:underline text-sm">&larr; Back to home</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-orq-black">
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="text-white font-bold text-lg tracking-tight">Orqestra</Link>
        <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">&larr; Back</Link>
      </nav>
      <div className="max-w-xl mx-auto px-6 py-12">
        <div className="flex gap-2 mb-10">
          {[1, 2].map(s => (<div key={s} className={['flex-1 h-1 rounded-full transition-all', s <= step ? 'bg-orq-green' : 'bg-white/10'].join(' ')} />))}
        </div>
        {step === 1 && (
          <>
            <div className="mb-8">
              <p className="text-orq-green text-sm font-medium mb-2">Step 1 of 2</p>
              <h1 className="text-3xl font-bold text-white mb-2">What type of operator are you?</h1>
              <p className="text-gray-400">Orqestra is built for every part of the New Mexico cannabis supply chain.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {OPERATOR_TYPES.map(op => (
                <button key={op.id} onClick={() => setOperatorType(op.id)}
                  className={['text-left p-4 rounded-2xl border transition-all', operatorType === op.id ? 'bg-orq-green/10 border-orq-green' : 'bg-white/[0.03] border-white/10 hover:border-white/20'].join(' ')}>
                  <span className="text-2xl block mb-2">{op.icon}</span>
                  <p className={['font-semibold mb-0.5', operatorType === op.id ? 'text-white' : 'text-gray-200'].join(' ')}>{op.label}</p>
                  <p className="text-gray-500 text-xs">{op.desc}</p>
                </button>
              ))}
            </div>
            <button onClick={() => operatorType && setStep(2)} disabled={!operatorType}
              className={['w-full py-4 rounded-2xl font-semibold text-base transition-all', operatorType ? 'bg-orq-green text-orq-black hover:bg-orq-green/90' : 'bg-white/5 text-gray-600 cursor-not-allowed'].join(' ')}>
              Continue &rarr;
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <div className="mb-8">
              <p className="text-orq-green text-sm font-medium mb-2">Step 2 of 2</p>
              <h1 className="text-3xl font-bold text-white mb-2">Tell us about your operation</h1>
              <p className="text-gray-400">We&apos;ll reach out to confirm your early access spot.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'name', label: 'Your name', placeholder: 'Xavier Roberts', type: 'text' },
                { key: 'business', label: 'Business name', placeholder: 'Your business', type: 'text' },
                { key: 'email', label: 'Business email', placeholder: 'you@yourbusiness.com', type: 'email' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-gray-400 text-sm block mb-1.5">{field.label}</label>
                  <input required type={field.type} value={(form as Record<string,string>)[field.key]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orq-green/50 transition-colors" />
                </div>
              ))}
              <div>
                <label className="text-gray-400 text-sm block mb-1.5">NM License <span className="text-gray-600">(optional)</span></label>
                <input value={form.license} onChange={e => setForm(f => ({ ...f, license: e.target.value }))}
                  placeholder="NM-XXXX-00000"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orq-green/50 transition-colors" />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-gray-500 text-sm">Joining as:</span>
                <span className="bg-orq-green/10 border border-orq-green/30 text-orq-green text-sm px-3 py-1 rounded-full capitalize">
                  {OPERATOR_TYPES.find(o => o.id === operatorType)?.icon} {operatorType}
                </span>
                <button type="button" onClick={() => setStep(1)} className="text-gray-600 hover:text-gray-400 text-xs underline ml-auto">Change</button>
              </div>
              <button type="submit" className="w-full bg-orq-green text-orq-black py-4 rounded-2xl font-bold text-base hover:bg-orq-green/90 transition-all mt-2">
                Request Early Access
              </button>
              <p className="text-gray-600 text-xs text-center pt-1">No payment required. We&apos;ll contact you before launch.</p>
            </form>
          </>
        )}
      </div>
    </main>
  )
}
