# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**

- `bun dev` - Start Vite dev server (default: http://localhost:5173)
- `bun build` - Production build
- `bun build:dev` - Development build
- `bun preview` - Preview production build locally
- `bun lint` - Run ESLint

**Package Management:**

- Use `bun` (NOT npm) for all package operations
- `bun add <package>` - Add dependency
- `bun add -d <package>` - Add dev dependency

## Architecture

### Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **UI:** shadcn/ui (Radix UI primitives) + Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **State:** TanStack React Query (server state) + React Context (auth)
- **Forms:** React Hook Form + Zod validation
- **Routing:** React Router v6

### Core Application Flow

**Provider Hierarchy (App.tsx):**

```
QueryClientProvider
  └─ TooltipProvider
      └─ BrowserRouter
          └─ AuthProvider (AuthContext)
              └─ Routes
```

**Authentication System:**

- `AuthContext` provides: `user`, `session`, `profile`, `role`, `loading`, `signOut()`, `refreshProfile()`
- On auth state change, fetches user `profile` (from `profiles` table) and `role` (from `user_roles` table)
- Uses `setTimeout` workaround to defer Supabase calls in `onAuthStateChange` to avoid RLS deadlock
- Auth listener setup BEFORE `getSession()` call to prevent race conditions

**Route Protection:**

- `<ProtectedRoute>` wrapper checks auth and optionally admin role
- Redirects to `/auth` if not authenticated, to `/portal` if not admin
- Shows loader during auth state resolution

**Database Schema (Key Tables):**

- `profiles` - User profile data (full_name, email, phone, address, account_type)
- `user_roles` - Role assignments (app_role enum: 'admin' | 'client')
- `products` - Salmon products (name, description, price_per_kg, specifications, images)
- `cart_items` - Shopping cart (user_id, product_id, variant, quantity)
- `orders` - Order records (user_id, total_amount, status, delivery_address)
- `order_items` - Line items per order
- `order_certificates` - Uploaded certificates (health, quality docs)

**RLS Security Pattern:**

- Uses `SECURITY DEFINER` functions (`has_role()`, `get_user_role()`) to check roles without RLS recursion
- Policies separate user data access (own records) from admin access (all records)
- New users auto-assigned 'client' role via trigger on `auth.users`

### State Management Patterns

**Server State (React Query):**

- Custom hooks wrap queries/mutations: `useProducts`, `useCart`, `useOrders`, `useAdminOrders`, `useAdminProducts`
- Query keys include user ID where relevant: `["cart", user?.id]`
- Mutations invalidate related queries on success
- Toast notifications on errors

**Cart Logic (`useCart`):**

- Variant pricing: `pricePerKg * weight` (100g=0.1kg, 200g=0.2kg, 300g=0.3kg)
- Upsert pattern: update quantity if item exists, insert if new
- `cartTotal` and `cartCount` computed from items
- `clearCart()` used after successful checkout

**Protected Data Fetching:**

- Queries use `enabled: !!user` to prevent fetch when unauthenticated
- Return empty array/null when user not present

### Routing Structure

**Public Routes:**

- `/` - Landing page (Hero, QualityPromise, TechnicalDetails, CatalogTeaser)
- `/auth` - Login/signup
- `/products/:slug` - Product detail page

**Protected Routes (require auth):**

- `/checkout` - Cart review and order placement
- `/portal` - User dashboard (order history, profile)

**Admin Routes (require admin role):**

- `/admin` - Admin dashboard (manage products, orders, upload certificates)

**Important:** Always add custom routes ABOVE the catch-all `*` route in App.tsx (which renders NotFound)

### File Organization

**Pages (`/src/pages`):** Top-level route components
**Components (`/src/components`):** Reusable UI (organized by domain: `auth/`, `admin/`, etc.) + shadcn UI library (`ui/`)
**Hooks (`/src/hooks`):** Custom React Query hooks for data fetching
**Contexts (`/src/contexts`):** Global state (AuthContext only currently)
**Integrations (`/src/integrations/supabase`):** Supabase client + auto-generated TypeScript types

### Environment Variables

Required in `.env`:

```
VITE_SUPABASE_URL=<supabase-project-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<supabase-anon-key>
```

### Key Implementation Notes

- **Supabase types are auto-generated** - See `/src/integrations/supabase/types.ts` (do not manually edit)
- **shadcn components** - Located in `/src/components/ui`, follow shadcn conventions
- **Product variants** - Fixed set: 100g, 200g, 300g (extend `getVariantPrice()` in useCart if adding more)
- **Order status flow** - pending → processing → shipped → delivered
- **Image handling** - Supabase Storage bucket for product images and certificates
- **Form validation** - Use Zod schemas with React Hook Form's `zodResolver`
