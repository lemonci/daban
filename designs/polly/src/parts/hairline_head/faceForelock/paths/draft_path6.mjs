import { scaleAllPoints } from '../../../../shared.mjs'

function draft_path6(
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
      .move(points.neckInner_ep)
      .curve(points.neckOuter_cp1, points.neckOuter_cp2, points.neckOuter_ep)
  }

  // Path: path6
  points.path6_p1 = new Point(880.6, 725.6)
  points.dartTop_cp1 = new Point(971.3, 802.6)
  points.dartTop_cp2 = new Point(1048.3, 839)
  points.dartTop_ep = new Point(1140.3, 871.8)
  points.foreheadCenter_cp1 = new Point(1149, 634.6)
  points.foreheadCenter_cp2 = new Point(1083.9, 389.7)
  points.foreheadCenter_ep = new Point(789, 344.8)
  points.neckInner_cp1 = new Point(756.5, 434.6)
  points.neckInner_cp2 = new Point(733, 827.1)
  points.neckInner_ep = new Point(799.3, 976.7)
  points.neckOuter_cp1 = new Point(868.9, 951.3)
  points.neckOuter_cp2 = new Point(948.6, 981.8)
  points.neckOuter_ep = new Point(974.4, 1022.7)
  points.dartBottom = new Point(1064.5, 963.4)
  points.dartPoint_cp1 = new Point(1046.1, 935.1)
  points.dartPoint_cp2 = new Point(962.7, 803.6)
  points.dartPoint_ep = new Point(880.6, 725.6)

  points.neckAdjustmentCenter = new Point(860, 1100)

  points.title = new Point(940, 690)

  points.grainlineFrom = new Point(880, 440)

  scaleAllPoints(part, options.totalSize * options.hairlineHeadScale)

  for (let p in points) points[p] = points[p].rotate(5, points.title)

  //Match neck seam length
  paths.neckCurve = drawNeckCurve()
  const neckAdjustmentPoints = [
    'neckOuter_cp1',
    'neckOuter_cp2',
    'neckOuter_ep',
    'neckInner_ep',
    'neckInner_cp2',
  ]

  const neckLengthHalf = store.get('neckLengthHalf')

  let neckCurveDelta = neckLengthHalf / 2 - paths.neckCurve.length()
  let neckCurveIterations = 0

  log.debug('Front neck curve delta is ' + neckCurveDelta)

  while (neckCurveIterations < 5 && Math.abs(neckCurveDelta) > 0.001 * options.totalSize) {
    log.debug('front neck iteration ' + neckCurveIterations + ', delta ' + neckCurveDelta)

    for (let p of neckAdjustmentPoints) {
      points[p] = points[p].shiftTowards(points.neckAdjustmentCenter, -neckCurveDelta * 0.785)
    }

    paths.neckCurve = drawNeckCurve()
    neckCurveDelta = neckLengthHalf / 2 - paths.neckCurve.length()

    neckCurveIterations = neckCurveIterations + 1
  }

  const lowerHeadSeam = points.dartBottom.dist(points.neckOuter_ep)
  store.set('lowerHeadSeam', lowerHeadSeam)

  paths.hairCurve = new Path()
    .move(points.dartTop_ep)
    .curve(points.foreheadCenter_cp1, points.foreheadCenter_cp2, points.foreheadCenter_ep)

  paths.path6 = new Path()
    .move(points.neckOuter_ep)
    .line(points.dartBottom)
    .curve(points.dartPoint_cp1, points.dartPoint_cp2, points.dartPoint_ep)
    .curve(points.dartTop_cp1, points.dartTop_cp2, points.dartTop_ep)
    .join(paths.hairCurve)
    .curve(points.neckInner_cp1, points.neckInner_cp2, points.neckInner_ep)
    .join(paths.neckCurve)
    .close()
}

export { draft_path6 }
