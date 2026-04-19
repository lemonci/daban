import { back } from './back.mjs'
import { pctBasedOn } from '@freesewing/core'

function draftAshleyYoke({
  points,
  Point,
  paths,
  Path,
  options,
  complete,
  measurements,
  store,
  macro,
  utils,
  snippets,
  Snippet,
  sa,
  log,
  part,
}) {
  //Helper method to draw the yoke seam
  const drawYokeSeam = () =>
    new Path()
      .move(points.yokeOutseamPoint)
      .curve(points.yokeOutseamCp2, points.yokeCrossPointCp1, points.yokeCrossPoint)

  //Helper method to draw the waist seam
  const drawWaistSeam = () =>
    new Path()
      .move(points.styleWaistIn)
      .curve(points.waistCrossPointCp1, points.waistOutseamCp2, points.styleWaistOut)

  for (const i in paths) paths[i].hide()
  for (const s in snippets) delete snippets[s]
  delete snippets.logo
  //paths.yokePreview.unhide()

  points.waistCenter = points.styleWaistIn.shiftFractionTowards(points.styleWaistOut, 0.5)
  points.hipCenter = points.yokeCrossPoint.shiftFractionTowards(points.yokeOutseamPoint, 0.5)

  const originalWaistLength = points.styleWaistIn.dist(points.styleWaistOut)
  const originalHipLength = points.yokeCrossPoint.dist(points.yokeOutseamPoint)

  log.info(
    'Original waist length is ' +
      originalWaistLength +
      ', original hip length is ' +
      originalHipLength
  )

  //Draw the original yoke before the dart manipulations
  /*
  paths.yokePreview = new Path()
    .move(points.yokeCrossPoint)
    .line(points.yokeOutseamPoint)
    .line(points.styleWaistOut)
    .line(points.styleWaistIn)
    .line(points.yokeCrossPoint)
    .setClass('sa various')
    .hide()
    */

  const yokeAngle = options.yokeAngle

  //Rotate the endpoints around the center of the waist and the center of
  //the yoke seam
  points.styleWaistOut = points.styleWaistOut.rotate(yokeAngle, points.waistCenter)
  points.styleWaistIn = points.styleWaistIn.rotate(-yokeAngle, points.waistCenter)

  points.yokeOutseamPoint = points.yokeOutseamPoint.rotate(yokeAngle, points.hipCenter)
  points.yokeCrossPoint = points.yokeCrossPoint.rotate(-yokeAngle, points.hipCenter)

  //Maybe just shift the waist points inward?
  let recoveryShift =
    options.yokeRecoveryShift *
    measurements.waist *
    (options.yokeDepth * 2) *
    (options.yokeAngle / 5)
  points.styleWaistOut = points.styleWaistOut.shift(180, recoveryShift)
  points.styleWaistIn = points.styleWaistIn.shift(180, recoveryShift)
  points.waistCenter = points.waistCenter.shift(180, recoveryShift)

  //Define and draw curved yoke line
  //Set the initial control points for the hip curves
  let hipShiftDistance = originalHipLength * 0.5 * options.yokeCurveControl
  points.yokeOutseamCp2 = points.yokeOutseamPoint.shiftTowards(points.hipCenter, hipShiftDistance)
  points.yokeCrossPointCp1 = points.yokeCrossPoint.shiftTowards(points.hipCenter, hipShiftDistance)

  paths.yokeHipCurve = drawYokeSeam()

  let delta = paths.yokeHipCurve.length() - originalHipLength
  let iteration = 0
  let curveAngle = 0
  while (Math.abs(delta) > 0.1 && iteration < 5) {
    log.info(
      'Yoke curve delta ' +
        iteration +
        ': ' +
        delta +
        ', curve length ' +
        paths.yokeHipCurve.length()
    )
    points.yokeOutseamCp2 = points.yokeOutseamCp2.shift(90, delta * 2)
    points.yokeCrossPointCp1 = points.yokeCrossPointCp1.shift(90, delta * 2)

    paths.yokeHipCurve = drawYokeSeam()
    if (options.showPreviewLines)
      paths['yokeCurvePreview' + iteration] = drawYokeSeam().setClass('note sa')

    if (Math.abs(paths.yokeHipCurve.length() - originalHipLength) > Math.abs(delta)) {
      store.flag.note({
        msg: `ashley:yokeBroken`,
      })
      //iteration=10
    }

    curveAngle =
      points.yokeOutseamPoint.angle(points.yokeOutseamCp2) -
      points.yokeOutseamPoint.angle(points.yokeCrossPoint)
    if (curveAngle < 0) {
      //Control points have flipped upwards
      log.info('Yoke curve flipped')
      store.flag.note({
        msg: `ashley:yokeFlipped`,
      })
      if (options.showPreviewLines)
        paths['yokeCurvePreview' + iteration] = drawYokeSeam().setClass('various sa')

      points.yokeOutseamCp2 = points.yokeOutseamCp2.rotate(
        -curveAngle * 1.75,
        points.yokeOutseamPoint
      )
      points.yokeCrossPointCp1 = points.yokeCrossPointCp1.rotate(
        curveAngle * 1.75,
        points.yokeCrossPoint
      )
    }
    iteration = iteration + 1

    delta = paths.yokeHipCurve.length() - originalHipLength
  }
  paths.yokeHipCurve.hide()

  //Define and draw curved waist line
  let waistShiftDistance = originalWaistLength * 0.5 * options.yokeCurveControl

  points.waistOutseamCp2 = points.styleWaistOut.shiftTowards(points.waistCenter, waistShiftDistance)
  points.waistCrossPointCp1 = points.styleWaistIn.shiftTowards(
    points.waistCenter,
    waistShiftDistance
  )

  paths.waistCurve = drawWaistSeam().hide()

  delta = paths.waistCurve.length() - originalWaistLength
  iteration = 0

  while (Math.abs(delta) > 0.1 && iteration < 5) {
    log.info('Waist curve delta ' + iteration + ': ' + delta)
    //log.info("Curve length " + paths.waistCurve.length())
    points.waistOutseamCp2 = points.waistOutseamCp2.shift(90, delta * 3)
    points.waistCrossPointCp1 = points.waistCrossPointCp1.shift(90, delta * 3)

    paths.waistCurve = drawWaistSeam()
    if (options.showPreviewLines)
      paths['waistCurvePreview' + iteration] = drawWaistSeam().setClass('note sa')

    curveAngle =
      points.styleWaistOut.angle(points.waistOutseamCp2) -
      points.styleWaistOut.angle(points.styleWaistIn)
    if (curveAngle < 0) {
      //Control points have flipped upwards
      log.info('Waist curve flipped')
      store.flag.note({
        msg: `ashley:waistFlipped`,
      })
      if (options.showPreviewLines)
        paths['waistCurvePreview' + iteration] = drawWaistSeam().setClass('various sa')

      points.waistOutseamCp2 = points.waistOutseamCp2.rotate(
        -curveAngle * 1.75,
        points.styleWaistOut
      )
      points.waistCrossPointCp1 = points.waistCrossPointCp1.rotate(
        curveAngle * 1.75,
        points.styleWaistIn
      )
    }

    iteration = iteration + 1
    delta = paths.waistCurve.length() - originalWaistLength
  }

  paths.waistCurve.hide()

  if (options.showPreviewLines) {
    paths.yokePreview = new Path()
      .move(points.yokeOutseamPoint)
      .line(points.styleWaistOut)
      .line(points.waistCenter)
      .line(points.styleWaistIn)
      .line(points.yokeCrossPoint)
      .line(points.hipCenter)
      .close()
      .setClass('sa various')
    paths.yokeCenter = new Path()
      .move(points.hipCenter)
      .line(points.waistCenter)
      .setClass('sa various')
  }

  paths.seam = new Path()
    .move(points.yokeOutseamPoint)
    .line(points.styleWaistOut)
    .join(paths.waistCurve.reverse())
    .line(points.yokeCrossPoint)
    .join(paths.yokeHipCurve.reverse())
    .close()
    .setClass('fabric')

  if (sa) {
    paths.sa = paths.seam.offset(sa).setClass('fabric sa')
  }

  store.cutlist.removeCut()
  store.cutlist.addCut({ cut: 2 })

  snippets['backNotch1'] = new Snippet('bnotch', paths.yokeHipCurve.shiftFractionAlong(1 / 3))
  snippets['backNotch2'] = new Snippet('notch', paths.yokeHipCurve.shiftFractionAlong(2 / 3))

  points.titleAnchor = points.yokeCrossPoint.shiftFractionTowards(points.waistCrossPointCp1, 0.5)
  macro('title', {
    nr: 3,
    title: 'yoke',
    at: points.titleAnchor,
    scale: 0.5,
  })

  points.yokeLowestPoint = paths.yokeHipCurve.shiftFractionAlong(0.5)

  macro('vd', {
    id: 'bottomToCrossPoint',
    from: points.yokeCrossPoint,
    to: points.yokeLowestPoint,
    x: points.yokeCrossPoint.x,
  })
  macro('vd', {
    id: 'bottomToOutseamPoint',
    from: points.yokeOutseamPoint,
    to: points.yokeLowestPoint,
    x: points.yokeOutseamPoint.x,
  })
  macro('vd', {
    id: 'crossSeamHeight',
    from: points.yokeCrossPoint,
    to: points.styleWaistIn,
    x: points.yokeCrossPoint.x,
  })
  macro('hd', {
    id: 'crossSeamWidth',
    from: points.yokeCrossPoint,
    to: points.styleWaistIn,
    y: points.styleWaistIn.y,
  })

  macro('vd', {
    id: 'outseamHeight',
    from: points.yokeOutseamPoint,
    to: points.styleWaistOut,
    x: points.yokeOutseamPoint.x,
  })
  macro('hd', {
    id: 'outseamWidth',
    from: points.yokeOutseamPoint,
    to: points.styleWaistOut,
    y: points.styleWaistOut.y,
  })
  macro('vd', {
    id: 'waistHeight',
    from: points.styleWaistIn,
    to: points.styleWaistOut,
    x: points.styleWaistOut.x,
  })
  macro('hd', {
    id: 'waistWidth',
    from: points.styleWaistIn,
    to: points.styleWaistOut,
    y: points.styleWaistIn.y,
  })

  points.waistMidwayPoint = paths.waistCurve.shiftFractionAlong(0.5)
  macro('vd', {
    id: 'waistHalfHeight',
    from: points.waistMidwayPoint,
    to: points.styleWaistIn,
    x: points.waistMidwayPoint.x,
  })
  macro('hd', {
    id: 'waistHalfWidth',
    from: points.waistMidwayPoint,
    to: points.styleWaistOut,
    y: points.waistMidwayPoint.y,
  })

  macro('hd', {
    id: 'hipLeftWidth',
    from: points.yokeCrossPoint,
    to: points.yokeLowestPoint,
    y: points.yokeLowestPoint.y + 15 + sa,
  })
  macro('hd', {
    id: 'hipRightWidth',
    from: points.yokeLowestPoint,
    to: points.yokeOutseamPoint,
    y: points.yokeLowestPoint.y + 15 + sa,
  })
  macro('ld', {
    id: 'crossSeamLength',
    to: points.styleWaistIn,
    from: points.yokeCrossPoint,
  })

  macro('pd', {
    id: 'hipLength',
    path: paths.yokeHipCurve.reverse(),
    d: -7.5,
  })
  macro('pd', {
    id: 'waistLength',
    path: paths.waistCurve,
  })

  return part
}

export const yoke = {
  name: 'ashley.yoke',
  measurements: [],
  from: back,
  options: {
    yokeAngle: {
      deg: 8,
      min: 0,
      max: 15,
      menu: 'style.yoke',
    },
    yokeCurveControl: 0.7,

    yokeRecoveryShift: {
      pct: 0.5,
      min: 0,
      max: 2,
      menu: 'advanced',
    },
    showPreviewLines: false,
  },
  draft: draftAshleyYoke,
}
