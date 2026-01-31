export const cup = {
  name: 'sophie.cup',
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
    const hpsToUnderbust = store.get('hpsToUnderbust')
    const strapWidth = store.get('strapWidth')
    const armholeDrop = store.get('armholeDrop')
    const armholeWidthFront = store.get('armholeWidthFront')
    const necklineCoverage = store.get('necklineCoverage')
    const bustFront = store.get('bustFront')
    const cornerWidth = store.get('cornerWidth')
    const underbust = store.get('underbust')

    /*
     * Create the points
     */

    points.a = new Point(0, armholeDrop)
    points.b = new Point(
      underbust / 4 - cornerWidth,
      hpsToUnderbust + measurements.waistToUnderbust * options.sideCornerDrop
    )
    points.bc = new Point(
      bustFront / 2 - measurements.bustSpan / 4,
      hpsToUnderbust + measurements.waistToUnderbust * options.sideCornerDrop
    )
    points.c = new Point(bustFront / 2, hpsToUnderbust - necklineCoverage)
    points.d = new Point(measurements.shoulderToShoulder / 4, 0)
    points.e = points.d.shift(180 + measurements.shoulderSlope, strapWidth)
    points.ea = new Point(armholeWidthFront, armholeDrop * 0.9)

    /*
     * Construct the path
     */
    paths.cup = new Path()
      .move(points.a)
      .line(points.b)
      .curve_(points.bc, points.c)
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
      paths.sa = paths.cup.offset(sa).addClass('fabric sa')
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

      //path distance
      macro('pd', {
        path: new Path().move(points.b).curve_(points.bc, points.c),
        d: 15,
        force: true,
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
    points.grainlineFrom = points.d.shift(-90, hpsToUnderbust * 0.1)
    points.grainlineTo = points.d.shift(-90, hpsToUnderbust * 0.5)
    macro('grainline', {
      from: points.grainlineFrom,
      to: points.grainlineTo,
    })

    /*
     * Add the title
     */
    points.title = new Point(bustFront / 4, hpsToUnderbust * 0.7)
    macro('title', {
      at: points.title,
      nr: 1,
      title: 'cup',
      align: 'center',
      scale: 0.8,
    })

    return part
  },
}
