import { frontOutside as sashaFrontOutside } from './frontoutside.mjs'
import { pocket } from './pocket.mjs'

export const frontOutsideAbove = {
  name: 'sasha.frontOutsideAbove',
  from: sashaFrontOutside,
  after: pocket,
  draft: ({ store, sa, points, Path, paths, Snippet, snippets, options, macro, log, part }) => {
    if (!options.withPocket) {
      return part.hide()
    }

    // NOTE: to add the pocket, we need to cut up the sashaFrontOutside along the
    // pocket opening, then add on the pocket bag

    // Hide frontoutside (=single piece) paths
    for (const key of Object.keys(paths)) paths[key].hide()

    // now cut this in half to insert the pocket

    // Chopping a Path
    // inputs:
    //  pathToChop:     a closed path, enclosing an area that needs to be split
    //  pathThatChops:  can be curved but not looped
    // result:
    //  chopped:        a new closed path that encloses part of the original area,
    //                  made up of sections of pathToChop and pathThatChops;
    //                  orientation of pathThatChops determines which part to keep

    let pathToChop = paths.seam
    let pathThatChops = paths.pocketOpening
      .unhide()
      .addClass('fabric help')
      .addText('pocket opening (do not cut)', 'center')

    // find intersections; there should be exactly two
    let intersections = pathThatChops.intersects(pathToChop)
    let startInd = 0 // index of the intersection closest to the start
    let pathThatChops_ext // if necessary, extend the path slightly to avoid narrowly missing an intersection

    if (intersections.length < 2) {
      log.debug('not enough intersections, trying again with pathThatChops reversed')
      // first, try reversing the cutting path
      intersections = pathThatChops.reverse().intersects(pathToChop)
      startInd = 1

      // check which intersection is closer to the start of the path
      // NOTE: this depends on the order of both paths, so difficult to predict
      if (
        intersections.length > 1 &&
        intersections[startInd].dist(pathThatChops.start()) >
          intersections[(startInd + 1) % 2].dist(pathThatChops.start())
      ) {
        startInd = 0
      }

      if (intersections.length < 2) {
        log.debug('not enough intersections, extending pathThatChops')
        // try again with pathThatChops extended slightly
        let longerHead = new Path()
          .move(pathThatChops.shiftAlong(10).shiftOutwards(pathThatChops.start(), 10))
          .line(pathThatChops.start())

        let longerTail = new Path()
          .move(pathThatChops.end())
          .line(
            pathThatChops
              .shiftAlong(pathThatChops.length() - 10)
              .shiftOutwards(pathThatChops.end(), 10)
          )

        pathThatChops_ext = longerHead
          .join(pathThatChops)
          .join(longerTail)
          .addClass('lining help stroke-xl')
          .clean()

        //paths.pathThatChops = pathThatChops_ext // just to display the path

        intersections = pathThatChops_ext.intersects(pathToChop)
        startInd = 0 // pathThatChops_ext is not reversed
      } else {
        // TODO: be consistent about _ext vs _orig...
        pathThatChops_ext = pathThatChops
        // let pathThatChops_ext = pathThatChops
      }
    } else {
      // TODO: be consistent about _ext vs _orig...
      pathThatChops_ext = pathThatChops
    }

    // sanity check: which intersection is closer to the start of the path?
    if (
      intersections.length > 1 &&
      intersections[startInd].dist(pathThatChops_ext.start()) >
        intersections[(startInd + 1) % 2].dist(pathThatChops_ext.start())
    ) {
      log.debug('intersections found to be in opposite order')
      startInd = 1
    }

    if (!intersections) {
      // no intersections found ==> chopped = pathToChop (keep full area)
      log.debug('no intersections found')
    } else if (intersections.length < 2) {
      log.debug('could not chop path; less than two intersections found')
    } else if (intersections.length > 2) {
      log.debug('could not chop path; more than two intersections found')
    } else {
      log.debug('attempting to chop path')

      // with two intersections, pathToChop can be split into three sections
      // (begin, middle, end); the final chopped path will consist of either
      // - begin + (part of) pathThatChops + end *or*
      // - middle + pathThatChops

      let halvesOfToChop = pathToChop.split(intersections[startInd])
      // now we need to figure out which section has the other intersection
      // NOTE: attempting to split is the easiest way to find out whether a point sits on the path
      let halvesOfToChopA = halvesOfToChop[0].split(intersections[(startInd + 1) % 2])
      let halvesOfToChopB = halvesOfToChop[1].split(intersections[(startInd + 1) % 2])
      let sameDirection // whether order of intersections matches between ToChop and ThatChops
      if (halvesOfToChopA[0]) {
        sameDirection = false
        paths.begin = halvesOfToChopA[0].addClass('lining help stroke-xl')
        paths.middle = halvesOfToChopA[1].addClass('various help stroke-xl')
        paths.end = halvesOfToChop[1].addClass('canvas help stroke-xl')
      } else {
        sameDirection = true
        paths.begin = halvesOfToChop[0].addClass('lining help stroke-xl')
        paths.middle = halvesOfToChopB[0].addClass('various help stroke-xl')
        paths.end = halvesOfToChopB[1].addClass('canvas help stroke-xl')
      }

      let halvesOfThatChops = pathThatChops_ext.split(intersections[startInd])
      // other section is found either in the first half or the second
      // whichever split failed will return two null values (in an array)
      let halvesOfThatChopsA = !halvesOfThatChops[0]
        ? false
        : halvesOfThatChops[0].split(intersections[(startInd + 1) % 2])
      let halvesOfThatChopsB = !halvesOfThatChops[1]
        ? false
        : halvesOfThatChops[1].split(intersections[(startInd + 1) % 2])

      // NOTE: if pathThatChops does not extend outside pathToChop, either
      // - halvesOfThatChops[1] will be a Path with zero length, halvesOfThatChopsA[0] will be null, halvesOfThatChopsB will be [null, null]
      // - (speculative) halvesOfThatChops[0] will be a Path with zero length, halvesOfThatChopsB[1] will be null

      if (halvesOfThatChopsB[0]) {
        paths.chopper = halvesOfThatChopsB[0]
      } else {
        if (!halvesOfThatChopsA) {
          log.debug('splitting failed, use full cutting path')
          paths.chopper = pathThatChops_ext
        } else {
          // use halvesOfThatChopsA together with middle
          paths.chopper = halvesOfThatChopsA[1]
        }
      }
      log.debug('parts chopped, about to recombine')

      // instead of the pocket opening, insert the pocket edges
      let pocketEdges = store.get('pocketEdges')
      let chopped
      if (sameDirection) {
        //(halvesOfThatChopsB[0]) {
        // use halvesOfThatChopsB together with begin and end
        log.debug('using pathThatChops instead of middle')

        chopped = paths.begin.join(pocketEdges).join(paths.end).addClass('fabric sa stroke-2xl')
        //.hide()
      } else {
        log.debug('using middle followed by pathThatChops')

        chopped = paths.middle.join(pocketEdges)
      }

      store.set('directionForBelow', !sameDirection) // below part uses the opposite direction

      // hide the path sections
      paths.begin.hide()
      paths.middle.hide()
      paths.end.hide()
      paths.chopper.hide()

      log.debug('path was chopped')

      paths.seam = chopped.addClass('fabric')
    }
    // end of 'chopping' code (possible macro?)

    // mark the above/pocket transition with notches
    snippets.pocketStart = new Snippet('notch', points.pocketStart)
    snippets.pocketEnd = new Snippet('notch', points.pocketEnd)

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

    if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')

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
