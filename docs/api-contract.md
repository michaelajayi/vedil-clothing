# API Contract: Vedil Frontend ↔ Backend

> **Last updated:** 2026-07-12
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
| Category name | `category.name` | Nested object |
| Category slug | `category.slug` | E.g. `shop`, `academy` — used in route `/shop/[category]` |
| Images | `images[].file.url` | One or more per product |
| Variant SKU | `variants[].sku` | Displayed in admin, not on PDP |
| Variant price | `variants[].priceTiers[]` | See **Discrepancies** below |
| Variant options (size, colour) | `variants[].optionValues[].optionValue` | Includes `optionType` for grouping |
| Variant images | `variants[].images[].file.url` | Variant-specific images |

### Constraint: Single default variant per product

- Exactly **one** variant per product should have `isDefault: true`.
- Multiple variants with `isDefault: true` is invalid — the frontend picks the first match arbitrarily, which is undefined behaviour.
- Products with zero variants set as default also need a default — the frontend falls back to `variants[0]`.
- The frontend `resolveVariantId()` helper uses `variants.find(v => v.isDefault) ?? variants[0]`.

### Discrepancies

| # | Issue | Frontend expects | Backend delivers | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| D1 | **Pricing model mismatch** | `retailPrice`, `wholesalePrice`, `moq` per product | `variants[].priceTiers[]` with `minQuantity`, `amount` per variant | Medium | 🔴 **Deferred** — See `docs/api-discrepancies.md` |
| D2 | **Gender field** | `gender: 'women' \| 'men' \| 'children' \| 'unisex'` | Not present in schema | Medium | 🔴 **Needs backend change** |
| D3 | **Featured / New flags** | `featured: boolean`, `isNew: boolean` | Not present in schema | Low | 🔴 **Needs backend change** |
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
- The frontend calls this endpoint directly when the user clicks "Pay Now" in the enroll slide-in panel.
- The backend creates the order + enrollment record directly (no cart involvement), initializes the Paystack transaction, and returns the redirect URL.
- Frontend flow: open enroll panel → enter email → click "Pay Now" → `POST /api/courses/enroll` → redirect to `authorizationUrl` → Paystack → redirect back to `/checkout/confirmation`.
- No email OTP verification needed (unlike the cart-based checkout flow) — the email is collected once on the enroll panel.
- Quantity is always 1.

### Request

```json
{
  "email": "student@example.com",      // Student's email (required)
  "variantId": "uuid-of-course-variant" // The course variant to enroll in
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
    |  POST /api/courses/enroll      |                                |
    |  { email, variantId }          |                                |
    |------------------------------->|                                |
    |                                |  Create order (PENDING)         |
    |                                |  Create enrollment record       |
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
    |  Paystack redirects to          |                                |
    |  /checkout/confirmation         |                                |
    |<---------------------------------------------------------------|
    |                                |                                |
    |  GET /api/checkout/status/{ref} |                                |
    |  (poll for PAID status)        |                                |
    |------------------------------->|                                |
    |  { status: "PAID" }            |                                |
    |<-------------------------------|                                |
```

### Discrepancies

| # | Issue | Frontend expects | Backend delivers | Priority | Status |
|---|---|---|---|---|---|
| D11 | **Endpoint not yet built** | `POST /api/courses/enroll` | N/A — not implemented | High | 🔴 **Needs backend implementation** |

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
| D6 | **Cart is purely client-side** | `localStorage` cart with own pricing logic | Session-based backend cart | High | 🔴 **Not yet integrated** |

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
| D7 | **Checkout architecture rewrite** | Paystack inline.js direct from browser | Backend-mediated order creation + redirect | High | 🔴 **Not yet integrated** |

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
| D8 | **Address mismatch** | "No. 95 Ago Palace Way, Okota, Lagos" (from DESIGN.md) | "12 Balogun Street, Lagos, Nigeria" | High | 🔴 **Needs confirmation** — which is correct? |
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
|---|---|---|---|---|---|
| D10 | **Form submission goes to Next.js route** | POST to `/api/contact` or `/api/factory` (Next.js route) | POST to `/api/contact-inquiries` or `/api/factory-inquiries` (NestJS) | High | 🔴 **Needs URL change + Resend removal from Next.js** |

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
| D1 | Products | Pricing model — tiers vs retail/wholesale/moq | 🔴 Deferred |
| D2 | Products | Missing `gender` field | 🔴 Needs backend |
| D3 | Products | Missing `featured` / `isNew` flags | 🔴 Needs backend |
| D4 | Products | Sizes only in option values, not as quick-access array | 🟡 Workaround |
| D5 | Courses | Missing fee breakdown (reg/tuition/cert) | 🔴 Deferred |
| D6 | Cart | Client-only cart not connected to backend | 🔴 Not integrated |
| D7 | Checkout | Flow architecture differs completely | 🔴 Not integrated |
| D8 | Company | Address mismatch (Ago Palace vs Balogun) | 🔴 Needs confirmation |
| D9 | Company | Social handles not configured | 🟡 Content input |
| D10 | Forms | Next.js route vs backend API | 🔴 Not integrated |
| D11 | Course Enrollment | `POST /api/courses/enroll` endpoint not built | 🔴 Needs backend |

---

## Decision Log

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-07-12 | Use **TanStack Query** for data fetching | Best fit for async server state, caching, refetching |
| 2026-07-12 | Pricing model discrepancy **deferred** | Will document as backend feedback and decide after seeing empty states |
| 2026-07-12 | Course fee breakdown **deferred** | Will document as backend feedback for schema update |
| 2026-07-15 | Course direct-purchase flow — new `POST /api/courses/enroll` endpoint | Course purchases bypass cart entirely; single-student, no quantity, no delivery |
