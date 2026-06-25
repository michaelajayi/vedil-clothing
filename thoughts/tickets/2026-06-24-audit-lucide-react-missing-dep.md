---
type: audit
workflow: R
date: 2026-06-24
source: observed during implementation of 2026-06-24-shop-section-fix-links-and-taxonomy.md
---

## Concern
`npm run build` fails with `Cannot find module 'lucide-react'` — the package is imported by `src/components/ui/Icon.tsx` but is not listed in `package.json` or installed in `node_modules`.

## Likely Components
- `src/components/ui/Icon.tsx:1` — imports `LucideIcon` and `LucideProps` from `lucide-react`

## Workflow
→ R: start with /research to confirm scope before any fix (check which components import from Icon.tsx, whether lucide-react should be added or the Icon wrapper removed)
