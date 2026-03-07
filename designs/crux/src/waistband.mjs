import { front } from './front.mjs'
import { back } from './back.mjs'
import { dim } from './shared.mjs'

export const waistband = {
  name: 'crux.waistband',
  after: [front, back],
  draft: ({
    options,
    Path,
    Point,
    points,
    paths,
    Snippet,
    snippets,
    sa,
    expand,
    units,
    store,
    measurements,
    macro,
    part,
  }) => {
    const waistLengthBack = store.get('waistLengthBack')
    const waistLengthFront = store.get('waistLengthFront')
    const flyWidth = store.get('flyWidth')
    const waistLength = waistLengthBack + waistLengthFront + flyWidth * 0.5 + sa * 0.5
    const waistBandWidth = measurements.waistToFloor * options.waistBandWidth
    const frontWidth = Math.max(flyWidth, waistBandWidth)

    if (!expand) {
      // Expand is off, do not draw the part but flag this to the user
      store.flag.note({
        msg: `devon:cutWaistband`,
        replace: {
          width: units(waistBandWidth * 2),
          length: units(
            options.waistbandType === 'ribknit' ? frontWidth + flyWidth : waistLength * 2
          ),
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

    switch (options.waistbandType) {
      case 'standard':
      case 'elastic':
        points.topMiddle = new Point(waistBandWidth, 0)
        points.topRight = new Point(waistBandWidth * 2, 0)
        points.bottomLeft = points.topLeft.shift(270, waistLength)
        points.bottomMiddle = points.topMiddle.shift(270, waistLength)
        points.bottomRight = points.topRight.shift(270, waistLength)
        points.flyMiddle = points.topMiddle.shift(270, flyWidth + sa)
        points.flyRight = points.topRight.shift(270, flyWidth + sa)

        points.sideLeft = points.topLeft.shift(270, waistLengthFront)
        snippets.sideLeft = new Snippet('notch', points.sideLeft)
        points.backLeft = points.topLeft.shift(270, waistLengthFront + waistLengthBack)
        snippets.backLeft = new Snippet('notch', points.backLeft)
        points.sideRight = points.topRight.shift(270, waistLengthFront + flyWidth + sa)
        snippets.sideRight = new Snippet('notch', points.sideRight)

        points.logo = points.topMiddle.shiftFractionTowards(points.bottomMiddle, 0.3)
        snippets.logo = new Snippet('logo', points.logo)

        macro('cutonfold', { from: points.bottomLeft, to: points.bottomRight })

        break
      case 'ribknit':
        points.topMiddle = new Point(waistBandWidth, 0)
        points.topRight = new Point(waistBandWidth * 2, 0)
        points.bottomLeft = points.topLeft.shift(270, frontWidth + flyWidth + sa)
        points.bottomMiddle = points.topMiddle.shift(270, frontWidth + flyWidth + sa)
        points.bottomRight = points.topRight.shift(270, frontWidth + flyWidth + sa)
        points.flyMiddle = points.topMiddle.shift(270, flyWidth + sa)
        points.flyRight = points.topLeft.shift(270, flyWidth + sa)

        break
    }
    paths.seamSA = new Path()
      .move(points.bottomRight)
      .line(points.topRight)
      .line(points.topLeft)
      .line(points.bottomLeft)
    paths.seam = paths.seamSA.clone().line(points.bottomRight).close().attr('class', 'fabric')
    paths.fold = new Path()
      .move(points.topMiddle)
      .line(points.bottomMiddle)
      .attr('class', 'fabric dashed')
      .setText('fold', 'text-s center')
    paths.fly = new Path()
      .move(points.flyMiddle)
      .line(points.flyRight)
      .attr('class', 'fabric dashed')

    points.gridAnchor = points.topMiddle.clone()

    store.cutlist.addCut({ cut: 1, from: 'fabric', onFold: options.waistbandType !== 'ribknit' })
    snippets.flyRight = new Snippet('notch', points.flyRight)

    points.title = points.topMiddle
      .shiftFractionTowards(points.topLeft, 0.7)
      .shiftFractionTowards(points.bottomMiddle, 0.5)
    macro('title', {
      nr: 10,
      at: points.title,
      title: 'waistband',
      align: 'center',
      rotation: 90,
      scale: 0.4,
    })

    if (sa) {
      paths.sa = new Path()
        .move(points.bottomRight)
        .join(paths.seamSA.offset(sa))
        .line(points.bottomLeft)
        .attr('class', 'fabric sa')
    }

    macro('rmahd')
    macro('rmavd')

    dim(part, [['h', 'topLeft', 'topRight', 'topRight', -15]])
    if (options.waistbandType === 'ribknit') {
      dim(part, [
        ['v', 'bottomRight', 'topRight', 'topRight', 15],
        ['v', 'bottomLeft', 'flyRight', 'topLeft', -15],
      ])
    } else {
      dim(part, [
        ['v', 'bottomRight', 'topRight', 'topRight', 35],
        ['v', 'bottomRight', 'flyRight', 'topRight', 25],
        ['v', 'bottomRight', 'sideRight', 'topRight', 15],
        ['v', 'sideLeft', 'topLeft', 'topLeft', -15],
        ['v', 'backLeft', 'topLeft', 'topLeft', -25],
      ])
    }

    return part
  },
}
