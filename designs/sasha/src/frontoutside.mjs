import { frontOutside as nobleFrontOutside } from '@freesewing/noble'
import { frontInside as sashaFrontInside } from '@freesewing/sasha'

/* // method to cut a (closed) path in two pieces using a second path (rest of the path is discarded)
const chopPath = (pathToCut, pathThatCuts) => {
	let intersections = pathToCut.intersects(pathThatCuts)
	
	if (~intersections) {// no intersections found
		return pathToCut
	} else if ( length(intersections) ~= 2 ) {
		log.error("could not chop path; more than two intersections found")
	} else {
		 */

export const frontOutside = {
  name: 'sasha.frontOutside',
  from: nobleFrontOutside,
  after: sashaFrontInside,
  hide: { from: true },
  measurements: ['waistToHips', 'shoulderToWrist', 'hpsToWaistBack'],
  options: {
    withPocket: { bool: true, menu: 'style' },
    pocketCurve: {
      pct: 54,
      min: 0,
      max: 100,
      menu: (settings, mergedOptions) => (mergedOptions?.withPocket ? 'style' : false),
    }, //54% just looks good to me
    pocketOpeningHeight: {
      pct: 65,
      min: 0,
      max: 150,
      menu: (settings, mergedOptions) => (mergedOptions?.withPocket ? 'style' : false),
    }, // default is rather arbitrary
  },
  draft: ({
    store,
    sa,
    points,
    Path,
    paths,
    Snippet,
    snippets,
    options,
    macro,
    measurements,
    utils,
    log,
    part,
  }) => {
    // Hide Noble paths
    for (const key of Object.keys(paths)) paths[key].hide()
    for (const i in snippets) delete snippets[i] // delete notches because they won't rotate with the path

    // take Noble paths, split into convenient pieces
    // NOTE: nobleFrontOutside is drawn from waistDartLeft to sideHem to armhole (etc),
    //  the armhole being on the right (so counterclockwise)
    const halvesA = paths.seam.split(points.sideHem)

    // TODO: add option to either rotate or ignore the excess
    // TODO: if ignoring, adjust back outside to match (how?)

    // rotate until the bottom edge is horizontal NOTE: this rotates the points as well!
    const rotAngle = 180 - points.sideHem.angle(points.waistDartRight)
    const nobleRest = halvesA[1].rotate(rotAngle, points.waistDartRight)

    // get the rotated points from the rotated path
    points.sideHem = nobleRest.start() //.addCircle(10,'lining')
    // or just rotate them
    points.armholeSplit = points.armholeDartOutside.rotate(rotAngle, points.waistDartRight)
    points.armhole = points.armhole.rotate(rotAngle, points.waistDartRight)
    points.dartTip = points.snippet.rotate(rotAngle, points.waistDartRight)
    // now put the notch back
    snippets.dartTip = new Snippet('notch', points.dartTip)

    // skirt portion consists of a rectangle and a 'godet' (but as one piece)
    points.sideSkirtHem = points.sideHem.shift(270, store.get('skirtLength'))
    points.godetStart = points.waistDartRight.shift(270, store.get('skirtLength'))
    points.godetEnd = points.waistDartRight.shift(
      270 - store.get('skirtDartAngle'),
      store.get('skirtLength')
    )

    // start drawing the path at bottom left, which is the 'end' of the godet
    //  move from there to side seam, so counter-clockwise
    paths.seam = new Path()
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
      .join(nobleRest)
      .close()
      .addClass('fabric')

    if (options.withPocket) {
      // define the pocket opening

      // base position is wrist height, approximated by assuming shoulder and hps are same height
      // pocketOpening (as a path) runs from princess seam to side seam, optionally curving down
      const waistToWrist = measurements.shoulderToWrist - measurements.hpsToWaistBack
      const pocketHeight = options.pocketOpeningHeight * measurements.waistToHips
      points.pocketStart = utils.beamsIntersect(
        points.waistDartRight,
        points.godetEnd,
        points.sideHemInitial.shift(0, 1).shift(270, waistToWrist - pocketHeight),
        points.sideHemInitial.shift(180, 1).shift(270, waistToWrist - pocketHeight)
      )

      points.pocketEnd = utils.beamsIntersect(
        points.sideHem,
        points.sideSkirtHem,
        points.sideHemInitial.shift(0, 1).shift(270, waistToWrist),
        points.sideHemInitial.shift(180, 1).shift(270, waistToWrist)
      )

      const pocketWidth = -points.pocketStart.dx(points.pocketEnd)
      const pocketOpeningHeight = points.pocketStart.dy(points.pocketEnd)
      store.set('pocketWidth', pocketWidth)
      store.set('pocketOpeningHeight', pocketOpeningHeight)

      points.cpPocket = points.pocketEnd.shift(0, options.pocketCurve * pocketWidth)

      paths.pocketOpening = new Path()
        .move(points.pocketStart)
        ._curve(points.cpPocket, points.pocketEnd)

      // pocket uses paths.pocketOpening to scale the pocket width
      // frontOutsideAbove uses paths.pocketOpening to split into above and below
    }

    // mark the waist line with notches
    macro('sprinkle', {
      snippet: 'notch',
      on: ['sideHem', 'waistDartRight'],
    })

    // cutlist
    store.cutlist.setCut({ cut: 2, from: 'fabric', onFold: false })

    // grainline
    macro('grainline', {
      from: points.sideHem.shift(0, -20),
      to: points.sideSkirtHem.shift(0, -20),
    })

    // title
    macro('title', {
      at: points.titleAnchor,
      nr: 2,
      title: 'frontOutside',
    })

    if (sa) paths.sa = paths.seam.offset(sa).attr('class', 'fabric sa')

    if (options.withPocket) {
      // hide this part, use frontoutsideabove and frontoutsidebelow instead
      part.hide()
    } else {
      // dimensions for paperless
      macro('hd', {
        from: points.waistDartRight,
        to: points.sideSkirtHem,
        y: points.waistDartRight.y + 15,
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

      let extraOffset = 0
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
        from: points.waistDartRight,
        to: points.dartTip,
        x: points.waistDartRight.x - sa - 15,
        id: 'dartPointToWaist',
      })

      /* // uncomment this if we add a rotateWaist option
      if ()!options.rotateWaist) {
        macro('vd', {
          from: points.waistDartRight,
          to: points.sideHem,
          x: points.sideHem.x + 25,
          id: 'waistVertical',
        })
      } */
      macro('vd', {
        from: points.sideSkirtHem,
        to: points.sideHem,
        x: points.sideHem.x + sa + 15,
        id: 'hemToWaist',
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
    }

    return part
  },
}
