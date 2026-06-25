---
type: bug
workflow: RPI
date: 2026-06-24
source: observation
---

## Concern

`ShopSection.tsx` links to four routes that do not exist (`/shop/men`, `/shop/women`, `/shop/children`, `/shop/new-arrivals`), and uses demographic categories (Men / Women / Children) as primary navigation when the correct top-level taxonomy is Africa My Heritage / Ready to Wear / Accessories.

## Acceptance Criteria

- [ ] All links in the homepage shop section resolve to HTTP 200 — no 404s
- [ ] The three main cards show Africa My Heritage, Ready to Wear, and Accessories — not Men, Women, Children
- [ ] Each card links to its correct existing route (`/shop/africa-my-heritage`, `/shop/ready-to-wear`, `/shop/accessories`)
- [ ] The New Arrivals sub-card is replaced — no link to `/shop/new-arrivals`
- [ ] Playwright test confirms all shop section links return 200 on navigation

## Out of Scope

- Building `/shop/men`, `/shop/women`, `/shop/children`, or `/shop/new-arrivals` routes
- Implementing `?gender=` filtering on the Ready to Wear category page
- Changing the shop page (`/shop`) — it is correct as-is
- Changing the Header dropdown — it already implements the correct taxonomy
- Replacing image placeholders with real photos

## Likely Components

- `src/components/home/ShopSection.tsx` — all broken links live here; full rewrite of card content
- `src/app/globals.css` — `.cat-card.men`, `.cat-card.women`, `.cat-card.kids` modifier classes need collection equivalents added
- `src/lib/products.ts` — `CATEGORY_META` is the source of truth for collection slugs and display names; read before writing card copy

## Routes Affected

| Route | Exists? |
|---|---|
| `/shop/men` | ❌ 404 |
| `/shop/women` | ❌ 404 |
| `/shop/children` | ❌ 404 |
| `/shop/new-arrivals` | ❌ 404 |
| `/shop/africa-my-heritage` | ✅ |
| `/shop/ready-to-wear` | ✅ |
| `/shop/accessories` | ✅ |

## External Dependencies

none

## Workflow

→ RPI: start with /research
