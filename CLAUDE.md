# Vedil Clothing — Project Guide

## What this is
A multi-page Next.js website for **Vedil Clothing**, a Lagos-based fashion house with three distinct verticals:
1. **Shop** — Ready-to-wear for men, women, and children (+ accessories, new arrivals)
2. **It's Fun to Sew Academy** — In-person and online sewing courses
3. **Garment Factory** — Custom and bulk manufacturing for brands and events

The home page introduces all three verticals with teaser sections and CTAs. Each vertical has (or will have) its own dedicated page with full detail.

## Tech stack
- **Next.js** (latest, App Router, TypeScript)
- **Tailwind CSS v4** — used for utility classes; design-system tokens live in CSS variables
- **Fonts** — `Fraunces` (serif display, via `next/font/google`) + `Hanken Grotesk` (sans body)
- No component library — all UI is custom

## Design language
All tokens are defined as CSS custom properties in `src/app/globals.css`:

| Token | Value | Use |
|---|---|---|
| `--cream` | `#FBF6EE` | Page background |
| `--paper` | `#F4ECDF` | Section backgrounds (academy) |
| `--ink` | `#2A211B` | Body text, footer bg |
| `--ink-soft` | `#6B5D52` | Secondary text |
| `--burgundy` | `#6E1F2A` | Primary accent, CTAs |
| `--gold` | `#B07A3C` | Secondary accent |
| `--line` | `rgba(42,33,27,.12)` | Borders, dividers |

The body has a fixed warm paper-grain gradient (radial gradients on `background-attachment: fixed`).

## Component architecture
Reusable layout components (written once, used everywhere):
- `src/components/layout/Header.tsx` — sticky nav with desktop dropdown + mobile slide-in menu (client component for scroll + toggle state)
- `src/components/layout/Footer.tsx` — full footer with contact, links, socials
- `src/components/layout/WhatsAppFloat.tsx` — global fixed floating WhatsApp button (bottom-right, pulsing)

Home page sections live in `src/components/home/`. New pages get their own folder under `src/components/`.

## Global floating WhatsApp button
There is **one global floating WhatsApp button** rendered in the root layout (`WhatsAppFloat`). Do **not** add a WhatsApp button inside the mobile menu or any other nav element — it duplicates the global one.

## Scroll reveal animation
`.reveal` CSS class + `.in` toggled by `IntersectionObserver`. The observer is initialised in `ScrollRevealInit` (client component, rendered at the top of each page that needs it). Elements stagger by 80ms per sibling within the same parent.

## Page structure (planned)
| Route | Status | Notes |
|---|---|---|
| `/` | Done | Home — introduces all three verticals |
| `/shop` | Next | Shop landing / category overview |
| `/shop/[category]` | Planned | Men / Women / Children / Accessories |
| `/academy` | Planned | Full course listing + enrollment |
| `/garment-factory` | Planned | Factory detail + quote request form |
| `/about` | Planned | Brand story |
| `/contact` | Planned | Contact form + map |
| `/faq` | Planned | FAQ |

When building new pages: add the relevant teaser section on the home page, then build the full dedicated page. Home page sections are intros that link to full pages — they don't replace them.

## Working conventions
- **Reuse before creating** — check if the required component already exists before making a new one
- **CSS class names, not Tailwind utilities, for complex components** — the design uses named CSS classes (`.btn`, `.eyebrow`, `.cat-card`, etc.) defined in `globals.css`. Use Tailwind utilities only for simple, one-off spacing/layout needs on new pages
- **Server components by default** — only add `"use client"` when the component needs state, effects, or browser APIs (Header, ScrollRevealInit, interactive forms)
- **Image placeholders** — use the `.ph` class with `.ph-tag` and `.ph-mono` children until real product photography is available. Real images will use `next/image`
- **Links** — always use `next/link` (`Link`) not `<a>` for internal navigation
- **Phone / WhatsApp number** — `+234 801 234 5678` / `https://wa.me/2348012345678` (update when confirmed)
- **Email** — `hello@vedilclothing.com` (update when confirmed)

## Running locally
```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
```
