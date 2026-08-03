# qun — standard skirt block (标准裙原型)

## Source

- Book: `英国经典服装纸样设计基础篇.pdf` (in `clothing_books`)
- Edition/authors: 纳塔莉·布雷 (Natalie Bray) 著; 王永进, 赵欲晓, 高凌 译; 中国纺织出版社
  (国际服装丛书 ②, "英国经典服装纸样设计 基础篇")
- Printed pages: 140–150 (chapter 第十一章 裙子; block construction 第三节 标准裙原型
  pp. 145–150). PDF pages 158–168, offset +18 (printed = PDF − 18).
- INDEX.md row: qun

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
   Front and back outlines are congruent; they differ in darts only. Each part:
   center edge (CB/CF) straight and vertical, one hinge at 130 from center, outer
   strip rotated θ.
6. **Waist reduction (WR)**: measure `waist/2` (350) along the waist edge; the
   surplus is WR = 482.6 − 350 ≈ **132.6** ("13~14 cm" typical, p.150). Distribute
   (modern rule, p.150): **half at the side seam** (66.3 total → 33.15 removed at
   each part's side-waist corner), **remainder 2/3 into the two back darts**
   (22.1 each), **1/3 into the front dart** (22.1). Book ranges: side 6–7 cm
   (max 8, min ~4), back darts 2–2.5 cm each, front 2–3 cm (Fig 11-6 p.149, p.150).
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
| 6 | Waist overlap per boundary | 1.247 | 12.47 |
| 7 | Half-pattern waist edge before shaping | 48.26 | 482.6 |
| 8 | Waist reduction WR | 13.26 | 132.6 |
| 9 | Side-seam removal (total / per part) | 6.63 / 3.315 | 66.3 / 33.15 |
| 10 | Back dart intake (each of two) | 2.21 | 22.1 |
| 11 | Front dart intake | 2.21 | 22.1 |
| 12a | Net back waist after shaping (24.13 − 3.315 − 2×2.21) | 16.39 | 163.9 |
| 12b | Net front waist after shaping (24.13 − 3.315 − 2.21) | 18.61 | 186.1 |
| 12c | Net waist, both parts (= waist/2) | 35 | 350 |
| 13 | Yoke line depth (dart tip line) | 15 | 150 |
| 14 | Back dart guide lines from CB | 8 and 14.5 | 80 / 145 |
| 15 | Knee half-width | 57.1 | 571 |
| 16 | Hem half-width | 59.31 | 593.1 |

Checks against the book's own statements: finished hip 98+6=104 (p.146) ✓ (2×52);
WR within "13~14 cm" (p.150) ✓; side 6.63 within 6–7 ✓; back darts 2.21 within
2–2.5 ✓; front 2.21 within 2–3 ✓. Note the asymmetry: the back quarter is
suppressed more than the front (two darts vs one — Fig 11-6), so net back waist <
net front waist; only the sum equals waist/2.

Model note: rows 6–8 use the book's own chord arithmetic (overlap = depth × θ).
The drawn waist line is a smoothed curve (as the book's tracing-wheel step
produces); dart intakes and removals are applied from the arithmetic, so the
smoothing latitude (~a few mm of curve length) does not touch rows 1–16.

## Construction notes

- The block is drafted **net** (no seam allowance); SA is added at cutting (p.6).
- Waistband: straight band at waist measurement (not part of the block v1).
- The hip line must stay parallel to the floor when worn (p.146).
- Closure: typically CB or side zip — outside block scope.

## Ambiguities

All chosen readings below are documented defaults, none affects the oracle
dimensions (rows 1–16 all derive from explicit book numbers); flagged for user
confirmation:

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
   of side→CF distance from the side seam.**

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
