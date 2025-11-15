import { back as bellaBack } from '@freesewing/bella'
import { hidePresets } from '@freesewing/core'
import * as options from './options.mjs'

export const backPoints = {
  name: 'noble.backPoints',
  from: bellaBack,
  hide: hidePresets.HIDE_ALL,
  options,
  draft: ({ points, Path, paths, options, snippets, log, part }) => {
    // Hide Bella paths
    // console.log({ po: JSON.parse(JSON.stringify(points)), pa: JSON.parse(JSON.stringify(paths)) })

    for (const key of Object.keys(paths)) paths[key].hide()
    for (const i in snippets) delete snippets[i]

    delete points.bustDartLeft
    delete points.bustDartLeftCp

    if (options.dartPosition == 'shoulder') {
      points.shoulderDart = points.hps.shiftFractionTowards(
        points.shoulder,
        options.shoulderDartPosition
      )
    } else {
      const armholePath = new Path()
        .move(points.shoulder)
        ._curve(points.armholePitchCp2, points.armholePitch)
        .curve(points.armholePitchCp1, points.armholeCp2, points.armhole)

      points.shoulderDart = armholePath.shiftFractionAlong(options.armholeDartPosition)
    }
    let aUp = points.dartTip.angle(points.shoulderDart)
    if (aUp > 180) {
      aUp = 360 - aUp
    }
    const aDown = points.dartBottomRight.angle(points.dartTip)
    const aDiff = Math.abs(aUp - aDown)

    const dartCpAdjustment = aDiff / (options.dartPosition == 'shoulder' ? 50 : 400)
    // console.log({ aUp: aUp, aDown: aDown, aDiff: aDiff, dartCpAdjustment: dartCpAdjustment })

    if (options.dartPosition == 'shoulder') {
      points.shoulderDartCpUp = points.shoulderDart.shiftFractionTowards(
        points.dartTip,
        1 - dartCpAdjustment
      )
      points.shoulderDartCpDown = points.shoulderDart.shiftFractionTowards(
        points.dartTip,
        1 + dartCpAdjustment * 2
      )
      const length = {
        i: new Path()
          .move(points.dartBottomLeft)
          .curve(points.dartLeftCp, points.shoulderDartCpDown, points.dartTip)
          .curve(points.shoulderDartCpUp, points.shoulderDart, points.shoulderDart)
          .length(),
      }

      let iteration = 0
      let diff = 0
      let angle = 0
      do {
        if (length.o) angle = (diff / (length.i / 1300)) * (length.o > length.i ? -0.1 : 0.1)

        points.dartBottomRight = points.dartBottomRight.rotate(angle, points.waistSide)

        length.o = new Path()
          .move(points.shoulderDart)
          .curve(points.shoulderDart, points.shoulderDartCpUp, points.dartTip)
          .curve(points.shoulderDartCpDown, points.dartRightCp, points.dartBottomRight)
          .length()

        diff = length.o - length.i
        iteration++
      } while (diff < -0.5 || (diff > 0.5 && iteration < 100))
      if (iteration >= 100) {
        log.error('Something is not quite right here!')
      }
    } else {
      points.shoulderDartCpUp = points.shoulderDart.shiftFractionTowards(
        points.dartTip,
        1 - dartCpAdjustment
      )
      points.dartTip = points.dartLeftCp.shiftFractionTowards(points.dartTip, 0.5)
      points.shoulderDartCpDown = points.shoulderDartCpUp.shiftFractionTowards(
        points.dartTip,
        1 + dartCpAdjustment * 4
      )
      const length = {
        i: new Path()
          .move(points.dartBottomLeft)
          .curve(points.dartLeftCp, points.shoulderDartCpDown, points.dartTip)
          .curve(points.shoulderDartCpUp, points.shoulderDart, points.shoulderDart)
          .length(),
      }

      let iteration = 0
      let diff = 0
      let angle = 0
      do {
        if (length.o) angle = (diff / (length.i / 1300)) * (length.o > length.i ? -0.1 : 0.1)

        points.dartBottomRight = points.dartBottomRight.rotate(angle, points.waistSide)

        length.o = new Path()
          .move(points.shoulderDart)
          .curve(points.shoulderDart, points.shoulderDartCpUp, points.dartTip)
          .curve(points.shoulderDartCpDown, points.dartRightCp, points.dartBottomRight)
          .length()

        diff = length.o - length.i
        iteration++
      } while (diff < -0.5 || (diff > 0.5 && iteration < 100))
      if (iteration >= 100) {
        log.error('Something is not quite right here!')
      }
    }
    paths.armhole = new Path()
      .move(points.armhole)
      .curve(points.armholeCp2, points.armholePitchCp1, points.armholePitch)
      .curve_(points.armholePitchCp2, points.shoulder)
    return part
  },
}
