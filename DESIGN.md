# Vedil Clothing — Design Reference

## Business details (confirmed)
- **Owner:** Vivian Duru, founded 2012
- **Address:** No. 95 Ago Palace Way, Okota, Lagos, Nigeria
- **Phone:** +234 813 868 3171
- **WhatsApp:** https://wa.me/2348138683171
- **Email:** hello@vedilclothing.com *(update when owner confirms final address)*
- **Social:** Instagram, Facebook, TikTok, YouTube *(handles TBC)*

## Three verticals

### 1. Shop — `/shop`
Ready-to-wear retail + wholesale.

**Categories (active):**
- Africa My Heritage — Ankara / African prints (men, women, children)
- Ready to Wear — non-Ankara everyday pieces (men, women, children)
- Accessories — hats, jewellery, style pieces (men, women, children)

**Removed for now:** Bridals (no stock yet)

**Pricing model:**
- Each product has a retail price AND a wholesale price
- Wholesale price applies when qty ≥ MOQ (set per product, e.g. 6 pieces)
- Auto-switch: qty < MOQ → retail price, qty ≥ MOQ → wholesale price

**Product details:** Each listing must show size, style details, fabric (when available)

### 2. It's Fun to Sew Academy — `/academy`
In-person sewing classes in Lagos studio. Online cohort model being explored (Telegram
group + recorded content, not yet live — do not expose as an option).

**Courses (all in-person, Lagos):**

| Course | Duration | Registration | Tuition | Certificate |
|---|---|---|---|---|
| Basic Sewing Class | 3 months | ₦10,000 | ₦300,000 | ₦20,000 |
| Intermediate Sewing Class | 3 months | ₦10,000 | ₦400,000 | ₦20,000 |
| Advanced Sewing Class | 3 months | ₦10,000 | ₦500,000 | ₦20,000 |
| General Upgrade — Women's Wear | 3 months | ₦10,000 | ₦800,000 | ₦20,000 |
| Ready-to-Wear Production Class | 8 weeks | ₦10,000 | ₦300,000 | ₦20,000 |
| Children's Wear Class | 2 months | ₦10,000 | ₦300,000 | ₦20,000 |
| Menswear Class | 8 weeks | ₦10,000 | ₦300,000 | ₦20,000 |
| Apprenticeship Class | 2 months | ₦10,000 | ₦400,000 | ₦20,000 |

Take-in-order recommendation: Basic → Intermediate → Advanced (Foundation prerequisite for Intermediate).

Enrollment CTA currently goes to WhatsApp. Student Handbook is a document (not yet linked — TBC).

### 3. Garment Factory — `/garment-factory`
Three services, same page:

1. **Bulk Production** — MOQ 40 pieces/design, for retailers, corporates, events. Mix designs to reach MOQ on first order.
2. **Custom Orders** — Individual / small group bespoke. Client brings style reference + measurements (or fabric). Can also source fabric.
3. **Wholesale** — Catalogue-based, MOQ 40 pieces, both price tiers listed.

Inquiry form at `#quote` collects: name, phone/WhatsApp, email, service type, project details.

## Pages built

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ Done | Home — teasers for all three verticals |
| `/about` | ✅ Done | Founder story, mission/vision, three offerings, MADE TO MEASURE CTA |
| `/academy` | ✅ Done | Full course listing with real fees, alternating layout |
| `/garment-factory` | ✅ Done | Bulk, Custom, Wholesale + inquiry form |
| `/contact` | ✅ Done | Address, phone, email, WhatsApp, contact form |
| `/shop` | 🔜 Next | Shop landing + category pages |
| `/shop/[category]` | 🔜 Planned | Men / Women / Children / Accessories |
| `/faq` | 🔜 Planned | Accordion FAQ |

## CSS class inventory (key classes to reuse)

**Layout:** `.wrap`, `.sec-head`, `.sec-head.center`, `.page-hero`

**Components:** `.btn`, `.btn--ghost`, `.btn--enroll`, `.eyebrow`, `.link-arrow`, `.chip`

**Cards:** `.cat-card`, `.course-card`, `.testi-card`, `.offer-card`, `.why-card`, `.mv-card`

**Sections:** `.academy`, `.factory`, `.made-measure`, `.service-split`, `.service-split.flip`

**Forms:** `.cform`, `.field`, `.field-row`, `.factory-quote`

**Images:** `.ph`, `.ph-tag`, `.ph-mono` (placeholder system — keep until real photos arrive)

**Animation:** `.reveal` + `.in` (managed by `ScrollRevealInit`)

## Image placeholders
All images use `.ph` with `.ph-tag` (bottom-left label) and optional `.ph-mono` (centred italic letter).
Real photos will replace these via `next/image`. Do not remove placeholder markup — just swap in the `<Image>` component.

## E-commerce (not yet built)
- Cart state: client-side only (no backend chosen yet)
- Checkout: Paystack for payment (account exists, prices need updating)
- Shipping options: self-pick-up / customer's own dispatch / Vedil ships (DHL + others)
- No user accounts — remove "My Account" and "Order History" nav items
- Wishlist: not built yet

## Confirmed real product names (from WordPress)
- Jays Unisex Vintage Shirt — ₦12,000
- Elena Wrap Jumpsuit — ₦25,000
- Nora Crop Top — ₦15,000
- Menswear 04 — ₦55,000
- VGF14 — ₦67,600 · VGF13 — ₦43,600 · VGF12 — ₦40,600 *(garment factory samples)*
