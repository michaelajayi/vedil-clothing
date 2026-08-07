# Backend Needs: Announcement Popup System

> **Status:** Draft — for backend alignment
> **Frontend component:** `src/components/ui/AnnouncementModal.tsx`
> **Frontend type source:** `src/types/api.ts` (append to this file)
> **Backend base:** `http://localhost:4000`
> **Admin API key header:** `X-Admin-Key`
> **Admin API key value:** `grotesque`

---

## 1. Overview

The **Announcement Popup System** allows the business owner to create, schedule, and manage announcement popups that appear site-wide on first load. The system is designed for:

- **Multiple popups** with a configurable display order (a queue)
- **Date/time-based activation** — a popup only shows within its active window
- **Priority ordering** — when multiple popups are active, the highest-priority one shows
- **Dismissal tracking** — once a user dismisses a popup, it does not reappear (until the backend marks it as expired or a new popup is created)

The frontend component is already built. This document defines what the backend must deliver for the frontend to consume.

---

## 2. Backend Entity: `Popup`

### 2.1 Fields

| Field | Type | Required | Notes |
| ------- | ------ | ---------- | ------- |
| `id` | string (UUID) | ✅ | Primary key |
| `title` | string | ✅ | Short headline — displayed as the modal title |
| `body` | string | ✅ | HTML or plain text content — displayed as paragraphs in the modal body |
| `imageUrl` | string (URL) | ❌ | Image URL for the top graphic. If omitted, the modal renders without an image (text-only layout) |
| `imageAlt` | string | ❌ | Alt text for the image |
| `ctaText` | string | ❌ | Button label (e.g., "Shop Now", "Learn More", "Got It"). If omitted, no CTA button is rendered |
| `ctaLnk` | string (URL) | ❌ | Link destination for the CTA button. If omitted, the CTA button simply dismisses the modal |
| `newTag` | string | ❌ | Optional badge text (e.g., "NEW", "SALE"). If omitted, badge is not shown |
| `date` | string | ❌ | Optional date label (e.g., "Jul 31, 2026"). Displayed beside the badge |
| `activeFrom` | ISO 8601 datetime | ✅ | Start of active window. Popup will not show before this datetime |
| `activeUntil` | ISO 8601 datetime | ✅ | End of active window. Popup will not show after this datetime |
| `priority` | integer | ✅ | Display order. Lower number = higher priority. When multiple popups are active simultaneously, the one with the lowest `priority` value is shown. If priorities are equal, tie-break by `activeFrom` (newest first) |
| `isActive` | boolean | ✅ | Manual on/off toggle. If `false`, the popup is never shown regardless of date range |
| `createdAt` | ISO 8601 datetime | — | Auto-set on creation |
| `updatedAt` | ISO 8601 datetime | — | Auto-updated on modification |

### 2.2 Rules

1. A popup displays **only if ALL of these conditions are met**:
   - `isActive === true`
   - Current time is between `activeFrom` and `activeUntil`
   - The user has not dismissed it (tracked via localStorage — see §4)
2. **Only one popup shows at a time**. If multiple are active, select the one with the lowest `priority` value. If there's a tie, prefer the most recently created (`activeFrom` descending).
3. If no popups are active, nothing shows. The frontend handles this gracefully (returns null).
4. When a popup is dismissed, the frontend stores the `id` in localStorage and suppresses it. When the backend updates a popup or creates a new one, the frontend will detect the new `id` and show it.

---

## 3. API Endpoints

### 3.1 `GET /api/popups/active`

**Purpose:** Returns the single active popup that should be displayed to the user, if any.

**Public.** No authentication required. This is called on every page load from the frontend.

**Query parameters (optional):**

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| `dismissedIds` | CSV string | — | Comma-separated list of popup IDs the user has already dismissed. The backend will skip these when selecting the active popup. |

**Response `200 OK`:**

```json
{
  "popup": {
    "id": "uuid-string",
    "title": "No Available Designs on the Website",
    "body": "THERE ARE CURRENTLY NO AVAILABLE DESIGNS ON OUR WEBSITE.\n\nFrom 10th August, our website will once again be filled with available designs.\n\nWe look forward to welcoming you back. See you soon!",
    "imageUrl": "https://cdn.vedilclothing.com/popups/we-are-back.png",
    "imageAlt": "WE WILL BE BACK 10TH OF AUGUST",
    "ctaText": "Got It",
    "ctaLnk": null,
    "newTag": "NEW",
    "date": "Jul 31, 2026",
    "activeFrom": "2026-07-31T00:00:00Z",
    "activeUntil": "2026-08-10T23:59:59Z",
    "priority": 1
  }
}
```

**Response `200 OK` (no active popup):**

```json
{
  "popup": null
}
```

**How the frontend calls this (TanStack Query):**

```typescript
// src/lib/queries/popups.ts

import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ApiPopup {
  id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  imageAlt: string | null;
  ctaText: string | null;
  ctaLnk: string | null;
  newTag: string | null;
  date: string | null;
  activeFrom: string;
  activeUntil: string;
  priority: number;
}

export interface ActivePopupResponse {
  popup: ApiPopup | null;
}

export const activePopupOptions = (dismissedIds: string[]) =>
  queryOptions({
    queryKey: ["popups", "active", dismissedIds],
    queryFn: () =>
      api.get<ActivePopupResponse>(
        `/api/popups/active?dismissedIds=${dismissedIds.join(",")}`
      ),
    staleTime: 5 * 60 * 1000, // 5 min — popup state rarely changes
  });

export function useActivePopup() {
  // Read dismissed IDs from localStorage
  const dismissedIds: string[] = [];
  // (logic to read dismissedIds from localStorage goes here)

  return useQuery(activePopupOptions(dismissedIds));
}
```

### 3.2 `GET /api/popups` (Admin)

**Purpose:** List all popups for the admin dashboard.

**Authentication:** Requires `X-Admin-Key` header.

**Response `200 OK`:**

```json
{
  "popups": [
    {
      "id": "uuid-string",
      "title": "No Available Designs on the Website",
      "body": "...",
      "imageUrl": "...",
      "imageAlt": "...",
      "ctaText": "Got It",
      "ctaLnk": null,
      "newTag": "NEW",
      "date": "Jul 31, 2026",
      "activeFrom": "2026-07-31T00:00:00Z",
      "activeUntil": "2026-08-10T23:59:59Z",
      "priority": 1,
      "isActive": true,
      "createdAt": "2026-07-30T12:00:00Z",
      "updatedAt": "2026-07-30T14:30:00Z"
    }
  ]
}
```

### 3.3 `POST /api/popups` (Admin)

**Purpose:** Create a new popup.

**Authentication:** Requires `X-Admin-Key` header.

**Request body:**

```json
{
  "title": "No Available Designs on the Website",
  "body": "THERE ARE CURRENTLY NO AVAILABLE DESIGNS ON OUR WEBSITE.\n\nFrom 10th August, our website will once again be filled with available designs.\n\nWe look forward to welcoming you back. See you soon!",
  "imageUrl": "https://cdn.vedilclothing.com/popups/we-are-back.png",
  "imageAlt": "WE WILL BE BACK 10TH OF AUGUST",
  "ctaText": "Got It",
  "ctaLnk": null,
  "newTag": "NEW",
  "date": "Jul 31, 2026",
  "activeFrom": "2026-07-31T00:00:00Z",
  "activeUntil": "2026-08-10T23:59:59Z",
  "priority": 1,
  "isActive": true
}
```

### 3.4 `PATCH /api/popups/:id` (Admin)

**Purpose:** Update an existing popup. All fields optional.

**Authentication:** Requires `X-Admin-Key` header.

### 3.5 `DELETE /api/popups/:id` (Admin)

**Purpose:** Delete a popup.

**Authentication:** Requires `X-Admin-Key` header.

---

## 4. Dismissal Tracking (Frontend)

The frontend tracks dismissal client-side using `localStorage`:

- **Key pattern:** `popup-dismissed-{popupId}`
- **Value:** `"true"`
- **When dismissed:** User clicks "X" or "Got It" → write to localStorage → close modal
- **On page load:** Component reads localStorage for all dismissed IDs → passes them as `dismissedIds` query param to `GET /api/popups/active`
- **When a new popup is created:** Frontend won't have its ID in localStorage, so it will show

This means the backend does NOT need to track per-user dismissals. It's entirely client-side.

---

## 5. Server-Side Selection Logic (`GET /api/popups/active`)

The backend should implement the following logic:

```
1. Query popups WHERE isActive = true
   AND activeFrom <= CURRENT_TIMESTAMP
   AND activeUntil >= CURRENT_TIMESTAMP
   AND id NOT IN (dismissedIds FROM query param)

2. If no results → return { popup: null }

3. Sort by priority ASC, then activeFrom DESC

4. Return the first one → { popup: { ... } }
```

---

## 6. Image Upload

The backend should provide an image upload endpoint for the admin dashboard to upload popup images:

### `POST /api/popups/upload` (Admin)

**Purpose:** Upload a popup image and return the URL.

**Authentication:** Requires `X-Admin-Key` header.

**Request:** `multipart/form-data` with a `file` field.

**Response `201 Created`:**

```json
{
  "url": "https://cdn.vedilclothing.com/popups/uploaded-file.png"
}
```

---

## 7. Frontend Integration Plan

### Phase 1: Static (✅ Done)

- Hardcoded popup content in `AnnouncementModal.tsx`
- localStorage dismissal tracking
- Image served from `public/announcements/`

### Phase 2: Dynamic (Backend-Dependent)

- Replace hardcoded content with `useActivePopup()` query
- Component reads `ApiPopup` from the API response and renders dynamically
- `AnnouncementModal` updates to accept popup data as props or via the query hook
- Remove `defaultAnnouncementContent` fallback
- Image served from the backend URL

### Types to add to `src/types/api.ts`

```typescript
// ─── Popups (Announcements) ──────────────────────────────

export interface ApiPopup {
  id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  imageAlt: string | null;
  ctaText: string | null;
  ctaLnk: string | null;
  newTag: string | null;
  date: string | null;
  activeFrom: string;
  activeUntil: string;
  priority: number;
  isActive?: boolean;       // Admin-only
  createdAt?: string;       // Admin-only
  updatedAt?: string;       // Admin-only
}

export interface ActivePopupResponse {
  popup: ApiPopup | null;
}

export interface PopupListResponse {
  popups: ApiPopup[];
}
```

---

## 8. Admin Dashboard Integration

The admin dashboard will need:

1. A **Popup Manager** page/panel listing all popups with their status (active/inactive, expired, upcoming)
2. A **Create/Edit Popup** form with fields matching the API request body
3. An **image uploader** for the popup graphic
4. A **priority reorder** UI (drag-and-drop or numeric input)
5. A **preview** button to see the popup as it would appear on the frontend

---

## 9. Future Considerations

- **Popups with links:** Currently CTA is optional. Future: allow link-based popups that navigate to a page (e.g., "Shop Now → /shop").
- **Multiple popups in sequence:** Show one popup, then another after dismissal (queue). This requires the backend to return the *next* active popup when the current one is dismissed.
- **Frequency capping:** Show a popup only once per N days instead of permanently dismissed.
- **A/B testing:** Serve different popups to different user segments.
- **Rich text body:** Support HTML/markdown in the body field for richer formatting.
