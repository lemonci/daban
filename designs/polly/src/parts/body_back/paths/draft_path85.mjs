import { scaleAllPoints } from '../../../shared.mjs'

function draft_path85(
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
  const drawArmpitCurve = () => {
    return (
      new Path()
        .move(points.armpitBottom_ep)
        // inkex.paths.curve: c 6.93293 -0.91312 14.0859 -0.90912 18.9692 -5.29678
        .curve(points.armpitCurveLower_cp1, points.armpitCurveLower_cp2, points.armpitCurveLower_ep)
        // inkex.paths.curve: c 5.7208 -5.14013 6.97822 -13.9033 8.53921 -21.4341
        .curve(points.armpitCurveUpper_cp1, points.armpitCurveUpper_cp2, points.armpitCurveUpper_ep)
        // inkex.paths.curve: c 1.28046 -6.17736 0.19109 -9.78193 0.56118 -18.9177
        .curve(points.armpitNotch_cp1, points.armpitNotch_cp2, points.armpitNotch_ep)
        .hide()
    )
  }

  // Path: path85
  // m 472.983 12.8617
  points.path85_p1 = new Point(472.9833, 12.8617)
  // c 14.0074 3.04588 19.5758 4.49088 29.7218 4.18197
  points.neckCenter_cp1 = new Point(487.0074, 16.0459)
  points.neckCenter_cp2 = new Point(492.5758, 17.4909)
  points.neckCenter_ep = new Point(502.7218, 17.182)
  // c -1.05206 13.276 -4.52225 49.6723 -5.9235 74.5668
  points.path85_p3_cp1 = new Point(501.9479, 30.276)
  points.path85_p3_cp2 = new Point(498.4778, 66.6723)
  points.path85_p3_ep = new Point(497.0765, 91.5668)
  // c -1.84297 32.7422 -4.51459 65.5577 -3.26408 98.3279
  points.path85_p4_cp1 = new Point(495.157, 124.7422)
  points.path85_p4_cp2 = new Point(492.4854, 157.5577)
  points.path85_p4_ep = new Point(493.7359, 190.3279)
  // c 0.98504 25.8136 6.7667 51.2569 8.46643 77.0333
  points.path85_p5_cp1 = new Point(494.985, 215.8136)
  points.path85_p5_cp2 = new Point(500.7667, 241.2569)
  points.path85_p5_ep = new Point(502.4664, 267.0333)
  // c 1.56038 23.6633 2.36966 37.1077 1.58105 71.1265
  points.crotchCenter_cp1 = new Point(503.5604, 290.6633)
  points.crotchCenter_cp2 = new Point(504.3697, 304.1077)
  points.crotchCenter_ep = new Point(503.5811, 338.1265)
  // c -8.98283 1.59062 -21.0562 2.86232 -22.5996 3.15588
  points.hipBack_ep = new Point(481.4004, 341.1559)
  // c -12.6733 -5.80867 -90.9351 -36.2156 -100.681 -42.5527
  points.hipOuter_ep = new Point(380.3191, 298.4473)
  // c 0.72791 -27.6323 10.2584 -153.571 11.3966 -172.052
  points.armpitBottom_ep = new Point(391.3966, 125.9482)
  // c 6.93293 -0.91312 14.0859 -0.90912 18.9692 -5.29678
  points.armpitCurveLower_cp1 = new Point(397.9329, 125.0869)
  points.armpitCurveLower_cp2 = new Point(405.0859, 125.0909)
  points.armpitCurveLower_ep = new Point(409.9692, 120.7032)
  // c 5.7208 -5.14013 6.97822 -13.9033 8.53921 -21.4341
  points.armpitCurveUpper_cp1 = new Point(415.7208, 115.8599)
  points.armpitCurveUpper_cp2 = new Point(416.9782, 107.0967)
  points.armpitCurveUpper_ep = new Point(418.5392, 99.5659)
  // c 1.28046 -6.17736 0.19109 -9.78193 0.56118 -18.9177
  points.armpitNotch_cp1 = new Point(420.2805, 93.8226)
  points.armpitNotch_cp2 = new Point(419.1911, 90.2181)
  points.armpitNotch_ep = new Point(419.5612, 81.0823)
  // c 9.07933 -10.7691 42.836 -58.6974 53.2326 -68.1394
  points.shoulder_ep = new Point(473.2326, 12.8606)
  // z

  //Style: Extra hip width
  const hipShiftPoints = ['hipOuter_ep', 'hipBack_ep']
  for (let p of hipShiftPoints) {
    points[p] = points[p].shift(180, 100 * options.hipExtraWidth)
  }

  //Style: Extra torso length
  const lengthShiftPoints = hipShiftPoints
  lengthShiftPoints.push('crotchCenter_ep', 'crotchCenter_cp1', 'path85_p5_ep', 'path85_p5_cp2')
  for (let p of lengthShiftPoints) {
    points[p] = points[p].shift(-90, 100 * options.torsoLength)
  }

  scaleAllPoints(part, options.totalSize)

  paths.armpitCurveBack = drawArmpitCurve()

  //Match armpit curve to front armpit curve

  const armpitCurveFront = store.get('armpitCurveFront')
  let armpitCurveBack = paths.armpitCurveBack.length()
  log.debug('Armpit length delta is ' + (armpitCurveFront - armpitCurveBack))

  const armpitShiftPoints = [
    'armpitBottom_ep',
    'armpitCurveLower_cp1',
    'armpitCurveLower_cp2',
    'armpitCurveLower_ep',
    'armpitCurveUpper_cp1',
  ]

  let delta = armpitCurveFront - armpitCurveBack
  let armpitIteration = 0

  while (armpitIteration < 5 && Math.abs(delta) > 0.001 * options.totalSize) {
    log.debug('armpitIteration ' + armpitIteration + ', delta = ' + delta)

    for (let p of armpitShiftPoints) {
      points[p] = points[p].shift(-170, delta)
    }

    paths.armpitCurveBack = drawArmpitCurve()
    armpitCurveBack = paths.armpitCurveBack.length()

    delta = armpitCurveFront - armpitCurveBack

    armpitIteration = armpitIteration + 1
  }

  //Match raglan curve length
  const raglanLengthFront = store.get('raglanLengthFront')
  let raglanLengthBack = points.shoulder_ep.dist(points.armpitNotch_ep)
  log.debug('Raglan length delta is ' + (raglanLengthFront - raglanLengthBack))

  const raglanShiftPoints = [
    'armpitNotch_ep',
    'armpitNotch_cp1',
    'armpitNotch_cp2',
    'armpitCurveUpper_ep',
    'armpitCurveUpper_cp2',
    'armpitCurveUpper_cp1',
    'armpitCurveLower_ep',
    'armpitCurveLower_cp1',
    'armpitCurveLower_cp2',
    'armpitBottom_ep',
  ]

  delta = raglanLengthFront - raglanLengthBack
  let raglanIteration = 0
  while (raglanIteration < 5 && Math.abs(delta) > 0.001 * options.totalSize) {
    log.debug('raglanIteration ' + raglanIteration + ', delta = ' + delta)

    for (let p of raglanShiftPoints) {
      points[p] = points[p].shift(0, -delta)
    }

    raglanLengthBack = points.shoulder_ep.dist(points.armpitNotch_ep)
    delta = raglanLengthFront - raglanLengthBack

    raglanIteration = raglanIteration + 1
  }

  //Match side seam to front side seam
  let sideSeamBackLength = points.armpitBottom_ep.dist(points.hipOuter_ep)
  const sideSeamFrontLength = store.get('sideSeamFrontLength')
  log.debug('Side seam back length is ' + sideSeamBackLength + ' mm')

  delta = sideSeamFrontLength - sideSeamBackLength

  let iteration = 0

  while (iteration < 5 && Math.abs(delta) > 0.001 * options.totalSize) {
    log.debug('Side seam iteration ' + iteration + ', delta = ' + delta)

    points.hipOuter_ep = points.hipOuter_ep.shift(-90, delta)

    let sideSeamBackLength = points.armpitBottom_ep.dist(points.hipOuter_ep)
    delta = sideSeamFrontLength - sideSeamBackLength

    iteration = iteration + 1
  }

  //Match crotch seam to front crotch seam
  let crotchWidthBack = points.crotchCenter_ep.dist(points.hipBack_ep)
  const crotchWidthFront = store.get('crotchWidthFront')
  log.debug('crotch back length is ' + crotchWidthBack + ' mm')
  log.debug('crotch front length is ' + crotchWidthFront + ' mm')
  delta = crotchWidthFront - crotchWidthBack
  let crotchIteration = 0
  while (crotchIteration < 5 && Math.abs(delta) > 0.001 * options.totalSize) {
    log.debug('crotchIteration ' + crotchIteration + ', delta = ' + delta)

    points.hipBack_ep = points.hipBack_ep.shift(180, delta)

    crotchWidthBack = points.crotchCenter_ep.dist(points.hipBack_ep)
    delta = crotchWidthFront - crotchWidthBack

    crotchIteration = crotchIteration + 1
  }

  //Redraw armpit curve to check it after all the modification
  paths.armpitCurveBack = drawArmpitCurve()

  //Store hip curve length
  log.debug('Hip curve back length is ' + points.hipBack_ep.dist(points.hipOuter_ep))
  store.set('hipCurveBack', points.hipBack_ep.dist(points.hipOuter_ep))

  //Store neck curve lenght
  paths.neckCurve = new Path()
    .move(points.shoulder_ep)
    .curve(points.neckCenter_cp1, points.neckCenter_cp2, points.neckCenter_ep)
    .hide()
  store.set('neckLengthBack', paths.neckCurve.length())

  paths.backSeam = new Path()
    .move(points.neckCenter_ep)
    .curve(points.path85_p3_cp1, points.path85_p3_cp2, points.path85_p3_ep)
    // inkex.paths.curve: c -1.84297 32.7422 -4.51459 65.5577 -3.26408 98.3279
    .curve(points.path85_p4_cp1, points.path85_p4_cp2, points.path85_p4_ep)
    // inkex.paths.curve: c 0.98504 25.8136 6.7667 51.2569 8.46643 77.0333
    .curve(points.path85_p5_cp1, points.path85_p5_cp2, points.path85_p5_ep)
    // inkex.paths.curve: c 1.56038 23.6633 2.36966 37.1077 1.58105 71.1265
    .curve(points.crotchCenter_cp1, points.crotchCenter_cp2, points.crotchCenter_ep)
    .hide()

  paths.path85 = new Path()
    .move(points.shoulder_ep)
    .join(paths.neckCurve)
    .join(paths.backSeam)
    .line(points.hipBack_ep)
    // inkex.paths.curve: c -12.6733 -5.80867 -90.9351 -36.2156 -100.681 -42.5527
    .line(points.hipOuter_ep)
    // inkex.paths.curve: c 0.72791 -27.6323 10.2584 -153.571 11.3966 -172.052
    .line(points.armpitBottom_ep)
    // inkex.paths.curve: c 6.93293 -0.91312 14.0859 -0.90912 18.9692 -5.29678
    .curve(points.armpitCurveLower_cp1, points.armpitCurveLower_cp2, points.armpitCurveLower_ep)
    // inkex.paths.curve: c 5.7208 -5.14013 6.97822 -13.9033 8.53921 -21.4341
    .curve(points.armpitCurveUpper_cp1, points.armpitCurveUpper_cp2, points.armpitCurveUpper_ep)
    // inkex.paths.curve: c 1.28046 -6.17736 0.19109 -9.78193 0.56118 -18.9177
    .curve(points.armpitNotch_cp1, points.armpitNotch_cp2, points.armpitNotch_ep)
    // inkex.paths.curve: c 9.07933 -10.7691 42.836 -58.6974 53.2326 -68.1394
    .line(points.shoulder_ep)
    // inkex.paths.zoneClose: z
    .close()
}

export { draft_path85 }
