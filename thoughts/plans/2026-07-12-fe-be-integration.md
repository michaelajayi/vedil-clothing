# Integration Plan: Frontend ↔ Backend

> **Goal:** Strip all hardcoded data from the Next.js frontend, install TanStack Query, and wire each domain to the NestJS backend API one at a time.
> **Docs created:** `docs/api-contract.md`, `docs/api-discrepancies.md`, `docs/api-samples/`, `docs/data-backup/`
> **Type contract:** `src/types/api.ts`

---

## Session State

| Step | Status |
| --- | --- |
| **Phase 0: Documentation & Contract** | ✅ Done |
| **Phase 1: Strip hardcoded data** | ✅ Done |
| **Phase 2: TanStack Query + API client** | ✅ Done |
| **Phase 3: Wire endpoints** | ⏳ Not started |
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

### Pending backend actions

See `docs/api-discrepancies.md` for full list. Key items:

- Add `gender` field to products
- Add `featured` / `isNew` flags to products
- Confirm company address (Ago Palace Way vs Balogun Street)
- Configure social media URLs
- Add CORS to backend main.ts (`app.enableCors()`)
- Add `registrationFee` field to courses (deferred)
- Resolve pricing tier model (deferred)

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
| `/shop` | Collection cards visible. "New In" section has no products (empty grid). |
| `/shop/[category]` | Category hero + filters visible. "Nothing here yet. Ask us about stock →" |
| `/shop/[category]/[product]` | 404 (getProduct returns undefined) |
| `/academy` | Page hero + academy intro visible. No course listing. Empty state shows. |
| `/cart` | Empty cart: "Your cart is empty. Browse the shop and add something you love." |
| `/checkout` | Needs cart items to access. |
| `/contact` | Contact form visible. Contact info shows "Loading…" |
| Footer | Nav links visible. Contact section shows "Contact details loading…" |

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

## Phase 3 — Wire Endpoints (Priority Order)

### Priority justification

Starting with the simplest endpoints first (read-only, no mutations) builds confidence. Company profile and site config are trivial GETs with no complex mapping. Products and courses are the most visible. Cart and checkout are most complex (mutations, state sync, payment flow).

### Order

| Order | Domain | Complexity | Pages affected |
| --- | --- | --- | --- |
| 1 | **Company Profile** | Low (GET, 1 endpoint) | `/contact`, footer, WhatsAppFloat |
| 2 | **Site Config** | Low (GET, 1 endpoint) | Checkout (delivery fees) |
| 3 | **Products** | Medium (GET list + detail) | `/shop`, `/shop/[category]`, `/shop/[category]/[product]`, product cards |
| 4 | **Courses** | Medium (GET list + detail) | `/academy` |
| 5 | **Cart API** | Medium-High (GET + 3 mutations, session) | Cart drawer, `/cart` page |
| 6 | **Checkout** | High (mutation, Paystack redirect change) | `/checkout` page (needs rewrite) |
| 7 | **Email Verification** | Medium (2 mutations) | Course enrollment flow |
| 8 | **Contact & Factory Forms** | Medium (2 mutations, multipart) | `/contact`, `/garment-factory` |
| 9 | **Course Enrollment** | High (full flow: OTP → checkout → enrollment) | `/academy` |

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

- [ ] Backend CORS enabled (must be done before any fetch works)
- [ ] `NEXT_PUBLIC_API_URL` added to `.env.local`

---

## References

- **Type contract:** `src/types/api.ts`
- **Human contract:** `docs/api-contract.md`
- **Backend feedback:** `docs/api-discrepancies.md`
- **API samples:** `docs/api-samples/`
- **Data backup:** `docs/data-backup/`
- **Backend docs:** `/Users/michaelajayi/Projects/personal/vedil-clothing-backend/docs/`
- **Rework backlog:** `REWORK.md`
