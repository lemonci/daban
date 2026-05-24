import { scaleAllPoints } from '../../../shared.mjs'

function draft_body_front(
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
  // Path: path190
  // M 163.803 0.845703
  points.path190_p1 = new Point(163.8027, 0.8457)
  // C 158.263 3.02254 154.842 4.22089 150.172 5.18359
  points.path190_p2_cp1 = new Point(158.2633, 3.0225)
  points.path190_p2_cp2 = new Point(154.8418, 4.2209)
  points.path190_p2_ep = new Point(150.1719, 5.1836)
  // C 145.289 6.19022 139.269 6.67263 135.287 6.6543
  points.neckCenter_cp1 = new Point(145.2889, 6.1902)
  points.neckCenter_cp2 = new Point(139.269, 6.6726)
  points.neckCenter_ep = new Point(135.2871, 6.6543)
  // l 1.3125 402.607
  points.crotchCenter = new Point(136.3125, 409.6074)
  // c 8.53215 -0.22404 17.7678 -0.49973 23.4434 -0.66211
  points.crotchWidth_cp1 = new Point(144.5322, 409.776)
  points.crotchWidth_ep = new Point(159.4434, 409.3379)
  // c -7.23857 -23.8798 -5.28216 -60.9714 -3.98242 -91.459
  points.path190_p6_cp1 = new Point(151.7614, 385.1202)
  points.path190_p6_cp2 = new Point(153.7178, 348.0286)
  points.path190_p6_ep = new Point(155.0176, 317.541)
  // c 0.65759 -15.4246 -0.44896 -40.479 5.94531 -45.9336
  points.hipCorner_cp1 = new Point(155.6576, 302.5754)
  points.hipCorner_cp2 = new Point(154.551, 277.521)
  points.hipCorner_ep = new Point(160.9453, 272.0664)
  // c 6.39428 -5.45458 55.0486 -13.9971 81.5859 -7.54297
  points.path190_p8_cp1 = new Point(167.3943, 266.5454)
  points.path190_p8_cp2 = new Point(216.0486, 258.0029)
  points.path190_p8_ep = new Point(242.5859, 264.457)
  // c 10.8441 2.6374 13.1967 7.75259 28.1992 18.0488
  points.hipOuter_cp1 = new Point(253.8441, 266.6374)
  points.hipOuter_cp2 = new Point(256.1967, 271.7526)
  points.hipOuter_ep = new Point(271.1992, 282.0488)
  // c -1.73255 -19.0809 -4.64158 -34.1428 -7.94727 -51.041
  points.hipControl_cp1 = new Point(269.2674, 220)
  points.hipControl_cp2 = new Point(266.3584, 247.8572)
  points.hipControl_ep = new Point(263.0527, 230.959)
  // c -3.99901 -20.4424 -12.0719 -40.113 -14.3633 -60.8164
  points.waistControl_cp1 = new Point(259.001, 210.5576)
  points.waistControl_cp2 = new Point(250.9281, 190.887)
  points.waistControl_ep = new Point(248.6367, 170.1836)
  // c -2.27075 -20.5168 -1.5954 -43.3911 0.71094 -61.9219
  points.armpitSide_cp1 = new Point(246.7293, 149.4832)
  points.armpitSide_cp2 = new Point(245, 180)
  points.armpitSide_ep = new Point(249.7109, 108.0781)
  // c -7.60541 -1.13495 -23.0225 -1.7184 -30.0996 -9.5039
  points.armpitCurve_cp1 = new Point(242.3946, 106.865)
  points.armpitCurve_cp2 = new Point(226.9775, 106.2816)
  points.armpitCurve_ep = new Point(219.9004, 98.4961)
  // c -7.02217 -7.72509 -6.28038 -21.7507 -6.54688 -30.627
  points.armpitNotch_cp1 = new Point(212.9778, 90.2749)
  points.armpitNotch_cp2 = new Point(213.7196, 76.2493)
  points.armpitNotch_ep = new Point(213.4531, 67.373)
  // C 207.611 60.9423 195.776 48.349 190.311 39.0762
  // C 186.215 33.6155 166.977 4.43956 163.803 0.845703
  points.neckOuter_cp1 = new Point(186.215, 33.6155)
  points.neckOuter_cp2 = new Point(166.9773, 4.4396)
  points.neckOuter_ep = new Point(163.8027, 0.8457)
  // Z

  //Style: add extra width at the hip
  const hipShiftPoints = [
    'crotchWidth_ep',
    'path190_p6_cp1',
    'path190_p6_cp2',
    'path190_p6_ep',
    'hipCorner_cp1',
    'hipCorner_cp2',
    'hipCorner_ep',
    'path190_p8_cp1',
    'path190_p8_cp2',
    'path190_p8_ep',
    'hipOuter_cp1',
    'hipOuter_cp2',
    'hipOuter_ep',
    'hipControl_cp1',
    'hipControl_cp2',
    'hipControl_ep',
    'waistControl_cp1',
  ]

  for (let p of hipShiftPoints) {
    points[p] = points[p].shift(0, 100 * options.hipExtraWidth)
  }

  //Style: Extra torso length
  const lengthShiftPoints = hipShiftPoints
  lengthShiftPoints.push('crotchCenter')
  for (let p of lengthShiftPoints) {
    points[p] = points[p].shift(-90, 100 * options.torsoLength)
  }

  scaleAllPoints(part, options.totalSize)

  paths.sideSeamCurve = new Path()
    .move(points.hipOuter_ep)
    .curve(points.hipControl_cp1, points.armpitSide_cp2, points.armpitSide_ep)
    /*
    // inkex.paths.curve: c -1.73255 -19.0809 -4.64158 -34.1428 -7.94727 -51.041
    .curve(points.hipControl_cp1, points.hipControl_cp2, points.hipControl_ep)
    // inkex.paths.curve: c -3.99901 -20.4424 -12.0719 -40.113 -14.3633 -60.8164
    .curve(points.waistControl_cp1, points.waistControl_cp2, points.waistControl_ep)
    // inkex.paths.curve: c -2.27075 -20.5168 -1.5954 -43.3911 0.71094 -61.9219
    .curve(points.armpitSide_cp1, points.armpitSide_cp2, points.armpitSide_ep)
    // inkex.paths.curve: c -7.60541 -1.13495 -23.0225 -1.7184 -30.0996 -9.5039
    */
    .hide()

  store.set('sideSeamFrontLength', paths.sideSeamCurve.length())
  log.debug('Side seam length front: ' + paths.sideSeamCurve.length() + ' mm')

  paths.hipCurve = new Path()
    .move(points.crotchWidth_ep)
    // inkex.paths.curve: c -7.23857 -23.8798 -5.28216 -60.9714 -3.98242 -91.459
    .curve(points.path190_p6_cp1, points.path190_p6_cp2, points.path190_p6_ep)
    // inkex.paths.curve: c 0.65759 -15.4246 -0.44896 -40.479 5.94531 -45.9336
    .curve(points.hipCorner_cp1, points.hipCorner_cp2, points.hipCorner_ep)
    // inkex.paths.curve: c 6.39428 -5.45458 55.0486 -13.9971 81.5859 -7.54297
    .curve(points.path190_p8_cp1, points.path190_p8_cp2, points.path190_p8_ep)
    // inkex.paths.curve: c 10.8441 2.6374 13.1967 7.75259 28.1992 18.0488
    .curve(points.hipOuter_cp1, points.hipOuter_cp2, points.hipOuter_ep)
  store.set('hipCurveFront', paths.hipCurve.length())
  log.debug('Hip length front: ' + paths.hipCurve.length() + ' mm')

  paths.hipToCorner = new Path()
    .move(points.crotchWidth_ep)
    .curve(points.path190_p6_cp1, points.path190_p6_cp2, points.path190_p6_ep)
    .curve(points.hipCorner_cp1, points.hipCorner_cp2, points.hipCorner_ep)
  store.set('hipToCorner', paths.hipToCorner.length())
  log.debug('Hip to corner: ' + paths.hipToCorner.length() + ' mm')

  //Store armpit curve length
  paths.armpitCurve = new Path()
    .move(points.armpitSide_ep)
    .curve(points.armpitCurve_cp1, points.armpitCurve_cp2, points.armpitCurve_ep)
    // inkex.paths.curve: c -7.02217 -7.72509 -6.28038 -21.7507 -6.54688 -30.627
    .curve(points.armpitNotch_cp1, points.armpitNotch_cp2, points.armpitNotch_ep)
  store.set('armpitCurveFront', paths.armpitCurve.length())

  //store neck curve length
  paths.neckCurve = new Path()
    .move(points.neckOuter_ep)
    .line(points.path190_p1)
    // inkex.paths.Curve: C 158.263 3.02254 154.842 4.22089 150.172 5.18359
    .curve(points.path190_p2_cp1, points.path190_p2_cp2, points.path190_p2_ep)
    // inkex.paths.Curve: C 145.289 6.19022 139.269 6.67263 135.287 6.6543
    .curve(points.neckCenter_cp1, points.neckCenter_cp2, points.neckCenter_ep)
    // inkex.paths.line: l 1.3125 402.607
    .hide()
  store.set('neckLengthFront', paths.neckCurve.length())

  //Store crotch length
  const crotchWidthFront = points.crotchWidth_ep.dist(points.crotchCenter)
  store.set('crotchWidthFront', crotchWidthFront)

  //store raglan length
  const raglanLengthFront = points.neckOuter_ep.dist(points.armpitNotch_ep)
  store.set('raglanLengthFront', raglanLengthFront)

  paths.raglanLength = new Path().move(points.armpitNotch_ep).line(points.neckOuter_ep)
  paths.cornerToSide = paths.hipCurve.split(points.hipCorner_ep)[1]

  paths.path190 = new Path()
    // inkex.paths.Move: M 163.803 0.845703
    .move(points.crotchCenter)
    // inkex.paths.curve: c 8.53215 -0.22404 17.7678 -0.49973 23.4434 -0.66211
    .line(points.crotchWidth_ep)
    .join(paths.hipCurve)
    .join(paths.sideSeamCurve)
    .join(paths.armpitCurve)
    .line(points.neckOuter_ep)
    .join(paths.neckCurve)
}

export { draft_body_front }
