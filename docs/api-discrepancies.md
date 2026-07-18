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

## Deferred Discrepancies

These are accepted gaps. The frontend will work around them for now, and we'll revisit as a group when requirements are clearer.

### D1 — Pricing model: tiers vs retail/wholesale/MOQ

- **Context:** The frontend was built with a simple 2-tier model (`retailPrice` + `wholesalePrice` + `moq` per product). The backend delivers N-tier pricing (`variants[].priceTiers[]` with arbitrary `minQuantity` thresholds).
- **Decision:** Deferred — the frontend will initially display the first price tier as the base price. Course enrollment and cart pricing will use the full tier model directly.
- **When to revisit:** When the shop's wholesale display logic is designed.

### D5 — Course fee breakdown

- **Context:** The frontend currently shows 3 line items per course: Registration (₦10k), Tuition (₦200k–800k), Certificate (₦20k). The backend only has a single `priceTiers[].amount`.
- **Decision:** Deferred — the backend may need a `registrationFee` field or the breakdown should be embedded in the course description text.
- **When to revisit:** When the academy enrollment flow is built.