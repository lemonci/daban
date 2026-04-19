import { back } from './back.mjs'
import { front } from './front.mjs'

function draftAshleyWaistBack({
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
  //
  const garmentTopCircumference =
    (store.get('back_waist_width') + store.get('front_waist_width')) * 2

  const seatEased = measurements.seat * (1 + options.seatEase)
  const waistEased = measurements.waist * (1 + options.waistEase)

  const waistToSeatSlope = (seatEased - waistEased) / measurements.waistToSeat

  //Total cicumference of top of waistband
  const waistbandTopCircumference =
    waistEased + waistToSeatSlope * measurements.waistToHips * (1 - options.waistHeight)

  //total length of back top of waistband
  const waistbandTopBack = waistbandTopCircumference - store.get('front_waist_width') * 2
  //waistBackEased + waistToSeatSlopeBack * measurements.waistToHips * (1 - options.waistHeight)

  store.set('garmentTopCircumference', garmentTopCircumference)
  store.set('waistbandTopCircumference', waistbandTopCircumference)
  store.set('waistbandTopBack', waistbandTopBack)

  const width = options.waistbandWidth * measurements.waistToFloor
  store.set('waistbandWidth', width)

  const waistbandTopRatioBack = waistbandTopBack / (store.get('back_waist_width') * 2)
  store.set('waistbandTopRatioBack', waistbandTopRatioBack)

  const bottom_length = store.get('back_waist_width') * 2
  log.info('back panel length is ' + bottom_length)

  let circleOuterRadius = 0
  let circleInnerRadius = 0
  let circlePercentage = 0
  let circleAngle = 0

  if (options.waistbandAngleAutomatic) {
    circleOuterRadius = width / (1 - store.get('waistbandTopRatioBack'))
    circleInnerRadius = circleOuterRadius - width

    circlePercentage = bottom_length / (2 * 3.14 * circleOuterRadius)
    circleAngle = circlePercentage * 360
    log.info(
      'Automatic angle: back waistband is ' +
        circlePercentage +
        ' of total circle, or ' +
        circleAngle +
        ' degrees'
    )
  } else {
    circleAngle = options.waistbandCurve
    circlePercentage = circleAngle / 360
    circleOuterRadius = bottom_length / ((circleAngle * 3.14159) / 180)
    circleInnerRadius = circleOuterRadius - width
    log.info(
      'Manual angle: back waistband is ' +
        circlePercentage +
        ' of total circle, or ' +
        circleAngle +
        ' degrees'
    )
  }

  points.circleCenter = new Point(0, -circleInnerRadius)
  points.topCenter = new Point(0, 0)
  points.bottomCenter = new Point(0, circleOuterRadius - circleInnerRadius)
  if (complete) {
    paths.centerLine = new Path()
      .move(points.topCenter)
      .line(points.bottomCenter)
      .setClass('note help')
  }

  paths.seam = new Path()
    .move(points.bottomCenter)
    .circleSegment(circleAngle / 2, points.circleCenter)

  points.bottomRight = paths.seam.end()
  points.topRight = points.bottomRight.shiftTowards(points.circleCenter, width)

  paths.seam = paths.seam.line(points.topRight).circleSegment(-circleAngle, points.circleCenter)

  points.topLeft = paths.seam.end()
  points.bottomLeft = points.topLeft.shiftTowards(points.circleCenter, -width)

  paths.seam = paths.seam
    .line(points.bottomLeft)
    .circleSegment(circleAngle / 2, points.circleCenter)
    .close()
    .setClass('fabric')

  paths.bottomCurve = new Path()
    .move(points.bottomLeft)
    .circleSegment(circleAngle, points.circleCenter)
    .hide()

  paths.topCurve = new Path()
    .move(points.topLeft)
    .circleSegment(circleAngle, points.circleCenter)
    .hide()

  if (sa) {
    paths.saBase = paths.seam
    paths.sa = paths.saBase.offset(sa).setClass('fabric sa')
  }

  store.cutlist.addCut()
  store.cutlist.addCut({ cut: 1, from: 'interfacing' })

  points.titleAnchor = points.topCenter
    .shiftFractionTowards(points.bottomCenter, 0.5)
    .shiftFractionTowards(points.bottomLeft, 0.4)
  macro('title', {
    nr: 9,
    title: 'waist_back',
    at: points.titleAnchor,
  })

  snippets['backNotch'] = new Snippet('bnotch', paths.bottomCurve.shiftFractionAlong(0.5))

  points.grainlineBottom = points.bottomCenter
  points.grainlineTop = points.topCenter
  macro('grainline', {
    from: points.grainlineTop,
    to: points.grainlineBottom,
  })

  macro('hd', {
    id: 'topLength',
    from: points.topLeft,
    to: points.topRight,
    y: points.topRight.y - sa - 15,
  })
  macro('hd', {
    id: 'bottomLength',
    from: points.bottomLeft,
    to: points.bottomRight,
    y: points.grainlineBottom.y + sa + 30,
  })

  macro('vd', {
    id: 'topOffset',
    from: points.topLeft,
    to: points.grainlineTop,
    x: points.grainlineTop.x,
  })
  macro('vd', {
    id: 'bottomOffset',
    from: points.grainlineBottom,
    to: points.bottomLeft.shiftFractionTowards(points.bottomRight, 0.5),
    x: points.bottomLeft.shiftFractionTowards(points.bottomRight, 0.5).x,
  })
  macro('vd', {
    id: 'bottomOffsetLeft',
    from: points.grainlineBottom,
    to: points.bottomLeft,
    x: points.bottomLeft.x,
  })
  macro('vd', {
    id: 'bottomOffsetRight',
    from: points.grainlineBottom,
    to: points.bottomRight,
    x: points.bottomRight.x,
  })

  macro('ld', {
    id: 'diagonalLeft',
    from: points.bottomLeft,
    to: points.topLeft,
    d: -15,
  })
  macro('ld', {
    id: 'diagonalRight',
    to: points.bottomRight,
    from: points.topRight,
    d: -15,
  })

  macro('hd', {
    id: 'hLeft',
    to: points.bottomLeft,
    from: points.topLeft,
    y: points.topLeft.y,
  })
  macro('vd', {
    id: 'vLeft',
    to: points.bottomLeft,
    from: points.topLeft,
    x: points.bottomLeft.x,
  })

  macro('hd', {
    id: 'hRight',
    from: points.bottomRight,
    to: points.topRight,
    y: points.topRight.y,
  })
  macro('vd', {
    id: 'vRight',
    from: points.bottomRight,
    to: points.topRight,
    x: points.bottomRight.x,
  })
  macro('pd', {
    id: 'lengthBottom',
    path: paths.bottomCurve,
    d: 15 + sa,
  })
  macro('pd', {
    id: 'lengthTop',
    path: paths.topCurve,
    d: -sa,
  })

  return part
}

export const waist_back = {
  name: 'ashley.waist_back',
  measurements: [],
  after: [back, front],
  options: {
    waistbandAngleAutomatic: {
      bool: true,
      menu: 'fit',
    },
    waistbandCurve: {
      deg: 60,
      min: 5,
      max: 180,
      menu: (_settings, mergedOptions) => (mergedOptions?.waistbandAngleAutomatic ? false : 'fit'),
    },
  },
  draft: draftAshleyWaistBack,
}
