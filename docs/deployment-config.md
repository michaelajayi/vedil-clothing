# Deployment Configuration

> **Last updated:** 2026-07-18
> **Context:** Production deployment setup for the Next.js frontend

---

## Environment Variables

### Required

| Variable | Description | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Deployed NestJS backend URL | `https://api.vedilclothing.com` |

The `.env.production` file at the project root contains the production template.
Set these as environment variables on your deployment platform (Vercel, Netlify, etc.).

### Optional / Local-only

| Variable | Description | Default |
| --- | --- | --- |
| (none currently) | | |

---

## Backend CORS Configuration

The NestJS backend must allow the frontend origin in its CORS configuration.

**Backend CORS origin setting** (in `backend/src/main.ts` or env):

```typescript
// Allows both local dev and production frontends
app.enableCors({
  origin: [
    'http://localhost:3000',           // Local dev
    'https://vedilclothing.com',       // Production
    'https://www.vedilclothing.com',   // Production (www)
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
});
```

---

## Paystack Configuration

The frontend does **not** use Paystack inline.js directly. All Paystack
transactions are initiated server-side by the NestJS backend. The frontend
only needs the backend to be configured with:

- Paystack Secret Key (server-side)
- Paystack Callback URL (points to the frontend)

The backend returns an `authorizationUrl` from Paystack that the frontend
redirects to directly.

---

## Key Frontend URLs

| Page | Path | Notes |
| --- | --- | --- |
| Shop | `/shop` | Landing page |
| Collections | `/shop/{category}` | Category grid with gender filter |
| Product Detail | `/shop/{category}/{productId}` | PDP |
| Academy | `/academy` | Course listing |
| Checkout Confirmation | `/checkout/confirmation` | Post-payment landing |
| Contact | `/contact` | Contact + factory inquiry forms |

---

## Deployment Checklist

- [ ] `NEXT_PUBLIC_API_URL` set to production backend URL
- [ ] Backend CORS allows the frontend origin
- [ ] Backend Paystack keys configured
- [ ] Backend email provider (OTP) configured
- [ ] Database migrations applied on backend
- [ ] `pnpm build` passes on the deployed frontend
- [ ] `pnpm lint` passes (or lint warnings are accepted)
- [ ] End-to-end smoke test:
  - [ ] Product listing loads
  - [ ] Gender filter works
  - [ ] "New In" section shows featured products
  - [ ] Product detail page loads
  - [ ] Course listing loads
  - [ ] Course enrollment OTP flow works
  - [ ] Contact form submits
  - [ ] Factory inquiry form submits
