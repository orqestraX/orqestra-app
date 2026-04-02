import { NextRequest, NextResponse } from 'next/server'

// ── In-memory rate limiter (edge-safe) ────────────────────────────────────
// For production use Upstash Redis: https://upstash.com
const rateMap = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  // Strict limit on auth endpoints
  '/api/auth':        { max: 10,  windowMs: 60_000  },  // 10/min
  '/api/auth/signin': { max: 5,   windowMs: 60_000  },  // 5/min
  '/api/onboarding':  { max: 3,   windowMs: 300_000 },  // 3 per 5 min
  '/api/':            { max: 100, windowMs: 60_000  },  // 100/min for all APIs
  'default':          { max: 300, windowMs: 60_000  },  // 300/min general
}

function getRateLimit(pathname: string) {
  for (const [prefix, limit] of Object.entries(RATE_LIMITS)) {
    if (prefix !== 'default' && pathname.startsWith(prefix)) return limit
  }
  return RATE_LIMITS['default']
}

function checkRateLimit(ip: string, pathname: string): { allowed: boolean; remaining: number; resetAt: number } {
  const { max, windowMs } = getRateLimit(pathname)
  const key = ip + ':' + pathname.split('/').slice(0, 3).join('/')
  const now = Date.now()
  const entry = rateMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs }
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt }
}

// ── Protected routes (require auth session) ────────────────────────────────
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/orders',
  '/listings',
  '/profile',
  '/admin',
]

const PUBLIC_PATHS = [
  '/',
  '/marketplace',
  '/onboarding',
  '/auth/signin',
  '/auth/signup',
  '/auth/callback',
  '/api/auth',
]

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(p => pathname.startsWith(p))
}

// ── Suspicious pattern detection ───────────────────────────────────────────
const BLOCKED_PATTERNS = [
  /(\.\.|%2e%2e)/i,            // Path traversal
  /<script/i,                    // XSS attempt in URL
  /union.*select/i,              // SQL injection
  /exec\s*\(/i,                // Code execution
  /\/etc\/passwd/i,            // Unix file access
  /\/wp-admin/i,                // WordPress scanner
  /\/phpmyadmin/i,              // phpMyAdmin scanner
  /\.php$/i,                    // PHP file probe
  /\.(env|git|htaccess)$/i,     // Config file probe
]

function isSuspiciousRequest(req: NextRequest): boolean {
  const url = req.nextUrl.pathname + req.nextUrl.search
  return BLOCKED_PATTERNS.some(p => p.test(url))
}

// ── Main middleware ────────────────────────────────────────────────────────
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. Block suspicious/scanner requests immediately
  if (isSuspiciousRequest(req)) {
    return new NextResponse(null, {
      status: 403,
      headers: { 'X-Blocked-By': 'Orqestra-Security' },
    })
  }

  // 2. Get client IP (Vercel sets x-real-ip or x-forwarded-for)
  const ip =
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    '127.0.0.1'

  // 3. Rate limiting
  const { allowed, remaining, resetAt } = checkRateLimit(ip, pathname)
  if (!allowed) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests. Please slow down.', retryAfter: Math.ceil((resetAt - Date.now()) / 1000) }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(getRateLimit(pathname).max),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
        },
      }
    )
  }

  // 4. Auth protection for private routes
  if (isProtectedPath(pathname) && !isPublicPath(pathname)) {
    // Check for Supabase session cookie
    const hasSession = req.cookies.getAll().some(c =>
      (c.name.startsWith('sb-') && c.name.includes('auth-token')) || c.name === 'supabase-auth-token'
    )
    if (!hasSession) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // 5. Block admin routes unless admin role cookie is set
  if (pathname.startsWith('/admin')) {
    const role = req.cookies.get('orq-role')?.value
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // 6. Add rate limit headers to all passing responses
  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Remaining', String(remaining))
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetAt / 1000)))

  // 7. Remove fingerprinting headers
  response.headers.delete('X-Powered-By')
  response.headers.delete('Server')

  return response
}

// Only run middleware on these paths
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
