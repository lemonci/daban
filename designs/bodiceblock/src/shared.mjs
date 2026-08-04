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
 * The book states none of these ranges -- only `waistEase` has a stated band (a 3 to
 * 6cm addend on the full pattern). The rest are chosen, because a percentage option
 * needs a minimum and a maximum; every default is the book's own figure.
 */
export const blockOptions = {
  chestEase: { pct: 10.87, min: 6, max: 16, menu: 'fit' },
  seatEase: { pct: 6.12, min: 3, max: 10, menu: 'fit' },
  waistEase: { pct: 2.86, min: 2.14, max: 4.29, menu: 'fit' },
  waistFit: { bool: true, menu: 'style' },
  backWidthPct: { pct: 39.13, min: 36, max: 42, menu: 'fit' },
  chestWidthPct: { pct: 41.3, min: 38, max: 45, menu: 'fit' },
  bustDartWidth: { pct: 8.15, min: 6, max: 11, menu: 'fit' },
}

/*
 * Fixed millimetre values the book states for its own average size (chest 92).
 * The chapter grades them in bands but the grading table lives in chapter 1, which is
 * outside the extracted page range, so the spec pins them at the average-figure value
 * (bodiceblock.md ambiguity 4). A consequence worth knowing: the block does not scale
 * far below adult size -- doll models draft without errors, but the shape they give is
 * meaningless because these constants stay put while everything else shrinks.
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
 */
export const ARMHOLE_EASE = 125 // book: armhole = TA + 120..130mm; midpoint
export const UPDROP_MIN = -30
export const UPDROP_MAX = 60
export const UPDROP_TOLERANCE = 1 // mm of armhole length; the book ignores up to 5
export const UPDROP_ITERATIONS = 40

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
  const backWidth = chest * options.backWidthPct
  const chestWidth = chest * options.chestWidthPct
  const neckWidth = chest / 16 + 12.5
  const dartWidth = chest * options.bustDartWidth

  /*
   * `S` is the book's 肩宽: the length of the shoulder seam from NP to SP, 12.5 cm at
   * chest 92. FreeSewing has no shoulder-seam measurement. `shoulderToShoulder` is the
   * straight distance across the back between the two shoulder points, so half of it
   * runs from the center back to SP; taking off the neck width leaves the run from NP
   * to SP, which is the closest stand-in the measurement list offers.
   *
   * It is a horizontal projection standing in for a slanted seam, so it reads about
   * 10mm short by construction (worked example: 130mm projected against 139.3mm
   * drafted). Close enough to be worth checking, not close enough to gate a draft: the
   * check in `backShoulderCheck()` never fails and never throws, and no measurement can
   * make the block undraftable through it.
   */
  const shoulderSeam = measurements.shoulderToShoulder / 2 - neckWidth

  /*
   * Vertical structure lines, measured down from the top line
   */
  const yBust = 215 + (chest - 920) * 0.125
  const yWaist = measurements.hpsToWaistBack
  const yHip = yWaist + measurements.waistToSeat
  const yOBack = 30
  const yBackWidth = Math.round(yBust / 2 / 10) * 10 // the book rounds 21.5 to 22 cm, then halves
  const yShoulderBack = yOBack + 30 // measured from O, not from the top line
  const yOFront = yOBack - 30
  const yChestWidth = yBust - 40
  const yShoulderFront = yOFront + 45 // measured from O, as on the back
  const yNeckDepthFront = yOFront + 75

  /*
   * Horizontal structure. The book gets the front underarm point by subtracting the
   * back one from half the chest-plus-ease, and puts all the hip ease on the front.
   * The calibration never touches these, so the finished bust girth comes out the same
   * whatever `upDrop` turns out to be.
   */
  const backUpX = backWidth / 2 + 55
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
 * Returns the check as data; the caller decides what to say about it. Nothing here
 * throws or fails -- see the note on the `shoulderToShoulder` mapping in `structure()`.
 */
export function backShoulderCheck(Point, st) {
  const np = new Point(st.neckWidth, st.yOBack - 20)
  const drafted = new Point(st.backWidth / 2 + 20, st.yShoulderBack)
  const minimum = st.shoulderSeam + 10
  const length = np.dist(drafted)
  if (length >= minimum) return { np, sp: drafted, length, minimum, adjusted: false }

  const rise = drafted.y - np.y

  return {
    np,
    sp: new Point(np.x + Math.sqrt(minimum ** 2 - rise ** 2), drafted.y),
    length,
    minimum,
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
 * at TA + 12..13cm; half a centimetre of residual error is declared ignorable (p.19).
 * We close that loop by bisection instead of by hand.
 *
 * `upDrop` shifts UP's y only. The bust line, and with it the block's finished bust
 * girth and `chestEase`, are untouched -- only the underarm gets deeper.
 *
 * This is a pre-pass: both panels must use the same value, since front and back UP are
 * one point once the side seam is sewn. It is cached on the set store, so the second
 * part to draft reads the answer rather than solving it again.
 */
export function solveUpDrop(sh, st) {
  const { store, measurements } = sh
  const cached = store.get('bodiceblock.upDrop', false)
  if (cached !== false) return cached

  const target = measurements.biceps + ARMHOLE_EASE
  const uncalibrated = armholeLength(sh, st, 0)

  /*
   * The armhole grows monotonically with the drop, so plain bisection is enough.
   * Outside the bracket we clamp and warn: a block that drafts with a warning beats a
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
  if (Math.abs(calibrated - target) > UPDROP_TOLERANCE) {
    store.log.warn(
      `bodiceblock: could not calibrate the armhole inside the [${UPDROP_MIN}, ${UPDROP_MAX}]mm ` +
        `underarm-drop bracket. Clamped to ${Math.round(drop)}mm, which gives an armhole of ` +
        `${Math.round(calibrated)}mm against a target of ${Math.round(target)}mm.`
    )
  }

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
