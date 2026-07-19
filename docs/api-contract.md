# API Contract: Vedil Frontend ↔ Backend

> **Last updated:** 2026-07-18
> **Source of truth for types:** `src/types/api.ts`
> **Source of truth for API shapes:** `http://localhost:4000/api/docs-json` (OpenAPI 3.0)
> **Backend context:** `/Users/michaelajayi/Projects/personal/vedil-clothing-backend/docs/`

This document captures the shared understanding between the Next.js frontend and the NestJS backend. It is the human-readable companion to the typed contract in `src/types/api.ts`.

**How to use:**

- New integrations → check here for agreed field mappings
- Backend changes → update `src/types/api.ts` AND update the shared understanding below
- Discrepancies → add to the discrepancies table, do not paper over in code

---

## 1. Products (Physical)

### Endpoints

| Method | Path | FE Use |
| --- | --- | --- |
| `GET` | `/api/products?category={slug}` | Shop listing pages (category, gender filters) |
| `GET` | `/api/products/{slug}` | Product detail page (PDP) |

### Shared understanding

- A Product has a name, slug, description, status, kind (`PHYSICAL`), category, images, attributes, and variants.
- Products are visualised through their **default variant** (`isDefault: true`).
- A variant has a SKU, status, price tiers, option values (e.g. size/colour), and images.
- Categories are flat (no hierarchy yet — `shop`, `academy` slugs).
- The `GET /api/products` list response and `GET /api/products/{slug}` detail response share the same public shape; the detail response also includes `attributes[]`.

### Field mapping

| FE concept | Backend field | Notes |
| --- | --- | --- |
| Product name | `name` | Direct |
| Product slug | `slug` | Used in URL: `/shop/{categorySlug}/{productId}` — **note:** backend uses slug for detail lookup |
| Description | `description` | Direct |
| Gender | `gender` | Enum: `WOMEN`, `MEN`, `CHILDREN`, `UNISEX` |
| Featured | `featured` | Boolean, default `false` — for "New In" section |
| New badge | `isNew` | Boolean, default `false` — shows "New" badge on cards |
| **MOQ (wholesale threshold)** | **`moq`** | **Per-product minimum order quantity for wholesale pricing — new field. See MOQ section below.** |
| Category name | `category.name` | Nested object |
| Category slug | `category.slug` | E.g. `shop`, `academy` — used in route `/shop/[category]` |
| Images | `images[].file.url` | One or more per product |
| Variant SKU | `variants[].sku` | Displayed in admin, not on PDP |
| Variant price | `variants[].priceTiers[]` | See **Pricing & MOQ** below |
| Variant options (size, colour) | `variants[].optionValues[].optionValue` | Includes `optionType` for grouping |
| Variant images | `variants[].images[].file.url` | Variant-specific images |

### Pricing & MOQ — How they work together

**MOQ (`product.moq`)** is the per-product **wholesale threshold** — the quantity at which wholesale pricing kicks in. It's a *pricing threshold*, not a hard constraint. Customers can order fewer than the MOQ — they just pay retail.

**PriceTiers** are per-variant pricing levels. Each variant can have multiple tiers at different quantity thresholds, defining the unit price at each level. The cart automatically picks the best price tier for the quantity ordered.

**How to display:**
- Show the MOQ on product detail: "Buy `moq`+ units for wholesale"
- In cart: compute how many more to reach `moq` ("Add X more for wholesale"), then show the price from the best matching PriceTier at that quantity
- There is NO hard minimum enforcement — the MOQ is for display and pricing, not order blocking

**Example — Vedil Signature Tee (`moq: 40`):**

```
Variant price tiers:
  minQuantity=1,  amount=15000  (retail)
  minQuantity=10, amount=13500  (intermediate bulk)
  minQuantity=40, amount=10000  (wholesale — matches moq=40)
```

- Customer orders 1 → pays ₦15,000/unit. Display: "Add 39 more for wholesale (₦10,000)"
- Customer orders 10 → pays ₦13,500/unit. Display: still under MOQ, "Add 30 more for wholesale (₦10,000)"
- Customer orders 40 → pays ₦10,000/unit. Display: wholesale pricing applied

**How PriceTier relates to MOQ:**
- The PriceTier whose `minQuantity` matches the product's `moq` IS the displayed wholesale price
- If no PriceTier exactly matches the MOQ, pick the PriceTier with the largest `minQuantity` ≤ `moq` OR the first tier with `minQuantity ≥ moq` (whichever gives the best price)
- Additional tiers below MOQ (like the 10-unit tier above) are intermediate bulk discounts — they apply automatically in cart for any quantity

**Festive / seasonal promotions:**
- During a campaign, admin adds a temporary PriceTier to the variant (e.g., `minQuantity: 10, amount: 850000`)
- The product's `moq` field does NOT change — only the PriceTiers change
- The cart will automatically apply the best tier for any given quantity, so a customer buying 10 during the promo gets ₦8,500/unit even though the displayed MOQ remains 40
- When the campaign ends, the admin removes the temporary tier, and pricing returns to normal

**How PriceTiers work in cart (backend: `cart.service.ts` `calculateUnitPrice`):**
1. All price tiers for the variant are collected
2. Sorted descending by `minQuantity`
3. The first tier where `quantity >= minQuantity` wins
4. That tier's `amount` becomes the unit price (in kobo)

**Frontend mapper rules:**
```
// On product card / detail: use product.moq as the displayed threshold
const displayMoq = product.moq // Direct field, not derived

// Find the wholesale price at moq (for display)
const wholesaleTier = tiers.find(t => t.minQuantity === product.moq)
                    ?? tiers[tiers.length - 1]  // fallback to highest tier
const wholesalePrice = wholesaleTier.amount / 100

// For cart item enrichment, use product.moq
const moq = product.moq
const wholesalePrice = find the PriceTier that applies at quantity = product.moq
```

**Per-product MOQ values (from seed):**

| Product | MOQ | Wholesale tier at MOQ |
|---------|-----|----------------------|
| Vedil Signature Tee | 40 | `minQty=40, ₦10,000` |
| Aurora Blazer | 10 | `minQty=10, ₦65,000` |
| Lagos Linen Shirt | 40 | `minQty=40, ₦18,000` |
| Irene Midi Dress | 1 | Only retail tier exists (bespoke) |
| Vedil Tote Bag | 10 | `minQty=10, ₦30,000` |
| Courses | 1 | Only one tier (course enrollment) |

**Admin:** `moq` can be set when creating/updating a product via:
- `POST /api/admin/products/physical` — optional `moq` field (defaults to 40 if omitted)
- `PATCH /api/admin/products/:productId` — optional `moq` field
- `GET /api/admin/products/:productId` — returns `moq` field

**Global default:** `SiteConfig.moqDefault = 40` is the fallback default used when creating new products without specifying moq. It's exposed via `GET /api/config/public` as a convenience for the admin UI but has no direct role in pricing — that's always per-product.

### Constraint: Single default variant per product

- Exactly **one** variant per product should have `isDefault: true`.
- Multiple variants with `isDefault: true` is invalid — the frontend picks the first match arbitrarily, which is undefined behaviour.
- Products with zero variants set as default also need a default — the frontend falls back to `variants[0]`.
- The frontend `resolveVariantId()` helper uses `variants.find(v => v.isDefault) ?? variants[0]`.

### Discrepancies

| # | Issue | Frontend expects | Backend delivers | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| D1 | **Pricing model mismatch** | `retailPrice`, `wholesalePrice`, `moq` per product | `variants[].priceTiers[]` with `minQuantity`, `amount` per variant + **new `product.moq` field** | Medium | ✅ **Resolved** — Added `moq` directly on Product model. Frontend maps `product.moq` + derives wholesale price from best-matching PriceTier. See **Pricing & MOQ** section above. |
| D2 | **Gender field** | `gender: 'women' \| 'men' \| 'children' \| 'unisex'` | `gender: Gender?` on Product (WOMEN, MEN, CHILDREN, UNISEX) | Medium | ✅ **Done** — Added to schema + migration applied |
| D3 | **Featured / New flags** | `featured: boolean`, `isNew: boolean` | `featured: Boolean`, `isNew: Boolean` on Product, defaults to `false` | Low | ✅ **Done** — Added to schema + migration applied + seed |
| D4 | **Sizes array** | `sizes: string[]` for quick display | Only available through `optionValues` per variant | Low | 🟡 Workaround: compute from option values |

---

## 2. Courses

### Endpoints

| Method | Path | FE Use |
| --- | --- | --- |
| `GET` | `/api/courses` | Academy course listing |
| `GET` | `/api/courses/{slug}` | Course detail page (if needed) |

### Shared understanding

- A Course is a product with `kind: 'COURSE'` and a `courseProfile` sub-object.
- Courses are sold as a single variant with one price tier (no size/colour options).
- Backend manages course images, instructor, duration, delivery mode, and dates.

### Field mapping

| FE concept | Backend field | Notes |
| --- | --- | --- |
| Course title | `name` | Direct |
| Course slug | `slug` | Used in URL |
| Description | `description` | Direct |
| Instructor | `courseProfile.instructorName` | Nested |
| Duration | `courseProfile.durationText` | E.g. "8 weeks", "Self-paced (approx. 3 hours)" |
| Delivery mode | `courseProfile.deliveryMode` | ENUM: `SELF_PACED`, `LIVE`, `HYBRID` |
| Start / End dates | `courseProfile.startsAt`, `endsAt` | Null for self-paced |
| Price | `variants[].priceTiers[0].amount` | Single price in kobo |
| Image | `images[].file.url` | Course image |

### Discrepancies

| # | Issue | Frontend expects | Backend delivers | Priority | Status |
|---|---|---|---|---|---|
| D5 | **Fee breakdown missing** | `registration: ₦10k`, `tuition: ₦200k–800k`, `certificate: ₦20k` per course | Single `variants[].priceTiers[].amount` | Medium | 🔴 **Deferred** — See `docs/api-discrepancies.md` |

---

## 9. Course Enrollment (Direct Purchase)

### Endpoints

| Method | Path | FE Use |
|---|---|---|
| `POST` | `/api/courses/enroll` | Enroll in a course — bypasses cart entirely |

### Shared understanding

- Course purchase flows are **different from physical products**: single student per enrollment, no quantity, no cart, no delivery.
- The frontend calls this endpoint from the enroll slide-in panel.
- **Email OTP verification is required** (same flow as cart-based checkout). The frontend collects email → sends OTP → verifies OTP → gets verification token → then sends enroll request.
- The backend validates the variant, verifies the OTP token, checks for duplicate enrollment, creates the order (`PENDING_PAYMENT`), initializes Paystack, and returns the redirect URL.
- **Enrollment records are created post-payment** by the Paystack webhook handler or by the checkout status poll — not by the enroll endpoint itself. This keeps enrollment creation consistent with the cart-mediated flow.
- Quantity is always 1.

### Request

```json
{
  "email": "student@example.com",           // Student's email (required)
  "variantId": "uuid-of-course-variant",    // The course variant to enroll in
  "verificationToken": "eyJhbGciOiJIUzI1..." // From POST /api/email-verification/verify-otp
}
```

### Response

```json
{
  "orderReference": "ORD-XXXXXX",     // Used by confirmation page to poll status
  "authorizationUrl": "https://paystack.com/..."  // Redirect user here
}
```

### Flow diagram

```
Frontend (EnrollPanel)            Backend                         Paystack
    |                                |                                |
    |  Step 1: Enter email            |                                |
    |  POST /email-verification/send-otp                              |
    |------------------------------->|                                |
    |  { message }                    |                                |
    |<-------------------------------|                                |
    |                                |                                |
    |  Step 2: Enter OTP              |                                |
    |  POST /email-verification/verify-otp                            |
    |  { email, otp }                |                                |
    |------------------------------->|                                |
    |  { verificationToken }         |                                |
    |<-------------------------------|                                |
    |                                |                                |
    |  Step 3: Pay                    |                                |
    |  POST /api/courses/enroll       |                                |
    |  { email, variantId,            |                                |
    |    verificationToken }          |                                |
    |------------------------------->|                                |
    |                                |  Validate variant + OTP token   |
    |                                |  Create order (PENDING_PAYMENT) |
    |                                |  Initiate Paystack transaction  |
    |                                |------------------------------->|
    |  { orderReference,             |                                |
    |    authorizationUrl }          |                                |
    |<-------------------------------|                                |
    |                                |                                |
    |  Store orderReference in        |                                |
    |  sessionStorage                 |                                |
    |                                |                                |
    |  Redirect to authorizationUrl   |                                |
    |---------------------------------------------------------------->|
    |                                |                                |
    |  (User pays on Paystack)       |                                |
    |                                |                                |
    |  Paystack sends webhook         |                                |
    |  charge.success                |                                |
    |<---------------------------------------------------------------|
    |                                |                                |
    |  Paystack redirects to          |                                |
    |  /checkout/confirmation         |                                |
    |<---------------------------------------------------------------|
    |                                |                                |
    |  GET /api/checkout/status/{ref} |  Webhook marks order PAID      |
    |  (poll for PAID status)        |  + creates enrollment          |
    |------------------------------->|                                |
    |  { status: "PAID" }            |                                |
    |<-------------------------------|                                |
```

### Discrepancies

| # | Issue | Frontend expects | Backend delivers | Priority | Status |
|---|---|---|---|---|---|
| D11 | **Endpoint not yet built** | `POST /api/courses/enroll` | Built — accepts `{ email, variantId, verificationToken }`, requires OTP | High | ✅ **Done** — Endpoint created with OTP flow |

---

## 10. Cart

### Endpoints

| Method | Path | FE Use |
| --- | --- | --- |
| `GET` | `/api/cart/{cartSessionId}` | Load cart on page visit |
| `POST` | `/api/cart/{cartSessionId}/items` | Add item to cart |
| `PATCH` | `/api/cart/{cartSessionId}/items/{itemId}` | Update quantity |
| `DELETE` | `/api/cart/{cartSessionId}/items/{itemId}` | Remove item |
| N/A | `GET /api/variants?productId={id}` | (Optional) fetch variant details for add-to-cart |

### Shared understanding

- Cart is session-based, identified by a UUID (`cartSessionId`).
- The client generates and persists `cartSessionId` in `localStorage`.
- Cart items reference `variantId` (not productId).
- Prices are calculated server-side based on the variant's price tiers.
- Guest users (no auth) are the primary use case.

### Field mapping

| FE concept | Backend field | Notes |
| --- | --- | --- |
| Cart session ID | `cartSessionId` | Generated client-side, stored in localStorage |
| Item list | `items[]` | Array of cart items |
| Variant | `items[].variantId` | UUID referencing a variant |
| Quantity | `items[].quantity` | Direct |
| Unit price | `items[].unitPrice` | Calculated server-side (kobo) |
| Line total | `items[].lineTotal` | `unitPrice × quantity` (kobo) |
| Cart total | `total` | Sum of all line totals (kobo) |

### Discrepancies

| # | Issue | Frontend expects | Backend delivers | Priority | Status |
|---|---|---|---|---|---|
| D6 | **Cart is purely client-side** | `localStorage` cart with own pricing logic | Session-based backend cart | High | ✅ **Done** — CartContext rewritten to sync with backend |

---

## 4. Checkout

### Endpoints

| Method | Path | FE Use |
| --- | --- | --- |
| `POST` | `/api/checkout/initiate` | Submit cart + customer info → get Paystack URL |
| `GET` | `/api/checkout/status/{orderReference}` | Poll payment status after redirect |
| `GET` | `/api/orders/{orderReference}` | View order details (post-payment) |

### Shared understanding

- Checkout flow: Frontend collects customer info → `POST /api/checkout/initiate` → backend creates `PENDING_PAYMENT` order → returns Paystack `authorizationUrl` → frontend redirects → Paystack handles payment → webhook confirms → frontend polls or redirects to order confirmation.
- This replaces the current client-side-only Paystack integration where no order is persisted.

### Checkout flow diagram

```
Frontend                          Backend                       Paystack
   │                                │                              │
   │  POST /api/checkout/initiate   │                              │
   │  {cartSessionId, customer...}  │                              │
   │───────────────────────────────>│                              │
   │                                │  Create order (PENDING)      │
   │                                │  Initiate Paystack txn       │
   │                                │─────────────────────────────>│
   │  {authorizationUrl, ref}       │                              │
   │<───────────────────────────────│                              │
   │                                │                              │
   │  Redirect user to Paystack     │                              │
   │─────────────────────────────────────────────────────────────>│
   │                                │                              │
   │                                │  POST /api/webhooks/paystack │
   │                                │<─────────────────────────────│
   │                                │  Update order to PAID        │
   │                                │                              │
   │  GET /api/checkout/status/{ref}│                              │
   │  (poll or on-return)          │                              │
   │───────────────────────────────>│                              │
   │  {status: "PAID"}             │                              │
   │<───────────────────────────────│                              │
```

### Discrepancies

| # | Issue | Frontend expects | Backend delivers | Priority | Status |
|---|---|---|---|---|---|
| D7 | **Checkout architecture rewrite** | Paystack inline.js direct from browser | Backend-mediated order creation + redirect | High | ✅ **Done** — Rewritten to backend-mediated Paystack redirect |

---

## 5. Company Profile

### Endpoints

| Method | Path | FE Use |
|---|---|---|
| `GET` | `/api/company-profile` | Contact page, footer, WhatsApp float |

### Shared understanding

- Single record containing business contact info and social links.
- Used across multiple frontend components (contact page, footer, WhatsApp float, possibly more).

### Field mapping

| FE concept | Backend field | Notes |
| --- | --- | --- |
| Phone | `phone` | Display and `tel:` links |
| WhatsApp | `whatsapp` | WhatsApp button link |
| Email | `email` | Display and `mailto:` links |
| Street address | `addressLine` | Contact page |
| City | `city` | Contact page |
| State | `state` | Contact page |
| Social links | `instagramUrl`, `facebookUrl`, `tiktokUrl` | Footer icons |

### Discrepancies

| # | Issue | Frontend expects | Backend delivers | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| D8 | **Address mismatch** | "No. 95 Ago Palace Way, Okota, Lagos" (from DESIGN.md) | "12 Balogun Street, Lagos, Nigeria" | High | ✅ **Done** — Confirmed via site config endpoint, address updated | |
| D9 | **Missing social handles** | Footer Instagram/Facebook/TikTok currently link to `#` | Backend has URLs but they're configured | Medium | 🟡 Needs content input |

---

## 6. Site Config

### Endpoints

| Method | Path | FE Use |
|---|---|---|
| `GET` | `/api/config/public` | Delivery fee display, MOQ, currency |

### Shared understanding

- Public configuration for frontend display.
- Delivery fees stored in kobo (minor currency unit).
- MOQ default used for wholesale display.

### Field mapping

| FE concept | Backend field | Notes |
| --- | --- | --- |
| Currency | `currencyCode` | E.g. `NGN` |
| Local delivery fee | `localDeliveryFee` | In kobo (₦3,000 = 300000) |
| International delivery fee | `intlDeliveryFee` | In kobo |
| Default MOQ | `moqDefault` | E.g. 40 |

### Discrepancies

None currently. The mapping is straightforward.

---

## 7. Contact & Factory Inquiries

### Endpoints

| Method | Path | FE Use |
| --- | --- | --- |
| `POST` | `/api/contact-inquiries` | Contact form submission |
| `POST` | `/api/factory-inquiries` | Factory inquiry form (multipart with files) |

### Shared understanding

- Forms should POST to the backend API instead of the current Next.js API routes that email directly via Resend.
- Backend stores inquiries in the database and manages status lifecycle (NEW → READ → REPLIED → CLOSED).
- Backend handles email notifications internally.
- Factory inquiries accept multipart file uploads (design files, tech packs — max 5 files, 20MB each).

### Discrepancies

| # | Issue | Frontend expects | Backend delivers | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| D10 | **Form submission goes to Next.js route** | POST to `/api/contact` or `/api/factory` (Next.js route) | POST to `/api/contact-inquiries` or `/api/factory-inquiries` (NestJS) | High | ✅ **Done** — Next.js routes removed, forms POST to NestJS |
| D12 | **Phone/email validation rejects empty strings** | Either phone OR email — user can provide one contact method | `@IsOptional()` on both fields, but empty string `""` (not `undefined`) triggers `@IsEmail()` rejection. | Medium | ✅ **Done** — Added `@Transform()` to coerce empty strings to `undefined` in both inquiry DTOs |

---

## 8. Email Verification (for Course Checkout)

### Endpoints

| Method | Path | FE Use |
| --- | --- | --- |
| `POST` | `/api/email-verification/send-otp` | Send 6-digit OTP for course checkout |
| `POST` | `/api/email-verification/verify-otp` | Verify OTP → get verification token → pass to checkout initiate |

### Shared understanding

- Course purchases require email verification before checkout initiation.
- Flow: Enter email → send-otp → enter code → verify-otp → get token → include in `InitiateCheckoutPayload.emailVerificationToken`.

### Discrepancies

None currently. This is a new flow not yet built on the frontend.

---

## Summary of All Discrepancies

| # | Domain | Issue | Status |
| --- | --- | --- | --- |
| D1 | Products | Pricing model — tiers vs retail/wholesale/moq | ✅ **Resolved** — See **Pricing & MOQ** section |
| D2 | Products | Missing `gender` field | ✅ **Done** — Added to schema + migration applied |
| D3 | Products | Missing `featured` / `isNew` flags | ✅ **Done** — Added to schema + migration + seed |
| D13 | Products | Missing `moq` per product | ✅ **Done** — Added `moq Int @default(40)` to Product schema + admin DTOs + seed. Frontend uses `product.moq` directly. See pricing section above. |
| D4 | Products | Sizes only in option values, not as quick-access array | 🟡 Workaround |
| D5 | Courses | Missing fee breakdown (reg/tuition/cert) | 🗓️ Deferred |
| D6 | Cart | Client-only cart not connected to backend | ✅ Done |
| D7 | Checkout | Flow architecture differs completely | ✅ Done |
| D8 | Company | Address mismatch (Ago Palace vs Balogun) | ✅ **Done** — Confirmed via site config, address updated |
| D9 | Company | Social handles not configured | 🟡 Content input |
| D10 | Forms | Next.js route vs backend API | ✅ Done |
| D11 | Course Enrollment | `POST /api/courses/enroll` endpoint not built | ✅ **Done** — Endpoint created with OTP flow |
| D12 | Inquiries | Backend rejects empty string phone/email instead of treating as optional | ✅ **Done** — Added `@Transform()` to both inquiry DTOs |

---

## Decision Log

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-07-12 | Use **TanStack Query** for data fetching | Best fit for async server state, caching, refetching |
| 2026-07-12 | Pricing model discrepancy **deferred** | Will document as backend feedback and decide after seeing empty states |
| 2026-07-12 | Course fee breakdown **deferred** | Will document as backend feedback for schema update |
| 2026-07-15 | Course direct-purchase flow — new `POST /api/courses/enroll` endpoint | Course purchases bypass cart entirely; single-student, no quantity, no delivery |
| 2026-07-18 | Course enrollment requires **email OTP verification** | Same pattern as cart-based checkout — send-otp → verify-otp → JWT token → enroll |
| 2026-07-18 | **Enrollment records created post-payment** (not by enroll endpoint) | Webhook and status poll handle enrollment creation, consistent with cart-mediated flow |
| 2026-07-18 | **Gender field** added to Product schema | `Gender` enum (`WOMEN`, `MEN`, `CHILDREN`, `UNISEX`), nullable on Product |
| 2026-07-18 | **D12 fixed** — `@Transform()` on phone/email in inquiry DTOs | Empty strings `""` now coerced to `undefined` before validation |
| 2026-07-18 | **Address confirmed** via site config endpoint | Ago Palace Way is the correct address |
| 2026-07-18 | **Featured/isNew flags** added to Product schema | `featured: Boolean`, `isNew: Boolean` — both default to `false` |
| 2026-07-19 | **MOQ per product** — added `moq` field to Product model | Per-product wholesale threshold, defaults to `SiteConfig.moqDefault` (40). Cart already picks best PriceTier automatically. See **Pricing & MOQ** section. |
