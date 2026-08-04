# dressblock — Dress block (连衣裙服装的基本型)

## Source

- Book: `英国经典服装纸样设计基础篇.pdf` (in `clothing_books`)
- Edition/authors: 纳塔莉·布雷 (Natalie Bray) 著; 王永进, 赵欲晓, 高凌 译; 中国纺织出版社
  (国际服装丛书 ②, "英国经典服装纸样设计 基础篇")
- Printed pages: 157–162 (第十二章 连衣裙服装的基本型, whole chapter — title
  page p.157 carries no folio number; construction pp.158–159 incl. 图12-1;
  style extensions / 长方形法 pp.160–162 incl. 图12-2). Also read for
  dependency: printed pp.155–156 (第十一章 第七节 衣片与裙子侧缝的对合, 第八节
  衣片与裙子的腰省对合). PDF pages 173–180, offset +18 (printed = PDF − 18;
  confirmed at seven folios in this pull: 155, 156, 158, 159, 160, 161, 162 —
  all read directly off the page images, matches `bodiceblock.md` and
  `skirtblock.md`'s offset for the same book).
- INDEX.md row: dressblock

## Is this a new draft, or a join? — a join, per bodiceblock + skirtblock

**It is a join, explicitly stated by the book, not a new geometric system.**
p.158 opens the chapter by naming exactly two ways to build it:

> 连衣裙基本型可以用下列两种方法中的任意一种得到：
> (1) 将上衣身和裙原型腰围相连，或沿臀围线相连，等等……
> (2) 对长度及臀的上衣添加裙子部分。尽管第一种方法显得更合适，但在具体实施时会
> 连带更多问题，因为沿腰围线或臀围线，将裙子与上衣身对合时会遇到很多难题，特别是
> 当裙子为较贴身的造型时，尤其如此。因此这种方法仅限于特殊情况下使用，而一般情况
> 下建议使用第二种方法……尽管两种方法都正确，但后者较简单。

Translation: the dress block can be obtained either (1) by connecting the
bodice block and skirt block at the waist (or hip line), or (2) by extending
the already-drafted-to-hip-line bodice downward by the needed skirt length.
Method (1) is "more fitting in principle" but hits real matching problems at
the join, especially for close-fitting skirts; method (2) is recommended and
is what the chapter actually details (图12-1, labelled **一片式礼服原型**,
"one-piece dress/gown prototype", in the figure itself). This spec implements
method (2) as the drafting steps below, and documents method (1) and a third,
even simpler "rectangle method" (长方形法, p.160) as book-stated alternatives
without formulas precise enough to implement (see Construction notes).

**Every measurement and every option is inherited from `bodiceblock.md` and
`skirtblock.md` unchanged.** The only things this chapter adds are: a skirt
length measured from the waist, a rule for extending CB/CF and drawing a new
hem line, a rule for reading the skirt block's own hem width and marking it
on that new hem line, and a rule for connecting that mark smoothly back up to
the bodice's existing side seam. There is no new body measurement, no new
armhole, bust, waist or hip formula, and — notably — **no worked numeric
example of its own**: unlike Ch.2 and Ch.11 §3, Ch.12 never prints a
chest/hip-92/98-style arithmetic table. The oracle below is this spec's own
arithmetic, produced by running Ch.12's stated procedure against
`bodiceblock.md`'s and `skirtblock.md`'s own already-verified chest-92/hip-98
worked examples (both from this same book, same author, and — importantly —
sharing `seat=98`, `waist=70`, `waistToSeat=22` already, so no reconciliation
of the shared inputs was needed to combine them). This is flagged wherever it
matters; nothing below is presented as book-printed when it is this spec's
derivation.

**Why method (2) is preferred — evidence, not just the book's assertion.**
Ch.11 §7 (衣片与裙子侧缝的对合, p.155) exists precisely because independently
drafted bodice and skirt side seams do not automatically land at the same
width when joined at a horizontal seam line, and gives a check-and-adjust
procedure (measure back panel to 1/4 waist, compare skirt's back waist,
adjust CB slant / side seam / dart length until they agree, "0.5cm 出入可忽略,
大批量生产则必须非常准确"). Running that check against our own two shipped
blocks' **hip line** (not waist — see below) shows a real, non-ignorable gap:

| | bodiceblock HP-x (mm) | skirtblock hip-x (mm) | gap |
|---|---|---|---|
| Back | 245 (`seat_mm/4`, no ease) | 260 (`seat_mm/4 + 15`) | **+15** |
| Front | 275 (`seat_mm/4 + 30`) | 260 (`seat_mm/4 + 15`) | **−15** |

Both blocks put 60 mm of total hip ease into the half-pattern (matching
"finished hip 98+6" in both specs), but `bodiceblock.md` puts all of it on
the front (Ambiguity 9 there) while `skirtblock.md` splits it 30/30 back/front
between its two congruent panels. 15 mm exceeds the book's own "0.5cm
ignorable" line, so a literal method-(1) join at the hip line would need
exactly the §7 fix-up procedure to reconcile it. Method (2) sidesteps the
problem by construction: it never asks the two blocks' hip-line widths to
agree at all — it only borrows the skirt block's **hem** width (a single
scalar, read off the *bottom* of the skirt block) and free-hand-curves a new
side seam from the bodice's own HP point down to that mark. That is a
concrete, evidenced reason method (2) is "simpler," not just the book's
unsupported preference.

§8 (衣片与裙子的腰省对合, p.156) is the matching rule for the case that also
doesn't arise here: it says that when a bodice's back has one waist dart and
a skirt piece is being joined to it at a real waist seam, the skirt's own
dart must move to align its **inner** leg (the leg nearer CB) with the
bodice's dart, because the two blocks' dart widths generally differ (its own
example: "衣片上的省道为2cm，而裙子的腰省为3~4cm" — which is close to, though not
identical to, our own two blocks' actual numbers: `bodiceblock.md`'s back dart
is 20mm exactly per that chapter's own "后腰省2cm" statement, and
`skirtblock.md`'s two back darts are 24.18mm each). Method (2) doesn't need
this rule either: the panel is continuous, so the bodice's existing back dart
(already drafted, tip at 525mm — see Construction notes) simply *is* the
dress's waist shaping; no separate skirt dart is introduced below it. §7/§8
are documented here because they are exactly the problem Ch.12 opens by
naming (p.155's closing sentence, carrying straight into Ch.12's own opening
paragraph: "在腰部将连衣裙裁剪为衣片与裙子并不是问题的解决方法，进一步说，对纸样
进行巧妙的处理是非常必要的" — cutting a dress into bodice+skirt pieces at the
waist is not itself the solution; sophisticated pattern handling is what's
needed) — they are the tools you would reach for under method (1), or when
later adding a design waist seam to a garment drafted from this block, not
formulas this spec's method-(2) drafting steps consume directly.

## Measurements

All inherited unchanged from `bodiceblock.md` / `skirtblock.md`. Both blocks
already share `seat`, `waist`, `waistToSeat` as literal inputs (98/70/22 cm in
both worked examples) — this spec uses one value of each, not two.

| Book term | CN | FreeSewing name | Worked example | Source / notes |
|---|---|---|---|---|
| Chest/bust | 胸围 | `chest` | 92 cm | `bodiceblock.md`, unchanged |
| Hip | 臀围 | `seat` | 98 cm | shared by both blocks, unchanged |
| Waist | 腰围 | `waist` | 70 cm | shared by both blocks, unchanged |
| Waist-to-hip depth | (臀围线位置) | `waistToSeat` | 22 cm | shared by both blocks, unchanged |
| Waist-to-knee depth | (膝围线位置) | `waistToKnee` | 52 cm | `skirtblock.md`, unchanged — positions the skirt-length option below |
| Back waist length | 背长 | `hpsToWaistBack` (approx.) | 40 cm | `bodiceblock.md`, unchanged |
| Upper arm/bicep | 上臂围 | `biceps` | 30 cm | `bodiceblock.md`, unchanged — still drives §D.0's armhole calibration, which this chapter does not touch |

`backWidthPct`/`chestWidthPct` (no FreeSewing measurement for 背宽/胸宽) carry
over as design options exactly as in `bodiceblock.md` — see Options.

## Options

All inherited from `bodiceblock.md` / `skirtblock.md` unless marked **new**.

| Option | Type | Default | Source |
|---|---|---|---|
| `chestEase` | pct of `chest` | 10.87% | `bodiceblock.md`, unchanged |
| `waistEase` | pct of `waist` | 2.86% | `bodiceblock.md`, unchanged |
| `waistFit` | bool | `true` | `bodiceblock.md`, unchanged |
| `backWidthPct` | pct of `chest` | 39.13% | `bodiceblock.md`, unchanged |
| `chestWidthPct` | pct of `chest` | 41.30% | `bodiceblock.md`, unchanged |
| `bustDartWidth` | pct of `chest` | 8.15% | `bodiceblock.md`, unchanged |
| `seatEase` | pct of `seat` | **6.12%** | shared value — see Ambiguity 5. `bodiceblock.md` (6.12%) and `skirtblock.md` (6.1%) both target 6cm at seat 98 (6/98 = 6.1224%); this spec standardizes the digits at 6.12%. Feeds both the bodice-panel HP construction and the skirt-hem-width formula below, so a dress can only carry one hip-ease value, not two |
| `lengthBonus` | pct of `waistToKnee` | 25% (→ skirt length 65cm) | `skirtblock.md`, unchanged. Drives `skirtLength = waistToKnee × (1+lengthBonus)`, which this chapter calls "裙长应从腰部计算" (skirt length, measured from the waist) — see Drafting step 1 |
| `silhouette` | list: `standard`/`straight` | `standard` | `skirtblock.md`, unchanged. Governs the knee-line gap (17mm/12mm) that feeds the skirt hem-width formula (Drafting step 1) |
| `hemTighten` | **pct** (of the panel's own marked hem half-width) | 0% | **new.** p.158: "如果要使底摆紧一些，就要把…前中心线和后中心线到侧缝线的长度缩短2~4cm，并另作标记点，即位于原来的点里面" (to make the hem closer-fitting, shorten the CF/CB-to-side-seam length by 2–4cm and mark a new point inside the original). Book's 2–4cm at the worked size is 6.7–13.5% of the 296.55mm hem half-width; range 0–15%. Subtracted from each panel's marked hem point (Drafting step 3). ⚠ **Must not be a raw `mm` option** — FreeSewing's shared config test rejects those; see Construction notes |

**Not options — book-stated but no implementable formula, see Construction
notes:** method (1) direct waist/hip join, the 长方形法 rectangle method
(p.160), and the style-A/B ease additions (pp.160–161). None of these carry a
number precise enough to promote to a drafting step without inventing
precision the book doesn't state; exposing them as toggles now would ship
options no formula consumes (the review lesson from the bodice/sleeve pass).

## Drafting steps

All lengths in **mm**. Coordinate system, origins and the shared top-line are
**exactly `bodiceblock.md`'s**: back origin = (CB, 上线), front origin = (CF,
上线), +x away from center, +y downward. `yWaist = LW` (400), `yHip = yWaist +
WS` (620) — both **shared by both panels**, since 图12-1 explicitly draws them
level: "两片的臀围线处于同一水平线".

### 0. Prerequisite — draft the bodice, unmodified, through HP

Run `bodiceblock.md`'s full construction (§A/§B/§C if `waistFit`, §D.0
armhole calibration) for both panels, using this spec's shared measurements
and options, through **HP**: back `(245, 620)`, front `(275, 620)`. Nothing
above the hip line changes. In particular the back waist dart (tip at
`yWaist + 125 = 525`, per `bodiceblock.md` §C.10) is left exactly as drafted —
it *is* the dress's waist shaping; no separate skirt dart is introduced
below it (§8, see "Is this a new draft" above).

### 1. Compute the skirt block's own hem half-widths (two numbers, not a panel)

Reuse `skirtblock.md`'s own formulas, evaluated at this dress's own
`lengthBonus`/`silhouette`, but **only to get one number** — the skirt
block's finished hem width. Nothing else about the skirt block (its darts,
its own side seam, its knee/yoke lines) is drafted here.

- `skirtLength = waistToKnee × (1 + lengthBonus)` — worked: `520 × 1.25 =
  **650**` (this is exactly `skirtblock.md` oracle row 3, "CB/CF length
  (waist→hem)" — reused directly, not re-derived).
- `halfHip = (seat_mm × (1 + seatEase)) / 2` — worked: **520** (identical to
  both blocks' own halfHip/HP-sum, see "Is this a new draft" above).
- `g = floor(halfHip/10 / 3)` — worked: **17mm** (standard silhouette; 12mm
  if `straight`) — `skirtblock.md` step 3, reused.
- `hemHalfWidthTotal = halfHip + 3 × ((skirtLength − waistToSeat) × g /
  (waistToKnee − waistToSeat))` — worked: `520 + 3×(430×17/300) = 520 + 73.1 =
  **593.1**` — `skirtblock.md`'s own hem-width formula (its step 4), reused
  with `skirtLength` in place of its own fixed `L`.
- `hemHalfWidthPerPanel = hemHalfWidthTotal / 2` — worked: **296.55mm**.

  ⚠ The book asks for **two** measurements here, not one: "从标准裙原型上找出
  基本底边长度，即**分别**量出从前中、后中至侧缝线的长度…再在纸上**分别**从前中心线、
  后中心线沿所画底边线量出**这两个长度**" — measure *separately* from the skirt
  block's front-centre and back-centre to its side seam, then mark *these two
  lengths*. They come out equal here only because `skirtblock.md` step 5 makes
  its two panels congruent ("they differ in darts only"), so the outline this
  chapter borrows is the same for both. Implement it as two values read from
  the skirt geometry, not as one scalar doubled — if a future `skirtblock`
  option ever makes the panels non-congruent, one scalar silently becomes wrong
  while two values stay correct.

### 2. Extend CB and CF downward, draw the hem baselines

1. From the bodice's own CB/CF line (already at `x=0` by the hip line — see
   the Construction notes on `bodiceblock.md` Ambiguity 7, confirmed by
   图12-1), continue straight down to `yHem = yWaist + skirtLength` —
   worked: `400 + 650 = **1050**`.
2. At `yHem`, draw a baseline **perpendicular to CB/CF** (p.158: "起始端与前
   中心线和后中心线呈直角" — confirmed in 图12-1 by an explicit 90° angle mark at
   this corner), running outward (+x).
3. The baseline's outer end curves upward **7.5mm** (book range 0.5–1cm,
   p.158: "尾端稍稍向上弯曲0.5~1cm" — this spec uses the range midpoint, chosen,
   not stated — Ambiguity 1).

### 3. Mark the hem width, apply `hemTighten`

Mark each baseline, from CB/CF, at `hemHalfWidthPerPanel − hemTighten` —
worked (`hemTighten=0`): **296.55mm** for both panels (p.158: "从标准裙原型上
找出基本底边长度…再在纸上分别从前中心线、后中心线沿所画底边线量出这两个长度，
并作标记").

### 4. Connect the marked hem point to the bodice's side seam

Draw a smooth curve from each panel's HP point — back `(245, 620)`, front
`(275, 620)` — down to its marked hem point — both `(296.55, 1050)` in this
worked example — **tangent to the bodice's existing side seam at HP** (p.158:
"以标记出的每个点逐渐向上连出侧缝线，直到与衣身相连，并使该线平滑而不间断地与
衣身的侧缝线连接在一起"). The book gives no interior control point for this
curve (unlike the bodice/skirt curves elsewhere in the same book, which do) —
implementation is free to choose a curve family that satisfies the two
endpoints and the tangency constraint; see Ambiguity 2.

- Back flare: `Δx = 296.55 − 245 = 51.55mm` over `Δy = 430mm` → **6.85°**.
- Front flare: `Δx = 296.55 − 275 = 21.55mm` over `Δy = 430mm` → **2.87°**.

Both are mild — neither approaches a "kink" at HP, so this worked example
never exercises the book's fallback ("为了避免侧缝线间断，臀围水平线处可加宽
一些" — widen the hip line to avoid a discontinuous side seam, p.158) for
which the book gives no numeric value anyway (Ambiguity 3).

### 5. Hem line

Curve smoothly through both panels' hem points and the two hem-baseline
curls (§2.3) — the finished hem, "摆线".

## Worked example (oracle) — chest 92, seat 98, waist 70, waistToSeat 22, hpsToWaistBack 40, biceps 30, waistToKnee 52, lengthBonus 25% (cm)

**Ch.12 prints no worked table of its own.** Every row below is either
reused verbatim from an already-shipped oracle (marked "= bodiceblock/
skirtblock row N") or this spec's own arithmetic applying Ch.12's stated
procedure to those two oracles (marked "derived").

| # | Point/dimension | cm | mm | Source |
|---|---|---|---|---|
| 1 | Back HP (x,y) | (24.5, 62) | (245, 620) | = bodiceblock row 11 |
| 2 | Front HP (x,y) | (27.5, 62) | (275, 620) | = bodiceblock row 23 |
| 3 | Skirt length (from waist) | 65 | 650 | = skirtblock row 3 |
| 4 | Skirt hem half-width, total (both panels) | 59.31 | 593.1 | = skirtblock row 16 |
| 5 | Skirt hem half-width, per panel | 29.655 | 296.55 | derived (row 4 / 2, congruent panels) |
| 6 | Dress hem depth (`yWaist + skirtLength`) | 105.0 | 1050 | derived |
| 7 | Back hem point (x,y) | (29.655, 105.0) | (296.55, 1050) | derived |
| 8 | Front hem point (x,y) | (29.655, 105.0) | (296.55, 1050) | derived |
| 9 | Back flare (HP→hem), Δx / angle | 5.155 / 6.85° | 51.55 / 6.85° | derived |
| 10 | Front flare (HP→hem), Δx / angle | 2.155 / 2.87° | 21.55 / 2.87° | derived |
| 11 | Hem-baseline curl (chosen, Ambiguity 1) | 0.75 | 7.5 | chosen, book range 0.5–1cm |
| 12 | Finished hem circumference (both panels ×2) | 118.62 | 1186.2 | derived — vs. finished hip 104cm (skirtblock's own "98+6" check): hem wider than hip by 14.6cm ✓ movement ease |
| 13 | Front NP-to-hem / back NP-to-hem (total dress length) | 105.0 / 104.0 | 1050 / 1040 | derived — front NP at y=0, back NP at y=10 (bodiceblock rows 7/13), both hems at y=1050; front 10mm longer overall, preserving bodiceblock's own front-longer-than-back balance (p.30) through the full dress length |
| 14 | §7 cross-check: bodiceblock HP-x vs skirtblock hip-x (back / front) | +1.5 / −1.5 | +15 / −15 | derived — see "Is this a new draft" above; exceeds the book's own "0.5cm ignorable" line, evidencing why method (2) avoids needing this reconciled at all |

Rows 9–10 and 14 are this spec's own cross-checks, not oracle targets to hit
exactly — they exist to show the construction is well-behaved (mild flare,
no kink, no crossing of CB/CF) and to give Ch.11 §7 genuine, evidenced
content rather than a citation with nothing under it.

## Construction notes

- The block is drafted **net** (no seam allowance), consistent with both
  source blocks (Bray p.6).
- **Method (1) — direct waist/hip join** (p.158, "(1)将上衣身和裙原型腰围相连，
  或沿臀围线相连"): not implemented. The book gives no formula for the
  resulting side-seam correction beyond §7's qualitative toolkit (shorten the
  CB slant, lengthen the side seam, move the side seam, change dart length —
  "起决定因素的是根据人体的体型来确定侧缝线的最终外观形态", i.e., judgment call by
  body type, not a formula). Documented as a future-extension candidate.
- **长方形法 (rectangle method, p.160)**, an even simpler alternative to method
  (2): below the bodice's hip line, add a plain rectangle of the needed skirt
  length, its width equal to "大身的胯宽" (the bodice's own hip width — i.e.,
  the same HP-to-HP width this spec already uses), then draw whatever hem
  width the design calls for directly on the rectangle's outer edge, with
  "通常前身增加量总是比后身增量多一点" (front usually gets a bit more added than
  back) as the only stated rule. No numeric formula for the hem width itself
  (a free design choice) — not implemented.
- **Style A/B extensions (pp.160–161)** go beyond the basic block into named
  garment examples and are out of this spec's scope, but their numbers are
  recorded here for a future session: Style A (礼服/罩衫, flared) widens the
  standard dress's hem "5~6cm at every seam edge, 3cm at CF/CB" (总计
  30~45cm), reaching "约1.5m或稍多" for a very full skirt, plus optional CF/CB
  seams carrying "3~5cm" of a shoulder-dart-turned-hem-dart. Style B (3/4-length
  overcoat-style dress) adds chest ease "8~10cm via +1cm at CF/CB and +1cm at
  each seam", hip ease "12~15cm via specific points: CF/CB +1cm, back side
  +2cm, front side +3(2.5)cm", drops the armhole "1cm" and widens it
  "3~4cm". None of these are wired to any FreeSewing option in this spec.
- **Very close-fitting variant / 衬裙原型 (p.161–162)**: tightens the bust
  4–5cm, narrows the whole bodice, and adds "50%或更多" more shoulder-dart
  intake, for slips or strapless/low-neck close garments; a sleeveless
  version is obtained by simply trimming 0.5–1cm off the drafted armhole's
  inner seam ("在内缝线处去掉0.5~1cm"). Not implemented — no sleeve or neckline
  work is in this chapter's scope either.
- **Option typing.** FreeSewing rejects raw `mm` options in its shared config
  test — every option must be `pct`, `deg`, `bool`, `count` or `list`. That is
  why `hemTighten` is expressed as a percentage of the panel's own hem
  half-width rather than the book's literal 2–4cm. The book's range maps to
  6.7–13.5% at the worked size.
- 图12-1's CB line runs essentially straight (x=0) below the hip line all the
  way to the hem, which is the first direct visual confirmation of
  `bodiceblock.md`'s Ambiguity 7 ("CB/CF slant lines below the waist... 
  assumed to return to x=0 by the hip line, not confirmed by the text") —
  worth noting there as corroborating evidence from a later chapter.
- The 12–15cm gap the book asks you to leave between the back and front
  panels when tracing them onto the same sheet ("前片和后片间距12~15cm", p.158)
  is a paper-layout convenience for drafting both panels on one sheet by
  hand. It has no effect on either panel's finished shape and no FreeSewing
  equivalent — panels are already independent parts.

## Ambiguities

1. **Hem-baseline curl amount.** Book states a range, "尾端稍稍向上弯曲0.5~1cm",
   no specific value. **Chosen: 7.5mm** (range midpoint).
2. **Side-seam curve family (HP → hem).** The book specifies only the two
   endpoints and a qualitative smoothness/tangency constraint ("平滑而不间断地
   …连接"), unlike the bodice's and skirt's own curves elsewhere in the book,
   which carry explicit numeric control points. **Chosen: left to
   implementation** (e.g. a single quadratic Bézier satisfying the tangent at
   HP and the endpoint at the hem mark) — flagged rather than inventing a
   control-point number the book doesn't state.
3. **"Widen the hip line to avoid a kink" has no numeric value** ("臀围水平线
   处可加宽一些", p.158). Not exercised by this worked example (flare angles
   6.85°/2.87°, both mild — see Drafting step 4) but left unimplemented as a
   fallback for larger `hemTighten`-negative or very full-hem cases that
   might need it. A future session should check whether extreme
   `lengthBonus`/`hemTighten` combinations produce a large enough HP-to-hem
   jump to need this.
4. **Whether `silhouette: straight`'s 12mm knee gap governs the dress hem
   formula.** Ch.12 never mentions silhouette variants; this spec assumes
   direct reuse of `skirtblock.md`'s own per-silhouette formula (Drafting
   step 1) since nothing in Ch.12 suggests otherwise, but this is this spec's
   assumption, not a book statement.
5. **Shared `seatEase` digits.** `bodiceblock.md` (6.12%) and `skirtblock.md`
   (6.1%) both round the same 6cm-at-seat-98 target differently; this spec
   standardizes on 6.12%. Not a numeric conflict at this worked size (both
   give exactly 60mm), but the two shipped specs would diverge at other
   sizes if their percentages were both taken literally — worth reconciling
   in `bodiceblock.md`/`skirtblock.md` themselves in a future pass, not done
   here (out of this spec's scope; surgical-changes).
6. **Where the bodice's side seam is considered to "end" for the purpose of
   connecting to the new hem curve.** Chosen: HP, the last point on either
   source block's own side-seam construction — matches the plain reading of
   "直到与衣身相连" (until it connects with the bodice) and requires no new
   assumption about which point on the bodice's already-drafted side seam is
   meant.

## Review

Principles gate (spec review, 2026-08-04) against `pattern-making-principles`:

- Skirt length measured from the waist (裙长应从腰部计算) matches Bray's general
  from-the-waist length convention used throughout the book (p.9/11) ✓.
- Hem wider than hip line (118.6cm vs. finished hip 104cm) — same movement-
  ease principle already cited for `skirtblock.md` (Bray p.7) ✓.
- Front-over-back length surplus preserved end-to-end: front NP-to-hem
  (1050mm) exceeds back NP-to-hem (1040mm) by exactly the same 10mm surplus
  `bodiceblock.md` established at the shoulder (Bray p.30) — nothing in this
  chapter's construction touches the NP/shoulder region, so the surplus
  passes through unchanged ✓.
- Every drafted quantity in this chapter is either directly reused from an
  already-gated block (`bodiceblock.md`, `skirtblock.md` — both previously
  passed this same gate) or a dimensionless construction constant within a
  book-stated range (hem curl, hem tighten) — no new body-measurement-driven
  formula was introduced that could violate a sizing principle.
- Cross-book self-check (the review lesson from the bodice/sleeve pass):
  computed the §7 back/front hip-line mismatch between the two shipped
  blocks (+15mm / −15mm, Worked example row 14) specifically to verify method
  (2) doesn't silently rely on an assumption that the two blocks already
  agree at the hip line. They don't agree, method (2) doesn't need them to,
  and that is now demonstrated with numbers rather than asserted.
- Checked for physical impossibility: both panels' HP→hem curves are
  monotonic in x (back 245→296.55, front 275→296.55), neither crosses CB/CF,
  and the approximate chord lengths (back ≈433.1mm, front ≈430.5mm, straight-
  line lower bound) differ by only ≈2.6mm — comfortably within easing
  distance, not a seam that fails to close.

### Diagram verification pass (Fable, 2026-08-04)

图12-1 rasterized at 400 dpi and measured. This spec's construction produces a
**deliberately asymmetric** result — the front panel is wider at the hip than
the back (275 vs 245), both panels reach the *same* hem width, and therefore
the back flares roughly 2.4× as hard as the front (6.85° vs 2.87°). That
asymmetry is inherited from `bodiceblock.md`'s decision to put all hip ease on
the front, and it was worth checking against the book rather than assuming,
because an unintended asymmetry here would put the dress's side seam visibly
off the body's side line for the garment's whole length.

The figure confirms all three properties:

| Property | 图12-1 (px at 400 dpi) | This spec | Agrees |
|---|---|---|---|
| Front panel wider than back at the hip line | 430 vs 370 (1.16×) | 275 vs 245 (1.12×) | ✅ |
| Both panels reach the same hem width | 500 vs 495 (≈1.01×) | 296.55 both | ✅ |
| Back flares more than front below the hip | 125 vs 70 (1.8×) | 51.6 vs 21.6 (2.4×) | ✅ |

So the +15/−15 hip-line mismatch of Worked example row 14 is not eliminated by
method (2) so much as **carried through into the flare**, and Bray draws it that
way. Row 14's framing ("method (2) sidesteps the problem") is right that the
construction never needs the two blocks to agree at the hip; it is worth adding
that the disagreement remains visible in the finished silhouette, by design.

图12-1 also independently confirms two other things: each panel's CB/CF runs
dead straight below the hip line to the hem (corroborating `bodiceblock.md`
Ambiguity 7 from a later chapter, as the Construction notes say), and each side
seam is drawn twice — a solid line and a dashed line slightly *inside* it at the
hem. The dashed line is the `hemTighten` variant, matching p.158's "并另作标记点，
即位于原来的点里面" (mark another point inside the original) exactly.

Result: **pass** — no principle violations. The chapter's own worked example
being absent (Ambiguities are all about curve/constant choices, not sizing)
means there is less here to gate than in `bodiceblock.md`/`skirtblock.md`;
what's gated above is chosen deliberately to be the *new* surface area this
chapter adds, not a re-check of geometry those two specs already passed.

## Proposed INDEX.md row

Replace the existing placeholder row under "Foundation blocks — women's"
(currently `— | Dress block (连衣裙服装的基本型) | ... | candidate | ...`) with:

```
| `dressblock` | Dress block | 英国经典服装纸样设计基础篇 (Bray) | 157–162 | specified | Not a new draft — Ch.12 explicitly joins `bodiceblock` (through HP) and `skirtblock` (hem width only) with a new smooth side-seam curve below the hip line; inherits every measurement/option from both. Ch.11 §7/§8 (pp.155–156) are the matching rules this join sidesteps by construction (see spec). Spec: `dressblock.md` |
```

And update the chapter-map table's Ch.12 row similarly (Portability column
"✅ `dressblock`" in place of "⭐ Dress block — now unblocked by Ch.2 + Ch.11").
