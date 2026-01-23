# Refactoring Sections - Nordic Salmon

Codebase divided into 8 independent sections for parallel refactoring.

---

## SECTION 1: Authentication System

**Priority:** High (affects all protected features)
**Complexity:** Medium
**Dependencies:** Minimal (self-contained)

### Files:

```
/src/contexts/AuthContext.tsx
/src/components/auth/
  ├─ ProtectedRoute.tsx
  ├─ LoginForm.tsx
  └─ SignUpForm.tsx
/src/pages/Auth.tsx
```

### Responsibilities:

- Supabase auth integration (login/signup/logout)
- Auth state management (user, session, profile, role)
- RLS-safe profile & role fetching
- Route protection logic

### External Dependencies:

- Supabase client (`/src/integrations/supabase/client.ts`)
- Toast notifications (`/src/hooks/use-toast.ts`)

### Consumed By:

- All protected routes (Checkout, Portal, Admin)
- Header (user dropdown, auth status)

### Refactoring Focus:

- Error handling improvements
- Loading state optimization
- Auth race condition prevention
- Profile refresh strategy

---

## SECTION 2: Cart & Checkout Flow

**Priority:** High (core revenue feature)
**Complexity:** High
**Dependencies:** Auth, Products

### Files:

```
/src/hooks/useCart.ts
/src/components/cart/CartSheet.tsx
/src/pages/Checkout.tsx
```

### Responsibilities:

- Cart state management (add/update/remove/clear)
- Variant pricing logic (100g/200g/300g)
- Cart total & count computation
- Checkout form (delivery details, payment receipt upload)
- Order creation

### External Dependencies:

- AuthContext (user ID for cart queries)
- useOrders (createOrder mutation)
- Products data (price_per_kg, product details)

### Consumed By:

- Header (CartSheet trigger, cart badge)
- ProductDetail (add to cart)
- Portal (order history after checkout)

### Refactoring Focus:

- Cart persistence optimization
- Checkout validation improvements
- Payment receipt UX
- Error recovery (failed order creation)

---

## SECTION 3: Product Catalog (Customer View)

**Priority:** Medium
**Complexity:** Low
**Dependencies:** Products hook only

### Files:

```
/src/hooks/useProducts.ts
/src/pages/Collection.tsx
/src/pages/ProductDetail.tsx
/src/components/CatalogTeaser.tsx
```

### Responsibilities:

- Product listing (all available products)
- Product filtering/sorting
- Individual product detail view
- Variant selection UI
- Add-to-cart interaction

### External Dependencies:

- useCart (addToCart mutation)
- Supabase types

### Consumed By:

- Landing page (CatalogTeaser)
- Navigation (Collection link)
- Cart (product metadata)

### Refactoring Focus:

- Product filtering/search
- Image optimization
- Variant UI improvements
- Mobile responsiveness

---

## SECTION 4: Customer Orders & Portal

**Priority:** Medium
**Complexity:** Medium
**Dependencies:** Auth, Orders hook

### Files:

```
/src/hooks/useOrders.ts
/src/hooks/useShipmentTracking.ts (customer view only)
/src/pages/Portal.tsx
/src/components/orders/OrderCard.tsx
/src/components/orders/OrderStatusBadge.tsx
/src/components/shipment/ShipmentTimeline.tsx
```

### Responsibilities:

- User order history (current & past)
- Order detail view with shipment tracking
- Certificate viewing
- Profile editing
- Order status visualization

### External Dependencies:

- AuthContext (user ID, profile)
- Storage utils (certificate signed URLs)
- Formatting utils (dates, prices)

### Consumed By:

- Portal page only (isolated customer feature)

### Refactoring Focus:

- Realtime order updates UX
- Certificate viewer improvements
- Profile editing validation
- Shipment timeline clarity

---

## SECTION 5: Admin Dashboard

**Priority:** Medium
**Complexity:** High
**Dependencies:** Auth (admin role), Admin hooks

### Files:

```
/src/hooks/useAdminOrders.ts
/src/hooks/useAdminProducts.ts
/src/hooks/useShipmentTracking.ts (admin mutations)
/src/pages/Admin.tsx
/src/components/admin/
  ├─ OrdersTab.tsx
  ├─ OrderRow.tsx
  ├─ ProductsTab.tsx
  ├─ ProductFormDialog.tsx
  ├─ DeleteProductDialog.tsx
  └─ ShipmentStageManager.tsx
```

### Responsibilities:

- Order management (approve/reject payments, upload certificates, update status)
- Product CRUD (create/edit/delete/toggle availability)
- Shipment stage management
- Revenue analytics
- Order filtering (pending/in-transit/completed)

### External Dependencies:

- AuthContext (admin role check)
- Storage utils (receipt/certificate viewing)
- Formatting utils

### Consumed By:

- Admin page only (isolated admin feature)

### Refactoring Focus:

- Bulk operations (multi-order actions)
- Certificate upload UX
- Product image management
- Analytics dashboard enhancements

---

## SECTION 6: Landing & Marketing Pages

**Priority:** Low
**Complexity:** Low
**Dependencies:** Products (for CatalogTeaser only)

### Files:

```
/src/pages/
  ├─ Index.tsx
  ├─ Origin.tsx
  └─ Contact.tsx
/src/components/
  ├─ Hero.tsx
  ├─ QualityPromise.tsx
  ├─ TechnicalDetails.tsx
  └─ TrimmingGuide.tsx
```

### Responsibilities:

- Landing page sections
- Brand storytelling (Origin)
- Contact/info pages
- CTA flows

### External Dependencies:

- CatalogTeaser (uses useProducts)
- Navigation links

### Consumed By:

- Public routes only

### Refactoring Focus:

- Content updates
- SEO optimization
- Mobile responsiveness
- Animation/interaction improvements

---

## SECTION 7: Navigation & Layout

**Priority:** Low
**Complexity:** Low
**Dependencies:** Auth, Cart (for badges)

### Files:

```
/src/components/Header.tsx
/src/components/Footer.tsx
/src/components/NavLink.tsx
/src/components/ScrollToTop.tsx
```

### Responsibilities:

- Global navigation (desktop/mobile)
- Cart badge (item count)
- User auth dropdown
- Footer links
- Auto-scroll on route change

### External Dependencies:

- AuthContext (user state, signOut)
- useCart (cartCount)
- CartSheet (for cart panel)

### Consumed By:

- All pages (App.tsx layout)

### Refactoring Focus:

- Mobile menu UX
- Accessibility (keyboard navigation)
- Active route highlighting
- Performance (re-render optimization)

---

## SECTION 8: Utilities & UI Library

**Priority:** Low
**Complexity:** Low
**Dependencies:** None (leaf nodes)

### Files:

```
/src/lib/
  ├─ utils.ts (cn function)
  ├─ storage.ts (signed URL helpers)
  ├─ format.ts (price/date formatting)
  └─ phone-utils.ts (phone number formatting)
/src/hooks/
  ├─ use-toast.ts (Sonner integration)
  └─ use-mobile.ts (breakpoint detection)
/src/components/ui/ (30+ shadcn components)
```

### Responsibilities:

- Tailwind class merging
- File storage URL generation
- Formatting helpers (currency, dates, phone)
- Toast notifications
- shadcn UI components

### External Dependencies:

- None (consumed by all sections)

### Consumed By:

- All sections (utility layer)

### Refactoring Focus:

- Add new utility functions as needed
- Extend formatting for internationalization
- Update shadcn components (shadcn CLI)
- Custom toast themes

---

## Cross-Section Dependencies Matrix

| Section            | Depends On                              |
| ------------------ | --------------------------------------- |
| 1. Auth            | 8. Utilities                            |
| 2. Cart            | 1. Auth, 3. Products, 8. Utilities      |
| 3. Products        | 8. Utilities                            |
| 4. Customer Orders | 1. Auth, 8. Utilities                   |
| 5. Admin           | 1. Auth (admin role), 8. Utilities      |
| 6. Landing Pages   | 3. Products (CatalogTeaser only)        |
| 7. Navigation      | 1. Auth, 2. Cart (badges), 8. Utilities |
| 8. Utilities       | None                                    |

---

## Recommended Refactoring Order

### Phase 1: Foundation (Low Risk)

1. **Section 8** - Utilities & UI Library (no breaking changes)
2. **Section 6** - Landing Pages (public, isolated)

### Phase 2: Core Features (Medium Risk)

3. **Section 1** - Auth System (affects protected routes, deploy carefully)
4. **Section 3** - Product Catalog (customer-facing, test thoroughly)

### Phase 3: Critical Revenue (High Risk)

5. **Section 2** - Cart & Checkout (requires extensive testing)
6. **Section 4** - Customer Orders (affects user experience)

### Phase 4: Admin & Polish (Low Traffic)

7. **Section 5** - Admin Dashboard (internal tool, lower risk)
8. **Section 7** - Navigation (affects all pages, deploy last)

---

## Testing Strategy Per Section

### Section 1 (Auth):

- [ ] Login/logout flow
- [ ] Signup with email verification
- [ ] Protected route redirects
- [ ] Admin role enforcement
- [ ] Profile refresh after updates

### Section 2 (Cart):

- [ ] Add/update/remove cart items
- [ ] Variant pricing accuracy (100g/200g/300g)
- [ ] Cart persistence across sessions
- [ ] Checkout form validation
- [ ] Order creation with receipt upload
- [ ] Cart clear after successful checkout

### Section 3 (Products):

- [ ] Product listing loads correctly
- [ ] Product detail page with variants
- [ ] Add to cart from detail page
- [ ] Image loading/fallbacks

### Section 4 (Customer Orders):

- [ ] Order history displays (current/past)
- [ ] Shipment tracking timeline
- [ ] Certificate viewing (signed URLs)
- [ ] Profile editing
- [ ] Realtime order updates

### Section 5 (Admin):

- [ ] Order filtering (pending/in-transit/completed)
- [ ] Payment approval/rejection
- [ ] Certificate upload
- [ ] Product CRUD operations
- [ ] Shipment stage management
- [ ] Revenue calculation accuracy

### Section 6 (Landing):

- [ ] All sections render correctly
- [ ] CTA links work
- [ ] Mobile responsiveness

### Section 7 (Navigation):

- [ ] Cart badge updates
- [ ] User dropdown works
- [ ] Mobile menu functionality
- [ ] Route highlighting

### Section 8 (Utilities):

- [ ] Unit tests for formatting functions
- [ ] Signed URL generation
- [ ] Phone number formatting

---

## Notes

- **Section 8 (Utilities)** should be refactored first as it has zero dependencies and is consumed by all sections
- **Section 1 (Auth)** and **Section 8** are the most critical as they affect all protected features
- **Section 2 (Cart)** is highest risk as it directly impacts revenue
- **Section 5 (Admin)** and **Section 6 (Landing)** can be refactored in parallel with other sections
- Always test cross-section integration after refactoring (especially Auth → Cart → Orders flow)

---

## Files NOT Included (Infrastructure)

These files should generally NOT be refactored without careful consideration:

```
/src/App.tsx (provider hierarchy, routing)
/src/main.tsx (React root)
/src/integrations/supabase/client.ts (Supabase config)
/src/integrations/supabase/types.ts (auto-generated, DO NOT EDIT)
vite.config.ts
tailwind.config.ts
```
