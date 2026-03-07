import { cbqc } from '@freesewing/core'

import { backPocketPresets, createBackPocketOpening } from './shared.mjs'
import { basepoints } from './basepoints.mjs'

export const backPocketPoints = {
  name: 'crux.backpocketpoints',
  from: basepoints,
  hide: {
    self: true,
    from: true,
    inherited: true,
  },
  draft: ({ options, measurements, Path, points, paths, store, part }) => {
    const backPocketType = backPocketPresets[options.backPocketType]
    const oBackPocketWidth = backPocketType.backPocketWidth
    const oBackPocketHeight = backPocketType.backPocketHeight
    const oBackPocketCurve = backPocketType.backPocketCurve
    const oBackPocketOpening = backPocketType.backPocketOpening
    const oBackPocketOpeningSquareness = backPocketType.backPocketOpeningSquareness
    const oBackPocketOpeningAspect = backPocketType.backPocketOpeningAspect
    const oBackPocketOpeningOffset = backPocketType.backPocketOpeningOffset

    store.set('backPocketHeight', measurements.waistToKnee * oBackPocketHeight)

    points.backPocketTopLeft = paths.curveLeftOfDart.shiftFractionAlong(oBackPocketWidth * 4)
    points.backPocketTopRight = paths.curveRightOfDart.shiftFractionAlong(1 - oBackPocketWidth * 4)
    points.backPocketTopMiddle = points.backPocketTopLeft.shiftFractionTowards(
      points.backPocketTopRight,
      0.5
    )
    const oBackPocketAngle = points.backPocketTopRight.angle(points.backPocketTopLeft)
    store.set('backAngle', oBackPocketAngle)

    points.backPocketBottomLeft = points.backPocketTopLeft.shift(
      oBackPocketAngle + 90,
      measurements.waistToKnee * oBackPocketHeight
    )
    points.backPocketBottomRight = points.backPocketTopRight.shift(
      oBackPocketAngle + 90,
      measurements.waistToKnee * oBackPocketHeight
    )
    points.backPocketBottomMiddle = points.backPocketBottomLeft.shiftFractionTowards(
      points.backPocketBottomRight,
      0.5
    )

    const backPocketWidth = points.backPocketBottomLeft.dist(points.backPocketBottomRight)
    const backPocketCurveSize = oBackPocketCurve * backPocketWidth * 0.5
    const backPocketControlSize = backPocketCurveSize * cbqc

    points.backPocketBottomLeftUp = points.backPocketBottomLeft.shift(
      oBackPocketAngle - 90,
      backPocketCurveSize
    )
    points.backPocketBottomRightUp = points.backPocketBottomRight.shift(
      oBackPocketAngle - 90,
      backPocketCurveSize
    )
    points.backPocketBottomLeftRight = points.backPocketBottomLeft.shift(
      oBackPocketAngle - 180,
      backPocketCurveSize
    )
    points.backPocketBottomRightLeft = points.backPocketBottomRight.shift(
      oBackPocketAngle,
      backPocketCurveSize
    )

    points.backPocketBottomLeftToUpCp = points.backPocketBottomLeft.shift(
      oBackPocketAngle - 90,
      backPocketControlSize
    )
    points.backPocketBottomLeftToRightCp = points.backPocketBottomLeft.shift(
      oBackPocketAngle - 180,
      backPocketControlSize
    )
    points.backPocketBottomRightToUpCp = points.backPocketBottomRight.shift(
      oBackPocketAngle - 90,
      backPocketControlSize
    )
    points.backPocketBottomRightToLeftCp = points.backPocketBottomRight.shift(
      oBackPocketAngle,
      backPocketControlSize
    )

    paths.backPocketLeftBottomCurve = new Path()
      .move(points.backPocketBottomLeftUp)
      .curve(
        points.backPocketBottomLeftToUpCp,
        points.backPocketBottomLeftToRightCp,
        points.backPocketBottomLeftRight
      )
      .hide()

    paths.backPocketRightBottomCurve = new Path()
      .move(points.backPocketBottomRightLeft)
      .curve(
        points.backPocketBottomRightToLeftCp,
        points.backPocketBottomRightToUpCp,
        points.backPocketBottomRightUp
      )
      .hide()

    const backCBQG = cbqc * (1 - oBackPocketOpeningSquareness)

    createBackPocketOpening(
      part,
      oBackPocketAngle,
      backPocketWidth,
      backCBQG,
      oBackPocketOpening,
      oBackPocketOpeningOffset,
      oBackPocketOpeningAspect
    )

    paths.waistSeamPocketPart = paths.waistSeamBack
      .split(points.backPocketTopLeft)[0]
      .split(points.backPocketTopRight)[1]

    if (options.backPocketType === 'square') {
      points.backPocketTopLeft = points.backPocketTopLeft.shiftTowards(
        points.backPocketBottomLeft,
        points.backPocketTopMiddle.dist(points.bpB)
      )
      points.backPocketTopRight = points.backPocketTopRight.shiftTowards(
        points.backPocketBottomRight,
        points.backPocketTopMiddle.dist(points.bpB)
      )

      paths.backPocketSeamMarker = new Path()
        .move(points.backPocketTopLeft)
        .line(points.backPocketBottomLeftUp)
        .join(paths.backPocketLeftBottomCurve)
        .line(points.backPocketBottomRightLeft)
        .join(paths.backPocketRightBottomCurve)
        .line(points.backPocketTopRight)
        .hide()
      paths.backPocketSeam = new Path()
        .move(points.backPocketTopLeft)
        .join(paths.backPocketSeamMarker)
        .line(points.backPocketTopLeft)
        .close()
        .hide()

      paths.backPocketSeamOutline = paths.backPocketSeam.clone().hide()
    } else {
      paths.backPocketSeamMarker = new Path()
        .move(points.backPocketTopLeft)
        .line(points.backPocketBottomLeftUp)
        .join(paths.backPocketLeftBottomCurve)
        .line(points.backPocketBottomRightLeft)
        .join(paths.backPocketRightBottomCurve)
        .line(points.backPocketTopRight)
        .hide()

      paths.backPocketSeam = paths.waistSeamPocketPart
        .clone()
        .join(paths.backPocketSeamMarker)
        .close()
        .hide()

      paths.backPocketSeamOutline = paths.waistSeamBackSA
        .clone()
        .split(points.backPocketTopLeft)[0]
        .split(points.backPocketTopRight)[1]
        .line(points.backPocketBottomLeftUp)
        .join(paths.backPocketLeftBottomCurve)
        .line(points.backPocketBottomRightLeft)
        .join(paths.backPocketRightBottomCurve)
        .line(points.backPocketTopRight)
        .close()
        .hide()
    }
    store.set('backPocketSeamCargoLength', paths.backPocketSeamMarker.length())

    if (options.backPocketType === 'standard') {
      paths.waistSeamPocketPart.hide()
      paths.backPocketSeamOutline.hide()
      points.backOpeningLeft = paths.waistSeamPocketPart.reverse().shiftFractionAlong(0.06)
      points.backOpeningRight = paths.waistSeamPocketPart.shiftFractionAlong(0.06)
      points.bpT2L = points.backOpeningLeft.shift(
        250,
        points.backOpeningLeft.dist(points.bpL) * 0.3
      )
      points.bpT2R = points.backOpeningRight.shift(
        290,
        points.backOpeningRight.dist(points.bpR) * 0.3
      )
      points.bpL = points.bpL.shiftFractionTowards(points.bpL2B, 0.3)
      points.bpR = points.bpR.shiftFractionTowards(points.bpR2B, 0.3)
      points.bpL2T = points.bpL2T.shiftFractionTowards(points.bpL, 0.75)
      points.bpR2T = points.bpR2T.shiftFractionTowards(points.bpR, 0.75)
    } else if (options.backPocketType === 'hole' || options.backPocketType === 'diamond') {
      let intersections = paths.waistSeamPocketPart.intersectsBeam(points.bpT2L, points.bpT2R)
      points.backOpeningLeft = intersections[1]
      points.backOpeningRight = intersections[0]
    }

    if (options.backPocketType !== 'square') {
      if (options.backPocketType === 'diamond') {
        points.bpT2L = points.backOpeningLeft.clone()
      }
      let splits = paths.waistSeamPocketPart.split(points.backOpeningLeft)
      paths.waistSeamPocketPartLeft = splits[1].hide()
      splits = splits[0].split(points.backOpeningRight)
      paths.waistSeamPocketPartRight = splits[0].hide()

      if (options.backPocketType === 'standard') {
        splits = paths.waistSeamBackSA.split(points.backOpeningLeft)
      } else {
        splits = paths.waistSeamBack.split(points.backOpeningLeft)
      }
      paths.waistSeamLeft = splits[1].hide()
      splits = splits[0].split(points.backOpeningRight)
      paths.waistSeamRight = splits[0].hide()
      paths.opening = new Path()
        .move(points.backOpeningRight)
        .curve(points.bpT2R, points.bpR2T, points.bpR)
        .curve(points.bpR2B, points.bpB2R, points.bpB)
        .curve(points.bpB2L, points.bpL2B, points.bpL)
        .curve(points.bpL2T, points.bpT2L, points.backOpeningLeft)
        .hide()

      paths.backPocketSeam = paths.waistSeamPocketPartLeft
        .clone()
        .line(points.backPocketBottomLeftUp)
        .join(paths.backPocketLeftBottomCurve)
        .line(points.backPocketBottomRightLeft)
        .join(paths.backPocketRightBottomCurve)
        .line(points.backPocketTopRight)
        .join(paths.waistSeamPocketPartRight)
        .join(paths.opening)
        .close()
        .hide()
    } else {
      paths.waistSeamPocketPart.hide()
    }

    return part
  },
}
