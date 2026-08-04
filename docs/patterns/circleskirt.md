# circleskirt — full-circle skirt block (全圆型裙原型)

## Source

- Book: `英国经典服装纸样设计基础篇.pdf` (in `clothing_books`)
- Edition/authors: 纳塔莉·布雷 (Natalie Bray) 著; 王永进, 赵欲晓, 高凌 译; 中国纺织出版社
  (国际服装丛书 ②, "英国经典服装纸样设计 基础篇")
- Printed pages:
  - **153–154** — 第十一章 裙子, 第六节 全圆型裙原型 (PDF pages 171–172). Task's
    "primary target"; folio-checked (PDF p.171 prints "153" in the running
    footer), confirming offset printed = PDF − 18.
  - **189–198** — 第十六章 圆裙纸样: 第一节 画样法 (p.190–192), 第二节 调整喇叭形纸样的
    方法 (p.196–198) (PDF pages 207–216). Same offset.
- INDEX.md row: `circleskirt` (see proposed row at the end of this file)

## Reconciliation: pp.153–154 vs Ch.16 are two different methods, not one at two levels of detail

This was checked directly, not assumed. Evidence:

1. **Ch.11 §6 (pp.153–155) is entirely derived from the standard (rectangular)
   skirt block.** Its own opening sentence for the chief method: "全圆型裙的纸样
   可以从绘制标准裙纸样的结构线上获得" ("the full-circle skirt's pattern can be
   obtained from the structural lines of the standard skirt pattern"). Both of
   its variants operate on the standard block's already-quartered strips
   (`skirtblock.md` step 2): separate them at a point **3 cm above the hip
   line**, pivot to close the waist to `waist/2 + 3(4)cm` (worked: 52 cm→38 cm
   at waist 70, quote p.154: "对于52cm(长方形)宽度则要减小到38cm(1/2腰围+3cm)"),
   leaving a residual side-seam dart of "3~3.5cm" (p.154). The resulting waist
   edge is a **traced polyline through pivoted rectangle-strip corners** —
   structurally the same kind of curve as `skirtblock`'s own waist edge, never
   a literal circular arc, and no radius is ever computed.
2. **Ch.16 §1 (画样法, pp.190–192) is a from-scratch compass/tape-measure
   construction**, unrelated to the rectangular block. It draws the waist as a
   literal circular arc of radius `r`, centered on a fixed point O, with `r`
   computed from the waist measurement (see Drafting step 3), and the hem as a
   second, concentric arc at `r + skirt length`. Fig 16-5 (p.194) confirms:
   "全圆形裙 1/4圆的四倍" (full-circle skirt = a quarter circle used four times),
   with each quarter's own arc explicitly labeled "1/4腰围".
3. The task's own framing — "the waist is a circular arc whose radius derives
   from the waist measurement" — matches **only** Ch.16. Ch.11 §6 never
   computes a radius.

**This spec implements Ch.16 §1 as the primary drafting method** (self-contained,
matches the design brief's "genuinely a different design" framing, and is what
the radius/fudge-factor instruction is actually describing). Ch.11 §6's
slash-and-spread route is documented in Construction Notes as the book's own
unimplemented alternative to a visually similar garment.

## Measurements

| Book term | CN | FreeSewing name | Worked example | Notes |
|---|---|---|---|---|
| Waist | 腰围 | `waist` | 70 cm | Ch.16's own radius-formula worked examples use "腰围69~70cm" (p.191) — this design's **only** body-measurement input; no hip/seat measurement is used (see Ambiguities/Review) |
| Knee depth | (膝围线位置) | `waistToKnee` | 52 cm | reused from `skirtblock` solely to derive a default finished length via `lengthBonus` (Options) — Ch.16 itself has no knee-relative length rule, see Ambiguity 2 |

## Options

| Option | Type | Default | Range | Source |
|---|---|---|---|---|
| `lengthBonus` | pct of `waistToKnee` | 35% (→ 70.2 cm at 52) | 0–105% | chosen to land at Ch.16's own "短裙 长70~75cm" average (p.196); range covers the book's stated short (70–75 cm) through long/evening (100–105 cm) circle-skirt lengths — see Ambiguity 2 |
| `fullness` | list: `full` / `threeQuarter` / `half` / `quarter` | `full` | — | p.192 states the family explicitly: the drafted piece is always a 90° sector, and "它的两倍就是半圆纸样，它的三倍就是四分之三圆纸样，它的四倍就是一个全圆纸样" — used 2×, 3× or 4× gives the half, three-quarter or full circle. The rule is exact: `Aa = waistEff / n` with n = 4/3/2/1 respectively. Fig 16-3 draws all three principal cases side by side with their radii. Implementing only `full` would under-port a chapter whose stated organising idea is that one quarter-piece serves every fullness |
| `hipSafetyMargin` | **pct** (of `waist`) | 6.43% (→4.5 cm at waist 70) | 0–7.14% (→0–5 cm at waist 70) | ⚠ **must not be a flat cm/mm option** — FreeSewing's shared config test rejects raw linear options; see Construction notes. p.196: "这种原型应特别留意臀围尺寸，因为它是按腰围尺寸进行裁剪的，所以有可能出现臀围过小，像全圆型裙那样的情况。为防止出现上述情况，建议对腰围增加4~5cm进行裁剪，最后可在侧缝处收腰省来收掉这部分松量。" (quoted in full — this is the book's stated fix for a known failure mode of this exact design, not a generic ease knob). 0 disables it (bare geometric radius) |

## Drafting steps (quarter panel → mirrored to front + back halves)

All lengths mm unless noted. Point labels follow the book's own O/A/a/B/b
(Figs 16-1, 16-2, p.190–191).

1. **Effective waist arc.** `waistEff = waist + hipSafetyMargin` — worked:
   700 + 45 = **745**.
2. **Quarter arc Aa.** The drafted piece is *always* a 90° sector — the
   base pattern (基础纸样). What changes with `fullness` is how many times it is
   used, and therefore what fraction of the waist its arc must carry (p.192:
   "如果其长度等于腰围全长，那么纸样就用了一次；如果是腰围的一半，那么纸样就用了两次；
   如果是腰围的四分之一，那么纸样就用了四次，成为一个全圆"; Fig 16-5 p.194 confirms
   visually).

   `Aa = waistEff / n`, with `n` the number of quarter-pieces:

   | `fullness` | n | Aa at waistEff 745 | r |
   |---|---|---|---|
   | `full` (default) | 4 | **186.25** | **118.57** |
   | `threeQuarter` | 3 | 248.33 | 158.09 |
   | `half` | 2 | 372.50 | 237.13 |
   | `quarter` | 1 | 745.00 | 474.27 |

   The worked example below uses `full`, i.e. `Aa = 745/4 = **186.25**`. Note
   the radii double from `full` to `half` and double again to `quarter`, which
   is exactly the relationship Fig 16-3 prints as "11, 22+, 44~45" — the
   figure's three labelled cases are these three `fullness` values at waist 70,
   not three different formulas.
3. **Waist radius r (= OA = Oa).** Aa is by definition the arc length of a 90°
   sector of radius r, so `Aa = (π/2) × r` exactly, giving **`r = (2/π) × Aa`**.
   Worked: (2/3.14159265)×186.25 ≈ **118.57**. This is the exact circle
   relationship, not the book's stated "×2/3" shortcut — see Ambiguity 1 for
   why the shortcut is documented but not implemented.
4. **Length L.** `L = waistToKnee × (1 + lengthBonus)` — worked:
   520×1.35 = **702**.
5. **Hem radius (= OB = Ob).** `r_hem = r + L` — worked: 118.57+702 = **820.57**.
   (p.191: the AB / ab distance, measured along the two straight edges, "是所需
   的裙长" — is the required skirt length; the hem arc is concentric with the
   waist arc, offset outward by exactly L.)
6. **Draft the quarter panel** (Figs 16-1/16-2). Place O at the origin. Draw a
   straight edge from O along 0°, length r_hem; mark waist point **A** at
   distance r, hem point **B** at distance r_hem. Draw a second straight edge
   from O along 90°, length r_hem; mark waist point **a** at distance r, hem
   point **b** at distance r_hem. Draw the waist arc from A to a (radius r,
   center O) — drawn first, per the book's tape-measure-as-compass method.
   Draw the hem arc from B to b (radius r_hem, center O) — drawn second (p.191:
   "再次转动卷尺（仍从O点）画出从bB的第二条圆弧线，这就是纸样的底边线").
7. **Front and back parts.** Treat edge O–A–B as the CF fold line: mirror the
   quarter panel across it to produce a half-circle front panel (waist arc
   sweep 180°, matching Fig 16-5's "半圆形裙 1/4圆的两倍" assembly); the two
   mirrored O–a–b edges become the two side seams of the front. Repeat,
   mirroring across O–A–B as the CB fold, for the back. Front and back parts
   are **geometrically identical half-circles** — no dart distinguishes them.
   They join at 2 side seams. (p.193 notes 2, 4, or 8 seams are all equally
   valid cutting choices for the identical underlying shape — see Construction
   Notes; this spec uses 2.)
8. **Hip-safety dart** (only if `hipSafetyMargin` > 0). Remove it at the two
   side seams as short waist darts (p.196: "最后可在侧缝处收腰省来收掉这部分松量").
   Chosen (book states neither the split nor the tip depth — Ambiguity 3):
   `hipSafetyMargin / 2` per side seam, worked: 45/2 = **22.5**; dart tip
   100 mm below the waist.

## Worked example (oracle)

### A — radius-formula verification (book's own examples; point-derived, tight)

| # | Aa (cm) | r exact = (2/π)×Aa (cm) | r the book states (cm) | Source |
|---|---|---|---|---|
| A1 | 17.5 (= 70/4, full-circle case) | 11.14 | "约为11cm...实际中常取整数部分" | p.191 |
| A2 | 35 (= 70/2, half-circle case) | 22.28 | "22cm" (Fig 16-3: "22+") | p.191 |
| A3 | 69–70 (= whole waist, quarter-circle case) | 43.93–44.56 | Fig 16-3: "44~45" | p.192 |
| A4 | 39 (unrelated flounce example, Fig 16-6) | 24.82 | "39×2/3，即25~26cm" | p.197 |

⚠ **This table does not discriminate between the two readings, and an earlier
version of this spec claimed it did.** Rows A2 and A3 are not independent
evidence: p.192 derives 22 and 44 by *doubling* A1's truncated 11, not by
applying either formula to Aa=35 or Aa=70. Row A4 (`39×2/3，即25~26cm`, p.197)
positively favours the shortcut, since the exact formula gives 24.83. The table
is kept because it records the book's stated figures, which an implementation
should be able to reproduce under the book's own procedure — but the choice of
formula rests on Ambiguity 1's reasoning, not on this table.

The former (incorrect) claim was that all four values match `r = (2/π)×Aa`
within whole-cm rounding, and that the "×2/3" shortcut (giving
11.67/23.33/46–46.7/26)
matches only A1, by coincidence of rounding. This table is the evidence for
Ambiguity 1's resolution.

### B — this design's own worked example (waist 70, default options: `lengthBonus` 35%, `hipSafetyMargin` 4.5 cm)

| # | Dimension | cm (arithmetic) | mm (oracle) |
|---|---|---|---|
| 1 | waistEff = waist + hipSafetyMargin | 74.5 | 745 |
| 2 | Aa (quarter arc) = waistEff/4 | 18.625 | 186.25 |
| 3 | Waist radius r = OA = Oa = (2/π)×Aa | 11.857 | 118.57 |
| 4 | Length L = waistToKnee × 1.35 | 70.2 | 702 |
| 5 | Hem radius r_hem = OB = Ob = r + L | 82.057 | 820.57 |
| 6 | AB = ab (straight radial edge) = L | 70.2 | 702 |
| 7 | Waist arc per quarter (π/2 × r) [bracket] | ≈18.625 | ≈186.25 |
| 8 | Hem arc per quarter (π/2 × r_hem) [bracket] | ≈128.90 | ≈1289.0 |
| 9 | Full waist circumference (4 × Aa, before dart) | 74.5 | 745 |
| 10 | Hip-safety dart, total / per side seam | 4.5 / 2.25 | 45 / 22.5 |
| 11 | Finished waist after dart removal (row 9 − row 10 total) | 70.0 | 700 (= `waist` ✓) |
| 12 | Full hem circumference (4 × row 8) [bracket] | ≈515.6 | ≈5156 |

Checks against the book's own statements: row 11 exactly recovers the input
`waist` (70 cm) — the hip-safety dart is self-cancelling by construction ✓.
Row 12 (≈5.16 m) is the right order of magnitude against the book's own
average-table figure for a ~70 cm-long full-circle short skirt ("全圆下摆宽度大约
5.5m", p.196) — the book's own table is stated as approximate ("这些都是大约的
尺寸，可以随实际裙长进行调整") and doesn't specify what waist/margin it assumed, so
this is a directional check, not a tight one.

Model note: rows 1–6, 9–11 are exact point-derived distances (deterministic,
no smoothing). Rows 7, 8, 12 are curve-length brackets; here they are
tautological (the radius was derived from Aa with no intermediate rounding —
a computed draft has no reason to round). A hand-drafted version using the
book's own whole-cm-rounded radius would show the small, explicitly-tolerated
shortfall the book describes in Construction Notes.

### Typical finished dimensions (book's own average table, p.196, for reference)

| | 短裙 (length 70–75 cm) | 长裙 (length 100–105 cm) |
|---|---|---|
| 全圆 (full circle) hem width | 5.5 m | 7.25 m |
| 半圆 (half circle) hem width | 3.25 m | 4.5 m |
| 四分之一圆 (quarter circle) hem width | 1.75 m | 2.25 m |

## Construction notes

- The block is drafted **net** (no seam allowance), consistent with the book's
  general convention (see `skirtblock.md`).
- Cutting layout: this spec assumes front + back cut on the fold (2 side
  seams). The book (p.193) explicitly allows 2, 4, or 8 seams for the
  identical underlying quarter-circle shape: "在面料上，裁剪全圆型裙可以只有两条侧缝线，
  或者有四条缝线（为4片裙），也可有8条缝线（为8片裙）". If a center-back zip is wanted,
  cut CB as a seam instead of a fold — no change to the pattern shape
  (implementation note, not book-sourced).
- Closure: neither source section discusses an opening; a zip (CB or side) is
  assumed, outside block scope (matches `skirtblock`'s own convention).
- **Option typing.** FreeSewing rejects raw linear options (`mm`, and equally a
  flat `cm` value) in its shared config test — every option must be `pct`,
  `deg`, `bool`, `count` or `list`. That is why `hipSafetyMargin` is a
  percentage of `waist` rather than the book's literal 4–5 cm; the book's range
  is 5.71–7.14% at waist 70, and the 6.43% default is its midpoint 4.5 cm.
- **`fullness` is not scope creep.** Ch.16's organising claim is that one 90°
  base pattern serves every fullness ("最简便的就是用四分之一圆做所有类型的基础纸样"),
  and Fig 16-3 draws three of the four cases with their radii. The rule is a
  single divisor, fully stated. Shipping only the full circle would implement
  one figure out of a chapter built around the family.
- Rounding/tolerance the book allows for hand-drafting: it rounds the radius
  to a whole cm and tolerates the resulting few-mm waist-arc shortfall,
  because the bias-grain fabric stretches to fit — p.191: "有一点小误差可以忽略，
  尤其当圆弧线稍短一点的时候。因为圆弧很容易拉伸到所需尺寸。" This spec computes the
  unrounded radius, so the discrepancy the book tolerates does not arise.
- **Documented, unimplemented alternative** — Ch.11 §6 (printed pp.153–155)
  derives a visually similar garment by slashing and spreading the
  **standard, rectangular** `skirtblock` pattern's already-quartered strips
  (see `skirtblock.md` step 2), pivoted at a point 3 cm above the hip line,
  closing the waist to `waist/2 + 3(4)cm` per half with a residual "3~3.5cm"
  side-seam dart (p.153–154, quoted in the Reconciliation section above). This
  requires the standard block already drafted, and its waist edge is a traced
  polyline, not a literal arc. Both methods converge to a finished waist ≈
  true `waist` (a useful cross-check, see Review) but they are not
  interchangeable procedures, and only Ch.16's method is implemented here.

## Ambiguities

1. **Radius formula: the book's stated "×2/3" shortcut vs. its own worked
   numbers and diagram.** p.191 states, as its recommended simplification:
   "因此更简便地计算半径的方法就是用所需Aa的长度值乘以2/3" (multiply Aa by 2/3),
   justified by "取周长（即全圆周长是四分之一圆弧长的四倍）的六分之一" (take 1/6 of the
   [4×Aa] circumference — i.e. replacing 2π≈6.283 with a round 6). Applied
   literally this predicts r≈11.67/23.33/46–46.7 for Aa=17.5/35/69–70.

   ❌ **An earlier reading of this spec argued the book's own printed radii
   (11, 22+, 44~45) match the exact formula and refute the shortcut. That is
   wrong** — the shortcut reproduces all three exactly, once you follow what
   the book actually does with it. p.191 truncates: "约为11cm（**实际中常取整数
   部分**）", so 17.5×2/3 = 11.67 → **11**. Then p.192 *doubles* rather than
   re-applying the shortcut: "如果对应四分之一腰围（如17.5cm）的半径找好
   （2/3 × 17.5 = 11cm），那么只要把半径**加倍**（22cm）…**再加倍**（44cm）". So
   22 = 11×2 and 44 = 11×4, not 35×2/3 and 70×2/3. And p.197's flounce example
   writes the shortcut out in full — "39×2/3，即25~26cm" — where the exact
   formula gives 24.83, so that data point actually favours the shortcut.
   Checking the numbers against the wrong procedure made a matching rule look
   like a mismatched one.

   ✅ **Chosen anyway: the exact `r = (2/π)×Aa`**, for the reason the book
   itself gives rather than a numerical one. It introduces the shortcut
   explicitly as hand-arithmetic relief — "实际上，要算出半径并不太容易" (working
   out the radius is not very easy) — replacing 2π≈6.283 with a round 6. That
   is a convenience for someone with a tape measure, not a design intent, and
   code has π. It also fits better: ×2/3 alone oversizes the waist by 4.7%,
   while the book's compensating truncation to 11 cm goes the other way and
   leaves the drafted waist at 2π×110 = 691 mm against a 700 mm body — 9 mm
   tight. The exact radius gives the waist measurement on the nose.
2. **`lengthBonus` default/range chosen for this design, diverging from
   `skirtblock`'s.** Ch.16 never relates circle-skirt length to knee position
   (unlike Ch.11 §3's standard block); instead it gives absolute typical
   lengths (p.196: short 70–75cm, long 100–105cm). This spec keeps the
   `waistToKnee` + `lengthBonus` mechanism for cross-design consistency (per
   the porting brief) but sets its default (35%) and range (0–105%) from
   Ch.16's own table rather than reusing `skirtblock`'s (25%, 0–60%).
   **Chosen**, not book-mandated as a percentage — flagged for confirmation.
3. **Hip-safety dart split and tip depth.** p.196 states only that the
   `hipSafetyMargin` excess is removed "在侧缝处" (at the side seam) as a "腰省"
   (waist dart); it states neither the split between the two side seams nor a
   tip depth. **Chosen: split evenly (`hipSafetyMargin/2` per side seam), tip
   100mm below the waist** — a plausible short-dart length, not book-stated.
4. **Whether pp.153–154 and Ch.16 are the same construction** — resolved, not
   left open; see the Reconciliation section under Source. Recorded here only
   for visibility since it is the single most consequential reading in this
   spec.

## Review

Principles gate (spec review) against `pattern-making-principles`:

- This design's only body-measurement input is `waist` — no `seat`/hip
  measurement — a real departure from that skill's "skirt inputs limited to
  hip, waist, length" principle (Bray p.9/11, written for the standard
  block). This is not a spec omission: it is what Ch.16 itself specifies (a
  compass method driven by waist alone), and the book independently names the
  resulting hip-fit risk and supplies its own mitigation (`hipSafetyMargin`,
  p.196, quoted above) — the risk and the fix are both book-sourced.
- No principle in the current `pattern-making-principles` skill yet covers
  radial/circle-skirt geometry (§3b there is Ch.11's rectangular block only)
  — flagged for a future skill update; out of scope for this spec.
- Internal consistency: the finished waist after the hip-safety dart exactly
  recovers the input `waist` (Worked example, Table B, row 11) — the margin
  is self-cancelling by construction.
- Cross-check against Ch.11 §6's independently-extracted, differently-derived
  arithmetic (Construction Notes): its closure target (`waist/2+3(4)cm` per
  half, worked 38cm at waist 70 → 76cm total before shaping) plus its own
  residual side dart (3–3.5cm) also converges to a finished waist ≈
  69.5–70cm — agreeing with this spec's waist=70 result despite being a
  structurally unrelated procedure. Two independently-extracted methods
  landing on the same finished waist is corroborating evidence, not proof,
  since one does not derive from the other.
- Physical check: the quarter panel is a well-formed 90° sector for any
  positive r, L (no seam-closure or negative-width failure mode); mirroring
  it across a straight radial edge always produces a valid half-circle,
  matching Fig 16-5's assembly exactly.

Result: **pass** — no principle violations. The waist-only input is a
documented, book-driven property of this specific design (not an omission),
and its stated fit risk has an explicit, implemented mitigation. Drafted-output
review is pending implementation (not yet done — this is a spec-only pass).

## Proposed INDEX.md row

Replacing the existing "Full-circle skirt block" row in the "Foundation blocks
— women's" table (not applied — another agent owns INDEX.md edits):

```
| `circleskirt` | Full-circle skirt block (全圆型裙原型) | 英国经典服装纸样设计基础篇 (Bray) | 153–154, 189–198 | candidate · specified | Radial, waist-only compass construction (Ch.16 §1, 画样法) — genuinely distinct from `skirtblock`. Corrects the earlier note: pp.153–154 and Ch.16 are **not** the same geometry at different detail levels — pp.153–154 slash-and-spreads the *rectangular* `skirtblock` pattern (needs it already drafted); Ch.16 draws a true circular arc from a waist-derived radius (r = 2×Aa/π). This spec implements Ch.16; pp.153–154's method is documented as an unimplemented alternative. Spec: `circleskirt.md` |
```
