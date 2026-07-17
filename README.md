# Vedil Clothing

Customer-facing storefront for Vedil Clothing and the It’s Fun to Sew Academy.
The frontend is a Next.js 16 application that talks directly to the NestJS
backend for catalog, enquiries, cart, checkout, and course verification.

## Current launch state

The integration code is largely in place, but the release is **not yet
go-live ready**. The active source of truth is the
[launch-readiness checklist](docs/launch-readiness.html). It records the
remaining work, launch gates, risks, owners/evidence fields, and the exact
end-to-end flows that still need a production-like test.

Use the documents below for their specific purpose:

- [Launch readiness](docs/launch-readiness.html) — current go/no-go checklist
  and system snapshot; update this as work is verified.
- [Integration history](docs/grill-session-summary.html) — the original July
  integration plan; retained for decisions and history, not release status.
- [API contract](docs/api-contract.md) — agreed frontend/backend shapes.
- [Backend discrepancies](docs/api-discrepancies.md) — backend/content changes
  still required.
- [Implementation plan](thoughts/plans/2026-07-12-fe-be-integration.md) —
  detailed implementation record.

## Local development

```bash
pnpm dev
```

The frontend runs at `http://localhost:3000`. Set `NEXT_PUBLIC_API_URL` in
`.env.local` to the NestJS backend; it falls back to `http://localhost:4000`.

Useful checks:

```bash
pnpm lint
pnpm build
pnpm test
```

At the last audit (2026-07-14), lint did not pass and no backend was running
locally, so a passing local command alone is not launch evidence. See the
launch checklist for the required verification evidence.
