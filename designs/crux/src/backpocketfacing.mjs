import { backPocket } from './backpocket.mjs'
import { dim } from './shared.mjs'

export const backPocketFacing = {
  name: 'crux.backpocketfacing',
  from: backPocket,
  options: {},
  draft: ({ options, points, Path, paths, snippets, sa, store, macro, part }) => {
    if (options.backPocketType === 'square') {
      return part.hide()
    }

    const facingOffset =
      (sa
        ? Math.min(sa * 4, points.bpL.x - points.backPocketTopLeft.x)
        : points.bpL.x - points.backPocketTopLeft.x) * -1

    if (options.backPocketType === 'standard') {
      paths.facingOpening = new Path()
        .move(points.bpR)
        .curve(points.bpR2B, points.bpB2R, points.bpB)
        .curve(points.bpB2L, points.bpL2B, points.bpL)
        .hide()

      paths.openingOffset = paths.facingOpening
        .offset(facingOffset)
        .reverse()
        .addText('Finish', 'center text-sm')
      paths.backPocketFacing = paths.waistSeamPocketPartRight
        .clone()
        .join(paths.opening)
        .join(paths.waistSeamPocketPartLeft)
        .join(paths.openingOffset)
        .line(paths.waistSeamPocketPartRight.start())
        .close()
    } else {
      paths.openingOffset = paths.opening.clone().offset(facingOffset).reverse()

      paths.backPocketFacing = paths.opening
        .clone()
        .line(paths.openingOffset.start())
        .join(paths.openingOffset)
        .line(paths.opening.start())
        .close()
    }
    paths.backPocketSeam.hide()
    paths.waistSeamPocketPartLeft.hide()
    paths.waistSeamPocketPartRight.hide()
    delete snippets['backPocketTopLeft']
    delete snippets['backPocketTopRight']
    delete snippets['backPocketBottomMiddle']

    if (sa) {
      paths.sa = paths.backPocketFacing.offset(sa).attr('class', 'fabric sa')
    }

    macro('rmgrainline')
    macro('rmahd')
    macro('rmavd')

    if (sa) {
      paths.backPocketFacingSA = paths.backPocketFacing.offset(sa).attr('class', 'fabric sa')
    }

    points.gridAnchor = points.backPocketTopLeft.clone()

    store.cutlist.addCut({ cut: 2, from: 'fabric' })

    points.title = points.bpB.shift(270, 5)
    macro('title', {
      nr: 8,
      at: points.title,
      title: 'backpocketfacing',
      align: 'center',
      scale: 0.25,
      classes: { nr: 'text-xl note font-bold' },
    })

    if (options.backPocketType !== 'square') {
      points.bpOstart = paths.opening.start()
      points.bpOstop = paths.opening.end()
      points.offBottom = paths.openingOffset.edge('bottom')

      dim(part, [
        ['h', 'backPocketTopLeft', 'backPocketTopRight', 'backPocketTopRight', -25],
        ['h', 'bpOstop', 'bpOstart', 'bpOstop', -15],
        ['v', 'offBottom', 'backPocketTopRight', 'backPocketTopRight', 15],
      ])
    }

    return part
  },
}
