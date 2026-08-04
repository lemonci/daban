# skirtblock — standard skirt block (标准裙原型)

## Source

- Book: `英国经典服装纸样设计基础篇.pdf` (in `clothing_books`)
- Edition/authors: 纳塔莉·布雷 (Natalie Bray) 著; 王永进, 赵欲晓, 高凌 译; 中国纺织出版社
  (国际服装丛书 ②, "英国经典服装纸样设计 基础篇")
- Printed pages: 140–150 (chapter 第十一章 裙子; block construction 第三节 标准裙原型
  pp. 145–150). PDF pages 158–168, offset +18 (printed = PDF − 18).
- INDEX.md row: skirtblock

The 标准裙原型 (standard skirt block) is one of the book's three primary blocks
(衣片, 直袖, 标准裙 — printed p.7). Its silhouette is the "natural outline" of the
body in motion; nearly all skirt styles derive from it (p.141–142).

## Measurements

| Book term | CN | FreeSewing name | Worked example | Notes |
|---|---|---|---|---|
| Hip | 臀围 | `seat` | 98 cm | measured snug, 20–25 cm below waist; average position 22 cm (p.145) |
| Waist | 腰围 | `waist` | 70 cm | measured like a waistband, snug (p.146) |
| Waist-to-hip depth | (臀围线位置) | `waistToSeat` | 22 cm | the hip line of the draft sits at this depth (p.145, 147) |
| Knee depth | (膝围线位置) | `waistToKnee` | 52 cm | knee line, "slightly above the knee" on the body (p.147) |

Skirt drafting needs only hip, waist and skirt length (p.145); the two depth
measurements position the draft's structure lines (their book values 22/52 are the
averages the proportions were built on).

## Options

| Option | Type | Default | Range | Source |
|---|---|---|---|---|
| `seatEase` | pct (of `seat`) | 6.1% (≈6 cm at seat 98) | 3–10% | hip ease 6 cm, reducible to 4 cm when fashion is tight (p.146); fully fitted styles trim more |
| `lengthBonus` | pct (of `waistToKnee`) | 25% (→ 65 cm at 52) | 0–60% | worked draft length 65 cm (Fig 11-4/11-5, p.147–148); "62 cm or as needed" (p.145) |
| `silhouette` | list: `standard` / `straight` | `standard` | — | straight variant: same construction with 1.2 cm knee gaps instead of 1.7 (第五节 直裙原型, p.152) |

## Drafting steps (half pattern → front + back parts)

All lengths mm. `halfHip = (seat × (1 + seatEase)) / 2` — worked: (980+60)/2 ≈ **520**.
`L = waistToKnee × (1 + lengthBonus)` — worked: **650**. Depths: hip line at
`waistToSeat` (220), yoke line at `waistToSeat × 15/22` (150 — book: fixed 15 cm for
average height, structure lines may shift for extreme heights, p.147), knee line at
`waistToKnee` (520).

1. **Rectangle** `L × halfHip` (65 × 52 cm): top edge = waistline, bottom = hem,
   left = CB, right = CF (p.147). Mark yoke (15), hip (22), knee (52) lines.
2. **Quarter into strips** of width `halfHip/4` (130 each). The strip boundaries are
   at 130, 260, 390. Boundary 2 (260, the lengthwise center crease) will become the
   side seam (p.147–149).
3. **Spread at the knee line**: gap per boundary `g = floor(halfHip/10 / 3)` = 52/3
   → **17 mm** (书: 52 mm ÷ 3 = 17 mm, 舍去余数, p.148). Straight silhouette:
   `g = 12 mm` (p.152). Strips stay hinged at their boundary's **hip-line** point;
   strip k rotates by cumulative angle `θ = g / (waistToKnee − waistToSeat)` rad
   (17/300 → 3.247°) — so adjacent knee points separate by g, the hem opens more,
   and the strip tops **overlap** above the hip line, shortening and curving the
   waist edge (p.148).
4. **Derived widths** (worked): waist overlap per boundary = `waistToSeat × θ` =
   220×17/300 ≈ **12.47**; half-pattern waist edge = 520 − 3×12.47 ≈ **482.6**;
   knee half-width = 520 + 3×17 = **571**; hem half-width = 520 + 3×(430×17/300) ≈
   **593.1**.
5. **Split at the side seam** (boundary 2). Standard block: side seam ON the center
   crease (p.149; tailored 西服裙 2 cm forward, dress 礼服裙 1 cm back — not in v1).
   Front and back outlines are congruent; they differ in darts only.

   ⚠ **The split is a fold of the finished 4-strip fan, not a re-draft of each
   panel as its own 2-strip fan.** An earlier version of this step said "each
   part: one hinge at 130 from center, outer strip rotated θ", which
   contradicted step 4 and is what `designs/skirtblock` implemented — leaving
   each panel half a wedge (12.45 mm at the hem, 8.5 mm at the knee) narrower
   than step 4's derived widths. The book is explicit on both counts:

   > 要算出在**四个条形**之间的**三个间隙**应添加的尺寸大小…把该值算成以毫米为单位
   > 的值52mm，再除以3得到17mm(舍去余数)…也就是说，要对剪开的条形在膝围线位置上，
   > 加**三个**1.7cm的间隙。 (p.148)

   Three gaps between four strips, across the **half-pattern**, pinned
   cumulatively — "用大头针把第一个条形与…纸样固定在一起，再将第二个条形的下端向外
   移，与前者距离1.7cm…再移第三个纸条…继续对第四个纸条如此固定" (strip 1 fixed,
   each successive strip's lower end moved 1.7 cm out). Only then, p.149 §五:

   > 纵向对折纸样(半身纸样)…以折痕为中央线，大部分式样的裙子的侧缝线就在该中央线上。

   Fold the half-pattern lengthwise; the crease is the centre line and, for
   most skirts, the side seam sits on it. 图11-6 draws it that way — a single
   fanned piece with 后中心线 at the left, 前中心线 at the right, and the side-seam
   options marked down the middle.

   So each panel carries **1.5 wedges**: its own internal hinge plus half of
   boundary 2's, which the fold cuts through. Per-panel widths are therefore
   step 4's figures halved — knee **285.5**, hem **296.55** — not 277 / 284.4.
6. **Waist reduction (WR)**: per the book's procedure (p.149), measure `waist/2`
   (350) along the **drawn waist edge**; the remainder is WR. The traced edge per
   part is the polyline from center-waist along the fixed strip's top to where the
   rotated strip's top edge crosses it (x ≈ 123.8), then along that rotated edge
   to the side-waist corner: ≈ **241.24 per part**, so WR = 2×241.24 − 350 ≈
   **132.49** — which is step 4's own derived half-pattern waist edge (482.6,
   i.e. 241.3 per part) to within 0.06 mm, and lands inside the book's own
   "13~14 cm" commentary. Distribute (modern rule, p.150): **half at the side
   seam** (66.2 total → 33.12 removed at each part's side-waist corner along the
   rotated top edge), **remainder 2/3 into the two back darts** (22.10 each),
   **1/3 into the front dart** (22.10). Book ranges: side 6–7 cm
   nominal, max 8, min ~4 → 7.25 ✓; back darts 2–2.5 each → 2.42 ✓; front 2–3 →
   2.42 ✓ (Fig 11-6 p.149, p.150).
7. **Back darts**: guide lines parallel to CB at **80 mm** from CB and **65 mm**
   further (6–7 cm; p.150), from waist to the yoke line; darts centered on the
   guide lines, tips on the yoke line (see Ambiguity 3). Straight legs.
8. **Front dart**: one dart, guide line at 1/3 of side→CF from the side seam
   (Fig 11-6; see Ambiguity 4), tip on the yoke line.
9. **Side seam & waist curves**: side dart/removal legs equal on both sides of the
   side seam, guide lines meeting on the hip line; redraw as smooth curves that
   run into the side seam at the hip line or slightly below, matching the hip's
   curvature (p.150). Waist line: smooth shallow curve from center edge (right
   angle at CB/CF) to the raised side-waist point. Hip/knee/hem lines become
   shallow arcs through the rotated points (p.148).
10. **Hem**: curve through the rotated hem points ("摆线"). Optional CB raise of
    1 cm for large sizes (p.146/148) — not in v1.

## Worked example (oracle) — hip 98, waist 70, depths 22/52, length 65 (cm)

| # | Dimension | cm (book arithmetic) | mm (oracle) |
|---|---|---|---|
| 1 | Half skirt hip (back + front hip width) | 52 (49+3, p.145/147) | 520 |
| 2 | Hip width per part | 26 | 260 |
| 3 | CB/CF length (waist→hem) | 65 | 650 |
| 4 | Waist→hip depth on center edge | 22 | 220 |
| 5 | Knee gap per boundary (at knee line) | 1.7 | 17 |
| 7 | Traced waist edge per part (polyline, before shaping) | 24.124 | 241.24 |
| 8 | Waist reduction WR (2×241.24 − 350) | 13.25 | 132.49 |
| 9 | Side-seam removal (total / per part) | 6.62 / 3.31 | 66.2 / 33.12 |
| 10 | Back dart intake (each of two) | 2.21 | 22.10 |
| 11 | Front dart intake | 2.21 | 22.10 |
| 12a | Net back waist after shaping | 16.37 | 163.7 |
| 12b | Net front waist after shaping | 18.58 | 185.8 |
| 12c | Net waist, both parts (= waist/2) | 35 | 350 |
| 13 | Yoke line depth (dart tip line) | 15 | 150 |
| 14 | Back dart guide lines from CB | 8 and 14.5 | 80 / 145 |
| 15 | Knee half-width | 57.1 | 571 |
| 16 | Hem half-width | 59.31 | 593.1 |

Checks against the book's own statements: finished hip 98+6=104 (p.146) ✓ (2×52);
WR 14.51 vs commentary "13~14" (see Ambiguity 5 — procedural measure chosen);
side 7.25 within "6–7, max 8" ✓; back darts 2.42 within 2–2.5 ✓; front 2.42
within 2–3 ✓. Note the asymmetry: the back quarter is suppressed more than the
front (two darts vs one — Fig 11-6), so net back waist < net front waist; only
the sum equals waist/2.

Model note: suppression amounts are computed arithmetically on the traced
polyline edge (deterministic), then the waist is drawn as the book's smoothed
curve; the ~1 mm smoothing latitude does not touch the oracle rows.

## Construction notes

- The block is drafted **net** (no seam allowance); SA is added at cutting (p.6).
- Waistband: straight band at waist measurement (not part of the block v1).
- The hip line must stay parallel to the floor when worn (p.146).
- Closure: typically CB or side zip — outside block scope.

## Ambiguities

All chosen readings below are documented defaults; flagged for user
confirmation. (The claim that none of them affects the oracle dimensions was
removed on 2026-08-04 — Ambiguity 5 turned out to be a construction error in
this spec, not a reading choice, and it moved eight oracle rows.)

1. **Hem-width prose**: p.142 states the standard block's hem as "1⅕/1½ 臀围宽"
   (glyph unclear in scan; OCR garbled). The §4 construction (knee gaps) is
   explicit and canonical; it yields hem ≈ 1.14× half-hip at length 65.
   **Chosen: the construction governs.** (1⅕ is also the reading consistent with
   p.142's "+1/4 or +1/5" prose.)
2. **Skirt length**: sizes list "62 cm (或根据需要而定)" (p.145) but the worked
   rectangle is 65 × 52 with "长方形的长为裙长" (p.147). **Chosen: 65** (matches
   Figs 11-4/11-5); `lengthBonus` covers 62.
3. **Back/front dart end**: p.150 prints "缝到腰围线或稍低1~2cm" — 腰围线
   (waistline) is geometrically impossible for a waist dart; p.146 defines the
   yoke line (15 cm) as marking "较小腰省的长度". **Chosen: darts end on the yoke
   line** (腹围线/育克线misprint reading).
4. **Front dart position**: no numeric position in text; Fig 11-6 shows it about
   a third of the way from the side seam toward CF. **Chosen: guide line at 1/3
   of side→CF distance from the side seam** (tip x = 2/3 × side-waist x ≈ 141).
5. ~~**WR arithmetic**~~ — **DISSOLVED 2026-08-04.** This recorded that the
   book's "13~14 cm" commentary disagreed with its own procedure, which traced
   out at 14.51. Both were right; the draft was wrong. The half-wedge missing
   from step 5 (see the ⚠ there) shortened the waist edge as well as the hem,
   and correcting it brings the traced measure to **13.25 cm** — the commentary's
   own figure, and step 4's derived 482.6 for the pair to within 0.06 mm.

   Worth recording as method: this ambiguity was never an ambiguity in the book.
   It was a symptom of a construction error elsewhere in this spec, and it sat
   here for a week wearing the costume of a source problem. **A "the book
   contradicts itself" note is a hypothesis, not a finding** — before recording
   one, check whether some other part of your own draft would explain both
   readings at once. Here, one missing half-wedge explained the hem, the knee,
   the waist edge and the WR simultaneously.

## Review

Principles gate (spec review, 2026-08-03) against `pattern-making-principles`:

- Inputs limited to hip/waist/length (+depths) — matches Bray p.9/11 ✓
- Hip ease 6 cm (range 4–6) cited p.146 ✓; hip measured ~22 cm below waist,
  within the 18–23 range (Bray p.9, p.145) ✓
- Dart arithmetic: side + 2×back + front = 66.3+44.2+22.1 = 132.6 = WR ✓
  (darts absorb exactly the waist–hip surplus per quarter)
- All dart intakes within the book's own cited ranges ✓
- Hem (593) wider than hip (520): movement allowance per Bray p.7 ✓

Result: **pass** — no principle violations; proceed to implementation.

Drafted-output review (gate #3, 2026-08-03, post-implementation):

1. Shared suites: 136 passing (config/i18n/drafting/sampling + oracle).
2. Numeric oracle: 18/18 within ±2 mm of the worked example (rows 1–16).
3. Visual: rendered draft compared against Fig 11-6 (p.149) — dart count and
   placement (2 back / 1 front), waist curve, hip-to-hem flare and proportions
   match; studio collection listing confirmed by the user.
4. Principles: suppression sums exactly absorb the waist–hip surplus (net waist
   = waist/2); hip ease 6 cm within cited range; front/back side seams congruent
   by construction; hem wider than hip line (movement, Bray p.7).

Result: **pass** — approved for merge.
