import { scaleAllPoints } from '../../../shared.mjs'

function draft_face_split(
  Path,
  Point,
  paths,
  points,
  measurements,
  options,
  utils,
  macro,
  part,
  log,
  store
) {
  const drawNeckCurve = () => {
    return new Path()
      .move(points.neckEdge)
      .curve(points.neckCenter_cp1, points.neckCenter_cp2, points.neckCenter)
  }

  // Path: path7
  // m 265.664 269.168
  points.path7_p1 = new Point(265.7, 269.2)
  // c 18.4378 17.3743 51.6981 49.5276 62.4082 60.8265
  points.dartLowerBottom_cp1 = new Point(284.4, 286.4)
  points.dartLowerBottom_cp2 = new Point(317.7, 318.5)
  points.dartLowerBottom_ep = new Point(328.4, 329.8)
  // l -28.1537 30.2777
  points.neckEdge = new Point(299.8, 360.3)
  // c -14.1207 -16.6085 -56.5354 -19.8624 -70.6781 -5.3325
  points.neckCenter_cp1 = new Point(285.9, 343.4)
  points.neckCenter_cp2 = new Point(243.5, 340.1)
  points.neckCenter = new Point(229.3, 354.7)
  // C 180.441 263.035 175.953 102.208 215.714 20.4365
  points.headTopCenter_cp1 = new Point(180.4, 263)
  points.headTopCenter_cp2 = new Point(176, 102.2)
  points.headTopCenter = new Point(215.7, 20.4)
  // c 33.4183 6.16857 101.086 42.8414 111.76 61.6315
  points.dartUpperTop_cp1 = new Point(249.4, 26.2)
  points.dartUpperTop_cp2 = new Point(317.1, 62.8)
  points.dartUpperTop_ep = new Point(327.8, 81.6)
  // c -24.9843 32.7325 -47.0607 58.82 -77.0744 83.8488
  points.dartUpperPoint_cp1 = new Point(303, 114.7)
  points.dartUpperPoint_cp2 = new Point(280.9, 140.8)
  points.dartUpperPoint_ep = new Point(250.9, 165.8)
  // c 34.0732 -20.4073 60.7508 -27.2284 109.157 -32.5937
  points.dartUpperBottom_cp1 = new Point(285.1, 145.6)
  points.dartUpperBottom_cp2 = new Point(311.8, 138.8)
  points.dartUpperBottom_ep = new Point(360.2, 133.4)
  // c 8.62108 57.2862 3.13831 114.919 -10.7126 165.065
  points.dartLowerTop_cp1 = new Point(368.6, 190.3)
  points.dartLowerTop_cp2 = new Point(363.1, 247.9)
  points.dartLowerTop_ep = new Point(349.3, 298.1)
  // c -29.8962 -6.30284 -56.3308 -15.85 -83.1796 -29.2196
  points.dartLowerPoint_cp1 = new Point(319.1, 291.7)
  points.dartLowerPoint_cp2 = new Point(292.7, 282.2)
  points.dartLowerPoint_ep = new Point(265.8, 268.8)
  // z

  points.neckScalePoint = new Point(260, 400)

  //This piece wasn't unwrapped and scaled at the same time as all the other pieces, so there's a slight
  //constant factor adjustment that has to be made to match it to the others.
  scaleAllPoints(part, options.totalSize * (80.39 / 76.53) * (345.14 / 354.63) * options.headScale)

  //Match neck curve length
  paths.neckCurve = drawNeckCurve()
  const neckAdjustmentPoints = ['neckEdge', 'neckCenter_cp1', 'neckCenter_cp2', 'neckCenter']

  const neckLengthHalf = store.get('neckLengthHalf')

  let neckCurveDelta = neckLengthHalf / 2 - paths.neckCurve.length()
  let neckCurveIterations = 0
  while (neckCurveIterations < 5 && Math.abs(neckCurveDelta) > 0.001 * options.totalSize) {
    log.debug('Split face neck iteration ' + neckCurveIterations + ', delta ' + neckCurveDelta)

    for (let p of neckAdjustmentPoints) {
      points[p] = points[p].shiftTowards(points.neckScalePoint, -neckCurveDelta * 0.785)
    }

    paths.neckCurve = drawNeckCurve()
    neckCurveDelta = neckLengthHalf / 2 - paths.neckCurve.length()

    neckCurveIterations = neckCurveIterations + 1
  }

  paths.sideSeamTop = new Path()
    .move(points.headTopCenter)
    .curve(points.dartUpperTop_cp1, points.dartUpperTop_cp2, points.dartUpperTop_ep)
    .hide()

  paths.sideSeamMiddle = new Path()
    .move(points.dartUpperBottom_ep)
    .curve(points.dartLowerTop_cp1, points.dartLowerTop_cp2, points.dartLowerTop_ep)
    .hide()

  paths.sideSeamLower = new Path().move(points.dartLowerBottom_ep).line(points.neckEdge).hide()

  const totalSideSeamLength =
    paths.sideSeamTop.length() + paths.sideSeamMiddle.length() + paths.sideSeamLower.length()
  log.debug('Split face side seam length is ' + totalSideSeamLength)

  paths.centerPath = new Path()
    // inkex.paths.move: m 265.664 269.168
    .move(points.neckCenter)

    // inkex.paths.Curve: C 180.441 263.035 175.953 102.208 215.714 20.4365
    .curve(points.headTopCenter_cp1, points.headTopCenter_cp2, points.headTopCenter)

  points.widestPoint = paths.centerPath.shiftFractionAlong(0.5)

  paths.face_path = new Path()
    .move(points.neckCenter)
    .join(paths.centerPath)

    // inkex.paths.curve: c 33.4183 6.16857 101.086 42.8414 111.76 61.6315
    .join(paths.sideSeamTop)
    // inkex.paths.curve: c -24.9843 32.7325 -47.0607 58.82 -77.0744 83.8488
    .curve(points.dartUpperPoint_cp1, points.dartUpperPoint_cp2, points.dartUpperPoint_ep)
    // inkex.paths.curve: c 34.0732 -20.4073 60.7508 -27.2284 109.157 -32.5937
    .curve(points.dartUpperBottom_cp1, points.dartUpperBottom_cp2, points.dartUpperBottom_ep)
    // inkex.paths.curve: c 8.62108 57.2862 3.13831 114.919 -10.7126 165.065
    .join(paths.sideSeamMiddle)
    // inkex.paths.curve: c -29.8962 -6.30284 -56.3308 -15.85 -83.1796 -29.2196
    .curve(points.dartLowerPoint_cp1, points.dartLowerPoint_cp2, points.dartLowerPoint_ep)
    .curve(points.dartLowerBottom_cp1, points.dartLowerBottom_cp2, points.dartLowerBottom_ep)
    // inkex.paths.line: l -28.1537 30.2777
    .line(points.neckEdge)
    // inkex.paths.curve: c -14.1207 -16.6085 -56.5354 -19.8624 -70.6781 -5.3325
    .join(paths.neckCurve)
    // inkex.paths.zoneClose: z
    .close()
}

export { draft_face_split }
