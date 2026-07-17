# Integration Plan: Frontend ↔ Backend

> **Goal:** Strip all hardcoded data from the Next.js frontend, install TanStack Query, and wire each domain to the NestJS backend API one at a time.
> **Docs created:** `docs/api-contract.md`, `docs/api-discrepancies.md`, `docs/api-samples/`, `docs/data-backup/`
> **Type contract:** `src/types/api.ts`

> **Current status (2026-07-14):** This is the implementation history, not the
> launch source of truth. Cart, backend-mediated checkout, and the checkout
> OTP UI have since been authored in the working tree. Use
> [`docs/launch-readiness.html`](../../docs/launch-readiness.html) for the
> active go/no-go checklist, risks, and verification evidence.

---

## Session State

| Step | Status |
| --- | --- |
| **Phase 0: Documentation & Contract** | ✅ Done |
| **Phase 1: Strip hardcoded data** | ✅ Done |
| **Phase 2: TanStack Query + API client** | ✅ Done |
| **Phase 3: Wire endpoints** | 🟢 8/10 domains wired, 2 remain (email verification OTP + course enrollment) |
| **Phase 4: Test integrations** | ⏳ Not started |

---

## Phase 0 — Documentation (Done)

- Created `src/types/api.ts` → typed contract for all API responses
- Created `docs/api-contract.md` → human-readable contract with field mappings, shared understanding, discrepancies per domain
- Created `docs/api-discrepancies.md` → backend feedback document for required schema changes
- Created `docs/api-samples/products.jsonl` → sample product API responses
- Created `docs/api-samples/courses.jsonl` → sample course API responses
- Created `docs/api-samples/misc.jsonl` → company profile, site config, cart, checkout, orders samples
- Created `docs/data-backup/products.json` → hardcoded products backup
- Created `docs/data-backup/courses.json` → hardcoded academy courses backup
- Created `docs/data-backup/misc.json` → hardcoded delivery fees, contact info backup

### Decisions made

| Decision | Value | Rationale |
| --- | --- | --- |
| Data fetching | **TanStack Query** | Best fit for async server state, caching, refetching |
| Pricing model mismatch | **Deferred** | Frontend shows first price tier until backend changes |
| Course fee breakdown | **Deferred** | Frontend uses single price until backend adds registration fee |
| Course enrollment | **Full enrollment flow** | Not just WhatsApp — email OTP → Paystack → enrollment |

### Backend discrepancies

See `docs/api-discrepancies.md` for full list.

| Issue | Frontend workaround | Status |
| --- | --- | --- |
| CORS | None — set `CORS_ORIGINS` env var on deploy | ✅ Coded in `main.ts` |
| Missing `gender` field on products | Regex heuristic from product name | 🟡 Enhancement — heuristic works for most names |
| Missing `featured` / `isNew` flags | 30-day heuristic for new; first 4 as featured | 🟡 Enhancement — reasonable defaults |
| Address mismatch (Ago Palace Way vs Balogun St) | Needs owner confirmation | 🔴 Required — which is correct? |
| Social media URLs not configured | Footer links go to `#` | 🟡 Enhancement — needs content input |
| Course fee breakdown (`registrationFee`) | Shown as "Included" labels | 🔵 Deferred — per integration plan |
| Pricing tier model (N-tier vs 2-tier) | Shows first tier only | 🔵 Deferred — per integration plan |

---

## Phase 1 — Strip Hardcoded Data (Done)

### Files changed

| File | What changed |
| --- | --- |
| `src/lib/products.ts` | Emptied `PRODUCTS` array. Kept types, `CATEGORY_META`, helpers |
| `src/app/academy/page.tsx` | Emptied courses array. Page structure, hero, CTA sections remain |
| `src/app/checkout/page.tsx` | Zeroed out `DELIVERY_FEES`. Labels stripped of prices |
| `src/app/contact/page.tsx` | Replaced hardcoded address/phone/email/WhatsApp with "Loading…" placeholders |
| `src/components/layout/Footer.tsx` | Replaced hardcoded contact info with "Contact details loading…" placeholder |
| `src/components/layout/WhatsAppFloat.tsx` | Fixed wrong number (`+2348012345678` → `+2348138683171`) |

### What the empty state looks like (per page)

| Route | Current state |
| --- | --- |
| `/shop` | Collection cards visible. "New In" section shows products from API (or empty if none) |
| `/shop/[category]` | Category hero + filters visible. Product grid shows API products filtered by collection (or empty state) |
| `/shop/[category]/[product]` | Product detail page. Fetches all products and finds by ID client-side (or 404 if not found) |
| `/academy` | Page hero + academy intro visible. Course listing from API with skeleton/error/empty states |
| `/cart` | Empty cart: "Your cart is empty. Browse the shop and add something you love." |
| `/checkout` | Delivery fees loaded from API via `useSiteConfig`. Rest is client-only Paystack |
| `/contact` | Contact info loaded from API via `useCompanyProfile`. Form is client-only (raw fetch) |
| Footer | Contact info loaded from API via `useCompanyProfile` |

### Known issues (pre-existing, not introduced)

- Footer nav links point to 404 routes (`/shop/men`, `/shop/women`, etc.) — see `REWORK.md`
- Footer academy links point to nonexistent anchors (`#in-person`, `#online`)
- Nested `<a>` lint warnings in Footer.tsx (social links, pre-existing)

---

## Phase 2 — TanStack Query + API Client (Done)

### Files created

| File | Purpose |
| --- | --- |
| `src/lib/api.ts` | Base fetch client — configurable `BASE_URL`, admin auth, error handling, type-safe |
| `src/lib/queries/config.ts` | `useCompanyProfile()`, `useSiteConfig()` |
| `src/lib/queries/catalog.ts` | `useProducts(category?)`, `useProduct(slug)`, `useCourses()`, `useCourse(slug)` |
| `src/lib/queries/cart.ts` | `useCart(sessionId)`, `useAddToCart()`, `useUpdateCartItem()`, `useRemoveFromCart()` |
| `src/lib/queries/checkout.ts` | `useInitiateCheckout()`, `useCheckoutStatus(ref)`, `useOrder(ref)`, `useSendOtp()`, `useVerifyOtp()` |
| `src/lib/queries/inquiries.ts` | `useSubmitContact()`, `useSubmitFactoryInquiry()` |
| `src/components/Providers.tsx` | Client component wrapping `QueryClientProvider` (set up in root layout) |

### Changes to existing files

| File | Change |
|---|---|
| `src/app/layout.tsx` | Wrapped content in `<Providers>` (outermost) containing existing `<CartProvider>` + `<ToastProvider>` |

### Recommended component pattern

```tsx
// Server component — initial data from server, refetches on client
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/getQueryClient';
import { productsOptions } from '@/lib/queries/products';
import ProductList from './ProductList';

export default function ShopPage() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(productsOptions());
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductList />
    </HydrationBoundary>
  );
}
```

```tsx
// Client component — actual data fetching
'use client';
import { useProducts } from '@/lib/queries/products';

export default function ProductList() {
  const { data, isLoading, error } = useProducts();
  
  if (isLoading) return <ProductListSkeleton />;
  if (error) return <ProductListError />;
  if (!data?.length) return <ProductListEmpty />;
  
  return data.map(product => <ProductCard key={product.id} product={product} />);
}
```

### All queries/mutations reference

| Domain | Query Hook | Endpoint | Auth |
| --- | --- | --- | --- |
| Products | `useProducts(category?)` | `GET /api/products` | None |
| Products | `useProduct(slug)` | `GET /api/products/{slug}` | None |
| Courses | `useCourses()` | `GET /api/courses` | None |
| Courses | `useCourse(slug)` | `GET /api/courses/{slug}` | None |
| Company | `useCompanyProfile()` | `GET /api/company-profile` | None |
| Config | `useSiteConfig()` | `GET /api/config/public` | None |
| Cart | `useCart(sessionId)` | `GET /api/cart/{sessionId}` | None |
| Cart | `useAddToCart(sessionId)` (mutation) | `POST /api/cart/{sessionId}/items` | None |
| Cart | `useUpdateCartItem(sessionId)` (mutation) | `PATCH /api/cart/{sessionId}/items/{id}` | None |
| Cart | `useRemoveFromCart(sessionId)` (mutation) | `DELETE /api/cart/{sessionId}/items/{id}` | None |
| Checkout | `useInitiateCheckout()` (mutation) | `POST /api/checkout/initiate` | None |
| Checkout | `useCheckoutStatus(ref)` | `GET /api/checkout/status/{ref}` | None |
| Orders | `useOrder(ref)` | `GET /api/orders/{ref}` | None |
| Contact | `useSubmitContact()` (mutation) | `POST /api/contact-inquiries` | None |
| Factory | `useSubmitFactoryInquiry()` (mutation) | `POST /api/factory-inquiries` | None |
| Email | `useSendOtp()` (mutation) | `POST /api/email-verification/send-otp` | None |
| Email | `useVerifyOtp()` (mutation) | `POST /api/email-verification/verify-otp` | None |

---

## Phase 3 — Wire Endpoints (Remaining Work)

### Done (6/9)

| Order | Domain | Complexity | Pages affected | Status |
| --- | --- | --- | --- | --- |
| 1 | **Company Profile** | Low | `/contact`, footer | ✅ Done |
| 2 | **Site Config** | Low | Checkout (delivery fees) | ✅ Done |
| 3 | **Products** | Medium | `/shop`, `/shop/[category]`, `/shop/[category]/[product]` | ✅ Done |
| 4 | **Courses** | Medium | `/academy` | ✅ Done |
| 5 | **Contact Form → Backend API** | Low | `/contact` | ✅ Done — swapped mutation hook, removed Next.js route |
| 6 | **Factory Form → Backend API** | Low | `/garment-factory` | ✅ Done — swapped mutation hook (with uppercase service enum), removed Next.js route |

### Remaining — sorted by wireability

| Priority | Domain | Hooks exist? | Schema discrepancy? | What's needed | Effort | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 🥇 | **Cart API** | ✅ useCart, useAddToCart, useUpdateCartItem, useRemoveFromCart | None — backend `getOrCreateCart` auto-creates sessions | Rewrote CartContext to sync with backend API; AddToBag/ProductCard pass variantId | ⚡ Medium | ✅ Done |
| 🥈 | **Email Verification** | ✅ useSendOtp(), useVerifyOtp() | None — hooks match backend contract exactly | Build OTP input component (enter email → send OTP → verify → get token) | 🟢 Small | 🟢 Ready to wire |
| 🥉 | **Checkout Initiate** | ✅ useInitiateCheckout() | None — migrated from inline Paystack to backend-mediated redirect | Rewrote checkout: frontend collects info → POST to backend → redirect to Paystack hosted page → `/checkout/callback` polls status | 🔴 Significant | ✅ Done |
| 🥉 | **Course Enrollment** | ⏳ Not started (depends on email verification + checkout) | — | Full flow: OTP flow → initiate checkout (with verification token) → order created → enrollment recorded. Currently goes to WhatsApp | 🔴 Blocked on OTP | 🔴 Blocked |

### Decision: Keep or remove Next.js API routes?

After wiring contact + factory forms to the backend, the Next.js routes (`src/app/api/contact/route.ts`, `src/app/api/factory/route.ts`) become dead code. They send emails via **Resend** directly without touching the NestJS backend. Options:

- **Remove them** — backend stores inquiries + handles any email notifications internally
- **Keep as fallback** — if backend is down, forms degrade to email-to-owner via Resend

Current recommendation: remove them to simplify the architecture. The backend manages inquiry lifecycle.

---

## Phase 4 — Testing

### Testing strategy per integration

| Test type | What to verify |
| --- | --- |
| **Loading state** | Skeleton/spinner shows while data loads |
| **Success state** | Data renders correctly (list, detail) |
| **Empty state** | Backend returns `[]` — page shows "Nothing here yet" |
| **Error state** | Backend returns 500 or network fails — error message shown |
| **Mutation** | Add to cart → item appears. Submit form → success message. |
| **Refetch** | After mutation, list updates (stale invalidation) |

### Known blockers for Phase 3 start

- [x] Backend CORS enabled (must be done before any fetch works)
- [x] `NEXT_PUBLIC_API_URL` added to `.env.local`

---

## References

- **Type contract:** `src/types/api.ts`
- **Human contract:** `docs/api-contract.md`
- **Backend feedback:** `docs/api-discrepancies.md`
- **API samples:** `docs/api-samples/`
- **Data backup:** `docs/data-backup/`
- **Backend docs:** `/Users/michaelajayi/Projects/personal/vedil-clothing-backend/docs/`
- **Rework backlog:** `REWORK.md`

---

## Session: 2026-07-12 — Products + Courses wired

### New files created

| File | Purpose |
| --- | --- |
| `src/lib/product-mapper.ts` | Transforms `ApiProductListItem` into `ProductDisplay` (compatible with old `Product` type). Handles kobo→naira, price-tier extraction, category mapping, gender/featured/isNew heuristics |
| `src/lib/course-mapper.ts` | Transforms `ApiCourseListItem` into `CourseDisplay` for the academy page |
| `src/components/shop/ProductListClient.tsx` | Client component for the "New In" section. Shows skeleton → error → empty → product grid |
| `src/components/shop/CategoryGridClient.tsx` | Client component for `/shop/[category]` grid. Collection + gender filtering |
| `src/components/shop/ProductDetailClient.tsx` | Client component for product detail. Fetches all products, finds by ID, renders PDP layout + related |
| `src/components/academy/CourseListClient.tsx` | Client component for academy course listing. Skeleton → error → empty → course cards |
| `src/components/contact/ContactInfo.tsx` | Company profile wired to /contact page (skeleton/error+retry/success) |
| `src/components/layout/FooterContact.tsx` | Company profile wired to footer (skeleton/fallback/success) |

### Changes to existing files

| File | Change |
| --- | --- |
| `src/lib/queries/catalog.ts` | Added `useProducts()`, `useProduct()`, `useCourses()`, `useCourse()` hook exports |
| `src/app/shop/page.tsx` | Replaced static featured grid with `ProductListClient` |
| `src/app/shop/[category]/page.tsx` | Replaced static `getByCategory()` with `CategoryGridClient` |
| `src/app/shop/[category]/[product]/page.tsx` | Replaced static `getProduct()` with `ProductDetailClient` |
| `src/app/academy/page.tsx` | Replaced empty courses array with `CourseListClient` |
| `src/app/checkout/page.tsx` | Already wired to `useSiteConfig()` |
| `src/app/contact/page.tsx` | Now renders `ContactInfo` (from `useCompanyProfile`) |
| `src/components/layout/Footer.tsx` | Now renders `FooterContact` (from `useCompanyProfile`) |
| `thoughts/plans/2026-07-12-fe-be-integration.md` | Updated status, session notes |

### Mapping decisions

| Decision | Approach | Rationale |
| --- | --- | --- |
| Category taxonomy | Frontend-only collection system (3 categories) maps "shop" → "ready-to-wear" as default fallback | Backend has single "Shop" category; collections are a UI/navigation concept |
| Gender | Inferred from product name regex | Backend doesn't have a `gender` field yet (discrepancy noted) |
| "New" badge | 30-day heuristic from `createdAt` | Backend doesn't have `isNew` flag (discrepancy noted) |
| Featured products | First 4 products shown in "New In" | Backend doesn't have `featured` flag (discrepancy noted) |
| Course fee breakdown | Single tuition price with "Included" labels for registration/certificate | Registration fee breakdown deferred per plan |
| Prices (kobo→naira) | `/ 100` conversion in both mappers | API delivers amounts in kobo (minor currency unit) |
| Price tiers | First tier = retail, second tier (if exists) = wholesale | Matches the emerging variant + tier model |

---

## Session: 2026-07-12 (afternoon) — Audit of remaining work

### What we discovered

During an audit of what's left, we found that **8 out of 10 domains have working frontend components**. The remaining 2 are:

| Domain | Nature |
| --- | --- |
| 🟢 Email Verification OTP | Hooks exist, zero schema discrepancy. Just need the UI component. |
| 🔴 Course Enrollment | Blocked on OTP UI + checkout flow (now done). Needs the enrollment UX. |

### Next actions (in priority order)

1. ✅ ~~Wire contact form → backend~~ — Done
2. ✅ ~~Wire factory form → backend~~ — Done
3. ✅ ~~Wire cart API~~ — Done
4. ✅ ~~Rewrite checkout flow~~ — Done
5. Build email verification OTP UI (small — needed for course enrollment)
6. Wire course enrollment (blocked on #5)
