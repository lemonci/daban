import { backInside as sashaBackInside } from './backinside.mjs'

export const backOutside = {
  name: 'sasha.backOutside',
  from: sashaBackInside,
  draft: ({ sa, store, points, Path, paths, snippets, options, macro, part }) => {
    // hide the paths(s) inherited from sashaFrontInside
    for (const key of Object.keys(paths)) paths[key].hide()
    // hide the notches
    for (const i in snippets) delete snippets[i]

    // custom split of armhole and curve from there to dart tip
    // NOTE: paths.armhole is generated in nobleBackPoints
    const lowerArmholeCurve = paths.armhole.split(points.armholeSplit)[0]

    // NOTE: paths.sashaDartToArmhole is inherited from sashaBackInside

    // redraw remaining paths as in Noble
    // NOTE: nobleBackInside is drawn from cbNeck to waistCenter to dart to waistSide to armhole etc

    // nobleSide: points.waistSide --> points.armhole
    const nobleSide = new Path().move(points.waistSide).curve_(points.waistSideCp2, points.armhole)

    // nobleDartRightHalf: points.dartBottomRight --> points.dartTip
    const nobleDartRightHalf = new Path()
      .move(points.dartTip)
      .curve(points.shoulderDartCpDown, points.dartRightCp, points.dartBottomRight)

    // skirt portion consists of a rectangle and a 'godet' (but as one piece)
    points.sideSkirtHem = points.waistSide.shift(270, store.get('skirtLength'))
    points.godetStart = points.dartBottomRight.shift(270, store.get('skirtLength'))
    points.godetEnd = points.dartBottomRight.shift(
      270 - store.get('skirtDartAngle'),
      store.get('skirtLength')
    )

    // assemble the seam from these paths
    paths.outsideSeam = new Path()
      .move(points.godetEnd)
      .curve(
        points.godetEnd.shift(
          -store.get('skirtDartAngle'),
          points.godetEnd.dist(points.godetStart) / 3
        ),
        points.godetStart.shift(180, points.godetStart.dist(points.godetEnd) / 3),
        points.godetStart
      )
      .move(points.sideSkirtHem)
      .join(nobleSide)
      .join(lowerArmholeCurve)
      .join(paths.sashaDartToArmhole.reverse())
      .join(nobleDartRightHalf || new Path().move(points.dartBottomRight)) // go through dartBottomRight either way
      .line(points.godetEnd) // close() is not enough to get a good seam allowance
      .close()
      .addClass('fabric')

    paths.sashaDartToArmhole.hide() // avoid drawing it twice (which would make the line thicker)

    // mark the waist line with notches
    macro('sprinkle', {
      snippet: 'notch',
      on: ['waistSide', 'dartBottomRight'],
    })

    // cutlist
    store.cutlist.setCut({ cut: 2, from: 'fabric', onFold: false })

    // grainline
    macro('grainline', {
      from: points.armhole.shift(0, -20),
      to: points.sideSkirtHem.shift(0, -20),
    })

    // title
    points.titleAnchor = points.dartTip.shiftFractionTowards(points.waistSide, 0.25)
    macro('title', {
      at: points.titleAnchor,
      nr: 4,
      title: 'backOutside',
    })

    if (sa) paths.sa = paths.outsideSeam.offset(sa).addClass('fabric sa')

    macro('hd', {
      from: points.dartBottomRight,
      to: points.sideSkirtHem,
      y: points.dartBottomRight.y + 15,
      id: 'dartToSide',
    })
    macro('hd', {
      from: points.armholeSplit,
      to: points.armhole,
      y: points.armholeSplit.y - sa - 15,
      id: 'armholeHorizontal',
    })
    macro('hd', {
      from: points.dartTip,
      to: points.armholeSplit,
      y: points.armholeSplit.y - sa - 15,
      id: 'dartTipToArmhole',
    })
    macro('hd', {
      from: points.dartTip,
      to: points.armhole,
      y: points.armholeSplit.y - sa - 25,
      id: 'middleToDartTip',
    })

    if (options.dartPosition != 'shoulder') {
      macro('vd', {
        from: points.armholeSplit,
        to: points.armhole,
        x: points.armhole.x + sa + 15,
        id: 'armholeVertical',
      })
    }
    macro('vd', {
      from: points.dartTip,
      to: points.armholeSplit,
      x: points.dartTip.x - sa - 15,
      id: 'dartPointToSplit',
    })
    macro('vd', {
      from: points.dartTip,
      to: points.dartBottomRight,
      x: points.dartTip.x - sa - 15,
      id: 'dartPointToWaist',
    })

    macro('vd', {
      from: points.dartBottomRight,
      to: points.waistSide,
      x: points.waistSide.x + 25,
      id: 'waistVertical',
    })
    macro('vd', {
      from: points.sideSkirtHem,
      to: points.armhole,
      x: points.armhole.x + sa + 15,
      id: 'hemToArmhole',
    })
    macro('vd', {
      from: points.sideSkirtHem,
      to: points.armhole,
      x: points.armhole.x - sa - 25,
      id: 'hemToHps',
    })
    macro('hd', {
      from: points.godetStart,
      to: points.sideSkirtHem,
      y: points.sideSkirtHem.y + sa + 15,
      id: 'middleToGodetStart',
    })
    macro('hd', {
      from: points.godetEnd,
      to: points.godetStart,
      y: points.sideSkirtHem.y + sa + 15,
      id: 'godetWidth',
    })
    macro('hd', {
      from: points.godetEnd,
      to: points.sideSkirtHem,
      y: points.sideSkirtHem.y + sa + 25,
      id: 'middleToGodetEnd',
    })
    macro('vd', {
      from: points.sideSkirtHem,
      to: points.godetEnd,
      x: points.godetEnd.x - sa - 15,
      id: 'hemVertical',
    })

    return part
  },
}
