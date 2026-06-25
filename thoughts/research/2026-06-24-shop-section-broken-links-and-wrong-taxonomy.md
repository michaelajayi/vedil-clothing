# Research: Shop Section — Broken Links and Wrong Taxonomy

**Date**: 2026-06-24
**Ticket**: `thoughts/tickets/2026-06-24-bug-shop-section-broken-links-and-wrong-taxonomy.md`
**Screenshot**: scratchpad/shop-section.png (homepage #shop anchor, 2s delay)

---

## Research Question

`ShopSection.tsx` links to four routes that do not exist (`/shop/men`, `/shop/women`, `/shop/children`, `/shop/new-arrivals`), and uses demographic categories (Men / Women / Children) as primary navigation when the correct top-level taxonomy is Africa My Heritage / Ready to Wear / Accessories.

## What I Expected to Find

Pre-search: the shop section would have three demographic cards as written in the ticket, and `CATEGORY_META` would be the authoritative slug list. Both confirmed correct. The `/shop/[category]` dynamic route was expected to 404 for unknown slugs — confirmed.

---

## Current State

### Rendered Output

Three tall placeholder cards are visible in a 3-column grid: dark-brown ("M"), burgundy ("W"), gold ("C"). The scroll reveal animation has not yet fired at page load in the screenshot so card body text (headings, sub-labels, links) is not visible, but is present in the DOM. Below the grid, two horizontal sub-cards exist (Accessories, New Arrivals) — not visible in the viewport crop captured.

### Component Tree

```
[Page] src/app/page.tsx
  └─ [Section] src/components/home/ShopSection.tsx
       └─ 3× <article className="cat-card {modifier} reveal">
            └─ <div className="ph"> (image placeholder)
            └─ <div className="body">
                 └─ <h3>, <p className="sub">, <Link href="...">
       └─ 2× <article className="sub-card {modifier} reveal">
            └─ <div className="ph"> (image placeholder)
            └─ <div> with <h3>, <p>, <Link href="...">
```

### Route Audit

| Link text | href | Route exists? | Source line |
|---|---|---|---|
| Browse Men | `/shop/men` | ❌ 404 | `ShopSection.tsx:25` |
| Browse Women | `/shop/women` | ❌ 404 | `ShopSection.tsx:34` |
| Browse Children | `/shop/children` | ❌ 404 | `ShopSection.tsx:43` |
| Shop Accessories | `/shop/accessories` | ✅ 200 | `ShopSection.tsx:54` |
| See What's New | `/shop/new-arrivals` | ❌ 404 | `ShopSection.tsx:62` |

Correct target routes (confirmed via `curl`, served by `src/app/shop/[category]/page.tsx`):

| Route | HTTP | Notes |
|---|---|---|
| `/shop/africa-my-heritage` | ✅ 200 | Dynamic `[category]` route, validated by `isValidCategory()` |
| `/shop/ready-to-wear` | ✅ 200 | Dynamic `[category]` route |
| `/shop/accessories` | ✅ 200 | Dynamic `[category]` route |
| `/shop/men` | ❌ 404 | Not a valid `Category` in `CATEGORY_META` |
| `/shop/women` | ❌ 404 | Not a valid `Category` in `CATEGORY_META` |
| `/shop/new-arrivals` | ❌ 404 | Not a valid `Category` in `CATEGORY_META` |

### CATEGORY_META (source of truth — `src/lib/products.ts:18–37`)

| Slug | `name` | `tagline` | `mono` |
|---|---|---|---|
| `africa-my-heritage` | Africa My Heritage | Ankara · African prints | `A` |
| `ready-to-wear` | Ready to Wear | Everyday dressing, elevated | `R` |
| `accessories` | Accessories | The finishing touch | `Ac` |

### CSS / Design Tokens in Scope

**Cat-card modifier classes** (`src/app/globals.css:324–326`) — these set the `.ph` background gradient:
- `.cat-card.men .ph` — `linear-gradient(150deg, #4a3526, #7d6347)` (dark brown)
- `.cat-card.women .ph` — `linear-gradient(150deg, #6e1f2a, #a4565f)` (burgundy)
- `.cat-card.kids .ph` — `linear-gradient(150deg, #8a6a2f, #c2a35e)` (gold)

No equivalents exist for `africa-my-heritage`, `ready-to-wear`, or `accessories` on `.cat-card`.

**Sub-card modifier classes** (`src/app/globals.css:344–345`) — also set the `.ph` background:
- `.sub-card.acc .ph` — `linear-gradient(120deg, #2a211b, #5a4636)` (dark brown)
- `.sub-card.new .ph` — `linear-gradient(120deg, #561620, #8a3f49)` (burgundy)

The `.sub-card.acc` class is used in `ShopSection.tsx:49` on the Accessories sub-card (the only correctly-linked card). The `.sub-card.new` class is used in `ShopSection.tsx:57` on the New Arrivals card.

**All other layout classes used in `ShopSection.tsx`** — confirmed present in `globals.css`:
- `.cat-grid` (line 308) — 3-column grid
- `.cat-card` (line 311) — base card style, relative positioned, overflow hidden
- `.cat-card .ph` (line 317), `.cat-card::after` (line 318) — gradient overlay
- `.cat-sub` (line 333) — 2-column sub-grid
- `.sub-card` (line 336) — base sub-card style

No hardcoded colour values found in `ShopSection.tsx` — colours are set only via CSS class modifiers in `globals.css`.

### Header Dropdown — Correct Taxonomy Already Implemented

`src/components/layout/Header.tsx` already uses the correct routes:
- Line 45: `<Link href="/shop/africa-my-heritage">`
- Line 49: `<Link href="/shop/ready-to-wear">`
- Line 53: `<Link href="/shop/accessories">`
- Lines 61–67: gender filter links (`?gender=women`, `?gender=men`, `?gender=children`) on `/shop/ready-to-wear`
- Line 70: `/shop` view-all link

### Existing Patterns to Follow

- **Header.tsx:45–53** — correct three-card taxonomy, same slugs to reuse in `ShopSection.tsx`
- **`CATEGORY_META`** (`products.ts:18`) — `name`, `tagline`, `description`, `mono` fields ready to populate card copy without inventing new strings
- **`.sub-card.acc`** — `globals.css:344` already applies the dark-brown gradient; this class is already used on the Accessories sub-card in the current `ShopSection.tsx:49`

### Constraints Discovered

- `src/app/shop/[category]/page.tsx` uses `isValidCategory()` (`products.ts:198`) to guard the dynamic route — slugs not in `CATEGORY_META` return 404. This is why `/shop/men`, `/shop/women`, `/shop/children`, `/shop/new-arrivals` all 404.
- `ShopSection.tsx` is a Server Component (no `"use client"` directive) — must remain one; no state or effects may be added.
- The `.cat-card` modifier class names (`men`, `women`, `kids`) are applied directly in JSX as string literals (`className="cat-card men reveal"`) — not via CSS Modules — so renaming them requires changes to both `ShopSection.tsx` and `globals.css`.
- `ScrollRevealInit` is already present on the home page (confirmed in `src/app/page.tsx`). The `.reveal` class is correctly applied to all `<article>` elements and the `.sec-head` in `ShopSection.tsx`.
- Mobile breakpoints `globals.css:942–944` collapse `.cat-grid` and `.cat-sub` to 1 column — these rules are grid-level and unaffected by card content changes.

---

## Open Questions

None. All decisions are resolved.

## Resolved Decisions

- **`.cat-sub` section is to be removed entirely.** All three navigable collections (Africa My Heritage, Ready to Wear, Accessories) will be promoted to main `.cat-card` entries in the `.cat-grid`. There is no remaining shop taxonomy content for the sub-row, and adding filler (a "View All" card, a wholesale CTA) would be out of scope for this section. Plan stage should delete the entire `.cat-sub` block from `ShopSection.tsx` and leave `.sub-card.acc` and `.sub-card.new` CSS rules in `globals.css` in place (they may be used elsewhere or can be cleaned up in a separate pass).

---

## Files Referenced

- `src/components/home/ShopSection.tsx:1–69` — all broken links; all wrong card labels
- `src/app/globals.css:308–349` — `.cat-grid`, `.cat-card`, `.cat-card.men/.women/.kids`, `.cat-sub`, `.sub-card.acc/.new`
- `src/app/globals.css:942–944` — mobile responsive overrides for `.cat-grid` and `.cat-sub`
- `src/lib/products.ts:1–2` — `Category` type (authoritative slug list)
- `src/lib/products.ts:18–37` — `CATEGORY_META` (display names, taglines, mono letters)
- `src/lib/products.ts:198–200` — `isValidCategory()` — gateway for `[category]` route
- `src/app/shop/[category]/page.tsx` — dynamic shop category route (serves 200 for valid slugs only)
- `src/components/layout/Header.tsx:45–70` — reference implementation of correct taxonomy links
