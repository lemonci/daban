import { front } from './front.mjs'

export const pocket = {
  name: 'shale.pocket',
  from: front,
  measurements: [],
  optionalMeasurements: [],
  options: {
    pocket: {
      dflt: 'patch',
      list: ['none', 'patch', 'inset'],
      menu: (settings, mergedOptions) => (mergedOptions.splitParts ? 'construction' : false),
    },
  },
  draft: ({ points, paths, macro, snippets, options, part, store, sa, expand }) => {
    if (options.pocket === 'none' || !options.splitParts || !expand) {
      return part.hide()
    }
    paths.seamFront.hide()
    paths.pocketSeam.unhide().setClass('fabric')

    if (sa) {
      delete paths.sa
      paths.pocketSa.unhide().setClass('fabric sa')
    }
    delete paths.legFold

    macro('grainline', {
      from: points.grainlineTop,
      to: points.grainlineBottom,
    })

    if (options.pocket === 'inset') {
      store.cutlist.removeCut('fabric')
      paths.pocketSeam.setClass('lining')
      if (sa) {
        paths.pocketSa.setClass('lining sa')
      }
    }
    store.cutlist.addCut({ cut: 2, from: 'lining' })

    points.title = points.pocketTopRight.shiftFractionTowards(points.grainlineBottom, 0.5)
    macro('title', {
      at: points.title,
      nr: 5,
      title: options.pocket === 'path' ? 'pocket' : 'pocket-lining',
      scale: 0.5,
    })

    macro('rmad')

    macro('hd', {
      id: 'width_pocket_bottom',
      from: points.pocketBottomLeft,
      to: points.pocketBottomRight,
      y: points.pocketBottomRight.y + 15,
    })
    macro('hd', {
      id: 'width_pocket_top',
      from: points.pocketTopLeft,
      to: points.pocketTopRight,
      y: points.pocketTopRight.y - 15,
    })
    macro('vd', {
      id: 'height_pocket',
      from: points.pocketTopLeft,
      to: points.pocketBottomLeft,
      x: points.pocketTopLeft.x - 15,
    })

    delete snippets.sideSplitOffset

    return part
  },
}
