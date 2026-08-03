/*
 * The qun front and back outlines are congruent -- they only differ in their darts.
 * So the block geometry lives here, and both parts call into it.
 */

export const blockMeasurements = ['seat', 'waist', 'waistToSeat', 'waistToKnee']

export const blockOptions = {
  seatEase: { pct: 6.1, min: 3, max: 10, menu: 'fit' },
  lengthBonus: { pct: 25, min: 0, max: 60, menu: 'style' },
  silhouette: { dflt: 'standard', list: ['standard', 'straight'], menu: 'style' },
}

/*
 * Drafts the half-block outline that both parts share.
 * `c` is the prefix of the center-edge points: `cb` on the back, `cf` on the front.
 * Returns the values the parts need to place their darts.
 */
export function draftBlock({ Point, points, measurements, options }, c) {
  const halfHip = (measurements.seat * (1 + options.seatEase)) / 2
  const partWidth = halfHip / 2
  const stripW = halfHip / 4
  const seatDepth = measurements.waistToSeat
  const kneeDepth = measurements.waistToKnee
  const length = measurements.waistToKnee * (1 + options.lengthBonus)
  const yokeDepth = measurements.waistToSeat * (15 / 22)
  const gap = options.silhouette === 'standard' ? Math.floor(halfHip / 10 / 3) : 12

  /*
   * The outer strip pivots on its hip-line point so the two knee points separate by
   * `gap`. That swings the hem away from the center and overlaps the strip tops,
   * which shortens and curves the waist edge.
   */
  const angle = ((gap / (kneeDepth - seatDepth)) * 180) / Math.PI

  points[`${c}Waist`] = new Point(0, 0)
  points[`${c}Seat`] = new Point(0, seatDepth)
  points[`${c}Hem`] = new Point(0, length)
  points.hinge = new Point(stripW, seatDepth)

  points.topInner = new Point(stripW, 0).rotate(angle, points.hinge)
  points.sideWaistRaw = new Point(partWidth, 0).rotate(angle, points.hinge)
  points.sideSeat = new Point(partWidth, seatDepth).rotate(angle, points.hinge)
  points.sideKnee = new Point(partWidth, kneeDepth).rotate(angle, points.hinge)
  points.sideHem = new Point(partWidth, length).rotate(angle, points.hinge)

  /*
   * Waist reduction: the book measures waist/2 along the drawn waist edge and takes
   * the remainder. That edge runs from the center edge to where the rotated strip's
   * top crosses the waistline, and on to the side-waist corner.
   */
  points.waistCross = points.topInner.shiftFractionTowards(
    points.sideWaistRaw,
    points.topInner.y / (points.topInner.y - points.sideWaistRaw.y)
  )
  const traced = points.waistCross.x + points.waistCross.dist(points.sideWaistRaw)
  const reduction = 2 * traced - measurements.waist / 2

  // Half of the reduction goes to the side seams, so a quarter to each part
  points.sideWaist = points.sideWaistRaw.shiftTowards(points.topInner, reduction / 4)

  /*
   * Waist: shallow curve, square to the center edge, running into the rotated
   * strip's top edge at the side-waist corner.
   */
  const waistChord = points[`${c}Waist`].dist(points.sideWaist)
  points.waistCp1 = points[`${c}Waist`].shift(0, waistChord / 3)
  points.waistCp2 = points.sideWaist.shiftTowards(points.topInner, waistChord / 3)

  /*
   * Side seam: curves into the (straight) below-hip edge at the hip line
   */
  const sideAngle = points.sideSeat.angle(points.sideHem)
  const sideChord = points.sideWaist.dist(points.sideSeat)
  points.sideCp1 = points.sideWaist.shift(sideAngle, sideChord / 3)
  points.sideCp2 = points.sideSeat.shift(sideAngle + 180, sideChord / 3)

  /*
   * Hem: shallow curve, square to the center edge
   */
  const hemChord = points.sideHem.dist(points[`${c}Hem`])
  points.hemCp1 = points.sideHem.shift(points.sideHem.angle(points.sideSeat) + 90, hemChord / 3)
  points.hemCp2 = points[`${c}Hem`].shift(0, hemChord / 3)

  return { dartIntake: reduction / 6, yokeDepth, partWidth }
}

/*
 * Places a dart with its tip on the yoke line at `tipX`, and its legs on the waist
 * curve, `intake` apart, centered on the curve point directly above the tip.
 */
export function addDart({ Point, points }, waist, name, tipX, yokeDepth, intake) {
  points[`${name}Tip`] = new Point(tipX, yokeDepth)
  const at = waist.measureAlong(waist.intersectsX(tipX)[0])
  points[`${name}Left`] = waist.shiftAlong(at - intake / 2)
  points[`${name}Right`] = waist.shiftAlong(at + intake / 2)
}

/*
 * Weaves the legs of the named darts into the waist curve
 */
export function weaveDarts(waist, points, names) {
  let seam = false
  let rest = waist
  for (const name of names) {
    const [before, opening] = rest.split(points[`${name}Left`])
    const leg = before.line(points[`${name}Tip`]).line(points[`${name}Right`])
    seam = seam ? seam.join(leg) : leg
    rest = opening.split(points[`${name}Right`])[1]
  }

  return seam.join(rest)
}
