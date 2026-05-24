import { scaleAllPoints } from '../../../shared.mjs'

function draft_legPath(
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
  const drawHipCurve = () => {
    return (
      new Path()
        .move(points.legTopRight_ep)
        .curve(points.curve1_cp1, points.curve1_cp2, points.curve1_ep)
        // inkex.paths.curve: c -18.3852 -4.10031 -36.7639 -9.71674 -53.3379 -18.6682
        .curve(points.curve2_cp1, points.curve2_cp2, points.curve2_ep)
        // inkex.paths.curve: c -11.1423 -6.01785 -18.3305 -18.5785 -30.1577 -23.1042
        .curve(points.curve3_cp1, points.curve3_cp2, points.curve3_ep)
        // inkex.paths.curve: c -24.9076 -9.53092 -55.0848 -16.2667 -79.7682 -6.16957
        .curve(points.curve4_cp1, points.curve4_cp2, points.curve4_ep)
        // inkex.paths.curve: c -19.0729 7.80208 -22.6054 36.6016 -40.6248 46.599
        .curve(points.curve5_cp1, points.curve5_cp2, points.curve5_ep)
        // inkex.paths.curve: c -21.9578 12.1825 -52.0848 10.2192 -74.3792 11.9485
        .curve(points.legTopLeft_cp1, points.legTopLeft_cp2, points.legTopLeft_ep)

      //.hide()
    )
  }

  // Path: path128
  // m 337.139 747.8
  points.path128_p1 = new Point(337.1393, 750)
  // c 44.0098 1.96676 112.022 9.14853 168.126 8.29219
  points.path128_p2_cp1 = new Point(381.0098, 749.9668)
  points.path128_p2_cp2 = new Point(449.0224, 757.1485)
  points.path128_p2_ep = new Point(505.1261, 756.2922)
  // c 54.6489 -0.83413 140.478 -9.15975 163.444 -13.0716
  points.legEndRight_ep = new Point(644.4018, 750)
  // c -9.01574 -88.3579 -18.3812 -179.55 -23.5982 -268.243
  points.legTopRight_cp1 = new Point(658.9843, 654.6421)
  points.legTopRight_cp2 = new Point(649.6188, 563.4497)
  points.legTopRight_ep = new Point(644.4018, 474.7568)
  // c -10.5848 -0.68171 -28.4322 -1.25095 -42.2498 -4.3326
  points.curve1_cp1 = new Point(633.4152, 474.3183)
  points.curve1_cp2 = new Point(615.5678, 473.7491)
  points.curve1_ep = new Point(601.7502, 470.6674)
  // c -18.3852 -4.10031 -36.7639 -9.71674 -53.3379 -18.6682
  points.curve2_cp1 = new Point(583.6148, 466.8997)
  points.curve2_cp2 = new Point(565.2361, 461.2833)
  points.curve2_ep = new Point(548.6621, 452.3318)
  // c -11.1423 -6.01785 -18.3305 -18.5785 -30.1577 -23.1042
  points.curve3_cp1 = new Point(537.8577, 445.9821)
  points.curve3_cp2 = new Point(530.6695, 433.4215)
  points.curve3_ep = new Point(518.8423, 428.8958)
  // c -24.9076 -9.53092 -55.0848 -16.2667 -79.7682 -6.16957
  points.curve4_cp1 = new Point(494.0924, 419.4691)
  points.curve4_cp2 = new Point(463.9152, 412.7333)
  points.curve4_ep = new Point(439.2318, 422.8304)
  // c -19.0729 7.80208 -22.6054 36.6016 -40.6248 46.599
  points.curve5_cp1 = new Point(419.9271, 430.8021)
  points.curve5_cp2 = new Point(416.3946, 459.6016)
  points.curve5_ep = new Point(398.3752, 469.599)
  // c -21.9578 12.1825 -52.0848 10.2192 -74.3792 11.9485
  points.legTopLeft_cp1 = new Point(376.0422, 482.1825)
  points.legTopLeft_cp2 = new Point(345.9152, 480.2192)
  points.legTopLeft_ep = new Point(323.6208, 481.9485)
  // c 5.23663 82.4291 8.62003 171.002 12.5459 266.75
  points.legEndLeft_ep = new Point(323.6208, 750)
  // z

  scaleAllPoints(part, options.totalSize)

  //Truing: Match the two side lengths
  const crossSeamDelta = points.legTopLeft_ep.y - points.legTopRight_ep.y
  const leftSideShiftPoints = [
    'legTopLeft_ep',
    'legTopLeft_cp1',
    'legTopLeft_cp2',
    'curve5_ep',
    'curve5_cp2',
  ]

  for (let p of leftSideShiftPoints) {
    points[p] = points[p].shift(90, crossSeamDelta)
  }

  //Truing: match top curve length to the hip curve of the body pieces
  const hipCurveFront = store.get('hipCurveFront')
  const hipCurveBack = store.get('hipCurveBack')
  const hipCurve = hipCurveFront + hipCurveBack

  paths.hipCurve = drawHipCurve()
  log.debug('Hip curve length is ' + paths.hipCurve.length() + ', needed length is ' + hipCurve)

  const curveTweakPoints = [
    'curve5_cp1',
    'curve4_ep',
    'curve4_cp2',
    'curve4_cp1',
    'curve3_ep',
    'curve3_cp2',
  ]
  let hipCurveDelta = hipCurve - paths.hipCurve.length()
  let hipCurveIterations = 0
  while (hipCurveIterations < 5 && Math.abs(hipCurveDelta) > 0.001 * options.totalSize) {
    log.debug('Hip curve iteration ' + hipCurveIterations + ', delta ' + hipCurveDelta)

    for (let p of curveTweakPoints) {
      points[p] = points[p].shift(90, hipCurveDelta)
    }

    paths.hipCurve = drawHipCurve()
    hipCurveDelta = hipCurve - paths.hipCurve.length()
    hipCurveIterations = hipCurveIterations + 1
  }

  points.hipCurveSnippet = paths.hipCurve.shiftFractionAlong(hipCurveBack / hipCurve)

  points.hipCornerNotch = paths.hipCurve.reverse().shiftAlong(store.get('hipToCorner'))

  //Style: Adjust length
  const vertShiftPoints = ['legEndRight_ep', 'legEndLeft_ep']

  for (let p of vertShiftPoints) {
    points[p] = points[p].shift(-90, 300 * options.totalSize * (options.legLength - 1))
  }

  points.legBottomCenter = points.legEndLeft_ep.shiftFractionTowards(points.legEndRight_ep, 0.5)

  //Style: leg flare

  const legRotationAngle = (45 * (1 - options.legFlare)) / 1.5
  const legControlDistance = paths.hipCurve.length() * options.legLength * 0.3 * options.legFlare

  points.legEndLeft_ep = points.legEndLeft_ep.rotate(legRotationAngle, points.legTopLeft_ep)
  points.legEndLeftCurve = points.legEndLeft_ep.shift(legRotationAngle, legControlDistance)

  points.legEndRight_ep = points.legEndRight_ep.rotate(-legRotationAngle, points.legTopRight_ep)
  points.legEndRightCurve = points.legEndRight_ep.shift(-legRotationAngle + 180, legControlDistance)
  if (options.legFlare > 1) {
    paths.legBottom = new Path()
      .move(points.legEndLeft_ep)
      .curve(points.legEndLeftCurve, points.legEndRightCurve, points.legEndRight_ep)
  } else {
    paths.legBottom = new Path().move(points.legEndLeft_ep).line(points.legEndRight_ep)
  }
  log.info('leg bottom length is ' + paths.legBottom.length())
  /*
  points.legEndLeft_ep = points.legEndLeft_ep.shiftFractionTowards(
    points.legBottomCenter,
    1 - options.legFlare
  )
  points.legEndRight_ep = points.legEndRight_ep.shiftFractionTowards(
    points.legBottomCenter,
    1 - options.legFlare
  )
  */

  store.set('legBottomLength', paths.legBottom.length())

  paths.legPath = new Path()
    // inkex.paths.move: m 337.139 747.8
    .move(points.legEndLeft_ep)
    .join(paths.legBottom)
    // inkex.paths.curve: c -9.01574 -88.3579 -18.3812 -179.55 -23.5982 -268.243
    .line(points.legTopRight_ep)
    .join(paths.hipCurve)
    // inkex.paths.curve: c 5.23663 82.4291 8.62003 171.002 12.5459 266.75
    .line(points.legEndLeft_ep)
    // inkex.paths.zoneClose: z
    .close()
}

export { draft_legPath }
