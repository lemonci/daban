import { frontPocket } from './frontpocket.mjs'
import { J, dim } from './shared.mjs'

export const frontPocketFacing = {
  name: 'crux.frontpocketfacing',
  from: frontPocket,
  options: {},
  draft: ({ options, points, Path, paths, sa, store, macro, part }) => {
    const facingOffset =
      (sa
        ? Math.min(sa * 4, points.fpL.x - points.frontPocketTopLeft.x)
        : points.fpL.x - points.frontPocketTopLeft.x) * -1

    paths.frontPocketSeam.hide()

    if (options.frontPocketType === 'standard' || options.frontPocketType === 'square') {
      paths.frontPocketOpeningFacing = paths.frontPocketOpening.offset(facingOffset * -1)

      let intersects = paths.frontPocketSeam.intersects(paths.frontPocketOpeningFacing)

      if (intersects.length > 0) {
        paths.frontPocketOpeningFacing = paths.frontPocketOpeningFacing
          .split(intersects[0])[1]
          .hide()
      }
      if (intersects.length > 1) {
        paths.frontPocketOpeningFacing = paths.frontPocketOpeningFacing
          .split(intersects[intersects.length - 1])[0]
          .hide()
      }

      points.fpof0 = paths.frontPocketOpeningFacing.start().clone()
      points.fpof1 = paths.frontPocketOpeningFacing.end().clone()

      paths.frontPocketOpeningFacing.unhide().addText('Finish', 'center text-sm')
      paths.frontPocketFacing = new Path()
        .move(points.fpof0)
        .join(paths.frontPocketOpeningFacing)
        .line(points.frontPocketOpeningSideSeam)
        .join(paths.frontPocketOpening.reverse())
        .line(points.fpof0)
        .close()
    } else {
      paths.frontPocketFacing = paths.frontPocketOpening
        .reverse()
        .offset(facingOffset)
        .reverse()
        .close()

      paths.frontPocketOpening.unhide()
      if (options.frontPocketInside) {
        paths.frontPocketOpeningSA = paths.frontPocketOpening
          .reverse()
          .offset(sa)
          .attr('class', 'fabric sa')
      }
    }

    if (sa) {
      paths.sa = paths.frontPocketFacing.offset(sa).attr('class', 'fabric sa')
    }

    points.gridAnchor = points.frontPocketTopLeft.clone()

    store.cutlist.addCut({ cut: 2, from: 'fabric' })

    points.title = points.fpL
      .shiftFractionTowards(points.fpB, 0.5)
      .shift(
        225,
        points.fpL.dist(points.fpB) * (options.frontPocketType === 'diamond' ? 0.15 : 0.35)
      )
    macro('title', {
      nr: 5,
      at: points.title,
      title: 'frontpocketfacing',
      align: 'center',
      scale: options.frontPocketType === 'diamond' ? 0.15 : 0.25,
      rotation: 40,
    })
    macro('rmgrainline')
    macro('rmahd')
    macro('rmavd')

    switch (options.frontPocketType) {
      case 'standard':
        points.frontFacingLeftEdge = paths.frontPocketOpeningFacing.edge('left')
        points.frontFacingBottomEdge = paths.frontPocketOpeningFacing.edge('bottom')
        dim(part, [['h', 'frontFacingLeftEdge', 'fpof1', 'frontPocketTopLeft', -35]])
        dim(part, [
          ['h', 'frontFacingLeftEdge', 'frontPocketOpeningSideSeam', 'frontPocketTopLeft', -25],
          ['h', 'frontFacingLeftEdge', 'frontFacingBottomEdge', 'frontFacingBottomEdge', 15],
          ['h', 'frontFacingLeftEdge', 'frontPocketTopMiddle', 'frontPocketTopLeft', -15],
          ['v', 'frontFacingBottomEdge', 'fpB', 'fpB', 20],
          ['v', 'frontFacingBottomEdge', 'fpof0', 'frontPocketTopLeft', -25],
          ['v', 'frontFacingBottomEdge', 'frontFacingLeftEdge', 'frontPocketTopLeft', -15],
        ])

        break
      case 'hole':
      case 'diamond':
        points.frontFacingLeftEdge = paths.frontPocketFacing.edge('left')
        points.frontFacingRightEdge = paths.frontPocketFacing.edge('right')
        points.frontFacingTopEdge = paths.frontPocketFacing.edge('top')
        points.frontFacingBottomEdge = paths.frontPocketFacing.edge('bottom')
        dim(part, [
          ['h', 'fpL', 'fpR', 'frontFacingTopEdge', -15],
          ['h', 'frontFacingLeftEdge', 'frontFacingRightEdge', 'frontFacingTopEdge', -25],
          ['v', 'fpB', 'fpT', 'frontFacingRightEdge', 15],
          ['v', 'frontFacingBottomEdge', 'frontFacingTopEdge', 'frontFacingRightEdge', 25],
        ])
        break
      case 'square':
        dim(part, [
          ['h', 'fpof0', 'frontPocketOpeningSideSeamCp', 'fpof0', -25],
          ['h', 'fpof0', 'frontPocketTopMiddle', 'fpof0', -15],
          ['v', 'fpof1', 'fpB', 'fpof1', 15],
          ['v', 'fpof1', 'fpof0', 'fpof0', -15],
        ])

        break
    }

    return part
  },
}
