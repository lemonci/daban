import { basepoints } from './basepoints.mjs'
import { dim } from './shared.mjs'

function adjustGussetSide(part, side, bottom, target, controlAngle, controlSide) {
  const { Path, points, paths, log } = part.shorthand()

  let iter = 0
  let diff = 0
  do {
    points[side + 'Cp'] = points[side].shift(controlAngle, controlSide)
    paths[side] = new Path()
      .move(points[bottom])
      .curve(points[bottom], points[side + 'Cp'], points[side])
      .hide()

    diff = target - paths[side].length()

    controlSide += diff * 0.7
    points[side] = points[side].shift(controlAngle + 180, diff * 0.3)
    // controlAngle = points[side1].angle(points[side2]) + 90

    iter++
  } while (iter < 100 && (diff > 0.1 || diff < -0.1))
  if (iter >= 100) {
    log.error('Could not find a point for "gussetTopRight" within 100 iterations')
  }
}

export const gusset = {
  name: 'crux.gusset',
  from: basepoints,
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
    const deltaX = points.gussetFrontLeg.x - points.gussetBackLeg.x
    const deltaY = points.gussetFrontLeg.y - points.gussetBackLeg.y

    points.gussetBackToP3cp = paths.gussetCrotchBack.ops[1].cp1
    points.gussetP3ToBackcp = paths.gussetCrotchBack.ops[1].cp2
    points.gussetP3ToBackLeg = paths.gussetLegBack.ops[1].cp1
    points.gussetBackLegToP3 = paths.gussetLegBack.ops[1].cp2

    paths.gussetB1 = new Path()
      .move(points.gussetBackLeg.copy())
      .curve(points.gussetBackLeg.copy(), points.gussetBackCp.copy(), points.gussetBack.copy())
      .curve(points.gussetBackToP3cp.copy(), points.gussetP3ToBackcp.copy(), points.p3.copy())
      .curve(
        points.gussetP3ToBackLeg.copy(),
        points.gussetBackLegToP3.copy(),
        points.gussetBackLeg.copy()
      )
      .close()
      .addClass('mark')
      .hide()

    paths.gussetF1 = new Path()
      .move(points.gussetFrontLeg)
      .curve(points.gussetFrontLeg, points.gussetFrontCp, points.gussetFront)
      .join(paths.gussetCrotchFront)
      .join(paths.gussetLegFront)
      .close()
      .addClass('various')
      .hide()

    macro('mirror', {
      clone: false,
      mirror: [points.gussetBackLeg, points.p3],
      points: [
        'gussetBackCp',
        'gussetBack',
        'gussetBackToP3cp',
        'gussetP3ToBackcp',
        'gussetP3ToBackLeg',
        'gussetBackLegToP3',
      ],
    })

    paths.gussetB2 = new Path()
      .move(points.gussetBackLeg)
      .curve(points.gussetBackLeg, points.gussetBackCp, points.gussetBack)
      .curve(points.gussetBackToP3cp, points.gussetP3ToBackcp, points.p3)
      .curve(points.gussetP3ToBackLeg, points.gussetBackLegToP3, points.gussetBackLeg)
      .close()
      .addClass('lining')
      .hide()

    macro('transform', {
      transform: 'translate',
      x: deltaX,
      y: deltaY,
      clone: false,
      points: [
        'p3',
        'gussetBackCp',
        'gussetBack',
        'gussetBackLeg',
        'gussetBackToP3cp',
        'gussetP3ToBackcp',
        'gussetP3ToBackLeg',
        'gussetBackLegToP3',
      ],
    })

    paths.gussetB3 = new Path()
      .move(points.gussetBackLeg.copy())
      .curve(points.gussetBackLeg.copy(), points.gussetBackCp.copy(), points.gussetBack.copy())
      .curve(points.gussetBackToP3cp.copy(), points.gussetP3ToBackcp.copy(), points.p3.copy())
      .curve(
        points.gussetP3ToBackLeg.copy(),
        points.gussetBackLegToP3.copy(),
        points.gussetBackLeg.copy()
      )
      .close()
      .addClass('canvas')
      .hide()

    const extraSpace =
      (paths.gussetCrotchFront.length() + paths.gussetCrotchBack.length()) *
      options.gussetExtraSpace
    const extraSpacePoint = points.pR.shiftTowards(points.gussetFront, extraSpace * -1)
    const rotateAngle1 =
      points.gussetBackLeg.angle(points.pR) - points.gussetBackLeg.angle(points.p3)
    const rotateAngle2 =
      points.gussetBackLeg.angle(points.pR) - points.gussetBackLeg.angle(extraSpacePoint)
    macro('transform', {
      transform: 'rotate',
      angle: rotateAngle1 - rotateAngle2,
      c: points.gussetBackLeg,
      clone: false,
      points: [
        'p3',
        'gussetBackCp',
        'gussetBack',
        'gussetBackLeg',
        'gussetBackToP3cp',
        'gussetP3ToBackcp',
        'gussetP3ToBackLeg',
        'gussetBackLegToP3',
      ],
    })

    points.gussetRight = points.gussetFront.copy()
    points.gussetLeft = points.gussetBack.copy()
    points.gussetBottom = points.gussetBackLeg.copy()

    const targetRight = paths.gussetFront.length()
    const targetLeft = paths.gussetBack.length()
    let controlRight = points.gussetRight.dist(points.gussetFrontCp)
    let controlLeft = points.gussetLeft.dist(points.gussetBackCp)
    let controlAngle = points.gussetRight.angle(points.gussetLeft) + 90

    adjustGussetSide(part, 'gussetRight', 'gussetBottom', targetRight, controlAngle, controlRight)
    controlAngle = points.gussetRight.angle(points.gussetLeft) + 90
    adjustGussetSide(part, 'gussetLeft', 'gussetBottom', targetLeft, controlAngle, controlLeft)

    macro('transform', {
      transform: 'rotate',
      angle: 270 - controlAngle,
      c: points.gussetBottom,
      clone: false,
      points: ['gussetRight', 'gussetRightCp', 'gussetLeft', 'gussetLeftCp'],
      paths: ['gussetLeft', 'gussetRight'],
    })

    macro('mirror', {
      clone: true,
      mirror: [points.gussetRight, points.gussetLeft],
      points: ['gussetBottom'],
      paths: ['gussetLeft', 'gussetRight'],
    })
    paths.mirroredGussetRight = paths.mirroredGussetRight.reverse().hide()
    paths.mirroredGussetLeft = paths.mirroredGussetLeft.reverse().hide()

    paths.seam = new Path()
      .move(points.gussetBottom)
      .join(paths.gussetRight)
      .join(paths.mirroredGussetRight)
      .join(paths.mirroredGussetLeft.reverse())
      .join(paths.gussetLeft.reverse())
      .close()

    points.gussetTopMiddle = points.gussetRight.shiftFractionTowards(points.gussetLeft, 0.5)
    const gussetWidth = points.gussetRight.dist(points.gussetLeft)
    points.gl1 = points.gussetTopMiddle.shift(45, gussetWidth * 0.5).shift(270, gussetWidth * 0.3)
    points.gl2 = points.gussetTopMiddle.shift(225, gussetWidth * 0.5).shift(270, gussetWidth * 0.3)

    paths.gussetLeft = paths.gussetLeft.reverse()
    paths.mirroredGussetLeft = paths.mirroredGussetLeft.reverse()

    if (complete) {
      paths.gussetRight.addText('front', 'center')
      paths.mirroredGussetRight.addText('front', 'center').unhide()
      paths.gussetLeft.addText('back', 'center')
      paths.mirroredGussetLeft.addText('back', 'center').unhide()
    }

    snippets.right = new Snippet('notch', points.gussetRight)
    snippets.left = new Snippet('notch', points.gussetLeft)
    snippets.top = new Snippet('notch', points.mirroredGussetBottom)
    snippets.bottom = new Snippet('notch', points.gussetBottom)

    points.gridAnchor = points.gussetRight.clone()

    store.cutlist.addCut({ cut: 1, from: 'fabric' })

    points.logo = points.gussetTopMiddle.clone()

    points.title = points.logo.shift(90, gussetWidth * 0.5)
    macro('title', {
      nr: 3,
      at: points.title,
      title: 'gusset',
      align: 'center',
      scale: 0.5,
      rotation: 90,
    })

    macro('grainline', {
      from: points.gl2,
      to: points.gl1,
    })

    if (sa) {
      paths.sa = paths.seam.offset(sa).attr('class', 'fabric sa')

      paths.sa = new Path()
        .move(points.gussetBottom.shiftOutwards(points.mirroredGussetBottom, sa * 2))
        .join(paths.mirroredGussetLeft.offset(sa))
        .join(paths.gussetLeft.offset(sa))
        .line(points.mirroredGussetBottom.shiftOutwards(points.gussetBottom, sa * 2))
        .join(paths.gussetRight.offset(sa))
        .join(paths.mirroredGussetRight.offset(sa))
        .close()
        .attr('class', 'fabric sa')
    }

    dim(part, [
      ['h', 'gussetLeft', 'mirroredGussetBottom', 'mirroredGussetBottom', -15],
      ['h', 'mirroredGussetBottom', 'gussetRight', 'mirroredGussetBottom', -15],
      ['v', 'gussetBottom', 'gussetRight', 'gussetRight', 15],
      ['v', 'gussetRight', 'mirroredGussetBottom', 'gussetRight', 15],
    ])

    return part
  },
}
