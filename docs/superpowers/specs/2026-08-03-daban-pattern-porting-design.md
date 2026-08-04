# Daban: porting paper patterns from Chinese drafting books into a FreeSewing fork

**Date:** 2026-08-03
**Status:** Approved design, pending implementation plan
**Repo:** github.com/lemonci/daban (fork of FreeSewing v4.10.0, branch `develop`)

## Goal

Add 3–10 high-quality parametric sewing patterns to this FreeSewing fork, ported from
the drafting methods in the scanned Chinese pattern-making books at
`C:\Users\Lemonci\Documents\pattern_making\clothing_books`. End goal (later phase, out
of scope here): a fully self-hosted FreeSewing instance serving these designs. Near
term everything runs locally (studio / org site in dev mode).

FreeSewing patterns are parametric JavaScript design packages drafted from body
measurements — porting a pattern means translating a book's drafting method
(measurements, formulas, construction steps) into a design package, not reproducing
scanned images.

## Decisions made (2026-08-03)

| Question | Decision |
|---|---|
| End goal | Full self-hosted instance — but deployment is a separate, later spec |
| Hosting | No server yet; local development only for now |
| Pilot source | 英国经典服装纸样设计 (基础篇) — Aldrich-lineage systematic drafting |
| Language | English only; zh i18n deferred |
| Scale | 3–10 patterns, quality-first, lightweight pipeline |
| Order of work | Write the project skills first, then the pilot |
| Pattern paperwork | All agent-authored pattern markdown in one directory (`docs/patterns/`), every file traceable to book + pages |
| Quality gate | A `pattern-making-principles` skill distilled from the books, used to exclude improper patterns |
| Where designs live | **Approach A**: inside the fork's `designs/` tree, as collection members |
| Categorization | Flat `designs/` folder; hierarchy expressed via `about.json` metadata (tags), not subdirectories |

## Architecture

### Repository strategy

- `origin` = github.com/lemonci/daban (already set). Re-add
  `https://codeberg.org/freesewing/freesewing.git` as remote `upstream`; periodically
  `git merge upstream/develop` into `develop`. All daban changes are additive (new
  folders, new config lines), keeping merges low-conflict.
- One branch per design (`design/<name>`), merged into `develop` after review.
- The fork's `designs/` directory stays **flat** — the monorepo tooling (workspace glob
  `designs/*`, `scripts/software.mjs` discovery, scaffolder, reconfigure) assumes one
  level. No structural changes to upstream build scripts.

### Categorization: tag taxonomy

Every daban design's `about.json` carries at least one **audience** tag and one
**garment-type** tag, plus the standard `difficulty` (1–5) and `techniques` fields:

- Audience: `women`, `men`, `children` (multiple allowed for unisex designs)
- Garment type: `tops`, `skirts`, `trousers`, `dresses`, `jackets`, `coats`,
  `underwear`, `accessories`, `hats`

This mirrors the books' own organization (女装/男装/童装/配饰) in the form the site
machinery already understands. Optional, deferred to the site phase: customizing the
catalog UI to present these tags as a hierarchical browse tree.

### Where things live

| Artifact | Location |
|---|---|
| Ported designs | `daban/designs/<name>/` (normal collection members) |
| Pattern ledger (triage catalog) | `daban/docs/patterns/INDEX.md` |
| Drafting specs (one per pattern) | `daban/docs/patterns/<name>.md` |
| CN↔EN glossary | `daban/docs/patterns/glossary.md` |
| Project skills | `pattern_making/.claude/skills/{pattern-book-extraction,freesewing-design-dev,pattern-making-principles}/` |
| Toolchain | conda env `daban` (python 3.11, tesseract+chi_sim, poppler, pymupdf, node 20) — already built |

All agent-authored pattern markdown lives in this **single `docs/patterns/` directory** —
no scattered notes. Process documents (this spec, implementation plans) stay under
`docs/superpowers/` per the superpowers conventions.

### Traceability ledger: `docs/patterns/INDEX.md`

The ledger is the single source of truth for coverage. Rules:

- **Every book** in `clothing_books` gets a row — including "no paper patterns —
  excluded" rows — so nothing is silently omitted.
- **Every pattern** considered gets a row with: source book file, pages, status
  (`excluded` / `candidate` / `specified` / `implemented` / `merged`), and for
  exclusions the recorded reason (e.g. the violated pattern-making principle).
- **Every drafting spec** opens with a mandatory source header (book filename,
  edition, exact pages) matching its INDEX row — no spec without a ledger entry.
- **Duplicates across books** (several books draft the same garment) are resolved in
  the ledger: one primary source is chosen, the others cross-referenced on the same
  row — so the same pattern is never ported twice.

### Design naming

Lowercase `^[a-z][a-z0-9_]*$` (enforced by the scaffolder). Convention for daban
designs: romanized Chinese given names, chosen per design at implementation time.
`about.json` records credit: `design` = the book/method author, `code` = implementer.

## Components

### Skill 1: `pattern-book-extraction`

Input: a book PDF + chapter/page range. Process:

1. Rasterize pages with PyMuPDF — adaptive DPI capped at ~60 MP,
   `Image.MAX_IMAGE_PIXELS = None` (some pages are 51×73 in; 300 DPI everywhere would
   exceed Pillow's bomb guard).
2. Claude reads the drafting diagrams visually (primary source of truth); OCR
   (`chi_sim`, spaces between adjacent CJK codepoints stripped) provides supporting
   text.
3. Output a **drafting spec** at `docs/patterns/<name>.md` and update its INDEX.md
   row. The spec contains:
   - Mandatory source header: book filename, edition, exact pages (must match INDEX)
   - Measurements required, each mapped to a FreeSewing measurement name
     (e.g. 腰围→waist, 臀围→seat); unmappable inputs become design options
   - Drafting steps as explicit formulas (point positions as functions of
     measurements/options)
   - The book's worked-example numbers at its standard size (the test oracle)
   - Construction/sewing notes, and a list of ambiguities flagged for the user

### Skill 2: `freesewing-design-dev`

Encodes the verified monorepo workflow: scaffold via root `npm run add` (templates:
base/bella/bent/…); `about.json` fields (`collection: true` is the master switch;
`hide`, credits, tags); part anatomy (`{name, options, measurements, draft}`), draft
context (`Point/Path/Snippet/store/macro/sa/units`…), part linking via `from`/`after`
and `store`; config touchpoints (`dependencies.yaml`, `keywords.yaml`,
`exceptions.yaml`, `changelog.yaml`); `npm run reconfigure` discipline (package.json/
README/CHANGELOG/tests are generated — never hand-edit); option types (`pct`/`deg`/
`bool`/`count`/`list` — raw `mm` options are rejected by the shared config test);
i18n `en.json` shape (`t/d/p/s/o`); the manual LineDrawing SVG component +
registration in `packages/react/components/LineDrawing/`; shared test suites; the
`npm run studio` verification loop.

### Skill 3: `pattern-making-principles`

A distilled domain-knowledge skill: the principles of pattern construction abstracted
from the books' own text — ease allowances, armhole ↔ sleeve-cap relationships
(袖窿/袖山), bodice balance (衣身平衡) and dart mechanics, proportion systems, fit
constraints — each principle cited back to book + pages.

**Provenance pipeline (per project CLAUDE.md):** Sonnet subagents read and extract the
relevant text — notably including the theory-only books and academic papers that
contain no paper patterns (they are prime sources here, not skipped material); Fable
abstracts and synthesizes the principles, with Opus subagents assisting where volume
demands; Fable reviews the final skill content.

**Used as a quality gate at three points:**
1. **Triage** — a candidate pattern that violates sound construction or is clearly
   impractical is `excluded` in INDEX.md with the violated principle as the reason,
   so it never reaches the website.
2. **Spec review** — extracted formulas are sanity-checked against the principles
   before implementation.
3. **Drafted-output review** — the rendered pattern is checked for principle
   violations (e.g. impossible sleeve-cap/armhole ratios) alongside the numeric
   oracle.

### Drafting spec → design data flow

```
books ──Sonnet reads──> INDEX.md triage rows
    (principles gate: improper patterns excluded with recorded reason)
book PDF ──rasterize──> page images ──vision+OCR──> docs/patterns/<name>.md
    (spec reviewed against principles; ambiguities resolved with user)
spec ──implement (Opus subagent, Fable reviews)──> designs/<name>/
    ──npm run reconfigure──> collection wiring
    ──tests + numeric oracle + principles check + studio render──>
    merge design/<name> → develop; INDEX.md row → merged
```

### Roles (per project CLAUDE.md)

Fable analyzes, designs, and reviews all code; Opus subagents implement design code;
Sonnet subagents fetch data (page renders, repo lookups).

## Pilot: straight skirt block from 英国经典服装纸样设计 (基础篇)

The classic Aldrich starting point: fewest measurements, cleanest formulas. Scope: the
skirt block as a from-scratch design (scaffolded from the `base` template), drafted
front + back with waist darts, seam allowance support, standard paperless/detail
features can be minimal in v1.

**Success criteria (all four must pass):**

1. Shared design test suites pass (`config`, `i18n`, `drafting`, `sampling`).
2. **Numeric oracle:** a Node script drafts at the book's standard measurements and
   asserts key pattern dimensions equal the book's worked arithmetic within ±2 mm.
3. Visual: studio render compared against the book's diagram (screenshot review).
4. Code review by Fable before merging to `develop`.

The pilot exercises all three skills end-to-end (extraction, design-dev, and the
principles gate); lessons learned are folded back into the skills before pattern #2.

## Phases

- **Phase 0 — Foundation:** re-add `upstream` remote; `npm run kickstart` in the
  monorepo; confirm `npm run studio` serves locally. Surfaces Windows/Node issues
  before any design work. (Node 20 is installed; `.nvmrc` says 18 but
  `package.json` engines requires ≥20 — if kickstart fails on version grounds,
  resolve then.)
- **Phase 1 — Skills:** write `pattern-book-extraction` and `freesewing-design-dev`
  from the verified repo/toolchain facts above; seed `pattern-making-principles`
  from the theory-heavy sources (the academic papers and the foundational chapters
  of the systematic books), Sonnet reading → Fable/Opus abstracting.
- **Phase 2 — Pilot:** extract skirt-block spec → implement → verify (4 layers) →
  merge. Refine skills with lessons learned.
- **Phase 3 — Portfolio:** complete the INDEX.md ledger across all books (every book
  gets a row, pattern-less ones marked excluded), then port remaining patterns one
  at a time through the same loop. ~~Suggested order: bodice block + sleeve (they
  underpin most garments), then distinctive garments (旗袍 as flagship), then
  further candidates from the ledger.~~ **Ordering superseded 2026-08-04 — see
  Phase 3 ordering below.** The principles skill keeps growing as more books are
  read.

### Phase 3 ordering: system-sequential reading (amended 2026-08-04, user direction)

Work one **drafting system** at a time and read its books **in chapter order**,
start to finish. This replaces the original portability-ranked order.

**Why.** Both defects this project has shipped trace to one cause: extracting a
drafting chapter without its predecessors.

- Bray Ch.2 §2's terse armhole restatement produced an armhole 5 cm short. Ch.2 §3
  p.29 carries the governing rule — a wider accepted band and three remedies in a
  stated preference order, including a warning against the one we had used.
- The 熊能 原型法 spec invented a measurement-driven residual to source its
  body-type correction amounts. Vol.1 Ch.7 (pp.124–139) re-derives those amounts
  empirically from toiles, which speaks directly to the premise the spec had to
  invent an answer for.

In both cases the governing chapter came **earlier in the book** than the chapter
we extracted. Cherry-picking by portability selects against exactly the chapters
that constrain the draft.

**The rule.** Read every chapter in sequence. Each yields exactly one of four
things, and the ledger records which:

1. a design;
2. an option or variant on an existing design;
3. `pattern-making-principles` content;
4. reference data — or nothing at all.

**"Nothing but a ledger note" is a legitimate outcome.** Forcing a design out of a
chapter that does not contain one (a "fullness treatment" design) is the failure
this rule exists to prevent. An unread chapter must be *visibly* unread in the
ledger, not merely absent from it.

**Scope.** The rule governs *systematic textbooks* — books with an argument
running through them. It does not govern *catalogues*: 唐装旗袍款式与制作 is 110
numbered garments drafted straight from B/W/H/N/S with no foundation block and no
through-line. A catalogue has no sequence to read. It is entered when its turn
arrives and cherry-picked internally.

**Back-checking.** Five designs were ported out of order before this rule existed.
Every newly-read chapter is checked against them, and that check is part of the
chapter's work — not a deferred pass.

**System order.**

1. **British.** Bray 基础篇 (in progress — 7 of 16 chapters never opened) → Bray
   提高篇 (builds explicitly on 基础篇 and shares its conventions, so it costs less
   than restarting elsewhere) → Aldrich *Metric Pattern Cutting*. Aldrich's blocks
   are **separate designs, never options on Bray's** — different formula family,
   the same rule the ledger already applies to 熊能's men's block.
2. **熊能 原型法.** Vol.1 (foundation) → Vol.2 (components) → Vols 3–4 (women's
   garments). The parked 原型法 correction spec is re-derived here, in order, not
   patched before then.
3. Remaining systems and catalogues, per the ledger.

**旗袍 waits** (user decision, 2026-08-04). It was named a near-term flagship in
the original plan; under strict sequence it is entered when its book's turn
arrives. No exception was taken for it.

Cross-system duplicates are a verification asset, not waste. Two independent
British fitted-bodice blocks check each other the way `sleeveblock`'s cap arc
checked `bodiceblock`'s armhole — the strongest evidence this project has found.

## Error handling

- **Illegible/ambiguous source:** the spec lists uncertainties explicitly; Fable asks
  the user rather than guessing (CLAUDE.md rule 5).
- **Measurement gaps:** prefer deriving from standard FreeSewing measurements;
  otherwise expose as a design option; every mapping documented in the spec.
- **Monorepo build breakage on Windows:** caught in Phase 0 before design work; any
  fix that would require diverging from upstream build scripts is surfaced to the
  user first.

## Out of scope (each gets its own spec later)

- Self-host deployment (backend + org site + domain + TLS)
- Chinese (zh) site/design i18n
- Catalog-UI hierarchical browse tweak
- Contributing designs upstream
