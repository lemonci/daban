# sleeveblock — Straight sleeve block (直袖原型)

## Source

- Book: `英国经典服装纸样设计基础篇.pdf` (in `clothing_books`)
- Edition/authors: 纳塔莉·布雷 (Natalie Bray) 著; 王永进, 赵欲晓, 高凌 译; 中国纺织出版社
  (国际服装丛书 ②, "英国经典服装纸样设计 基础篇")
- Printed pages: 92–100 (第七章 袖子 — chapter title page p.92 carries no folio
  number; 第一节 袖子的基础知识 pp.93–94 fundamentals/measurements; 第二节
  袖子的样板设计, 一、直袖样板的绘制方法 pp.95–96 straight-sleeve construction,
  二/三 紧身袖·半合体袖 pp.96–98 fitted variants; 第三节 绱袖的位置及对位点
  pp.99–100 set-in position and notches). PDF pages 110–118, offset +18
  (printed = PDF − 18; confirmed at printed 88/93/94/95/99/102 against PDF
  indices 105/110/111/112/116/119). Armhole cross-reference: bodice block,
  第二章 衣片原型, printed pp.14, 16, 18 (PDF pages 32, 34, 36). High-cap
  variant: 附录二 袖子的调整, printed pp.203–204 (PDF pages 220–221).
- INDEX.md row: sleeveblock

The 直袖 (straight sleeve) is one of the book's three primary blocks (衣片, 直袖,
标准裙 — printed p.7) alongside the shipped `skirtblock`. It is deliberately
loose: "直袖不沿手臂的自然形态弯曲... 它造型宽松,穿着舒适" (p.93) — unlike the
fitted/semi-fitted variants (弯袖) built from the same cap in the same chapter.

## Measurements

| Book term | CN | FreeSewing name | Worked example | Notes |
|---|---|---|---|---|
| Arm (bicep) circumference | 臂围 | `biceps` | 30 cm | horizontal, fullest part of the upper arm, ~10 cm below the shoulder, just below the armpit; snug, not tight (p.94) |
| Sleeve length | 袖长 | `shoulderToWrist` | 60 cm | from the shoulder point, over a bent elbow, to below the wrist bone above the little finger; elbow must be bent to capture the maximum length (p.94) |
| Elbow height | 袖肘高 | `shoulderToElbow` | 32 cm | same path as sleeve length, measured only to the elbow (p.94) |
| Elbow circumference | 肘围 | *(none — see Ambiguity 1)* | 31 cm | arm bent, max circumference at the elbow; used only by the fitted/semi-fitted variants, not the straight sleeve itself (p.94) |
| Wrist circumference | 腕围 | `wrist` | 16.5 cm | direct snug circumference; used only by the fitted/semi-fitted variants, not the straight sleeve itself (p.94) |

The straight sleeve (直袖) — this design's v1 scope — is drafted from only the
first three rows (`biceps`, `shoulderToWrist`, `shoulderToElbow`). `wrist` and
elbow circumference feed only the 紧身袖/半合体袖 (fitted/semi-fitted) variants
described under Options; elbow circumference has no FreeSewing equivalent at
all (Ambiguity 1).

## Armhole dependency

**The straight sleeve is not drafted from the armhole directly** — its rectangle
and cap come from `biceps`/`shoulderToWrist`/`shoulderToElbow` alone (第二节,
p.94–96). The bodice armhole enters as a **check and adjustment step**, applied
after both the bodice and the sleeve cap have been drafted (p.95, "见第二章"; p.99).

**Quantities consumed** — the book targets the **total** armhole circumference
(front armhole curve length + back armhole curve length, summed), not separate
front-AH/back-AH numbers (see Ambiguity 7):

- **Total bodice armhole (袖窿围/袖窿大)**: target = `biceps` + 12–13 cm. Worked:
  30 + 12~13 = **42–43 cm**. This is stated identically in both the bodice
  chapter (Ch.2 p.14: "袖隆大 30+(12~13)=42~43(cm)") and the sleeve chapter
  (p.94: "袖窿围尺寸与臂围尺寸有关... 臂围+(12~13)cm"), and matches the book's own
  Size-III reference table (upper arm 30, armhole ≈ 42) cited in the
  `pattern-making-principles` skill — cross-check passes.
- **How it's measured off the bodice draft**: "最后,在裁剪纸样以前,还要用皮尺沿着
  前后袖窿弧线弯度进行测量" (Ch.2 p.18) — after drafting, run a tape along the
  front and back armhole curves of the *cut* bodice pattern and sum them.
- **Armhole depth (袖窿深)**, which positions the bodice's UP point (scye base
  point) that the total armhole is measured around, comes from a bust-indexed
  table on the bodice draft (Ch.2 p.14): 21 cm at bust 88, **21.5 cm at bust 92**
  (worked), 22 cm at bust 96, 22.5 cm at bust 100 — roughly +0.125 cm per +1 cm
  bust. UP point itself sits at `1/2 backWidth + (5–6.5 cm, size-dependent)`
  along the bust line (Ch.2 p.16; worked 5.5 cm at backWidth 36).
- **Adjustment knob**: if the measured total armhole misses the target, the
  bodice's UP point is raised/lowered — "每降低UP点0.5~1cm时,袖窿尺寸就会增大
  1.5cm" (Ch.2 p.19): lowering UP by 0.5–1 cm adds ~1.5 cm to the total armhole.

**Cap ease (吃势) and its distribution** (p.99, 第三节):

- "袖山弧线长度应比衣身袖窿弧线略长(平均长2~2.5cm)" — the finished sleeve **cap
  arc length** (T–B–U plus T–F–U, the full cap curve) should be **2–2.5 cm
  longer** than the bodice's *total* armhole curve length. Worked: cap arc ≈
  42~43 + 2~2.5 = **44.5–45.5 cm** against the worked bodice AH.
- Distribution is asymmetric and concentrated near the shoulder, not the
  underarm: "松量主要分布在袖窿的上部,在B点和F点以上,大部分在前袖山处(1~2cm),
  少部分在后袖山处(0.5cm左右)。除非特殊,袖窿底部(即B点和F点以下)不加松量。" —
  most of the ease (1–2 cm) sits above the **F** (front) reference point, less
  (~0.5 cm) above the **B** (back) reference point, and by convention none is
  added below B/F (near the underarm).
- Notch procedure confirms the split quantitatively (p.99–100): when matching
  the **B** notch, the bodice point is nudged **up ~0.5 cm** to bank 0.5 cm of
  back-cap ease; when matching the **F** notch, "袖山上的剩余长度应比袖窿的
  剩余长度至少长1cm" — the residual cap arc beyond F must be **at least 1 cm**
  longer than the residual armhole arc beyond its point, to guarantee front-cap
  ease.
- **T** (cap apex) is the sole notch corresponding to the shoulder point
  ("袖山中点(T点)常作为与肩点对应的唯一绱袖对位点", p.99).

**Cap height vs. armhole measurement — explicit relationship**: the book gives
**no direct formula** relating cap height (袖山高) to armhole depth (袖窿深) the
way some proportional systems do. Cap height is set independently of the
armhole (from sleeve-root width alone, see Drafting steps), and the **only**
explicit cross-check against the bodice is on **cap arc length vs. total
armhole circumference** (above), not cap height vs. armhole depth. This is
flagged plainly rather than inferring a height/depth formula the source
doesn't state (see also Ambiguity 2).

## Options

| Option | Type | Default | Range | Source |
|---|---|---|---|---|
| `bicepEase` | pct (of `biceps`) | 16.7% (5 cm at biceps 30) | 15%–27% | sleeve-root ease by garment weight: +5 cm skirts/blouses (女裙、衬衫), +6~7 cm shirts/jackets (衬衫、茄克), +8 cm coats/eveningwear/overcoats (外套、晚装、大衣) (p.94) |
| `capHeight` | pct (of sleeve root width) | 37.1% (13 cm / 35 cm) | 33%–40% | "袖山高大约为袖根肥的1/3或略大" (p.94); high-cap variant 14 cm/35 cm = 40% (附录二, p.203) — no per-size lookup table located, see Ambiguity 2 |

Raw cm amounts from the book (root-width ease classes, cap-height ratio) are
recorded above as percentages of their governing measurement so that the
drafting formulas stay measurement-relative, per project convention.

**Deliberately NOT options in v1** — both were considered and rejected:

- **`capEase`.** Cap ease is not an input to this draft. The cap is
  constructed from `rootWidth` and the fixed B/F/aux constants alone; the
  2–2.5 cm ease is a *consequence* to be verified (see the cap-arc closure
  check), not a knob. Exposing it as an option would imply the draft responds
  to it, which it does not. It belongs in the test suite, not the UI.
- **`silhouette` (`fitted` / `semiFitted`).** 紧身袖/法式袖 (elbow dart, hem =
  1/3 wrist + 1 cm front / 2/3 wrist back, p.96–97) and 半合体袖 (smaller
  elbow dart 3–3.5 cm, p.98) reuse this cap unchanged and reshape only below
  the root line — but both need elbow circumference, which has no FreeSewing
  measurement (Ambiguity 1). A list option whose non-default values silently
  do nothing is worse than no option. Documented here for a later version.

## Drafting steps

Coordinate system: **x** runs across the sleeve, 0 at the back/outer seam edge
increasing toward the front/inner seam edge; **y** runs down the sleeve, 0 at
the cap apex (T, shoulder-point level) increasing toward the hem. All lengths
in mm.

Let `rootWidth = biceps × (1 + bicepEase)` — worked: 300 × 1.167 ≈ **350**.
Let `capHeight = rootWidth × capHeightPct` — worked: 350 × 0.3714 ≈ **130**.
Let `rectLength = shoulderToWrist − 10` — worked: 600 − 10 = **590** (the book's
flat "−1 cm" constant, p.95; see Ambiguity 3).

1. **Cutting rectangle**: `rootWidth × rectLength` (350 × 590 mm). Top edge is
   the cap baseline; bottom edge is the raw hem (p.95, 图7-1).
2. **Cap apex** `T = (rootWidth/2, 0)` — worked **(175, 0)**.
3. **Root line (DC line)**: horizontal at `y = capHeight` (130), spanning the
   full width. Its ends are the underarm points `U_back = (0, capHeight)` and
   `U_front = (rootWidth, capHeight)` — worked **(0,130)** / **(350,130)**
   (p.95, 图7-2).
4. **Quarter reference lines** (internal construction lines, not seams):
   `x = rootWidth/4` ("后袖线", back reference) and `x = 3×rootWidth/4`
   ("前袖线", front reference) — worked **87.5** and **262.5**.
5. **Diagonal cap lines**: straight lines `U_back–T` and `T–U_front`. Each
   quarter line crosses its diagonal exactly at the diagonal's own midpoint
   (since the quarter x-coordinate is midway between 0/rootWidth and
   rootWidth/2): back diagonal midpoint **(87.5, 65)**, front diagonal
   midpoint **(262.5, 65)**.
6. **Back cap reference point B**: on the back quarter line, `55 mm` (5.5 cm)
   **down from the top edge of the rectangle** — worked **(87.5, 55)**.
7. **Front cap reference point F**: on the front quarter line, `60 mm` (6 cm)
   **down from the top edge** — worked **(262.5, 60)**. (F sits 5 mm *lower*
   than B — book constant, p.95.)

   The book's wording is explicit and easy to misread: "在右侧1/4折线上从**上端**
   向下量6cm作点F，在左侧1/4折线上从**上端**向下量5.5cm作点B" (p.95) — the
   offsets run from the **top edge**, not from where the quarter line crosses
   the `U–T` diagonal. 图7-2 dimensions them from the top line. Measuring from
   the diagonal crossing instead puts B/F ~65 mm too low and inflates the cap
   arc to ≈490 mm against the book's own 445–455 mm target (see Review).
8. **Cap-curve smoothing points** — take the midpoint of each of the four
   chords `U_back–B`, `B–T`, `T–F`, `F–U_front`, then offset it vertically by
   a fixed book constant (down = away from T, toward the root line; up =
   toward T), per p.95: "UB线中点向下1cm，BT线中点向上1cm，TF线中点向上1.2cm，
   FU线中点向下2cm":
   - mid(`U_back`,`B`) = (43.75, 92.5), offset **+10 mm down** → **(43.75, 102.5)**
   - mid(`B`,`T`) = (131.25, 27.5), offset **−10 mm up** → **(131.25, 17.5)**
   - mid(`T`,`F`) = (218.75, 30), offset **−12 mm up** → **(218.75, 18)**
   - mid(`F`,`U_front`) = (306.25, 95), offset **+20 mm down** → **(306.25, 115)**

   The signs produce the correct cap morphology and are a useful sanity check
   on the whole construction: **convex** over `B–T` and `T–F` (the crown),
   **concave** over `U_back–B` and `F–U_front` (the underarm hollows), with
   the front hollow twice as deep as the back (20 vs 10 mm) — standard
   practice, and visible in 图7-2/图7-3.

   These four fixed offsets (10/10/12/20 mm) are given only for the worked
   root width (350 mm); see Ambiguity 4 on scaling.
9. **Cap curve**: one smooth curve through, in order: `U_back` → aux1 → `B` →
   aux2 → `T` → aux3 → `F` → aux4 → `U_front` (p.95, 图7-3). The result dips
   slightly outward near both underarm points (more on the front, 20 mm vs.
   10 mm) and crowns at T.
10. **Side seams**: straight vertical lines from `U_back` (0, capHeight) and
    `U_front` (rootWidth, capHeight) down to the hem — these are the only true
    cut seams (外袖缝 back/outer, 内袖缝 front/inner); the quarter lines in
    step 4 stay internal references (p.96, 图7-7).
11. **Elbow point** `E`: `shoulderToElbow` is stepped off as a **diagonal from
    T to the back quarter line**, not straight down the centre line — 图7-5
    draws 袖肘高 as a slanted line from T to an E sitting on the folded piece's
    back edge, and 图7-7 repeats it with E on the 后袖线. So E lies at
    `x = rootWidth/4` and

    ```
    y_E = √( (shoulderToElbow×10)² − (rootWidth/4)² )
    ```

    worked: √(320² − 87.5²) = √94743.75 ≈ **307.8** → E = **(87.5, 307.8)**.
    Elbow line: horizontal through E (the fitted variants dart it instead —
    out of v1 scope). Note this is ~12 mm higher than a naive
    straight-down-the-centre reading would give; see Ambiguity 9.
12. **Elbow notches**: on both side seams, mark `y_E − 75` and `y_E + 50` —
    worked **232.8** and **357.8** (7.5 cm above and 5 cm below the elbow
    line, p.96).
13. **Cuff/hem shaping** (p.96, 图7-6 + 图7-7): the hem is cut **through the
    folded sleeve**, so on the unrolled rectangle it is a chevron, not a
    straight diagonal.

    Base hem at `y = rectLength` (590). Raise the front quarter line's hem
    point by **25 mm** to `rectLength − 25` (worked **565**) and connect it to
    the back quarter line's hem point (unchanged, worked **590**) — the hem
    sits lower/longer at the back, higher/shorter at the front. Beyond each
    quarter line the cut line **mirrors**, because the quarter lines are the
    fold lines (图7-6 is captioned 对折的袖片, "the folded sleeve piece", and
    shows one straight hem cut across it). Both seam edges therefore land at
    the mid value `rectLength − 12.5` (worked **577.5**).

    Hem polyline, worked: (0, **577.5**) → (87.5, **590**) → (262.5, **565**)
    → (350, **577.5**). 图7-7 rounds the two corners; that is drawing latitude.

    Two checks this passes and a straight diagonal extended to the seam edges
    does not: the two seam edges come out **equal**, so the underarm seam
    closes flush instead of stepping 50 mm; and no part of the hem falls below
    `rectLength`, so the piece still fits the rectangle it is cut from. See
    Ambiguity 6 — an earlier review of this spec got this wrong.
14. **Notch/set-in matching against the bodice armhole** (第三节, p.99–100):
    match T to the bodice shoulder point (sole primary notch); match B to the
    back armhole, banking ~0.5 cm ease by nudging the bodice point up 0.5 cm;
    match F to the front armhole, checking that the residual cap arc beyond F
    is ≥1 cm longer than the residual armhole arc — see Armhole dependency
    above for the full ease budget.

The 紧身袖 (fitted) and 半合体袖 (semi-fitted) variants reuse this cap unchanged
and only reshape the piece below the root line (elbow dart from the elbow line
to the sleeve center line, tapered hem using `wrist`/elbow circumference) —
documented under Options but not carried further here (Ambiguity 1).

## Worked example (oracle) — biceps 30, shoulderToWrist 60, shoulderToElbow 32 (cm)

| # | Dimension | cm (book arithmetic) | mm (oracle) |
|---|---|---|---|
| 1 | Sleeve root width (rootWidth = biceps+5) | 35 | 350 |
| 2 | Cap height (capHeight, DC line depth) | 13 | 130 |
| 3 | Cutting-rectangle length (袖长−1) | 59 | 590 |
| 4 | Quarter width (rootWidth/4) | 8.75 | 87.5 |
| 5 | T (cap apex) | (17.5, 0) | (175, 0) |
| 6 | U_back / U_front (underarm points) | (0,13) / (35,13) | (0,130) / (350,130) |
| 7 | B (back cap reference point) | (8.75, 5.5) | (87.5, 55) |
| 8 | F (front cap reference point) | (26.25, 6) | (262.5, 60) |
| 9 | Cap-curve aux point, U_back–B | (4.375, 10.25) | (43.75, 102.5) |
| 10 | Cap-curve aux point, B–T | (13.125, 1.75) | (131.25, 17.5) |
| 11 | Cap-curve aux point, T–F | (21.875, 1.8) | (218.75, 18) |
| 12 | Cap-curve aux point, F–U_front | (30.625, 11.5) | (306.25, 115) |
| 13 | Elbow point E (on back quarter line) | (8.75, 30.78) | (87.5, 307.8) |
| 14 | Side-seam elbow notches | 23.28 / 35.78 | 232.8 / 357.8 |
| 15 | Cuff: front quarter-line hem rise | 59 → 56.5 | 590 → 565 |
| 16 | Cuff: back quarter-line hem (unchanged) | 59 | 590 |
| 17 | Bodice armhole depth (袖窿深, at bust 92) | 21.5 | 215 |
| 18 | Bodice total armhole target (biceps+12~13) | 42–43 | 420–430 |
| 19 | Sleeve cap arc target (armhole + 2~2.5 cm ease) | 44.5–45.5 | 445–455 |
| 20 | Cap ease, front share (above F) | 1–2 | 10–20 |
| 21 | Cap ease, back share (above B) | ~0.5 | ~5 |

**Cap-arc closure check — the strongest available test of the whole cap
construction.** The four chords measure

⚠ The bulges the book states (1, 1, 1.2, 2 cm) are measured **straight down the
page**, but the parabolic arc-length formula wants the sagitta measured
**square to the chord**, and these chords sit at 32–41°. Use
`h⊥ = h·cos θ`, or the estimate over-reads by ~7 mm.

| Chord | Length c | Angle θ | Bulge h | h⊥ = h·cos θ | Curved ≈ c·(1 + 8h⊥²/3c²) |
|---|---|---|---|---|---|
| `U_back–B` | 115.2 | 40.6° | 10 | 7.59 | 116.5 |
| `B–T` | 103.3 | 32.2° | 10 | 8.46 | 105.2 |
| `T–F` | 106.1 | 34.4° | 12 | 9.90 | 108.6 |
| `F–U_front` | 112.1 | 38.7° | 20 | 15.60 | 117.9 |
| **total** | **436.7** | | | | **≈ 448** |

against the book's independently-stated cap-arc target of **445–455 mm** (total
armhole 420–430 + 20–25 ease). The construction closes inside its own target —
**this is the test the implementation must reproduce**, and it is what exposed
the B/F misplacement: placing B/F from the diagonal crossing gives a 477 mm
polyline and a ≈490 mm curve, overshooting the target by ~8% and implying ~5 cm
of cap ease on a block the book calls loose and comfortable.

The implementation measures **447.92 mm** on the actual drawn curve, which
matches this corrected estimate to 0.3 mm. Against the calibrated bodice
armhole of 425.26 mm that is **22.66 mm** of sleevecap ease — inside the book's
20–25 mm band. An earlier version of this table used the unprojected bulges,
reported ≈455 mm, and made the ease look like ~30 mm; the geometry was never
wrong, only the estimate of it.

Other checks against the book's own statements: total armhole 42–43 cm at
biceps 30 matches both Ch.2 (p.14) and Ch.7 (p.94) independently, and matches
the Bray Size-III reference in `pattern-making-principles` (upper arm 30,
armhole ≈42) ✓. F is drawn 5 mm lower than B (6 vs 5.5 cm from the top edge)
✓ matches p.95 text and 图7-2. Cap front-side ease (1–2 cm) exceeds back-side
ease (~0.5 cm) ✓ matches the book's stated asymmetric distribution (p.99).

## Construction notes

- Net pattern convention: this chapter does not restate it, but the book's
  general convention (Bray p.6, cited in `skirtblock.md`) is that blocks are
  drafted net with seam allowance added at cutting — assumed to carry over.
- The two "reference lines" (后袖线/前袖线 at the quarter points) are internal
  construction lines used only to locate B and F; they are not cut edges.
- T/B/F are the sleeve's only three set-in notches; there is no continuous
  point-for-point match required elsewhere on the cap (p.99: "任何位置都可以
  选作对位点... 但袖山上的位置点确定下来,袖窿上相对应的位置点应做得尽可能精确").
- Checking the drafted sleeve: measure the cap curve with a tape and compare
  to the bodice's measured total armhole; a mismatch usually means a
  measurement error in one of the two curves, since both derive from the same
  `biceps`-linked target (p.99).
- The fitted/semi-fitted variants' elbow dart and tapered hem are documented
  under Options for future work but are out of this design's v1 scope.

## Ambiguities

1. **Elbow circumference has no FreeSewing measurement.** `肘围` is required
   only by the `fitted`/`semiFitted` silhouette options, not by `straight`
   (v1). Implementing those variants later will need either a new shared
   measurement or a documented approximation from `biceps`/`wrist` — the book
   gives no such formula. **Chosen for v1: leave `fitted`/`semiFitted`
   unimplemented**, documented only.
2. **Cap-height spec table not found.** The book twice refers readers to "附录二
   中袖子的规格尺寸表" (a size-indexed spec table) for setting cap height
   precisely (p.94, "每增加或减小1cm都是一个不同的规格"). Appendix 2 was
   located (printed pp.203–204, PDF pages 220–221) and confirmed to contain
   only a "高袖山袖子的画法" (high-cap variant) worked construction — raising
   13→14 cm while narrowing B/F to hold the cap arc length constant — not a
   literal per-biceps lookup table. No such table was found elsewhere across
   the book's 266 pages. **Chosen: use the worked ratio (13/35 = 37.14%) as
   the default `capHeight`, with the ±2 cm-biceps / ±0.5 cm-cap-height
   sensitivity rule (p.94) and the 40% high-cap alternate as the only other
   documented data points.**
3. **"Sleeve length − 1 cm" rectangle constant** (p.95) has no stated
   rationale (seam take-up? drafting margin?). Treated as a fixed book
   constant, not scaled by size.
4. **B/F top-edge offsets (5.5 cm back, 6 cm front) and the four
   curve-smoothing offsets (1, 1, 1.2, 2 cm) are given only for the single
   worked root width (350 mm).** The book does not say whether they scale with
   `rootWidth`/`biceps` for other sizes. **Chosen for v1: treat as fixed
   constants.** The cap-arc closure check in the oracle section is the natural
   guard here — run it across the sampling size range, and if the drafted cap
   arc drifts outside `armhole + 2…2.5 cm` at the extremes, that is evidence
   these constants *should* scale, and the finding goes back to the user
   before anyone invents a scaling rule.
5. **Biceps worked value stated ambiguously as "30 cm or 31 cm" side by side**
   (p.94–95). The 35 cm root-width / 13 cm cap-height arithmetic is only clean
   with biceps = 30 (31 would give a non-round 13.25 cm cap height per the
   ±2 cm/±0.5 cm sensitivity rule). **Chosen: 30 cm is the oracle value.**
6. **Cuff/hem shaping past the quarter lines — RESOLVED, after one wrong
   resolution.** The book states the front quarter-line hem point rises 2.5 cm
   and connects by a cut line to the back quarter-line's hem point (p.96), but
   does not spell out what happens between each quarter line and its seam edge.

   ❌ **The first review of this spec resolved it wrongly**, reading 图7-7 as
   "a single line running from 外袖缝 to 内袖缝" and extending the diagonal
   straight out to both seam edges. That gives seam edges at 602.5 and 552.5 —
   a **50 mm step** at the closed underarm seam, and a back edge 12.5 mm below
   the rectangle the piece is cut from. Both are impossible, and either one
   should have refuted the reading without needing the page.

   ✅ **Correct reading: the cut line mirrors at each quarter line**, because
   the quarter lines are the *fold* lines. 图7-6 is captioned 对折的袖片 ("the
   folded sleeve piece") and shows a single straight hem cut across the folded
   piece; unfolding a straight cut through a fold necessarily mirrors it. Both
   seam edges land at 577.5, the seam closes flush, and nothing extends past
   the rectangle. Confirmed against 图7-7 at 260 dpi, whose hem visibly rises
   from 后袖线 toward 外袖缝 and falls from 前袖线 toward 内袖缝 — the opposite
   of what the straight extension predicts at both ends.

   The lesson, for the extraction skill: "the line runs right across" is a
   claim about the line's *extent*, and it was used to settle a question about
   the line's *shape*. Confirming the wrong property reads exactly like
   confirming the right one.
7. **No front-armhole/back-armhole split is ever stated** — only the *total*
   armhole circumference (biceps+12–13 cm) and *total* cap-arc ease
   (armhole+2–2.5 cm). Unlike some Chinese proportional systems (前AH/后AH),
   this book never gives separate front/back armhole targets; the B/F offset
   asymmetry (5.5 cm vs 6 cm) is a proxy for a front/back split at best, not a
   stated one.
8. **"见第二章" cross-reference** (p.95, for adjusting the cap-curve-length
   spec after drafting the bodice) was traced by content match to Ch.2
   pp.14–19 (armhole depth table, UP-point formula, and the p.18/19
   tape-measure-and-UP-adjustment procedure) — there is no explicitly-titled
   Chapter 2 section for "adjusting the sleeve cap," so this mapping is
   inferred, not stated.
9. **Elbow-line construction is described only via a paper-folding procedure**
   ("从T点向后袖折线在袖上沿取袖肘高32cm", p.96, Fig 7-4/7-5) whose exact
   geometric meaning is ambiguous about whether the fold is taken along the
   back seam line specifically (which would tilt E off the sleeve center
   line). **Resolved on review — E is NOT on the sleeve centre line.** 图7-5
   draws 袖肘高 as an explicitly slanted line from T down to an E on the folded
   piece's back edge, and 图7-7 repeats the same diagonal with E labelled on
   the 后袖线. So `shoulderToElbow` is a diagonal step-off, not a vertical
   drop, putting the elbow line at
   `√((shoulderToElbow×10)² − (rootWidth/4)²)` ≈ 307.8 mm rather than 320 mm —
   a 12 mm difference that also shifts both elbow notches. The elbow-dart
   shaping itself (relevant only to the fitted/semi-fitted variants) was not
   traced further given Ambiguity 1.

## Review

Principles gate (spec review, 2026-08-03) against `pattern-making-principles`:

- Total armhole target (biceps+12–13 cm ≈ 42–43 cm at biceps 30) matches the
  book's own Bray Size-III reference (upper arm 30, armhole ≈42) cited in the
  principles skill ✓ — independent cross-check from a different chapter of
  the same book.
- Armhole depth (21.5 cm at bust 92) sits between the principles' Size-III
  value (21 cm at bust 88) and the book's own bust-96 value (22 cm),
  consistent with the stated +0.5 cm per two-size step ✓.
- "Sleeve ↔ armhole" principle (cap height inversely related to sleeve
  width/comfort; loose garments pair with lower cap + wider sleeve) is
  qualitatively consistent with this chapter's own framing of 直袖 as the
  loose, comfortable sleeve type (p.93) ✓ — not independently numerically
  verified here, since the principles' basic-cap-height ceiling (outer-arm −
  inner-arm) and the sleeve-pitch-angle formula both need inner/outer-arm or
  shoulder-width inputs this chapter doesn't supply; flagged as an open check
  rather than assumed to pass.
- Cap ease (2–2.5 cm over a ~42.5 cm armhole, ≈5–6%) is a plausible, modest
  woven-sleeve ease; no principle citation contradicts it.
- No front-length-vs-back-length or dart-intake principle applies directly to
  a sleeve block; balance/dart principles (§2) are bodice-specific and out of
  scope here.

**Diagram verification pass (Fable, 2026-08-03)** — 图7-2 and 图7-7 (printed
p.96) read directly at 260 dpi against the extracted geometry:

- **B/F placement corrected.** They are dimensioned from the rectangle's top
  edge (B at 5.5 cm, F at 6 cm), not from the `U–T` diagonal crossing. Wrong
  reading put them ~65 mm too low and inflated the cap arc to ≈490 mm against
  the book's own 445–455 mm target; corrected geometry closes at ≈455 mm.
- **Elbow point corrected.** 图7-5/图7-7 draw 袖肘高 as a diagonal from T to E
  on the 后袖线, so the elbow line sits at ≈307.8 mm, not 320 mm (Ambiguity 9
  closed).
- ❌ **Hem treatment "confirmed" here was wrong** — 图7-7 does run the cut line
  right across from 外袖缝 to 内袖缝, but that settles the line's *extent*, not
  its *shape*, and it was used to settle the shape. The cut mirrors at each
  quarter line (they are fold lines, 图7-6 对折的袖片). Corrected in step 13 and
  Ambiguity 6 on 2026-08-04.
- **`capEase` and `silhouette` removed as options** — neither is consumed by
  the draft; see the Options section.

Result: **pass after correction**, with one open check — the
cap-height-vs-armhole-depth relationship could not be independently verified
against the sleeve-pitch-angle formula (no shoulder-width figure supplied by
this chapter). Everything else checked is consistent with the principles skill
and with the book's own cross-chapter numbers, and the cap-arc closure check
now provides a strong quantitative gate the implementation must reproduce.
Ambiguities 1–2 (fitted variants, cap-height table) remain surfaced to the
user but do not block the `straight` v1.
