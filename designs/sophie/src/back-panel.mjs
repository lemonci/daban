import { base } from './base.mjs'

export const backPanel = {
  name: 'sophie.backPanel',
  measurements: [],
  optionalMeasurements: [],
  options: {},
  from: base,
  draft: ({
    Point,
    points,

    paths,
    snippets,
    Snippet,
    macro,
    measurements,
    part,
    sa,
    store,
    paperless,
  }) => {
    /*
     * fetch constants
     */

    const totalLength = measurements.waistToUnderbust + store.get('skirtLength')
    const hips = store.get('hips')
    const backCoverage = store.get('backCoverage')

    /*
     * Create the points
     */
    points.topCenterpoint = new Point(0, -backCoverage)

    /*
     * Construct the path
     */
    paths.seam = paths.shared.clone().line(points.topCenterpoint).close().addClass('fabric')

    macro('cutonfold', {
      from: points.topCenterpoint,
      to: points.bottomCenterpoint,
      id: 'back',
    })

    /*
     * Add seam allowance if enabled
     */
    if (sa) {
      paths.sa = paths.seam.offset(sa).addClass('fabric sa')
    }

    /*
     * Add paperless if enabled
     */

    if (paperless) {
      //vertical distances
      macro('vd', {
        from: points.bottomCenterpoint,
        to: points.topCenterpoint,
        x: points.topCenterpoint.x - sa - 10,
        id: 'vd0',
      })

      macro('vd', {
        from: points.topCenterpoint,
        to: points.topSide,
        x: points.bottomSide.x + sa + 10,
        id: 'vd1',
      })

      //linear distances
      macro('ld', {
        from: points.topCenterpoint,
        to: points.topSide,
        id: 'ld1',
        d: 15,
      })
    }

    /*
     * Add grainline to indicate bias cut
     */
    points.grainlineFrom = points.foldCenterpoint.shift(-45, totalLength * 0.1)
    points.grainlineTo = points.foldCenterpoint.shift(-45, totalLength * 0.4)
    macro('grainline', {
      from: points.grainlineFrom,
      to: points.grainlineTo,
    })

    /*
     * Add notches
     */
    snippets.waist = new Snippet('notch', points.waistSide)
    snippets.hips = new Snippet('notch', points.seatSide)

    /*
     * Add cut list
     */
    store.cutlist.addCut({ cut: 1, from: 'fabric', onFold: 1, onBias: 1 })

    /*
     * Add the title
     */
    points.title = new Point(hips / 8, totalLength / 4)
    macro('title', {
      at: points.title,
      nr: 4,
      title: 'Back Panel',
      align: 'center',
      scale: 0.8,
    })

    return part
  },
}
