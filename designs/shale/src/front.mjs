import { pctBasedOn, snappedPctOption, Snippet } from '@freesewing/core'
import { elastics } from '@freesewing/snapseries'
import { pathUtilsPlugin } from '@freesewing/plugin-path-utils'

export function drawShortsPart(
  id,
  seat,
  leg,
  crossSeam,
  rotOffset,
  { Point, points, Path, paths, measurements, options, utils, store }
) {
  let waist = seat * (1 + options.ease * (1 - options.waistReduction))
  seat = seat * (1 + options.ease)

  if (Math.abs(leg) - Math.abs(seat) < Math.abs(measurements.seat * 0.025)) {
    leg = seat + measurements.seat * 0.025 * Math.sign(leg)
  }
  points.waistOut = new Point(0, 0)
  points['waist' + id] = new Point(waist, 0)
  points.hipsOut = new Point(0, measurements.waistToHips)
  points.seatOut = new Point(0, measurements.waistToSeat)
  points['seat' + id] = new Point(seat, measurements.waistToSeat)
  points.crotchOut = new Point(0, store.get('crotchDepth') * (1 + options.crotchLower))
  points['crotchCp2' + id] = utils.beamIntersectsY(
    points['waist' + id],
    points['seat' + id],
    points.crotchOut.y
  )
  // points.crotchCp = points['seat' + id].shiftFractionTowards(points['crotch' + id], 0.5)
  points.legOut = new Point(0, points.crotchOut.y + measurements.waistToUpperLeg * options.inseam)
  points['leg' + id] = new Point(leg, points.legOut.y)
  points['legCenter' + id] = new Point(seat, points.legOut.y)
  points['legInner' + id] = new Point(seat * 0.2, points.legOut.y)
  points['legInner' + id + 'Cp1'] = new Point(seat * 0.7, points.legOut.y)
  points['fork' + id] = new Point(points['leg' + id].x, points.crotchOut.y)
  points['crotchCp1' + id] = points['seat' + id].shiftFractionTowards(points['crotchCp2' + id], 0.5)
  points['crotchCp2' + id] = points['fork' + id].shiftFractionTowards(points['crotchCp2' + id], 1)

  points['splitOut'] = points.seatOut.shiftFractionTowards(
    points.crotchOut,
    options.sideSplitOffset
  )
  points['splitLeg' + id] = new Point(measurements.seat * 0.01 * Math.sign(seat), points.legOut.y)

  paths.crossSeam = new Path()
    .move(points['waist' + id])
    .line(points['seat' + id])
    .curve(points['crotchCp1' + id], points['crotchCp2' + id], points['fork' + id])
    .hide()

  paths.leg = new Path()
    .move(points['leg' + id])
    .curve(points['legCenter' + id], points['legInner' + id + 'Cp1'], points['legInner' + id])
    .line(points.legOut)
    .hide()

  let crossSeamTarget = crossSeam * (1 + options.crossSeamEase)

  for (let i = 0; i < 10; i++) {
    let delta = paths.crossSeam.length() - crossSeamTarget
    let legDelta = paths.leg.length() - Math.abs(leg)

    if (delta > -0.1 && legDelta > -0.1) {
      break
    }

    let deltaShift = (1 - options.fitLegs) * delta
    let deltaRot = options.fitLegs * delta

    if (legDelta < 0) {
      deltaShift += legDelta
      deltaRot -= legDelta
    }

    points['fork' + id] = points['fork' + id].translate(deltaShift * -Math.sign(leg), 0)
    points['leg' + id] = points['leg' + id].translate(deltaShift * -Math.sign(leg), 0)
    // points['crotchCp2' + id] = points['crotchCp2' + id].translate(deltaShift * -Math.sign(leg), 0)

    points['crotchCenter' + id] = new Point(0, points.crotchOut.y + Math.abs(seat) * rotOffset)
    let rot = (deltaRot / leg) * 20
    points['fork' + id] = points['fork' + id].rotate(rot, points['crotchCenter' + id])
    points['leg' + id] = points['leg' + id].rotate(rot, points['crotchCenter' + id])
    points['crotchCp2' + id] = points['crotchCp2' + id].rotate(rot, points['crotchCenter' + id])
    points['legCenter' + id] = points['legCenter' + id].rotate(rot, points['crotchCenter' + id])

    paths.crossSeam = new Path()
      .move(points['waist' + id])
      .line(points['seat' + id])
      .curve(points['crotchCp1' + id], points['crotchCp2' + id], points['fork' + id])
      .hide()

    paths.leg = new Path()
      .move(points['leg' + id])
      .curve(points['legCenter' + id], points['legInner' + id + 'Cp1'], points['legInner' + id])
      .line(points.legOut)
      .hide()
  }
}

function getMedian(numbers) {
  const sorted = numbers.slice().sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

function paperlessFront(macro, points, paths) {
  macro('hd', {
    id: 'width_leg_front',
    from: points.legFront,
    to: points.legOut,
    y: points.legFront.y + 25,
  })
  macro('pd', {
    id: 'width_leg_front',
    path: paths.legFront,
  })
  macro('hd', {
    id: 'width_fork_front',
    from: points.forkFront,
    to: points.crotchOut,
    y: points.forkFront.y + 15,
  })
  macro('hd', {
    id: 'width_seat_front',
    from: points.seatFront,
    to: points.seatOut,
    y: points.seatOut.y,
  })
  macro('hd', {
    id: 'width_styleWaist_front',
    from: points.styleWaistFront,
    to: points.styleWaistOut,
    y: points.styleWaistOut.y + 15,
  })
  macro('vd', {
    id: 'height_out',
    from: points.styleWaistOut,
    to: points.legOut,
    x: points.styleWaistOut.x + 25,
  })
  macro('vd', {
    id: 'height_seat_out',
    from: points.styleWaistOut,
    to: points.seatOut,
    x: points.styleWaistOut.x + 15,
  })
  macro('vd', {
    id: 'height_fork_out',
    from: points.seatOut,
    to: points.forkFront,
    x: points.styleWaistOut.x + 15,
  })
  macro('vd', {
    id: 'height_leg_out',
    from: points.forkFront,
    to: points.legOut,
    x: points.styleWaistOut.x + 15,
  })
  macro('ld', {
    id: 'height_leg_in',
    from: points.legFront,
    to: points.forkFront,
    d: 15,
  })
}

export function paperlessBack(macro, points, paths) {
  macro('hd', {
    id: 'width_leg_back',
    from: points.legOut,
    to: points.legBack,
    y: points.legBack.y + 25,
  })
  macro('pd', {
    id: 'width_leg_back',
    path: paths.legBack,
  })
  macro('hd', {
    id: 'width_fork_back',
    from: points.crotchOut,
    to: points.forkBack,
    y: points.forkFront.y + 15,
  })
  macro('hd', {
    id: 'width_seat_back',
    from: points.seatOut,
    to: points.seatBack,
    y: points.seatBack.y,
  })
  macro('hd', {
    id: 'width_styleWaist_back',
    from: points.styleWaistOut,
    to: points.styleWaistBack,
    y: points.styleWaistOut.y + 15,
  })
  macro('vd', {
    id: 'height_out',
    to: points.styleWaistOut,
    from: points.legOut,
    x: points.styleWaistOut.x - 25,
  })
  macro('vd', {
    id: 'height_seat_out',
    to: points.styleWaistOut,
    from: points.seatOut,
    x: points.styleWaistOut.x - 15,
  })
  macro('vd', {
    id: 'height_fork_out',
    to: points.seatOut,
    from: points.forkBack,
    x: points.styleWaistOut.x - 15,
  })
  macro('vd', {
    id: 'height_leg_out',
    to: points.forkBack,
    from: points.legOut,
    x: points.styleWaistOut.x - 15,
  })
  macro('ld', {
    id: 'height_leg_in',
    to: points.legBack,
    from: points.forkBack,
    d: 15,
  })
}

export const front = {
  name: 'shale.front',
  measurements: [
    'seat',
    'waistToSeat',
    'waistToHips',
    'crotchDepth',
    'waistToUpperLeg',
    'upperLeg',
    'crossSeam',
    'crossSeamFront',
  ],
  optionalMeasurements: ['waistToFloor', 'inseam'],
  options: {
    elasticHeight: snappedPctOption('seat', {
      pct: 4,
      min: 2,
      max: 10,
      menu: 'style',
      snap: elastics,
    }),
    legBalance: {
      pct: 40,
      min: 25,
      max: 50,
      menu: 'style',
    },
    inseam: {
      pct: 33,
      min: 10,
      max: 75,
      menu: 'style',
      ...pctBasedOn('waistToUpperLeg'),
    },
    crotchLower: {
      pct: 2.5,
      min: 0,
      max: 10,
      menu: 'fit',
    },
    ease: {
      pct: 5,
      min: 0,
      max: 20,
      ...pctBasedOn('seat'),
      menu: 'fit',
    },
    waistReduction: {
      pct: 80,
      min: 0,
      max: 100,
      menu: 'fit',
    },
    crossSeamEase: {
      pct: 2.5,
      min: 0,
      max: 10,
      menu: 'fit',
    },
    waistHeight: {
      pct: 15,
      min: 0,
      max: 100,
      menu: 'style',
    },
    fitLegs: {
      pct: 50,
      min: 0,
      max: 100,
      menu: 'fit',
    },
    splitParts: {
      bool: true,
      menu: 'construction',
    },
    sideSplitOffset: {
      pct: 50,
      min: 0,
      max: 75,
      menu: (settings, mergedOptions) =>
        mergedOptions.splitParts && mergedOptions.sideSplit ? 'style' : false,
    },
    sideSplit: false /*{
      bool: false,
      menu: (settings, mergedOptions) => (mergedOptions.splitParts ? 'construction' : false),
    } */,
    waistbandExtraWidth: {
      pct: 20,
      min: 0,
      max: 100,
      menu: 'advanced',
    },
  },
  plugins: [pathUtilsPlugin],
  draft: ({
    Point,
    points,
    Path,
    paths,
    macro,
    measurements,
    options,
    absoluteOptions,
    log,
    part,
    store,
    snippets,
    utils,
    units,
    sa,
    complete,
  }) => {
    let frontSeat = (measurements.seat / 2) * options.legBalance
    let frontLeg = measurements.upperLeg * options.legBalance
    let waistToCrotchEstimates = [measurements.crotchDepth, measurements.waistToUpperLeg]
    if (measurements.inseam && measurements.waistToFloor) {
      waistToCrotchEstimates.push(measurements.waistToFloor - measurements.inseam)
    }
    let crotchDepth = getMedian(waistToCrotchEstimates)
    const estimateMin = Math.min(...waistToCrotchEstimates)
    const estimateMax = Math.max(...waistToCrotchEstimates)
    let crotchDepthUncertainty = estimateMax - estimateMin

    log.info('Estimates for crotch depth: ' + waistToCrotchEstimates.map(units).join(', '))
    log.info('Chosen crotch depth: ' + units(crotchDepth))
    log.info('Waist-to-seat: ' + units(measurements.waistToSeat))

    log.info('Uncertainty: ' + crotchDepthUncertainty / crotchDepth)
    if (crotchDepthUncertainty / crotchDepth > 0.3) {
      store.flag.warn({
        msg: `shale:badCrotchDepth`,
        replace: {
          min: units(estimateMin),
          max: units(estimateMax),
          cur: units(crotchDepth),
        },
      })
    }
    if (crotchDepth < measurements.waistToSeat) {
      store.flag.warn({
        msg: `shale:badCrotchDepth2`,
        replace: {
          crotch: units(crotchDepth),
          seat: units(measurements.waistToSeat),
        },
      })
      crotchDepth = measurements.waistToSeat
    }
    store.set('crotchDepth', crotchDepth)
    store.set('frontLeg', frontLeg)
    store.set('frontSeat', frontSeat)
    store.set('waistband_width', absoluteOptions.elasticHeight * (1 + options.waistbandExtraWidth))

    drawShortsPart('Front', -frontSeat, -frontLeg, measurements.crossSeamFront, 0, part.shorthand())

    points.waistCurveZero = points.hipsOut
    points.waistCurveMax = points.waistOut.translate(100, 0)
    paths.waistCurveFront = new Path().move(points.waistCurveZero).line(points.waistCurveMax)
    paths.waistCurveBack = new Path()
      .move(points.waistCurveZero)
      ._curve(
        points.waistOut.shiftFractionTowards(points.waistCurveZero, 0.5),
        points.waistCurveMax
      )

    let frontY = paths.waistCurveFront.intersectsX(options.waistHeight * 100)[0]?.y ?? 0
    let backY = paths.waistCurveBack.intersectsX(options.waistHeight * 100)[0]?.y ?? 0

    frontY += store.get('waistband_width')
    backY += store.get('waistband_width')

    delete points.waistCurveZero
    delete points.waistCurveMax

    let badWaistbandHeight = false
    if (frontY > points.seatOut.y) {
      frontY = points.seatOut.y
      badWaistbandHeight = true
    }
    if (backY > points.seatOut.y) {
      backY = points.seatOut.y
      badWaistbandHeight = true
    }

    if (badWaistbandHeight) {
      store.flag.warn({
        msg: `shale:badWaistbandHeight`,
      })
    }

    drawShortsPart(
      'Back',
      measurements.seat / 2 - store.get('frontSeat'),
      measurements.upperLeg - store.get('frontLeg'),
      // we've effectively increased the cross-seam already by raising the waist on the back,
      // so reduce the cross-seam-back measurement accordingly to compensate for that
      measurements.crossSeamBack + (backY - frontY),
      0.5,
      part.shorthand()
    )

    points.styleWaistFront = utils.beamIntersectsY(points.waistFront, points.seatFront, frontY)
    points.styleWaistOut = new Point(0, points.styleWaistFront.y)
    points.styleWaistBack = utils.beamIntersectsY(points.waistBack, points.seatBack, backY)
    points.__tmp1 = new Point(points.styleWaistBack.x * (1 - 0.3), points.styleWaistBack.y)
    points.__tmp2 = points.__tmp1.shift(points.seatBack.angle(points.waistBack) + 90, 10)
    points.styleWaistBack = utils.beamsIntersect(
      points.__tmp1,
      points.__tmp2,
      points.seatBack,
      points.waistBack
    )
    points.styleWaistCp1 = points.__tmp1
    points.styleWaistCp2 = new Point(points.styleWaistBack.x * 0.3, points.styleWaistOut.y)
    paths.waistBand = new Path()
      .move(points.styleWaistBack)
      .curve(points.styleWaistCp1, points.styleWaistCp2, points.styleWaistOut)
      .line(points.styleWaistFront)

    let delta = points.styleWaistFront.dy(points.seatFront) * 0.3
    points.styleWaistFrontCp1 = points.styleWaistFront.translate(0, delta)
    points.styleWaistFrontCp2 = points.seatFront.shiftTowards(points.crotchCp1Front, -delta)

    for (const key of Object.keys(paths)) {
      paths[key].hide()
    }
    let sideSplit = options.sideSplit && options.splitParts

    paths.legFront = new Path()
      .move(points.legFront)
      .curve(points.legCenterFront, points.legInnerFrontCp1, points.legInnerFront)
      .line(sideSplit ? points.splitLegFront : points.legOut)
      .hide()
    paths.legBack = new Path()
      .move(sideSplit ? points.splitLegBack : points.legOut)
      .line(points.legInnerBack)
      .curve(points.legInnerBackCp1, points.legCenterBack, points.legBack)
      .hide()

    log.info(
      'Leg circumference: ' +
        units(paths.legFront.length() + paths.legBack.length()) +
        ' (desired: ' +
        units(measurements.upperLeg * (1 + options.ease)) +
        ')'
    )

    store.flag.info({
      msg: 'shale:legCircumference',
      replace: {
        circ: units(paths.legFront.length() + paths.legBack.length()),
        measurement: units(measurements.upperLeg),
        pct:
          Math.round(
            (100 * (paths.legFront.length() + paths.legBack.length())) / measurements.upperLeg - 100
          ) + '%',
      },
    })

    if (!options.splitParts) {
      paths.frontSplit = new Path().move(points.legOut).hide()

      paths.backSplit = new Path().move(points.legOut).hide()
    } else if (sideSplit) {
      paths.frontSplit = new Path()
        .move(points.splitLegFront)
        ._curve(points.crotchOut, points.splitOut)
        .line(points.styleWaistOut)
        .hide()

      paths.backSplit = new Path()
        .move(points.styleWaistOut)
        .line(points.splitOut)
        .curve_(points.crotchOut, points.splitLegBack)
        .hide()
    } else {
      paths.frontSplit = new Path().move(points.legOut).line(points.styleWaistOut).hide()

      paths.backSplit = new Path().move(points.styleWaistOut).line(points.legOut).hide()
    }

    if (options.pocket && options.splitParts) {
      // draft pocket
      const pocketBottom = Math.min(points.legOut.y * 0.95, points.crotchOut.y * 1.25)

      points.pocketTopLeft = points.styleWaistOut.shiftFractionTowards(points.styleWaistFront, 0.8)
      points.grainlineTop = points.styleWaistOut.shiftFractionTowards(points.styleWaistFront, 0.75)
      points.pocketTopRight = points.styleWaistOut.shiftFractionTowards(
        points.styleWaistFront,
        0.25
      )
      points.pocketBottomLeft = new Point(points.pocketTopLeft.x, pocketBottom)
      points.grainlineBottom = new Point(points.grainlineTop.x, points.pocketBottomLeft.y)
      points.pocketBottomSplit = paths.frontSplit.intersectsY(
        points.crotchOut.shiftFractionTowards(points.seatOut, 0.8).y
      )[0]
      points.pocketCpTarget = new Point(points.pocketTopRight.x, points.pocketBottomSplit.y)
      points.pocketTopRightCp1 = points.pocketBottomSplit.shiftFractionTowards(
        points.pocketCpTarget,
        0.8
      )
      points.pocketTopRightCp2 = points.pocketTopRight.shiftFractionTowards(
        points.pocketCpTarget,
        0.8
      )

      points.pocketBottomRight = paths.frontSplit.intersectsY(points.pocketBottomLeft.y)[0]
      paths.reducedSide = paths.frontSplit
        .split(points.pocketBottomRight)[1]
        .split(points.pocketBottomSplit)[0]
        .hide()

      paths.pocketSeamBase = new Path()
        .move(points.pocketBottomSplit)
        .curve(points.pocketTopRightCp1, points.pocketTopRightCp2, points.pocketTopRight)
        .line(points.pocketTopLeft)
        .line(points.pocketBottomLeft)
        .line(points.pocketBottomRight)
        .hide()
      paths.pocketSeam = paths.pocketSeamBase
        .clone()
        .join(paths.reducedSide)
        .addClass('mark dotted')

      if (sa) {
        paths.pocketSa = macro('sa', {
          paths: [paths.pocketSeamBase, { p: paths.reducedSide, offset: sa }],
        }).setClass('mark sa')
        if (!complete) {
          paths.pocketSa.hide()
        }
      }
      if (!complete) {
        paths.pocketSeam.hide()
      }
    }

    if (options.pocket !== 'inset' || !options.splitParts) {
      paths.seamFront = new Path()
        .move(points.styleWaistOut)
        .line(points.styleWaistFront)
        .curve(points.styleWaistFrontCp1, points.styleWaistFrontCp2, points.seatFront)
        .curve(points.crotchCp1Front, points.crotchCp2Front, points.forkFront)
        .join(paths.legFront)
        .join(paths.frontSplit)
        .addClass('fabric')
        .hide()
    } else {
      paths.frontSplit2 = paths.frontSplit.split(points.pocketBottomSplit)[0].hide()
      paths.seamFront = new Path()
        .move(points.pocketTopLeft)
        .line(points.styleWaistFront)
        .curve(points.styleWaistFrontCp1, points.styleWaistFrontCp2, points.seatFront)
        .curve(points.crotchCp1Front, points.crotchCp2Front, points.forkFront)
        .join(paths.legFront)
        .join(paths.frontSplit2)
        .curve(points.pocketTopRightCp1, points.pocketTopRightCp2, points.pocketTopRight)
        .close()
        .addClass('fabric')
        .hide()
    }

    paths.seamBack = paths.backSplit
      .clone()
      .join(paths.legBack)
      .line(points.forkBack)
      .curve(points.crotchCp2Back, points.crotchCp1Back, points.seatBack)
      .line(points.styleWaistBack)
      .curve(points.styleWaistCp1, points.styleWaistCp2, points.styleWaistOut)
      .addClass('fabric')
      .hide()

    if (options.splitParts) {
      paths.seamFront.close().unhide()
    } else {
      paths.seam = paths.seamFront.join(paths.seamBack).close().unhide().addClass('fabric')
      if (complete) {
        paths.side = new Path().move(points.legOut).line(points.styleWaistOut).setClass('mark')
      }
    }

    if (sa) {
      let hemWidth = sa

      if (options.splitParts) {
        if (options.pocket !== 'inset' || !options.splitParts) {
          paths.saBase = new Path()
            .move(points.styleWaistOut)
            .line(points.styleWaistFront)
            .curve(points.styleWaistFrontCp1, points.styleWaistFrontCp2, points.seatFront)
            .curve(points.crotchCp1Front, points.crotchCp2Front, points.forkFront)
            .line(points.legFront)
            .hide()
        } else {
          paths.saBase = new Path()
            .move(points.pocketBottomSplit)
            .curve(points.pocketTopRightCp1, points.pocketTopRightCp2, points.pocketTopRight)
            .line(points.pocketTopLeft)
            .line(points.styleWaistFront)
            .curve(points.styleWaistFrontCp1, points.styleWaistFrontCp2, points.seatFront)
            .curve(points.crotchCp1Front, points.crotchCp2Front, points.forkFront)
            .line(points.legFront)
            .hide()
        }

        if (complete) {
          paths.legFold = paths.legFront.offset(sa).setClass('various help')
        }
        // paths.sideFold = paths.frontSplit.offset(sa).setClass('various help')
        // paths.bridge = new Path()
        //   .move(paths.legFold.end())
        //   .line(paths.sideFold.start())
        //   .setClass('various help')
        //   .hide()

        paths.sa = macro('sa', {
          paths: [
            paths.saBase,
            { p: paths.legFront, offset: sa + hemWidth },
            // paths.bridge,
            { p: paths.frontSplit2 ?? paths.frontSplit, offset: sa },
          ],
        })
      } else {
        paths.saBase = new Path()
          .move(points.legBack)
          .line(points.forkBack)
          .curve(points.crotchCp2Back, points.crotchCp1Back, points.seatBack)
          .line(points.styleWaistBack)
          .curve(points.styleWaistCp1, points.styleWaistCp2, points.styleWaistOut)
          .line(points.styleWaistFront)
          .curve(points.styleWaistFrontCp1, points.styleWaistFrontCp2, points.seatFront)
          .curve(points.crotchCp1Front, points.crotchCp2Front, points.forkFront)
          .line(points.legFront)
          .hide()

        paths.sa = macro('sa', {
          paths: [
            paths.saBase,
            { p: paths.legFront, offset: sa + hemWidth },
            { p: paths.legBack, offset: sa + hemWidth },
          ],
        })
        if (complete) {
          paths.foldBack = paths.legFront.join(paths.legBack).offset(sa).setClass('various help')
        }
      }
    }

    store.set(
      'waistband_back',
      new Path()
        .move(points.styleWaistBack)
        .curve(points.styleWaistCp1, points.styleWaistCp2, points.styleWaistOut)
        .length()
    )
    store.set('waistband_front', points.styleWaistOut.dist(points.styleWaistFront))

    store.cutlist.setCut({ cut: 2, from: 'fabric' })
    points.title = points.crotchCp1Front.shiftFractionTowards(points.seatOut, 0.1)
    macro('title', { at: points.title, nr: 1, title: options.splitParts ? 'front' : 'leg' })
    if (options.pocket !== 'inset' || !options.splitParts) {
      macro('grainline', {
        from: points.styleWaistOut.translate(-15, 0),
        to: points.legOut.translate(-15, 0),
      })
    } else {
      macro('grainline', {
        from: points.styleWaistOut.translate(
          -15 - points.pocketTopRight.dx(points.styleWaistOut),
          0
        ),
        to: points.legOut.translate(-15 - points.pocketTopRight.dx(points.styleWaistOut), 0),
      })
    }

    paperlessFront(macro, points, paths)
    if (!options.splitParts) {
      paperlessBack(macro, points, paths)
    }
    if (sideSplit) snippets.sideSplitOffset = new Snippet('notch', points.splitOut)
    return part
  },
}
