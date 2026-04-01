import type { NextConfig } from 'next'

const securityHeaders = [
  // Prevent clickjacking — no iframes from other origins
  { key: 'X-Frame-Options', value: 'DENY' },
  // Stop MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Full referrer policy — don't leak URLs
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Force HTTPS for 2 years, include subdomains
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Disable browser features we don't need
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  // XSS protection for older browsers
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Content Security Policy — strict
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js needs inline scripts for hydration
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Styles: allow inline (Tailwind) + fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + data URIs + Supabase storage
      "img-src 'self' data: blob: https://*.supabase.co",
      // API connections — Supabase only
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      // No plugins
      "object-src 'none'",
      // No framing
      "frame-ancestors 'none'",
      // HTTPS upgrade
      "upgrade-insecure-requests",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  // Security headers on all routes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  // Strict mode catches bugs early
  reactStrictMode: true,

  // Don't expose Next.js version in headers
  poweredByHeader: false,

  // Only allow images from trusted sources
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'orqestrax.com' },
    ],
    // Block SVG images (XSS vector)
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Redirect HTTP -> HTTPS handled by Vercel, but set this too
  async redirects() {
    return [
      // Force trailing-slash consistency
      {
        source: '/marketplace/',
        destination: '/marketplace',
        permanent: true,
      },
    ]
  },
}

export default nextConfig