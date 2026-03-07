import { frontPocketPoints } from './frontpocketpoints.mjs'
import { J, dim } from './shared.mjs'

export const frontPocket = {
  name: 'crux.frontpocket',
  from: frontPocketPoints,
  options: {},
  draft: ({ options, points, paths, sa, store, macro, log, part }) => {
    if (options.frontPocketInside) {
      if (options.frontPocketType === 'standard' || options.frontPocketType === 'square') {
        paths.frontPocketSeam = paths.frontPocketSeam
          .join(paths.sideSeamFrontUpper)
          .join(paths.waistSeamFrontOutside)
      }
    } else {
      if (options.frontPocketType === 'standard' || options.frontPocketType === 'square') {
        paths.frontPocketSeam = paths.frontPocketSeam.join(paths.frontPocketOpening.reverse())
      } else {
        paths.frontPocketOpening.unhide()
      }
    }
    paths.frontPocketSeam.unhide().close()
    if (paths.frontPocketSeam === undefined) {
      log.error('Pocket seam is missing!')

      return part.hide()
    }

    points.gridAnchor = points.frontPocketTopLeft.clone()

    store.cutlist.addCut({ cut: 2, from: 'fabric' })

    points.logo = points.frontPocketTopLeft
      .shiftFractionTowards(points.frontPocketBottomRight, 0.6)
      .shiftFractionTowards(points.frontPocketBottomRightLeft, 0.5)

    points.title = points.logo.clone()
    macro('title', {
      nr: 4,
      at: points.title,
      title: 'frontpocket',
      align: 'center',
      scale: 0.5,
      // rotation: 90,
    })

    macro('grainline', {
      from: points.frontPocketBottomLeftUp.shift(0, 10),
      to: points.frontPocketTopLeft.shift(0, 10),
    })

    if (sa) {
      paths.sa = paths.frontPocketSeam.offset(sa).attr('class', 'fabric sa')
      if (options.frontPocketInside == false) {
        paths.frontPocketOpeningSA = paths.frontPocketOpening
          .reverse()
          .offset(sa)
          .attr('class', 'fabric sa')
      }
    }

    switch (options.frontPocketType) {
      case 'standard':
        dim(part, [
          ['h', 'frontPocketTopLeft', 'frontPocketOpeningSideSeam', 'frontPocketTopLeft', -35],
        ])
      case 'hole':
      case 'diamond':
        dim(part, [
          ['h', 'frontPocketTopLeft', 'frontPocketBottomRight', 'frontPocketTopLeft', -25],
          [
            'h',
            'frontPocketBottomLeftUp',
            'frontPocketBottomLeftRight',
            'frontPocketBottomRightLeft',
            15,
          ],
          ['h', 'frontPocketTopLeft', 'frontPocketTopMiddle', 'frontPocketTopLeft', -15],
          ['v', 'frontPocketBottomRightLeft', 'frontPocketTopLeft', 'frontPocketTopLeft', -25],
          ['v', 'frontPocketBottomRightLeft', 'frontPocketBottomLeftUp', 'frontPocketTopLeft', -15],
        ])

        if (options.frontPocketInside === false) {
          dim(part, [['v', 'frontPocketBottomRightLeft', 'fpB', 'fpB', 20]])
        }
        break
      case 'square':
        dim(part, [
          ['h', 'frontPocketTopLeft', 'frontPocketBottomRight', 'frontPocketTopLeft', -25],
          ['h', 'frontPocketTopLeft', 'frontPocketTopMiddle', 'frontPocketTopLeft', -15],
          ['v', 'frontPocketBottomRightLeft', 'fpB', 'fpB', 40],
          ['v', 'frontPocketBottomLeftRight', 'frontPocketTopLeft', 'frontPocketTopLeft', -15],
        ])

        break
    }

    return part
  },
}
