# Rework Backlog

Running list of work deliberately deferred out of scope during planning (or discovered mid-implementation). Append-only — newest at the top. Each entry records what was deferred, why, and the concrete follow-up so a future session can pick it up cold.

When an item is done, move it to **Resolved** at the bottom with the date and the commit/PR that closed it.

> Owned primarily by the **plan phase** (`/plan`) — it draws the scope line, so it logs what falls outside it. Research and implement may append too when they surface adjacent work they don't touch.

**Entry format**
```
## [YYYY-MM-DD] Short title
- **Source:** plan/research/implement artifact path
- **Deferred because:** one line
- **Follow-up:** exact files / classes / lines to change
- **Blocked on:** (optional) what must land first
```

---

## [2026-06-24] Remove dead shop-section CSS after taxonomy rewrite
- **Source:** `thoughts/plans/2026-06-24-shop-section-fix-links-and-taxonomy.md`
- **Deferred because:** the taxonomy rewrite stops *using* these rules but deleting them in the same change widens the diff and risks an unrelated visual regression; cleaner as its own verifiable pass.
- **Follow-up:** once `ShopSection.tsx` ships with `.cat-card.heritage/.rtw/.acc` and no `.cat-sub`, the following become dead and should be removed from `src/app/globals.css`:
  - `.cat-card.men` / `.cat-card.women` / `.cat-card.kids` gradient rules (`:324–326`)
  - `.cat-sub` (`:333–334`) and the entire `.sub-card` block including `.sub-card.acc` / `.sub-card.new` (`:336–349`)
  - the `.cat-sub { grid-template-columns: 1fr; }` mobile rule (`:944`)
  - Confirm via grep that no other component references `.cat-sub` / `.sub-card` / `.cat-card.men|women|kids` before deleting.
- **Blocked on:** the shop-section rewrite plan landing first.

---

## Resolved

_(none yet)_
