import { ensureStoreValues } from '../shared.mjs'
import { twoPartSleeve, dimensions } from './shared.mjs'

function draftUndersleeve({
  macro,
  Path,
  points,
  paths,
  snippets,
  Snippet,
  options,
  sa,
  store,
  part,
}) {
  /*
   * If things are missing in the store, flag a warning and return early.
   * Unless we are asked to mock these values.
   */
  if (!ensureStoreValues(twoPartSleeve, 'mockTwoPartSleeve', store, options)) return part

  // Extract seamline from sleeve
  delete paths.ts
  paths.seam = paths.us.clone().unhide().setClass('fabric')
  delete paths.us

  points.anchor = points.usTip.clone()

  // Seam allowance
  if (sa) {
    paths.sa = paths.seam.clone()
    // Remove hem
    paths.sa.ops.splice(-2)
    paths.sa = paths.sa
      .offset(sa)
      .join(
        new Path()
          .move(points.usWristLeft)
          .line(points.usWristRight)
          .offset(sa * 3)
      )
      .close()
      .attr('class', 'fabric sa')
  }

  /*
   * Annotatinos
   */

  // Cutlist
  store.cutlist.addCut({ cut: 2, from: 'fabric' })

  // Logo
  snippets.logo = new Snippet('logo', points.elbowCenter)

  // Title
  macro('title', {
    at: points.armCenter,
    nr: 4,
    title: 'undersleeve',
  })

  // Dimensions
  dimensions(part, 'us')
  macro('hd', {
    id: 'wArmholeInnerSleeveCapTip',
    from: points.usLeftEdge,
    to: points.usTip,
    y: points.usTip.y - sa - 15,
  })
  macro('vd', {
    id: 'hArmholeInnerSleeveCapTip',
    from: points.tsRightEdge,
    to: points.usTip,
    x: points.tsRightEdge.x + sa + 15,
  })

  return part
}

export const undersleeve = {
  name: 'library.undersleeve',
  from: twoPartSleeve,
  draft: draftUndersleeve,
  options: twoPartSleeve.options,
}
