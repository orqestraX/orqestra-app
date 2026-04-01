// ── Orqestra Input Validation Schemas (Zod) ──────────────────────
// All user inputs validated server-side before touching the database.
import { z } from 'zod'

// ── Shared ────────────────────────────────────────────────────────
export const uuidSchema = z.string().uuid('Invalid ID format')

export const nmLicenseSchema = z
  .string()
  .regex(/^NM-(CUL|MAN|RET|COU|PRO)-\d{4}-\d{3,6}$/i,
    'License must be a valid NM cannabis license number (e.g. NM-CUL-2024-001)'
  )
  .optional()

// ── Onboarding / Operator Registration ────────────────────────────
export const onboardingSchema = z.object({
  operator_type: z.enum(['cultivator', 'manufacturer', 'dispensary', 'courier'], {
    errorMap: () => ({ message: 'Invalid operator type' }),
  }),
  business_name: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(120, 'Business name too long')
    .regex(/^[a-zA-Z0-9\s\-\'\.,&]+$/, 'Business name contains invalid characters'),
  contact_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name too long'),
  email: z.string().email('Invalid email address').max(255),
  phone: z
    .string()
    .regex(/^[+]?[0-9\s\-\(\)]{7,20}$/, 'Invalid phone number')
    .optional(),
  city: z.string().max(60).optional(),
  nm_license_number: nmLicenseSchema,
})

export type OnboardingInput = z.infer<typeof onboardingSchema>

// ── Listing Creation ──────────────────────────────────────────────
export const listingSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title too long')
    .regex(/^[a-zA-Z0-9\s\-\'\.,()%&]+$/, 'Title contains invalid characters'),
  description: z.string().max(2000, 'Description too long').optional(),
  category: z.enum(['flower', 'concentrates', 'pre_rolls', 'edibles', 'extracts', 'trim', 'equipment', 'other']),
  strain_name: z.string().max(100).optional(),
  thc_pct: z.number().min(0).max(100).optional(),
  cbd_pct: z.number().min(0).max(100).optional(),
  price_per_unit: z
    .number()
    .positive('Price must be positive')
    .max(100_000, 'Price too high — check your input'),
  unit: z.enum(['lb', 'oz', 'g', 'unit', 'pack', 'case']),
  min_order_qty: z.number().positive().max(10_000),
  available_qty: z.number().min(0).max(100_000),
})

export type ListingInput = z.infer<typeof listingSchema>

// ── Order Creation ────────────────────────────────────────────────
export const orderSchema = z.object({
  listing_id: uuidSchema,
  quantity: z
    .number()
    .positive('Quantity must be greater than 0')
    .max(10_000, 'Quantity too large'),
  delivery_address: z.string().max(500).optional(),
  delivery_notes: z.string().max(1000).optional(),
  buyer_notes: z.string().max(1000).optional(),
})

export type OrderInput = z.infer<typeof orderSchema>

// ── License Verification Submission ──────────────────────────────
export const licenseVerifSchema = z.object({
  license_number: z
    .string()
    .min(5, 'License number required')
    .max(50, 'License number too long'),
  notes: z.string().max(500).optional(),
})

// ── API helpers ───────────────────────────────────────────────────
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { data: T; error: null } | { data: null; error: string } {
  const result = schema.safeParse(data)
  if (result.success) return { data: result.data, error: null }
  const messages = result.error.issues.map(i => i.message).join(', ')
  return { data: null, error: messages }
}