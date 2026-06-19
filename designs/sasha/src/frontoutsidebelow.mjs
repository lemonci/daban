import { frontOutsideAbove as sashaFrontOutsideAbove } from './frontoutsideabove.mjs'

export const frontOutsideBelow = {
  name: 'sasha.frontOutsideBelow',
  from: sashaFrontOutsideAbove,
  draft: ({ store, sa, points, paths, snippets, options, macro, log, part }) => {
    if (!options.withPocket) {
      return part.hide()
    }

    // Hide frontoutsideabove paths
    for (const key of Object.keys(paths)) paths[key].hide()
    for (const i in snippets) delete snippets[i] // also remove notches (only notches are at waist ==> above pocket)

    //reuse paths.begin, .middle, .end and .chopper from frontoutsideabove

    log.debug('reusing chopped parts, about to recombine')
    let chopped
    if (store.get('directionForBelow')) {
      // use halvesOfThatCutsB together with begin and end
      log.debug('using pathThatCuts instead of middle')

      chopped = paths.begin.join(paths.chopper.reverse()).join(paths.end)
    } else {
      log.debug('using middle followed by pathThatCuts')

      chopped = paths.middle.join(paths.chopper.reverse())
    }

    /*     // hide the parts
    paths.begin.hide()
    paths.middle.hide()
    paths.end.hide()
    paths.chopper.hide() */

    paths.seam = chopped.addClass('fabric')

    // cutlist
    store.cutlist.setCut({ cut: 2, from: 'fabric', onFold: false })

    // grainline
    macro('grainline', {
      from: points.pocketEnd.shift(0, -20),
      to: points.sideSkirtHem.shift(0, -20),
    })

    // title
    points.titleAnchor = points.godetEnd.shiftFractionTowards(points.sideHem, 0.5)
    macro('title', {
      at: points.titleAnchor,
      nr: '2b',
      title: 'frontOutsideBelow',
    })

    if (sa) paths.sa = paths.seam.offset(sa).attr('class', 'fabric sa')

    // dimensions for paperless
    macro('vd', {
      from: points.pocketStart,
      to: points.pocketEnd,
      x: points.pocketEnd.x + sa + 15,
      id: 'pocketVertical',
    })
    macro('hd', {
      from: points.pocketStart,
      to: points.pocketEnd,
      y: points.pocketStart.y - sa - 15,
      id: 'pocketHorizontal',
    })
    macro('vd', {
      from: points.pocketEnd,
      to: points.sideSkirtHem,
      x: points.sideHem.x + sa + 15,
      id: 'hemToPocket',
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
