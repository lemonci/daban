import { pctBasedOn } from '@freesewing/core'

function draftAshleyPocketBack({
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
  const halfWidth = measurements.seatBack * options.backPocketWidth * 0.5
  const depth = measurements.waistToUpperLeg * options.backPocketDepth

  points.topLeft = new Point(-halfWidth, 0)
  points.topRight = new Point(halfWidth, 0)
  points.bottomLeft = new Point(-halfWidth * 0.9, depth)
  points.bottomRight = new Point(halfWidth * 0.9, depth)
  points.bottomCenter = new Point(0, depth * 1.1)

  const hemAllowance = measurements.waistToUpperLeg * options.backPocketTopHemAllowance

  points.topHemLeft = new Point(-halfWidth, -hemAllowance)
  points.topHemRight = new Point(halfWidth, -hemAllowance)

  paths.hemMark = new Path().move(points.topLeft).line(points.topRight).setClass('fabric sa')

  paths.seam = new Path()
    .move(points.bottomCenter)
    .line(points.bottomRight)
    .line(points.topRight)
    .line(points.topHemRight)
    .line(points.topHemLeft)
    .line(points.topLeft)
    .line(points.bottomLeft)
    .line(points.bottomCenter)
    .close()
    .setClass('fabric')

  if (sa) {
    paths.sa = paths.seam.offset(sa).setClass('fabric sa')
  }

  macro('hd', {
    id: 'wTotal',
    from: points.topHemLeft,
    to: points.topHemRight,
    y: points.topHemRight.y - 15 - sa,
  })
  macro('hd', {
    id: 'wBottom',
    from: points.bottomLeft,
    to: points.bottomRight,
    y: points.bottomRight.y,
  })
  macro('hd', {
    id: 'wBottomLeft',
    from: points.bottomLeft,
    to: points.bottomCenter,
    y: points.bottomCenter.y + 15 + sa,
  })
  macro('hd', {
    id: 'wBottomRight',
    from: points.bottomCenter,
    to: points.bottomRight,
    y: points.bottomCenter.y + 15 + sa,
  })
  macro('vd', {
    id: 'hTotal',
    from: points.bottomCenter,
    to: points.topHemLeft,
    x: points.topHemLeft.x - 15 - sa,
  })
  macro('vd', {
    id: 'hHem',
    from: points.topLeft,
    to: points.topHemLeft,
    x: points.topHemLeft.x,
  })
  macro('vd', {
    id: 'hSide',
    from: points.bottomLeft,
    to: points.topLeft,
    x: points.topHemLeft.x,
  })
  macro('vd', {
    id: 'hBottom',
    from: points.bottomCenter,
    to: points.bottomLeft,
    x: points.bottomLeft.x,
  })

  store.cutlist.addCut({ identical: true })

  points.titleAnchor = points.bottomLeft
    .shiftFractionTowards(points.topLeft, 0.5)
    .shift(0, halfWidth / 3)
  macro('title', {
    nr: 6,
    title: 'pocket_back',
    at: points.titleAnchor,
  })

  points.grainlineTop = new Point(halfWidth * 0.6, depth * 0.1)
  points.grainlineBottom = new Point(halfWidth * 0.6, depth * 0.9)
  macro('grainline', {
    from: points.grainlineTop,
    to: points.grainlineBottom,
  })

  return part
}

export const pocket_back = {
  name: 'ashley.pocket_back',
  measurements: [],
  options: {
    backPocketWidth: {
      pct: 35,
      min: 15,
      max: 40,
      menu: 'style.backpocket',
      ...pctBasedOn('seatBack'),
    },
    backPocketDepth: {
      pct: 45,
      min: 20,
      max: 60,
      menu: 'style.backpocket',
      ...pctBasedOn('waistToUpperLeg'),
    },
    backPocketTopHemAllowance: {
      pct: 6,
      min: 0,
      max: 15,
      menu: 'style.backpocket',
      ...pctBasedOn('waistToUpperLeg'),
    },
  },
  draft: draftAshleyPocketBack,
}
