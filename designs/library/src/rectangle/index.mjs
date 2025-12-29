import { ensureStoreValues } from '../shared.mjs'

export const rectangle = {
  library: true,
  name: 'library.rectangle',
  measurements: [],
  options: {
    mockRectangle: false, // Can be set via a flag/suggest, not via UI
    noSa: false,
    seamClasses: 'fabric',
    rectangleWidth: { pct: 100, min: 50, max: 150, menu: 'rectangle' },
    rectangleHeight: { pct: 100, min: 50, max: 150, menu: 'rectangle' },
  },
  store: {
    reads: ['width', 'height'],
  },
  draft: ({
    store,
    sa,
    macro,
    snippets,
    Snippet,
    units,
    options,
    Point,
    points,
    Path,
    paths,
    log,
    measurements,
    part,
  }) => {
    /*
     * If things are missing in the store, flag a warning and return early.
     * Unless we are asked to mock these values.
     */
    if (!ensureStoreValues(rectangle, 'mockRectangle', store, options)) return part

    // Points
    points.topLeft = new Point(0, 0)
    points.topRight = new Point(store.pget('width', 100) * options.rectangleWidth, 0)
    points.bottomRight = new Point(
      points.topRight.x,
      store.pget('height', 100) * options.rectangleHeight
    )
    points.bottomLeft = new Point(0, points.bottomRight.y)

    // Paths
    paths.seam = new Path()
      .move(points.topLeft)
      .line(points.bottomLeft)
      .line(points.bottomRight)
      .line(points.topRight)
      .line(points.topLeft)
      .close()
      .addClass(options.seamClasses)

    if (sa && !options.noSa) paths.sa = paths.seam.offset(sa).attr('class', 'fabric sa')

    /*
     * Annotations

    // Anchor point for sampling
    points.gridAnchor = new Point(0, 0)

    // Grainline
    macro('grainline', {
      from: points.centerWrist,
      to: points.centerBiceps,
    })

    // Cut list
    store.cutlist.addCut({ cut: 2, from: 'fabric' })

    // Logo
    points.logo = points.centerBiceps.shiftFractionTowards(points.centerWrist, 0.3)
    snippets.logo = new Snippet('logo', points.logo)

    // Title
    macro('title', { at: points.centerBiceps, nr: 3, title: 'sleeve' })

    // Scalebox
    points.scaleboxAnchor = points.scalebox = points.centerBiceps.shiftFractionTowards(
      points.centerWrist,
      0.5
    )
    macro('scalebox', { at: points.scalebox })

    // Notches
    if (store.pget('frontArmholeToArmholePitch')) {
      points.frontNotch = paths.sleevecap.shiftAlong(store.pget('frontArmholeToArmholePitch'))
      snippets.frontNotch = new Snippet('notch', points.frontNotch)
    }
    if (store.pget('backArmholeToArmholePitch')) {
      points.backNotch = paths.sleevecap
        .reverse()
        .shiftAlong(store.pget('backArmholeToArmholePitch'))
      snippets.backNotch = new Snippet('bnotch', points.backNotch)
    }

    // Dimensions
    macro('vd', {
      id: 'hCuffToArmhole',
      from: points.wristLeft,
      to: points.bicepsLeft,
      x: points.bicepsLeft.x - sa - 15,
    })
    macro('vd', {
      id: 'hFull',
      from: points.wristLeft,
      to: points.sleeveTip,
      x: points.bicepsLeft.x - sa - 30,
    })
    macro('hd', {
      id: 'wFull',
      from: points.bicepsLeft,
      to: points.bicepsRight,
      y: points.sleeveTip.y - sa - 30,
    })
    macro('hd', {
      id: 'wCuff',
      from: points.wristLeft,
      to: points.wristRight,
      y: points.wristLeft.y + sa + 30,
    })
    macro('pd', {
      id: 'lSleevevap',
      path: paths.sleevecap.reverse(),
      d: -1 * sa - 15,
    })
     */

    return part
  },
}
