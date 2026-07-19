# Backend Feedback — FE↔BE Discrepancies

> **Purpose:** Document gaps between what the frontend needs and what the backend currently delivers. This is the communication channel for backend changes.
> **Context:** The `docs/api-contract.md` file captures the full shared understanding. This file extracts only the discrepancies needing backend action.
> **Last updated:** 2026-07-18

---

## Priority Legend

| Label | Meaning |
| --- | --- |
| 🔴 **Required** | Blocking — FE cannot properly display the domain without this |
| 🟡 **Enhancement** | Improves FE output but has a workaround |
| 🗓️ **Deferred** | Accepted gap — will revisit later |

---

## ✅ Resolved — Gender field (D2)

- **Endpoint:** `GET /api/products`, `GET /api/products/{slug}`
- **Action taken:** Added `Gender` enum (`WOMEN`, `MEN`, `CHILDREN`, `UNISEX`) and `gender Gender?` field to `Product` model in Prisma schema. Migration applied.
- **Status:** ✅ **Done**

---

## ✅ Resolved — Address mismatch (D8)

- **Endpoint:** `GET /api/company-profile`
- **Previous backend value:** "12 Balogun Street, Lagos, Nigeria"
- **Corrected value:** "No. 95 Ago Palace Way, Okota, Lagos, Nigeria"
- **Action taken:** Confirmed via site config endpoint. Address is now correct.
- **Status:** ✅ **Done**

---

## ✅ Resolved — Phone/email validation on inquiries (D12)

- **Endpoints:** `POST /api/contact-inquiries`, `POST /api/factory-inquiries`
- **Action taken:** Added `@Transform(({ value }: { value: unknown }) => value === '' ? undefined : value)` from `class-transformer` to both `phone` and `email` fields in both `CreateContactInquiryDto` and `CreateFactoryInquiryDto`. Empty strings are now coerced to `undefined` before validation runs.
- **Status:** ✅ **Done**

---

## D3 — Products missing `featured` / `isNew` flags

- **Endpoint:** `GET /api/products`, `GET /api/products/{slug}`
- **Current state:** No way to mark products as featured or new
- **What the frontend needs:**
  - `featured: boolean` — for "New In" section on `/shop`
  - `isNew: boolean` — shows a "New" badge on product cards and PDP
- **Priority:** 🟡 Enhancement
- **Suggested approach:** Add optional boolean fields to product schema (default `false`)
- **Affected pages:** `/shop` (New In section), category product cards (badge)

---

## D9 — Social media handles not configured

- **Endpoint:** `GET /api/company-profile`
- **Current backend value:** URLs exist (instagramUrl, facebookUrl, tiktokUrl) but need confirmation of correct handles
- **Frontend expectation:** Currently all footer social links point to `#`
- **Priority:** 🟡 Enhancement
- **Action needed:** Confirm social media handles with business owner

---

## ✅ Resolved — Pricing model / MOQ (D1)

- **Endpoint:** `GET /api/products`, `GET /api/products/{slug}`, `GET /api/admin/products/...`
- **Context:** The frontend was built with a 2-tier model (`retailPrice` + `wholesalePrice` + `moq` per product). The backend delivered N-tier pricing via `variants[].priceTiers[]`.
- **Resolution:** Added `moq Int @default(40)` directly to the `Product` model. Each product now has a definitive MOQ (wholesale threshold). The mapper (`src/lib/product-mapper.ts`) uses `product.moq` instead of deriving from `priceTiers[1]?.minQuantity`. Wholesale price is found by matching the PriceTier whose `minQuantity` equals the product's MOQ (or the nearest tier ≥ MOQ).
- **Files changed (backend):**
  - `prisma/schema.prisma` — added `moq Int @default(40)` to Product
  - `prisma/seed.ts` — set per-product MOQ values
  - `src/admin/products/dto/create-physical-product.dto.ts` — added `moq` field
  - `src/admin/products/dto/update-physical-product.dto.ts` — added `moq` field
  - `src/admin/products/admin-products.controller.ts` — persist moq on create/update
- **Files changed (frontend):**
  - `src/types/api.ts` — added `moq: number` to `ApiProductListItem`
  - `src/lib/product-mapper.ts` — use `api.moq` directly, find wholesale tier by MOQ match
  - `src/contexts/CartContext.tsx` — use `matchedProduct.moq` for cart item enrichment
- **See also:** `docs/api-contract.md` — **Pricing & MOQ** section for full integration guide
- **Status:** ✅ **Done**

## Deferred Discrepancies

These are accepted gaps. The frontend will work around them for now, and we'll revisit as a group when requirements are clearer.

### D5 — Course fee breakdown

- **Context:** The frontend currently shows 3 line items per course: Registration (₦10k), Tuition (₦200k–800k), Certificate (₦20k). The backend only has a single `priceTiers[].amount`.
- **Decision:** Deferred — the backend may need a `registrationFee` field or the breakdown should be embedded in the course description text.
- **When to revisit:** When the academy enrollment flow is built.