/*
 * The back and front of the bodice block are different shapes, but they hang off one
 * shared set of structure lines, and the waist shaping of the book's section 2 is a
 * bookkeeping exercise across both panels at once. Both live here.
 *
 * Reference: docs/patterns/bodiceblock.md (Natalie Bray, 英国经典服装纸样设计 基础篇, pp.13-35)
 * All lengths are millimetres.
 */

export const blockMeasurements = [
  'chest',
  'seat',
  'waist',
  'hpsToWaistBack',
  'waistToSeat',
  'shoulderToShoulder',
]

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
 * (bodiceblock.md ambiguity 4).
 */
export const CB_SLANT = 20 // section 2: center back taken in at the waist
export const CF_SLANT = 10 // section 2: center front taken in at the waist
export const SIDE_EXTRA = 10 // section 2: extra side-seam intake, each panel
export const BACK_TAPER = 20 // section 1: plain-block side taper, back
export const FRONT_TAPER = 15 // section 1: plain-block side taper, front
export const DART_ABOVE = 140 // waist dart, distance above the waist line
export const DART_BELOW = 125 // waist dart, distance below the waist line

/*
 * Everything both panels need. Note that the waist bookkeeping needs both panels'
 * plain-block waist points, and both are computable from the measurements alone, so
 * neither part has to wait on the other.
 */
export function structure({ measurements, options }) {
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
   */
  const backUpX = backWidth / 2 + 55
  const frontUpX = (chest * (1 + options.chestEase)) / 2 - backUpX
  const backHpX = seat / 4
  const frontHpX = seat / 4 + (seat * options.seatEase) / 2

  /*
   * Section 1 side seam: a straight line from the underarm point to the hip point,
   * with the waist point brought in by the plain block's fixed taper.
   */
  const t = (yWaist - yBust) / (yHip - yBust)
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
 * Writes the four keys the library sleeve reads off the store. See the contract at the
 * bottom of designs/library/src/index.mjs.
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
 * The armhole curves into the underarm point square to the bust line, and the book
 * smooths it through a point on the bisector of the right angle where the panel's
 * width guide line crosses the bust line. That gives us three tangent directions --
 * vertical at the pitch point, 45 degrees at the hollow, horizontal at the underarm --
 * and the control points follow from them.
 */
export function armholeControlPoints({ Point, points }, bisector) {
  points.armholeCorner = new Point(points.armholePitch.x, points.up.y)
  points.armholeHollow = points.armholeCorner.shift(45, bisector)

  const toHollow = points.armholePitch.dist(points.armholeHollow) / 3
  points.pitchCp2 = points.armholePitch.shift(-90, toHollow)
  points.hollowCp1 = points.armholeHollow.shift(135, toHollow)

  const toUp = points.armholeHollow.dist(points.up) / 3
  points.hollowCp2 = points.armholeHollow.shift(-45, toUp)
  points.upCp = points.up.shift(180, toUp)
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
