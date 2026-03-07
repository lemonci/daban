import { cbqc } from '@freesewing/core'
import { frontpoints as corneliusFrontpoints } from '@freesewing/cornelius'
import { rotateDistanceForP3, rotateDistanceForP4 } from './backutils.mjs'
import * as options from './options.mjs'

export const basepoints = {
  name: 'crux.basepoints',
  from: corneliusFrontpoints,
  hide: {
    self: true,
    from: true,
    inherited: true,
  },
  measurements: [
    'waist',
    'waistBack',
    'hips',
    'inseam',
    'seat',
    'seatBack',
    'waistToKnee',
    'waistToHips',
    'waistToSeat',
    'waistToFloor',
    'knee',
    'heel',
  ],
  options,
  draft: ({
    options,
    measurements,
    Point,
    Path,
    points,
    paths,
    store,
    log,
    macro,
    utils,
    part,
  }) => {
    const hipsFront = measurements.hips * 0.5 + options.hipsShift * measurements.hips
    const hipsBack = measurements.hips * 0.5 - options.hipsShift * measurements.hips
    const waistToHipsFront = measurements.waist - measurements.waistBack - hipsFront
    const waistToHipsBack = measurements.waistBack - hipsBack
    const legLength =
      options.legLength === 'long'
        ? 0.97 - (options.hemType === 'ribknit' ? options.hemLength : 0)
        : options.legLength === 'capris'
          ? 0.725
          : options.legLength === 'shorts'
            ? 0.47
            : options.legLengthCustom

    const waistbandTargetFront =
      waistToHipsFront * (1 - options.waistbandLower) +
      hipsFront * 0.5 * (1 - options.waistReduction)
    const waistbandTargetBack =
      waistToHipsBack * (1 - options.waistbandLower) +
      hipsBack *
        0.5 *
        (1 - options.waistReduction) *
        (options.waistbandType === 'standard'
          ? 1
          : options.waistbandType === 'ribknit'
            ? 1.025
            : 1.05)
    store.set('waistbandTargetFront', waistbandTargetFront)
    store.set('waistbandTargetBack', waistbandTargetBack)
    store.set('hipsFront', hipsFront)
    store.set('hipsBack', hipsBack)
    store.set('legLength', legLength)

    // const inseam = measurements.inseam - (measurements.waistToFloor - measurements.waistToKnee)
    // const waistDown = measurements.waistToHips * options.waistbandBelowWaist
    const waistDown = measurements.waistToHips * options.waistbandLower
    const waistbandToFloor = measurements.waistToFloor - waistDown
    const seatFront = measurements.seat - measurements.seatBack
    store.set('waistDown', waistDown)

    points.pE = points.pA.shift(180, seatFront / 4)
    points.pF = points.pA.shift(180, seatFront / 2)
    points.pD = points.pO.shift(180, seatFront / 4)
    points.pH = points.pC.shift(180, seatFront / 4)
    points.pG = points.pO.shift(180, seatFront / 2)

    points.wHips = points.pE.shift(
      90,
      measurements.waistToFloor - measurements.inseam - measurements.waistToHips
    )

    points.newWaistBand = points.wHips.shift(
      90,
      measurements.waistToHips * (1 - options.waistbandLower)
    )

    points.floorMiddle = points.pD.shift(270, measurements.waistToFloor)
    points.floorSide = points.floorMiddle.shift(0, measurements.heel / 4)
    points.floorIn = points.floorMiddle.shift(180, measurements.heel / 4)

    points.floorSideCpA = points.floorSide
      .shiftFractionTowards(points.pAextraCPj, options.pctJtoA)
      .shift(0, points.pJ.dist(points.pH) * options.fullness)

    let diff = 0
    let iteration = 0
    let pUtemp = points.pU.shift(180, diff)
    let pUcpAtemp
    do {
      pUtemp = pUtemp.shift(180, diff)
      pUcpAtemp = pUtemp.shiftFractionTowards(points.pAextraCPu, options.pctUtoA)

      paths.sideSeamFront = new Path()
        .move(points.floorSide)
        .curve(points.floorSideCpA, points.pAextraCPj, points.pAextra)
        .curve(points.pAextraCPu, pUcpAtemp, pUtemp)
        .hide()

      points.frontWaistSide = paths.sideSeamFront.intersectsY(points.newWaistBand.y)[0]
      points.frontWaistCenter = utils.beamIntersectsY(points.pW, points.pZ, points.newWaistBand.y)

      diff = points.frontWaistSide.dist(points.frontWaistCenter) - waistbandTargetFront
      iteration++
    } while (iteration < 100 && (diff > 0.1 || diff < -0.1))
    if (iteration >= 100) {
      log.error('Could not create the sdie seam')
    }

    points.frontWaistMiddle = new Point(points.pD.x, points.newWaistBand.y)

    paths.sideSeamFront = paths.sideSeamFront.split(points.frontWaistSide)[0].hide()
    const halfInch = store.get('halfInch')
    const waist = store.get('waist')

    const flyWidth = options.flyWidth * measurements.waist
    store.set('flyWidth', flyWidth)

    points.pZcpR = points.pZ.shiftFractionTowards(points.pX, options.pctZtoR)
    points.pRcpZ = points.pR
      .shiftFractionTowards(points.pF, options.pctRtoZin)
      .shiftFractionTowards(points.pZ, options.pctRtoZup)

    let waistAngle = Math.abs(points.pW.angle(points.pD) - points.pW.angle(points.pZ))
    if (waistAngle > 180) {
      waistAngle -= 180
    }

    paths.waistSeamFront = new Path()
      .move(points.frontWaistSide)
      .line(points.frontWaistCenter)
      .hide()
      .addText('target: ' + waistbandTargetFront, 'note center')

    points.flyTop = points.frontWaistCenter.shift(
      (points.frontWaistCenter.angle(points.pZ) - 270) * 2 + 180,
      flyWidth
    )
    points.flyBottom = points.flyTop.shift(
      points.frontWaistCenter.angle(points.pZ),
      points.frontWaistCenter.dist(points.pZ) - flyWidth
    )

    points.pZcpFB = points.pZ.shift(
      points.frontWaistCenter.angle(points.pZ) - waistAngle,
      flyWidth * cbqc
    )
    points.pFBcpZ = points.flyBottom.shift(
      points.frontWaistCenter.angle(points.pZ),
      flyWidth * cbqc
    )
    points.flyTopCenter = points.frontWaistCenter.clone()
    paths.fly = new Path()
      .move(points.flyTopCenter)
      .line(points.flyTop)
      .line(points.flyBottom)
      .curve(points.pFBcpZ, points.pZcpFB, points.pZ)
      .hide()

    paths.flyFold = new Path().move(points.frontWaistCenter).line(points.pZ).hide()

    store.set('flyLength', paths.flyFold.length())

    paths.crotchSeamFront = new Path()
      .move(points.pZ)
      .curve(points.pZcpR, points.pRcpZ, points.pR)
      .hide()

    points.pRcpK = points.pR
      .shiftFractionTowards(points.pF, options.pctRtoKin)
      .shiftFractionTowards(points.pK, options.pctRtoKdown)
    points.pKcpR = points.pK
      .shiftFractionTowards(points.pH, -1 * (options.pctKtoRout + options.fullness))
      .shiftFractionTowards(points.pR, options.pctKtoRup)
    points.floorInCpR = points.floorIn
      .shiftFractionTowards(points.pH, -1 * (options.pctKtoRout + options.fullness))
      .shiftFractionTowards(points.pR, options.pctKtoRup)

    paths.insideSeamFront = new Path()
      .move(points.pR)
      .curve(points.pRcpK, points.floorInCpR, points.floorIn)
      .hide()
    store.set('insideSeamFront', paths.insideSeamFront.length())

    paths.insideSeamFrontTemp = paths.insideSeamFront.clone().unhide().setClass('lining').hide() // ExtraLine

    const sideSeamShiftUp = (store.get('insideSeamFront') - measurements.inseam) * 0.7

    paths.sideSeamFrontTemp = paths.sideSeamFront.clone().unhide().setClass('lining')
    macro('transform', {
      transform: 'translate',
      x: 0,
      y: sideSeamShiftUp * -1,
      clone: false,
      paths: ['sideSeamFrontTemp'],
    })
    points.frontWaistCenterTemp = paths.sideSeamFrontTemp.end()
    paths.waistSeamFrontTemp = new Path()
      .move(points.frontWaistCenter)
      .curve(
        points.frontWaistCenter.shiftFractionTowards(points.frontWaistSide, 0.8),
        points.frontWaistCenterTemp,
        points.frontWaistCenterTemp
      )
      .addClass('lining')

    diff = paths.waistSeamFrontTemp.length() - waistbandTargetFront
    iteration = 0
    const angleSide = points.floorSide.angle(points.frontWaistCenterTemp)
    do {
      const angleSide = points.floorSide.angle(points.frontWaistCenterTemp)
      points.frontWaistCenterTemp = points.frontWaistCenterTemp.shift(angleSide + 90, diff)
      paths.waistSeamFrontTemp = new Path()
        .move(points.frontWaistCenter)
        .curve(
          points.frontWaistCenter.shiftFractionTowards(points.frontWaistSide, 0.8),
          points.frontWaistCenterTemp,
          points.frontWaistCenterTemp
        )
        .addClass('lining')
        .hide()

      diff = paths.waistSeamFrontTemp.length() - waistbandTargetFront
      iteration++
    } while (iteration < 100 && (diff > 0.1 || diff < -0.1))
    if (iteration >= 100) {
      log.error('Could not find the waist center point within 100 iterations')
    }

    paths.sideSeamFrontTemp = paths.sideSeamFrontTemp.rotate(
      points.floorSide.angle(points.frontWaistCenterTemp) - angleSide,
      points.floorSide
    )
    points.frontWaistCenter = points.frontWaistCenterTemp.clone()
    points.floorSide = paths.sideSeamFrontTemp.start()
    paths.sideSeamFront = paths.sideSeamFrontTemp.clone()
    paths.waistSeamFront = paths.waistSeamFrontTemp.clone().reverse().hide()
    paths.waistSeamFrontTemp.hide()
    paths.sideSeamFrontTemp.hide()
    points.waistSeamFrontStart = paths.waistSeamFront.start()
    store.set('waistLengthFront', paths.waistSeamFront.length())
    // console.log({waistLengthFront: store.get('waistLengthFront')})

    store.set('sideSeamFront', paths.sideSeamFront.length())

    points.hemSide = paths.sideSeamFront.reverse().shiftAlong(waistbandToFloor * legLength)
    paths.sideSeamFront = paths.sideSeamFront.split(points.hemSide)[1].hide()
    store.set('sideSeamFrontHem', paths.sideSeamFront.length())

    points.hemIn = paths.insideSeamFront.intersectsY(points.hemSide.y)[0]

    paths.insideSeamFront = paths.insideSeamFront.split(points.hemIn)[0].hide()
    store.set('insideSeamFrontHem', paths.insideSeamFront.length())

    paths.legSeamFront = new Path().move(points.hemIn).line(points.hemSide).hide()

    store.set('legSeamFront', paths.legSeamFront.length())

    points.gussetFront = paths.crotchSeamFront.shiftFractionAlong(1 - options.gussetWidthFront)
    points.gussetFrontLeg = paths.insideSeamFront.shiftAlong(
      store.get('insideSeamFront') * options.gussetDepth
    )

    points.gussetFrontCp = points.gussetFront.shift(
      paths.crotchSeamFront.angleAt(points.gussetFront) + 90,
      // store.get('sideSeamFront') * options.gussetDepth * 0.25
      store.get('insideSeamFront') * options.gussetDepth * 0.5 * (1 - options.gussetWidthFront)
    )

    paths.gussetFront = new Path()
      .move(points.gussetFront)
      .curve(points.gussetFrontCp, points.gussetFrontLeg, points.gussetFrontLeg)
      .hide()

    const csfa = paths.crotchSeamFront.split(points.gussetFront)
    paths.crotchSeamFront = csfa[0].hide()
    paths.gussetCrotchFront = csfa[1].hide()

    const isfa = paths.insideSeamFront.split(points.gussetFrontLeg)
    paths.insideSeamFront = isfa[1].hide()
    paths.gussetLegFront = isfa[0].hide()

    let tempP = null

    const seat = measurements.seatBack

    points.p2 = points.frontWaistMiddle.shift(90, seat / 12 /* + halfInch*/)
    points.p10 = points.floorIn.shiftTowards(points.floorMiddle, -halfInch)
    rotateDistanceForP3(part, points.pR.clone(), halfInch * 2, points.floorIn)

    points.p11 = points.floorSide.shiftTowards(points.pH, -halfInch)

    rotateDistanceForP4(part, points.pU, -1 * (waist / 2 + halfInch), points.p11, points.p2)
    points.hemInBack = paths.insideSeamBack.shiftAlong(store.get('insideSeamFrontHem'))
    points.hemSideBack = paths.sideSeamBack.shiftAlong(
      store.get('sideSeamFront') - store.get('sideSeamFrontHem')
    )

    paths.insideSeamBackTemp = paths.insideSeamBack.clone().addClass('canvas').hide() // ExtraLine

    store.set('insideSeamBack', paths.insideSeamBack.length())
    paths.sideSeamBack = paths.sideSeamBack.split(points.hemSideBack)[1].hide()
    paths.insideSeamBack = paths.insideSeamBack.split(points.hemInBack)[0].hide()

    points.p2a = points.p2.shiftTowards(points.p4, halfInch)

    tempP = points.p6.shiftTowards(points.pT, 1000)
    const pathFto2a = new Path().move(points.pF).line(points.p2a)
    const path6ThroughT = new Path().move(points.p6).line(tempP)
    points.p5 = path6ThroughT.intersects(pathFto2a)[0]

    points.p5cp3 = points.p5.shiftFractionTowards(points.pF, options.pctZtoR * 2)
    points.p3cp5 = points.p3
      .shiftFractionTowards(points.pF, options.pctRtoZin)
      .shiftFractionTowards(points.p5, options.pctRtoZup / 4)

    points.p2cp5 = points.p2.shiftFractionTowards(points.p5, options.pctZtoR)
    points.p5cp2 = points.p5.shift(
      points.p5.angle(points.p5cp3) + 180,
      points.p2.dist(points.p5) * options.pctZtoR
    )

    paths.crotchSeamBack = new Path()
      .move(points.p2)
      .curve(points.p2cp5, points.p5cp2, points.p5)
      .curve(points.p5cp3, points.p3cp5, points.p3)
      .hide()

    tempP = points.pH.shift(90, halfInch * 1)
    points.p10cpH = points.p10.shiftFractionTowards(tempP, options.pctKtoH)
    points.p11cpH = points.p11.shiftFractionTowards(tempP, options.pctKtoH)

    paths.legSeamBack = new Path().move(points.hemInBack).line(points.hemSideBack).hide()
    store.set('legSeamBack', paths.legSeamBack.length())

    paths.waistSeamBackSA = new Path()
      .move(points.p4)
      .join(paths.curveRightOfDart)
      .join(paths.curveDartSA)
      .join(paths.curveLeftOfDart)
      .hide()
    paths.waistSeamBack = new Path()
      .move(points.p4)
      .join(paths.curveRightOfDart)
      .join(paths.curveDart)
      .join(paths.curveLeftOfDart)
      .hide()
    // .addText('target: ' + waistbandTargetBack, 'note center')

    store.set('waistLengthBack', paths.curveLeftOfDart.length() + paths.curveRightOfDart.length())
    // console.log({waistLengthBack:store.get('waistLengthBack')})

    points.gussetBack = paths.crotchSeamBack.shiftFractionAlong(1 - options.gussetWidthBack)
    points.gussetBackLeg = paths.insideSeamBack.shiftAlong(
      store.get('insideSeamBack') * options.gussetDepth
    )

    points.gussetBackCp = points.gussetBack.shift(
      paths.crotchSeamBack.angleAt(points.gussetBack) + 90,
      // paths.insideSeamBack.length() * options.gussetDepth * 0.25
      store.get('insideSeamBack') * options.gussetDepth * 0.75 * (1 - options.gussetWidthBack * 4)
    )

    paths.gussetBack = new Path()
      .move(points.gussetBack)
      .curve(points.gussetBackCp, points.gussetBackLeg, points.gussetBackLeg)
      .hide()

    const csba = paths.crotchSeamBack.split(points.gussetBack)
    paths.crotchSeamBack = csba[0].hide()
    paths.gussetCrotchBack = csba[1].hide()

    const isba = paths.insideSeamBack.split(points.gussetBackLeg)
    paths.insideSeamBack = isba[1].hide()
    paths.gussetLegBack = isba[0].hide()

    return part
  },
}
