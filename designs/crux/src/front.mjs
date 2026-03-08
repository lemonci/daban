import { frontPocketPoints } from './frontpocketpoints.mjs'
import { J, dim } from './shared.mjs'

export const front = {
  name: 'crux.front',
  from: frontPocketPoints,
  draft: ({
    options,
    Path,
    points,
    paths,
    Snippet,
    snippets,
    sa,
    store,
    measurements,
    complete,
    macro,
    part,
  }) => {
    paths.flyFold.unhide().attr('class', 'fabric dashed').setText('basteHere', 'text-xs center')

    const waistDown = store.get('waistDown')
    const waistToKnee = measurements.waistToKnee - waistDown
    const hemToKneeInside = paths.sideSeamFront.length() - waistToKnee //- waistDown

    if (
      options.articulatedKnee &&
      measurements.waistToKnee / (measurements.waistToFloor * store.get('legLength')) < 0.8
    ) {
      const sideSeamInverse = paths.sideSeamFront.reverse()
      const artKneeOffset = measurements.knee * options.articulatedKneeSize
      const artKneeDart = measurements.knee * options.articulatedKneeDartSize

      points.artKneeSideUp = sideSeamInverse.shiftAlong(measurements.waistToKnee - waistDown)
      points.artKneeSideUpDart = sideSeamInverse.shiftAlong(
        measurements.waistToKnee - waistDown + artKneeDart
      )
      points.artKneeSideDown = sideSeamInverse.shiftAlong(
        measurements.waistToKnee - waistDown + artKneeOffset * 2
      )
      points.artKneeSideDownDart = sideSeamInverse.shiftAlong(
        measurements.waistToKnee - waistDown - artKneeDart + artKneeOffset * 2
      )
      points.artKneeSideInUp = points.artKneeSideUp.shift(
        sideSeamInverse.angleAt(points.artKneeSideUp) - options.articulatedKneeAngle,
        artKneeOffset
      )
      points.artKneeSideUpDart = points.artKneeSideInUp.shiftTowards(
        points.artKneeSideUpDart,
        artKneeOffset
      )
      points.artKneeSideInDown = points.artKneeSideDown.shift(
        sideSeamInverse.angleAt(points.artKneeSideDown) - (180 - options.articulatedKneeAngle),
        artKneeOffset
      )
      points.artKneeSideDownDart = points.artKneeSideInDown.shiftTowards(
        points.artKneeSideDownDart,
        artKneeOffset
      )

      const insideSeamInverse = paths.insideSeamFront.reverse()

      points.artKneeInsideUp = insideSeamInverse.shiftAlong(hemToKneeInside)
      points.artKneeInsideUpDart = insideSeamInverse.shiftAlong(hemToKneeInside - artKneeDart)
      points.artKneeInsideDown = insideSeamInverse.shiftAlong(hemToKneeInside - artKneeOffset * 2)
      points.artKneeInsideDownDart = insideSeamInverse.shiftAlong(
        hemToKneeInside + artKneeDart - artKneeOffset * 2
      )

      points.artKneeInsideInUp = points.artKneeInsideUp.shift(
        insideSeamInverse.angleAt(points.artKneeInsideUp) + options.articulatedKneeAngle + 180,
        artKneeOffset
      )
      points.artKneeInsideUpDart = points.artKneeInsideInUp.shiftTowards(
        points.artKneeInsideUpDart,
        artKneeOffset
      )
      points.artKneeInsideInDown = points.artKneeInsideDown.shift(
        insideSeamInverse.angleAt(points.artKneeInsideDown) +
          (180 - options.articulatedKneeAngle) +
          180,
        artKneeOffset
      )
      points.artKneeInsideDownDart = points.artKneeInsideInDown.shiftTowards(
        points.artKneeInsideDownDart,
        artKneeOffset
      )

      paths.artSideSeamUp = paths.sideSeamFront.split(points.artKneeSideUp)[1].hide()
      if (
        options.frontPocketInside &&
        (options.frontPocketType === 'standard' || options.frontPocketType === 'square')
      ) {
        paths.artSideSeamUp = paths.artSideSeamUp.split(points.frontPocketOpeningSideSeam)[0].hide()
      }
      paths.artSideSeamDown = paths.sideSeamFront.split(points.artKneeSideDown)[0].hide()
      paths.artInsideSeamUp = paths.insideSeamFront.split(points.artKneeInsideUp)[0].hide()
      paths.artInsideSeamDown = paths.insideSeamFront.split(points.artKneeInsideDown)[1].hide()

      macro('transform', {
        transform: 'translate',
        clone: false,
        x: 0,
        y: artKneeDart * 0.96 * 2,
        paths: ['artInsideSeamDown', 'artSideSeamDown', 'legSeamFront'],
        points: [
          'artKneeSideDown',
          'artKneeSideInDown',
          'artKneeSideDownDart',
          'artKneeInsideDown',
          'artKneeInsideInDown',
          'artKneeInsideDownDart',
          'hemIn',
          'hemSide',
        ],
      })

      paths.sideSeamFront = new Path()
        .move(points.hemSide)
        .join(paths.artSideSeamDown)
        .line(points.artKneeSideDownDart)
        .line(points.artKneeSideUpDart)
        .line(points.artKneeSideUp)
        .join(paths.artSideSeamUp)

      paths.insideSeamFront = new Path()
        .move(points.gussetFrontLeg)
        .join(paths.artInsideSeamUp)
        .line(points.artKneeInsideUpDart)
        .line(points.artKneeInsideDownDart)
        .line(points.artKneeInsideDown)
        .join(paths.artInsideSeamDown)

      paths.darts1 = new Path()
        .move(points.artKneeSideUp)
        .line(points.artKneeSideInUp)
        .line(points.artKneeSideUpDart)
        .addClass('dotted')
      paths.darts2 = new Path()
        .move(points.artKneeSideDown)
        .line(points.artKneeSideInDown)
        .line(points.artKneeSideDownDart)
        .addClass('dotted')
      paths.darts3 = new Path()
        .move(points.artKneeInsideUp)
        .line(points.artKneeInsideInUp)
        .line(points.artKneeInsideUpDart)
        .addClass('dotted')
      paths.darts4 = new Path()
        .move(points.artKneeInsideDown)
        .line(points.artKneeInsideInDown)
        .line(points.artKneeInsideDownDart)
        .addClass('dotted')
    }

    paths.sideSeamFrontFull = paths.sideSeamFront.clone().hide()

    if (options.hemType === 'hem' || options.hemType === 'elastic') {
      const hemLength = measurements.waistToFloor * options.hemLength
      const hemAngle = points.hemIn.angle(points.hemSide)
      const hemHelperIn = points.hemIn.shift(hemAngle + 90, hemLength).shift(hemAngle + 180, 400)
      const hemHelperSide = points.hemSide.shift(hemAngle + 90, hemLength).shift(hemAngle, 400)
      points.hemInUp = paths.insideSeamFront.intersectsBeam(hemHelperIn, hemHelperSide)[0]
      points.hemSideUp = paths.sideSeamFront.intersectsBeam(hemHelperIn, hemHelperSide)[0]

      paths.hemIn = paths.insideSeamFront.split(points.hemInUp)[1].hide()
      paths.hemSide = paths.sideSeamFront.split(points.hemSideUp)[0].hide()

      macro('mirror', {
        clone: false,
        mirror: [points.hemIn, points.hemSide],
        paths: ['hemIn', 'hemSide'],
        points: ['hemInUp', 'hemSideUp'],
      })

      paths.legSeamFront = paths.hemIn
        .reverse()
        .clone()
        .unhide()
        .line(paths.hemSide.end())
        .join(paths.hemSide.reverse())

      // if (complete) {
      paths.fold = new Path()
        .move(points.hemIn)
        .line(points.hemSide)
        .attr('class', 'fabric dashed')
        .setText('fold', 'text-s center')
      // }
    } else if (options.hemType === 'ribknit') {
    }

    if (options.frontPocketInside) {
      if (options.frontPocketType === 'standard' || options.frontPocketType === 'square') {
        paths.sideSeamFront = paths.sideSeamFront.split(points.frontPocketOpeningSideSeam)[0]
        paths.seam = new Path()
          .move(points.frontPocketTopMiddle)
          .join(paths.waistSeamFrontMiddle)
          .join(paths.waistSeamFrontInside)
          .join(paths.fly)
          .join(paths.crotchSeamFront)
          .join(paths.gussetFront)
          .join(paths.insideSeamFront)
          .join(paths.legSeamFront)
          .join(paths.sideSeamFront)
          .join(paths.frontPocketOpening.reverse())
          .close()
          .attr('class', 'fabric')
      } else {
        paths.seam = new Path()
          .move(points.waistSeamFrontStart)
          .join(paths.waistSeamFront)
          .join(paths.fly)
          .join(paths.crotchSeamFront)
          .join(paths.gussetFront)
          .join(paths.insideSeamFront)
          .join(paths.legSeamFront)
          .join(paths.sideSeamFront)
          .close()
          .attr('class', 'fabric')

        paths.frontPocketOpening.unhide().attr('class', 'fabric')
      }
    } else {
      paths.seam = paths.waistSeamFront
        .join(paths.fly)
        .join(paths.crotchSeamFront)
        .join(paths.gussetFront)
        .join(paths.insideSeamFront)
        .join(paths.legSeamFront)
        .join(paths.sideSeamFront)
        .close()
        .attr('class', 'fabric')
    }
    snippets.n5 = new Snippet('notch', points.pZ)

    snippets.gussetFront = new Snippet('notch', points.gussetFront)
    snippets.gussetFrontLeg = new Snippet('notch', points.gussetFrontLeg)

    if (complete) {
      const frontPath = paths.flyFold.join(paths.crotchSeamFront).join(paths.gussetFront)

      points.indicatorWaistbandSide = paths.waistSeamFront.shiftFractionAlong(0.2)
      points.indicatorWaistbandInside = paths.waistSeamFront.shiftFractionAlong(0.8)

      if (measurements.waistToHips / waistDown > 1.1) {
        points.indicatorHipsSide = points.indicatorWaistbandSide.shift(
          paths.waistSeamFront.angleAt(points.indicatorWaistbandSide) + 90,
          measurements.waistToHips - waistDown
        )
        points.indicatorHipsInside = points.indicatorWaistbandInside.shift(
          paths.waistSeamFront.angleAt(points.indicatorWaistbandInside) + 90,
          measurements.waistToHips - waistDown
        )
        if (
          options.frontPocketInside &&
          (options.frontPocketType === 'standard' || options.frontPocketType === 'square')
        ) {
          points.markerHipsSide = paths.frontPocketOpening.intersectsBeam(
            points.indicatorHipsInside,
            points.indicatorHipsSide
          )[0]
        } else {
          points.markerHipsSide = paths.sideSeamFrontFull.intersectsBeam(
            points.indicatorHipsInside,
            points.indicatorHipsSide
          )[0]
        }
        points.markerHipsInside = frontPath.intersectsBeam(
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
        paths.waistSeamFront.angleAt(points.indicatorWaistbandSide) + 90,
        measurements.waistToSeat - waistDown
      )
      points.indicatorSeatInside = points.indicatorWaistbandInside.shift(
        paths.waistSeamFront.angleAt(points.indicatorWaistbandInside) + 90,
        measurements.waistToSeat - waistDown
      )
      points.markerSeatSide = paths.sideSeamFront.intersectsBeam(
        points.indicatorSeatInside,
        points.indicatorSeatSide
      )[0]
      points.markerSeatInside = frontPath.intersectsBeam(
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
        points.markerKneeSide = paths.sideSeamFrontOriginal
          .reverse()
          .shiftAlong(
            measurements.waistToKnee -
              waistDown +
              (options.articulatedKnee
                ? measurements.knee * options.articulatedKneeDartSize * 0.96
                : 0)
          )
        points.indicatorKneeInside = points.markerKneeSide.shift(
          points.hemSide.angle(points.hemIn),
          2000
        )
        points.markerKneeInside = paths.insideSeamFront.intersectsBeam(
          points.indicatorKneeInside,
          points.markerKneeSide
        )[0]
        paths.kneeLine = new Path()
          .move(points.markerKneeInside)
          .line(points.markerKneeSide)
          .attr('class', 'contrast help')
        macro('banner', {
          id: 'kneeLine',
          classes: 'center contrast help',
          path: paths.kneeLine,
          text: 'kneeLine',
        })
      }
    }
    if (complete) {
      if (paths.frontPocketSeamMarker !== undefined)
        paths.frontPocketSeamMarker.unhide().addClass('lining stroke-l')
      if (options.frontPocketInside == false) {
        if (paths.frontPocketOpening !== undefined)
          paths.pocketOpeningMarker = paths.frontPocketOpening.clone().unhide().addClass('lining')
      }
    }
    points.gridAnchor = points.pO.clone()

    store.cutlist.addCut({ cut: 2, from: 'fabric' })

    points.logo = points.pE.clone()
    snippets.logo = new Snippet('logo', points.logo)
    points.title = points.logo.shift(270, 80)
    macro('title', {
      nr: 1,
      at: points.title,
      title: 'front',
      align: 'center',
    })

    macro('grainline', {
      from: points.pocketBL.shiftFractionTowards(points.pocketTL, -0.8),
      to: points.pocketBL.shiftFractionTowards(points.pocketTL, 0.65),
    })

    if (sa) {
      paths.sa = paths.seam.offset(sa).attr('class', 'fabric sa')
      if (options.frontPocketInside) {
        paths.frontPocketOpeningSA = paths.frontPocketOpening
          .reverse()
          .offset(sa)
          .attr('class', 'fabric sa')
      }
    }

    points.seamRight = paths.seam.edge('right')
    dim(part, [
      ['h', 'flyTopCenter', 'waistSeamFrontStart', 'waistSeamFrontStart', -15],
      ['h', 'flyTop', 'flyTopCenter', 'waistSeamFrontStart', -15],
      ['h', 'flyBottom', 'flyTopCenter', 'waistSeamFrontStart', -25],
      ['h', 'gussetFront', 'flyTopCenter', 'waistSeamFrontStart', -35],
      ['h', 'waistSeamFrontStart', 'seamRight', 'waistSeamFrontStart', -15],
      ['v', 'seamRight', 'waistSeamFrontStart', 'seamRight', 15],
      ['v', 'flyBottom', 'flyTopCenter', 'flyTop', -15],
      ['v', 'pZ', 'flyTopCenter', 'flyTop', -25],
      ['v', 'gussetFront', 'flyTopCenter', 'flyTop', -35],
      ['v', 'gussetFrontLeg', 'gussetFront', 'flyTop', -35],
      ['v', 'hemIn', 'gussetFrontLeg', 'flyTop', -35],
    ])

    if (options.hemType === 'hem' || options.hemType === 'elastic') {
      dim(part, [
        ['v', 'hemInUp', 'hemIn', 'flyTop', -35],
        ['v', 'hemSideUp', 'waistSeamFrontStart', 'seamRight', 25],
        ['h', 'hemIn', 'hemSide', 'hemSideUp', 15],
        ['h', 'hemSide', 'seamRight', 'hemSideUp', 15],
        ['h', 'gussetFrontLeg', 'hemIn', 'hemSideUp', 15],
        ['h', 'gussetFront', 'hemIn', 'hemSideUp', 25],
        ['h', 'hemInUp', 'hemSideUp', 'hemSideUp', 25],
      ])
    } else {
      dim(part, [
        ['v', 'hemSide', 'waistSeamFrontStart', 'seamRight', 25],
        ['h', 'hemIn', 'hemSide', 'hemSide', 15],
        ['h', 'hemSide', 'seamRight', 'hemSide', 15],
        ['h', 'gussetFrontLeg', 'hemIn', 'hemSide', 15],
        ['h', 'gussetFront', 'hemIn', 'hemSide', 25],
      ])
    }

    if (
      options.articulatedKnee &&
      measurements.waistToKnee / (measurements.waistToFloor * store.get('legLength')) < 0.8
    ) {
      dim(part, [
        ['v', 'hemIn', 'artKneeInsideUpDart', 'artKneeInsideUpDart', -25],
        ['v', 'hemIn', 'artKneeInsideDownDart', 'artKneeInsideDownDart', -15],
        ['v', 'hemSide', 'artKneeSideUpDart', 'artKneeSideUpDart', 25],
        ['v', 'hemSide', 'artKneeSideDownDart', 'artKneeSideDownDart', 15],
      ])
    }

    return part
  },
}
