# Proportional block with measurement-driven body-type corrections

**Date:** 2026-08-03
**Status:** Drafted, deferred — implementation begins after the Bray bodice/sleeve family
**Repo:** github.com/lemonci/daban (fork of FreeSewing v4.10.0, branch `develop`)
**Parent spec:** `2026-08-03-daban-pattern-porting-design.md` (Phase 3, portfolio)

## Goal

Port the 原型法 (block-method) bodice from 熊能 Vol. 1 into a FreeSewing design that
drafts the book's proportional block **and then applies the book's Chapter 9 body-type
corrections automatically**, with the correction amounts computed from the wearer's own
measurements instead of estimated by eye.

## Why this needs its own spec

The block is drafted from **two measurements only** — 胸围 B and 背长. Shoulder width,
neck width, armhole depth, chest width are all fixed fractions of B. That is the
tradition working as designed, and it is also its documented weakness.

Two independent sources say so. 熊能 Vol. 1 itself (printed p.108) states the
proportional premise and immediately qualifies it: 特殊体型 are *not* proportional to
bust alone and need other reference methods — then spends all of Chapter 9 correcting
for exactly that. And 中国衣形结构's survey of drafting systems makes the sharper point:
what 原型法 advanced was *substituting a template for formulas*, 而不是指原型构成图中的
经验公式的更具合理性 — underneath, the block's own construction is still empirical
formulas.

FreeSewing is made-to-measure. It already holds the wearer's full measurement set. So
the deviation that a human tailor eyeballs — and that Chapter 9 leaves as "an adjustment
length determined by the specific wearer" — is a quantity we can simply compute. That
turns 原型法's known weakness into a solved case rather than an inherited one.

This is not a straight port, so it does not belong in the ordinary
extract → implement → verify loop without its own design decisions written down first.

## Source

| | |
|---|---|
| File | `世界经典服装设计与纸样基础原理篇(上).pdf` (Vol. 1 of 8) |
| Author / publisher | 熊能, 江西美术出版社; 序 by 张文斌 (东华大学服装学院), 2007-09 |
| Offset | **printed = pdf − 14** (main body; confirmed at 8 checkpoints, printed 61–171) |
| Block construction | 第六章第二节 女装原型制作, printed 108–120 (pdf 122–134) |
| Sleeve block | printed 111–113 (pdf 125–127) |
| Toile-derived dart amounts | 第七章 原型试样与"省"缝, printed 124–139 (pdf 138–153) |
| Body-type corrections | 第九章第一节, printed 168–180 (pdf 182–194); sleeve §2 printed 181–183 |
| INDEX.md row | 世界经典服装设计与纸样基础原理篇(上).pdf |

The book states its lineage outright (printed p.107): *本书中的服装原型就是在参照日本
文化服装原型的基础上作出的* — built with reference to the 日本文化服装原型 (Bunka
Fashion College block), naming 登丽美 (Dressmaker) as the other Japanese tradition and
explicitly not the one followed.

## The central idea: residual-driven corrections

The proportional formulas are a **prediction of the standard body from bust girth**. The
wearer's actual measurement is the truth. The difference is the deviation Chapter 9
consumes:

```
predicted = f(chest, hpsToWaistBack)     # the book's formula, or a drafted geometry
actual    = the wearer's measurement
residual  = actual − predicted
correction = the Chapter 9 slash/pivot procedure, parameterised by residual
```

Two consequences make this testable rather than merely plausible:

1. **Zero residual must be the identity.** At the book's standard 160/84A body, every
   residual is zero and the corrected draft must be byte-identical to the uncorrected
   one. This is a hard test, not a hope (see Verification).
2. **The book's own procedures are reused verbatim.** We are supplying the quantity
   Chapter 9 leaves open; we are not inventing new geometry. Any correction whose
   geometry cannot be transcribed from the page does not ship.

### Correction catalogue and detectors

| Book body type | Printed pp. | Residual that drives it | Confidence |
|---|---|---|---|
| 挺胸体 erect/protruding chest | 169–170 | `hpsToWaistFront` − drafted front waist length (positive) | **high** — the book names 前腰节长/后腰节长 as the driving quantities |
| 驼背体 stooped back | 171–172 | same pair, opposite sign | **high** — same mechanism in reverse per the book |
| 平肩体 square shoulders | 177–178 | `shoulderSlope` − drafted shoulder angle (negative) | ❌ **BROKEN — see the warning below** (was: high) |
| 溜肩体 sloping shoulders | 179–180 | same, positive | **high** |
| 瘦体 thin | 173–174 | girth residuals: `waist`, and bust prominence `chest − highBust` | **low — needs page extraction** |
| 胖体 heavy | 175–176 | same, opposite sign | **low — needs page extraction** |
| 袖山高不足 / 过高 insufficient / excessive cap height | 181–183 | drafted `AH/3 − 1` vs. the armhole the corrected bodice actually produces | **medium** — mechanism clear, amounts not transcribed |

Secondary residual, not one of the six named types but consumed by several of them:
`shoulderToShoulder` − drafted shoulder point separation. The 挺胸/驼背 corrections both
change back shoulder width as a side effect (*移动②缩小后肩宽*), so the shoulder-width
residual must be applied **after** the balance correction, not independently, or the two
will double-count.

The four "low/medium" rows are the reason Phase A exists. Triage read Chapter 9
structurally — it established that corrections are slash-and-pivot with cm callouts, and
that the amount is left to the wearer — but did not transcribe per-type geometry. No
correction ships on a summary.

## Measurement mapping

| Book term | CN | FreeSewing | Role | Note |
|---|---|---|---|---|
| Bust girth | 胸围 B | `chest` | primary driver | Net body bust. Worked example 84 cm. The block's `B/2+5` half-width bakes in 10 cm total ease — exposed as an option, so `chest` maps directly and no rescaling is needed |
| Back waist length | 背长 | `hpsToWaistBack` | vertical driver | ⚠ **Not identical.** 背长 is measured nape (后颈点) → waist; `hpsToWaistBack` is HPS → waist. The offset must be measured off the book's own body diagram (第四章第一节 人体测量, printed 45–58) and applied as a constant, or the whole draft sits wrong vertically |
| Front waist length | 前腰节长 | `hpsToWaistFront` | correction only | Unused by the base draft; drives the balance correction |

> ## ❌ 2026-08-04: the `shoulderSlope` detector cannot work
>
> **`shoulderSlope` is a hardcoded constant 13° in FreeSewing** — every stock
> model, female and male, sizes 28–50, dolls and giants alike.
> `neckstimate.mjs` reads `shoulderSlope: [13, 13]` and returns it unchanged.
> It is a placeholder, not anthropometry, so the residual
> `shoulderSlope − drafted shoulder angle` is not a measurement of the wearer —
> it is a measurement of the *block*, and it fires identically for everybody.
>
> This was found the expensive way. Bray's own armhole remedy ① (raise SP,
> square-shouldered figures only) was implemented in `bodiceblock` on exactly
> this residual. It declared **34 of 40** stock models square-shouldered, handed
> the armhole 9–23 mm, which the next remedy then removed again, and drove six
> sizes to a negative underarm drop. Reverted; see `bodiceblock/src/shared.mjs`
> `solveUpDrop`'s docblock and commit `a5a18215ce4`.
>
> **This is not a one-row patch.** The residual architecture is this spec's
> central claim — that a body-type correction can be *computed* from the gap
> between a wearer's measurement and what the proportional formula predicts.
> That claim is only as good as the measurements' information content, and one
> of the four detectors turns out to carry none. Before this spec is picked up,
> **probe every detector's actual spread across the stock models first**, and
> treat verification gate 5 (the zero-residual identity) as necessary but far
> from sufficient — a constant column passes it trivially, which is precisely
> why this went unnoticed at spec time.
>
> The other three detectors are unaudited as of this note. `hpsToWaistFront` /
> `hpsToWaistBack` and `chest`/`highBust` are graded in the stock data, so they
> are likely fine, but *likely* is not the standard this spec set for itself.

| Shoulder slope | 肩斜 | `shoulderSlope` | correction only | Degrees, not mm (`degreeMeasurements` in `packages/config/src/measurements.mjs`) |
| Shoulder width | 总肩宽 | `shoulderToShoulder` | correction only | Applied after balance |
| High bust | — | `highBust` | correction only | With `chest`, gives bust prominence for 瘦体/胖体 |
| Waist | 腰围 | `waist` | correction + darts | Ch. 7 derives dart amounts from the bust−waist difference |

The book supplies the standard values itself: it criticises GB1335-91 for omitting 背长
and 上裆长 from the official control-point tables — *国家标准的修订者们的一个重大疏忽* —
and supplements both. Those supplemented tables (printed p.76 and the 第四章 series) are
the source for the standard-body values every residual is measured against.

## Architecture

### Design surface

| | |
|---|---|
| Working id | `proportionalbodice` |
| Working name | "Proportional Bodice Block" |
| Template | `base` (from-scratch, as `skirtblock` was) |
| Tags | audience `women`; garment-type `tops` |
| Parts | `front`, `back` |
| Credits | `design` = 熊能; `code` = implementer |

Naming follows the project rule: accurate English, no pinyin, no loanword exception
claimed. See Open questions — the name is the one decision left open.

### Options

| Option | Type | Default | Range | Source |
|---|---|---|---|---|
| `bustEase` | pct of `chest` | 11.9% (→10 cm at 84) | 6–20% | `B/2+5` half-width, printed p.108 |
| `corrections` | bool | `true` | — | Off = the book's diagram verbatim; on = residual-driven |
| `sleeveCapEase` | pct | ~2.5 cm equivalent | 0–8% | Explicitly stated ≈2.5 cm, varying by garment class (printed p.113) |
| `dartDistribution` | pct | 67% front | 50–80% | Ch. 7 toile fitting: 20 cm total → 10 cm half → front ≈6.6, back ≈3.3 |

`corrections: false` is not a convenience toggle — it is the oracle mode and must stay
in the shipped design so the book's worked example remains reproducible forever.

### Base formulas (transcribed, printed pp. 108–120)

Worked example throughout: B = 84, 背长 = 38 (160/84A).

- Half width `B/2 + 5`
- Armhole depth `B/6 + 7`
- Back width 背宽 `B/6 + 4.5`
- Chest width 胸宽 `B/6 + 3`
- Back neck width `◎ = B/20 + 2.9`; front neck width `◎ − 0.2`; front neck depth `◎ + 1`
- Front shoulder = back shoulder length `△ − 1.8`
- Back armhole notch: half armhole width `+ 0.5`
- BP: half chest width `+ 0.7` out from centre, then 4 cm down from the bust line
- Side seam at waist shifted back 2 cm
- Hem flare at centre front: front neck width `/ 2`

Sleeve (drafted **from the finished armhole**, so it depends on the corrected bodice):
cap height `AH/3 − 1`; front sleeve width `前AH`; back `后AH + 1`; elbow line at half
sleeve length, down 2.5 cm.

### What is deliberately not built

**The men's block is a separate design, not an option.** Vol. 1's men's block is a
different formula family — armhole depth `B/6 + 8.5` vs. the women's `B/6 + 7`, neck
width `B/12` vs. `B/20 + 2.9`, half width `B/2 + 8` vs. `B/2 + 5` — and the book states
outright that the men's original has no sleeve or trouser block at all. 中国衣形结构
flags exactly this non-interchangeability as a structural weakness of 原型法. There is
no shared code path worth building; a `gender` option here would be a lie.

**Skirt and trouser corrections are out of scope** (Ch. 9 §3–§4: 腹凸体, 翘臀体, 胖体,
瘦体). The skirt corrections are the natural follow-on into the shipped `skirtblock`, as
that design already carries the geometry they modify.

## Verification

Beyond the four standard gates in the parent spec (shared suites, numeric oracle, studio
render, code review), this design adds two:

5. **Zero-residual identity.** Construct a synthetic measurement set whose every value
   equals the block's own prediction at B = 84 / 背长 = 38. Draft twice —
   `corrections: false` and `corrections: true` — and assert the two are identical. If
   this fails, a residual is being computed against the wrong baseline, which is the
   single most likely defect in the whole design.
6. **Monotonicity across the six types.** For each named body type, draft with the
   residual swept across its plausible range and assert the correction moves the block
   in the direction the book's diagram shows, with no sign flips or degenerate paths. A
   correction that reverses direction mid-range means the pivot centre is wrong.

The sampling suite carries extra weight here. 中国衣形结构's third criticism is that the
prototype's constituting formulas are **not 等比** — not scale-consistent — so the block
does not grade by pure proportion. Sampling across the size range is the check that this
known property degrades gracefully rather than producing broken drafts at the extremes.

## Phases

- **Phase A — extract.** Sonnet agents rasterise and transcribe Ch. 9 §1–§2 (printed
  168–183 = pdf 182–197) at page level: for each of the six body types and two sleeve
  cases, the exact geometry — which points move, which are pivot centres, direction, and
  every cm callout. Also transcribe 第四章第一节 人体测量 far enough to fix the
  背长 ↔ `hpsToWaistBack` offset. Output: `docs/patterns/proportionalbodice.md`.
  **Gate: any body type whose geometry cannot be read off the page is cut from v1 and
  recorded in the ledger as such.** No correction ships on inference.
- **Phase B — base block.** Implement the uncorrected proportional draft
  (`corrections: false` path only) and pass the numeric oracle against the book's worked
  example. This is a plain port and should behave like `skirtblock` did.
- **Phase C — residual engine.** Add the residual computation and the high-confidence
  corrections (balance, shoulder slope, shoulder width). Gates 5 and 6 apply here.
- **Phase D — remaining corrections.** 瘦体/胖体 and the sleeve cap corrections, subject
  to Phase A's gate.
- **Phase E — sleeve.** `proportionalsleeve` as a separate design drafted from the
  corrected armhole, following upstream's bodice/sleeve split (`bella` / `bent`).

Phase A is the long pole and is worth running before implementation is scheduled, since
its gate can shrink Phases C–D.

## Open questions

1. **The design name.** `proportionalbodice` / "Proportional Bodice Block" is accurate
   and follows the naming rule, but describes the *base* method rather than the adaptive
   behaviour that is the point. Alternatives: `prototypebodice` / "Prototype Bodice
   Block" (直译 of 原型, and the term the book itself uses), or naming by lineage — but
   the block is 熊能's variant, not Bunka's own, so a Bunka name would misattribute it.
   Decide before Phase B; the id is baked into the export name, i18n keys, and
   `packages/collection` wiring by `npm run reconfigure`.
2. **Ease as option vs. two bust values.** Treating `B/2+5` as `chest` + an ease option
   is the clean reading and dissolves the "three bust values" problem 中国衣形结构 raises
   — but it assumes the book's B is net body bust throughout. Worth one confirming look
   at the Ch. 6 text during Phase A.

## Relationship to the Bray family

These are two independent systems drafting the same garment, which is a verification
asset rather than a duplication. Bray's bodice (`英国经典服装纸样设计基础篇.pdf`,
printed 13–35) drafts from many independent measurements; this block derives everything
from bust. Where both are drafted at the same body, systematic disagreement between them
localises a transcription error in one of the two. The ledger keeps both as primary
sources for their own rows, cross-referenced — neither is a duplicate of the other.
