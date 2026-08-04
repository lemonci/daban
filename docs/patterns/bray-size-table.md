# Bray 表1-2 主要控制尺寸及比例表 — master size and proportion table

## Source

- Book: `英国经典服装纸样设计基础篇.pdf` (in `clothing_books`)
- Natalie Bray (纳塔莉·布雷), 中国纺织出版社, 国际服装丛书 ②
- **Printed p.12** (PDF 1-based p.30), 第一章 人体测量与原型纸样 第十节 怎样测量
- Offset: printed = PDF(1-based) − 18
- Read and transcribed at **500 dpi** on 2026-08-04

This is the grading table for the whole Bray basics volume. Every block in the
book (`bodiceblock`, `sleeveblock`, `skirtblock`) is drafted at one of these ten
sizes, and the chapters' worked examples are size **IV** (chest 92) or size
**III** (chest 88).

Recorded here because the block specs kept deferring to it as unavailable. It
was never unavailable — it simply sits one page before the chapter the bodice
was extracted from, outside the page range that extraction scoped.

## Notation

The book writes `−` and `+` after a figure to mean *slightly less than* /
*slightly more than* that value, not a range. `6.5−` is "a little under 6.5".

A `a/b` pair means two acceptable values — for 背长 (LW) the first is for a
figure of average height (160–165 cm) and the second for a taller figure, per
the book's own note 1 below the table. For other columns the pair appears to be
a small/large variant within the size.

## The table (单位: cm)

| 号 | 胸围 B | 臀围 H | 腰围 W | 背长 LW | 后背宽 XB | 胸宽 CH | 肩宽 SH | 上臂围 TA | O点 CB | 后领宽 | 袖窿深 (胸围线) | 后窿门宽 | 省道 | 袖窿 (大约值) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I | 80 + 10 | 86 + 6 | 64 | 38/40(36) | 33/34 | 35 | 12− | 28 | 2 | 6.5− | 20.5 | 5 | 6 | 40 |
| II | 84 | 90 | 66 | 39/41 | 34/35 | 36 | 12 | 29 | 2.5 | 6.5 | 20.5+ | 5 | 6.5 | 41 |
| III | 88 | 94 | 68 | 39.5/41.5 | 35/36 | 37 | 12.5− | 30 | 3 | 7− | 21 | 5 | 7 | 42 |
| **IV** | **92** | **98** | **70** | **40/42** | **36/37** | **38** | **12.5** | **31** | **3** | **7** | **21.5** | **5.5** | **7.5** | **43** |
| V | 96 | 102 | 72 | 40.5/42.5 | 37/38 | 39 | 13− | 32 | 3.5 | 7.5− | 22 | 6 | 8 | 44.5 |
| VI | 100 | 106 | 76 | 41/43 | 38/39 | 40 | 13 | 33 | 3.5 | 7.5 | 22.5 | 6 | 8.5 | 46 |
| VII | 104 | 110 | 80 | 41.5/43.5 | 39/40 | 42 | 13.5 | 34.5 | 4 | 8− | 23 | 6.5 | 9 | 47 |
| VIII | 108 | 114 | 84/86 | 42/44 | 40/41 | 43 | 13.5 | 36/37 | 4 | 8 | 23.5 | 7 | 9.5 | 48 |
| IX | 112 | 118 | 88/90 | 42.5/44 | 41/42 | 44.5 | 14 | 38 | 4.5 | 8.5− | 24 | 7 | 10 | 50 |
| X | 116 | 122 | 92 | 43/45 | 42/43 | 46 | 14.5 | 39/40 | 4.5 | 8.5 | 24.5 | 7 | 10.5 | 51/52 |

Size IV is bolded because it is the worked example for Ch.2 (bodice) and Ch.11
(skirt). Row I's `80 + 10` and `86 + 6` are the book noting the standard bust
and hip **ease** alongside the smallest net size — 10 cm and 6 cm, which are
exactly `bodiceblock`'s `chestEase` and `seatEase` defaults. Independent
confirmation of both.

## The book's own notes under the table

**1. 后背长** — 较短的后背长大约是平均身高为160~165cm(5英尺4英寸~5英尺5英寸)的人的
值，而较大的值则为较高人的值。腰长尺寸只受身高的影响，而与其他尺寸没有关系。腰长一样
时，腰围也有可能大小不同。因此，腰长的增长也并不影响其他尺寸的比例关系。

*Back length is governed by height alone and is independent of the other
measurements — which is why FreeSewing's `hpsToWaistBack` can be taken straight
from the wearer without disturbing anything else in the block.*

**2. 后背宽** — 在每个款式中都会使用到后背宽。在小号的尺寸中，背宽特别有用，因为这时就
不再遵守严格的档差了。要获得这些增大量，可以不必要在纸样原型中变化增加，也就说不需要
改变UP的位置(尽管**肩线可以加长**)。

*Small sizes stop obeying strict grading, and the fix is not to move UP —
though the shoulder line may be lengthened. Directly relevant to
`bodiceblock.md` Ambiguity 14: the book sanctions lengthening the shoulder line
as the small-size remedy, which is what the implemented adjustment does.*

## What this settles

Checked against the shipped designs on 2026-08-04:

| Column | Our rule | Verdict |
|---|---|---|
| 省道 (bust dart) | `60mm + (chest_mm−800)×0.125` | ✅ reproduces **all ten rows** exactly |
| 后领宽 (back neck width) | `chest/16 + 12.5` | ✅ reproduces all ten rows, including the `−` marks (e.g. 800→6.25 against the table's `6.5−`) |
| 袖窿深 (bust line depth) | `215 + (chest_mm−920)×0.125` | ✅ exact for sizes II–X (nine consecutive rows); 5 mm low at size I alone, where the table flattens out |
| 胸围/臀围 ease | 10 cm / 6 cm | ✅ confirmed by row I's `80 + 10` / `86 + 6` |
| XB 后背宽 | `backWidthPct` 39.13% → 36 cm at chest 92 | ✅ matches size IV's first value |
| CH 胸宽 | `chestWidthPct` 41.30% → 38 cm at chest 92 | ✅ matches size IV |

## What this unblocks

Implemented in `designs/bodiceblock` on 2026-08-04: 后窿门宽, O点, XB, CH and 省道
are now read off these columns by piecewise-linear interpolation in the net bust,
clamped to rows I and X. `designs/bodiceblock/tests/grading.test.mjs` pins the
result against an independent transcription of the table.

- ✅ **`bodiceblock` Ambiguity 4** (O point depth, was pinned at 30 mm). O点 is
  tabulated: 2, 2.5, 3, 3, 3.5, 3.5, 4, 4, 4.5, 4.5. Stepped, not linear — now
  interpolated. Row IV's 3 cm is exactly the value that was pinned.
- ✅ **后窿门宽**, the back UP addend, was a fixed 55 mm: tabulated as 5, 5, 5,
  5.5, 6, 6, 6.5, 7, 7, 7. Row IV's 5.5 cm is exactly the value that was pinned.
- ⚠ **`bodiceblock` Ambiguity 14** (`shoulderToShoulder` → S) — **still open.** SH
  is tabulated: 12−, 12, 12.5−, 12.5, 13−, 13, 13.5, 13.5, 14, 14.5. It is
  **not** a clean linear function of chest — the steps are 0.25, 0.25, 0.25,
  0.25, 0.25, 0.5, 0, 0.5, 0.5 — so implementing it means interpolating this
  column rather than fitting a formula. But it would not close the ambiguity:
  the proxy's fault is a ~12 mm level offset, not a missing grade, and taking S
  from the table would decouple the front shoulder from the wearer's own
  measurement. Recorded, not acted on.

## What it does *not* settle

The **袖窿 (大约值)** column is headed *approximate value* by the book itself.
Subtracting it from TA gives 12, 12, 12, 12, 12.5, 13, 12.5, 12, 12, 12 — mostly
12 cm, but not consistently, and from a column the author flags as approximate.
It is **not** grounds for changing `bodiceblock`'s `ARMHOLE_EASE` from the
125 mm midpoint of the prose's stated 12–13 cm: the difference is 5 mm, and p.19
declares 0.5 cm ignorable (如果有0.5cm出入，可以忽略不计).

One genuine inconsistency worth knowing: this table gives **TA = 31** at size IV,
while Ch.2's worked example uses 30 — which is size III's value. Both readings
sit inside the book's own tolerance, but the specs' oracles use 30.
