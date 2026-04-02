import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Orqestra — Cannabis B2B Market',
  description: 'Connect cultivators, manufacturers, dispensaries, contractors, logistics, and fulfillment hubs on one powerful B2B platform. Built for New Mexico cannabis operators.',
  keywords: 'cannabis B2B, cannabis marketplace, cannabis supply chain, dispensary wholesale, cultivator marketplace, New Mexico cannabis',
  openGraph: {
    title: 'Orqestra — Cannabis B2B Market',
    description: 'The cannabis B2B market built for every operator in the supply chain. New Mexico’s operating layer for cultivators, dispensaries, manufacturers, and more.',
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
