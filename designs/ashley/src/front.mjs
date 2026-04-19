import { front as titanFront } from '@freesewing/titan'
import { pctBasedOn, hidePresets } from '@freesewing/core'

function draftAshleyFront({
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
   * Helper method to draw the outseam path
   */
  const drawOutseam = () => {
    let waistOut = points.styleWaistOut || points.waistOut
    if (options.fitKnee) {
      if (points.waistOut.x < points.seatOut.x)
        return new Path()
          .move(waistOut)
          .curve(points.seatOut, points.kneeOutCp1, points.kneeOut)
          .line(points.floorOut)
      else
        return (
          new Path()
            .move(waistOut)
            //This is a problem point - the curve can go too high up past the waistband. need to tweak
            //points.seatOutCp1 down
            //.curve(points.seatOutCp1, points.seatOut)
            .line(points.seatOut)
            .curve(points.seatOutCp2, points.kneeOutCp1, points.kneeOut)
            .line(points.floorOut)
        )
    } else {
      if (points.waistOut.x < points.seatOut.x)
        return new Path().move(waistOut).curve(points.seatOut, points.kneeOutCp1, points.floorOut)
      else
        return (
          new Path()
            .move(waistOut)
            //._curve(points.seatOutCp1, points.seatOut)
            .line(points.seatOut)
            .curve(points.seatOutCp2, points.kneeOutCp1, points.floorOut)
        )
    }
  }

  /*
   * Helper method to draw the inseam path
   */
  const drawInseam = () =>
    options.fitKnee
      ? new Path()
          .move(points.floorIn)
          .line(points.kneeIn)
          .curve(points.kneeInCp2, points.forkCp1, points.fork)
      : new Path().move(points.floorIn).curve(points.kneeInCp2, points.forkCp1, points.fork)

  delete snippets['logo']

  paths.outseam = drawOutseam().setClass('lining').hide()
  paths.inseam = drawInseam().setClass('lining').hide()
  paths.crotchseam = new Path()
    .move(points.fork)
    .curve(points.crotchSeamCurveCp1, points.crotchSeamCurveCp2, points.crotchSeamCurveStart)
    .line(points.styleWaistIn)

  points.inseamShiftUpwards = paths.inseam.shiftFractionAlong(1 - options.lengthInseam)
  const inseamShiftAmount = paths.inseam.length() * options.lengthInseam
  const seamLengthDifference = paths.outseam.length() - paths.inseam.length()

  points.outseamShiftUpwards = paths.outseam.shiftAlong(inseamShiftAmount + seamLengthDifference)

  paths.shortHem = new Path()
    .move(points.inseamShiftUpwards)
    .line(points.outseamShiftUpwards)
    .reverse()
    .setClass('various')
    .hide()

  const originalHemLength = paths.shortHem.length()
  store.set('original_hem_front', originalHemLength)

  paths.shortInseam = paths.inseam.split(points.inseamShiftUpwards)[1]
  paths.shortOutseam = paths.outseam.split(points.outseamShiftUpwards)[0]

  paths.waist = new Path().move(points.styleWaistIn).line(points.styleWaistOut).setClass('lining')
  store.set('waistbandFront', paths.waist.length())

  points.flaredOutseam = points.outseamShiftUpwards
    .rotate(-options.outseamAngle, points.seatOut)
    .shiftTowards(points.seatOut, options.outseamShorter * measurements.inseam)

  points.flaredInseam = points.inseamShiftUpwards.rotate(options.inseamAngle, points.fork)

  //Calculate how deep the pocket opening has to go
  const waistCircum = measurements.waist * (1 + options.waistEase)
  log.info('The circumference of the garment at the waist is ' + waistCircum)
  const seatCircum = measurements.seat * (1 + options.seatEase)
  log.info('The circumference of the garment at the seat is ' + seatCircum)
  const seatDifferential = seatCircum - waistCircum
  log.info('The garment is ' + seatDifferential + ' mm wider at the seat than at the waist')
  const seatSlope = seatDifferential / measurements.waistToSeat
  log.info('The garment gets wider by ' + seatSlope + ' for every mm down from the waist')

  const seatMinusWaistEase = measurements.seat - waistCircum
  log.info('The body measurement at the seat is ' + measurements.seat)
  log.info('The seat is ' + measurements.waistToSeat + ' down from the body waist')
  log.info(
    'This pattern needs ' +
      seatMinusWaistEase +
      ' extra in the garment waist to fit the seat through'
  )
  const openingYBelowWaist = seatMinusWaistEase / seatSlope
  log.info(
    'The garment is ' +
      seatMinusWaistEase +
      ' mm wider than the waist at a point ' +
      openingYBelowWaist +
      ' down from the waist'
  )

  let waistbandWidth = options.waistbandWidth * measurements.waistToFloor
  store.set('waistbandWidth', waistbandWidth)

  log.info('The waistband is ' + waistbandWidth + ' wide')
  log.info(
    "The front center point is below the body's waist by " +
      (options.waistbandWidth * measurements.waistToFloor +
        (1 - options.waistHeight) * measurements.waistToHips)
  )

  const openingDepth = Math.max(
    openingYBelowWaist -
      (options.waistbandWidth * measurements.waistToFloor +
        (1 - options.waistHeight) * measurements.waistToHips),
    measurements.waistToSeat * 0.1
  )
  store.set('openingDepth', openingDepth)

  log.info('The opening needs to go down the front piece by ' + openingDepth)

  // *** POCKET ***

  //Draw the pocket cutout
  points.pocketInnerEdge = paths.waist.shiftFractionAlong(1 - options.frontPanelPercentage)

  points.pocketFacingEdge = paths.waist.shiftFractionAlong(
    (1 - options.frontPanelPercentage) * (1 - options.pocketFacingUnderlap)
  )

  points.frontBeltLoopSnippet = paths.waist.shiftFractionAlong(
    (1 - options.frontPanelPercentage) * 0.8
  )
  snippets['beltLoopFront'] = new Snippet('notch', points.frontBeltLoopSnippet)

  //send the total waist width to the store
  store.set('front_waist_width', paths.waist.length())

  const pocketCutoutDepth = measurements.waist * options.pocketOpeningDepth
  points.pocketBottomEdge = paths.outseam.shiftAlong(pocketCutoutDepth)

  points.pocketBottomEdgeCp1 = points.pocketBottomEdge.shift(
    points.styleWaistOut.angle(points.outseamShiftUpwards) + 90,
    paths.waist.length() * (1 - options.frontPanelPercentage) * options.pocketBottomCurve
  )

  points.pocketInnerEdgeCp2 = points.pocketInnerEdge.shift(
    points.styleWaistOut.angle(points.styleWaistIn) - 90,
    paths.waist.length() / 4
  )

  paths.pocketCutout = new Path()
    .move(points.pocketBottomEdge)
    .curve(points.pocketBottomEdgeCp1, points.pocketInnerEdgeCp2, points.pocketInnerEdge)
    .reverse()

  points.floorOut = points.flaredOutseam
  points.floorIn = points.flaredInseam

  points.kneeInCp2 = points.flaredInseam.shiftFractionTowards(
    points.fork,
    options.hemControlPointRatio
  )
  points.kneeOutCp1 = points.flaredOutseam.shiftFractionTowards(
    points.seatOut,
    options.hemControlPointRatio
  )

  points.seatOutCp2 = points.seatOutCp2.shiftFractionTowards(
    points.seatOut,
    options.seatCurveControlRatio
  )
  points.forkCp1 = points.forkCp1.shiftFractionTowards(points.fork, options.seatCurveControlRatio)

  paths.shortOutseam = drawOutseam()
  paths.shortInseam = drawInseam()

  let waistIn = points.styleWaistIn || points.waistIn
  let waistOut = points.styleWaistOut || points.waistOut

  if (waistOut.angle(points.seatOut) > points.seatOut.angle(points.flaredOutseam)) {
    log.info('Front outseam is concave with given settings')
    paths.shortOutseam = new Path().move(waistOut).line(points.flaredOutseam)
  }

  //Cut the waist and the outseam to account for the pocket chunk

  points.pocketSideSeamIntercept = paths.shortOutseam.shiftAlong(pocketCutoutDepth)
  points.pocketBottomEdge = points.pocketSideSeamIntercept
  paths.trimmedOutseam = paths.shortOutseam.split(points.pocketSideSeamIntercept)[1].hide()

  paths.pocketCutout = new Path()
    .move(points.pocketBottomEdge)
    .curve(points.pocketBottomEdgeCp1, points.pocketInnerEdgeCp2, points.pocketInnerEdge)
    .reverse()

  paths.shortOutseam.hide()
  paths.shortInseam.hide()
  paths.trimmedWaist = paths.waist.split(points.pocketInnerEdge)[0].setClass('lining').hide()
  paths.waist.hide()

  paths.crotchseam = new Path()
    .move(points.fork)
    .curve(points.crotchSeamCurveCp1, points.crotchSeamCurveCp2, points.crotchSeamCurveStart)
    .line(waistIn)

  //Draw the pocket opening depth on the pocket path
  if (openingDepth < 0) {
    log.info('This garment does not need a front opening deeper than the waistband.')
  } else {
    points.flyDepthDisplay = paths.crotchseam.reverse().shiftAlong(openingDepth)
    snippets['flyDepth'] = new Snippet('notch', points.flyDepthDisplay)
  }

  // *** FLY ***

  // Mark the bottom of the fly J-seam
  const flyBottom = utils.curveIntersectsY(
    points.crotchSeamCurveStart,
    points.crotchSeamCurveCp2,
    points.crotchSeamCurveCp1,
    points.fork,
    points.cfSeat.shiftFractionTowards(points.crotchSeamCurveCp2, options.flyLength).y
  )
  if (flyBottom) points.flyBottom = flyBottom
  else log.error('Unable to locate the fly bottom. This draft will fail.')

  // Define Fly components
  points.flyExtensionBottom = utils.curveIntersectsY(
    points.crotchSeamCurveStart,
    points.crotchSeamCurveCp2,
    points.crotchSeamCurveCp1,
    points.fork,
    points.cfSeat.shiftFractionTowards(points.crotchSeamCurveCp2, options.flyLength * 1.5).y
  )

  points.flyTop = points.styleWaistOut.shiftFractionTowards(
    points.styleWaistIn,
    1 - options.flyWidth
  )

  points.flyCorner = points.flyTop.shift(
    points.styleWaistIn.angle(points.crotchSeamCurveStart),
    points.styleWaistIn.dist(points.flyBottom)
  )
  points.flyCurveStart = points.flyCorner.shiftTowards(
    points.flyTop,
    points.flyBottom.dist(points.flyCorner)
  )
  points.flyCurveCp1 = points.flyBottom.shiftFractionTowards(points.flyCorner, options.flyCurve)
  points.flyCurveCp2 = points.flyCurveStart.shiftFractionTowards(points.flyCorner, options.flyCurve)

  let topStitchDist = (1 - options.flyWidth) * 8

  points.flyTopSeamline = points.flyTop.shiftTowards(points.styleWaistIn, topStitchDist)

  points.flyBottomSeamLine = utils.curveIntersectsY(
    points.crotchSeamCurveStart,
    points.crotchSeamCurveCp2,
    points.crotchSeamCurveCp1,
    points.fork,
    points.flyBottom.shiftTowards(points.crotchSeamCurveStart, topStitchDist).y
  )

  paths.flyFacingLine = new Path()
    .move(points.flyTop)
    .line(points.flyCurveStart)
    .curve(points.flyCurveCp2, points.flyCurveCp1, points.flyBottom)
    .setClass('lining dashed')

  let JseamCurve = paths.flyFacingLine.offset(-topStitchDist)

  // Too small to draw for dolls
  if (measurements.waist > 500) {
    const splitElement = JseamCurve.split(points.flyBottomSeamLine)[0]

    if (splitElement) {
      paths.completeJseam = splitElement
        .clone()
        .setClass('dashed')
        .addText('jseamStitchLine', 'center text-sm')

      paths.flyRightLegExtension = paths.crotchseam
        .clone()
        .split(points.flyBottom)[1]
        .offset(topStitchDist)
        .line(points.styleWaistIn)
        .reverse()
        .line(points.flyExtensionBottom)
        .reverse()
        .setClass('fabric')
        .addText('rightLegSeamline', 'center fill-note text-sm')
    }
  }
  store.set('waistbandFly', points.styleWaistIn.dist(points.flyTop))

  //draw the seam
  paths.saBasis = new Path()
    .move(points.flaredInseam)
    .join(paths.shortInseam)
    .join(paths.crotchseam)
    .join(paths.trimmedWaist)
    .join(paths.pocketCutout)
    .join(paths.trimmedOutseam)
    .hide()
  //.close()

  if (sa) {
    paths.sa = paths.saBasis
      .offset(sa)
      .join(
        new Path()
          .move(points.flaredOutseam)
          .line(points.flaredInseam)
          .offset(sa * options.hemExtraSeamAllowance)
      )
      .close()
      .setClass('fabric sa')

    if (paths.flyRightLegExtension) {
      paths.rightLegSeamLine = paths.flyRightLegExtension
        .clone()
        .offset(sa)
        .setClass('dotted')
        .addText('rightLegSeamAllowance', 'center fill-note text-sm')
    }
  }
  paths.seam = paths.saBasis.close().unhide().setClass('fabric')
  if (paths.hemBase) delete paths.hemBase

  points.titleAnchor = points.styleWaistIn.shiftFractionTowards(points.outseamShiftUpwards, 0.6)
  macro('title', {
    nr: 2,
    title: 'front',
    at: points.titleAnchor,
  })

  //Remove all broken paperless macros

  macro('rmVd', 'hHemToSideWaist')

  macro('rmVd', 'hHemToFork')
  macro('rmHd', 'wHem')
  macro('rmHd', 'wHemLeftToPleat')
  macro('rmHd', 'wHemRightToPleat')
  macro('rmHd', 'wSideWaistToPleat')

  /*macro('rmVd', 'hForkToCfWaist')
  macro('rmVd', 'hStartCrotchCurveToCfWaist')
  macro('rmHd', 'wPleatToCfWaist')
  macro('rmHd', 'wPleastToFork')
  macro('rmHd', 'wPleastToCrotchProjection')
  macro('rmHd', 'hForkToCfWaist')
  macro('rmHd', 'wPleastToStartCrotchCurve')*/

  macro('rmGrainline', 'grainline')
  points.grainlineBottom = new Point(
    points.grainlineTop.x,
    points.flaredInseam.shiftFractionTowards(points.flaredOutseam, 0.5).y
  )
  //points.grainlineTop = new Point(points.grainlineBottom.x, paths.waist.shiftFractionAlong(0.5).y)
  macro('grainline', {
    from: points.grainlineTop,
    to: points.grainlineBottom,
  })

  points.hemLowestPoint = points.flaredInseam
  let x = 0
  let ary = paths.shortHem.intersectsY(points.hemLowestPoint.y + 1)

  //snippets['hemLowestPoint'] = new Snippet('notch', points.hemLowestPoint)

  points.waistLowestPoint = paths.trimmedWaist.shiftFractionAlong(0.5)
  x = 0
  ary = paths.waist.intersectsY(points.waistLowestPoint.y + 2)
  while (ary.length > 0 && x < measurements.waistToSeat) {
    log.info('Waist intersects ' + ary.length + ' times at y ' + points.waistLowestPoint.y)

    points.waistLowestPoint = ary[0]
    x = x + 1
    ary = paths.waist.intersectsY(points.waistLowestPoint.y + 1)
  }
  //snippets['waistLowestPoint'] = new Snippet('notch', points.waistLowestPoint)

  macro('hd', {
    id: 'wTotal',
    from: points.flaredOutseam,
    to: points.fork,
    y: points.flaredInseam.y + 45 + sa,
  })

  macro('vd', {
    id: 'hTotal',
    from: points.styleWaistIn,
    to: points.hemLowestPoint,
    x: points.flaredOutseam.x - sa - 30,
  })

  macro('hd', {
    id: 'wHem',
    to: points.flaredInseam,
    from: points.flaredOutseam,
    y: points.hemLowestPoint.y + 30 + sa,
  })
  macro('vd', {
    id: 'floorToOutseam',
    from: points.hemLowestPoint,
    to: points.flaredOutseam,
    x: points.flaredOutseam.x - 15 - sa,
  })

  macro('ld', {
    id: 'lengthHem',
    to: points.flaredInseam,
    from: points.flaredOutseam,
    d: 15,
  })

  macro('vd', {
    id: 'hInseam',
    from: points.fork,
    to: points.flaredInseam,
    x: points.fork.x + 15 + sa,
  })

  macro('vd', {
    id: 'hOutseam',
    from: points.flaredOutseam,
    to: points.pocketSideSeamIntercept,
    x: points.flaredOutseam.x - 15 - sa,
  })

  macro('vd', {
    id: 'hPocket',
    from: points.pocketSideSeamIntercept,
    to: points.pocketInnerEdge,
    x: points.pocketSideSeamIntercept.x,
  })
  macro('hd', {
    id: 'wPocket',
    from: points.pocketSideSeamIntercept,
    to: points.pocketInnerEdge,
    y: points.pocketInnerEdge.y - 15 - sa,
  })
  macro('hd', {
    id: 'wPocketToCenter',
    from: points.pocketSideSeamIntercept,
    to: points.grainlineTop,
    y: points.pocketInnerEdge.y - 30 - sa,
  })

  macro('hd', {
    id: 'wOutseamToCenter',
    from: points.flaredOutseam,
    to: points.grainlineBottom,
    y: points.flaredOutseam.y - 15,
  })
  macro('hd', {
    id: 'wInseamToCenter',
    from: points.grainlineBottom,
    to: points.flaredInseam,
    y: points.flaredOutseam.y - 15,
  })

  return part
}

export const front = {
  from: titanFront,
  name: 'ashley.front',
  hide: { from: true },
  measurements: ['inseam'],
  options: {
    //Defaults for Titan settings
    lengthBonus: 0,
    kneeEase: 0.06,

    waistHeight: { pct: 25, min: -5, max: 100, menu: 'style' },
    seatEase: { pct: 5, min: 2, max: 15, menu: 'fit' },

    waistAngle: { deg: 12, min: -20, max: 20, menu: 'style' },

    useWaistAngleFor: {
      dflt: 'frontOnly',
      list: ['frontOnly', 'backOnly', 'both'],
      menu: 'style',
    },
    waistbandWidth: {
      pct: 4,
      min: 1,
      max: 10,
      ...pctBasedOn('waistToFloor'),
      menu: 'style',
    },

    lengthInseam: { pct: 25, min: 5, max: 100, menu: 'style', ...pctBasedOn('inseam') },

    frontPanelPercentage: {
      pct: 50,
      min: 33,
      max: 75,
      menu: 'style.pocket',
    },
    pocketOpeningDepth: {
      pct: 7,
      min: 3,
      max: 25,
      menu: 'style.pocket',
    },
    pocketFacingUnderlap: {
      pct: 50,
      min: 10,
      max: 80,
      menu: 'style.pocket.advanced',
    },
    pocketBottomCurve: {
      pct: 30,
      min: 10,
      max: 75,
      menu: 'style.pocket.advanced',
    },

    fitKnee: false,

    outseamAngle: {
      deg: 9,
      min: 0,
      max: 45,
      menu: 'style',
    },
    inseamAngle: {
      deg: 3,
      min: 0,
      max: 45,
      menu: 'style',
    },

    outseamShorter: {
      pct: 5,
      min: 0,
      max: 20,
      menu: 'style',
    },

    hemControlPointRatio: 0.5,

    seatCurveControlRatio: 0.5,

    hemExtraSeamAllowance: {
      pct: 600,
      min: 100,
      max: 800,
      menu: 'advanced',
    },

    // Fly
    flyCurve: { pct: 72, min: 50, max: 100, menu: 'advanced.fly' },
    flyLength: { pct: 45, min: 30, max: 60, menu: 'advanced.fly' },
    flyWidth: { pct: 15, min: 10, max: 20, menu: 'advanced.fly' },
  },
  draft: draftAshleyFront,
}
