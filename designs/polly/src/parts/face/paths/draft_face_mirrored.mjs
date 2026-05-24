import { Store } from '@freesewing/core'
import { scaleAllPoints } from '../../../shared.mjs'

function draft_face_mirrored(
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

  // Path: path1
  // m 188.487 20.9453
  points.headTopCenter = new Point(188, 20.9453)
  // c 46.1322 -0.618836 96.0851 17.0327 122.472 32.8583
  points.dartUpperTop_cp1 = new Point(234.1322, 20.3812)
  points.dartUpperTop_cp2 = new Point(284.0851, 38.0327)
  points.dartUpperTop_ep = new Point(310.4718, 53.8583)
  // c -6.65939 27.5584 -34.1572 68.3735 -64.4763 98.886
  points.dartUpperPoint_cp1 = new Point(303.3406, 81.5584)
  points.dartUpperPoint_cp2 = new Point(275.8428, 122.3735)
  points.dartUpperPoint_ep = new Point(245.5237, 152.886)
  // c 38.444 -15.0305 81.68 -25.4915 117.013 -24.4661
  points.dartUpperBottom_cp1 = new Point(284.444, 137.9695)
  points.dartUpperBottom_cp2 = new Point(327.68, 127.5085)
  points.dartUpperBottom_ep = new Point(363.0133, 128.5339)
  // c 2.82067 68.5525 -10.7277 116.682 -27.8765 168.557
  points.dartLowerTop_cp1 = new Point(365.8207, 197.5525)
  points.dartLowerTop_cp2 = new Point(352.2723, 245.6818)
  points.dartLowerTop_ep = new Point(335.1235, 297.5565)
  // c -28.4591 -8.52216 -54.7292 -20.6781 -82.76 -36.7159
  points.dartLowerPoint_cp1 = new Point(306.5409, 289.4778)
  points.dartLowerPoint_cp2 = new Point(280.2708, 277.3219)
  points.dartLowerPoint_ep = new Point(252.24, 261.2841)
  // c 18.5912 26.8278 32.4837 55.7392 43.7613 76.6196
  points.dartLowerBottom_cp1 = new Point(270.5912, 287.8278)
  points.dartLowerBottom_cp2 = new Point(284.4837, 316.7392)
  points.dartLowerBottom_ep = new Point(295.7613, 337.6196)
  // c -13.9665 9.79401 -25.2608 14.1619 -39.1394 21.3312
  points.neckEdge_cp1 = new Point(282.0335, 347.794)
  points.neckEdge_cp2 = new Point(270.7392, 352.1619)
  points.neckEdge = new Point(256.8606, 359.3312)
  // c -11.5386 -25.6553 -44.1392 -31.6027 -69.118 -32.0035
  points.neckCenter_cp1 = new Point(245.4614, 333.3447)
  points.neckCenter_cp2 = new Point(212.8608, 327.3973)
  points.neckCenter = new Point(188, 326.9965)

  points.neckScalePoint = new Point(188, 395)

  scaleAllPoints(part, options.totalSize * options.headScale)

  //Match neck curve length to the body

  paths.neckCurve = drawNeckCurve()
  const neckAdjustmentPoints = ['neckEdge', 'neckCenter_cp1', 'neckCenter_cp2', 'neckCenter']

  const neckLengthHalf = store.get('neckLengthHalf')

  let neckCurveDelta = neckLengthHalf / 2 - paths.neckCurve.length()
  let neckCurveIterations = 0

  while (neckCurveIterations < 5 && Math.abs(neckCurveDelta) > 0.001 * options.totalSize) {
    log.debug('front neck iteration ' + neckCurveIterations + ', delta ' + neckCurveDelta)

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
  log.debug('Mirrored face side seam length is ' + totalSideSeamLength)

  paths.face_path = new Path()
    // inkex.paths.move: m 188.487 20.9453
    .move(points.headTopCenter)
    // inkex.paths.curve: c 46.1322 -0.618836 96.0851 17.0327 122.472 32.8583
    .curve(points.dartUpperTop_cp1, points.dartUpperTop_cp2, points.dartUpperTop_ep)
    // inkex.paths.curve: c -6.65939 27.5584 -34.1572 68.3735 -64.4763 98.886
    .curve(points.dartUpperPoint_cp1, points.dartUpperPoint_cp2, points.dartUpperPoint_ep)
    // inkex.paths.curve: c 38.444 -15.0305 81.68 -25.4915 117.013 -24.4661
    .curve(points.dartUpperBottom_cp1, points.dartUpperBottom_cp2, points.dartUpperBottom_ep)
    // inkex.paths.curve: c 2.82067 68.5525 -10.7277 116.682 -27.8765 168.557
    .curve(points.dartLowerTop_cp1, points.dartLowerTop_cp2, points.dartLowerTop_ep)
    // inkex.paths.curve: c -28.4591 -8.52216 -54.7292 -20.6781 -82.76 -36.7159
    .curve(points.dartLowerPoint_cp1, points.dartLowerPoint_cp2, points.dartLowerPoint_ep)
    // inkex.paths.curve: c 18.5912 26.8278 32.4837 55.7392 43.7613 76.6196
    .curve(points.dartLowerBottom_cp1, points.dartLowerBottom_cp2, points.dartLowerBottom_ep)
    // inkex.paths.curve: c -13.9665 9.79401 -25.2608 14.1619 -39.1394 21.3312
    .line(points.neckEdge)
    // inkex.paths.curve: c -11.5386 -25.6553 -44.1392 -31.6027 -69.118 -32.0035
    .curve(points.neckCenter_cp1, points.neckCenter_cp2, points.neckCenter)
    .reverse()
}

export { draft_face_mirrored }
