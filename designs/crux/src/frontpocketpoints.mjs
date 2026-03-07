import { cbqc } from '@freesewing/core'

import { frontPocketPresets, createFrontPocketOpening } from './shared.mjs'
import { basepoints } from './basepoints.mjs'

export const frontPocketPoints = {
  name: 'crux.frontpocketpoints',
  from: basepoints,
  hide: {
    self: true,
    from: true,
    inherited: true,
  },
  draft: ({ options, measurements, Point, Path, points, paths, store, part }) => {
    const frontPocketType = frontPocketPresets[options.frontPocketType]
    const oFrontPocketWidth = frontPocketType.frontPocketWidth
    const oFrontPocketHeight = frontPocketType.frontPocketHeight
    const oFrontPocketCurve = frontPocketType.frontPocketCurve
    const oFrontPocketOpening = frontPocketType.frontPocketOpening
    const oFrontPocketOpeningSquareness = frontPocketType.frontPocketOpeningSquareness
    const oFrontPocketOpeningAspect = frontPocketType.frontPocketOpeningAspect
    const oFrontPocketOpeningOffset = frontPocketType.frontPocketOpeningOffset

    paths.sideSeamFrontOriginal = paths.sideSeamFront.clone().hide()

    points.frontPocketBottomRight = paths.sideSeamFront
      .reverse()
      .shiftAlong(measurements.waistToKnee * oFrontPocketHeight)
    let splits

    points.frontPocketBottomRightStart = points.frontPocketBottomRight.clone()

    points.frontPocketTopLeft = paths.waistSeamFront.shiftFractionAlong(oFrontPocketWidth * 4)
    splits = paths.waistSeamFront.split(points.frontPocketTopLeft)
    paths.waistSeamFrontInside = splits[1].hide()
    paths.waistSeamFrontOutside = splits[0].hide()

    points.frontPocketBottomLeft = new Point(
      points.frontPocketTopLeft.x,
      points.frontPocketBottomRight.y
    )
    const pocketMaxWidth = points.frontPocketBottomRight.x - points.frontPocketBottomLeft.x

    let frontPocketWidth = points.frontPocketBottomLeft.dist(points.frontPocketBottomRight)
    const frontPocketLength = points.frontPocketBottomLeft.dist(points.frontPocketTopLeft)
    if (frontPocketLength / frontPocketWidth < 1.35) {
      frontPocketWidth = frontPocketLength / 1.35
    }
    const pocketCurveSize = Math.min(frontPocketWidth * oFrontPocketCurve, pocketMaxWidth * 0.52)
    const pocketControlSize = pocketCurveSize * cbqc
    const mycbqc = cbqc * (1 - oFrontPocketOpeningSquareness)

    points.frontPocketBottomLeftUp = points.frontPocketBottomLeft.shift(90, pocketCurveSize)
    points.frontPocketBottomLeftRight = points.frontPocketBottomLeft.shift(0, pocketCurveSize)
    points.frontPocketBottomLeftToUpCp = points.frontPocketBottomLeft.shift(90, pocketControlSize)
    points.frontPocketBottomLeftToRightCp = points.frontPocketBottomLeft.shift(0, pocketControlSize)
    const pocketBottomRightHelper = new Point(
      points.frontPocketBottomRight.x + 10,
      points.frontPocketBottomRight.y
    )
    points.frontPocketBottomRightUp = pocketBottomRightHelper.shift(90, pocketCurveSize)
    points.frontPocketBottomRightLeft = pocketBottomRightHelper.shift(180, pocketCurveSize)
    points.frontPocketBottomRightToLeftCp = pocketBottomRightHelper.shift(180, pocketControlSize)

    if (points.frontPocketBottomRightToLeftCp.x > points.frontPocketBottomRight.x) {
      points.frontPocketBottomRightUp = points.frontPocketBottomRight.copy()
      points.frontPocketBottomRightLeft = points.frontPocketBottomRight.copy()
      points.frontPocketBottomRightToLeftCp = points.frontPocketBottomRight.copy()
    }
    paths.frontPocketLeftBottomCurve = new Path()
      .move(points.frontPocketBottomLeftUp)
      .curve(
        points.frontPocketBottomLeftToUpCp,
        points.frontPocketBottomLeftToRightCp,
        points.frontPocketBottomLeftRight
      )
      .hide()

    createFrontPocketOpening(
      part,
      frontPocketWidth,
      mycbqc,
      oFrontPocketOpening,
      oFrontPocketOpeningOffset,
      oFrontPocketOpeningAspect
    )

    points.frontPocketBottomRight = paths.sideSeamFront
      .reverse()
      .shiftAlong(measurements.waistToKnee * oFrontPocketHeight - frontPocketWidth * 0.45)
    splits = paths.sideSeamFront.split(points.frontPocketBottomRight)
    paths.sideSeamFrontLower = splits[0].hide()
    paths.sideSeamFrontUpper = splits[1].hide()

    points.frontPocketTopMiddle = paths.waistSeamFrontOutside.shiftFractionAlong(
      options.frontPocketType === 'square' ? 0.7 : 0.5
    )

    if (options.frontPocketType === 'standard' || options.frontPocketType === 'square') {
      if (options.frontPocketType === 'square') {
        points.frontPocketTopMiddle.x = points.fpL.x
      }
      splits = paths.waistSeamFrontOutside.split(points.frontPocketTopMiddle)
      paths.waistSeamFrontOutside = splits[0].hide()
      paths.waistSeamFrontMiddle = splits[1].hide()
      points.frontPocketTopMiddleCp = points.frontPocketTopMiddle.shift(
        195,
        frontPocketWidth * oFrontPocketOpeningOffset * mycbqc * 0.5
      )

      points.frontPocketOpeningSideSeam = paths.sideSeamFront
        .reverse()
        .shiftAlong(
          (points.fpR2B.y - points.fpT2R.y) * (options.frontPocketType === 'square' ? 0.74 : 0.85)
        )
      points.frontPocketOpeningSideSeamCp = points.frontPocketOpeningSideSeam.shift(
        245,
        frontPocketWidth * oFrontPocketOpeningOffset * mycbqc * 0.5
      )
      splits = paths.sideSeamFrontUpper.split(points.frontPocketOpeningSideSeam)
      paths.sideSeamFrontUpper = splits[1].hide()
      paths.sideSeamFrontMiddle = splits[0].hide()
    } else {
      paths.sideSeamFrontMiddle = paths.sideSeamFrontUpper.clone()
      paths.waistSeamFrontMiddle = paths.waistSeamFrontOutside.clone()
      points.frontPocketTopMiddle = points.waistSeamFrontStart.clone()
    }
    points.frontPocketBottomRightToUpCp = points.frontPocketBottomRight.shift(
      270,
      pocketControlSize * mycbqc
    )

    if (options.frontPocketType === 'diamond' || options.frontPocketType === 'square') {
      splits = paths.sideSeamFrontLower.split(points.frontPocketBottomRightStart)
      paths.frontPocketRightBottomCurve = splits[1].clone().hide()
    } else {
      paths.frontPocketRightBottomCurve = new Path()
        .move(points.frontPocketBottomRightLeft)
        .curve(
          points.frontPocketBottomRightToLeftCp,
          points.frontPocketBottomRightToUpCp,
          points.frontPocketBottomRight
        )
        .hide()
    }

    paths.frontPocketSeamMarker = new Path()
      .move(points.frontPocketTopLeft)
      .line(points.frontPocketBottomLeftUp)
      .join(paths.frontPocketLeftBottomCurve)
      .line(points.frontPocketBottomRightLeft)
      .join(paths.frontPocketRightBottomCurve)
      .hide()
    paths.frontPocketSeam = new Path()
      .move(points.frontPocketTopMiddle)
      .join(paths.waistSeamFrontMiddle)
      .join(paths.frontPocketSeamMarker)
      .join(paths.sideSeamFrontMiddle)
      .hide()

    if (options.frontPocketType === 'standard') {
      paths.frontPocketOpening = new Path()
        .move(points.frontPocketTopMiddle)
        .curve(points.frontPocketTopMiddleCp, points.fpL2T, points.fpL)
        .curve(points.fpL2B, points.fpB2L, points.fpB)
        .curve(points.fpB2R, points.frontPocketOpeningSideSeamCp, points.frontPocketOpeningSideSeam)
        .hide()
    } else if (options.frontPocketType === 'square') {
      paths.frontPocketOpening = new Path()
        .move(points.frontPocketTopMiddle)
        .line(points.fpL)
        .curve(points.fpL2B, points.fpB2L, points.fpB)
        .curve(
          points.fpB.shift(0, points.fpB.dist(points.frontPocketOpeningSideSeam) * 0.5),
          points.frontPocketOpeningSideSeam,
          points.frontPocketOpeningSideSeam
        )
        .hide()
    } else if (options.frontPocketType === 'hole' || options.frontPocketType === 'diamond') {
      paths.frontPocketOpening = new Path()
        .move(points.fpT)
        .curve(points.fpT2L, points.fpL2T, points.fpL)
        .curve(points.fpL2B, points.fpB2L, points.fpB)
        .curve(points.fpB2R, points.fpR2B, points.fpR)
        .curve(points.fpR2T, points.fpT2R, points.fpT)
        .hide()
    }

    store.set('frontPocketSeamCargoLength', paths.frontPocketSeamMarker.length())

    return part
  },
}
