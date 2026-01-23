# Database Schema Changes

This file documents permanent database changes made via direct SQL execution in Supabase SQL Editor (not through migration files, as this is a Lovable-managed project).

## Date: 2026-01-23

### 1. Added Foreign Key Relationship for Shipment Stages

**Purpose:** Enable PostgREST automatic joins between `shipment_stages` and `shipment_stage_definitions` tables.

**SQL Executed:**

```sql
-- Add unique constraint on stage_number
ALTER TABLE public.shipment_stage_definitions
  ADD CONSTRAINT shipment_stage_definitions_stage_number_unique
  UNIQUE (stage_number);

-- Add foreign key relationship
ALTER TABLE public.shipment_stages
  ADD CONSTRAINT shipment_stages_stage_number_fkey
  FOREIGN KEY (stage_number)
  REFERENCES public.shipment_stage_definitions(stage_number)
  ON DELETE RESTRICT;
```

**Impact:**

- Allows queries like `shipment_stages.select('*, shipment_stage_definitions(*)')` to work
- Enforces referential integrity between tables
- Prevents deletion of stage definitions that are in use

---

### 2. Made initialize_shipment_stages Function Idempotent

**Purpose:** Prevent duplicate stage insertion errors when function is called multiple times for the same order.

**SQL Executed:**

```sql
CREATE OR REPLACE FUNCTION initialize_shipment_stages(p_order_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM shipment_stages WHERE order_id = p_order_id) THEN
    INSERT INTO shipment_stages (order_id, stage_number, status)
    SELECT p_order_id, stage_number, 'pending'
    FROM shipment_stage_definitions
    ORDER BY stage_number;
  END IF;
END;
$$;
```

**Changes:**

- Added `IF NOT EXISTS` check before inserting stages
- Function now safely handles multiple invocations without causing constraint violations
- Original function (created via Lovable) would fail if stages already existed

**Impact:**

- Prevents "duplicate key value violates unique constraint" errors
- Safe to call function multiple times
- Allows manual stage initialization for existing orders without errors

---

## Future Changes

Any additional direct SQL changes should be documented here with:

- Date
- Purpose
- SQL statement(s)
- Impact/rationale
