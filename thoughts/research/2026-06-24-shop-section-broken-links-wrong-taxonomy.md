# Research: Shop Section — Broken Links and Wrong Taxonomy

**Date**: 2026-06-24
**Ticket**: `thoughts/tickets/2026-06-24-bug-shop-section-broken-links-and-wrong-taxonomy.md`
**Screenshots**:
- `thoughts/research/screenshots/2026-06-24-shop-section.png` — shop section viewport
- `thoughts/research/screenshots/2026-06-24-homepage-full.png` — full homepage

## Research Question

`ShopSection.tsx` links to four non-existent routes (`/shop/men`, `/shop/women`, `/shop/children`, `/shop/new-arrivals`) and presents demographic categories (Men / Women / Children) as the top-level taxonomy. The correct taxonomy is Africa My Heritage / Ready to Wear / Accessories.

## What I Expected to Find

- Three broken `<Link>` hrefs pointing to non-existent demographic routes
- A fourth broken link to `/shop/new-arrivals`
- CSS modifier classes (`.men`, `.women`, `.kids`) tied to demographic identity that will need replacement or re-assignment
- `CATEGORY_META` in `src/lib/products.ts` ready to supply correct display names and taglines

All assumptions were confirmed exactly.

## Current State

### Rendered Output

Screenshot: `thoughts/research/screenshots/2026-06-24-shop-section.png`

The `#shop` section renders as follows (confirmed visually):

- **3-column `cat-grid`** with tall portrait cards labeled **Men** (khaki/brown gradient), **Women** (burgundy/crimson gradient), **Children** (gold/tan gradient). Each card shows a monogram letter placeholder (`M`, `W`, `C`), a tagline "Clothing & Accessories", and a "Browse [X] →" link.
- **`cat-sub` row** below renders two wide landscape cards side-by-side: **Accessories** (dark ink gradient) and **New Arrivals** (dark burgundy gradient). Each has a short description and a CTA link.
- The full-page screenshot confirms the shop section is visible between the hero and a large blank-appearing mid-section (likely the FeaturedSection with unloaded placeholders).

**Visible breakage**: All three main card links and the New Arrivals sub-card link navigate to 404. The Accessories sub-card link resolves correctly. The taxonomy shown (Men / Women / Children) does not match the Header dropdown, which shows Africa My Heritage / Ready to Wear / Accessories.

### Component Tree

```
[Page]   src/app/page.tsx
  └─ [Section]  src/components/home/ShopSection.tsx  — all broken links live here
```

`ShopSection.tsx` has no sub-component imports beyond `next/link`. It is a self-contained Server Component (no `"use client"` directive).

### Route Audit

| Link text | `href` | Route exists? | Notes |
|---|---|---|---|
| Browse Men | `/shop/men` | ❌ 404 | No `src/app/shop/men/` directory |
| Browse Women | `/shop/women` | ❌ 404 | No `src/app/shop/women/` directory |
| Browse Children | `/shop/children` | ❌ 404 | No `src/app/shop/children/` directory |
| Shop Accessories | `/shop/accessories` | ✅ 200 | Resolves via `src/app/shop/[category]/page.tsx` with `category=accessories` |
| See What's New | `/shop/new-arrivals` | ❌ 404 | No static or dynamic route; `new-arrivals` is not a valid `Category` type in `src/lib/products.ts` |

**Existing routes under `/shop/`:**

| Route | File |
|---|---|
| `/shop` | `src/app/shop/page.tsx` |
| `/shop/[category]` | `src/app/shop/[category]/page.tsx` |
| `/shop/[category]/[product]` | `src/app/shop/[category]/[product]/page.tsx` |

Valid category slugs (from `src/lib/products.ts:1`): `africa-my-heritage`, `ready-to-wear`, `accessories`.

### CSS / Design Tokens Used

**`cat-grid` / `cat-card` block — `src/app/globals.css:308–331`**

| Class | Purpose | Status after fix |
|---|---|---|
| `.cat-card.men` | gradient for men card `.ph` | Will be orphaned — no element will carry `.men` |
| `.cat-card.women` | gradient for women card `.ph` | Will be orphaned — no element will carry `.women` |
| `.cat-card.kids` | gradient for children card `.ph` | Will be orphaned — no element will carry `.kids` |

No new collection modifier classes exist yet. The three modifier classes `.men`, `.women`, `.kids` on lines 324–326 are the only thing that applies a background to the main card placeholder `<div class="ph">`.

**`cat-sub` / `sub-card` block — `src/app/globals.css:333–349`**

| Class | Purpose | Status after fix |
|---|---|---|
| `.sub-card.acc` | gradient for accessories sub-card `.ph` | Kept — Accessories sub-card is being removed from sub-row; class becomes unused |
| `.sub-card.new` | gradient for new-arrivals sub-card `.ph` | Will be orphaned — new arrivals sub-card is removed |

No hardcoded colour values found directly in `ShopSection.tsx`. All colours are in `globals.css` via the modifier classes above.

### `CATEGORY_META` — source of truth (`src/lib/products.ts:18–37`)

| Slug | `name` | `tagline` | `mono` |
|---|---|---|---|
| `africa-my-heritage` | Africa My Heritage | Ankara · African prints | `A` |
| `ready-to-wear` | Ready to Wear | Everyday dressing, elevated | `R` |
| `accessories` | Accessories | The finishing touch | `Ac` |

### Header Dropdown — correct taxonomy already in place (`src/components/layout/Header.tsx`)

Desktop mega-menu links (lines 45–70):
- `/shop/africa-my-heritage` ✅
- `/shop/ready-to-wear` ✅
- `/shop/accessories` ✅
- `/shop/ready-to-wear?gender=women` ✅ (secondary)
- `/shop/ready-to-wear?gender=men` ✅ (secondary)
- `/shop/ready-to-wear?gender=children` ✅ (secondary)
- `/shop` View All ✅

Mobile menu links (lines 122–124): same three correct collection slugs. Header is confirmed out of scope.

### Existing Patterns to Follow

- **`ShopSection.tsx:49–54`** — the `.sub-card.acc` article already uses `CATEGORY_META`-aligned content ("Accessories") and a working link (`/shop/accessories`). The three main cards must be rebuilt to the same shape.
- **`globals.css:324–326`** — the `.men`, `.women`, `.kids` modifier pattern establishes how placeholder gradients are assigned; new collection modifiers (e.g. `.amh`, `.rtw`, `.acc`) should follow the same rule: `.cat-card.XXX .ph { background: linear-gradient(...) }`.

### Constraints Discovered

- **Server Component** — `ShopSection.tsx` has no `"use client"`. It must stay a Server Component after the fix; no state or effects are needed.
- **`.reveal` on every article** — all three `<article class="cat-card ... reveal">` elements and both `<article class="sub-card ... reveal">` elements use `.reveal`. The plan must preserve `.reveal` on replacement articles; `ScrollRevealInit` is already present on the home page.
- **`cat-sub` layout** — `.cat-sub` is defined as a 2-column grid (`grid-template-columns: 1fr 1fr`, `globals.css:333`). If the New Arrivals card is removed and only one sub-card remains, the grid will have a single cell that spans half width. This is a layout consequence the plan must address.
- **Mobile breakpoint** — `globals.css:942–944` collapses `.cat-grid` to `grid-template-columns: 1fr` and `.cat-sub` to `grid-template-columns: 1fr` at the mobile breakpoint. No change needed — these already handle a single-column layout.

## Open Questions

1. **What replaces the New Arrivals sub-card?** The ticket says "replaced — no link to `/shop/new-arrivals`" but does not specify the replacement. Options: a second collection card (e.g. Ready to Wear in the sub-row position), a CTA card linking to `/shop`, or removing the `.cat-sub` row entirely. This is a product/content decision.
2. **Gradient colours for new collection modifier classes** — the `.men`, `.women`, `.kids` gradients are visual placeholders until real photos arrive. Which placeholder gradient palette should `.amh`, `.rtw` use? (`.acc` gradient already exists at `globals.css:344`.)

## Files Referenced

- `src/components/home/ShopSection.tsx:1–69` — all four broken links; card content to be replaced
- `src/lib/products.ts:1` — `Category` type defining valid slugs
- `src/lib/products.ts:18–37` — `CATEGORY_META` with display names, taglines, mono characters
- `src/app/globals.css:308–331` — `.cat-grid`, `.cat-card`, `.cat-card.men/women/kids` definitions
- `src/app/globals.css:333–349` — `.cat-sub`, `.sub-card`, `.sub-card.acc/new` definitions
- `src/app/globals.css:942–944` — mobile breakpoint collapse rules for shop grid
- `src/components/layout/Header.tsx:45–70` — desktop mega-menu (correct taxonomy, out of scope)
- `src/components/layout/Header.tsx:122–124` — mobile menu (correct taxonomy, out of scope)
- `src/app/shop/[category]/page.tsx` — dynamic route that resolves valid category slugs
