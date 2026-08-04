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
  /*
   * Remedy 2 of p.29, the armhole bridge (隆门宽): the span left between the back-width
   * and chest-width lines, `halfChestPlusEase - backWidth/2 - chestWidth/2`, 140mm at the
   * book's own size. Widening it is the only way to get a bigger armhole without either
   * dropping UP or narrowing the wearer, and it necessarily spends chest ease.
   *
   * The default is 0, and that is Bray's own condition rather than a dodge: the remedy
   * reads 如果能够获得一个较宽的袖窿 -- *if* a wider armhole is obtainable. Only the wearer
   * knows whether it is, so a non-zero default would spend ease nobody granted.
   */
  armholeBridgeBonus: { pct: 0, min: 0, max: 5, menu: 'fit' },
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
   * On real stock models the proxy over-reads the book's S by roughly 12mm -- the size
   * nearest the book's own chest carries `shoulderToShoulder` 415, giving S = 137.2
   * against the book's 125 -- and the two scales grade differently, so the shoulder
   * check below fires on most sizes. That is an open question, written up with the
   * measured evidence as ambiguity 14 in docs/patterns/bodiceblock.md; settling it
   * needs chapter 1's grading table, which is outside the extracted pages. Whatever it
   * does, it never fails a draft.
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
   * The underarm drop never touches these, so the finished bust girth comes out the same
   * whatever `upDrop` turns out to be. The bridge bonus does: it pushes both underarm
   * points out by half of itself, which is the whole of remedy 2 -- the bridge widens by
   * the bonus, the assembled armhole with it, and the half bust by the same amount. The
   * width lines themselves, and everything hanging off them, stay where they were.
   */
  const bridgeBonus = chest * options.armholeBridgeBonus
  const backUpXPlain = backWidth / 2 + 55
  const backUpX = backUpXPlain + bridgeBonus / 2
  const frontUpX = (chest * (1 + options.chestEase)) / 2 - backUpXPlain + bridgeBonus / 2
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
    bridgeBonus,
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
 * `st` arrives with remedy 2 already in it -- the bridge bonus is structure, not search,
 * spent once and measured rather than solved for. All this has to find is the deficit it
 * leaves. To say how much it contributed, the armhole is re-measured against a structure
 * with the bonus spent back down to zero, which is the block Bray starts from.
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
  const { store, measurements, options } = sh
  const cached = store.get('bodiceblock.upDrop', false)
  if (cached !== false) return cached

  const target = measurements.biceps + ARMHOLE_EASE
  const noBridge = structure({ measurements, options: { ...options, armholeBridgeBonus: 0 } })
  const uncalibrated = armholeLength(sh, noBridge, 0)
  const afterBridge = armholeLength(sh, st, 0)

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

  /*
   * Report the cascade: p.29 ranks the remedies, the block works through the two it can
   * use, and the only thing worth saying afterwards is which of them did the work. Said
   * on every draft rather than past some threshold -- the book gives no threshold, and
   * one we invented would be a number nothing supports. The early return above keeps it
   * to once per draft rather than once per panel.
   */
  const mm = (x) => Math.round(x)
  store.log.info(
    `bodiceblock: the armhole drafted at ${mm(uncalibrated)}mm against a target of ` +
      `${mm(target)}mm (accepted band biceps + ${ARMHOLE_EASE_MIN} to ${ARMHOLE_EASE_MAX}mm). ` +
      `Bray's three remedies, in her order (p.29): [1] raise SP, her first preference and ` +
      `yours to make if you know yourself to be square-shouldered, since the block cannot ` +
      `detect posture; [2] widen the armhole bridge, ` +
      (st.bridgeBonus > 0
        ? `+${mm(afterBridge - uncalibrated)}mm -- armholeBridgeBonus spent ${mm(st.bridgeBonus)}mm of it; `
        : `no change -- armholeBridgeBonus is 0, so raise it if a wider armhole is obtainable, ` +
          `bearing in mind it spends chest ease; `) +
      `[3] lower UP, +${mm(calibrated - afterBridge)}mm at a ${mm(drop)}mm drop. ` +
      `Final armhole ${mm(calibrated)}mm.`
  )

  store.set('bodiceblock.upDrop', drop)
  store.set('bodiceblock.armholeTarget', target)
  store.set('bodiceblock.armholeUncalibrated', uncalibrated)
  store.set('bodiceblock.armholeAfterBridge', afterBridge)
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
