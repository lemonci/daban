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
| Order of work | Write the two project skills first, then the pilot |
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
| Drafting specs (one per pattern) | `daban/porting/specs/<name>.md` |
| CN↔EN glossary | `daban/porting/glossary.md` |
| Project skills | `pattern_making/.claude/skills/{pattern-book-extraction,freesewing-design-dev}/` |
| Toolchain | conda env `daban` (python 3.11, tesseract+chi_sim, poppler, pymupdf, node 20) — already built |

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
3. Output a **drafting spec** at `porting/specs/<name>.md` containing:
   - Source: book, edition, pages
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

### Drafting spec → design data flow

```
book PDF ──rasterize──> page images ──vision+OCR──> porting/specs/<name>.md
    (spec reviewed; ambiguities resolved with user)
spec ──implement (Opus subagent, Fable reviews)──> designs/<name>/
    ──npm run reconfigure──> collection wiring
    ──tests + numeric oracle + studio render──> merge design/<name> → develop
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

The pilot exercises both skills end-to-end; lessons learned are folded back into the
skills before pattern #2.

## Phases

- **Phase 0 — Foundation:** re-add `upstream` remote; `npm run kickstart` in the
  monorepo; confirm `npm run studio` serves locally. Surfaces Windows/Node issues
  before any design work. (Node 20 is installed; `.nvmrc` says 18 but
  `package.json` engines requires ≥20 — if kickstart fails on version grounds,
  resolve then.)
- **Phase 1 — Skills:** write `pattern-book-extraction` and `freesewing-design-dev`
  from the verified repo/toolchain facts above.
- **Phase 2 — Pilot:** extract skirt-block spec → implement → verify (4 layers) →
  merge. Refine skills with lessons learned.
- **Phase 3 — Portfolio:** port remaining patterns one at a time through the same
  loop. Suggested order: bodice block + sleeve (they underpin most garments), then
  distinctive garments (旗袍 as flagship), then further picks from the triage
  catalog (built during this phase from the books that actually contain patterns).

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
