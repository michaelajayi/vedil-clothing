# Implementation Plan: Shop Section — Fix Broken Links & Correct Taxonomy

## Overview
The homepage shop section (`ShopSection.tsx`) sells the wrong navigation: it shows demographic cards (Men / Women / Children) linking to four routes that 404. The correct top-level taxonomy — Africa My Heritage / Ready to Wear / Accessories — already exists as valid `/shop/[category]` routes and is already used in the header. This change rewrites the section to three collection cards on the existing `.cat-grid`, removes the broken `.cat-sub` row (Accessories + New Arrivals), and adds Playwright coverage proving every link resolves to HTTP 200.

## Current State
- `src/components/home/ShopSection.tsx` (Server Component, no `"use client"`) renders:
  - A `.cat-grid` with **three `.cat-card`** articles: `men` → `/shop/men` (404), `women` → `/shop/women` (404), `kids` → `/shop/children` (404).
  - A `.cat-sub` with **two `.sub-card`** articles: `acc` → `/shop/accessories` (200, correct), `new` → `/shop/new-arrivals` (404).
- `src/lib/products.ts:1` — `Category = 'africa-my-heritage' | 'ready-to-wear' | 'accessories'`. `CATEGORY_META` (`products.ts:18–37`) holds `name`, `tagline`, `description`, `mono` for each — the source of truth for card copy.
- `src/app/shop/[category]/page.tsx` guards the dynamic route with `isValidCategory()` (`products.ts:198`); any slug not in `CATEGORY_META` returns 404. This is why the four demographic/new-arrivals slugs 404.
- `src/app/globals.css:324–326` — gradient modifiers `.cat-card.men/.women/.kids`. No equivalents exist for the three collection slugs.
- `src/app/globals.css:333–349` — `.cat-sub` / `.sub-card` block, including `.sub-card.acc` (`:344`) and `.sub-card.new` (`:345`).
- `src/app/globals.css:941–944` — at `≤760px`, `.cat-grid` and `.cat-sub` collapse to 1 column; `.cat-card` switches to `aspect-ratio: 16/11`. Grid-level rules, unaffected by card content.
- `src/components/layout/Header.tsx:45–53` — already links the three correct collection routes. Reference implementation; **not changed** by this plan.

What is broken: 4 of 5 links (Men, Women, Children, New Arrivals). What is correct: the Accessories link, the `.cat-grid`/`.cat-card` layout CSS, and the header taxonomy.

## Desired End State
The homepage `#shop` section shows **three** cards in a single 3-column grid:
1. **Africa My Heritage** (burgundy gradient) → `/shop/africa-my-heritage`
2. **Ready to Wear** (dark-brown gradient) → `/shop/ready-to-wear`
3. **Accessories** (gold gradient) → `/shop/accessories`

There is no second sub-row. Every link in the section resolves to HTTP 200. On mobile (≤760px) the three cards stack vertically. Verify by: scrolling to `#shop` and screenshotting three cards with the correct headings/gradients; running the Playwright spec that asserts each card's `href` and a 200 navigation response for each.

## What We Are NOT Doing
From the ticket's Out of Scope (confirmed still valid after research):
- Building `/shop/men`, `/shop/women`, `/shop/children`, or `/shop/new-arrivals` routes.
- Implementing `?gender=` filtering on the Ready to Wear page.
- Changing the `/shop` index page — correct as-is.
- Changing the Header dropdown — already correct.
- Replacing image placeholders with real photos (`.ph` / `.ph-mono` / `.ph-tag` stay).

Adjacent items research surfaced, also out of scope:
- **No deletion of the dead shop-section CSS** (`.cat-card.men/.women/.kids`, `.cat-sub`, `.sub-card.acc/.new`). The `.cat-sub` markup is removed from the JSX, but the CSS rules are left in place for a separate cleanup pass (research decision, line 123). Logged for follow-up in `REWORK.md` (repo root) → "Remove dead shop-section CSS after taxonomy rewrite".
- No new content (View-All card, wholesale CTA) added to fill the removed sub-row.

## Decisions
| Option considered | Chosen? | Reason |
|---|---|---|
| Reuse `.men/.women/.kids` class names, only relabel content | No | Class names would lie about their content; future edits get confusing. |
| Add semantic modifier classes `.cat-card.heritage/.rtw/.acc` | **Yes** | Names match the collection; gradient intent is self-documenting. |
| Define three brand-new gradients | No | Three existing gradients are on-brand and sufficient; new tokens are scope creep. |
| Keep `.cat-sub` row with a filler card | No | No remaining shop taxonomy for it; filler is out of scope (research line 123). |
| Promote Accessories into the main 3-card grid | **Yes** | Leaves exactly three collections = the three `.cat-grid` columns. |

Gradient → collection mapping (confirmed with owner): Africa My Heritage = burgundy (`#6e1f2a→#a4565f`), Ready to Wear = dark brown (`#4a3526→#7d6347`), Accessories = gold (`#8a6a2f→#c2a35e`) — the three existing gradient values, reused 1:1.

## Open Questions Resolved
- **Gradient assignment** (deferred by ticket): resolved with owner — burgundy/brown/gold as above.
- All other decisions were pre-made by the ticket or resolved in research (`Resolved Decisions`, research line 121). No open questions remain.

---

## Phase 1: Rewrite Shop Section to Correct Taxonomy

### What This Phase Accomplishes
Replaces the three demographic cards and two-card sub-row with three collection cards pointing at the real routes, and adds the matching gradient classes. This is a single cohesive phase because the JSX modifier class names and the CSS gradient selectors must change together to build correctly — there is no meaningful intermediate state. When done, the `#shop` section is screenshot-verifiable and every link returns 200.

### Changes Required

#### `src/components/home/ShopSection.tsx`
Rewrite the body of the `<section id="shop">` while keeping the file a Server Component (no `"use client"`, no state/effects) and keeping the `ArrowIcon` helper and `import Link from "next/link"` unchanged.

- **`.sec-head` block**: keep as-is (eyebrow "The Shop", `<h2>Shop by category</h2>`, intro `<p>`). No change.
- **`.cat-grid`**: replace the three existing `<article>` cards with three new ones, in this order. Use `CATEGORY_META` copy verbatim (do not invent strings):

  1. Africa My Heritage
     - `<article className="cat-card heritage reveal">`
     - `.ph`: `<span className="ph-mono">A</span><span className="ph-tag">Africa My Heritage · Image</span>`
     - `<h3>Africa My Heritage</h3>`
     - `<p className="sub">Ankara · African prints</p>` (the `tagline`)
     - `<Link href="/shop/africa-my-heritage" className="link-arrow">Browse Heritage <ArrowIcon /></Link>`
  2. Ready to Wear
     - `<article className="cat-card rtw reveal">`
     - `.ph`: `<span className="ph-mono">R</span><span className="ph-tag">Ready to Wear · Image</span>`
     - `<h3>Ready to Wear</h3>`
     - `<p className="sub">Everyday dressing, elevated</p>`
     - `<Link href="/shop/ready-to-wear" className="link-arrow">Browse Ready to Wear <ArrowIcon /></Link>`
  3. Accessories
     - `<article className="cat-card acc reveal">`
     - `.ph`: `<span className="ph-mono">Ac</span><span className="ph-tag">Accessories · Image</span>`
     - `<h3>Accessories</h3>`
     - `<p className="sub">The finishing touch</p>`
     - `<Link href="/shop/accessories" className="link-arrow">Browse Accessories <ArrowIcon /></Link>`

  Keep the existing inner structure: `<div className="ph">…</div>` then `<div className="body"><h3>…</h3><p className="sub">…</p><Link/></div>`.
- **`.cat-sub` block** (current `ShopSection.tsx:48–65`): **delete entirely** — both `.sub-card` articles and the wrapping `<div className="cat-sub">`.

#### `src/app/globals.css`
- Under the "Shop by Category" section, **add** three modifier rules immediately after `.cat-card.kids .ph` (`:326`), mirroring the existing pattern:
  ```css
  .cat-card.heritage .ph { background: linear-gradient(150deg, #6e1f2a, #a4565f); }
  .cat-card.rtw .ph      { background: linear-gradient(150deg, #4a3526, #7d6347); }
  .cat-card.acc .ph      { background: linear-gradient(150deg, #8a6a2f, #c2a35e); }
  ```
  (Values reuse the three existing gradients per the confirmed mapping.)
- **Do NOT remove** `.cat-card.men/.women/.kids` (`:324–326`), `.cat-sub` (`:333`), `.sub-card.acc` (`:344`), or `.sub-card.new` (`:345`) — left for a separate cleanup pass. No new design tokens; gradients are literal hex matching the existing convention in this block.
- **Do NOT touch** the mobile rules at `:941–944`. `.cat-grid` already collapses to 1 column; the now-empty `.cat-sub` mobile rule is harmless.

### Playwright Tests Required
- File: `tests/shop-section.spec.ts`
- **Test: `home shop section — three collection cards link to valid routes`**
  - `await page.goto("/")`
  - Scope to the section: `const shop = page.locator("section#shop")`
  - For each `{ name, href }` of:
    - `{ name: "Browse Heritage", href: "/shop/africa-my-heritage" }`
    - `{ name: "Browse Ready to Wear", href: "/shop/ready-to-wear" }`
    - `{ name: "Browse Accessories", href: "/shop/accessories" }`
    - Assert `await expect(shop.getByRole("link", { name })).toHaveAttribute("href", href)`
- **Test: `home shop section — every link resolves to HTTP 200`**
  - `await page.goto("/")`
  - Collect hrefs: `const hrefs = await page.locator("section#shop a[href^='/shop']").evaluateAll(els => els.map(e => e.getAttribute("href")))`
  - Assert `expect(hrefs.length).toBe(3)` (proves the broken sub-row is gone — no 4th/5th link)
  - For each href: `const res = await page.goto(href!); expect(res?.status()).toBe(200)`
- **Test: `home shop section — no broken demographic or new-arrivals links remain`**
  - `await page.goto("/")`
  - For each dead route `["/shop/men", "/shop/women", "/shop/children", "/shop/new-arrivals"]`:
    - Assert `await expect(page.locator(`section#shop a[href='${route}']`)).toHaveCount(0)`

  All locators use `getByRole`/scoped CSS per CLAUDE.md hierarchy. No `waitForTimeout`: href assertions and `page.goto` need no reveal-animation wait (attributes exist in the DOM regardless of `.in` visibility state).

### Visual Success Criteria
- [x] Screenshot after change: three cards in one row — burgundy "Africa My Heritage", dark-brown "Ready to Wear", gold "Accessories"; no second sub-row beneath.
- [x] All three section links resolve without 404 (Playwright navigation test).
- [x] Mobile ≤760px: three cards stack to a single column (existing `.cat-grid` rule); screenshot at 375px width.
- [x] Design: gradients applied via the new `.cat-card.heritage/.rtw/.acc` classes — no hardcoded hex in JSX (`ShopSection.tsx` stays colour-free).

### Automated Success Criteria
- [ ] `npm run build` — blocked by pre-existing lucide-react missing dep (audit ticket opened).
- [x] `npm run lint` — no errors in changed files (pre-existing issues elsewhere).
- [x] `npx playwright test tests/shop-section.spec.ts` — all three tests pass.

**After automated criteria pass: take desktop + mobile screenshots of `#shop` and compare against Desired End State before considering the phase complete.**

---

## References
- Ticket: `thoughts/tickets/2026-06-24-bug-shop-section-broken-links-and-wrong-taxonomy.md`
- Research artifact: `thoughts/research/2026-06-24-shop-section-broken-links-and-wrong-taxonomy.md`
- Component to rewrite: `src/components/home/ShopSection.tsx:19–65`
- Gradient classes: `src/app/globals.css:324–326` (add after); `.cat-sub`/`.sub-card`: `:333–349`
- Mobile rules (do not touch): `src/app/globals.css:941–944`
- Taxonomy source of truth: `src/lib/products.ts:1` (`Category`), `:18–37` (`CATEGORY_META`), `:198` (`isValidCategory`)
- Reference implementation: `src/components/layout/Header.tsx:45–53`
- Existing test patterns: `tests/site.spec.ts`
