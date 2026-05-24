import { scaleAllPoints } from '../../../../shared.mjs'

function draft_path4(
  Path,
  Point,
  paths,
  points,
  measurements,
  options,
  utils,
  macro,
  part,
  store,
  log
) {
  const drawNeckCurve = () => {
    return new Path()
      .move(points.neckBack)
      .curve(points.neckOuter_cp1, points.neckOuter_cp2, points.neckOuter_ep)
  }

  // Path: path4
  points.path4_p1 = new Point(781.7, 296.9)
  points.hairOuter = new Point(865.8, 328)
  points.hairCenter_cp1 = new Point(912.8, 216.8)
  points.hairCenter_cp2 = new Point(883.2, 115.8)
  points.hairCenter_ep = new Point(798.7, 47.4)
  points.neckBack = new Point(740, 134.4)
  points.neckOuter_cp1 = new Point(788.6, 162.8)
  points.neckOuter_cp2 = new Point(804.8, 236.6)
  points.neckOuter_ep = new Point(781.7, 296.5)

  points.neckAdjustmentCenter = new Point(670, 240)

  points.title = new Point(770, 124.4)

  points.grainlineFrom = points.hairOuter.shiftFractionTowards(points.hairCenter_ep, 0.2)

  scaleAllPoints(part, options.totalSize * options.hairlineHeadScale)

  for (let p in points) {
    points[p] = points[p].rotate(75, points.title)
  }

  //Match neck seam length
  paths.neckCurve = drawNeckCurve()

  const neckLengthHalf =
    store.get('neckLengthBack') + store.get('neckLengthArm') + store.get('neckLengthFront')

  log.debug('Neck curve length to fit the body is ' + neckLengthHalf)
  store.set('neckLengthHalf', neckLengthHalf)
  const neckAdjustmentPoints = ['neckBack', 'neckOuter_cp1', 'neckOuter_cp2', 'neckOuter_ep']
  let neckCurveDelta = neckLengthHalf / 2 - paths.neckCurve.length()
  let neckCurveIterations = 0

  while (neckCurveIterations < 5 && Math.abs(neckCurveDelta) > 0.001 * options.totalSize) {
    log.debug('Back neck iteration ' + neckCurveIterations + ', delta ' + neckCurveDelta)

    for (let p of neckAdjustmentPoints) {
      points[p] = points[p].shiftTowards(points.neckAdjustmentCenter, -neckCurveDelta * 0.785)
    }

    paths.neckCurve = drawNeckCurve()
    neckCurveDelta = neckLengthHalf / 2 - paths.neckCurve.length()

    neckCurveIterations = neckCurveIterations + 1
  }
  //Neck adjustment is done!

  paths.hairCurve = new Path()
    .move(points.hairOuter)
    .curve(points.hairCenter_cp1, points.hairCenter_cp2, points.hairCenter_ep)

  points.neckCurveCenter = paths.neckCurve.shiftFractionAlong(0.5)
  points.hairCurveCenter = paths.hairCurve.shiftFractionAlong(0.5)

  paths.path4 = new Path()
    .move(points.path4_p1)
    .line(points.hairOuter)
    .join(paths.hairCurve)
    .line(points.neckBack)
    .join(paths.neckCurve)
    .line(points.path4_p1)
}

export { draft_path4 }
