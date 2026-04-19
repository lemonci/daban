import { front } from './front.mjs'
import { pctBasedOn } from '@freesewing/core'

function draftAshleyPocket({
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
  paths.shortOutseam.unhide()
  paths.waist.unhide()
  paths.saBasis.hide()
  paths.pocketCutout.setClass('note help')

  let pocketDepth =
    measurements.waistToKnee * options.pocketDepth -
    options.waistbandWidth * measurements.waistToFloor -
    (1 - options.waistHeight) * measurements.waistToHips

  pocketDepth = Math.min(pocketDepth, paths.shortOutseam.length())

  points.pocketSideSeamIntercept = paths.shortOutseam.shiftAlong(pocketDepth)
  snippets['pocketSideSeamIntercept'] = new Snippet('notch', points.pocketSideSeamIntercept)

  points.pocketInnerCorner = points.pocketFacingEdge.shift(
    paths.waist.angleAt(points.pocketFacingEdge) + 90,
    pocketDepth
  )
  //snippets['pocketInnerCorner'] = new Snippet('notch', points.pocketInnerCorner)

  paths.pocketWaistEdge = paths.waist.split(points.pocketFacingEdge)[1]

  points.waistHalfway = paths.pocketWaistEdge.shiftFractionAlong(0.5)
  const waistHalfwayAngle = paths.pocketWaistEdge.angleAt(points.waistHalfway)
  points.pocketHalfwayBottom = points.waistHalfway.shift(waistHalfwayAngle + 90, pocketDepth)

  points.pocketSideSeamInterceptHalfway = points.pocketHalfwayBottom
  points.pocketSideSeamInterceptCp1 = points.pocketSideSeamInterceptHalfway.shift(
    waistHalfwayAngle + 180,
    options.pocketCurveControl * pocketDepth
  )
  points.pocketFacingEdgeHalfway = points.pocketFacingEdge.shiftFractionTowards(
    points.pocketInnerCorner,
    options.pocketCurveControl
  )
  points.pocketFacingEdgeCp2 = points.pocketFacingEdgeHalfway.shiftFractionTowards(
    points.pocketInnerCorner,
    options.pocketCurveControl
  )

  paths.pocketBottomEdge = new Path()
    .move(points.pocketSideSeamIntercept)
    .line(points.pocketSideSeamInterceptHalfway)
    .curve(
      points.pocketSideSeamInterceptCp1,
      points.pocketFacingEdgeCp2,
      points.pocketFacingEdgeHalfway
    )
    .line(points.pocketFacingEdge)
    .hide()

  delete paths.seam
  delete paths.shortHem
  delete paths.shortInseam
  delete paths.hint
  delete paths.crotchseam
  delete paths.pleatInner
  delete paths.pleatOuter
  delete paths.pleatCenter
  delete paths.flaredOutseamPreview
  delete paths.flaredInseamPreview

  delete paths.flyRightLegExtension
  delete paths.rightLegSeamLine
  delete paths.completeJseam
  delete paths.flyFacingLine

  delete snippets['opening_notch']
  delete snippets['logo']
  delete snippets['waistLowestPoint']
  delete snippets['hemLowestPoint']
  delete snippets['flyDepth']
  delete snippets['beltLoopFront']

  //Remove unused paperless macros (all the ones I added to the front, woof)

  macro('rmGrainline', 'grainline')

  macro('rmHd', 'wHem')
  macro('rmHd', 'hWaist')
  macro('rmHd', 'hCrossSeam')
  macro('rmHd', 'hPocket')
  macro('rmHd', 'hWaistToInseam')
  macro('rmHd', 'wHemRight')
  macro('rmHd', 'wHemLeft')
  macro('rmHd', 'hInseam')

  macro('rmVd', 'vWaistToInseam')
  macro('rmVd', 'floorToOutseam')
  macro('rmVd', 'floorToInseam')
  macro('rmVd', 'vInseam')
  macro('rmVd', 'vCrossSeam')
  macro('rmVd', 'heightWaistIn')
  macro('rmVd', 'vCrossSeam')
  macro('rmVd', 'heightPocketInner')
  macro('rmVd', 'heightWaistOut')
  macro('rmVd', 'vPocket')
  macro('rmVd', 'heightWaistLowest')

  macro('rmPd', 'lengthInseam')
  macro('rmPd', 'lengthHem')
  macro('rmPd', 'pd')
  macro('rmPd', 'lengthCrossSeam')
  macro('rmPd', 'lengthWaist')
  macro('rmPd', 'lengthPocket')
  macro('rmHd', 'waistLowestRight')
  macro('rmHd', 'waistLowestLeft')

  macro('rmHd', 'wTotal')
  macro('rmHd', 'wInseamToCenter')
  macro('rmHd', 'wOutseamToCenter')
  macro('rmHd', 'wPleastToFork')
  macro('rmHd', 'wPleastToCrotchProjection')
  macro('rmHd', 'wPleastToStartCrotchCurve')
  macro('rmHd', 'wPleatToCfWaist')
  macro('rmVd', 'hTotal')
  macro('rmVd', 'hInseam')
  macro('rmVd', 'hPocket')
  macro('rmHd', 'wPocket')
  macro('rmHd', 'wPocketToCenter')
  macro('rmVd', 'hOutseam')
  macro('rmVd', 'hForkToCfWaist')
  macro('rmVd', 'hStartCrotchCurveToCfWaist')
  macro('rmLd', 'lengthHem')

  paths.outseamTop = paths.shortOutseam.split(points.pocketSideSeamIntercept)[0]
  delete paths.shortOutseam
  delete paths.trimmedOutseam

  delete paths.trimmedWaist

  delete paths.waist

  delete paths.inseam
  delete paths.outseam

  paths.seam = paths.pocketWaistEdge
    .join(paths.outseamTop)
    .join(paths.pocketBottomEdge)
    .close()
    .setClass('fabric')
  //.hide()

  if (sa) {
    paths.saBase = paths.seam
    paths.sa = paths.saBase.offset(sa).setClass('fabric sa')
  }
  if (paths.hemBase) delete paths.hemBase

  points.grainlineBottom = points.pocketSideSeamIntercept.shiftFractionTowards(
    points.pocketInnerCorner,
    0.5
  )
  points.grainlineTop = paths.pocketWaistEdge
    .shiftFractionAlong(0.5)
    .shiftFractionTowards(points.grainlineBottom, 0.3)

  paths.pocketCutout = paths.pocketCutout.setClass('lining')

  points.lowestPocketPoint = points.pocketSideSeamInterceptHalfway
  let x = 0
  let ary = paths.pocketBottomEdge.intersectsY(points.lowestPocketPoint.y + 1)
  while (ary.length > 0 && x < measurements.waistToKnee) {
    points.lowestPocketPoint = ary[0]
    x = x + 1
    ary = paths.pocketBottomEdge.intersectsY(points.lowestPocketPoint.y + 1)
  }

  points.lowestWaistPoint = points.waistHalfway
  x = 0
  ary = paths.pocketWaistEdge.intersectsY(points.lowestWaistPoint.y + 1)
  while (ary.length > 0 && x < measurements.waistToKnee) {
    points.lowestPocketPoint = ary[0]
    x = x + 1
    ary = paths.pocketBottomEdge.intersectsY(points.lowestPocketPoint.y + 1)
  }
  //snippets['lowestWaistPoint'] = new Snippet('notch', points.lowestWaistPoint)

  if (!complete) {
    paths.pocketCutout.hide()
  }

  macro('grainline', {
    from: points.grainlineTop,
    to: points.grainlineBottom,
  })

  points.titleAnchor = points.pocketBottomEdge.shiftFractionTowards(
    points.pocketSideSeamInterceptHalfway,
    0.5
  )

  macro('title', {
    nr: 4,
    title: 'pocket',
    at: points.titleAnchor,
  })

  macro('pd', {
    id: 'lengthOutseam',
    path: paths.outseamTop.reverse(),
    d: -15 - sa,
  })

  macro('pd', {
    id: 'lengthWaist',
    path: paths.pocketWaistEdge.reverse(),
    d: -15 - sa,
  })

  macro('vd', {
    id: 'vLeft',
    to: points.lowestPocketPoint,
    from: points.styleWaistOut,
    x: points.styleWaistOut.x,
  })
  macro('vd', {
    id: 'vRight',
    to: points.lowestPocketPoint,
    from: points.pocketFacingEdge,
    x: points.pocketFacingEdge.x,
  })
  macro('vd', {
    id: 'vWaistLowest',
    to: points.lowestPocketPoint,
    from: points.lowestWaistPoint,
    x: points.lowestWaistPoint.x,
  })
  macro('hd', {
    id: 'hSide',
    from: points.pocketSideSeamIntercept,
    to: points.styleWaistOut,
    y: points.styleWaistOut.y - sa - 15,
  })

  macro('hd', {
    id: 'hTop',
    from: points.styleWaistOut,
    to: points.pocketFacingEdge,
    y: points.styleWaistOut.y - sa - 15,
  })

  /*
  macro('ld', {
    id: 'lengthOpening',
    from: points.pocketFacingEdge,
    to: points.openingNotch,
    d: 7,
  })
    */

  points.rightmostPocketPoint = points.pocketSideSeamIntercept
  x = 0
  ary = paths.pocketBottomEdge.intersectsX(points.rightmostPocketPoint.x + 1)
  while (ary.length > 0 && x < measurements.waistToKnee) {
    points.rightmostPocketPoint = ary[0]
    x = x + 1
    ary = paths.pocketBottomEdge.intersectsX(points.rightmostPocketPoint.x + 1)
  }
  //snippets['rightmostPocketPoint'] = new Snippet('notch', points.rightmostPocketPoint)

  macro('hd', {
    id: 'hBottom',
    from: points.pocketSideSeamIntercept,
    to: points.rightmostPocketPoint,
    y: points.lowestPocketPoint.y + sa + 30,
  })
  macro('hd', {
    id: 'hBottomLeft',
    to: points.lowestPocketPoint,
    from: points.pocketSideSeamIntercept,
    y: points.lowestPocketPoint.y + sa + 15,
  })
  macro('hd', {
    id: 'hBottomRight',
    from: points.lowestPocketPoint,
    to: points.rightmostPocketPoint,
    y: points.lowestPocketPoint.y + sa + 15,
  })
  macro('vd', {
    id: 'vBottomRight',
    from: points.lowestPocketPoint,
    to: points.pocketFacingEdge,
    x: points.rightmostPocketPoint.x + sa + 15,
  })
  macro('vd', {
    id: 'vBottomLeft',
    from: points.lowestPocketPoint,
    to: points.pocketSideSeamIntercept,
    x: points.pocketSideSeamIntercept.x - sa - 15,
  })

  return part
}

export const pocket = {
  name: 'ashley.pocket',
  measurements: [],
  from: front,
  options: {
    pocketDepth: {
      pct: 60,
      max: 80,
      min: 40,
      menu: 'style.pocket',
      ...pctBasedOn('waistToKnee'),
    },
    pocketCurveControl: {
      pct: 40,
      max: 80,
      min: 10,
      menu: 'style.pocket.advanced',
    },
  },
  draft: draftAshleyPocket,
}
