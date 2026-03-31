'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Operator types definition
const operatorTypes = [
  {
    id: 'cultivator',
    label: 'Cultivator',
    emoji: '🌱',
    tag: 'Farm / Grow Operation',
    desc: 'You grow cannabis and sell to manufacturers and dispensaries.',
    color: 'emerald',
  },
  {
    id: 'manufacturer',
    label: 'Manufacturer',
    emoji: '🏭',
    tag: 'Processor / Lab',
    desc: 'You process cannabis into oils, edibles, pre-rolls, or extracts.',
    color: 'blue',
  },
  {
    id: 'dispensary',
    label: 'Dispensary',
    emoji: '🏪',
    tag: 'Retail Operator',
    desc: 'You sell cannabis products directly to consumers.',
    color: 'purple',
  },
  {
    id: 'contractor',
    label: 'Contractor',
    emoji: '👷',
    tag: 'Labor / Services',
    desc: 'You provide licensed cannabis labor or specialized services.',
    color: 'amber',
  },
  {
    id: 'logistics',
    label: 'Logistics',
    emoji: '🚚',
    tag: 'Transport & Delivery',
    desc: 'You transport cannabis products between licensed operators.',
    color: 'cyan',
  },
  {
    id: 'fulfillment',
    label: 'Fulfillment Hub',
    emoji: '📦',
    tag: 'Storage & Packaging',
    desc: 'You provide warehousing, packaging, and fulfillment services.',
    color: 'rose',
  },
]

const colorMap: Record<string, { bg: string; border: string; text: string; ring: string }> = {
  emerald: { bg: 'bg-emerald-950/60', border: 'border-emerald-700/50', text: 'text-emerald-400', ring: 'ring-emerald-500' },
  blue:    { bg: 'bg-blue-950/60',    border: 'border-blue-700/50',    text: 'text-blue-400',    ring: 'ring-blue-500' },
  purple:  { bg: 'bg-purple-950/60',  border: 'border-purple-700/50',  text: 'text-purple-400',  ring: 'ring-purple-500' },
  amber:   { bg: 'bg-amber-950/60',   border: 'border-amber-700/50',   text: 'text-amber-400',   ring: 'ring-amber-500' },
  cyan:    { bg: 'bg-cyan-950/60',    border: 'border-cyan-700/50',    text: 'text-cyan-400',    ring: 'ring-cyan-500' },
  rose:    { bg: 'bg-rose-950/60',    border: 'border-rose-700/50',    text: 'text-rose-400',    ring: 'ring-rose-500' },
}

// ─── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i + 1 < current
                ? 'bg-orq-green text-black'
                : i + 1 === current
                ? 'bg-orq-green text-black ring-4 ring-orq-green/20'
                : 'bg-orq-elevated border border-orq-border text-orq-text-3'
            }`}
          >
            {i + 1 < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`h-px w-12 transition-all ${i + 1 < current ? 'bg-orq-green' : 'bg-orq-border'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Step 1: Choose operator type ─────────────────────────────────────────────
function Step1({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-orq-text mb-2">What type of operator are you?</h2>
      <p className="text-orq-text-2 mb-8">Select the role that best describes your cannabis business. You can add more roles later.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {operatorTypes.map(op => {
          const c = colorMap[op.color]
          const isSelected = selected === op.id
          return (
            <button
              key={op.id}
              onClick={() => onSelect(op.id)}
              className={`relative text-left rounded-xl border p-5 transition-all ${
                isSelected
                  ? `${c.bg} ${c.border} ring-2 ${c.ring}`
                  : 'bg-orq-surface border-orq-border hover:border-orq-border/80 hover:bg-orq-elevated'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-orq-green rounded-full flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3.5"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
              )}
              <div className="text-3xl mb-3">{op.emoji}</div>
              <div className="font-semibold text-orq-text mb-1">{op.label}</div>
              <div className={`text-xs ${isSelected ? c.text : 'text-orq-text-3'} mb-2`}>{op.tag}</div>
              <div className="text-xs text-orq-text-2 leading-relaxed">{op.desc}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 2: Business info ─────────────────────────────────────────────────────
function Step2({ data, onChange }: {
  data: { businessName: string; licenseNumber: string; email: string; phone: string; city: string }
  onChange: (field: string, val: string) => void
}) {
  const fields = [
    { id: 'businessName', label: 'Legal Business Name', placeholder: 'Desert Sun Cannabis Co.', type: 'text' },
    { id: 'licenseNumber', label: 'NM Cannabis License #', placeholder: 'NMCD-2026-XXXX', type: 'text' },
    { id: 'email', label: 'Business Email', placeholder: 'ops@yourbusiness.com', type: 'email' },
    { id: 'phone', label: 'Phone Number', placeholder: '(505) 555-0100', type: 'tel' },
    { id: 'city', label: 'City / Location', placeholder: 'Albuquerque', type: 'text' },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold text-orq-text mb-2">Tell us about your business</h2>
      <p className="text-orq-text-2 mb-8">We verify all operators with the NM Cannabis Control Division. This usually takes under 24 hours.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map(f => (
          <div key={f.id} className={f.id === 'email' ? 'md:col-span-2' : ''}>
            <label className="block text-xs font-semibold text-orq-text-2 uppercase tracking-wider mb-2">{f.label}</label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={(data as Record<string, string>)[f.id]}
              onChange={e => onChange(f.id, e.target.value)}
              className="w-full bg-orq-elevated border border-orq-border rounded-lg px-4 py-3 text-sm text-orq-text placeholder-orq-text-3 focus:outline-none focus:border-orq-green/60 focus:ring-1 focus:ring-orq-green/20 transition"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-orq-green/5 border border-orq-green/20 rounded-xl flex gap-3">
        <span className="text-orq-green text-xl">🔒</span>
        <div>
          <div className="text-sm font-semibold text-orq-text mb-1">Secure & Verified</div>
          <div className="text-xs text-orq-text-2">Your information is encrypted and used only for license verification. We comply with all NM Cannabis Control Division data requirements.</div>
        </div>
      </div>
    </div>
  )
}

// ─── Step 3: Plan selection ────────────────────────────────────────────────────
function Step3({ selected, onSelect }: { selected: string; onSelect: (plan: string) => void }) {
  const plans = [
    { id: 'starter', name: 'Starter', price: '$99/mo', desc: 'Great for small operators just getting started.', features: ['Marketplace access', '50 listings', '3% fee', 'Email support'] },
    { id: 'pro', name: 'Professional', price: '$299/mo', desc: 'For growing operators who need automation.', features: ['Unlimited listings', '1.5% fee', 'Logistics & contractor access', 'Advanced analytics', 'Priority support'], recommended: true },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom', desc: 'For large operators and MSOs.', features: ['Volume pricing', 'Custom integrations', 'Dedicated account manager', 'SLA guarantees'] },
  ]

  return (
    <div>
      <h2 className="text-3xl font-bold text-orq-text mb-2">Choose your plan</h2>
      <p className="text-orq-text-2 mb-8">Start free for 30 days. No credit card required. Cancel anytime.</p>
      <div className="grid md:grid-cols-3 gap-5">
        {plans.map(plan => (
          <button
            key={plan.id}
            onClick={() => onSelect(plan.id)}
            className={`relative text-left rounded-xl border p-6 transition-all ${
              selected === plan.id
                ? 'bg-orq-green/10 border-orq-green ring-2 ring-orq-green/30'
                : 'bg-orq-surface border-orq-border hover:bg-orq-elevated'
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-orq-green text-black text-xs font-bold px-3 py-1 rounded-full">Recommended</span>
              </div>
            )}
            {selected === plan.id && (
              <div className="absolute top-4 right-4 w-5 h-5 bg-orq-green rounded-full flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3.5"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
            )}
            <div className="font-bold text-orq-text mb-1">{plan.name}</div>
            <div className="text-2xl font-black text-orq-text mb-2">{plan.price}</div>
            <div className="text-xs text-orq-text-2 mb-4">{plan.desc}</div>
            <ul className="space-y-2">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-xs text-orq-text-2">
                  <span className="text-orq-green flex-shrink-0 mt-0.5">✓</span>{f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Step 4: Confirmation ──────────────────────────────────────────────────────
function Step4({ operatorType, businessName }: { operatorType: string; businessName: string }) {
  const op = operatorTypes.find(o => o.id === operatorType)
  return (
    <div className="text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h2 className="text-3xl font-bold text-orq-text mb-3">You're almost in!</h2>
      <p className="text-orq-text-2 mb-8 max-w-lg mx-auto">
        <strong className="text-orq-text">{businessName || 'Your business'}</strong> has been submitted for verification as a{' '}
        <strong className="text-orq-green">{op?.label}</strong>. Our team will review your license within 24 hours and send you next steps.
      </p>

      <div className="bg-orq-surface border border-orq-border rounded-2xl p-8 text-left max-w-md mx-auto mb-8">
        <h4 className="font-semibold text-orq-text mb-4">What happens next:</h4>
        <div className="space-y-4">
          {[
            { step: '1', text: 'License verification with NM CCD (under 24 hours)' },
            { step: '2', text: 'Account activation email with login credentials' },
            { step: '3', text: 'Onboarding call with our operator success team' },
            { step: '4', text: 'Access to the full Orqestra marketplace' },
          ].map(item => (
            <div key={item.step} className="flex gap-4">
              <div className="w-7 h-7 rounded-full bg-orq-green/10 border border-orq-green/30 text-orq-green text-xs font-bold flex items-center justify-center flex-shrink-0">
                {item.step}
              </div>
              <span className="text-sm text-orq-text-2 mt-0.5">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <Link href="/dashboard" className="btn-primary text-sm !py-3.5 !px-8">
        Preview Your Dashboard →
      </Link>
    </div>
  )
}

// ─── Main Onboarding Page ──────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [operatorType, setOperatorType] = useState('')
  const [plan, setPlan] = useState('pro')
  const [bizData, setBizData] = useState({ businessName: '', licenseNumber: '', email: '', phone: '', city: '' })

  const totalSteps = 4
  const canNext =
    (step === 1 && operatorType !== '') ||
    (step === 2 && bizData.businessName && bizData.email) ||
    (step === 3 && plan !== '') ||
    step === 4

  const handleNext = () => {
    if (step < totalSteps) setStep(s => s + 1)
  }
  const handleBack = () => {
    if (step > 1) setStep(s => s - 1)
  }

  return (
    <div className="min-h-screen bg-[#070D09] flex flex-col">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-orq-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orq-green flex items-center justify-center">
            <span className="text-black font-black text-sm">O</span>
          </div>
          <span className="font-bold text-lg text-orq-text">Orqestra</span>
        </Link>
        <div className="text-xs text-orq-text-3">
          Step {step} of {totalSteps}
        </div>
        <Link href="/" className="text-xs text-orq-text-3 hover:text-orq-text transition">
          ← Back to site
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-3xl">
          <StepIndicator current={step} total={totalSteps} />

          {step === 1 && <Step1 selected={operatorType} onSelect={setOperatorType} />}
          {step === 2 && (
            <Step2
              data={bizData}
              onChange={(field, val) => setBizData(prev => ({ ...prev, [field]: val }))}
            />
          )}
          {step === 3 && <Step3 selected={plan} onSelect={setPlan} />}
          {step === 4 && <Step4 operatorType={operatorType} businessName={bizData.businessName} />}

          {/* Navigation */}
          {step < 4 && (
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-orq-border">
              <button
                onClick={handleBack}
                className={`btn-secondary text-sm !py-2.5 !px-6 ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canNext}
                className={`btn-primary text-sm !py-2.5 !px-8 ${!canNext ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                {step === 3 ? 'Submit Application →' : 'Continue →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
