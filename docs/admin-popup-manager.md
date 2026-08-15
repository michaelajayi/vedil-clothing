# Admin Dashboard: Announcement Popup Manager

> **Status:** Draft — for frontend admin dashboard alignment
> **Backend spec source:** `docs/backend-needs.md`
> **Backend implementation:** Fully built at `vedil-clothing-backend`
> **Backend base:** `http://localhost:4001`
> **Admin API key header:** `X-Admin-Key`
> **Admin API key value:** `grotesque`

---

## 1. Overview

The **Announcement Popup Manager** is an admin dashboard interface for creating, scheduling, and managing site-wide announcement popups. It lives under a new admin route and gives the business owner full control over what visitors see on their first page load.

### Admin Dashboard Routes (Proposed)

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | Dashboard Home | Overview / stats landing |
| `/admin/popups` | Popup List | Table of all popups with status badges |
| `/admin/popups/new` | Create Popup | Form to create a new popup |
| `/admin/popups/:id/edit` | Edit Popup | Form to edit an existing popup |
| `/admin/popups/:id/preview` | Preview Popup | Simulate how the popup looks to a visitor |

---

## 2. Admin API Endpoints (Reference)

All admin endpoints require the `X-Admin-Key` header.

### `GET /api/popups`
List all popups. No pagination needed (low cardinality).

```json
[
  {
    "id": "uuid-string",
    "title": "No Available Designs on the Website",
    "body": "THERE ARE CURRENTLY NO AVAILABLE DESIGNS ON OUR WEBSITE.\n\nFrom 10th August, our website will once again be filled with available designs.\n\nWe look forward to welcoming you back. See you soon!",
    "imageUrl": "https://cdn.vedilclothing.com/popups/we-are-back.png",
    "imageAlt": "WE WILL BE BACK 10TH OF AUGUST",
    "ctaText": "Got It",
    "ctaLnk": null,
    "newTag": "NEW",
    "date": "Jul 31, 2026",
    "activeFrom": "2026-07-31T00:00:00.000Z",
    "activeUntil": "2026-08-10T23:59:59.000Z",
    "priority": 1,
    "isActive": true,
    "createdAt": "2026-07-30T12:00:00.000Z",
    "updatedAt": "2026-07-30T14:30:00.000Z"
  }
]
```

### `POST /api/popups`
Create a new popup.

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

**Validation rules (enforced by backend):**

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `title` | ✅ | string | |
| `body` | ✅ | string | |
| `imageUrl` | ❌ | URL | Must be a valid URL if provided |
| `imageAlt` | ❌ | string | |
| `ctaText` | ❌ | string | |
| `ctaLnk` | ❌ | URL | Must be a valid URL if provided |
| `newTag` | ❌ | string | |
| `date` | ❌ | string | |
| `activeFrom` | ✅ | ISO 8601 | |
| `activeUntil` | ✅ | ISO 8601 | Must be after `activeFrom` |
| `priority` | ✅ | integer | Lower number = higher priority |
| `isActive` | ✅ | boolean | |

### `PATCH /api/popups/:id`
Update an existing popup. All fields optional. Only send the fields being changed.

### `DELETE /api/popups/:id`
Delete a popup. Returns `{ "ok": true, "deletedId": "uuid" }`.

### `POST /api/popups/upload`
Upload a popup image.

**Request:** `multipart/form-data` with a `file` field (max 10 MB, accepted: jpg, png, gif, webp, svg).

**Response:**

```json
{
  "url": "https://res.cloudinary.com/.../vedil/popups/..."
}
```

---

## 3. Frontend Types (`src/types/api.ts`)

Append these to the existing `src/types/api.ts`:

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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePopupPayload {
  title: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
  ctaText?: string;
  ctaLnk?: string;
  newTag?: string;
  date?: string;
  activeFrom: string;
  activeUntil: string;
  priority: number;
  isActive: boolean;
}

export interface UpdatePopupPayload {
  title?: string;
  body?: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  ctaText?: string | null;
  ctaLnk?: string | null;
  newTag?: string | null;
  date?: string | null;
  activeFrom?: string;
  activeUntil?: string;
  priority?: number;
  isActive?: boolean;
}

export interface UploadPopupImageResponse {
  url: string;
}
```

---

## 4. TanStack Query Hooks (`src/lib/queries/popups.ts`)

Create a new query module following the `src/lib/queries/` pattern (if one exists) or at `src/lib/queries/popups.ts`.

### 4.1 Admin Key

The admin dashboard will need the admin key available. This can come from:
- **Option A (Recommended):** An environment variable `NEXT_PUBLIC_ADMIN_API_KEY` that Next.js exposes to the client. Add to `.env.local`.
- **Option B:** A login flow that stores the key in memory/session. Overkill for now — the admin portal is a single-owner tool.

The admin key should be imported/accessed consistently. For the API client, pass it as `adminKey` in the options:

```typescript
import { api } from "@/lib/api";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY!;
```

### 4.2 Query Hooks

```typescript
// src/lib/queries/popups.ts

import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiPopup, CreatePopupPayload, UpdatePopupPayload, UploadPopupImageResponse } from "@/types/api";

// ─── Keys ──────────────────────────────────────────────

export const popupKeys = {
  all: ["popups"] as const,
  list: () => [...popupKeys.all, "list"] as const,
};

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY!;

// ─── List ──────────────────────────────────────────────

export const popupListOptions = () =>
  queryOptions({
    queryKey: popupKeys.list(),
    queryFn: () =>
      api.get<ApiPopup[]>("/api/popups", { adminKey: ADMIN_KEY }),
  });

export function usePopupList() {
  return useQuery(popupListOptions());
}

// ─── Create ────────────────────────────────────────────

export function useCreatePopup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePopupPayload) =>
      api.post<ApiPopup>("/api/popups", payload, { adminKey: ADMIN_KEY }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: popupKeys.list() });
    },
  });
}

// ─── Update ────────────────────────────────────────────

export function useUpdatePopup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdatePopupPayload & { id: string }) =>
      api.patch<ApiPopup>(`/api/popups/${id}`, payload, { adminKey: ADMIN_KEY }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: popupKeys.list() });
    },
  });
}

// ─── Delete ────────────────────────────────────────────

export function useDeletePopup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete<{ ok: boolean; deletedId: string }>(`/api/popups/${id}`, {
        adminKey: ADMIN_KEY,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: popupKeys.list() });
    },
  });
}

// ─── Image Upload ──────────────────────────────────────

export function useUploadPopupImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.upload<UploadPopupImageResponse>("/api/popups/upload", formData, {
        adminKey: ADMIN_KEY,
      });
    },
  });
}
```

---

## 5. UI Component Tree

```
app/admin/layout.tsx            ← Admin shell (header, sidebar, auth guard)
app/admin/popups/page.tsx       ← Popup List page
app/admin/popups/new/page.tsx   ← Create Popup page
app/admin/popups/[id]/edit/page.tsx  ← Edit Popup page
```

### 5.1 Admin Layout (`app/admin/layout.tsx`)

- Simple centered layout with a header bar showing "Vedil Admin"
- Navigation links: Dashboard, Popups, Products, etc. (as other sections are built)
- Wraps content in a `<ToastProvider>` so all admin pages can use `useToast()`
- Reads `NEXT_PUBLIC_ADMIN_API_KEY` and shows an error banner if it's missing

### 5.2 Popup List Page (`app/admin/popups/page.tsx`)

**Purpose:** Table of all popups with status at a glance.

**Data:** `usePopupList()`

**Columns:**

| Column | Render | Notes |
|--------|--------|-------|
| Status | Colored dot + label | Green "Active" / Gray "Inactive" / Blue "Scheduled" (future date) / Orange "Expired" (past activeUntil) |
| Title | Text | Clickable → Edit page |
| Priority | Number badge | Lower = higher priority |
| Schedule | `activeFrom` – `activeUntil` | Formatted dates |
| New Tag | Badge or `—` | e.g. "NEW", "SALE" |
| CTA | Button label or `—` | |
| Actions | Edit + Delete buttons | |

**Computed status logic (no separate backend field — derive from data):**

| Condition | Status |
|-----------|--------|
| `isActive === false` | `"inactive"` |
| `isActive === true && now > activeUntil` | `"expired"` |
| `isActive === true && now < activeFrom` | `"scheduled"` |
| `isActive === true && activeFrom <= now <= activeUntil` | `"active"` |

**Features:**
- "Create Popup" button → navigates to `/admin/popups/new`
- Delete shows a confirmation dialog (use Radix `Dialog` with "Are you sure?" + confirm/cancel)
- After delete, TanStack Query auto-refreshes the list
- Search/filter by title (client-side filter) — optional but nice

### 5.3 Create/Edit Popup Page (`app/admin/popups/new/page.tsx` and `app/admin/popups/[id]/edit/page.tsx`)

**Purpose:** Form to create or edit a popup.

**Data (Edit):** Fetches the popup by ID from the list cache. Since there's no single-popup GET endpoint, read from the list cache or re-fetch the list. For the edit page, you can either:
- Add a `GET /api/popups/:id` endpoint (backend doesn't have it yet — would need to be added)
- Or simply filter the list data client-side (simpler, works fine for low-cardinality data)

**Form fields:**

```
┌─────────────────────────────────────────────────────────────┐
│  Announcement Popup                                          │
│                                                             │
│  Title *                                       [___________] │
│                                                             │
│  Body *                                        [___________] │
│                                                (textarea)    │
│                                                             │
│  Image                                        [Upload…]     │
│  (preview thumbnail when imageUrl is set)                   │
│                                                             │
│  Image Alt Text                               [___________] │
│                                                             │
│  CTA Button Label                             [___________] │
│  CTA Link URL                                 [___________] │
│                                                             │
│  New Tag Label                                [___________] │
│  Date Label                                   [___________] │
│                                                             │
│  Active From *                                [date picker] │
│  Active Until *                               [date picker] │
│                                                             │
│  Priority *              [1     ▲]                          │
│                          [      ▼]                          │
│                                                             │
│  Active                  [✓]                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  [Cancel]                    [Save / Create]        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  * = required                                               │
└─────────────────────────────────────────────────────────────┘
```

**Image upload flow:**

1. User clicks "Upload" button or drags an image onto the upload zone
2. Show a loading spinner while the upload request is in flight
3. On success, the returned `url` is populated into the `imageUrl` field
4. Show a thumbnail preview of the uploaded image
5. On error, show a toast with the error message

**Form implementation notes:**
- Use `react-hook-form` with `@hookform/resolvers` (already in dependencies) for form validation
- Radix `Select` for priority (or a numeric input with increment/decrement)
- Date picker: use native `<input type="datetime-local">` for simplicity, or a lightweight date picker library
- Body field: a simple `<textarea>`. The backend accepts plain text with `\n\n` paragraph separators. No rich text editor needed for v1.
- The form should warn if `activeUntil` is before `activeFrom`
- On save success, navigate back to the popup list and show a success toast

### 5.4 Preview Popup

**Purpose:** See how the popup will look to visitors before publishing.

**Implementation:** Either as a separate page or as a "Preview" button on the edit form that opens the `AnnouncementModal` with the draft data.

**Option A (Recommended):** Add a "Preview" button on the Create/Edit form that opens a modal rendering the same markup as `AnnouncementModal`, using the form's current values. This gives instant feedback without navigation.

**Option B:** A standalone `/admin/popups/:id/preview` page that renders the popup over a blurred site mockup.

---

## 6. State & Navigation

### 6.1 State Shape

No global state needed beyond TanStack Query cache. The `usePopupList()` hook is the single source of truth. Mutations invalidate the list on success.

### 6.2 Navigation After Save

- **Create:** On success → `router.push("/admin/popups")` + show success toast
- **Edit:** On success → `router.push("/admin/popups")` + show success toast
- **Delete:** On success → list auto-refreshes via cache invalidation + show success toast
- **Cancel:** `router.back()` or `router.push("/admin/popups")`

### 6.3 Loading & Error States

| State | UI |
|-------|-----|
| Loading list | Skeleton rows or a spinner |
| Empty list | Empty state illustration: "No popups yet. Create your first one!" + CTA button |
| Form submitting | Submit button shows spinner, all fields disabled |
| Uploading image | Upload zone shows progress indicator |
| API error | Toast with error message + inline error state on the affected component |

---

## 7. Edge Cases & Validation

### 7.1 Form Validation (Frontend)

| Field | Rule | UX |
|-------|------|----|
| `title` | Required, max 200 chars | Show "Title is required" |
| `body` | Required, max 5000 chars | Show "Body is required" |
| `activeFrom` | Required, valid ISO datetime | Show "Active from is required" |
| `activeUntil` | Required, must be after `activeFrom` | Show "Active until must be after active from" |
| `priority` | Required, integer >= 0 | Show "Priority must be 0 or greater" |
| `imageUrl` | Valid URL if provided | Validate URL format |
| `ctaLnk` | Valid URL if provided | Validate URL format |

### 7.2 Schedule Validation

- If `activeUntil < now` on creation, show warning: "This popup is already expired. Set a future date."
- If `activeFrom < now` and `isActive === true`, the popup will show immediately — show subtle hint: "This popup will be visible immediately."
- If `activeFrom > now` and `isActive === true`, show: "Scheduled — this popup will activate on [date]."

### 7.3 Priority Conflicts

When saving with a priority that matches an existing active popup, the backend handles tie-breaking (newest `activeFrom` wins). The UI should not block this, but the list page's sort order makes priorities visible.

### 7.4 Concurrent Edits

Not a concern for v1 (single admin user). No optimistic locking needed.

---

## 8. Component Checklist

| Component | File | Description |
|-----------|------|-------------|
| `AdminLayout` | `src/app/admin/layout.tsx` | Admin shell with header, ToastProvider, key check |
| `PopupListPage` | `src/app/admin/popups/page.tsx` | Table/list of popups with status badges |
| `PopupRow` | inline or separate | Single row in the popup list |
| `StatusBadge` | `src/components/admin/StatusBadge.tsx` | Reusable status badge (active/inactive/scheduled/expired) |
| `CreatePopupPage` | `src/app/admin/popups/new/page.tsx` | Create form |
| `EditPopupPage` | `src/app/admin/popups/[id]/edit/page.tsx` | Edit form (prefilled) |
| `PopupForm` | `src/components/admin/PopupForm.tsx` | Shared form component used by both create and edit |
| `ImageUploader` | `src/components/admin/ImageUploader.tsx` | Image upload zone with preview (can extend FileUpload.tsx) |
| `DeleteConfirmDialog` | `src/components/admin/DeleteConfirmDialog.tsx` | Confirmation dialog for delete |
| `PreviewModal` | `src/components/admin/PreviewModal.tsx` | Preview of the popup using AnnouncementModal's layout |
| `EmptyState` | `src/components/admin/EmptyState.tsx` | Reusable empty state component |

---

## 9. Directory Structure Summary

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx                   ← Admin shell layout
│   │   └── popups/
│   │       ├── page.tsx                 ← List page
│   │       ├── new/
│   │       │   └── page.tsx             ← Create page
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx         ← Edit page
│   └── ... (existing routes)
├── components/
│   ├── admin/                           ← NEW: admin components
│   │   ├── StatusBadge.tsx
│   │   ├── PopupForm.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── DeleteConfirmDialog.tsx
│   │   ├── PreviewModal.tsx
│   │   └── EmptyState.tsx
│   └── ... (existing components)
├── lib/
│   ├── queries/
│   │   └── popups.ts                    ← NEW: TanStack Query hooks
│   └── api.ts                           ← existing
├── types/
│   └── api.ts                           ← append Popup types (see §3)
└── styles/
    ├── admin.module.css                 ← NEW: shared admin styles
    └── ... (existing styles)
```

---

## 10. Implementation Order

### Phase 1: Foundation
1. Add Popup types to `src/types/api.ts`
2. Create `src/lib/queries/popups.ts` with TanStack Query hooks
3. Create `src/app/admin/layout.tsx` with basic shell and auth key check
4. Create `src/app/admin/popups/page.tsx` — list all popups with `usePopupList()`

### Phase 2: CRUD
5. Create `StatusBadge`, `DeleteConfirmDialog`, `EmptyState` components
6. Create `PopupForm` component with all fields and validation
7. Create `src/app/admin/popups/new/page.tsx` — Create page
8. Create `src/app/admin/popups/[id]/edit/page.tsx` — Edit page
9. Wire up `useCreatePopup()`, `useUpdatePopup()`, `useDeletePopup()` mutations

### Phase 3: Image Upload & Preview
10. Create `ImageUploader` component with `useUploadPopupImage()` mutation
11. Add image upload to `PopupForm`
12. Create `PreviewModal` component
13. Add "Preview" button to `PopupForm` that opens the modal

---

## 11. Testing the Admin Dashboard

Once built, the admin dashboard can be tested against the running backend at `http://localhost:4001`.

```bash
# Add this to .env.local
NEXT_PUBLIC_API_URL=http://localhost:4001
NEXT_PUBLIC_ADMIN_API_KEY=grotesque
```

```bash
# Start the dev servers
# Terminal 1: Backend
cd vedil-clothing-backend
DATABASE_URL="postgresql://postgres:changeme@localhost:5433/vedil_clothing_db" \
  ADMIN_API_KEY="grotesque" \
  pnpm run start:dev

# Terminal 2: Frontend
cd vedil-clothing-frontend
pnpm dev
```

Visit `http://localhost:3000/admin/popups` to access the admin dashboard.

---

## 12. Future Enhancements (Post-v1)

- **Priority reorder UI:** Drag-and-drop list to reorder popup priorities
- **Rich text body editor:** Replace textarea with a lightweight WYSIWYG for the body field
- **Bulk operations:** Activate/deactivate multiple popups at once
- **Activity log:** Track who created/modified popups and when
- **Scheduled publishing:** Show a calendar view of upcoming/scheduled popups
- **A/B testing:** Configure multiple popups for the same slot with percentage splits