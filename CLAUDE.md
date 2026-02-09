# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nordic Seafood - E-commerce platform delivering premium Norwegian salmon to Ethiopia. Built with React + TypeScript + Vite, backed by Supabase (PostgreSQL).

## Development Commands

```bash
# Install dependencies (use bun, not npm)
bun install

# Start dev server (runs on port 8080)
bun run dev

# Build for production
bun run build

# Build for development
bun run build:dev

# Lint code
bun run lint

# Preview production build
bun run preview
```

## Environment Setup

Requires env vars in `.env`:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon/public key

## Key Architectural Patterns

### Authentication Flow

Auth is centralized in `AuthContext` (`src/contexts/AuthContext.tsx`) with:

- Automatic session restoration on load
- Profile + role fetching with retry logic for network errors
- Optimistic updates via `refreshProfile()`
- Protected routes enforce auth state and admin role via `ProtectedRoute` component

**Auth state includes:**

- `user` - Supabase auth user
- `session` - Active session
- `profile` - User profile from `profiles` table
- `role` - Role from `user_roles` table (`admin` or `client`)

### Data Fetching Architecture

All server state uses **TanStack React Query**:

- Custom hooks in `/src/hooks` (e.g., `useCart`, `useProducts`, `useOrders`)
- Query keys follow pattern: `["resource", userId/contextId]`
- Mutations auto-invalidate related queries
- Auth-dependent queries use `enabled: !!user`

### Cart State Management

Cart is **server-synced** via Supabase:

- `useCart` hook manages all cart operations
- Cart items stored in `cart_items` table with product join
- Variant pricing calculated client-side using `getVariantPrice()`
- Standard variants: `100g`, `200g`, `300g` (weight in kg × price_per_kg)

### Database Schema (Key Tables)

- `profiles` - User info (name, phone, address, account_type)
- `user_roles` - Role mapping (admin/client), separate table for security
- `products` - Product catalog (name, price_per_kg, description, image_url)
- `cart_items` - Shopping cart with variant
- `orders` - Order records (status, delivery info, totals)
- `order_items` - Line items in orders
- `shipment_tracking` - Shipment stage history
- `order_certificates` - Uploaded documents for orders

### Routing & Code Splitting

Routes in `App.tsx`:

- Landing page (`/`) loads immediately
- All other pages lazy-loaded via `React.lazy()`
- Protected routes wrap auth-required pages
- Admin routes require `requireAdmin` prop
- **Critical:** Add custom routes ABOVE the catch-all `*` route

### Type Safety

- Full TypeScript with strict mode disabled (`noImplicitAny: false`)
- Database types auto-generated in `src/integrations/supabase/types.ts`
- Import via `import type { Database } from "@/integrations/supabase/types"`
- Type helpers: `Database["public"]["Tables"]["table_name"]["Row"]`

### Component Architecture

- UI primitives in `/src/components/ui` (shadcn/ui components)
- Feature components in `/src/components` (Header, Footer, Hero, etc.)
- Admin components in `/src/components/admin`
- Page components in `/src/pages`
- Use `@/` alias for imports (resolves to `src/`)

### Styling Conventions

- Tailwind CSS utility-first
- Prettier configured with `prettier-plugin-tailwindcss` (auto-sorts classes)
- No semicolons (Prettier config: `semi: false`)
- Imports auto-organized via `prettier-plugin-organize-imports`

### File Storage

Supabase Storage buckets:

- `payment-receipts` - Uploaded during checkout (10MB max)
- `certificates` - Company documents (ISO, Free Sale, etc.)
- Access via `supabase.storage.from(bucket).upload()`

### Phone Number Handling

Ethiopian phone format in `src/lib/phone-utils.ts`:

- Normalizes to E.164 format (`+251...`)
- Handles both `09` and `9` prefixes
- Validates 9-digit local numbers

### Admin Features

Admin dashboard (`/admin`) uses tabs:

- Overview - Metrics and stats
- Orders - Full order management with shipment tracking
- Products - CRUD operations
- Customers - User list with account types

Only users with `admin` role in `user_roles` can access.

## Code Quality

ESLint + Prettier configured:

- React hooks rules enforced
- Unused vars/params allowed (TS config relaxed)
- Auto-format on save recommended

## Migration Pattern

Migrations in `supabase/migrations/`:

- Named with timestamp + UUID
- Create enums before tables that use them
- Always enable RLS on new tables
- Foreign keys cascade on delete where appropriate
