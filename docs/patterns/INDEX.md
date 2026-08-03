# Pattern ledger (INDEX)

Single source of truth for pattern coverage across `clothing_books`. Rules (from
the design spec `docs/superpowers/specs/2026-08-03-daban-pattern-porting-design.md`):

- Every book gets a row — including "no paper patterns — excluded" rows.
- Every pattern considered gets a row: source book file, printed pages, status,
  notes. Statuses: `excluded` / `candidate` / `specified` / `implemented` / `merged`.
- Exclusions record the violated pattern-making principle.
- No drafting spec (`docs/patterns/<name>.md`) without a matching row; the spec's
  source header must match its row.
- Duplicates across books: one primary source; others cross-referenced in notes.

**Coverage status:** pilot phase — only the pilot book is triaged so far. The
full every-book triage (~85 files) is Phase 3 of the implementation plan.

## Patterns

| Design | Garment | Source book | Printed pages | Status | Notes |
|---|---|---|---|---|---|
| qun | Standard skirt block (标准裙原型) | 英国经典服装纸样设计基础篇.pdf | 140–150 | merged | Pilot. Spec: `qun.md`. Straight variant (直裙原型, p.152) included as `silhouette` option, not a separate design. Verified 4 layers 2026-08-03 |
| — | Bodice block (衣片原型) | 英国经典服装纸样设计基础篇.pdf | 13–35 | candidate | Primary block; next after pilot per plan Phase 3 |
| — | Straight sleeve block (直袖) | 英国经典服装纸样设计基础篇.pdf | 92–100 | candidate | Pairs with bodice block |
| — | Supplementary skirt block (附加裙原型) | 英国经典服装纸样设计基础篇.pdf | 151 | candidate | Assess vs qun once implemented; likely cross-ref |
| — | Full-circle skirt block (全圆型裙原型) | 英国经典服装纸样设计基础篇.pdf | 153–154 | candidate | Distinct construction (radial) |
| — | Dress block (连衣裙服装的基本型) | 英国经典服装纸样设计基础篇.pdf | 157+ | candidate | Depends on bodice + skirt blocks |

## Books

| Book file | Has paper patterns? | Status | Notes |
|---|---|---|---|
| 英国经典服装纸样设计基础篇.pdf | Yes — systematic block drafting (Natalie Bray, 中国纺织出版社) | in progress | Pilot source. TOC at PDF pp.15–17; printed = PDF − 18. Ch: 测量/衣片原型/纸样设计/育克/省道转移/袖子/衣领/裙子(140)/连衣裙(157) |
| 衣身平衡与胸省变化的关系.pdf | No — theory paper | excluded (as pattern source) | Used as principles source (balance/darts) — see pattern-making-principles skill |
| 袖窿深_袖山高与袖子张角之间关系的初步探讨.pdf | No — theory paper | excluded (as pattern source) | Principles source (sleeve/armhole) |
| 袖山_袖型_袖窿之间的关系探讨.pdf | No — theory paper | excluded (as pattern source) | Principles source (sleeve cap limits) |
| *(remaining ~80 files)* | — | pending triage | Phase 3 |
