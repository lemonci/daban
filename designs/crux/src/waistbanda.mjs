import { waistband } from './waistband.mjs'
import { dim } from './shared.mjs'

export const waistbanda = {
  name: 'crux.waistbanda',
  after: waistband,
  draft: ({
    options,
    Path,
    Point,
    points,
    paths,
    sa,
    store,
    expand,
    units,
    measurements,
    macro,
    part,
  }) => {
    if (options.waistbandType !== 'ribknit') {
      return part.hide()
    }

    const flyWidth = store.get('flyWidth')
    const waistBandWidth = measurements.waistToFloor * options.waistBandWidth
    const frontWidth = Math.max(flyWidth, waistBandWidth)

    if (!expand) {
      // Expand is off, do not draw the part but flag this to the user
      store.flag.note({
        msg: `devon:cutWaistbanda`,
        replace: {
          width: units(waistBandWidth * 2),
          length: units(frontWidth),
        },
        suggest: {
          text: 'flag:show',
          icon: 'expand',
          update: {
            settings: ['expand', 1],
          },
        },
      })
      // Also hint about expand
      store.flag.preset('expand')

      return part.hide()
    }

    points.topLeft = new Point(0, 0)

    points.topMiddle = new Point(waistBandWidth, 0)
    points.topRight = new Point(waistBandWidth * 2, 0)
    points.bottomLeft = points.topLeft.shift(270, frontWidth)
    points.bottomMiddle = points.topMiddle.shift(270, frontWidth)
    points.bottomRight = points.topRight.shift(270, frontWidth)

    paths.seam = new Path()
      .move(points.topLeft)
      .line(points.bottomLeft)
      .line(points.bottomRight)
      .line(points.topRight)
      .line(points.topLeft)
      .close()
      .attr('class', 'fabric')
    paths.fold = new Path()
      .move(points.topMiddle)
      .line(points.bottomMiddle)
      .attr('class', 'fabric dashed')
      .setText('fold', 'text-s center')

    points.gridAnchor = points.topMiddle.clone()

    store.cutlist.addCut({ cut: 1, from: 'fabric' })

    points.title = points.topMiddle
      .shiftFractionTowards(points.topLeft, 0.7)
      .shiftFractionTowards(points.bottomMiddle, 0.5)
    macro('title', {
      nr: '10a',
      at: points.title,
      title: 'waistbanda',
      align: 'center',
      rotation: 90,
      scale: 0.35,
    })

    if (sa) {
      paths.sa = paths.seam.offset(sa).attr('class', 'fabric sa')
    }

    dim(part, [
      ['h', 'topLeft', 'topRight', 'topRight', -15],
      ['v', 'bottomRight', 'topRight', 'topRight', 15],
    ])

    return part
  },
}
