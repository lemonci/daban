import { frontInside as sashaFrontInside } from '@freesewing/sasha'
import { frontOutside as sashaFrontOutside } from '@freesewing/sasha'
import { pocket } from './pocket.mjs'

/* // method to cut a (closed) path in two pieces using a second path (rest of the path is discarded)
const chopPath = (pathToCut, pathThatCuts) => {
	let intersections = pathToCut.intersects(pathThatCuts)
	
	if (~intersections) {// no intersections found
		return pathToCut
	} else if ( length(intersections) ~= 2 ) {
		log.error("could not chop path; more than two intersections found")
	} else {
		 */

export const frontOutsideAbove = {
  name: 'sasha.frontOutsideAbove',
  from: sashaFrontOutside,
  after: pocket,
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
    if (!options.withPocket) {
      return part.hide()
    }

    // Hide frontoutside (=single piece) paths
    for (const key of Object.keys(paths)) paths[key].hide()
    // for (const i in snippets) delete snippets[i] // keep the notches etc

    // now cut this in half to insert the pocket

    let pathToCut = paths.seam
    let pathThatCuts = paths.pocketOpening.unhide().addClass('fabric dotted')

    let opToCut = pathToCut.ops[1]
    let opThatCuts = pathThatCuts.ops[1]

    let intersections = pathThatCuts.intersects(pathToCut)
    let startInd = 0 // index of the intersection
    let pathThatCuts_ext

    if (intersections.length < 2) {
      log.debug('not enough intersections, trying again with pathThatCuts reversed')
      // first, try reversing the cutting path
      intersections = pathThatCuts.reverse().intersects(pathToCut)
      startInd = 1

      // check which intersection is closer to the start of the path
      // NOTE: this depends on the order of both paths, so difficult to predict
      if (
        intersections.length > 1 &&
        intersections[startInd].dist(pathThatCuts.start()) >
          intersections[(startInd + 1) % 2].dist(pathThatCuts.start())
      ) {
        startInd = 0
      }

      if (intersections.length < 2) {
        log.debug('not enough intersections, extending pathThatCuts')
        // try again with pathThatCuts extended slightly
        let longerHead = new Path()
          .move(pathThatCuts.shiftAlong(10).shiftOutwards(pathThatCuts.start(), 10))
          .line(pathThatCuts.start())

        let longerTail = new Path()
          .move(pathThatCuts.end())
          .line(
            pathThatCuts
              .shiftAlong(pathThatCuts.length() - 10)
              .shiftOutwards(pathThatCuts.end(), 10)
          )

        pathThatCuts_ext = longerHead
          .join(pathThatCuts)
          .join(longerTail)
          .addClass('lining help stroke-xl')
          .clean()

        //paths.pathThatCuts = pathThatCuts_ext // just to display the path

        intersections = pathThatCuts_ext.intersects(pathToCut)
        startInd = 0 // pathThatCuts_ext is not reversed
      } else {
        // TODO: be consistent about _ext vs _orig...
        pathThatCuts_ext = pathThatCuts
        // let pathThatCuts_ext = pathThatCuts
      }
    } else {
      // TODO: be consistent about _ext vs _orig...
      pathThatCuts_ext = pathThatCuts
    }

    // sanity check: which intersection is closer to the start of the path?
    if (
      intersections.length > 1 &&
      intersections[startInd].dist(pathThatCuts_ext.start()) >
        intersections[(startInd + 1) % 2].dist(pathThatCuts_ext.start())
    ) {
      log.debug('intersections found to be in opposite order')
      startInd = 1
    }

    if (!intersections) {
      // no intersections found
      // return pathToCut
      log.debug('no intersections found')
    } else if (intersections.length < 2) {
      log.debug('could not chop path; less than two intersections found')
    } else if (intersections.length > 2) {
      log.debug('could not chop path; more than two intersections found')
    } else {
      log.debug('attempting to chop path')

      // NOTE: intersections are returned in the order of the first path
      /*       points.firstX = intersections[startInd].addCircle(10, 'lining').addCircle(20, 'lining')
      points.lastX = intersections[(startInd + 1) % 2]
        .addCircle(10, 'fabric')
        .addCircle(20, 'fabric') */

      // NOTE: attempting to split is the easiest way to find out whether a point sits on the path
      let halvesOfToCut = pathToCut.split(intersections[startInd])
      let halvesOfToCutA = halvesOfToCut[0].split(intersections[(startInd + 1) % 2])
      let halvesOfToCutB = halvesOfToCut[1].split(intersections[(startInd + 1) % 2])
      let sameDirection // whether order of intersections matches between ToCut and ThatCuts
      if (halvesOfToCutA[0]) {
        sameDirection = false
        paths.begin = halvesOfToCutA[0].addClass('lining help stroke-xl')
        paths.middle = halvesOfToCutA[1].addClass('various help stroke-xl')
        paths.end = halvesOfToCut[1].addClass('canvas help stroke-xl')
      } else {
        sameDirection = true
        paths.begin = halvesOfToCut[0].addClass('lining help stroke-xl')
        paths.middle = halvesOfToCutB[0].addClass('various help stroke-xl')
        paths.end = halvesOfToCutB[1].addClass('canvas help stroke-xl')
      }

      let halvesOfThatCuts = pathThatCuts_ext.split(intersections[startInd])
      // other section is found either in the first half or the second
      // whichever split failed will return two null values (in an array)
      let halvesOfThatCutsA = !halvesOfThatCuts[0]
        ? false
        : halvesOfThatCuts[0].split(intersections[(startInd + 1) % 2])
      let halvesOfThatCutsB = !halvesOfThatCuts[1]
        ? false
        : halvesOfThatCuts[1].split(intersections[(startInd + 1) % 2])

      // NOTE: if pathThatCuts does not extend outside pathToCut, either
      // - halvesOfThatCuts[1] will be a Path with zero length, halvesOfThatCutsA[0] will be null, halvesOfThatCutsB will be [null, null]
      // - (speculative) halvesOfThatCuts[0] will be a Path with zero length, halvesOfThatCutsB[1] will be null

      if (halvesOfThatCutsB[0]) {
        paths.chopper = halvesOfThatCutsB[0]
      } else {
        if (!halvesOfThatCutsA) {
          log.debug('splitting failed, use full cutting path')
          paths.chopper = pathThatCuts_ext
        } else {
          // use halvesOfThatCutsA together with middle
          paths.chopper = halvesOfThatCutsA[1]
        }
      }
      log.debug('parts chopped, about to recombine')

      // instead of the pocket opening, insert the pocket edges
      let pocketEdges = store.get('pocketEdges')
      let chopped
      if (sameDirection) {
        //(halvesOfThatCutsB[0]) {
        // use halvesOfThatCutsB together with begin and end
        log.debug('using pathThatCuts instead of middle')

        chopped = paths.begin.join(pocketEdges).join(paths.end).addClass('fabric sa stroke-2xl')
        //.hide()
      } else {
        log.debug('using middle followed by pathThatCuts')

        chopped = paths.middle.join(pocketEdges)
      }

      // mark the above/pocket transition with notches
      snippets.pocketStart = new Snippet('notch', points.pocketStart)
      snippets.pocketEnd = new Snippet('notch', points.pocketEnd)

      store.set('directionForBelow', !sameDirection) // below part uses the opposite direction

      // hide the parts
      paths.begin.hide()
      paths.middle.hide()
      paths.end.hide()
      paths.chopper.hide()

      log.info('path was chopped')

      paths.seam = chopped.addClass('fabric')
    }
    /*    // end of 'chop' macro */

    // cutlist
    store.cutlist.setCut({ cut: 2, from: 'fabric', onFold: false })

    // grainline
    macro('grainline', {
      from: points.sideHem.shift(0, -20),
      to: points.pocketEnd.shift(0, -20),
    })

    // title
    macro('title', {
      at: points.titleAnchor,
      nr: '2a',
      title: 'frontOutsideAbove',
    })

    if (sa) paths.sa = paths.seam.offset(sa).attr('class', 'fabric sa')

    // dimensions for paperless
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

    macro('vd', {
      from: points.sideHem,
      to: points.pocketEnd,
      x: points.sideHem.x + sa + 15,
      id: 'waistToPocketEnd',
    })
    macro('vd', {
      from: points.pocketStart,
      to: points.waistDartRight,
      x: points.pocketStart.x - sa - 15,
      id: 'waistToPocketStart',
    })

    /* // uncomment this if we add a rotateWaist option
    if* ()!options.rotateWaist) {
      macro('vd', {
        from: points.waistDartRight,
        to: points.sideHem,
        x: points.sideHem.x + 25,
        id: 'waistVertical',
      })
    } else { */
    macro('vd', {
      from: points.armhole,
      to: points.sideHem,
      x: points.armhole.x + sa + 15,
      id: 'bodiceSideVertical',
    })
    macro('hd', {
      from: points.sideHem,
      to: points.armhole,
      y: points.sideHem.y - 15,
      id: 'bodiceSideHorizontal',
    })

    return part
  },
}
