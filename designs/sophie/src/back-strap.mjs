export const backStrap = {
  name: 'sophie.backStrap',
  measurements: [],
  optionalMeasurements: [],
  options: {},

  draft: ({
    Point,
    points,
    Path,
    paths,
    macro,
    sa,
    measurements,
    part,
    store,
    paperless,
    options,
  }) => {
    /*
     * Fetch constants
     */
    const underbustVerticalPosition = measurements.hpsToWaistBack - measurements.waistToUnderbust
    const totalHeight =
      measurements.hpsToWaistBack - measurements.waistToUnderbust * (1 - options.sideCornerDrop)

    const hpsToUnderbust = store.get('hpsToUnderbust')
    const strapWidth = store.get('strapWidth')
    const armholeDrop = store.get('armholeDrop')
    const armholeWidth = store.get('armholeWidth')
    const backCoverage = store.get('backCoverage')
    const underbust = store.get('underbust')
    const cornerWidth = store.get('cornerWidth')

    console.log('underbust', underbust / 4)
    console.log('cornerwidth', cornerWidth)
    /*
     * Create the points
     */

    points.a = new Point(0, underbustVerticalPosition - (hpsToUnderbust - armholeDrop)) //calculate seam line to attach to cup
    points.b = new Point(underbust / 4 - cornerWidth, totalHeight)
    points.c = new Point(underbust / 4, underbustVerticalPosition - backCoverage)
    points.d = new Point(measurements.shoulderToShoulder / 4, 0)
    points.e = points.d.shift(180 + measurements.shoulderSlope, strapWidth)
    points.ea = new Point(
      armholeWidth,
      underbustVerticalPosition - (hpsToUnderbust - armholeDrop) * 0.9
    )

    /*
     * Construct the path
     */
    paths.backStrap = new Path()
      .move(points.a)
      .line(points.b)
      .line(points.c)
      .line(points.d)
      .line(points.e)
      .curve_(points.ea, points.a)
      .close()
      .addClass('fabric')
      .addClass('lining')

    /*
     * Add seam allowance if enabled
     */
    if (sa) {
      paths.sa = paths.backStrap.offset(sa).addClass('fabric sa')
    }

    /*
     * Add paperless if enabled
     */

    //vertical distances
    if (paperless) {
      macro('vd', {
        from: points.a,
        to: points.e,
        x: points.a.x - sa - 10,
        id: 'vd0',
      })

      macro('vd', {
        from: points.b,
        to: points.a,
        x: points.a.x - sa - 10,
        id: 'vd1',
      })

      macro('vd', {
        from: points.b,
        to: points.c,
        x: points.c.x + sa + 10,
        id: 'vd2',
      })

      macro('vd', {
        from: points.c,
        to: points.d,
        x: points.c.x + sa + 10,
        id: 'vd3',
      })

      //horizontal distances
      macro('hd', {
        from: points.a,
        to: points.e,
        y: points.d.y - sa - 10,
        id: 'hd0',
      })

      macro('hd', {
        from: points.b,
        to: points.c,
        y: points.b.y + sa + 10,
        id: 'hd1',
      })

      macro('hd', {
        from: points.d,
        to: points.c,
        y: points.d.y - sa - 10,
        id: 'hd2',
      })

      macro('hd', {
        from: points.e,
        to: points.d,
        y: points.d.y - sa - 10,
        id: 'hd3',
      })

      //linear distances
      macro('ld', {
        from: points.b,
        to: points.c,
        id: 'ld1',
        d: 15,
      })
    }

    /*
     * Add cut list
     */
    store.cutlist.addCut({ cut: 2, from: 'fabric' })
    store.cutlist.addCut({ cut: 2, from: 'lining' })

    /*
     * Add grainline
     */
    points.grainlineFrom = points.d.shift(-90, totalHeight * 0.1)
    points.grainlineTo = points.d.shift(-90, totalHeight * 0.4)
    macro('grainline', {
      from: points.grainlineFrom,
      to: points.grainlineTo,
    })

    /*
     * Add the title
     */
    points.title = new Point(underbust / 8, totalHeight * 0.6)
    macro('title', {
      at: points.title,
      nr: 2,
      title: 'Back Strap',
      align: 'center',
      scale: 0.8,
    })

    return part
  },
}
