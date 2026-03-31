'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

// âââ Icon components (inline SVG to avoid import issues) ââââââââââââââââââââ
const LeafIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
)
const FactoryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
    <path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/>
  </svg>
)
const StoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
    <path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>
  </svg>
)
const HardHatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/>
    <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15V9a8 8 0 0 1 16 0v6"/>
  </svg>
)
const TruckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
    <path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
    <circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>
  </svg>
)
const BoxIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
  </svg>
)
const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
)
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
)

// âââ Data ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const operatorTypes = [
  {
    icon: <LeafIcon />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/50',
    border: 'border-emerald-900/50',
    label: 'Cultivators',
    tag: 'Farms & Grows',
    description: 'List your harvests, manage wholesale orders, track inventory, and connect directly with manufacturers and dispensaries. Cut out the middleman.',
    features: ['Live inventory listings', 'Bulk order management', 'COA document vault', 'Buyer network access'],
  },
  {
    icon: <FactoryIcon />,
    color: 'text-blue-400',
    bg: 'bg-blue-950/50',
    border: 'border-blue-900/50',
    label: 'Manufacturers',
    tag: 'Processors & Labs',
    description: 'Source raw material from vetted cultivators, manage production runs, and distribute finished products to dispensaries across the state.',
    features: ['Raw material sourcing', 'Production scheduling', 'Product catalog builder', 'Distribution network'],
  },
  {
    icon: <StoreIcon />,
    color: 'text-purple-400',
    bg: 'bg-purple-950/50',
    border: 'border-purple-900/50',
    label: 'Dispensaries',
    tag: 'Retail Operators',
    description: 'Browse and order from hundreds of verified vendors. Manage your purchasing, automate reorders, and get products delivered with full compliance.',
    features: ['Vendor marketplace', 'Automated reordering', 'POS integration ready', 'Compliance tracking'],
  },
  {
    icon: <HardHatIcon />,
    color: 'text-amber-400',
    bg: 'bg-amber-950/50',
    border: 'border-amber-900/50',
    label: 'Contractors',
    tag: 'Labor & Services',
    description: 'A dedicated labor marketplace for cannabis-licensed contractors - trimmers, extractors, packagers, and specialists - connected to operators who need them.',
    features: ['Job board & bidding', 'License verification', 'Timesheet management', 'Direct operator contracts'],
  },
  {
    icon: <TruckIcon />,
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/50',
    border: 'border-cyan-900/50',
    label: 'Logistics',
    tag: 'Transport & Delivery',
    description: 'Manage compliant cannabis transport jobs, track shipments in real time, and handle manifests - all inside one platform with GPS route tracking.',
    features: ['Manifest generation', 'GPS route tracking', 'Proof of delivery', 'Compliance audit trail'],
  },
  {
    icon: <BoxIcon />,
    color: 'text-rose-400',
    bg: 'bg-rose-950/50',
    border: 'border-rose-900/50',
    label: 'Fulfillment Hubs',
    tag: 'Storage & Packaging',
    description: 'Offer warehousing, packaging, and fulfillment services to operators who need scalable storage and order processing without the overhead.',
    features: ['Inventory storage', 'Pick & pack orders', 'White-label packaging', 'Hub network listing'],
  },
]

const platformFeatures = [
  {
    title: 'B2B Marketplace',
    desc: 'A live, searchable catalog of cannabis products across cultivators and manufacturers - with verified listings, lab results, and real-time stock.',
    icon: 'ð',
  },
  {
    title: 'Compliant Transactions',
    desc: 'Every order is tied to the state compliance layer. Manifests, COAs, and chain of custody are handled automatically.',
    icon: 'ð',
  },
  {
    title: 'Integrated Logistics',
    desc: 'Book transport, track shipments, and generate manifests from the same platform you use to order. No more phone calls.',
    icon: 'ð¦',
  },
  {
    title: 'Contractor Network',
    desc: 'Post jobs or bid on contracts in the first dedicated cannabis labor marketplace. Background-checked and licensed workers only.',
    icon: 'ð·',
  },
  {
    title: 'Payments & Invoicing',
    desc: 'Cannabis-friendly ACH and wire payments with automated invoicing, net terms management, and payment tracking.',
    icon: 'ð³',
  },
  {
    title: 'Analytics & Insights',
    desc: 'Dashboards for every operator type. Track sales, fulfillment rates, logistics costs, and market trends across your operations.',
    icon: 'ð',
  },
]

const pricingTiers = [
  {
    name: 'Starter',
    price: '$99',
    period: '/mo',
    desc: 'Perfect for small operators getting started on the platform.',
    color: 'border-orq-border',
    badge: null,
    features: [
      'Access to B2B marketplace',
      'Up to 50 listings',
      '3% transaction fee',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Get Started',
    ctaStyle: 'btn-secondary',
  },
  {
    name: 'Professional',
    price: '$299',
    period: '/mo',
    desc: 'Built for growing operators who need automation and volume.',
    color: 'border-orq-green/50',
    badge: 'Most Popular',
    features: [
      'Everything in Starter',
      'Unlimited listings',
      '1.5% transaction fee',
      'Logistics integration',
      'Contractor marketplace',
      'Advanced analytics',
      'Priority support',
    ],
    cta: 'Get Early Access',
    ctaStyle: 'btn-primary',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large multi-location operators, MSOs, and fulfillment hubs.',
    color: 'border-orq-gold/40',
    badge: null,
    features: [
      'Everything in Professional',
      'Volume transaction rates',
      'Dedicated account manager',
      'Custom API integrations',
      'White-label options',
      'SLA guarantees',
    ],
    cta: 'Contact Sales',
    ctaStyle: 'btn-secondary',
  },
]

const faqs = [
  {
    q: 'What states does Orqestra operate in?',
    a: 'We are launching in New Mexico first. Expansion to additional states is planned for Q3 2026.',
  },
  {
    q: 'Is Orqestra compliant with state cannabis regulations?',
    a: 'Yes. Every transaction, manifest, and inventory movement on Orqestra is built to align with New Mexico Cannabis Control Division requirements, including METRC integration.',
  },
  {
    q: 'Do I need a cannabis license to use Orqestra?',
    a: 'Yes. All operators on the platform must be licensed by the New Mexico Cannabis Control Division. We verify all licenses during onboarding.',
  },
  {
    q: 'How does payment processing work for cannabis businesses?',
    a: 'We support ACH transfers and wire payments through cannabis-friendly banking partners. We are actively integrating with additional payment processors.',
  },
]

// âââ Navbar ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#070D09]/95 backdrop-blur-md border-b border-orq-border shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="container-max px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orq-green flex items-center justify-center">
              <span className="text-black font-black text-sm">O</span>
            </div>
            <span className="font-bold text-xl text-orq-text tracking-tight">Orqestra</span>
            <span className="hidden md:block text-xs text-orq-text-3 border border-orq-border rounded-full px-2 py-0.5">NM Beta</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#platform" className="text-sm text-orq-text-2 hover:text-orq-text transition">Platform</a>
            <a href="#operators" className="text-sm text-orq-text-2 hover:text-orq-text transition">Operators</a>
            <a href="#pricing" className="text-sm text-orq-text-2 hover:text-orq-text transition">Pricing</a>
            <a href="#faq" className="text-sm text-orq-text-2 hover:text-orq-text transition">FAQ</a>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-orq-text-2 hover:text-orq-text transition px-4 py-2">
              Sign In
            </Link>
            <Link href="/onboarding" className="btn-primary text-sm !py-2 !px-5">
              Get Started <ArrowRightIcon />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-orq-text-2 p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-orq-surface border-t border-orq-border py-4 space-y-3">
            <a href="#platform" className="block px-4 py-2 text-orq-text-2 text-sm">Platform</a>
            <a href="#operators" className="block px-4 py-2 text-orq-text-2 text-sm">Operators</a>
            <a href="#pricing" className="block px-4 py-2 text-orq-text-2 text-sm">Pricing</a>
            <div className="px-4 pt-2 flex gap-3">
              <Link href="/onboarding" className="btn-primary text-sm !py-2">Get Started</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// âââ Hero âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function Hero() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#070D09]" />
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse 80% 50% at 50% -5%, #16532D55 0%, transparent 60%)'}} />
      <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse 50% 30% at 50% 110%, #F59E0B0A 0%, transparent 60%)'}} />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-900/15 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1.5s'}} />

      <div className="relative z-10 container-max text-center px-4 py-20">
        {/* Launch badge */}
        <div className="animate-fade-up inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/60 rounded-full px-4 py-2 text-sm text-emerald-400 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Now in Beta - New Mexico Cannabis Market
          <span className="text-emerald-600">→</span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up delay-100 text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05] mb-6">
          The Marketplace<br />
          <span className="gradient-text text-glow">for Cannabis Operators</span>
        </h1>

        {/* Subtext */}
        <p className="animate-fade-up delay-200 text-lg md:text-xl text-orq-text-2 max-w-3xl mx-auto mb-10 leading-relaxed">
          Orqestra connects every operator in the cannabis supply chain - cultivators, manufacturers, dispensaries, contractors, logistics, and fulfillment - on one powerful B2B platform. Think Amazon Business, built for cannabis.
        </p>

        {/* CTA row */}
        <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/onboarding" className="btn-primary text-base !py-4 !px-8 glow-green">
            Start Your Free Trial <ArrowRightIcon />
          </Link>
          <a href="#platform" className="btn-secondary text-base !py-4 !px-8">
            See the Platform
          </a>
        </div>

        {/* Email early access */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="animate-fade-up delay-400 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@business.com"
              className="flex-1 bg-orq-surface border border-orq-border rounded-lg px-4 py-3 text-sm text-orq-text placeholder-orq-text-3 focus:outline-none focus:border-orq-green/50 transition"
            />
            <button type="submit" className="bg-orq-gold hover:bg-amber-400 text-black font-semibold px-6 py-3 rounded-lg text-sm transition whitespace-nowrap">
              Join Waitlist
            </button>
          </form>
        ) : (
          <div className="animate-fade-up text-emerald-400 text-sm">
            â You're on the list! We'll be in touch shortly.
          </div>
        )}

        {/* Trust indicators */}
        <div className="animate-fade-up delay-500 flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-orq-text-3">
          <span className="flex items-center gap-1.5"><span className="text-orq-green"><CheckIcon /></span> NM Licensed Operators Only</span>
          <span className="text-orq-border">|</span>
          <span className="flex items-center gap-1.5"><span className="text-orq-green"><CheckIcon /></span> METRC-Compatible</span>
          <span className="text-orq-border">|</span>
          <span className="flex items-center gap-1.5"><span className="text-orq-green"><CheckIcon /></span> No Setup Fees</span>
          <span className="text-orq-border">|</span>
          <span className="flex items-center gap-1.5"><span className="text-orq-green"><CheckIcon /></span> Cancel Anytime</span>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-up delay-500 absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-orq-border rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-orq-green rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}

// âââ Stats Bar ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function StatsBar() {
  const stats = [
    { value: '6', label: 'Operator Types' },
    { value: '1', label: 'Unified Platform' },
    { value: '∞', label: 'Connections' },
    { value: 'NM', label: 'Launching Here' },
  ]
  return (
    <div className="border-y border-orq-border bg-orq-surface/50 backdrop-blur-sm">
      <div className="container-max px-4 md:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black text-orq-green mb-1">{s.value}</div>
              <div className="text-sm text-orq-text-3">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// âââ How it Works âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function HowItWorks() {
  const steps = [
    { num: '01', title: 'Join as an Operator', desc: 'Sign up with your license type - cultivator, manufacturer, dispensary, contractor, logistics, or fulfillment hub. Verification takes under 24 hours.' },
    { num: '02', title: 'Connect to the Supply Chain', desc: 'Browse verified vendors, post your products or services, and start forming direct business relationships - without brokers or middlemen.' },
    { num: '03', title: 'Trade, Fulfill & Scale', desc: 'Place orders, book logistics, hire contractors, and manage everything from one dashboard. Every transaction is compliant and tracked.' },
  ]
  return (
    <section id="platform" className="section-pad">
      <div className="container-max">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-orq-green tracking-widest uppercase">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-bold text-orq-text mt-3 mb-4">Simple to start.<br/>Powerful at scale.</h2>
          <p className="text-orq-text-2 max-w-2xl mx-auto">Orqestra replaces the phone calls, spreadsheets, and disconnected systems that slow cannabis businesses down.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-orq-border via-orq-green/30 to-orq-border" />

          {steps.map((step, i) => (
            <div key={i} className="orq-card rounded-2xl p-8 relative">
              <div className="text-6xl font-black text-orq-green/10 absolute top-6 right-6">{step.num}</div>
              <div className="w-12 h-12 rounded-xl bg-orq-green/10 border border-orq-green/20 flex items-center justify-center text-orq-green font-bold text-lg mb-6">
                {i + 1}
              </div>
              <h3 className="text-xl font-semibold text-orq-text mb-3">{step.title}</h3>
              <p className="text-orq-text-2 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// âââ Operator Types âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function OperatorTypes() {
  return (
    <section id="operators" className="section-pad bg-orq-surface/30">
      <div className="container-max">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-orq-gold tracking-widest uppercase">Built For Everyone</span>
          <h2 className="text-4xl md:text-5xl font-bold text-orq-text mt-3 mb-4">Every operator. One platform.</h2>
          <p className="text-orq-text-2 max-w-2xl mx-auto">Whether you grow it, make it, sell it, move it, or store it - Orqestra has a role built specifically for your business.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {operatorTypes.map((op, i) => (
            <div key={i} className={`orq-card rounded-2xl p-7 border ${op.border} group cursor-pointer`}>
              <div className={`w-12 h-12 rounded-xl ${op.bg} ${op.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                {op.icon}
              </div>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-bold text-orq-text">{op.label}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${op.bg} ${op.color}`}>{op.tag}</span>
              </div>
              <p className="text-orq-text-2 text-sm leading-relaxed mb-5">{op.description}</p>
              <ul className="space-y-2">
                {op.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-orq-text-3">
                    <span className={`${op.color} flex-shrink-0`}><CheckIcon /></span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href="/onboarding" className={`text-sm ${op.color} flex items-center gap-1.5 hover:gap-3 transition-all font-medium`}>
                  Get started as a {op.label.slice(0, -1)} <ArrowRightIcon />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// âââ Platform Features ââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function PlatformFeatures() {
  return (
    <section className="section-pad">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <span className="text-xs font-semibold text-orq-green tracking-widest uppercase">The Platform</span>
            <h2 className="text-4xl md:text-5xl font-bold text-orq-text mt-3 mb-6">
              Amazon for cannabis.<br/>
              <span className="gradient-text">Uber for logistics.</span>
            </h2>
            <p className="text-orq-text-2 leading-relaxed mb-8">
              Orqestra is infrastructure, not just a marketplace. We are building the connective tissue that the cannabis industry has been missing - combining trade, logistics, labor, fulfillment, payments, and compliance into one integrated system.
            </p>
            <Link href="/onboarding" className="btn-primary">
              Start Building on Orqestra <ArrowRightIcon />
            </Link>
          </div>

          {/* Right: feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {platformFeatures.map((feat, i) => (
              <div key={i} className="orq-card rounded-xl p-5">
                <div className="text-2xl mb-3">{feat.icon}</div>
                <h4 className="font-semibold text-orq-text text-sm mb-2">{feat.title}</h4>
                <p className="text-orq-text-3 text-xs leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// âââ Marketplace Preview ââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function MarketplacePreview() {
  const items = [
    { name: 'Blue Dream Flower', vendor: 'Mesa Verde Farms', type: 'Cultivator', price: '$1,200/lb', stock: '42 lbs', badge: 'In Stock' },
    { name: 'OG Kush Pre-Rolls (20ct)', vendor: 'High Desert Mfg', type: 'Manufacturer', price: '$380/box', stock: '200 units', badge: 'Fast Ship' },
    { name: 'Live Resin Cartridges', vendor: 'NM Extract Labs', type: 'Manufacturer', price: '$14.50/unit', stock: '1,500 units', badge: 'New' },
    { name: 'Premium Trim Service', vendor: 'CannaCrew NM', type: 'Contractor', price: '$18/hr', stock: '8 workers', badge: 'Available' },
  ]

  return (
    <section className="section-pad bg-orq-surface/30">
      <div className="container-max">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-orq-gold tracking-widest uppercase">Live Marketplace</span>
          <h2 className="text-4xl md:text-5xl font-bold text-orq-text mt-3 mb-4">Browse. Order. Delivered.</h2>
          <p className="text-orq-text-2 max-w-xl mx-auto">A real-time B2B marketplace with verified vendors, live inventory, and instant ordering.</p>
        </div>

        {/* Mock marketplace UI */}
        <div className="rounded-2xl border border-orq-border bg-orq-surface overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-orq-border bg-orq-elevated">
            <div className="w-3 h-3 rounded-full bg-rose-500/60" />
            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            <div className="flex-1 ml-4 bg-orq-border/50 rounded px-3 py-1 text-xs text-orq-text-3">app.orqestra.io/marketplace</div>
          </div>

          {/* Search bar */}
          <div className="p-5 border-b border-orq-border flex gap-3">
            <div className="flex-1 bg-orq-elevated border border-orq-border rounded-lg px-4 py-2.5 text-sm text-orq-text-3 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Search products, vendors, services...
            </div>
            <div className="flex gap-2">
              {['All', 'Flower', 'Extracts', 'Edibles', 'Services'].map(f => (
                <button key={f} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${f === 'All' ? 'bg-orq-green text-black' : 'bg-orq-elevated text-orq-text-3 hover:bg-orq-border/50'}`}>{f}</button>
              ))}
            </div>
          </div>

          {/* Product cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
            {items.map((item, i) => (
              <div key={i} className="orq-card rounded-xl p-4">
                {/* Placeholder image */}
                <div className="w-full h-28 rounded-lg bg-gradient-to-br from-orq-elevated to-orq-border mb-4 flex items-center justify-center text-3xl">
                  {i === 0 ? 'ð¿' : i === 1 ? 'ð¬' : i === 2 ? 'ð§' : 'ð·'}
                </div>
                <div className="flex items-start justify-between mb-1">
                  <h5 className="text-xs font-semibold text-orq-text leading-tight">{item.name}</h5>
                  <span className="text-xs bg-emerald-950/60 text-emerald-400 px-1.5 py-0.5 rounded flex-shrink-0 ml-1">{item.badge}</span>
                </div>
                <p className="text-xs text-orq-text-3 mb-3">{item.vendor} Â· {item.type}</p>
                <div className="flex items-center justify-between">
                  <span className="text-orq-green font-bold text-sm">{item.price}</span>
                  <span className="text-xs text-orq-text-3">{item.stock}</span>
                </div>
                <button className="w-full mt-3 bg-orq-green/10 hover:bg-orq-green/20 border border-orq-green/30 text-orq-green text-xs py-2 rounded-lg transition">
                  + Add to Order
                </button>
              </div>
            ))}
          </div>

          <div className="text-center py-5 border-t border-orq-border">
            <Link href="/onboarding" className="text-sm text-orq-green hover:text-emerald-300 transition font-medium">
              Join to access the full marketplace →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// âââ Pricing ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function Pricing() {
  return (
    <section id="pricing" className="section-pad">
      <div className="container-max">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-orq-green tracking-widest uppercase">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-bold text-orq-text mt-3 mb-4">Simple, transparent pricing.</h2>
          <p className="text-orq-text-2 max-w-xl mx-auto">No hidden fees. Start free for 30 days. Upgrade as you grow.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingTiers.map((tier, i) => (
            <div key={i} className={`relative rounded-2xl border p-8 bg-orq-surface flex flex-col ${tier.color} ${i === 1 ? 'glow-green scale-105' : ''}`}>
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-orq-green text-black text-xs font-bold px-4 py-1.5 rounded-full">{tier.badge}</span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-orq-text mb-2">{tier.name}</h3>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-4xl font-black text-orq-text">{tier.price}</span>
                  <span className="text-orq-text-3 text-sm mb-1">{tier.period}</span>
                </div>
                <p className="text-orq-text-2 text-sm">{tier.desc}</p>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-orq-text-2">
                    <span className="text-orq-green flex-shrink-0 mt-0.5"><CheckIcon /></span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/onboarding"
                className={`text-center py-3 px-6 rounded-lg font-semibold text-sm transition ${
                  i === 1
                    ? 'bg-orq-green hover:bg-green-400 text-black'
                    : 'border border-orq-border hover:border-orq-green/40 text-orq-text hover:bg-orq-elevated'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// âââ FAQ ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" className="section-pad bg-orq-surface/30">
      <div className="container-max max-w-3xl">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-orq-gold tracking-widest uppercase">FAQ</span>
          <h2 className="text-4xl font-bold text-orq-text mt-3">Common questions.</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="orq-card rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-medium text-orq-text text-sm">{faq.q}</span>
                <span className={`text-orq-text-3 flex-shrink-0 ml-4 transition-transform ${open === i ? 'rotate-180' : ''}`}>
                  <ChevronDownIcon />
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-6">
                  <p className="text-orq-text-2 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// âââ CTA Banner âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function CTABanner() {
  return (
    <section className="section-pad">
      <div className="container-max">
        <div className="relative rounded-3xl overflow-hidden border border-orq-green/20 glow-green">
          <div className="absolute inset-0 bg-gradient-to-r from-orq-green-dim via-orq-elevated to-orq-green-dim" />
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="relative z-10 text-center py-20 px-8">
            <h2 className="text-4xl md:text-5xl font-black text-orq-text mb-4">
              Ready to connect your<br />cannabis business?
            </h2>
            <p className="text-orq-text-2 text-lg max-w-xl mx-auto mb-10">
              Join New Mexico's first unified cannabis B2B operating system. Free for 30 days, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding" className="btn-primary text-base !py-4 !px-10">
                Get Started Free <ArrowRightIcon />
              </Link>
              <a href="mailto:hello@orqestra.io" className="btn-secondary text-base !py-4 !px-10">
                Talk to Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// âââ Footer âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function Footer() {
  const links = {
    Platform: ['Marketplace', 'Logistics', 'Contractor Network', 'Payments', 'Analytics'],
    Operators: ['Cultivators', 'Manufacturers', 'Dispensaries', 'Contractors', 'Logistics', 'Fulfillment'],
    Company: ['About', 'Careers', 'Blog', 'Press'],
    Legal: ['Terms of Service', 'Privacy Policy', 'Compliance'],
  }
  return (
    <footer className="border-t border-orq-border">
      <div className="container-max px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orq-green flex items-center justify-center">
                <span className="text-black font-black text-sm">O</span>
              </div>
              <span className="font-bold text-lg text-orq-text">Orqestra</span>
            </div>
            <p className="text-orq-text-3 text-xs leading-relaxed mb-4">
              The B2B marketplace for cannabis operators. Built in New Mexico.
            </p>
            <div className="flex gap-3">
              {['ð', 'in', 'ig'].map(s => (
                <button key={s} className="w-8 h-8 rounded-lg bg-orq-elevated border border-orq-border text-orq-text-3 hover:border-orq-green/40 hover:text-orq-green transition text-sm">
                  {s}
                </button>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold text-orq-text uppercase tracking-wider mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-xs text-orq-text-3 hover:text-orq-text transition">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-orq-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-orq-text-3">Â© 2026 Orqestra. All rights reserved. Built for licensed cannabis operators.</p>
          <p className="text-xs text-orq-text-3">ð¿ Proudly built in New Mexico</p>
        </div>
      </div>
    </footer>
  )
}

// âââ Page âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070D09]">
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <OperatorTypes />
      <PlatformFeatures />
      <MarketplacePreview />
      <Pricing />
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  )
}
