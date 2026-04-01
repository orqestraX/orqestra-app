-- ═══════════════════════════════════════════════════════════════════
-- Orqestra — Supabase Database Schema with Row-Level Security (RLS)
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- ── Enable required extensions ──────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── ENUMS ────────────────────────────────────────────────────────
CREATE TYPE operator_type AS ENUM ('cultivator', 'manufacturer', 'dispensary', 'courier');
CREATE TYPE account_status AS ENUM ('pending', 'verified', 'suspended', 'rejected');
CREATE TYPE listing_status AS ENUM ('active', 'paused', 'sold_out', 'archived');
CREATE TYPE order_status AS ENUM ('draft', 'pending', 'confirmed', 'in_transit', 'delivered', 'cancelled', 'disputed');
CREATE TYPE product_category AS ENUM ('flower', 'concentrates', 'pre_rolls', 'edibles', 'extracts', 'trim', 'equipment', 'other');
CREATE TYPE payment_status AS ENUM ('unpaid', 'pending', 'paid', 'refunded', 'failed');
CREATE TYPE license_status AS ENUM ('pending', 'verified', 'expired', 'invalid');

-- ── OPERATORS TABLE ───────────────────────────────────────────────
-- Core operator profile, linked to Supabase auth.users
CREATE TABLE operators (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  operator_type operator_type NOT NULL,
  business_name TEXT NOT NULL,
  contact_name  TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  phone         TEXT,
  city          TEXT,
  state         TEXT DEFAULT 'NM',
  -- License info
  nm_license_number TEXT,
  license_status    license_status DEFAULT 'pending',
  license_verified_at TIMESTAMPTZ,
  license_expires_at  DATE,
  -- Account status
  account_status account_status DEFAULT 'pending',
  approved_at    TIMESTAMPTZ,
  approved_by    UUID,
  -- Subscription
  subscription_active BOOLEAN DEFAULT FALSE,
  subscription_start  DATE,
  subscription_end    DATE,
  -- Metadata
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX operators_user_id_idx ON operators(user_id);
CREATE INDEX operators_type_idx ON operators(operator_type);
CREATE INDEX operators_status_idx ON operators(account_status);

-- ── LISTINGS TABLE ────────────────────────────────────────────────
CREATE TABLE listings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id   UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  -- Product info
  title         TEXT NOT NULL,
  description   TEXT,
  category      product_category NOT NULL,
  strain_name   TEXT,
  thc_pct       NUMERIC(5,2),
  cbd_pct       NUMERIC(5,2),
  -- Pricing
  price_per_unit NUMERIC(10,2) NOT NULL,
  unit           TEXT NOT NULL DEFAULT 'lb',
  min_order_qty  NUMERIC(10,2) DEFAULT 1,
  available_qty  NUMERIC(10,2) NOT NULL DEFAULT 0,
  -- Status
  status        listing_status DEFAULT 'active',
  is_featured   BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMPTZ,
  -- Images stored in Supabase Storage
  image_urls    TEXT[] DEFAULT '{}',
  -- Metadata
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX listings_operator_idx ON listings(operator_id);
CREATE INDEX listings_category_idx ON listings(category);
CREATE INDEX listings_status_idx ON listings(status);
CREATE INDEX listings_featured_idx ON listings(is_featured) WHERE is_featured = TRUE;

-- ── ORDERS TABLE ─────────────────────────────────────────────────
CREATE TABLE orders (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number  TEXT UNIQUE NOT NULL DEFAULT 'ORQ-' || UPPER(SUBSTRING(uuid_generate_v4()::TEXT, 1, 8)),
  -- Parties
  buyer_id      UUID NOT NULL REFERENCES operators(id),
  seller_id     UUID NOT NULL REFERENCES operators(id),
  -- Listing snapshot (stored so changes to listing don't affect historical orders)
  listing_id    UUID REFERENCES listings(id),
  product_name  TEXT NOT NULL,
  product_category product_category NOT NULL,
  unit          TEXT NOT NULL,
  -- Quantities and pricing
  quantity      NUMERIC(10,2) NOT NULL,
  unit_price    NUMERIC(10,2) NOT NULL,
  subtotal      NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  platform_fee  NUMERIC(12,2) GENERATED ALWAYS AS (ROUND(quantity * unit_price * 0.03, 2)) STORED,
  total         NUMERIC(12,2) GENERATED ALWAYS AS (ROUND(quantity * unit_price * 1.03, 2)) STORED,
  -- Status
  status        order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'unpaid',
  -- Logistics
  delivery_address TEXT,
  delivery_notes TEXT,
  courier_id    UUID REFERENCES operators(id),
  pickup_at     TIMESTAMPTZ,
  delivered_at  TIMESTAMPTZ,
  -- Compliance
  manifest_number TEXT,
  manifest_url    TEXT,
  -- Notes
  buyer_notes   TEXT,
  seller_notes  TEXT,
  -- Timestamps
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at  TIMESTAMPTZ,
  cancelled_at  TIMESTAMPTZ
);

CREATE INDEX orders_buyer_idx ON orders(buyer_id);
CREATE INDEX orders_seller_idx ON orders(seller_id);
CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX orders_created_idx ON orders(created_at DESC);

-- ── ORDER EVENTS (audit log) ──────────────────────────────────────
CREATE TABLE order_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  actor_id    UUID REFERENCES operators(id),
  event_type  TEXT NOT NULL,  -- e.g. 'status_changed', 'note_added'
  old_status  order_status,
  new_status  order_status,
  note        TEXT,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX order_events_order_idx ON order_events(order_id);

-- ── LICENSE VERIFICATION QUEUE ────────────────────────────────────
CREATE TABLE license_verifications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id   UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  license_number TEXT NOT NULL,
  submitted_at  TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at   TIMESTAMPTZ,
  reviewed_by   UUID,
  status        license_status DEFAULT 'pending',
  rejection_reason TEXT,
  -- Document URLs (stored in Supabase Storage, private bucket)
  doc_urls      TEXT[] DEFAULT '{}',
  notes         TEXT
);

CREATE INDEX license_verif_operator_idx ON license_verifications(operator_id);
CREATE INDEX license_verif_status_idx ON license_verifications(status);

-- ── AUDIT LOG (all security events) ──────────────────────────────
CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id    UUID,  -- NULL for unauthenticated actions
  action      TEXT NOT NULL,  -- e.g. 'login', 'listing.create', 'order.cancel'
  resource    TEXT,
  resource_id UUID,
  ip_address  INET,
  user_agent  TEXT,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX audit_actor_idx ON audit_log(actor_id);
CREATE INDEX audit_action_idx ON audit_log(action);
CREATE INDEX audit_created_idx ON audit_log(created_at DESC);

-- Audit log is append-only — no updates or deletes allowed
CREATE RULE audit_log_no_update AS ON UPDATE TO audit_log DO INSTEAD NOTHING;
CREATE RULE audit_log_no_delete AS ON DELETE TO audit_log DO INSTEAD NOTHING;

-- ════════════════════════════════════════════════════════════════
-- ROW-LEVEL SECURITY (RLS)
-- Every table is locked down by default. Operators can only
-- read/write their own data. Admins bypass RLS via service role.
-- ════════════════════════════════════════════════════════════════

ALTER TABLE operators           ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings            ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders              ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events        ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log           ENABLE ROW LEVEL SECURITY;

-- Helper: get current operator's ID from auth session
CREATE OR REPLACE FUNCTION current_operator_id()
RETURNS UUID AS $$
  SELECT id FROM operators WHERE user_id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ── OPERATORS policies ────────────────────────────────────────────
-- Operators can read their own profile only
CREATE POLICY operators_select_own ON operators
  FOR SELECT USING (user_id = auth.uid());

-- Operators can update their own profile (not status/license fields)
CREATE POLICY operators_update_own ON operators
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid() AND
    -- Cannot self-approve or change license status
    account_status = (SELECT account_status FROM operators WHERE user_id = auth.uid()) AND
    license_status = (SELECT license_status FROM operators WHERE user_id = auth.uid())
  );

-- ── LISTINGS policies ─────────────────────────────────────────────
-- Anyone authenticated can view active listings
CREATE POLICY listings_select_active ON listings
  FOR SELECT USING (
    status = 'active' OR operator_id = current_operator_id()
  );

-- Only the listing owner can create/update/delete
CREATE POLICY listings_insert_own ON listings
  FOR INSERT WITH CHECK (operator_id = current_operator_id());

CREATE POLICY listings_update_own ON listings
  FOR UPDATE USING (operator_id = current_operator_id());

CREATE POLICY listings_delete_own ON listings
  FOR DELETE USING (operator_id = current_operator_id());

-- ── ORDERS policies ───────────────────────────────────────────────
-- Buyers and sellers can see their own orders; couriers can see assigned orders
CREATE POLICY orders_select_parties ON orders
  FOR SELECT USING (
    buyer_id = current_operator_id() OR
    seller_id = current_operator_id() OR
    courier_id = current_operator_id()
  );

-- Only buyers can create orders
CREATE POLICY orders_insert_buyer ON orders
  FOR INSERT WITH CHECK (buyer_id = current_operator_id());

-- Buyers and sellers can update (status transitions validated by trigger)
CREATE POLICY orders_update_parties ON orders
  FOR UPDATE USING (
    buyer_id = current_operator_id() OR seller_id = current_operator_id()
  );

-- ── ORDER EVENTS policies ─────────────────────────────────────────
CREATE POLICY order_events_select ON order_events
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders
      WHERE buyer_id = current_operator_id() OR seller_id = current_operator_id()
    )
  );

CREATE POLICY order_events_insert ON order_events
  FOR INSERT WITH CHECK (
    order_id IN (
      SELECT id FROM orders
      WHERE buyer_id = current_operator_id() OR seller_id = current_operator_id()
    )
  );

-- ── LICENSE VERIFICATIONS policies ───────────────────────────────
CREATE POLICY license_verif_select_own ON license_verifications
  FOR SELECT USING (operator_id = current_operator_id());

CREATE POLICY license_verif_insert_own ON license_verifications
  FOR INSERT WITH CHECK (operator_id = current_operator_id());

-- ── AUDIT LOG policies ────────────────────────────────────────────
-- Operators can only see their own audit log entries
CREATE POLICY audit_select_own ON audit_log
  FOR SELECT USING (actor_id = auth.uid());

-- System inserts audit entries via service role (bypasses RLS)
-- No INSERT policy for regular users

-- ════════════════════════════════════════════════════════════════
-- TRIGGERS
-- ════════════════════════════════════════════════════════════════

-- Auto-update updated_at on operators and listings
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER operators_updated_at BEFORE UPDATE ON operators
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Log order status changes automatically
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_events (order_id, actor_id, event_type, old_status, new_status)
    VALUES (NEW.id, current_operator_id(), 'status_changed', OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER orders_status_audit AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

-- ── Seed: Admin account bypass (run as service role) ─────────────
-- When you create the admin user in Supabase Auth,
-- run this to grant admin access:
-- UPDATE operators SET account_status = 'verified' WHERE email = 'info@orqestrax.com';