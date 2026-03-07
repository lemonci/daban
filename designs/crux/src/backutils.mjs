const J = (o) => JSON.parse(JSON.stringify(o))

export function rotateDistanceForP3(part, point, distance, center) {
  const { options, Path, points, paths, store, log } = part.shorthand()

  const length = store.get('insideSeamFront')

  const dCenter = point.dist(center)
  let angle = Math.atan(distance / dCenter) * (180 / Math.PI)
  let aOffset = (distance / dCenter) * -3 //angle *-.05;

  let pDistance,
    dOffset,
    pLength,
    dLength = 0
  let iteration = 0

  do {
    points.p3 = point.rotate(angle, center)

    points.p3cp10 = points.p3
      .shiftFractionTowards(points.pF, options.pctRtoKin) //*1.5
      .shiftFractionTowards(points.p10, options.pctRtoKdown) //*0.8
    points.p10cp3 = points.p10
      .shiftFractionTowards(points.floorMiddle, -1 * (options.pctKtoRout + options.fullness))
      .shiftFractionTowards(points.p3, options.pctKtoRup)

    paths.insideSeamBack = new Path()
      .move(points.p3)
      .curve(points.p3cp10, points.p10cp3, points.p10)
      .hide()

    pLength = paths.insideSeamBack.length()

    pDistance = point.dist(points.p3)
    dOffset = distance - pDistance
    dLength = pLength - length

    if (dLength > 0.1) point = point.shiftTowards(center, 0.9 * dLength)
    else if (dLength < -0.1) point = point.shiftTowards(center, 0.8 * dLength)
    else {
      if (dOffset > 0) {
        if (aOffset > 0) aOffset *= 0.8
        else aOffset *= -0.8
      } else {
        if (aOffset > 0) aOffset *= -0.9
        else aOffset *= 0.9
      }
      angle += aOffset
    }

    iteration++
  } while ((dOffset > 0.1 || dOffset < -0.1 || dLength < -0.1 || dLength > 0.1) && iteration < 100)

  if (iteration >= 100) {
    log.error('Could not find a point for "3" within 100 iterations')
  }
}

export function rotateDistanceForP4(part, point, distance, center, origin) {
  const { options, Path, points, paths, store, utils, measurements, log } = part.shorthand()

  let aCPu,
    aCPj,
    a4to11 = null

  const waistbandTargetBack = store.get('waistbandTargetBack')
  const length = store.get('sideSeamFront')
  const halfInch = store.get('halfInch')

  let pivotAngle, originalAngle, angleChange

  const dCenter = point.dist(center)

  let angle = Math.atan(Math.abs(distance) / dCenter) * (180 / Math.PI)
  if (distance < 0) {
    angle = 360 - angle
    distance *= -1
  }

  let p4Length = length
  let iteration = 0
  let p2to4 = waistbandTargetBack + (measurements.seatBack * 0.5 - waistbandTargetBack) * 0.6
  let sLength = length,
    wLength = p2to4
  let sDiff = 0,
    wDiff = 0

  points.p4 = utils.circlesIntersect(points.p2, p2to4, center, p4Length)[1]
  points.p4orig = utils.circlesIntersect(points.p2, waistbandTargetBack, center, p4Length)[1]
  points.p2cp4 = points.p2.shift(points.p2.angle(points.pX) + 90, points.p2.dist(points.pX) * 0.2)

  let curveWithDart
  do {
    points.p4 = points.p4.shiftTowards(center, sDiff)
    points.p4 = points.p4.shiftTowards(points.p2, wDiff)
    points.p4orig = points.p4orig.shiftTowards(center, sDiff)
    points.p4orig = points.p4orig.shiftTowards(points.p2, wDiff)

    pivotAngle = points.floorSide.angle(points.p4orig)
    originalAngle = points.floorSide.angle(points.pU)
    angleChange = originalAngle - pivotAngle

    points.p6 = points.floorSide.shift(
      points.floorSide.angle(points.pT) - angleChange,
      points.floorSide.dist(points.pT)
    )
    points.p7 = points.floorSide.shift(
      points.floorSide.angle(points.pA) - angleChange,
      points.floorSide.dist(points.pA)
    )
    points.p6 = points.p6.shift(
      points.floorSide.angle(points.pT) - angleChange - 90,
      halfInch * options.fullness * 2
    )
    points.p7 = points.p7.shift(
      points.floorSide.angle(points.pA) - angleChange - 90,
      halfInch * options.fullness * 2
    )

    aCPu = points.p7.dist(points.p4) * options.pctAtoO
    aCPj = points.p7.dist(points.p11) * options.pctAtoC

    a4to11 = points.p4.angle(points.p11)

    // There's a tweak in there that moves the control point in when the fullness setting increases.
    points.p7cp4 = points.p7.shift(a4to11 + 180 + 5 * options.fullness, aCPu)
    points.p7cp11 = points.p7.shift(a4to11, aCPj)

    points.p4cp7 = points.p4.shiftFractionTowards(points.p7cp4, options.pctUtoA)
    points.p11cp7 = points.p11
      .shiftFractionTowards(points.p7cp11, options.pctJtoA)
      .shift(0, points.p11.dist(points.pH) * options.fullness)

    points.p4cp2 = points.p4.shift(points.p4.angle(points.p4cp7) - 90, points.p4.dist(points.p4cp7))

    paths.sideSeamBack = new Path()
      .move(points.p11)
      .curve(points.p11cp7, points.p7cp11, points.p7)
      .curve(points.p7cp4, points.p4cp7, points.p4)
      .hide()

    paths.waistBandBack = new Path()
      .move(points.p4)
      .curve(points.p4cp2, points.p2cp4, points.p2)
      .hide()

    curveWithDart = addDartToCurve(
      part,
      paths.waistBandBack,
      paths.waistBandBack.length() * options.dartPosition,
      (measurements.seatBack * 0.5 - waistbandTargetBack) *
        0.8 *
        /*(options.waistbandType === 'standard' ? 1 : 0.7)*/ 1,
      (measurements.waistToSeat - store.get('waistDown')) * -0.65,
      true
    )

    sLength = paths.sideSeamBack.length()
    wLength = curveWithDart.left.length() + curveWithDart.right.length()

    sDiff = sLength - length
    wDiff = wLength - waistbandTargetBack

    iteration++
  } while ((sDiff > 0.1 || sDiff < -0.1 || wDiff > 0.1 || wDiff < -0.1) && iteration < 100)

  if (iteration >= 100) {
    log.error('Could not find a point for "4" within 100 iterations')
  }

  paths.curveLeftOfDart = curveWithDart.right.clone().hide()
  paths.curveRightOfDart = curveWithDart.left.clone().hide()
  paths.curveDart = curveWithDart.dart.clone().hide()
  paths.curveDartSA = curveWithDart.sa

  points.dartOpeningLeft = paths.curveLeftOfDart.start()
  points.dartOpeningRight = paths.curveRightOfDart.end()
}

/**
 * Method to add a dart onto a curve
 * The dart is added at an 90 degree angle with the curve for a certain depth and Width
 * @param part             The part that will provide that Paths
 * @param curvePath        The curve the dart needs to divide
 * @param distance         Distance from $p1 where the middle of the dart will be
 * @param dartSize         The width of the dart opening at the curve
 * @param dartDepth        The depth of the dart
 *
 * @return                 Object with three path attributes; left, dart, right, sa
 */
export function addDartToCurve(
  part,
  curvePath,
  distance,
  dartSize,
  dartDepth,
  addFoldPath = false
) {
  const { options, macro } = part.shorthand()

  let saPath = undefined

  if (dartSize > curvePath.length()) {
    // Curve too small to fit dart!
    return null
  }
  if (distance < dartSize / 1.9) {
    distance = dartSize / 2.1
  }
  if (curvePath.length() - distance < dartSize) {
    distance = curvePath.length() - dartSize / 1.95
  }
  const dartMiddle = curvePath.shiftAlong(distance)
  const curvePaths = curvePath.split(dartMiddle)

  if (curvePaths[0].length() < dartSize / 2 || curvePaths[1].length() < dartSize / 2) {
    // Curve too small to fit dart!
    return null
  }
  const dartLeft = curvePaths[0].reverse().shiftAlong(dartSize / 2)
  const dartRight = curvePaths[1].shiftAlong(dartSize / 2)

  const distanceFactor = 0.0015
  const leftCPdistance = Math.max(
    curvePaths[0].length() * distanceFactor,
    curvePaths[0].ops[1].to.dist(curvePaths[0].ops[1].cp2)
  )
  const rightCPdistance = Math.max(
    curvePaths[1].length() * distanceFactor,
    curvePaths[1].ops[0].to.dist(curvePaths[1].ops[1].cp1)
  )

  const dartBottom = dartMiddle.shift(dartLeft.angle(dartRight) - 90, dartDepth)

  const leftDartCP = dartLeft.shift(dartLeft.angle(dartBottom) + 90, leftCPdistance)
  const rightDartCP = dartRight.shift(dartRight.angle(dartBottom) - 90, rightCPdistance)
  const curveLeftOfDart = new part.Path()
    .move(curvePaths[0].ops[0].to)
    .curve(curvePaths[0].ops[1].cp1, leftDartCP, dartLeft)
    .hide()
  const curveRightOfDart = new part.Path()
    .move(dartRight)
    .curve(rightDartCP, curvePaths[1].ops[1].cp2, curvePaths[1].ops[1].to)
    .hide()

  let dart = null
  if (options.curvedDarts) {
    if (
      Math.abs(dartBottom.angle(dartLeft) - dartBottom.angle(dartRight)) <
      options.curvedDartControlAngle * 2
    ) {
      dart = new part.Path().move(dartLeft).line(dartBottom).line(dartRight).hide()
    } else {
      const dartBottomCp2 = dartBottom
        .shiftFractionTowards(dartMiddle, options.curvedDartBottomControlOffset)
        .rotate(options.curvedDartControlAngle, dartBottom)
      const dartBottomCp1 = dartBottom
        .shiftFractionTowards(dartMiddle, options.curvedDartBottomControlOffset)
        .rotate(360 - options.curvedDartControlAngle, dartBottom)
      const dartLeftCp1 = dartLeft.shiftFractionTowards(
        dartBottom,
        options.curvedDartTopControlOffset
      )
      const dartRightCp2 = dartRight.shiftFractionTowards(
        dartBottom,
        options.curvedDartTopControlOffset
      )

      dart = new part.Path()
        .move(dartLeft)
        .curve(dartLeftCp1, dartBottomCp2, dartBottom)
        .curve(dartBottomCp1, dartRightCp2, dartRight)
        .hide()
    }
  } else {
    dart = new part.Path().move(dartLeft).line(dartBottom).line(dartRight).hide()
  }

  if (addFoldPath) {
    const dartFarLeft = dartMiddle.shiftFractionTowards(dartLeft, 2)
    const dartFarRight = dartMiddle.shiftFractionTowards(dartRight, 2)

    const dartFarLeftInt = curveLeftOfDart.intersectsBeam(dartBottom, dartFarLeft)[0]
    const dartFarRightInt = curveRightOfDart.intersectsBeam(dartBottom, dartFarRight)[0]

    if (dartFarLeftInt !== undefined) {
      part.paths['dartFoldLeft'] = curveLeftOfDart.split(dartFarLeftInt)[1]

      macro('mirror', {
        clone: false,
        mirror: [dartBottom, dartLeft],
        paths: ['dartFoldLeft'],
      })
      saPath = part.paths['dartFoldLeft'].reverse().hide()
      delete part.paths['dartFoldLeft']
    }
    if (dartFarRightInt !== undefined) {
      part.paths['dartFoldRight'] = curveRightOfDart.split(dartFarRightInt)[0]

      macro('mirror', {
        clone: false,
        mirror: [dartBottom, dartRight],
        paths: ['dartFoldRight'],
      })

      if (dartFarLeftInt !== undefined) {
        saPath = saPath.join(part.paths['dartFoldRight'].reverse()).hide()
      } else {
        saPath = part.paths['dartFoldRight'].reverse().hide()
      }
      delete part.paths['dartFoldRight']
    }
  }

  const curveWithDart = {
    left: curveLeftOfDart,
    dart: dart,
    right: curveRightOfDart,
    sa: saPath,
  }

  return curveWithDart
}
