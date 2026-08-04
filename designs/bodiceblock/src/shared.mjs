/*
 * The back and front of the bodice block are different shapes, but they hang off one
 * shared set of structure lines, the waist shaping of the book's section 2 is a
 * bookkeeping exercise across both panels at once, and the armhole calibration of
 * section D.0 needs both panels' armholes at once. All three live here.
 *
 * Reference: docs/patterns/bodiceblock.md (Natalie Bray, 英国经典服装纸样设计 基础篇, pp.13-35)
 * All lengths are millimetres.
 */

export const blockMeasurements = [
  'biceps',
  'chest',
  'hpsToWaistBack',
  'seat',
  'shoulderToShoulder',
  'waist',
  'waistToSeat',
]

/*
 * Every default is the book's own figure for its worked size, which is Table 1-2's row IV
 * (chest 92). `waistEase` is the only band the book states outright (a 3 to 6cm addend on
 * the full pattern); `seatEase` is chosen, because a percentage option needs a minimum and
 * a maximum and nothing constrains it.
 *
 * The other three are bands around a value the block now grades, so they measure a
 * departure from the table rather than a size. Their widths come from the table itself:
 *
 *  - `backWidthPct`: 表1-2 prints XB as a pair per size, and the second figure is exactly
 *    1cm above the first in all ten rows. That 1cm is the book's own within-size back-width
 *    variant, and 10mm at chest 920 is 1.087 percentage points. Applied either way, because
 *    the table names the larger figure but not a smaller one.
 *  - `chestWidthPct`: the same 1.087 points. CH has no printed pair; p.24 pairs it with XB
 *    (round shoulders take back width up and chest width down, erect ones the reverse), so
 *    it is given the same allowance. The magnitude is the table's, the transfer is ours.
 *  - `bustDartWidth`: one step of the 省道 column's own grade, 5mm at chest 920, or 0.543
 *    percentage points. One size step of dart either way.
 *
 * `chestEase` is the only knob that enlarges the block at the side seam -- it moves the
 * front underarm point outward and nothing else. Ch.3 section 7 (pp.45-47) caps that
 * enlargement at 0.5 to 1cm for shirts and tailored garments and 2 to 2.5cm for workwear
 * and loose tops, and past 3 to 5cm sends the drafter to the shoulder instead, a route
 * this block does not implement. 14.66% puts the largest adult stock model (cisMale 50,
 * chest 1316mm) 24.9mm out from where its own default draft puts that point: the
 * loose-garment ceiling, not over it. The floor stays at the book's own 10cm. Grading did
 * buy room to lower it -- the sweep closes down to about 9.7% -- but spending it there
 * would put the worst cell of the option grid back within a millimetre of the drop
 * bracket, which is the state this work was done to get out of.
 *
 * `tests/ranges.test.mjs` sweeps all four across the twenty adult stock models and holds
 * them: at these bounds the solved drop spans -25.8 to 55.8mm inside a [-30, 60] bracket.
 */
export const blockOptions = {
  chestEase: { pct: 10.87, min: 10.87, max: 14.66, menu: 'fit' },
  seatEase: { pct: 6.12, min: 3, max: 10, menu: 'fit' },
  waistEase: { pct: 2.86, min: 2.14, max: 4.29, menu: 'fit' },
  waistFit: { bool: true, menu: 'style' },
  backWidthPct: { pct: 39.13, min: 38.04, max: 40.22, menu: 'fit' },
  chestWidthPct: { pct: 41.3, min: 40.21, max: 42.39, menu: 'fit' },
  bustDartWidth: { pct: 8.15, min: 7.61, max: 8.69, menu: 'fit' },
}

/*
 * 表1-2 主要控制尺寸及比例表, printed p.12, transcribed in full at
 * `docs/patterns/bray-size-table.md`. This is the grading table for the whole volume.
 *
 * `BUST` is the table's own 胸围 B column, and it is the NET body bust rather than
 * bust-plus-ease: row I prints it as `80 + 10`, the 10cm being the standard ease that
 * `chestEase` adds on top, and 臀围 as `86 + 6` alongside `seatEase`'s 6cm. `chest` is the
 * same net measurement, so the columns are read against it directly.
 *
 * The columns step rather than run straight (50, 50, 50, 55, 60, ...), so they are read by
 * piecewise-linear interpolation in `chest`, clamped to the end row outside the table's 80
 * to 116cm range. That reproduces the table exactly at all ten sizes, which makes grading a
 * no-op at row IV, the block's own worked size.
 */
export const BUST = [800, 840, 880, 920, 960, 1000, 1040, 1080, 1120, 1160]
export const BACK_UP_ADDEND = [50, 50, 50, 55, 60, 60, 65, 70, 70, 70] // 后窿门宽
export const O_POINT = [20, 25, 30, 30, 35, 35, 40, 40, 45, 45] // O点

/*
 * The three width columns are graded as fractions of the bust rather than as millimetres.
 * That is the quantity the options carry, and it is what the clamp has to preserve: outside
 * the table a body keeps the end row's proportion, where clamping millimetres would hand a
 * chest-132 body the same 42cm back width the table gives chest 116.
 */
const fractions = (column) => column.map((mm, i) => mm / BUST[i])
export const BACK_WIDTH_PCT = fractions([330, 340, 350, 360, 370, 380, 390, 400, 410, 420]) // 后背宽 XB
export const CHEST_WIDTH_PCT = fractions([350, 360, 370, 380, 390, 400, 420, 430, 445, 460]) // 胸宽 CH
export const BUST_DART_PCT = fractions([60, 65, 70, 75, 80, 85, 90, 95, 100, 105]) // 省道

export function graded(chest, column) {
  if (chest <= BUST[0]) return column[0]
  if (chest >= BUST[BUST.length - 1]) return column[column.length - 1]
  let i = 0
  while (chest > BUST[i + 1]) i++

  return column[i] + ((column[i + 1] - column[i]) * (chest - BUST[i])) / (BUST[i + 1] - BUST[i])
}

/*
 * A graded width the wearer can depart from, in mm. The option's distance from its own
 * default -- which is the book's row IV figure -- is carried across every size, so at its
 * default the option contributes nothing and the block drafts the table exactly.
 */
const gradedWidth = (chest, column, options, key) =>
  chest * (graded(chest, column) + options[key] - blockOptions[key].pct / 100)

/*
 * Fixed millimetre values the book states for its own average size (chest 92), and which
 * Table 1-2 does NOT grade. They stay pinned: every one of them is a waist or curve
 * constant, none appears as a column of the table, and no other page in the extraction
 * gives them per size.
 *
 * The constants the table does grade no longer live here -- 后窿门宽, O点, XB, CH and 省道
 * are read off the columns above. Two more were already graded and are left alone, because
 * the formulas in `structure()` below reproduce the table rather than approximate it:
 * 后领宽's `chest/16 + 12.5` hits all ten rows including the ones the book marks `−`
 * ("a little under"), which the nominal column loses; and 袖窿深's
 * `215 + (chest - 920) x 0.125` is exact on rows II to X, nine consecutive sizes, and runs
 * 5mm under on row I alone, where the table flattens -- inside the 0.5cm the book itself
 * declares ignorable (p.19). Reading either off the nominal column instead would replace a
 * rate the table confirms nine times over with a clamp above chest 116cm.
 */
export const CB_SLANT = 20 // section 2: center back taken in at the waist
export const CF_SLANT = 10 // section 2: center front taken in at the waist
export const SIDE_EXTRA = 10 // section 2: extra side-seam intake, each panel
export const BACK_TAPER = 20 // section 1: plain-block side taper, back
export const FRONT_TAPER = 15 // section 1: plain-block side taper, front
export const DART_ABOVE = 140 // waist dart, distance above the waist line
export const DART_BELOW = 125 // waist dart, distance below the waist line
export const BACK_BISECTOR = 30 // section A.9: armhole smoothing off the underarm corner
export const FRONT_BISECTOR = 15 // section B.12: same, front
export const FRONT_MIDPOINT_AUX = 10 // section B.12: hollowing of the SP-CHP line
export const SHOULDER_GUIDE_X = 165 // section B.5: fixes the front shoulder slope
export const SHOULDER_FLOOR = 10 // p.16: the drafted shoulder seam must reach S + 1cm
export const SHOULDER_IDEAL = 17.5 // p.16: and should ideally reach S + 1.5 to 2cm

/*
 * Section B.12 also requires the front armhole to dig below the bust line before it
 * reaches UP, and still arrive tangent to it. A one-third control length only grazes
 * the bust line (0.2mm); taking the control point out to this fraction of the chord,
 * along the hollow's 45 degree tangent, digs about 3mm at the worked size. The book
 * gives no number for the dig ("略微向下挖"), so the depth is chosen, not quoted. Once
 * the section D.0 calibration has dropped UP below the bust line the same control
 * length simply deepens the scoop, without putting a bump at UP.
 */
export const FRONT_DIG = 0.55

/*
 * Section D.0 armhole calibration
 *
 * The accepted band and the solve target are two different numbers, deliberately.
 * Chapter 2 section 3 (p.29) states the band as TA + 10 to 13cm, and that is what a
 * finished armhole is judged against. The target is pinned tighter, and independently,
 * by the sleeve: the straight sleeve's cap arc is 447.92mm at biceps 300, and the book
 * wants 20 to 25mm of sleevecap ease over the armhole, which leaves only 422.9 to
 * 427.9mm. TA + 12.5cm sits inside both. Retargeting the solver at the band's midpoint
 * or its lower edge would still satisfy chapter 2 and break the sleeve by up to 23mm --
 * designs/sleeveblock/tests/armhole.test.mjs asserts the intersection, so it fails.
 */
export const ARMHOLE_EASE = 125 // solve target, pinned by the sleeve -- not the band's midpoint
export const ARMHOLE_EASE_MIN = 100 // p.29: accepted band, TA + 10cm
export const ARMHOLE_EASE_MAX = 130 // p.29: accepted band, TA + 13cm
export const UPDROP_MIN = -30
export const UPDROP_MAX = 60
export const UPDROP_TOLERANCE = 1 // mm of armhole length; the book ignores up to 5
export const UPDROP_ITERATIONS = 40

/*
 * Geometry, not a book figure, so it carries no page: section B.12 puts the front armhole
 * hollow at `armholePitch.shift(45, FRONT_BISECTOR)`, which is `FRONT_BISECTOR * cos45`
 * outboard of the front pitch point. The pitch point therefore has to stay at least that
 * far inboard of the front underarm point. Any closer and the armhole is wider at the
 * underarm than at the pitch -- it opens as it descends, which no armhole does -- and its
 * lower stretch runs outside the panel's own side-seam line.
 */
export const FRONT_PITCH_CLEARANCE = FRONT_BISECTOR * Math.cos(Math.PI / 4)

/*
 * CHOSEN, NOT SOURCED -- neither number is in Bray.
 *
 * Table 1-2 runs from chest 80 to 116cm, and the grading above clamps to its end rows
 * outside that. A doll or a giant is therefore drafted on the nearest tabulated
 * proportions rather than on its own, which is a guess the book never makes. So a draft
 * the calibration cannot close is a real failure on an adult body and a curiosity off it,
 * and the reports in `solveUpDrop` pick their severity accordingly. Measurements are all
 * the design sees at runtime, and `chest` is the one that drives every graded value here,
 * so the test is a window on it.
 *
 * The bounds are round numbers placed in the gaps between FreeSewing's stock groups:
 * adult chests run 762mm (cisFemale 28) to 1316mm (cisMale 50), the largest doll is 600mm
 * (cisMale 60) and the smallest giant 1387.5mm (cisFemale 150).
 */
export const ADULT_CHEST_MIN = 700
export const ADULT_CHEST_MAX = 1350

/*
 * Everything both panels need. Note that the waist bookkeeping needs both panels'
 * plain-block waist points, and both are computable from the measurements alone, so
 * neither part has to wait on the other.
 *
 * `upDrop` (section D.0) only reaches the side-seam interpolation, which starts at UP.
 * Every field the calibration solver reads is independent of it, so the solver can be
 * handed the `upDrop = 0` structure and still be correct.
 */
export function structure({ measurements, options }, upDrop = 0) {
  const chest = measurements.chest
  const seat = measurements.seat
  const backWidth = gradedWidth(chest, BACK_WIDTH_PCT, options, 'backWidthPct')
  const chestWidth = gradedWidth(chest, CHEST_WIDTH_PCT, options, 'chestWidthPct')
  const neckWidth = chest / 16 + 12.5
  const dartWidth = gradedWidth(chest, BUST_DART_PCT, options, 'bustDartWidth')

  /*
   * `S` is the book's 肩宽: the length of the shoulder seam from NP to SP, 12.5 cm at
   * chest 92. FreeSewing has no shoulder-seam measurement. `shoulderToShoulder` is the
   * straight distance across the back between the two shoulder points, so half of it
   * runs from the center back to SP; taking off the neck width leaves the run from NP
   * to SP, which is the closest stand-in the measurement list offers.
   *
   * On real stock models the proxy over-reads the book's S by roughly 12mm -- the size
   * nearest the book's own chest carries `shoulderToShoulder` 415, giving S = 137.2
   * against the book's 125 -- and the two scales grade differently, so the shoulder
   * check below fires on most sizes. That is an open question, written up with the
   * measured evidence as ambiguity 14 in docs/patterns/bodiceblock.md. Table 1-2 does
   * tabulate 肩宽 (12- to 14.5cm across the ten sizes) but it does not settle this: the
   * mismatch is a level offset in the proxy, not a missing grade, and the table's own
   * note 2 sanctions lengthening the shoulder line as the small-size remedy, which is
   * what the adjustment below already does. Whatever it does, it never fails a draft.
   */
  const shoulderSeam = measurements.shoulderToShoulder / 2 - neckWidth

  /*
   * Vertical structure lines, measured down from the top line
   */
  const yBust = 215 + (chest - 920) * 0.125
  const yWaist = measurements.hpsToWaistBack
  const yHip = yWaist + measurements.waistToSeat
  const yOBack = graded(chest, O_POINT)
  const yBackWidth = Math.round(yBust / 2 / 10) * 10 // the book rounds 21.5 to 22 cm, then halves
  const yShoulderBack = yOBack + 30 // measured from O, not from the top line
  /*
   * The front O sits above the back O by a fixed 30mm even though the back O now grades.
   * Table 1-2 has no column for the offset; p.16 gives it as "略高3cm左右，大号尺寸中还要
   * 略大", a bit more in large sizes but no figure. Keeping it fixed is what holds the
   * book's balance rule (p.30, front 1cm longer than back) at every size -- the front NP
   * stays 10mm above the back NP throughout. Letting the offset grade with O点 instead
   * would collapse that surplus to zero at the smallest size and open it to 25mm at the
   * largest, so the un-graded reading is the one that keeps a stated rule.
   */
  const yOFront = yOBack - 30
  const yChestWidth = yBust - 40
  const yShoulderFront = yOFront + 45 // measured from O, as on the back
  const yNeckDepthFront = yOFront + 75

  /*
   * Horizontal structure. The book gets the front underarm point by subtracting the
   * back one from half the chest-plus-ease, and puts all the hip ease on the front.
   * The underarm drop never touches these, so the finished bust girth comes out the same
   * whatever `upDrop` turns out to be.
   */
  const backUpX = backWidth / 2 + graded(chest, BACK_UP_ADDEND)
  const frontUpX = (chest * (1 + options.chestEase)) / 2 - backUpX
  const backHpX = seat / 4
  const frontHpX = seat / 4 + (seat * options.seatEase) / 2

  /*
   * Section 1 side seam: a straight line from the (calibrated) underarm point to the
   * hip point, with the waist point brought in by the plain block's fixed taper.
   */
  const yUp = yBust + upDrop
  const t = (yWaist - yUp) / (yHip - yUp)
  const backSide1 = backUpX + (backHpX - backUpX) * t - BACK_TAPER
  const frontSide1 = frontUpX + (frontHpX - frontUpX) * t - FRONT_TAPER

  /*
   * Section 2 waist shaping: measure what the plain block gives at the waist, subtract
   * what we want, and split the remainder between the panels in proportion to their
   * plain-block width. Each panel then spends its share on the center slant, the extra
   * side intake, and whatever is left over becomes its waist dart.
   */
  const natural = backSide1 + frontSide1
  const target = measurements.waist / 2 + measurements.waist * options.waistEase
  const reduction = Math.max(0, natural - target)
  const backShare = (reduction * backSide1) / natural
  const frontShare = (reduction * frontSide1) / natural

  return {
    backWidth,
    chestWidth,
    neckWidth,
    dartWidth,
    shoulderSeam,
    yBust,
    yWaist,
    yHip,
    yOBack,
    yBackWidth,
    yShoulderBack,
    yOFront,
    yChestWidth,
    yShoulderFront,
    yNeckDepthFront,
    backUpX,
    frontUpX,
    backHpX,
    frontHpX,
    backSide1,
    frontSide1,
    natural,
    target,
    reduction,
    backShare,
    frontShare,
    backDart: Math.max(0, backShare - CB_SLANT - SIDE_EXTRA),
    frontDart: Math.max(0, frontShare - CF_SLANT - SIDE_EXTRA),
  }
}

/*
 * Book p.16: the drafted shoulder seam should be at least S + 1cm, ideally S + 1.5 to
 * 2cm, and a short one is lengthened outward with SP keeping the height it was drafted
 * at ("无论加长或缩短肩宽，SP点都必须在原有高度上不变").
 *
 * A short shoulder is taken to the middle of the ideal band rather than parked on the
 * floor. That matters because the check fires on most stock sizes (ambiguity 14): where
 * it does, `backWidthPct` stops controlling the shoulder, and leaving those drafts on
 * the bare minimum would mean the block never reaches the fit the book asks for. There
 * is deliberately no branch for an over-long shoulder -- no stock model produces one.
 *
 * Returns the check as data; the caller decides what to say about it. Nothing here
 * throws or fails -- see the note on the `shoulderToShoulder` mapping in `structure()`.
 */
export function backShoulderCheck(Point, st) {
  const np = new Point(st.neckWidth, st.yOBack - 20)
  const drafted = new Point(st.backWidth / 2 + 20, st.yShoulderBack)
  const minimum = st.shoulderSeam + SHOULDER_FLOOR
  const target = st.shoulderSeam + SHOULDER_IDEAL
  const length = np.dist(drafted)
  if (length >= minimum) return { np, sp: drafted, length, minimum, target, adjusted: false }

  const rise = drafted.y - np.y

  return {
    np,
    sp: new Point(np.x + Math.sqrt(target ** 2 - rise ** 2), drafted.y),
    length,
    minimum,
    target,
    adjusted: true,
  }
}

/*
 * The armhole region of each panel, for a given underarm drop. Both are pure -- no
 * store, no logging, no part state -- so the calibration solver can evaluate them as
 * often as it likes before either part starts drafting.
 *
 * The underarm corner follows UP rather than staying on the bust line: p.19 says to
 * redraw the armhole through the new point, so the same smoothing rule is applied at
 * the new underarm level.
 */
export function backArmholeRegion({ Point }, st, upDrop) {
  const p = {}
  const shoulder = backShoulderCheck(Point, st)
  p.np = shoulder.np
  p.sp = shoulder.sp
  p.armholePitch = new Point(st.backWidth / 2, st.yBackWidth)
  p.up = new Point(st.backUpX, st.yBust + upDrop)

  p.armholeCorner = new Point(p.armholePitch.x, p.up.y)
  p.armholeHollow = p.armholeCorner.shift(45, BACK_BISECTOR)

  const toHollow = p.armholePitch.dist(p.armholeHollow) / 3
  p.pitchCp2 = p.armholePitch.shift(-90, toHollow)
  p.hollowCp1 = p.armholeHollow.shift(135, toHollow)

  const toUp = p.armholeHollow.dist(p.up) / 3
  p.hollowCp2 = p.armholeHollow.shift(-45, toUp)
  p.upCp = p.up.shift(180, toUp)

  const toPitch = p.sp.dist(p.armholePitch) / 3
  p.pitchCp1 = p.armholePitch.shift(90, toPitch)
  p.spCp = p.sp.shift(p.np.angle(p.sp) - 90, toPitch)

  return p
}

export function frontArmholeRegion({ Point, utils }, st, upDrop) {
  const p = {}
  p.np = new Point(st.neckWidth, st.yOFront)
  p.shoulderGuide = new Point(SHOULDER_GUIDE_X, st.yShoulderFront)
  const rayAngle = p.np.angle(p.shoulderGuide)
  p.sp = p.np.shift(rayAngle, st.shoulderSeam + st.dartWidth)
  p.chestWidthPoint = new Point(st.chestWidth / 2, st.yChestWidth)
  // The armhole passes 2 cm outside the chest-width guide point (figure 2-2)
  p.armholePitch = new Point(st.chestWidth / 2 + 20, st.yChestWidth)
  p.up = new Point(st.frontUpX, st.yBust + upDrop)

  /*
   * The shoulder/bust dart: apex a quarter of the chest width out from the center
   * front and 2cm below the bust line, inner leg 2cm back along the shoulder ray from
   * the point directly above the apex, outer leg a dart width further out.
   */
  p.bustApex = new Point(st.chestWidth / 4, st.yBust + 20)
  p.dartOnRay = utils.beamIntersectsX(p.np, p.sp, p.bustApex.x)
  p.dartInner = p.dartOnRay.shiftTowards(p.np, 20)
  p.dartOuter = p.dartInner.shift(rayAngle, st.dartWidth)

  p.armholeCorner = new Point(p.armholePitch.x, p.up.y)
  p.armholeHollow = p.armholeCorner.shift(45, FRONT_BISECTOR)

  const toHollow = p.armholePitch.dist(p.armholeHollow) / 3
  p.pitchCp2 = p.armholePitch.shift(-90, toHollow)
  p.hollowCp1 = p.armholeHollow.shift(135, toHollow)

  const toUp = p.armholeHollow.dist(p.up)
  p.hollowCp2 = p.armholeHollow.shift(-45, toUp * FRONT_DIG) // digs below the bust line
  p.upCp = p.up.shift(180, toUp / 3) // and still arrives tangent to it

  /*
   * Above the pitch point, the straight shoulder-point to chest-width-point line is
   * hollowed by 1cm at its midpoint. Offsetting both control points inward by four
   * thirds of that puts the curve's own midpoint exactly 1cm in.
   */
  const inward = p.sp.angle(p.armholePitch) - 90
  const aux = (4 * FRONT_MIDPOINT_AUX) / 3
  p.spCp = p.sp.shiftFractionTowards(p.armholePitch, 1 / 3).shift(inward, aux)
  p.pitchCp1 = p.sp.shiftFractionTowards(p.armholePitch, 2 / 3).shift(inward, aux)

  return p
}

/*
 * The armhole runs underarm point -> hollow -> pitch -> shoulder point on both panels,
 * so the two length helpers the sleeve contract asks for are shared.
 */
export function armholePath(points, Path) {
  return new Path()
    .move(points.up)
    .curve(points.upCp, points.hollowCp2, points.armholeHollow)
    .curve(points.hollowCp1, points.pitchCp2, points.armholePitch)
    .curve(points.pitchCp1, points.spCp, points.sp)
}

export function armholeToPitchPath(points, Path) {
  return new Path()
    .move(points.up)
    .curve(points.upCp, points.hollowCp2, points.armholeHollow)
    .curve(points.hollowCp1, points.pitchCp2, points.armholePitch)
}

/*
 * Total front + back armhole length, measured along the curves the way the book
 * measures it with a tape (p.19).
 */
export function armholeLength(sh, st, upDrop) {
  const { Path } = sh

  return (
    armholePath(backArmholeRegion(sh, st, upDrop), Path).length() +
    armholePath(frontArmholeRegion(sh, st, upDrop), Path).length()
  )
}

/*
 * Section D.0: Bray does not treat the drafted armhole as final. He measures it with a
 * tape, raises or lowers UP, redraws, and measures again, until the armhole comes out
 * inside the accepted band above; half a centimetre of residual error is ignorable (p.19).
 * We close that loop by bisection instead of by hand.
 *
 * `upDrop` shifts UP's y only. The bust line, and with it the block's finished bust
 * girth and `chestEase`, are untouched -- only the underarm gets deeper.
 *
 * This is a pre-pass: both panels must use the same value, since front and back UP are
 * one point once the side seam is sewn. It is cached on the set store, so the second
 * part to draft reads the answer rather than solving it again.
 *
 * Remedy 1, raising SP, is the one p.29 puts first, and it is deliberately not here.
 * Bray scopes it to square-shouldered figures, which is a judgement about posture, and
 * FreeSewing has no posture signal to make it with: `shoulderSlope` is a hardcoded 13
 * degrees for every stock model, every size and both genders -- `neckstimate.mjs` reads
 * `shoulderSlope: [13, 13]` and returns it unchanged -- so it carries no information
 * about this wearer. Tried against the block's own drafted slope it declares 34 of 40
 * stock models square and hands the armhole 9 to 23mm that remedy 3 then takes back off,
 * driving `upDrop` negative on six cisFemale sizes: the cascade working against itself.
 * Leaving a scoped remedy inactive for want of its input is following the chapter;
 * applying it to everyone is not. It becomes available the day a real measured shoulder
 * angle can be relied on, and not before.
 */
export function solveUpDrop(sh, st) {
  const { store, measurements } = sh
  const cached = store.get('bodiceblock.upDrop', false)
  if (cached !== false) return cached

  const mm = (x) => Math.round(x)

  /*
   * Anything the block cannot draft its way out of is reported here, at a severity set by
   * the adult window above: on an adult body the pattern is wrong and CI has to say so,
   * off it the constants were never going to hold and a note is all that is honest.
   */
  const adult = measurements.chest >= ADULT_CHEST_MIN && measurements.chest <= ADULT_CHEST_MAX
  const report = (msg) => (adult ? store.log.error(msg) : store.log.warn(msg))

  /*
   * The section B.12 clearance, checked before anything is drawn from these points.
   */
  const clearance = st.frontUpX - (st.chestWidth / 2 + 20)
  if (clearance < FRONT_PITCH_CLEARANCE)
    report(
      `bodiceblock: the front pitch point sits only ${mm(clearance)}mm inboard of the front ` +
        `underarm point, where the section B.12 armhole hollow needs at least ` +
        `${Math.round(FRONT_PITCH_CLEARANCE * 10) / 10}mm. The front armhole opens as it ` +
        `descends and its lower stretch crosses the panel's own side seam. Widen the armhole ` +
        `bridge -- more chestEase, or less backWidthPct or chestWidthPct.`
    )

  const target = measurements.biceps + ARMHOLE_EASE
  const uncalibrated = armholeLength(sh, st, 0)

  /*
   * The armhole grows monotonically with the drop, so plain bisection is enough.
   * Outside the bracket we clamp and report: a block that drafts with a complaint beats a
   * block that throws.
   */
  let low = UPDROP_MIN
  let high = UPDROP_MAX
  let drop = 0
  if (armholeLength(sh, st, low) >= target) drop = low
  else if (armholeLength(sh, st, high) <= target) drop = high
  else {
    for (let i = 0; i < UPDROP_ITERATIONS; i++) {
      drop = (low + high) / 2
      const length = armholeLength(sh, st, drop)
      if (Math.abs(length - target) <= UPDROP_TOLERANCE) break
      if (length < target) low = drop
      else high = drop
    }
  }

  const calibrated = armholeLength(sh, st, drop)
  const band = [measurements.biceps + ARMHOLE_EASE_MIN, measurements.biceps + ARMHOLE_EASE_MAX]
  if (Math.abs(calibrated - target) > UPDROP_TOLERANCE) {
    report(
      `bodiceblock: could not calibrate the armhole inside the [${UPDROP_MIN}, ${UPDROP_MAX}]mm ` +
        `underarm-drop bracket. Clamped to ${mm(drop)}mm, which gives an armhole of ` +
        `${mm(calibrated)}mm against a target of ${mm(target)}mm. ` +
        (calibrated < band[0] || calibrated > band[1]
          ? `That is outside p.29's accepted band of ${mm(band[0])} to ${mm(band[1])}mm, so no ` +
            `sleeve drafted to this armhole will set in.`
          : `It is still inside p.29's accepted band of ${mm(band[0])} to ${mm(band[1])}mm.`)
    )
  }

  /*
   * Report the cascade: p.29 ranks the remedies, the block works through the two it can
   * use, and the only thing worth saying afterwards is which of them did the work. Said
   * on every draft rather than past some threshold -- the book gives no threshold, and
   * one we invented would be a number nothing supports. The early return above keeps it
   * to once per draft rather than once per panel.
   */
  const bridge = st.backUpX + st.frontUpX - st.backWidth / 2 - st.chestWidth / 2
  store.log.info(
    `bodiceblock: the armhole drafted at ${mm(uncalibrated)}mm against a target of ` +
      `${mm(target)}mm (accepted band biceps + ${ARMHOLE_EASE_MIN} to ${ARMHOLE_EASE_MAX}mm). ` +
      `Bray's three remedies, in her order (p.29): [1] raise SP, her first preference and ` +
      `yours to make if you know yourself to be square-shouldered, since the block cannot ` +
      `detect posture; [2] widen the armhole bridge, ${mm(bridge)}mm here -- it is ` +
      `halfChestPlusEase - backWidth/2 - chestWidth/2, so the only ways to widen it are more ` +
      `chestEase, paid for in bust girth, or less backWidthPct or chestWidthPct, paid for in a ` +
      `narrower back or chest; all three are yours to set and the block will not spend them ` +
      `for you; [3] lower UP, +${mm(calibrated - uncalibrated)}mm at a ${mm(drop)}mm drop. ` +
      `Final armhole ${mm(calibrated)}mm.`
  )

  store.set('bodiceblock.upDrop', drop)
  store.set('bodiceblock.armholeTarget', target)
  store.set('bodiceblock.armholeUncalibrated', uncalibrated)
  store.set('bodiceblock.armholeCalibrated', calibrated)

  return drop
}

/*
 * Writes the four keys the library sleeve reads off the store, from the calibrated
 * curves. See the contract at the bottom of designs/library/src/index.mjs.
 */
export function storeArmhole(store, points, Path, side) {
  for (const type of ['sleeve', 'twoPartSleeve', 'topsleeve', 'undersleeve']) {
    store.set(`library.${type}.${side}ArmholeLength`, armholePath(points, Path).length())
    store.set(
      `library.${type}.${side}ArmholeToArmholePitch`,
      armholeToPitchPath(points, Path).length()
    )
  }
}

/*
 * Center line and side seam both leave and arrive vertically, so their control points
 * are a plain fraction of the vertical run.
 */
export function verticalCurve(points, from, to, name) {
  const run = Math.abs(to.y - from.y) / 3
  points[`${name}Cp1`] = from.shift(-90, run)
  points[`${name}Cp2`] = to.shift(90, run)
}

/*
 * Draws a waist dart as a closed fish, centered on `x`, straddling the waist line.
 */
export function waistDart({ Point, Path, points, paths }, x, yWaist, intake) {
  if (intake <= 0) return
  points.dartTop = new Point(x, yWaist - DART_ABOVE)
  points.dartBottom = new Point(x, yWaist + DART_BELOW)
  points.dartLeft = new Point(x - intake / 2, yWaist)
  points.dartRight = new Point(x + intake / 2, yWaist)
  paths.waistDart = new Path()
    .move(points.dartTop)
    .line(points.dartLeft)
    .line(points.dartBottom)
    .line(points.dartRight)
    .line(points.dartTop)
    .close()
    .addClass('fabric')
}
