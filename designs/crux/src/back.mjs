import { backPocketPoints } from './backpocketpoints.mjs'
import { dim, pointOnPath } from './shared.mjs'

function createKneePath(part, waistDown) {
  const { Path, points, paths, measurements } = part.shorthand()
  points.markerKneeSide = paths.sideSeamBack
    .reverse()
    .shiftAlong(measurements.waistToKnee - waistDown)
  points.indicatorKneeInside = points.markerKneeSide.shift(
    points.hemSideBack.angle(points.hemInBack),
    2000
  )
  points.markerKneeInside = paths.insideSeamBack.intersectsBeam(
    points.indicatorKneeInside,
    points.markerKneeSide
  )[0]
  paths.kneeLine = new Path().move(points.markerKneeInside).line(points.markerKneeSide).hide()
}

export const back = {
  name: 'crux.back',
  from: backPocketPoints,
  draft: ({
    options,
    measurements,
    Path,
    points,
    paths,
    Snippet,
    snippets,
    sa,
    store,
    macro,
    complete,
    part,
  }) => {
    points.mWaist = paths.waistSeamBack.shiftFractionAlong(0.5)
    const waistDown = store.get('waistDown')
    const waistbandTargetBack = store.get('waistbandTargetBack')

    if (options.hemType === 'hem' || options.hemType === 'elastic') {
      const hemLength = measurements.waistToFloor * options.hemLength
      const hemAngle = points.hemInBack.angle(points.hemSideBack)
      const hemHelperIn = points.hemInBack
        .shift(hemAngle + 90, hemLength)
        .shift(hemAngle + 180, 400)
      const hemHelperSide = points.hemSideBack.shift(hemAngle + 90, hemLength).shift(hemAngle, 400)
      points.hemInUp = paths.insideSeamBack.intersectsBeam(hemHelperIn, hemHelperSide)[0]
      points.hemSideUp = paths.sideSeamBack.intersectsBeam(hemHelperIn, hemHelperSide)[0]

      paths.hemIn = paths.insideSeamBack.split(points.hemInUp)[1].hide()
      paths.hemSide = paths.sideSeamBack.split(points.hemSideUp)[0].hide()

      macro('mirror', {
        clone: false,
        mirror: [points.hemInBack, points.hemSideBack],
        paths: ['hemIn', 'hemSide'],
        points: ['hemInUp', 'hemSideUp'],
      })

      paths.legSeamBack = paths.hemIn
        .reverse()
        .clone()
        .unhide()
        .line(paths.hemSide.end())
        .join(paths.hemSide.reverse())

      // if (complete) {
      paths.fold = new Path()
        .move(points.hemInBack)
        .line(points.hemSideBack)
        .attr('class', 'fabric dashed')
        .setText('fold', 'text-s center')
      // }
    }

    if (options.backPocketInside && options.backPocketType !== 'square') {
      paths.waistSeamPocketPart.hide()

      paths.seam = paths.waistSeamRight
        .join(paths.opening)
        .join(paths.waistSeamLeft)
        .join(paths.crotchSeamBack)
        .join(paths.gussetBack)
        .join(paths.insideSeamBack)
        .join(paths.legSeamBack)
        .join(paths.sideSeamBack)
        .close()
        .attr('class', 'fabric')
      paths.seamSA = paths.seam.clone()
    } else {
      paths.seam = paths.waistSeamBack
        .join(paths.crotchSeamBack)
        .join(paths.gussetBack)
        .join(paths.insideSeamBack)
        .join(paths.legSeamBack)
        .join(paths.sideSeamBack)
        .close()
        .attr('class', 'fabric')

      paths.seamSA = paths.waistSeamBackSA
        .join(paths.crotchSeamBack)
        .join(paths.gussetBack)
        .join(paths.insideSeamBack)
        .join(paths.legSeamBack)
        .join(paths.sideSeamBack)
        .close()
        .hide()
    }

    if (
      options.articulatedKnee &&
      measurements.waistToKnee / (measurements.waistToFloor * store.get('legLength')) < 0.9
    ) {
      createKneePath(part, waistDown)

      const artKneeOffset = measurements.knee * options.articulatedKneeSize
      const artKneeDart = measurements.knee * options.articulatedKneeDartSize
      const kneeAngle = points.markerKneeSide.angle(points.markerKneeInside)

      points.artKneeInside = points.markerKneeInside
        .shiftTowards(points.markerKneeSide, artKneeOffset * 1.5)
        .shift(kneeAngle + 90, artKneeOffset * 0.25)
      points.artKneeSide = points.markerKneeSide
        .shiftTowards(points.markerKneeInside, artKneeOffset * 1.5)
        .shift(kneeAngle + 90, artKneeOffset * 0.25)
      points.artKneeMiddle = points.artKneeSide.shiftFractionTowards(points.artKneeInside, 0.5)

      points.artKneeMiddleUp = points.artKneeMiddle.shift(kneeAngle - 90, artKneeDart * 0.5)
      points.artKneeMiddleDown = points.artKneeMiddle.shift(kneeAngle + 90, artKneeDart * 0.5)

      points.artKneeMiddleUpCpInside = points.artKneeMiddleUp.shift(kneeAngle, artKneeOffset * 0.5)
      points.artKneeMiddleUpCpSide = points.artKneeMiddleUp.shift(
        kneeAngle + 180,
        artKneeOffset * 0.5
      )
      points.artKneeMiddleDownCpInside = points.artKneeMiddleDown.shift(
        kneeAngle,
        artKneeOffset * 0.5
      )
      points.artKneeMiddleDownCpSide = points.artKneeMiddleDown.shift(
        kneeAngle + 180,
        artKneeOffset * 0.5
      )

      paths.kneeDart = new Path()
        .move(points.artKneeInside)
        .curve(points.artKneeInside, points.artKneeMiddleDownCpInside, points.artKneeMiddleDown)
        .curve(points.artKneeMiddleDownCpSide, points.artKneeSide, points.artKneeSide)
        .curve(points.artKneeSide, points.artKneeMiddleUpCpSide, points.artKneeMiddleUp)
        .curve(points.artKneeMiddleUpCpInside, points.artKneeInside, points.artKneeInside)
        .addClass('dotted')
        .close()
    }

    snippets.gussetBack = new Snippet('notch', points.gussetBack)
    snippets.gussetBackLeg = new Snippet('notch', points.gussetBackLeg)

    snippets.backPocketTopLeft = new Snippet(
      'notch',
      pointOnPath(part, paths.backPocketSeam, points.backPocketTopLeft)
        ? points.backPocketTopLeft
        : points.waistSeamBackStart
    )
    snippets.backPocketTopRight = new Snippet(
      'notch',
      pointOnPath(part, paths.backPocketSeam, points.backPocketTopRight)
        ? points.backPocketTopRight
        : points.backPocketBackOpeningSeam
    )
    snippets.backPocketBottomMiddle = new Snippet('notch', points.backPocketBottomMiddle)

    if (complete) {
      points.indicatorWaistbandSide = paths.waistSeamBackSA.shiftFractionAlong(0.2)
      points.indicatorWaistbandInside = paths.waistSeamBackSA.shiftFractionAlong(0.8)

      if (measurements.waistToHips / waistDown > 1.1) {
        points.indicatorHipsSide = points.indicatorWaistbandSide.shift(
          paths.waistSeamBackSA.angleAt(points.indicatorWaistbandSide) + 90,
          measurements.waistToHips - waistDown
        )
        points.indicatorHipsInside = points.indicatorWaistbandInside.shift(
          paths.waistSeamBackSA.angleAt(points.indicatorWaistbandInside) + 90,
          measurements.waistToHips - waistDown
        )
        points.markerHipsSide = paths.sideSeamBack.intersectsBeam(
          points.indicatorHipsInside,
          points.indicatorHipsSide
        )[0]
        points.markerHipsInside = paths.crotchSeamBack.intersectsBeam(
          points.indicatorHipsInside,
          points.indicatorHipsSide
        )[0]
        paths.hipsLine = new Path()
          .move(points.markerHipsInside)
          .line(points.markerHipsSide)
          .attr('class', 'contrast help')
        macro('banner', {
          id: 'hipsLine',
          classes: 'center contrast help',
          path: paths.hipsLine,
          text: 'hipsLine',
        })
      }

      points.indicatorSeatSide = points.indicatorWaistbandSide.shift(
        paths.waistSeamBackSA.angleAt(points.indicatorWaistbandSide) + 90,
        measurements.waistToSeat - waistDown
      )
      points.indicatorSeatInside = points.indicatorWaistbandInside.shift(
        paths.waistSeamBackSA.angleAt(points.indicatorWaistbandInside) + 90,
        measurements.waistToSeat - waistDown
      )
      points.markerSeatSide = paths.sideSeamBack.intersectsBeam(
        points.indicatorSeatInside,
        points.indicatorSeatSide
      )[0]
      points.markerSeatInside = paths.crotchSeamBack.intersectsBeam(
        points.indicatorSeatInside,
        points.indicatorSeatSide
      )[0]
      paths.seatLine = new Path()
        .move(points.markerSeatInside)
        .line(points.markerSeatSide)
        .attr('class', 'contrast help')
      macro('banner', {
        id: 'seatLine',
        classes: 'center contrast help',
        path: paths.seatLine,
        text: 'seatLine',
      })

      if (measurements.waistToKnee / (measurements.waistToFloor * store.get('legLength')) < 0.97) {
        if (paths.kneeLine === undefined) {
          createKneePath(part, waistDown)
        } else {
          paths.kneeLine = new Path().move(points.markerKneeInside).line(points.markerKneeSide)
        }

        paths.kneeLine.unhide().attr('class', 'contrast help')
        macro('banner', {
          id: 'kneeLine',
          classes: 'center contrast help',
          path: paths.kneeLine,
          text: 'kneeLine',
        })
      }
      if (options.backPocketInside) {
        paths.backPocketSeamMarker.unhide().addClass('lining')
      } else {
        paths.backPocketSeam.unhide().addClass('lining')
      }
    }

    points.gridAnchor = points.pO.clone()

    points.logo = points.pE.shift(180, waistbandTargetBack * 0.25)
    snippets.logo = new Snippet('logo', points.logo)
    points.scaleboxAnchor = points.logo.shift(270, waistbandTargetBack * 0.25)
    macro('scalebox', { at: points.scaleboxAnchor, rotation: 180 - store.get('backAngle') })

    points.title = points.pE
      .shift(270, waistbandTargetBack * 0.7)
      .shift(0, waistbandTargetBack * 0.3)
    macro('title', {
      nr: 2,
      at: points.title,
      title: 'back',
      align: 'center',
      rotation: 180 - store.get('backAngle'),
    })

    const angle = points.p11.angle(points.p4)
    const dist = points.p11.dist(points.p4) * 0.7
    macro('grainline', {
      from: points.p4orig.shift(angle + 180, dist * 0.05),
      to: points.p4orig.shift(angle + 180, dist * 0.6),
    })

    store.cutlist.addCut({ cut: 2, from: 'fabric' })

    if (sa) {
      paths.sa = paths.seamSA.offset(sa).attr('class', 'fabric sa')
    }
    dim(part, [
      ['h', 'p2', 'p4', 'p2', -15],
      ['h', 'gussetBack', 'p2', 'p2', -15],
      ['h', 'p2', 'dartOpeningLeft', 'p2', -5],
      ['h', 'dartOpeningRight', 'p4', 'p2', -5],
      ['v', 'hemIn', 'gussetBackLeg', 'gussetBack', -35],
      ['v', 'gussetBackLeg', 'gussetBack', 'gussetBack', -35],
      ['v', 'gussetBack', 'p2', 'gussetBack', -35],
      ['v', 'p4', 'p2', 'p4', 15],
      ['v', 'hemSideBack', 'p4', 'p4', 15],
    ])
    if (options.hemType === 'hem' || options.hemType === 'elastic') {
      dim(part, [
        ['h', 'hemSideBack', 'p4', 'hemSideUp', 15],
        ['h', 'hemInBack', 'hemSideBack', 'hemSideUp', 15],
        ['h', 'gussetBackLeg', 'hemInBack', 'hemSideUp', 15],
        ['v', 'hemInUp', 'hemIn', 'gussetBack', -35],
        ['v', 'hemSideUp', 'hemSide', 'p4', 15],
      ])
    } else {
      dim(part, [
        ['h', 'hemSideBack', 'p4', 'hemSideBack', 15],
        ['h', 'hemInBack', 'hemSideBack', 'hemSideBack', 15],
        ['h', 'gussetBackLeg', 'hemInBack', 'hemSideBack', 15],
      ])
    }

    return part
  },
}
