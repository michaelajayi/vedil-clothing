# Backend Feedback — FE↔BE Discrepancies

> **Purpose:** Document gaps between what the frontend needs and what the backend currently delivers. This is the communication channel for backend changes.
> **Context:** The `docs/api-contract.md` file captures the full shared understanding. This file extracts only the discrepancies needing backend action.

---

## Priority Legend

| Label | Meaning |
| --- | --- |
| 🔴 **Required** | Blocking — FE cannot properly display the domain without this |
| 🟡 **Enhancement** | Improves FE output but has a workaround |
| 🗓️ **Deferred** | Accepted gap — will revisit later |

---

## D2 — Products missing `gender` field

- **Endpoint:** `GET /api/products`, `GET /api/products/{slug}`
- **Current state:** Products have no `gender` attribute
- **What the frontend needs:** Products should be filterable by `gender` — values: `women`, `men`, `children`, `unisex`
- **Priority:** 🔴 Required
- **Suggested approach:** Either:
  - Add an `attribute` with `name: "gender"` (and treat it specially), or
  - Add a dedicated `gender` column to the product schema
- **Affected pages:** `/shop/[category]` — gender filter tabs (Women / Men / Children / All)

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

## D8 — Company profile address mismatch

- **Endpoint:** `GET /api/company-profile`
- **Current backend value:** "12 Balogun Street, Lagos, Nigeria"
- **Frontend expectation (from DESIGN.md):** "No. 95 Ago Palace Way, Okota, Lagos, Nigeria"
- **Priority:** 🔴 Required (one is wrong — need to confirm which)
- **Action needed:** Confirm correct address with business owner and update accordingly
- **Affected pages:** `/contact`, footer, any component displaying business address

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
