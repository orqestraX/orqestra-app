// ── Orqestra Type Definitions ────────────────────────────────────

export type OperatorType = 'cultivator' | 'manufacturer' | 'dispensary' | 'courier'
export type AccountStatus = 'pending' | 'verified' | 'suspended' | 'rejected'
export type LicenseStatus = 'pending' | 'verified' | 'expired' | 'invalid'
export type ListingStatus = 'active' | 'paused' | 'sold_out' | 'archived'
export type OrderStatus = 'draft' | 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled' | 'disputed'
export type ProductCategory = 'flower' | 'concentrates' | 'pre_rolls' | 'edibles' | 'extracts' | 'trim' | 'equipment' | 'other'
export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'refunded' | 'failed'

export interface Operator {
  id: string
  user_id: string
  operator_type: OperatorType
  business_name: string
  contact_name: string
  email: string
  phone?: string
  city?: string
  state: string
  nm_license_number?: string
  license_status: LicenseStatus
  license_verified_at?: string
  license_expires_at?: string
  account_status: AccountStatus
  subscription_active: boolean
  subscription_start?: string
  subscription_end?: string
  created_at: string
  updated_at: string
}

export interface Listing {
  id: string
  operator_id: string
  title: string
  description?: string
  category: ProductCategory
  strain_name?: string
  thc_pct?: number
  cbd_pct?: number
  price_per_unit: number
  unit: string
  min_order_qty: number
  available_qty: number
  status: ListingStatus
  is_featured: boolean
  featured_until?: string
  image_urls: string[]
  created_at: string
  updated_at: string
  // Joined from operators
  operator?: Operator
}

export interface Order {
  id: string
  order_number: string
  buyer_id: string
  seller_id: string
  listing_id?: string
  product_name: string
  product_category: ProductCategory
  unit: string
  quantity: number
  unit_price: number
  subtotal: number
  platform_fee: number
  total: number
  status: OrderStatus
  payment_status: PaymentStatus
  delivery_address?: string
  delivery_notes?: string
  courier_id?: string
  pickup_at?: string
  delivered_at?: string
  manifest_number?: string
  manifest_url?: string
  buyer_notes?: string
  seller_notes?: string
  created_at: string
  updated_at: string
  confirmed_at?: string
  cancelled_at?: string
  // Joined
  buyer?: Operator
  seller?: Operator
  courier?: Operator
}

export interface LicenseVerification {
  id: string
  operator_id: string
  license_number: string
  submitted_at: string
  reviewed_at?: string
  reviewed_by?: string
  status: LicenseStatus
  rejection_reason?: string
  doc_urls: string[]
  notes?: string
}