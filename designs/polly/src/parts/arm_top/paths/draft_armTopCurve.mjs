import { scaleAllPoints } from '../../../shared.mjs'

function draft_armTopCurve(
  Path,
  Point,
  paths,
  points,
  measurements,
  options,
  utils,
  macro,
  part,
  store
) {
  // Path: armTopCurve
  // m 245.113 369.027
  points.armTopCurve_p1 = new Point(245.1125, 369.0271)
  // c 15.6403 -0.30672 25.6438 -7.94185 32.5596 -12.3965
  /*
  points.neckRight_cp1 = new Point(260.6403, 368.6933)
  points.neckRight_cp2 = new Point(270.6438, 361.0582)
  points.neckRight_ep = new Point(277.5596, 356.6035)
  // c 24.2874 65.1072 38.5814 146.781 39.1313 208.65
  points.armWideRight_cp1 = new Point(302.2874, 422.1072)
  points.armWideRight_cp2 = new Point(316.5814, 503.7815)
  points.armWideRight_ep = new Point(317.1313, 565.6502)
  */
  // c 0.54983 61.8687 -25.3772 117.991 -71.5642 118.667
  points.armBottom_cp1 = new Point(317.5498, 627.8687)
  points.armBottom_cp2 = new Point(291.6228, 683.9911)
  points.armBottom_ep = new Point(245.4358, 684.6668)
  // c -46.959 0.68706 -82.2708 -50.5625 -76.259 -118.47
  points.armWideLeft_cp1 = new Point(198.041, 685.6871)
  points.armWideLeft_cp2 = new Point(162.7292, 634.4375)
  points.armWideLeft_ep = new Point(168.741, 566.5299)
  // c 6.01177 -67.9076 7.20623 -149.982 43.2741 -207.951
  points.neckLeft_cp1 = new Point(175.0118, 499.0924)
  points.neckLeft_cp2 = new Point(176.2062, 417.0177)
  points.neckLeft_ep = new Point(212.2741, 359.0492)
  // c 7.8373 4.71393 17.218 11.8071 32.8583 11.5004
  points.neckCenter_cp1 = new Point(219.8373, 363.7139)
  points.neckCenter_cp2 = new Point(229.218, 370.8071)
  points.neckCenter_ep = new Point(244.8583, 370.5004)
  // z

  scaleAllPoints(part, options.totalSize)

  //Style: Adjust length
  const vertShiftPoints = [
    'armBottom_ep',
    'armBottom_cp1',
    'armBottom_cp2',
    'armWideLeft_ep',
    'armWideLeft_cp1',
    'armWideLeft_cp2',
    'neckLeft_cp1',
  ]

  for (let p of vertShiftPoints) {
    points[p] = points[p].shift(-90, 300 * options.totalSize * (options.armLength - 1))
  }

  paths.armCurve = new Path()
    .move(points.armBottom_ep)
    .curve(points.armWideLeft_cp1, points.armWideLeft_cp2, points.armWideLeft_ep)
    .curve(points.neckLeft_cp1, points.neckLeft_cp2, points.neckLeft_ep)
    .hide()

  paths.neckCurve = new Path()
    .move(points.neckLeft_ep)
    // inkex.paths.curve: c 7.8373 4.71393 17.218 11.8071 32.8583 11.5004
    .curve(points.neckCenter_cp1, points.neckCenter_cp2, points.neckCenter_ep)
    .hide()
  store.set('neckLengthArm', paths.neckCurve.length() * 2)

  paths.armTopCurve = paths.armCurve.join(paths.neckCurve)
  //.hide()
}

export { draft_armTopCurve }
