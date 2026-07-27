# Runway Page — Build Plan

## Status: ✅ Approved — Ready to Implement

---

## Overview

A continuous fashion runway/media gallery page for Vedil Clothing. Displays a mix of **images and videos** from fashion shows and events (e.g., Africa Fashion Week Nigeria 2018, Epic Fashion Week 2026). Media hosted on Cloudinary, shared as raw upload URLs.

---

## Route

```
/runway  →  src/app/runway/page.tsx
```

---

## Data Model

No CMS or database. A simple typed array in the page file (or `src/data/runway.ts` for cleanliness):

```typescript
interface RunwayMedia {
  type: 'image' | 'video';
  url: string;
  alt: string;
  poster?: string; // optional video thumbnail
}
```

Owner pastes new Cloudinary URLs into the array. That's it.

---

## Page Structure

```
┌─────────────────────────────────────────┐
│  PAGE HERO                              │
│  "IMPERIAL SOFTNESS COLLECTION"         │
│  "Woman — a blend of softness and       │
│   power..."                             │
│  ── Epic Fashion Week 2026 ──           │
│  Nature-themed, timeless silhouettes    │
├─────────────────────────────────────────┤
│                                         │
│  RUNWAY GALLERY (fluid aspect-ratio)    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │ img  │ │ img  │ │ vid  │ │ img  │  │
│  │port. │ │port. │ │ land │ │port. │  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
│                                         │
│  (each item at its natural aspect ratio)│
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  LIGHTBOX (modal on click)              │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │   (image or video full-screen)  │    │
│  │                                 │    │
│  │  ◄  ● ● ●  ►                   │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

---

## Component Tree

```
src/
├── app/
│   └── runway/
│       └── page.tsx              ← Hero + gallery data + page metadata
├── components/
│   └── runway/
│       ├── RunwayClient.tsx       ← Client wrapper (scroll reveal, lightbox state)
│       ├── RunwayGrid.tsx         ← The fluid aspect-ratio grid
│       ├── RunwayMediaItem.tsx    ← Single image/video with hover play
│       └── RunwayLightbox.tsx     ← Full-screen modal for both types
└── styles/
    └── runway.css                 ← Gallery-specific styles
```

---

## Grid Layout: Fluid Aspect-Ratio Grid

**Not masonry.** Not uniform grid. Each item renders at its **natural aspect ratio** within a responsive grid:

- **Desktop**: 2-column grid, items span 1 or 2 columns based on aspect ratio
  - Portrait images: 1 column, full height
  - Landscape videos: 2 columns, full width
  - Landscape images: 1 column or 2 columns depending on composition
- **Tablet**: 2-column, same logic
- **Mobile**: Single column, full width
- **Videos are visually distinguished** by a subtle play icon overlay (not a loud badge)

---

## Interactions

| Action | Behavior |
| --- | --- |
| **Hover on image** | Subtle scale-up (existing `.img-media--hover` pattern) |
| **Hover on video** | Autoplay muted preview, play icon fades in |
| **Click any media** | Opens lightbox at natural aspect ratio |
| **Lightbox — image** | Full-screen, arrow navigation, close on backdrop click/Escape |
| **Lightbox — video** | Full-screen with native controls, arrow navigation |
| **Full-screen button** | In lightbox, enters browser fullscreen API |
| **Keyboard** | ← → arrows, Escape to close |
| **Mobile** | Swipe to navigate, tap to toggle controls |

---

## Navigation Placement

Add "Runway" to ALL nav areas:

- **Desktop nav**: Primary nav item (between "About" and "It's Fun to Sew")
- **Mobile nav**: Same position
- **Footer**: Add to the link columns

---

## Design Tokens

All from existing CSS variables:

| Token | Value | Usage |
| --- | --- | --- |
| `--cream` | #FBF6EE | Page background |
| `--ink` | #2A211B | Body text |
| `--ink-soft` | #6B5D52 | Secondary text |
| `--burgundy` | #6E1F2A | Headings, play buttons |
| `--gold` | #B07A3C | Accents |
| `--line` | rgba(42,33,27,.12) | Borders |
| `--r` | 18px | Border radius |
| `--font-display` | Fraunces | Collection titles |
| `--font-body` | Hanken Grotesk | Body copy |

---

## Motion

- `reveal` scroll animations (existing pattern — opacity + translateY)
- Video hover: crossfade to play with play icon transition
- Lightbox: fade + scale-in (0.3s cubic-bezier)
- Reduced motion respected (existing `@media (prefers-reduced-motion: reduce)`)

---

## Cloudinary URLs

Owner provides raw upload URLs. No transformation params needed — I handle optimization on the frontend:

- Images: Next.js `<Image>` with `unoptimized={false}` or Cloudinary loader
- Videos: `<video>` element with `poster` attribute

**Example URLs:**

```
https://res.cloudinary.com/jqaitieh/image/upload/v1785191409/filename.jpg
https://res.cloudinary.com/jqaitieh/video/upload/v1785191480/filename.mp4
```

---

## Implementation Order

1. Create `src/app/runway/page.tsx` — server component with metadata + hero + client wrapper
2. Create `src/components/runway/RunwayClient.tsx` — client component managing lightbox state
3. Create `src/components/runway/RunwayGrid.tsx` — the fluid aspect-ratio grid
4. Create `src/components/runway/RunwayMediaItem.tsx` — image/video with hover preview
5. Create `src/components/runway/RunwayLightbox.tsx` — full-screen modal
6. Create `src/styles/runway.css` — grid and lightbox styles
7. Update `src/components/layout/Header.tsx` — add "Runway" to desktop nav
8. Update `src/components/layout/Header.tsx` — add "Runway" to mobile nav
9. Update `src/components/layout/Footer.tsx` — add "Runway" to footer links
10. Verify with `lens_diagnostics` and `lsp_diagnostics`

---

## Copy for Page Hero

**Title:** Imperial Softness Collection

**Body:**
> Woman — a blend of softness and power. VEDIL explores this delicate duality through luxury evening and cocktail dresses.
>
> VEDIL isn't just fashion; it's a celebration of the complex beautiful essence of being a woman. Each masterpiece captures the pure innocence of the girl, the radiant beauty of the lady and the unyielding strength of the grown woman.
>
> It's simply our journey and we celebrate it.
>
> My collection for the Epic Fashion Week 2026; is a nature themed collection that features timeless, natural silhouette. The choice of fabric is intentional to give soft, fairylike appearance.

**Eyebrow:** Epic Fashion Week 2026 · Africa Fashion Week Nigeria

---

## Initial Media Assets

```typescript
{
  type: 'image',
  url: 'https://res.cloudinary.com/jqaitieh/image/upload/v1785191409/africa_fashion_week_nigeria_2018_high_quality_sm1qzo.jpg',
  alt: 'Africa Fashion Week Nigeria 2018 — runway look'
},
{
  type: 'video',
  url: 'https://res.cloudinary.com/jqaitieh/video/upload/v1785191480/africa_fashion_week_nigeria_2018_low_quality_aikqp3.mp4',
  alt: 'Africa Fashion Week Nigeria 2018 — runway walk',
  poster: 'https://res.cloudinary.com/jqaitieh/image/upload/v1785191409/africa_fashion_week_nigeria_2018_high_quality_sm1qzo.jpg'
}
```
