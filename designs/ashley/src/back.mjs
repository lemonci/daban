import { back as titanBack } from '@freesewing/titan'
import { pctBasedOn } from '@freesewing/core'

function draftAshleyBack({
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
  /*
   * Helper method to draw the inseam path
   */
  const drawInseam = () =>
    options.fitKnee
      ? new Path()
          .move(points.fork)
          .curve(points.forkCp2, points.kneeInCp1, points.kneeIn)
          .line(points.floorIn)
      : new Path().move(points.fork).curve(points.forkCp2, points.kneeInCp1, points.floorIn)
  /*
   * Helper method to draw the outseam path
   */
  const drawOutseam = () => {
    let waistOut = points.styleWaistOut || points.waistOut
    if (options.fitKnee) {
      if (points.waistOut.x > points.seatOut.x)
        return new Path()
          .move(points.floorOut)
          .line(points.kneeOut)
          .curve(points.kneeOutCp2, points.seatOut, waistOut)
      else
        return new Path()
          .move(points.floorOut)
          .line(points.kneeOut)
          .curve(points.kneeOutCp2, points.seatOutCp1, points.seatOut)
          .curve_(points.seatOutCp2, waistOut)
    } else {
      if (points.waistOut.x > points.seatOut.x)
        return new Path().move(points.floorOut).curve(points.kneeOutCp2, points.seatOut, waistOut)
      else
        return new Path()
          .move(points.floorOut)
          .curve(points.kneeOutCp2, points.seatOutCp1, points.seatOut)
          .curve_(points.seatOutCp2, waistOut)
    }
  }

  delete paths.hint

  paths.outseam = drawOutseam().hide()
  paths.inseam = drawInseam().hide()

  points.inseamShiftUpwards = paths.inseam.shiftFractionAlong(options.lengthInseam)
  const inseamShiftAmount = paths.inseam.length() * (1 - options.lengthInseam)
  const seamLengthDifference = 0

  points.outseamShiftUpwards = paths.outseam.shiftAlong(inseamShiftAmount + seamLengthDifference)

  paths.shortHem = new Path().move(points.inseamShiftUpwards).line(points.outseamShiftUpwards)
  const originalHemLength = paths.shortHem.length()
  store.set('original_hem_back', originalHemLength)

  paths.crossSeam = new Path()
    .move(points.styleWaistIn)
    .line(points.crossSeamCurveStart)
    .curve(points.crossSeamCurveCp1, points.crossSeamCurveCp2, points.fork)

  paths.waist = new Path().move(points.styleWaistIn).line(points.styleWaistOut) //.setClass('various')
  store.set('waistbandBack', paths.waist.length())

  points.flaredOutseam = points.outseamShiftUpwards
    .rotate(options.outseamAngle, points.seatOut)
    .shiftTowards(points.seatOut, options.outseamShorter * measurements.inseam)

  points.flaredInseam = points.inseamShiftUpwards.rotate(-options.inseamAngle, points.fork)

  points.floorOut = points.flaredOutseam
  points.floorIn = points.flaredInseam

  store.set('back_waist_width', paths.waist.length())

  //Redraw inseam and outseam paths
  paths.newInseam = new Path().move(points.fork).curve_(points.forkCp2, points.flaredInseam)
  paths.newOutseam = new Path().move(points.flaredOutseam)

  if (
    points.flaredOutseam.angle(points.seatOut) < points.flaredOutseam.angle(points.styleWaistOut)
  ) {
    store.flag.note({
      msg: `ashley:outseamConcave`,
    })
    paths.newOutseam = paths.newOutseam
      ._curve(points.seatOutCp1, points.seatOut)
      .curve_(points.seatOutCp2, points.styleWaistOut)
  } else {
    paths.newOutseam = paths.newOutseam.line(points.styleWaistOut)
  }

  let waistOut = points.styleWaistOut || points.waistOut
  points.yokeOutseamPoint = paths.newOutseam
    .reverse()
    .shiftAlong(measurements.waistToUpperLeg * 0.05)
  points.yokeCrossPoint = paths.crossSeam.shiftAlong(
    measurements.waistToUpperLeg * options.yokeDepth
  )

  paths.yokePreview = new Path()
    .move(points.yokeCrossPoint)
    .line(points.yokeOutseamPoint)
    .line(waistOut)
    .line(points.styleWaistIn)
    .line(points.yokeCrossPoint)
    .setClass('various sa')
    .close()
    .hide()
  if (options.showPreviewLines) paths.yokePreview = paths.yokePreview.unhide()

  snippets['backNotch1'] = new Snippet(
    'notch',
    points.yokeCrossPoint.shiftFractionTowards(points.yokeOutseamPoint, 1 / 3)
  )
  snippets['backNotch2'] = new Snippet(
    'bnotch',
    points.yokeCrossPoint.shiftFractionTowards(points.yokeOutseamPoint, 2 / 3)
  )

  paths.shortHem.hide()
  paths.waist.hide()
  paths.crossSeam = new Path()
    .move(points.yokeCrossPoint)
    .line(points.crossSeamCurveStart)
    .curve(points.crossSeamCurveCp1, points.crossSeamCurveCp2, points.fork)

  paths.newOutseam = paths.newOutseam.split(points.yokeOutseamPoint)[0]
  paths.newOutseam.hide()

  paths.saBasis = new Path()
    .move(points.flaredOutseam)
    .join(paths.newOutseam)
    .line(points.yokeOutseamPoint)
    .line(points.yokeCrossPoint)
    .join(paths.crossSeam)
    .join(paths.newInseam)
  //.line(points.flaredOutseam)
  //.close()

  if (sa) {
    paths.sa = paths.saBasis
      .offset(sa)
      .join(
        new Path()
          .move(points.flaredInseam)
          .line(points.flaredOutseam)
          .offset(sa * options.hemExtraSeamAllowance)
      )
      .close()
      .setClass('fabric sa')
  }
  paths.seam = paths.saBasis.close().unhide().setClass('fabric')
  if (paths.hemBase) delete paths.hemBase

  //remove all broken paperless macros
  macro('rmVd', 'hHemToSideWaist')
  macro('rmVd', 'hFull')
  macro('rmVd', 'hHemToFork')
  macro('rmHd', 'wHem')
  macro('rmHd', 'wHemLeft')
  macro('rmHd', 'wHemRight')
  macro('rmHd', 'wPleatToSideWaist')
  macro('rmHd', 'wPleatToSideWaistAlt')
  macro('rmHd', 'wForkToPleat')
  macro('rmHd', 'wForkProjectionToPleat')
  macro('rmHd', 'wStartCrotchCurveToPleat')
  macro('rmHd', 'wCbWaistToPleat')
  macro('rmVd', 'hStartCrotchCurveToCbWaist')
  macro('rmVd', 'hForkToCbWaist')

  points.hemLowestPoint = paths.shortHem.shiftFractionAlong(0.5)
  let x = 0
  let ary = paths.shortHem.intersectsY(points.hemLowestPoint.y + 1)
  while (ary.length > 0 && x < measurements.waistToSeat) {
    log.info('Hem intersects ' + ary.length + ' times at y ' + points.hemLowestPoint.y)

    points.hemLowestPoint = ary[0]
    x = x + 1
    ary = paths.shortHem.intersectsY(points.hemLowestPoint.y + 1)
  }
  //snippets['hemLowestPoint'] = new Snippet('notch', points.hemLowestPoint)

  points.waistLowestPoint = paths.waist.shiftFractionAlong(0.5)
  x = 0
  ary = paths.waist.intersectsY(points.waistLowestPoint.y + 2)
  while (ary.length > 0 && x < measurements.waistToFloor) {
    log.info('Waist intersects ' + ary.length + ' times at y ' + points.waistLowestPoint.y)

    points.waistLowestPoint = ary[0]
    x = x + 2
    ary = paths.waist.intersectsY(points.waistLowestPoint.y + 2)
  }
  //snippets['waistLowestPoint'] = new Snippet('notch', points.waistLowestPoint)

  macro('rmGrainline', 'grainline')
  points.grainlineBottom = new Point(points.grainlineBottom.x, points.flaredOutseam.y)
  points.grainlineTop = new Point(points.grainlineBottom.x, points.yokeCrossPoint.y)
  macro('grainline', {
    from: points.grainlineTop,
    to: points.grainlineBottom,
  })

  macro('hd', {
    id: 'wHem',
    from: points.flaredInseam,
    to: points.flaredOutseam,
    y: points.hemLowestPoint.y + 30 + sa,
  })
  macro('ld', {
    id: 'lHem',
    from: points.flaredInseam,
    to: points.flaredOutseam,
    d: 15,
  })
  macro('hd', {
    id: 'wHemLeft',
    from: points.flaredInseam,
    to: points.grainlineBottom,
    y: points.grainlineBottom.y + 15 + sa,
  })
  macro('hd', {
    id: 'wHemRight',
    from: points.grainlineBottom,
    to: points.flaredOutseam,
    y: points.grainlineBottom.y + 15 + sa,
  })

  macro('vd', {
    id: 'floorToOutseam',
    from: points.flaredInseam,
    to: points.flaredOutseam,
    x: points.flaredOutseam.x + 15 + sa,
  })
  macro('vd', {
    id: 'floorToInseam',
    from: points.hemLowestPoint,
    to: points.flaredInseam,
    x: points.flaredInseam.x - 15 - sa,
  })

  /*
  macro('pd', {
    path: paths.newOutseam.reverse(),
    d: -15 - sa,
  })
    */

  macro('vd', {
    id: 'hOutseam',
    from: points.yokeOutseamPoint,
    to: points.flaredOutseam,
    x: points.flaredOutseam.x + 15 + sa,
  })
  macro('hd', {
    id: 'wOutseam',
    from: points.yokeOutseamPoint,
    to: points.flaredOutseam,
    y: points.yokeCrossPoint.y - 15 - sa,
  })

  macro('ld', {
    id: 'lengthWaist',
    from: points.yokeCrossPoint,
    to: points.yokeOutseamPoint,
    d: -15 - sa,
  })

  macro('hd', {
    id: 'wWaist',
    to: points.styleWaistOut,
    from: points.yokeCrossPoint,
    y: points.yokeCrossPoint.y - 15 - sa,
  })

  macro('vd', {
    id: 'vInseam',
    from: points.flaredInseam,
    to: points.fork,
    x: points.fork.x - sa - 15,
  })

  macro('hd', {
    id: 'hInseam',
    from: points.flaredInseam,
    to: points.fork,
    y: points.flaredInseam.y + sa + 15,
  })

  macro('pd', {
    id: 'lengthCrossSeam',
    path: paths.crossSeam.reverse(),
    d: -15 - sa,
  })
  macro('hd', {
    id: 'hCrossSeam',
    to: points.yokeCrossPoint,
    from: points.fork,
    y: points.yokeCrossPoint.y - sa - 15,
  })
  macro('vd', {
    id: 'vCrossSeam',
    to: points.yokeCrossPoint,
    from: points.fork,
    x: points.fork.x,
  })

  points.logoAnchor = points.styleWaistOut.shiftFractionTowards(points.hemLowestPoint, 0.5)
  snippets.logo = new Snippet('logo', points.logoAnchor)

  points.titleAnchor = points.fork.shiftFractionTowards(points.hemLowestPoint, 0.5)
  macro('title', {
    nr: 1,
    title: 'back',
    at: points.titleAnchor,
  })

  macro('rmScaleBox')

  return part
}

export const back = {
  from: titanBack,
  name: 'ashley.back',
  hide: { from: true },
  options: {
    yokeDepth: {
      pct: 25,
      min: 15,
      max: 50,
      menu: 'style.yoke',
      ...pctBasedOn('waistToUpperLeg'),
    },
  },
  measurements: ['hips', 'crotchDepth'],
  draft: draftAshleyBack,
}
