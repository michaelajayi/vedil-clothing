# Vedil Clothing — Project Guide

> **See `DESIGN.md` for business details** (confirmed contacts, all course fees, product names, e-commerce model, page-by-page content notes). Read it before starting any new page.

## What this is
A multi-page Next.js website for **Vedil Clothing**, a Lagos-based fashion house with three verticals:
1. **Shop** — Ready-to-wear (retail + wholesale) for men, women, children + accessories
2. **It's Fun to Sew Academy** — In-person sewing classes (online cohort model planned, not yet live)
3. **Garment Factory** — Bulk production, custom orders, wholesale for brands and individuals

## Tech stack
- **Next.js** (latest, App Router, TypeScript)
- **Tailwind CSS v4** — utility classes only for one-off spacing/layout; all design lives in CSS variables
- **Fonts** — `Fraunces` (serif display) + `Hanken Grotesk` (sans body) via `next/font/google`
- No component library — all UI is custom

## Design tokens (`src/app/globals.css`)

| Token | Value | Use |
|---|---|---|
| `--cream` | `#FBF6EE` | Page background |
| `--paper` | `#F4ECDF` | Section backgrounds |
| `--ink` | `#2A211B` | Body text, footer bg |
| `--ink-soft` | `#6B5D52` | Secondary text |
| `--burgundy` | `#6E1F2A` | Primary accent, CTAs |
| `--gold` | `#B07A3C` | Secondary accent |
| `--line` | `rgba(42,33,27,.12)` | Borders, dividers |

Body uses a warm paper-grain gradient on `background-attachment: fixed`.

## Component architecture
- `src/components/layout/Header.tsx` — sticky nav, desktop dropdown, mobile slide-in
- `src/components/layout/Footer.tsx` — full footer (contact, links, socials)
- `src/components/layout/WhatsAppFloat.tsx` — global fixed WhatsApp button (bottom-right)
- `src/components/home/ScrollRevealInit.tsx` — client component; add at top of every page that uses `.reveal`

Home page sections live in `src/components/home/`. New pages get their own folder under `src/components/` if they have reusable sub-components; otherwise self-contained `page.tsx` is fine.

## Global WhatsApp button
One global `WhatsAppFloat` in the root layout. Do **not** add another WhatsApp button anywhere else.

## Scroll reveal
`.reveal` + `.in` toggled by IntersectionObserver in `ScrollRevealInit`. Siblings stagger 80ms each.

## Page status

| Route | Status |
|---|---|
| `/` | ✅ Done |
| `/about` | ✅ Done |
| `/academy` | ✅ Done |
| `/garment-factory` | ✅ Done |
| `/contact` | ✅ Done |
| `/shop` | 🔜 Next |
| `/shop/[category]` | 🔜 Planned |
| `/faq` | 🔜 Planned |

## Working conventions
- **Reuse before creating** — check `globals.css` for an existing class before adding one
- **Named CSS classes over utilities** for anything more than one-off spacing
- **Server components by default** — `"use client"` only for state/effects/browser APIs
- **Image placeholders** — `.ph` + `.ph-tag` + `.ph-mono` until real photos arrive; real images use `next/image`
- **Internal links** — always `next/link` (`Link`), never raw `<a>` for internal navigation
- **Confirmed phone:** `+234 813 868 3171` / WhatsApp: `https://wa.me/2348138683171`
- **Email:** `hello@vedilclothing.com` *(confirm with owner before launch)*

## Running locally
```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
```
