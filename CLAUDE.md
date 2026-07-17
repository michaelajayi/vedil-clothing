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
- **Data fetching** — TanStack Query (`@tanstack/react-query`)
- **Backend API client** — `src/lib/api.ts` (typed fetch wrapper)
- No component library — all UI is custom

## Design tokens (`src/app/globals.css`)

| Token | Value | Use |
| --- | --- | --- |
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

| Route | Status | Data source |
| --- | --- | --- |
| `/` | ✅ Done | Static |
| `/about` | ✅ Done | Static |
| `/academy` | ✅ Done | Backend API (TanStack Query) |
| `/garment-factory` | ✅ Done | Static + Next.js API route |
| `/contact` | ✅ Done | Backend API (TanStack Query) + client form |
| `/faq` | ✅ Done | Static |
| `/shop` | ✅ Done | Backend API (TanStack Query) |
| `/shop/[category]` | ✅ Done | Backend API (TanStack Query) |
| `/shop/[category]/[product]` | ✅ Done | Backend API (TanStack Query) |
| `/cart` | ✅ Done | Client-only (localStorage) |
| `/checkout` | ✅ Done | Client-only (Paystack); delivery fees from API |

## Integration status

See `thoughts/plans/2026-07-12-fe-be-integration.md` for the full integration plan.

| Phase | Status |
| --- | --- |
| 0: Documentation & Contract | ✅ Done |
| 1: Strip hardcoded data | ✅ Done |
| 2: TanStack Query + API client | ✅ Done |
| 3: Wire endpoints | 🟡 6/10 domains wired, 4 remain (see below) |
| 4: Test integrations | ⏳ Not started |

### Domain-level status

| # | Domain | Frontend components | Backend hook | Schema discrepancy | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | **Company Profile** | ✅ ContactInfo, FooterContact wired | ✅ `useCompanyProfile()` | D8 (address mismatch) | ✅ Done |
| 2 | **Site Config** | ✅ Delivery fees in checkout | ✅ `useSiteConfig()` | None | ✅ Done |
| 3 | **Products** | ✅ ProductListClient, CategoryGridClient, ProductDetailClient | ✅ `useProducts()`, `useProduct()` | D2 (gender), D3 (featured/isNew) — heuristic workaround | ✅ Done |
| 4 | **Courses** | ✅ CourseListClient with skeleton/error/empty | ✅ `useCourses()` | D5 (fee breakdown — deferred) | ✅ Done |
| 5 | **Cart API** | ⏳ Not wired (localStorage only) | ✅ Hook exists | None — backend auto-creates cart | 🟢 Ready to wire |
| 6 | **Contact Form** | ✅ Wired to backend API, Next.js route removed | ✅ `useSubmitContact()` | None | ✅ Done |
| 7 | **Factory Form** | ✅ Wired to backend API (multipart), Next.js route removed | ✅ `useSubmitFactoryInquiry()` | None | ✅ Done |
| 8 | **Email Verification** | ⏳ No OTP UI built | ✅ `useSendOtp()`, `useVerifyOtp()` | None | 🟢 Ready to wire |
| 9 | **Checkout Initiate** | ⏳ Paystack inline.js (no backend involvement) | ✅ `useInitiateCheckout()` | D7 — architectural mismatch: needs rewrite to backend-mediated flow | 🔴 Needs rewrite |
| 10 | **Course Enrollment** | ⏳ Depends on email verification + checkout flow | ⏳ Not started | Depends on #8 + #9 | 🔴 Blocked |

**🟢 Ready to wire** means hooks exist with zero schema discrepancy — only frontend component work needed.

## Pre-launch checklist

- [ ] Deploy backend to public URL (Render / Railway / Fly.io)
- [ ] Set `NEXT_PUBLIC_API_URL` in production — point to deployed backend
- [ ] Set `CORS_ORIGINS` on backend — allow frontend production domain
- [ ] Set `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` — production Paystack key
- [x] Wire contact form → backend API (Next.js route removed)
- [x] Wire factory form → backend API (Next.js route removed)
- [x] Wire cart API (rewrite CartContext to use TanStack Query)
- [x] Rewrite checkout flow (backend-mediated Paystack redirect)
- [ ] Set `PAYSTACK_CALLBACK_URL` on backend — e.g. `https://vedilclothing.com/checkout/callback`
- [ ] Replace product image placeholders (`.ph`) with real photos
- [ ] Fix footer nav links (`/shop/men`, `/shop/women` → 404)
- [ ] Confirm company address (Ago Palace Way vs Balogun St)
- [ ] Configure social media URLs in backend
- [ ] Remove dead CSS (old shop-section classes — see `REWORK.md`)
- [ ] Confirm email address with owner (`hello@vedilclothing.com`)

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
pnpm dev         # http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
npm run start    # production server
```

### Backend API

Requires the NestJS backend at `http://localhost:4000`. Configure via:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Testing (Playwright)

### Commands

```bash
npx playwright test              # run all tests, generate traces
npx playwright test --ui         # open dashboard — replay, inspect, watch live
npx playwright test --headed     # watch run in real browser
npx playwright test -g "contact" # run tests matching name
npx playwright test --debug      # Playwright Inspector, step through actions
npx playwright show-report       # open HTML report from last run
```

### What accumulates per run

Each test produces a `trace.zip` and (if enabled) a `video.webm` in `test-results/<test-name>/`.
With 11 tests, one full run = ~93MB: ~86MB traces (2–15MB each), ~4MB videos (40KB–600KB each), ~3MB screenshots.
**Default config:** `trace: on`, `video: off`, `screenshot: off` — trace alone covers everything UI Mode needs.
Video is worth enabling temporarily when debugging animation or transition bugs; screenshot is redundant when trace is on.

### Locator hierarchy — use in this order

```ts
page.getByRole("button", { name: "Send Message" })  // best — survives redesigns
page.getByLabel("Email address")
page.getByPlaceholder("Your name")
page.getByText("exact visible string", { exact: true })
page.locator(".scoped-css-class")                   // ok for stable component hooks
page.locator("[data-testid='hero']")                // add to markup when needed
// Never: nth-child selectors, unscoped text=Men, xpath
```

Scope locators to reduce ambiguity:

```ts
const form = page.locator("form#contact");
await form.getByLabel("Email").fill("...");
```

### The one rule agents must not break — no arbitrary waits

Playwright auto-waits for elements to be visible, enabled, and stable before every action. Never add `waitForTimeout` to paper over timing issues — it creates flaky tests that randomly fail and mask real problems.

```ts
// Wrong
await page.waitForTimeout(1000);
await page.click("button");

// Right — let Playwright's auto-wait do its job
await page.getByRole("button", { name: "Submit" }).click();

// Right — when you genuinely need to wait for state change
await page.waitForSelector("button:not([disabled])");
await page.getByRole("button", { name: "Submit" }).click();
```

If a test is flaky, investigate the root cause (race condition, animation, network) — never silence it with a sleep.

### What to test vs. skip

| Test | Skip |
| --- | --- |
| User-facing flows — nav, forms, CTAs | CSS class names or visual pixel positions |
| Error and empty states | Things TypeScript already enforces |
| Critical content — phone, WhatsApp link | Every line of copy on every page |
| Navigation — does clicking a link go to the right URL | Internal component state |

### One behavior per test

If a test is named "contact form", it should not also check the footer phone number. Keep assertions scoped to what the test name says.
