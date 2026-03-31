import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Orqestra — The Operating System for Cannabis Businesses',
  description: 'Connect cultivators, manufacturers, dispensaries, contractors, logistics, and fulfillment hubs on one powerful B2B platform. Built for New Mexico cannabis operators.',
  keywords: 'cannabis B2B, cannabis marketplace, cannabis supply chain, dispensary wholesale, cultivator marketplace, New Mexico cannabis',
  openGraph: {
    title: 'Orqestra — Cannabis B2B Operating System',
    description: 'The Amazon + Uber of cannabis. Built for every operator in the supply chain.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  )
}
