import { backPocket } from './backpocket.mjs'
import { dim } from './shared.mjs'

export const backPocketCargo = {
  name: 'crux.backpocketcargo',
  after: [backPocket],
  options: {},
  draft: ({ options, Point, points, Path, paths, sa, store, measurements, macro, part }) => {
    if (!options.backPocketCargo) {
      return part.hide()
    }

    const cargoLength = store.get('backPocketSeamCargoLength')
    const cargoWidth = measurements.waistToFloor * options.backPocketCargoWidth

    points.top = new Point(0, 0)
    points.topLeft = points.top.shift(270, cargoWidth * 2).shift(180, cargoWidth * 0.5)
    points.topRight = points.top.shift(270, cargoWidth * 2).shift(0, cargoWidth * 0.5)
    points.topCpDownLeft = points.top.shift(270, cargoWidth * 0.5).shift(180, cargoWidth * 0.5)
    points.topCpDownRight = points.top.shift(270, cargoWidth * 0.5).shift(0, cargoWidth * 0.5)

    points.bottom = points.top.shift(270, cargoLength)

    let iteration = 0,
      diff = 0

    do {
      points.bottom = points.bottom.shift(90, diff)
      points.bottomLeft = points.bottom.shift(90, cargoWidth * 2).shift(180, cargoWidth * 0.5)
      points.bottomCpUpLeft = points.bottom.shift(90, cargoWidth * 0.5).shift(180, cargoWidth * 0.5)

      paths.left = new Path()
        .move(points.top)
        .curve(points.top, points.topCpDownLeft, points.topLeft)
        .line(points.bottomLeft)
        .curve(points.bottomCpUpLeft, points.bottom, points.bottom)

      diff = paths.left.length() - cargoLength
    } while (iteration < 100 && (diff > 0.1 || diff < -0.1))
    if (iteration >= 100) {
      log.error('Could not create the cargo strip')
    }

    points.bottomRight = points.bottom.shift(90, cargoWidth * 2).shift(0, cargoWidth * 0.5)
    points.bottomCpUpRight = points.bottom.shift(90, cargoWidth * 0.5).shift(0, cargoWidth * 0.5)

    paths.right = new Path()
      .move(points.bottom)
      .curve(points.bottom, points.bottomCpUpRight, points.bottomRight)
      .line(points.topRight)
      .curve(points.topCpDownRight, points.top, points.top)

    paths.seam = paths.left.join(paths.right).close()

    store.cutlist.addCut({ cut: 2, from: 'fabric' })

    points.logo = points.top.shiftFractionTowards(points.bottom, 0.45)

    points.title = points.logo.clone()
    macro('title', {
      nr: 9,
      at: points.title,
      title: 'backpocketcargo',
      align: 'center',
      scale: 0.25,
      rotation: 90,
      classes: { nr: 'text-xl note font-bold' },
    })

    if (sa) {
      paths.sa = paths.seam.offset(sa).attr('class', 'fabric sa')
    }

    dim(part, [
      ['h', 'topLeft', 'topRight', 'top', -15],
      ['v', 'bottom', 'top', 'topRight', 15],
    ])

    return part
  },
}
