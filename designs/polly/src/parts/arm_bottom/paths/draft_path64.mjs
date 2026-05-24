import { scaleAllPoints } from '../../../shared.mjs'

function draft_path64(
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
  const drawArmCurve = () => {
    if (options.armLength > 0.8) {
      log.info('long arm')
      return (
        new Path()
          .move(points.armpitPointRight_ep)

          // inkex.paths.curve: c 0.26393 15.8943 -0.93376 42.5687 0.42245 63.7888
          /*
          ._curve(
            //points.armNarrowRight_cp1, 
            points.armNarrowRight_cp2, 
            points.armNarrowRight_ep)
          // inkex.paths.curve: c 4.51413 47.2555 26.3062 122.293 -3.55182 164.779
          */
          .curve(points.armWideRight_cp1, points.armWideRight_cp2, points.armWideRight_ep)
          ._curve(
            //points.armWideLeft_cp1,
            points.curveBottom_cpRight,
            points.curveBottom
          )
          .hide()
      )
    }
    //else, short arm
    return (
      new Path()
        .move(points.armpitPointRight_ep)

        // inkex.paths.curve: c 0.26393 15.8943 -0.93376 42.5687 0.42245 63.7888
        /*
        ._curve(
          //points.armNarrowRight_cp1, 
          points.armNarrowRight_cp2, 
          points.armNarrowRight_ep)
        // inkex.paths.curve: c 4.51413 47.2555 26.3062 122.293 -3.55182 164.779
        */
        ._curve(
          //points.armWideRight_cp1,
          points.armWideRight_cp2,
          points.armWideRight_ep
        )
        ._curve(
          //points.armWideLeft_cp1,
          points.curveBottom_cpRight,
          points.curveBottom
        )
        .hide()
    )
  }

  // Path: path64
  // m 79.3917 371.74
  // c 33.1012 -0.59962 50.4497 -22.6328 61.6766 -30.8383
  points.armpitPointRight_cp1 = new Point(112.1012, 371.4004)
  points.armpitPointRight_cp2 = new Point(129.4497, 349.3672)
  points.armpitPointRight_ep = new Point(140.6766, 341.1617)
  // c 0.26393 15.8943 -0.93376 42.5687 0.42245 63.7888
  points.armNarrowRight_cp1 = new Point(141.2639, 356.8943)
  points.armNarrowRight_cp2 = new Point(140.0662, 383.5687)
  points.armNarrowRight_ep = new Point(141.4224, 404.7888)
  // c 4.51413 47.2555 26.3062 122.293 -3.55182 164.779
  points.armWideRight_cp1 = new Point(145.5141, 452.2555)
  points.armWideRight_cp2 = new Point(167.3062, 527.2926)
  points.armWideRight_ep = new Point(137.4482, 569.7786)

  // c 10.2074 6.6545 26.6743 26.5798 59.7756 25.9802
  points.armpitCenter_ep = new Point(80, 371.9802)
  // z

  points.curveBottom = new Point(80, 595.7)
  points.curveBottom_cpRight = new Point(115, 595.7)

  points.title = new Point(40, 500)

  scaleAllPoints(part, options.totalSize)

  paths.armpitPath = new Path()
    .move(points.armpitCenter_ep)
    // inkex.paths.curve: c 33.1012 -0.59962 50.4497 -22.6328 61.6766 -30.8383
    .curve(points.armpitPointRight_cp1, points.armpitPointRight_cp2, points.armpitPointRight_ep)
    .hide()

  //Match armpit curve length
  const armpitCurveFront = store.get('armpitCurveFront')
  let armpitCurveBack = paths.armpitPath.length()

  let delta = armpitCurveFront - armpitCurveBack
  log.debug('Armpit curve delta ' + delta)
  let armpitIteration = 0

  const shiftPoints = ['armpitPointRight_cp2', 'armpitPointRight_ep', 'armNarrowRight_cp1']

  while (armpitIteration < 8 && Math.abs(delta) > 0.001 * options.totalSize) {
    log.debug('lower arm iteration ' + armpitIteration + ', delta = ' + delta)

    //shift each point
    for (let p of shiftPoints) {
      points[p] = points[p].shift(0, delta)
    }

    //redraw the path
    paths.armpitPath = new Path()
      .move(points.armpitCenter_ep)
      // inkex.paths.curve: c 33.1012 -0.59962 50.4497 -22.6328 61.6766 -30.8383
      .curve(points.armpitPointRight_cp1, points.armpitPointRight_cp2, points.armpitPointRight_ep)
      .hide()

    //recalculate delta
    armpitCurveBack = paths.armpitPath.length()
    delta = armpitCurveFront - armpitCurveBack

    armpitIteration = armpitIteration + 1
  }

  //Match vertical length
  const armVerticalLength = store.get('armVerticalLength')
  let bottomVerticalLength = points.curveBottom.y - points.armpitPointRight_ep.y
  delta = armVerticalLength - bottomVerticalLength
  log.debug('Arm length delta ' + delta)
  let armLengthIteration = 0
  const vertShiftPoints = [
    'armWideRight_ep',
    'armWideRight_cp2',
    'curveBottom',
    'curveBottom_cpRight',
  ]

  while (armLengthIteration < 5 && Math.abs(delta) > 0.001 * options.totalSize) {
    log.debug('Arm length iteration ' + armLengthIteration + ', delta = ' + delta)

    //shift each point
    for (let p of vertShiftPoints) {
      points[p] = points[p].shift(-90, delta)
    }

    //recalculate delta
    bottomVerticalLength = points.curveBottom.y - points.armpitPointRight_ep.y
    delta = armVerticalLength - bottomVerticalLength

    armLengthIteration = armLengthIteration + 1
  }

  paths.armCurvePath = drawArmCurve()

  //Match arm lower curve length
  const armTopCurve = store.get('armTopCurve')
  let armBottomCurve = paths.armCurvePath.length()

  delta = armTopCurve - armBottomCurve
  log.debug('Arm curve delta ' + delta)
  let armIteration = 0

  const armShiftPoints = ['armWideRight_ep', 'armWideRight_cp2']

  while (armIteration < 5 && Math.abs(delta) > 0.001 * options.totalSize) {
    log.debug('Arm curve iteration ' + armIteration + ', delta = ' + delta)

    //shift each point
    for (let p of armShiftPoints) {
      points[p] = points[p].shift(0, delta)
    }

    //redraw the path
    paths.armCurvePath = drawArmCurve()

    //recalculate delta
    armBottomCurve = paths.armCurvePath.length()
    delta = armTopCurve - armBottomCurve

    armIteration = armIteration + 1
  }

  //And combine the path!
  paths.path64 = paths.armpitPath.join(paths.armCurvePath)
}

export { draft_path64 }
