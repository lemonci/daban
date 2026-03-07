export const J = (o) => JSON.parse(JSON.stringify(o))

export function dim(part, d) {
  let { macro, points, sa } = part.shorthand()

  d.forEach((e) => {
    const id = e[0] + e[1] + e[2]
    const s = sa * (e[4] > 0 ? 1 : -1)
    macro(e[0] + 'd', {
      id: id,
      from: points[e[1]],
      to: points[e[2]],
      y: points[e[3]].y + s + e[4],
      x: points[e[3]].x + s + e[4],
      d: s + e[4],
    })
  })
}

export function pointOnPath(part, path, point) {
  const { utils } = part.shorthand()

  let lastPoint = path.ops[0].to
  for (const o of path.ops) {
    switch (o.type) {
      case 'line':
        if (utils.pointOnLine(lastPoint, o.to, point)) return true
        break
      case 'curve':
        if (utils.pointOnCurve(lastPoint, o.cp1, o.cp2, o.to, point)) return true
        break
    }
    lastPoint = o.to
  }
  return false
}

export function createBackPocketSeams(part) {
  const { Path, points, paths, store, sa } = part.shorthand()

  const segments = store.get('backPocketSegments')
  let pocketSegment = -1
  for (let i = 0; i < segments.length; i++) {
    const segmentBottomY = segments[i].parent.edge('bottom').y.toFixed(0)
    if (
      segments[i].inside &&
      segmentBottomY >= points.backPocketBottomLeft.y.toFixed(0) &&
      segmentBottomY <= points.backPocketBottomRight.y.toFixed(0)
    ) {
      pocketSegment = i
    }
  }

  if (segments.length == 1 && segments[0].inside == true) {
    paths.backPocketSeam = segments[0].parent.close().hide()
    paths.backPocketOpening = segments[0].path.close().hide()
    paths.backPocketFacing = paths.backPocketOpening.clone().hide()
    paths.backPocketFacingOutside = paths.backPocketFacing.offset(Math.max(20, sa * 4)).hide()
  } else {
    if (pocketSegment > -1) {
      points.waistSeamBackStart = segments[pocketSegment].path.start()
      points.backPocketBackOpeningSeam = segments[pocketSegment].parent.end()
      paths.backPocketOpeningSeam = segments[pocketSegment].path.clone().reverse().hide()

      paths.backPocketSeamMarker = segments[pocketSegment].parent.clone().hide()
      paths.backPocketSeam = segments[pocketSegment].parent
        .join(segments[pocketSegment].path.reverse())
        .close()
        .hide()

      paths.backPocketFacingCurve1 = segments[pocketSegment].path.reverse().hide()
      paths.backPocketFacingCurve2 = segments[pocketSegment].path
        .offset(Math.max(20, sa * 4))
        .hide()

      points.backPocketFacingLeft = segments[pocketSegment].parent.intersects(
        paths.backPocketFacingCurve2
      )[0]

      const pTempLeft = paths.backPocketFacingCurve2
        .start()
        .shift(
          paths.backPocketFacingCurve2.angleAt(paths.backPocketFacingCurve2.start()) + 180,
          200
        )
      points.pTempLeft = pTempLeft.clone()

      const pTempRight = paths.backPocketFacingCurve2
        .end()
        .shift(paths.backPocketFacingCurve2.angleAt(paths.backPocketFacingCurve2.end()), 200)
      points.pTempRight = pTempRight.clone()

      paths.backPocketFacingCurve2 = new Path()
        .move(pTempLeft)
        .line(paths.backPocketFacingCurve2.start())
        .join(paths.backPocketFacingCurve2)
        .line(pTempRight)
      const backPocketFacingRightInt = segments[pocketSegment].parent.intersects(
        paths.backPocketFacingCurve2
      )
      points.backPocketFacingRight = backPocketFacingRightInt[backPocketFacingRightInt.length - 1]
      paths.backPocketFacingCurve2 = paths.backPocketFacingCurve2.split(
        points.backPocketFacingLeft
      )[1]

      const backPocketFacingCurve2Split = paths.backPocketFacingCurve2.split(
        points.backPocketFacingRight
      )

      if (backPocketFacingCurve2Split[0] === null)
        paths.backPocketFacingCurve2 = backPocketFacingCurve2Split[1].hide()
      else paths.backPocketFacingCurve2 = backPocketFacingCurve2Split[0].hide()

      paths.backPocketFacing = paths.backPocketFacingCurve2
        .clone()
        .line(paths.backPocketFacingCurve1.start())
        .join(paths.backPocketFacingCurve1)
        .line(paths.backPocketFacingCurve2.start())
        .close()

      delete paths['pocketOpening']
      delete paths['pocketFacingOutside']
    }
  }
}

export function createPathSegments(path, intersections) {
  if (path.ops[path.ops.length - 1].type == 'close') {
    path.ops.pop(path.ops[path.ops.length - 1])
  }

  const segments = []
  segments.push(path)
  if (intersections.length > 1) {
    intersections.forEach((i) => {
      const newSegments = []
      while (segments.length > 0) {
        const s = segments.pop()
        if (s && s.angleAt(i)) {
          const splits = s.split(i)
          newSegments.push(splits[0])
          newSegments.push(splits[1])
        } else {
          newSegments.push(s)
        }
      }
      newSegments.forEach((s) => {
        segments.push(s)
      })
    })
  }

  const pFrom = path.ops[0].to
  const pTo = path.ops[path.ops.length - (path.ops[path.ops.length - 1].type == 'close' ? 2 : 1)].to

  if (segments.length > 1) {
    const newSegments = []
    while (segments.length > 0) {
      const s1 = segments.pop()

      if (
        s1 &&
        s1.ops[0].to.x.toFixed(2) == pFrom.x.toFixed(2) &&
        s1.ops[0].to.y.toFixed(2) == pFrom.y.toFixed(2)
      ) {
        while (segments.length > 0) {
          const s2 = segments.pop()
          if (
            s2 &&
            s2.ops[s2.ops.length - 1].to.x.toFixed(2) == pTo.x.toFixed(2) &&
            s2.ops[s2.ops.length - 1].to.y.toFixed(2) == pTo.y.toFixed(2)
          ) {
            newSegments.push(s2.join(s1))
          } else {
            newSegments.push(s2)
          }
        }
      } else {
        newSegments.push(s1)
      }
    }
    newSegments.forEach((s) => {
      segments.push(s)
    })
  }
  return segments
}

export function pathsInsidePath(parent, path) {
  const segmentsPath = createPathSegments(path, parent.intersects(path))
  const segmentsParent = createPathSegments(parent, path.intersects(parent))

  const segmentPairs = []
  if (segmentsParent.length == 1 && segmentsPath.length == 1) {
    segmentPairs.push({ parent: segmentsParent[0], path: segmentsPath[0] })
  } else {
    segmentsParent.forEach((s1) => {
      if (s1) {
        const from1 = s1.ops[0].to
        const to1 = s1.ops[s1.ops.length - 1].to
        segmentsPath.forEach((s2) => {
          if (s2) {
            const from2 = s2.ops[0].to
            const to2 = s2.ops[s2.ops.length - 1].to
            if (
              (from1.x.toFixed(2) == from2.x.toFixed(2) &&
                from1.y.toFixed(2) == from2.y.toFixed(2)) ||
              (to1.x.toFixed(2) == to2.x.toFixed(2) && to1.y.toFixed(2) == to2.y.toFixed(2))
            ) {
              segmentPairs.push({ parent: s1, path: s2 })
            }
          }
        })
      }
    })
  }

  segmentPairs.forEach((s) => {
    const tl = s.parent.edge('topLeft')
    const t = Math.round(tl.y * 10)
    const l = Math.round(tl.x * 10)
    const br = s.parent.edge('bottomRight')
    const b = Math.round(br.y * 10)
    const r = Math.round(br.x * 10)
    const stl = s.path.edge('topLeft')
    const st = Math.round(stl.y * 10)
    const sl = Math.round(stl.x * 10)
    const sbr = s.path.edge('bottomRight')
    const sb = Math.round(sbr.y * 10)
    const sr = Math.round(sbr.x * 10)
    s.inside = b >= sb && t <= st && r >= sr && l <= sl
  })

  return segmentPairs
}

export function createOvalPoint(
  points,
  name,
  angle,
  middle,
  pocketWidth,
  pocketOpening,
  pocketOpeningAspect
) {
  points[name] = middle.shift(
    angle,
    pocketWidth *
      pocketOpening *
      ((angle > 60 && angle < 120) || (angle > 240 && angle < 300)
        ? 1 + (pocketOpeningAspect < 0 ? pocketOpeningAspect * -1 : 0)
        : 1 + (pocketOpeningAspect > 0 ? pocketOpeningAspect : 0))
  )
}
export function createOvalControlPoint(
  points,
  name,
  parent,
  angle,
  mycbqc,
  pocketWidth,
  pocketOpening,
  pocketOpeningAspect
) {
  points[name] = points[parent].shift(
    angle,
    pocketWidth *
      pocketOpening *
      mycbqc *
      ((angle > 60 && angle < 120) || (angle > 240 && angle < 300)
        ? 1 + (pocketOpeningAspect < 0 ? pocketOpeningAspect * -1 : 0)
        : 1 + (pocketOpeningAspect > 0 ? pocketOpeningAspect : 0))
  )
}

export function createFrontPocketOpening(
  part,
  pocketWidth,
  mycbqc,
  oFrontPocketOpening,
  oFrontPocketOpeningOffset,
  oFrontPocketOpeningAspect
) {
  const { points } = part.shorthand()

  points.fpM = points.frontWaistSide.shift(225, pocketWidth * oFrontPocketOpeningOffset)

  createOvalPoint(
    points,
    'fpT',
    90,
    points.fpM,
    pocketWidth,
    oFrontPocketOpening,
    oFrontPocketOpeningAspect
  )
  createOvalPoint(
    points,
    'fpB',
    270,
    points.fpM,
    pocketWidth,
    oFrontPocketOpening,
    oFrontPocketOpeningAspect
  )
  createOvalPoint(
    points,
    'fpL',
    180,
    points.fpM,
    pocketWidth,
    oFrontPocketOpening,
    oFrontPocketOpeningAspect
  )
  createOvalPoint(
    points,
    'fpR',
    0,
    points.fpM,
    pocketWidth,
    oFrontPocketOpening,
    oFrontPocketOpeningAspect
  )
  createOvalControlPoint(
    points,
    'fpT2R',
    'fpT',
    0,
    mycbqc,
    pocketWidth,
    oFrontPocketOpening,
    oFrontPocketOpeningAspect
  )
  createOvalControlPoint(
    points,
    'fpT2L',
    'fpT',
    180,
    mycbqc,
    pocketWidth,
    oFrontPocketOpening,
    oFrontPocketOpeningAspect
  )
  createOvalControlPoint(
    points,
    'fpB2R',
    'fpB',
    0,
    mycbqc,
    pocketWidth,
    oFrontPocketOpening,
    oFrontPocketOpeningAspect
  )
  createOvalControlPoint(
    points,
    'fpB2L',
    'fpB',
    180,
    mycbqc,
    pocketWidth,
    oFrontPocketOpening,
    oFrontPocketOpeningAspect
  )
  createOvalControlPoint(
    points,
    'fpR2T',
    'fpR',
    90,
    mycbqc,
    pocketWidth,
    oFrontPocketOpening,
    oFrontPocketOpeningAspect
  )
  createOvalControlPoint(
    points,
    'fpR2B',
    'fpR',
    270,
    mycbqc,
    pocketWidth,
    oFrontPocketOpening,
    oFrontPocketOpeningAspect
  )
  createOvalControlPoint(
    points,
    'fpL2T',
    'fpL',
    90,
    mycbqc,
    pocketWidth,
    oFrontPocketOpening,
    oFrontPocketOpeningAspect
  )
  createOvalControlPoint(
    points,
    'fpL2B',
    'fpL',
    270,
    mycbqc,
    pocketWidth,
    oFrontPocketOpening,
    oFrontPocketOpeningAspect
  )
}

export function createBackPocketOpening(
  part,
  angle,
  pocketWidth,
  mycbqc,
  oBackPocketOpening,
  oBackPocketOpeningOffset,
  oBackPocketOpeningAspect
) {
  const { Path, points, paths } = part.shorthand()

  points.bpM = points.backPocketTopMiddle.shift(angle + 90, pocketWidth * oBackPocketOpeningOffset)

  oBackPocketOpeningOffset *= 0.95

  createOvalPoint(
    points,
    'bpT',
    angle - 90,
    points.bpM,
    pocketWidth,
    oBackPocketOpening,
    oBackPocketOpeningAspect
  )
  createOvalPoint(
    points,
    'bpB',
    angle + 90,
    points.bpM,
    pocketWidth,
    oBackPocketOpening,
    oBackPocketOpeningAspect
  )
  createOvalPoint(
    points,
    'bpL',
    angle,
    points.bpM,
    pocketWidth,
    oBackPocketOpening,
    oBackPocketOpeningAspect
  )
  createOvalPoint(
    points,
    'bpR',
    angle + 180,
    points.bpM,
    pocketWidth,
    oBackPocketOpening,
    oBackPocketOpeningAspect
  )
  createOvalControlPoint(
    points,
    'bpT2R',
    'bpT',
    angle + 180,
    mycbqc,
    pocketWidth,
    oBackPocketOpening,
    oBackPocketOpeningAspect
  )
  createOvalControlPoint(
    points,
    'bpT2L',
    'bpT',
    angle,
    mycbqc,
    pocketWidth,
    oBackPocketOpening,
    oBackPocketOpeningAspect
  )
  createOvalControlPoint(
    points,
    'bpB2R',
    'bpB',
    angle + 180,
    mycbqc,
    pocketWidth,
    oBackPocketOpening,
    oBackPocketOpeningAspect
  )
  createOvalControlPoint(
    points,
    'bpB2L',
    'bpB',
    angle,
    mycbqc,
    pocketWidth,
    oBackPocketOpening,
    oBackPocketOpeningAspect
  )
  createOvalControlPoint(
    points,
    'bpR2T',
    'bpR',
    angle - 90,
    mycbqc,
    pocketWidth,
    oBackPocketOpening,
    oBackPocketOpeningAspect
  )
  createOvalControlPoint(
    points,
    'bpR2B',
    'bpR',
    angle + 90,
    mycbqc,
    pocketWidth,
    oBackPocketOpening,
    oBackPocketOpeningAspect
  )
  createOvalControlPoint(
    points,
    'bpL2T',
    'bpL',
    angle - 90,
    mycbqc,
    pocketWidth,
    oBackPocketOpening,
    oBackPocketOpeningAspect
  )
  createOvalControlPoint(
    points,
    'bpL2B',
    'bpL',
    angle + 90,
    mycbqc,
    pocketWidth,
    oBackPocketOpening,
    oBackPocketOpeningAspect
  )

  paths.backPocketOpening = new Path()
    .move(points.bpT)
    .curve(points.bpT2L, points.bpL2T, points.bpL)
    .curve(points.bpL2B, points.bpB2L, points.bpB)
    .curve(points.bpB2R, points.bpR2B, points.bpR)
    .curve(points.bpR2T, points.bpT2R, points.bpT)
    .hide()
}

export const backPocketPresets = {
  standard: {
    backPocketWidth: 0.15,
    backPocketHeight: 0.42,
    backPocketCurve: 0.52,
    backPocketOpening: 0.4,
    backPocketOpeningSquareness: 0.0,
    backPocketOpeningAspect: -0.6,
    backPocketOpeningOffset: 0.15,
  },
  hole: {
    backPocketWidth: 0.15,
    backPocketHeight: 0.4,
    backPocketCurve: 0.52,
    backPocketOpening: 0.23,
    backPocketOpeningSquareness: 0.0,
    backPocketOpeningAspect: 0.85,
    backPocketOpeningOffset: 0.4,
  },
  square: {
    backPocketWidth: 0.15,
    backPocketHeight: 0.4,
    backPocketCurve: 0.0,
    backPocketOpening: 0.9,
    backPocketOpeningSquareness: 0.0,
    backPocketOpeningAspect: 3,
    backPocketOpeningOffset: -0.5,
  },
  diamond: {
    backPocketWidth: 0.15,
    backPocketHeight: 0.35,
    backPocketCurve: 0.04,
    backPocketOpening: 0.23,
    backPocketOpeningSquareness: 0.72,
    backPocketOpeningAspect: 0.8,
    backPocketOpeningOffset: 0.4,
  },
}
export const frontPocketPresets = {
  standard: {
    frontPocketWidth: 0.18,
    frontPocketHeight: 0.44,
    frontPocketCurve: 0.52,
    frontPocketOpening: 0.3,
    frontPocketOpeningSquareness: 0.0,
    frontPocketOpeningAspect: 0.4,
    frontPocketOpeningOffset: 0.34,
  },
  hole: {
    frontPocketWidth: 0.18,
    frontPocketHeight: 0.44,
    frontPocketCurve: 0.52,
    frontPocketOpening: 0.25,
    frontPocketOpeningSquareness: 0.0,
    frontPocketOpeningAspect: 0.4,
    frontPocketOpeningOffset: 0.45,
  },
  square: {
    frontPocketWidth: 0.18,
    frontPocketHeight: 0.48,
    frontPocketCurve: 0.0,
    frontPocketOpening: 0.45,
    frontPocketOpeningSquareness: 0.0,
    frontPocketOpeningAspect: 0.35,
    frontPocketOpeningOffset: 0.0,
  },
  diamond: {
    frontPocketWidth: 0.18,
    frontPocketHeight: 0.45,
    frontPocketCurve: 0.04,
    frontPocketOpening: 0.245,
    frontPocketOpeningSquareness: 0.72,
    frontPocketOpeningAspect: 0.6,
    frontPocketOpeningOffset: 0.5,
  },
}
