# bodiceblock — bodice block (衣片原型)

## Source

- Book: `英国经典服装纸样设计基础篇.pdf` (in `clothing_books`)
- Edition/authors: 纳塔莉·布雷 (Natalie Bray) 著; 王永进, 赵欲晓, 高凌 译; 中国纺织出版社
  (国际服装丛书 ②, "英国经典服装纸样设计 基础篇")
- Printed pages: 13–35 (第二章 衣片原型: 第一节 绘制原型 pp.13–18; 第二节 腰部形状
  分析 pp.19–20; 第三节 衣片原型结构的分析 pp.21–35, ends mid-discussion of §12
  腰部形状 at p.35). PDF pages 31–53 (1-based) = 0-based indices 30–52, offset +18
  (printed = PDF(1-based) − 18).
- Offset confirmed at three widely separated folios: PDF 1-based p.32 (0-based
  31) → printed 14 ✓; PDF 1-based p.41 (0-based 40) → printed 23 ✓; PDF 1-based
  p.53 (0-based 52) → printed 35 ✓. Constant across the chapter, matches
  `skirtblock.md`'s offset for the same book.
- INDEX.md row: bodiceblock

The 衣片原型 (bodice block) is one of the book's three primary blocks (衣片, 直袖,
标准裙 — printed p.7); nearly every fitted-bodice garment in the book derives
from it. This chapter's own worked example uses chest 92 cm, one grade above
the "Size III" (chest 88) table cited by the `pattern-making-principles` skill
from Ch.1 — see Ambiguity 13.

## Measurements

| Book term | CN | FreeSewing name | Worked example | Notes |
|---|---|---|---|---|
| Bust/chest | 胸围 (B) | `chest` | 92 cm | net body measurement, snug, fullest point (Bray p.6/11 convention) |
| Hip | 臀围 (H) | `seat` | 98 cm | same convention as `skirtblock.md`: measured ~20–25 cm below waist, at the fullest point |
| Waist | 腰围 (W) | `waist` | 70 cm | measured snug, like a waistband |
| Waist-to-hip depth | (臀围线位置) | `waistToSeat` | 22 cm | positions the block's hip reference line; same value/role as in `skirtblock.md` |
| Back waist length | 背长 (LW) | `hpsToWaistBack` (approx.) | 40 cm | book measures nape (~C7) to waist along CB; FreeSewing's HPS reference is the shoulder point, not the nape — same approximation already flagged in `designs/titan/drafting-instructions.md`. See Ambiguity 10 |
| Upper arm/bicep | 上臂围 (TA) | `biceps` | 30 cm | **drives the armhole calibration in §D.0** — the drafted armhole is solved to `TA + 12.5cm`. Was QC-only in the first draft of this spec; promoted to a real input on review (see §D.0) |

Two more book inputs have **no FreeSewing measurement equivalent** — the valid
list (`packages/config/src/measurements.mjs`) has no back-width or chest-width
entry. Both are modeled as **design options** (pct of chest) instead:

| Book term | CN | Worked example | Proposed option | Notes |
|---|---|---|---|---|
| Back width | 背宽 (XB) | 36 cm | `backWidthPct` (39.13% of chest) | independently measured on the body in the book; posture-sensitive (round vs erect shoulders shift XB/CH oppositely, p.24) — see Ambiguity 11 |
| Chest/bust width | 胸宽 (CH) | 38 cm | `chestWidthPct` (41.30% of chest) | same caveat |

One further book input is used **only as a quality-control check** in this
chapter, not to place any drafted point:

| Book term | CN | FreeSewing name | Worked example | Used for |
|---|---|---|---|---|
| Shoulder (seam) length | 肩宽 (S) | no exact equivalent (≈ `shoulderToShoulder`/2 − backNeckWidth) | 12.5 cm | checks drafted shoulder-line length ≥ S+1cm, ideally S+1.5–2cm (p.16) |

⚠ This mapping is **not** QC-only and **not** settled — it places the front SP
(§B.9) and it over-reads the book's S by ~12mm on real stock models. See
**Ambiguity 14**, which carries the measured evidence. Whatever it does, it must
never make a draft fail: emit its checks as non-fatal `store.log` notes.

## Options

| Option | Type | Default | Range | Source |
|---|---|---|---|---|
| `chestEase` | pct (of `chest`) | 10.87% (→10cm at chest 92) | not stated beyond the default | total bust ease "for general fit" (p.22); after shaping, the *finished* actual bust is only 6–7cm over net when there's no waist suppression (p.23) |
| `seatEase` | pct (of `seat`) | 6.12% (→6cm at seat 98) | not stated (occasionally trimmed at the side seam for other garment types, p.25) | hip ease, applied **entirely to the front** (p.25/32) |
| `waistEase` | pct (of `waist`) | 2.86% (→2cm/half at waist 70) | 2.14–4.29% (half-pattern addend 1.5–3cm, i.e. total pattern ease 3–6cm) | half-pattern waist-edge addend before dart shaping (p.19) |
| `waistFit` | bool | `true` | — | `true` = full §2 waist-dart fitting (CB/CF slant + side intake + darts, this spec's oracle); `false` = leave the §1 basic block's simple side-seam taper only (back −2cm / front −1.5cm at the waist point, no darts) |
| `backWidthPct` | pct (of `chest`) | 39.13% (→36cm at chest 92) | not stated | see Measurements table above |
| `chestWidthPct` | pct (of `chest`) | 41.30% (→38cm at chest 92) | not stated | see Measurements table above |
| `bustDartWidth` | pct (of `chest`) | 8.15% (→7.5cm at chest 92) | book's own size-table: 6.0cm at chest 80 → 10.5cm at chest 116, i.e. formula `60mm + (chest_mm−800)×0.125` | front shoulder/bust dart intake (p.17); cross-validated against the `pattern-making-principles` Ch.1 table (6cm@80 → 10.5cm@116) |

**Not an option:** an earlier draft of this spec exposed a
`shoulderSlopeMethod` (`guideline` vs `fixedDrop`) on the belief that §1 and
Fig 2-8 gave competing shoulder constructions. They do not — once the back
肩线 is placed correctly, Fig 2-8's "back 5cm / front 4.5cm below NP level" is
just a restatement of the two 肩线 guide depths (back 10+50=60 ✓, front
0+45=45 ✓). One construction, no option. See Ambiguity 3.

## Drafting steps

All lengths in **mm**. Two independent parts, each with its own local origin:
**back** origin = (CB, 上线/top-line), **front** origin = (CF, 上线). In both,
+x runs away from the center line (toward the side seam), +y runs downward
(toward the hem). `C`=chest, `St`=seat, `W`=waist, `LW`=hpsToWaistBack,
`WS`=waistToSeat, `XB`=chest×backWidthPct, `CH`=chest×chestWidthPct.

### 0. Shared structure-line depths (from top line, y=0)

Both panels share the same vertical structure other than the back/front NP
offset described below.

1. Bust/armhole-depth line (袖窿深线 = 胸围线): `yBust = 215 + (C_mm−920)×0.125`
   — worked: **215** at C=920. (Book's own proportional table: 210@880,
   215@920, 220@960, 225@1000 — formula fit to those four points.)
2. Waist line: `yWaist = LW` — worked: **400**.
3. Hip line: `yWaist + WS` — worked: **620** (=400+220).
4. Back-only: O point depth `yO_back = 30` (fixed, mid-size band; sizes I/II:
   20–25, V/VI: 35, VII/VIII: 40, IX/X: 45 — no formula available without
   Ch.1's Table 1-2, see Ambiguity 4). Back-width line: `yBackWidth = round(yBust/2 to nearest 10)` — book explicitly rounds 215→220 then halves — worked: **110**.
   **Back shoulder line (后肩线)**: `yShoulder_back = yO_back + 30` — worked:
   **60**.
5. Front-only: O point depth `yO_front = yO_back − 30` — worked: **0** (front O
   sits ~30mm above back O "略高3cm左右，大号尺寸中还要略大", p.16). Chest-width
   line: `yBust − 40` — worked: **175**. Front shoulder line (前肩线):
   `yO_front + 45` — worked: **45**.

> ⚠ **The two shoulder lines are measured from their own panel's O point, not
> from the top line.** p.15: "自上线向下11cm为后背宽线…**向下3cm为肩线**" — the
> 11 cm runs from 上线 but the 3 cm runs from O, exactly parallel to the front's
> "前肩线离O点4.5cm" (p.16). Measuring the back's 3 cm from 上线 instead collapses
> 肩线 onto O, yielding an 8.7° shoulder slope that fails the book's own QC rule.
> See Ambiguity 2 for the four independent checks that fix this.

### A. Back panel (origin = CB ∩ top-line)

1. **O** = (0, 30).
2. **Back neck width** `nb = C_mm/16 + 12.5` — worked: **70** (=920/16+12.5).
   Guide line: horizontal from O, length 70–80mm (drawn a little long).
   **NP** = (70, 30−20) = **(70, 10)** — the neck-width guide point raised
   20mm (p.15).
3. Back neckline: smooth curve NP(70,10) → O(0,30).
4. **Back-width point** = (XB/2, 110) = **(180, 110)** — vertical guide line
   through it, parallel to CB.
5. **UP** (armhole base) = (XB/2 + 55, yBust + `upDrop`) = **(235, 215)** before
   calibration. `upDrop` is solved in §D.0 and is **0 only if the wearer's
   biceps happens to match the drafted armhole**; the *x* is never changed.
   (Addend 55mm
   is the mid-size value; book's table runs 50mm smallest → 65mm largest —
   Ambiguity 4.)
6. **SP** (raw shoulder point) = (XB/2 + 20, yShoulder_back) = **(200, 60)** —
   on the 后肩线, per p.16 "在肩线上量取1/2背宽+2cm，并在端点标注肩点SP".
7. Shoulder guide line: straight NP(70,10) → SP(200,60). Length
   √(130²+50²) = **139.3mm**; the book's QC check wants ≥ S+10mm (135mm),
   ideally S+15–20mm (140–145mm) — 139.3mm sits at the ideal band's lower
   edge ✓. Slope = atan(50/130) = **21.0°**.

   If a wearer's `S` makes this fall short, the book's rule is to extend the
   shoulder outward **at unchanged SP height**: "无论加长或缩短肩宽，SP点都必须
   在原有高度上不变" (p.16). So the implementation adjusts SP's *x* along the
   y=`yShoulder_back` line, never its y.
8. **HP** (hip point) = (St_mm/4, 620) = **(245, 620)** — no seat ease on the
   back half (all ease goes to the front, p.25/32). Occasionally the book
   allows `St_mm/4 + (10–20)` as a variant (p.16) — default is the no-ease
   reading (matches the H/P-coincide figure detail, p.25).
9. Back armhole curve: SP → back-width point → UP. At the right angle formed
   by the back-width vertical guide (x=180) meeting the bust line (y=215),
   bisect the angle and mark a control point 30mm out along the bisector
   (**≈(201, 194)**); the curve from the back-width point down to UP is
   smoothed through this point, tangent to the bust line at UP.
10. Raw (unfitted) side seam: straight UP(235,215) → HP(245,620). At the
    waist (y=400), interpolate: `t=(400−215)/(620−215)=0.4568`,
    `x_raw = 235 + 10×0.4568 = 239.6`. §1's basic-block taper comes this
    point **in 20mm**: **(219.6, 400)** — this is the §1 (unfitted) side-seam
    waist point; curve UP→this point→HP.
11. Optional invisible shoulder dart (p.33, not normally drawn): centered at
    the NP–SP midpoint (135, 35), legs ±15–20mm along the shoulder line,
    depth 80–90mm down from the shoulder line, tip at 2/3 of the way from CB
    to the back-width point (x≈120). Used only to shorten the back shoulder
    seam to match the front; not part of the point oracle.

### B. Front panel (origin = CF ∩ top-line)

1. **O** = (0, 0).
2. **Front neck width** = same formula as back, **70mm**, measured along the
   front's own top-line-level guide from O (no extra vertical raise stated
   for the front, unlike the back's +20mm). **NP** = (70, 0).
3. Front shoulder guide depth (前肩线, a horizontal reference used only to
   fix the raw shoulder-slope direction): `yO_front + 45` = **45mm**
   (large sizes: 40mm). Front neckline-depth line (前领口深线, CF's own neck
   drop): `yO_front + 75` = **75mm** (large sizes: 80–85mm).
4. Front neckline: smooth curve from NP to the front-neck-depth point on CF
   (0, 75).
5. Raw/preliminary shoulder-slope ray: from CF, along the y=45 guide line,
   mark a point 165mm out; draw a ray from NP **through** that point,
   extended to a preliminary length of 200–220mm. This ray's direction is
   the front shoulder slope (exact angle depends on the guide-point
   construction — Ambiguity 2).
6. **Chest-width point** (guide) = (CH/2, 175) = **(190, 175)**.
7. **Bust/shoulder dart apex** = (CH/4, yBust+20) = **(95, 235)** (1/4 chest
   width from CF, 20mm below the bust line).
8. Dart legs: from the point where a vertical line through the apex meets
   the raw shoulder-slope ray, offset 20mm toward CF along that ray to get
   the inner-leg shoulder point; the outer-leg shoulder point sits
   `bustDartWidth` (default 75mm) further out along the same ray. Both legs
   run straight down to the apex.
9. **SP** (final) = point on the shoulder-slope ray at distance
   `S + bustDartWidth` = 125+75 = **200mm** from NP.
10. **CHP** (chest-width point, final — after compensating for the dart's
    bite out of the chest-width line): book states two figures for the same
    point (19mm "= half chest width" vs 21mm "as drawn in Fig 2-2") — see
    Ambiguity 1; this spec uses **210mm** from CF (the figure-drawn value)
    for the SP–CHP–UP curve. Straight line SP → CHP; vertical guide line
    from CHP down to the bust line.
11. **UP** = `((C_mm/2+50) − backUP_x, yBust + upDrop)` = (510−235, 215+drop) =
    **(275, 215)** before calibration. (Book's own arithmetic:
    half-chest-plus-ease-basis 510mm minus the back's UP x (235mm) gives the
    front's UP x directly — p.17.) The front and back UP **must share the same
    `upDrop`** — they are one point once the side seam is sewn.
12. Front armhole curve: SP → CHP, control point 10mm **inward** at the
    SP–CHP midpoint; CHP → UP, control point 15mm out along the bisector of
    the right angle at (CHP-vertical-guide) ∩ (bust line); the curve dips
    below the bust line before reaching UP, then meets UP tangent to the
    bust line.

    ⚠ **This dip is not cosmetic — it lengthens the armhole, and §D.0's solve
    is only valid with it in place.** The book is explicit (p.17):

    > 在前SP点与CHP点连接直线的一半处，向内作一条垂直辅助线，长为1cm，用曲线通过
    > 该点圆顺连接SP点与CHP点，下端应圆顺向外画弧，并且曲线应通过CHP点与胸围线相交
    > 垂直角处的辅助点，该点为直角平分角处线段端点，长度为1.5cm。最后要做到：**袖窿
    > 线在到达UP点前应当在胸围线处略微向下挖，然后再与UP点圆顺相交。**

    So the curve must satisfy all four conditions: pass through the 10mm
    inward auxiliary at the SP–CHP midpoint; pass through the 15mm
    bisector auxiliary at the CHP-vertical ∩ bust-line right angle; dig
    below the bust line before UP; arrive at UP tangent to horizontal.
13. **HP** = (St_mm/4 + 30, 620) = **(275, 620)** (1/4 seat + 30mm; book
    states a 25–30mm range, p.17 — this spec uses the round 30mm figure that
    matches both §4's overview and the Fig 2-2 labels).
14. Raw side seam: straight UP(275,215) → HP(275,620) — vertical, since both
    x equal 275 in this worked example. At waist(400), §1's basic taper
    comes this point **in 15mm**: **(260, 400)**.

### C. Waist-dart fitting (`waistFit: true`, §2, p.19–20)

Only meaningful once both panels' §1 (unfitted) waist points exist.

1. **Target half-pattern waist** (each panel measured to its own center
   line) = `W_mm/2 + waistEase-addend` = 350+20 = **370mm total across both
   panels** (this is a combined-both-panels figure per the book's own worked
   arithmetic, p.19: "35+2=37cm").
2. **Natural half-pattern waist** (sum of both panels' §1-tapered waist
   points, i.e. distance from each panel's own center line to its §1 side
   point) = back 219.6 + front 260.0 = **479.6mm**.
3. **WR** (total further reduction needed) = 479.6−370 = **109.6mm ≈ 110mm**
   (book's own illustrative split, "总收腰量为11cm，后片5cm前片6cm", p.19–20 —
   this spec treats that illustration as this exact worked example; see
   Ambiguity 13/cross-check below).
4. Split WR between panels **in proportion to each panel's §1-tapered
   width**: back share = 219.6/479.6×110 = **50.4mm ≈ 50mm**; front share =
   260.0/479.6×110 = **59.6mm ≈ 60mm** (book: back 50mm, front 60mm — exact
   match).
5. **CB slant**: CB moves in 20mm at the waist (from x=0 to x=20), tapering
   back to x=0 at the back-width line above; below the waist, assumed
   (not stated — Ambiguity 7) to return to x=0 by the hip line.
6. **CF slant**: same construction, CF moves in 10mm at the waist.
7. **Side-seam additional intake**: back side point comes in a further 10mm
   (on top of §1's 20mm), front a further 10mm (on top of §1's 15mm) — final
   side-seam-at-waist: back **(209.6, 400)**, front **(250, 400)**.
8. **Waist dart intake** = panel's WR share − CB/CF-slant − side-additional:
   back = 50−20−10 = **20mm** (book states exactly 20mm, "后腰省就为2cm" — exact
   match); front = 60−10−10 = **40mm** (book states "3cm或更大" — consistent,
   not an exact match, see Ambiguity 5).
9. **Back dart centerline** = `XB/4` from CB = **90mm**, parallel to CB;
   split ±10mm (legs at 80 and 100). **Front dart centerline** = `CH/4` from
   CF = **95mm**, parallel to CF; split ±20mm (legs at 75 and 115).
10. **Dart length**: book gives a general rule, not size-92-specific — 130–
    150mm above the waist line, 120–130mm below (p.26). This spec uses
    **140mm above / 125mm below** as the oracle values (Ambiguity 5). Front
    dart tip must fall below the "true bust line" (drafted bust line +40mm
    for adults / +20mm for youthful figures, p.24) by 20–30mm — cross-check:
    215+40+25=280, i.e. 120mm above the waist, close to but not exactly the
    general 130–150mm rule (Ambiguity 5).
11. Reconnect a lower/"true" waist line: both panels' side-seam waist point
    drops 5mm; CF drops 10mm (large sizes: side 10mm, CF 20–25mm). Do this
    **after** the darts are finalized; the two panels' side-seam edges must
    end up equal in length (p.20).

### D.0 Armhole calibration — solving `upDrop` (p.19)

**Drafting the points above and stopping does not produce the book's block.**
Every point in §A/§B has been verified against the book's text and Fig 2-2, and
the resulting armhole still measures ~375–385mm against the book's own stated
420–430mm. That is not a transcription error on either side: the book does not
treat the drafted armhole as final. p.19 gives the missing step —

> 总的袖窿尺寸应当比上臂(TA)尺寸略大12~13cm … 用皮尺沿着前后袖窿弧线弯度进行测量 …
> 为了增大或减小袖窿尺寸，通常采用的办法是按要求提高或降低UP点的位置，比如每降低UP点
> 0.5~1cm时，袖窿尺寸就会增大1.5cm … 要求通过新点，重新绘制袖窿线，并且应重新测量和检查 …
> 如果有0.5cm出入，可以忽略不计

Bray's workflow is **draft → tape-measure the armhole → move UP → redraw →
re-measure**. The 21.5cm armhole-depth line is a *starting* value, not a result;
0.5cm of residual error is declared ignorable. We close that loop numerically.

**Definition.** `upDrop` (mm, may be negative) shifts both panels' UP point
**downward only** — `UP.y = yBust + upDrop`, `UP.x` unchanged. The bust line
itself does **not** move, so the block's finished bust girth and `chestEase` are
unaffected; only the underarm gets deeper and the side seam correspondingly
shorter. This is exactly what the book's remedy does.

**Target.** `armholeTarget = biceps_mm + 125` (midpoint of the book's
`TA + 120–130mm` band). Worked example: 300 + 125 = **425mm**.

**Measured quantity.** `L(upDrop)` = back armhole curve length (SP → back-width
point → 3mm-bisector point → UP) **plus** front armhole curve length (SP → 10mm
midpoint auxiliary → CHP → 15mm bisector auxiliary → dip → UP), both measured
along the *curves* (`Path.length()`), matching the book's 皮尺 instruction.
§B.12's dip must be implemented before solving — solving around a missing
feature would bake the omission into `upDrop`.

**Solve.** Find `upDrop` such that `|L(upDrop) − armholeTarget| ≤ 1mm`
(comfortably inside the book's 5mm ignorable tolerance). `L` is smooth and
strictly increasing in `upDrop`, so bisection on the bracket below is sufficient
— no need for anything cleverer.

- Bracket: `upDrop ∈ [−30, +60]` mm. The book's own rate (+15mm armhole per
  5–10mm of drop) puts a realistic solution at roughly +20 to +30mm for a
  standard figure, so this bracket is generous on both sides.
- Cap iterations at 40; bisection over a 90mm bracket reaches sub-0.01mm.
- If the solution lies outside the bracket, **clamp** to the nearer bound, draft
  anyway, and emit a `store.log.warn` naming the achieved armhole vs the target.
  A block that drafts with a warning beats a block that throws.

**Where it runs.** All of `L`'s inputs are pure functions of measurements and
options, so the solve is a **pre-pass in `shared.mjs`**, not something either
panel discovers mid-draft. Back and front must consume the same solved value —
they are one point once the side seam is sewn. Compute it once, store it on
`store`, read it from both parts.

**Ordering.** `upDrop` is solved *before* §A.10 and §B.14 draw the raw side
seams, since those start at UP.

**What this does not change.** §A.1–A.9, §B.1–B.13, and all of §C are untouched:
the same construction, the same numbers. `upDrop` moves exactly one point.

**Independent corroboration from the sleeve.** `sleeveblock.md` drafts Bray's
straight sleeve from `biceps` alone and lands a cap arc of ≈455mm, and the book
wants the cap arc to exceed the armhole by 20–25mm of sleevecap ease. Against
the *uncalibrated* armhole (~375mm) that surplus is 80mm — nonsense. Against the
calibrated 425mm it is 30mm, within a few mm of the book's stated band. Two
independently-extracted chapters agreeing only after §D.0 is applied is the
strongest evidence available that the calibration loop, not the point geometry,
was the missing piece.

### D. Finishing / QC

- Armhole tape-measure check: total front+back armhole curve length should
  be `TA_mm + 120–130mm` — worked: 300+125=**425mm** (book: 420–430mm).
  With §D.0 in place this is **satisfied by construction**; keep it as a
  regression assertion, not a warning, and additionally assert that the
  *uncalibrated* (`upDrop = 0`) armhole is the ~375–385mm shortfall the
  calibration exists to close. That second assertion is what distinguishes
  "the solver is doing real work" from "the solver is masking a geometry bug",
  and it must fail loudly if someone later changes §A/§B geometry.
- Shoulder length check: NP–SP straight distance should be ≥ `S_mm+10mm`,
  ideally `S_mm+15..20mm`.
- Front/back balance check: front NP (y=0) sits **10mm** above back NP
  (y=10), so front-NP-to-waist (400) exceeds back-NP-to-waist (390) by
  10mm — matches the book's own "ideal balance, front NP 1cm higher than
  back NP" rule (p.30).
- Shoulder-seam closure: back NP–SP (139.3mm) vs the front's *net* shoulder
  after the dart is closed (`S + bustDartWidth − bustDartWidth` = 200−75 =
  125mm). The 14.3mm surplus on the back is the ease the book absorbs via
  the invisible back shoulder dart / cutting the back to match the front
  (p.33) — a useful implementation check, since a back surplus outside
  ~10–20mm means the shoulder line is misplaced.

## Worked example (oracle) — chest 92, seat 98, waist 70, LW 40, WS 22, XB 36, CH 38, S 12.5, TA 30 (cm)

| # | Point/dimension | cm (book arithmetic) | mm (oracle) |
|---|---|---|---|
| 1 | Bust/armhole-depth line depth | 21.5 | 215 |
| 2 | Waist line depth | 40 | 400 |
| 3 | Hip line depth | 62 | 620 |
| 4 | Back O depth | 3 | 30 |
| 5 | Back-width line depth | 11 | 110 |
| 5a | Back shoulder line (后肩线) depth | 6 (=3+3) | 60 |
| 5b | Back NP–SP length / slope | 13.93 / 21.0° | 139.3 |
| 6 | Back neck width (=front neck width) | 7 | 70 |
| 7 | Back NP (x,y) | (7, 1) | (70, 10) |
| 8 | Back-width point x | 18 | 180 |
| 9 | Back UP (x,y) | (23.5, 21.5) | (235, 215) |
| 10 | Back SP (raw, x,y) | (20, 6) | (200, 60) |
| 11 | Back HP (x,y) | (24.5, 62) | (245, 620) |
| 12 | Back §1 waist point x (raw 23.96, −2) | 21.96 | 219.6 |
| 13 | Front O depth (relative to back O) | 0 (=3−3) | 0 |
| 14 | Front shoulder-guide depth | 4.5 | 45 |
| 15 | Front neck-depth line | 7.5 | 75 |
| 16 | Chest-width line depth | 17.5 | 175 |
| 17 | Chest-width point x | 19 | 190 |
| 18 | Bust-dart apex (x,y) | (9.5, 23.5) | (95, 235) |
| 19 | Bust-dart width (shoulder end) | 7.5 | 75 |
| 20 | Front SP distance from NP | 20 | 200 |
| 21 | CHP x (figure-drawn reading, Ambiguity 1) | 21 | 210 |
| 22 | Front UP (x,y) | (27.5, 21.5) | (275, 215) |
| 23 | Front HP (x,y) | (27.5, 62) | (275, 620) |
| 24 | Front §1 waist point x (raw 27.5, −1.5) | 26.0 | 260.0 |
| 25 | Target half-pattern waist (both panels) | 37 | 370 |
| 26 | Natural half-pattern waist (§1-tapered, both) | 47.96 | 479.6 |
| 27 | WR total | 11.0 (≈10.96) | 110 (≈109.6) |
| 28 | WR back share / front share | 5.0 / 6.0 | 50 / 60 |
| 29 | Back CB-slant / side-additional / dart | 2 / 1 / 2 | 20 / 10 / 20 |
| 30 | Front CF-slant / side-additional / dart | 1 / 1 / 4 | 10 / 10 / 40 |
| 31 | Back dart centerline (legs) | 9 (8–10) | 90 (80–100) |
| 32 | Front dart centerline (legs) | 9.5 (7.5–11.5) | 95 (75–115) |
| 33 | Back final side-waist x | 20.96 | 209.6 |
| 34 | Front final side-waist x | 25.0 | 250.0 |
| 35 | Armhole size, **calibrated** (§D.0) | 42.5 ±0.1 | 425 ±1 |
| 36 | Armhole size, uncalibrated (`upDrop`=0) | ~37.5–38.5 | 375–385 (record actual) |
| 37 | Solved `upDrop` | ~2–3 | 20–30 (record actual) |

Rows 36–37 are **bracket assertions, not exact oracles** — unlike every other
row they are not read off the book, they are the measured consequence of the
book's own construction. Record the actual solved figures here once the
implementation runs, so any later geometry change that shifts them is caught.

Checks against the book's own statements: back WR-dart 20mm matches "后腰省
2cm" exactly (row 30 back / row 8 of step-C list); WR split 50/60mm matches
"后片5cm前片6cm" exactly; back neck width 70mm and dart width 75mm both
independently reproduce the book's own Ch.1-anchored size-step formulas
(cross-validated via `pattern-making-principles`: dart 60mm@800→105mm@1160,
giving 75mm@920 ✓; armhole depth 210mm@880→225mm@1000, giving 215mm@920 ✓).
Front dart 40mm is *consistent with* (not an exact restatement of) "3cm或
更大" — see Ambiguity 5.

## Construction notes

- The block is drafted **net** (no seam allowance); SA added at cutting
  (Bray p.6, consistent with `skirtblock.md`).
- Hip ease (60mm) sits entirely on the front; back HP = exactly 1/4 seat
  (p.25/32), matching this book's skirt-block precedent for the same 60mm
  hip-ease convention.
- The "true bust line" (real fullest-bust level) sits 40mm below the drafted
  bust/armhole-depth line for adult figures, 20mm for youthful figures
  (p.24) — used only to sanity-check dart-tip depth, not to place any
  drafted point.
- Fabric grain: warp should run vertical (parallel to CB/CF), weft
  horizontal (parallel to the bust line) when the piece hangs on the body
  or stand (p.31).
- The finished, worn silhouette also depends on an "衣片均衡" (balance) check
  — front NP sits above back NP by (nominally) 20mm; this changes with
  posture (more upright → bigger gap/longer front; more stooped → smaller
  gap/longer back, p.30).

## Ambiguities

1. **CHP x-position**: p.16 states the distance from CF to CHP is "19cm,
   which is the sum with the dart-shortfall width", then in the same
   sentence says the figure (Fig 2-2) shows **21cm**. 19mm×10=190 equals
   exactly half the chest width (CH/2), suggesting 19 is the *semantic*
   half-chest-width guide value while 21 is CHP *after* compensating for
   the dart's bite into the chest-width line. **Chosen: 210mm** (figure
   value) for the SP–CHP–UP curve. **Confirmed on review:** 图2-2 dimensions
   the 胸宽线 as a chain `CHP | 2 | 19` running back from CF — 19 cm is the
   half-chest-width guide (CH/2 = 190 ✓) and CHP sits 2 cm beyond it, so
   CHP = 210 mm from CF. The two figures are a guide point and the final
   point, not a contradiction. No longer open.
2. **Back shoulder-line depth — RESOLVED on review; this was a real error in
   the first draft of this spec.** The back 肩线 was placed at y=30 (3 cm
   below the *top line*, collapsing it onto O). p.15 reads "自上线向下11cm为
   后背宽线…向下3cm为肩线": the 11 cm runs from 上线, but the 3 cm runs from
   **O**, exactly as the front's 前肩线 is defined "离O点4.5cm" (p.16). Correct
   depth is **y = 60**. Four independent checks agree and all four fail at
   y=30:

   | Check | y=30 | y=60 |
   |---|---|---|
   | Shoulder slope | 8.7° | **21.0°** ✓ |
   | NP–SP vs QC `S+15…20mm` (140–145) | 131.5 — fails even `S+10` | **139.3** ✓ |
   | Fig 2-8 back drop = 50 mm | 20 ✗ | **50** ✓ exact |
   | Back-vs-front shoulder surplus | 6.5 mm | **14.3 mm** ✓ = invisible-dart ease |

   The front ray's angle remains un-stated numerically in the text but is
   fully determined by its construction (NP through the 165mm point on the
   y=45 guide) → 25.3°; no ambiguity remains, only an un-restated number.
3. **"Two shoulder-slope methods" — RESOLVED: there is only one.** §1's
   construction and Fig 2-8's "fixed drop" (back 50mm, front 45mm below NP
   level, p.28) were read as competing alternatives only because the back
   肩线 was mislocated. With 肩线 at y=60, Fig 2-8 is simply restating the two
   guide depths relative to each panel's NP: back 10+50=60 ✓, front 0+45=45 ✓.
   The `shoulderSlopeMethod` option has been removed accordingly.
4. **Missing Ch.1 size-grading table**: several constants are given only as
   size-band steps for the mid-size (chest 92, Bray's "Size IV" in a
   4cm-step 80–116 sequence) with vague "large size" alternates, not a
   continuous formula: back O-point depth (30mm; bands 20–25/30/35/40/45mm
   across sizes I–X), back UP addend (55mm; bands 50mm smallest → 65mm
   largest), front-O offset from back-O (30mm, "略高3cm左右，大号尺寸中还要略
   大"), front shoulder-guide depth (45mm vs 40mm large), front neck-depth
   (75mm vs 80–85mm large). Table 1-1/1-2 referenced for these lives in
   Ch.1 (printed pp.1–12), outside this extraction's page range. **Chosen:**
   fixed at the chest-92 mid-size value for all of these, matching
   `skirtblock.md`'s precedent of fixing structure-line constants at the
   average-figure value.
5. **Front waist-dart intake and dart length are not book-pinned for this
   exact worked example.** Front dart = 40mm is *derived* from this spec's
   own WR bookkeeping (which independently reproduces the book's *stated*
   back dart of 20mm and the WR 50/60mm split exactly), but the book's own
   prose for the front dart only says "3cm或更大" (30mm or more) — consistent
   with 40mm but not a restatement of it. Separately, dart *length* (130–
   150mm above waist / 120–130mm below, p.26) is a general rule not tied to
   chest 92; the "true bust line" cross-check (p.24) predicts a front
   dart-tip depth about 10–20mm shallower than that general rule. Both
   readings are reported; the general rule's midpoint (140mm/125mm) is used
   for the oracle.
6. **Back "invisible" shoulder dart** (15–20mm each side of the NP–SP
   midpoint, depth 80–90mm, p.33): the book explicitly says this dart is
   normally **not drawn** — the back shoulder seam is simply cut to match
   the front's finished shoulder length. Treated here as a construction
   note, not a drafted point; flag in case an implementation wants to
   expose it as an actual dart (e.g. for a princess-seam variant).
7. **CB/CF slant lines below the waist**: the book states the slant
   converges back to the vertical CB/CF line *above* the waist (at the
   back-width/chest-width line) but never states what happens *below* the
   waist toward the hip line. **Assumed**: the slant returns to x=0 by the
   hip line, forming a symmetric "wasp" taper — not confirmed by the text.
8. **Front HP addend**: given as "2.5–3cm" in the front-panel-specific
   paragraph (p.17) but flatly "+3cm" in the §4 overview (p.25) and in the
   Fig 2-2/2-3 labels. **Chosen: 30mm**, matching the figure and the §4
   overview, and consistent with this worked example's UP/HP coincidence
   (front UP and HP both land at x=275mm — see Construction notes).
9. **Back HP occasionally uses an alternate ease formula**: p.16 mentions
   "有时用公式1/4臀围+(1~2cm)计算" for the back HP, contradicting §4's explicit
   default (no ease on the back, all 60mm on the front, p.25). **Chosen:
   the no-ease default** — it reproduces the figure's H/P-coincide detail
   exactly (both land at x=245mm... front HP 275mm from CF vs total-width
   sums, see Construction notes) and matches the book's own explicit
   overview statement.
10. **`hpsToWaistBack` for 背长**: the book measures nape-to-waist along CB;
    FreeSewing's `hpsToWaistBack` is defined from the shoulder point (HPS),
    a different anatomical reference. This approximation is already used
    project-wide (`designs/titan/drafting-instructions.md` row 13) — carried
    forward here without a better alternative in the current measurement
    list.
11. **No FreeSewing measurement for 背宽/胸宽**: modeled as `backWidthPct` /
    `chestWidthPct` (both pct-of-chest design options) rather than
    independent inputs. The book itself notes these two vary independently
    with *posture* (round-shouldered vs erect figures shift backWidth down
    and chestWidth up, or vice versa, p.24) — collapsing them to a fixed
    fraction of chest loses this degree of freedom. If a future design
    wants posture-driven fit, these should become independent options
    rather than a single derived pct.
12. **Neither S nor TA is QC-only — an earlier draft of this spec called both
    QC-only and was wrong twice over.** §B.9 places the front SP at
    `S + bustDartWidth` from NP, so S is load-bearing on the front. And p.19
    makes TA the *driver* of the UP point via the draft-measure-adjust loop
    (§D.0); filing it as a check is what left the drafted armhole ~5cm short of
    the book's own figure. The distinction matters: a check the book tells you
    how to act on is not a check, it is an input.

14. **⚠ OPEN — the `shoulderToShoulder` → S mapping over-reads by ~12mm on real
    models, and the resulting shoulder adjustment fires on 15 of 20 FreeSewing
    stock sizes.** `S = shoulderToShoulder/2 − backNeckWidth` reproduces the
    book's S=125mm only at `shoulderToShoulder = 390mm`, which is *not* a real
    FreeSewing value: the stock model nearest the book's chest (cisFemaleAdult34,
    chest 925) carries 415mm, giving S = 137.2mm. The oracle's 390 is a synthetic
    value back-solved to match the book, not a measurement.

    The consequence is structural, not cosmetic. The front SP is placed from S
    (measurement-derived) while the back SP comes out of the `backWidthPct`
    construction (proportional), and the book reconciles them with a designed
    surplus: back seam 139.3 − S 125 = **14.3mm**, the ease the back shoulder
    absorbs over the shoulder blade.

    **The mechanism is a level offset, not a grading mismatch.** The back
    construction is faithful — it drafts 140.0mm at chest 925 against the book's
    139.3mm at 920. Only S is inflated, by ~12mm, and that alone consumes almost
    the whole designed surplus:

        surplus = 140.0 − 137.2 = 2.8mm, against a 10mm floor → the check fires.

    A secondary grading difference modulates it — the drafted seam grows ~7.2mm
    per size step while the proxy S grows only ~4.6mm — which makes the shortfall
    worse at small sizes and better at large ones, and is why the largest sizes
    escape. But the 12mm offset is what does the damage.

    (An earlier version of this note explained it as a grading-rate mismatch,
    comparing `shoulderToShoulder`'s ~16mm per step against the back width's
    ~10mm. Those are not like-for-like — s2s must be halved before it is
    comparable — and that reading pointed at the wrong cause.)

    Measured across the stock range (back seam vs the `S + 10` floor, and the
    resulting front/back surplus):

    | model | chest | s2s | S | back seam | surplus | upDrop | armhole vs target |
    |---|---|---|---|---|---|---|---|
    | cisFemale 28 | 762 | 367 | 123.4 | 133.4 (floor) | 10.0 | 3.8 | 348 / 347 |
    | cisFemale 34 | 925 | 415 | 137.2 | 147.2 (floor) | 10.0 | 6.6 | 394 / 395 |
    | cisFemale 40 | 1088 | 463 | 151.0 | 161.0 (floor) | 10.0 | 10.8 | 442 / 443 |
    | cisFemale 42 | 1143 | 478 | 155.1 | 167.3 (natural) | 12.3 | 12.2 | 459 / 459 |
    | cisFemale 46 | 1251 | 510 | 164.3 | 181.1 (natural) | 16.8 | 15.0 | 490 / 490 |
    | cisMale 32 | 842 | 404 | 136.9 | 146.9 (floor) | 10.0 | 26.3 | 421 / 420 |
    | cisMale 50 | 1316 | 542 | 176.3 | 189.4 (natural) | 13.2 | 55.8 | 587 / 586 |

    (Table measured *before* the fix below, since it is the evidence for the
    diagnosis.) Only the largest sizes — cisFemale 42/44/46 and cisMale 48/50 —
    draft their shoulder naturally; on the other 15 `backWidthPct` contributes
    nothing to the shoulder and the surplus was pinned at the book's bare
    *minimum* (10mm) rather than its stated ideal (15–20mm). The block had
    quietly stopped being proportional at the shoulder without saying so.

    **What would settle it** is Ch.1's Table 1-2 — the grading table that gives
    S per size — which is outside the extracted page range (see Ambiguity 4).
    Bray measures both S and XB on the body, so a measurement-driven shoulder is
    not unfaithful in principle; the problem is that our *proxy* for S is on a
    different scale from the book's, and we have no page that pins the true one.

    **Interim position, implemented** (not a resolution): keep the adjustment,
    since removing it makes the back shoulder *shorter* than the closed front
    shoulder on small sizes — a genuinely broken pattern, which the book's floor
    exists to prevent. But the trigger stays at the book's floor (`< S + 10`)
    while the *destination* becomes the ideal band's midpoint `S + 17.5`, and
    firing emits a `store.log.info` naming the drafted length, the target, and
    the fact that `backWidthPct` is not controlling that draft's shoulder. After
    the change the surplus is a consistent 17.5mm where it fires and 10.6–16.8mm
    where it does not — everywhere inside the book's stated band, instead of
    sitting on its floor. Revisit when Ch.1 is extracted.

    The book's own worked size is unaffected: it drafts 139.28mm against a
    135mm floor, so the branch never runs there and oracle rows 1–37 are
    bit-identical across this change.

    Note also that the armhole calibration is unaffected and holds across the
    whole range (last column): whatever the shoulder does, §D.0 re-solves the
    underarm to the wearer's biceps.
13. **This chapter's own "average size" (chest 92, Ch.1's Bray Size IV in
    the 80–116 four-size-step run) differs from the Ch.1 "Size III" table
    (chest 88) cited by the `pattern-making-principles` skill.** Both are
    valid reference points on the same proportional system, one size-step
    apart; this spec uses Ch.2's own explicitly-stated chest-92 table as
    the authoritative worked example (it is the table printed alongside
    the construction we extracted), cross-validated against the Ch.1-Size-
    III-anchored formulas for neck width, armhole depth and dart width,
    all of which reproduce the chest-92 values within the stated per-step
    increments (see Worked example checks).

## Review

Principles gate (spec review, 2026-08-03) against `pattern-making-principles`:

- Inputs (chest, seat, waist, back length + two posture-sensitive widths)
  match Bray's own model (p.9/11) — hip/waist/bust all "net body measurement,
  no ease" (p.6/11) ✓.
- Sizing runs on the book's own 4cm bust-step grade (80–116); chest-92 =
  Size IV, one step above the Ch.1 "Size III" (chest 88) table — both are
  valid, self-consistent points on the same system (Ambiguity 13) ✓.
- Front-length > back-length: front NP sits 20mm above (shallower than)
  back NP, giving front-NP-to-waist (400mm) exceeding back-NP-to-waist
  (390mm) by exactly 10mm, matching the book's own "ideal balance, front
  1cm longer" statement (p.30) and the general balance-paper principle
  (front-over-back surplus reserved as the bust dart) ✓.
- Single front shoulder/bust dart as "the modern baseline" (principles
  note 2) — this chapter's front dart (75mm at chest 92) reproduces the
  cited Ch.1 Table 1-2 range (60mm@chest-80 → 105mm@chest-116) exactly via
  linear interpolation ✓.
- Hip ease 60mm, entirely on the front — matches the skirt-block principle
  citation (Bray p.142/146) for the same book and the same 60mm figure ✓.
- Armhole-depth formula (210mm@880 → 225mm@1000) reproduces the cited Ch.1
  Size-III armhole depth (210mm@chest-880) exactly ✓.

**Diagram verification pass (Fable, 2026-08-03)** — 图2-2 (printed p.15) read
directly at 260 dpi against the extracted geometry:

- Back 肩线 depth **corrected 30 → 60 mm** (Ambiguity 2). This was a real
  error: it would have shipped a bodice with an 8.7° shoulder slope.
- `shoulderSlopeMethod` option **removed** — the two constructions agree once
  the 肩線 is right (Ambiguity 3).
- CHP = 210 mm **confirmed** from the figure's `CHP | 2 | 19` chain
  (Ambiguity 1 closed).
- Front UP = 275 mm **independently confirmed** by the figure's
  `1/4 总胸宽 + 2` route (255+20), which closes against the back's
  `XB/2 + 5.5` = 235 to give 510 = `C/2 + 50` exactly.
- §1 waist tapers (back 2 cm / front 1.5 cm), HP addends (`1/4臀围` back,
  `1/4臀围+3` front), LW 40 and WS 22 all **match the figure's labels**.

Result: **pass after correction** — no principle violations remain, and the
point oracle above reflects the corrected shoulder line. The residual open
items (Ambiguities 4–13) are grading-table gaps and stated-range choices, none
of which block implementation at the worked size.
