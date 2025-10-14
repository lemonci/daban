import { pctBasedOn } from '@freesewing/core'
import { frontOutside as sashaFrontOutside } from '@freesewing/sasha'

function draft_pocketEdges(
  Path,
  Point,
  paths,
  points,
  measurements,
  options,
  utils,
  macro,
  store,
  part
) {
  // Path: pocketEdges
  const scaling = (-1 * store.get('pocketWidth')) / (81.419 - 30.1638)
  points.pocketEdges_p2 = new Point(30.1638 * scaling, 181.4612 * scaling)
  points.pocketEdges_p3_cp1 = new Point(30.584 * scaling, 195.7832 * scaling)
  points.pocketEdges_p3_cp2 = new Point(28.5768 * scaling, 205.356 * scaling)
  points.pocketEdges_p3_ep = new Point(25.317 * scaling, 220.5554 * scaling)
  points.pocketEdges_p4_cp1 = new Point(23.0427 * scaling, 249.2232 * scaling)
  points.pocketEdges_p4_cp2 = new Point(52.5555 * scaling, 255.0394 * scaling)
  points.pocketEdges_p4_ep = new Point(72.7078 * scaling, 241.9014 * scaling)
  points.pocketEdges_p5_cp1 = new Point(76.9389 * scaling, 239.571 * scaling)
  points.pocketEdges_p5_cp2 = new Point(79.2694 * scaling, 228.8256 * scaling)
  points.pocketEdges_p5_ep = new Point(81.4191 * scaling, 217.1457 * scaling)
  points.pocketEdges_p6 = new Point(81.4191 * scaling, 179.3808 * scaling)
  points.pocketEdges_p1 = new Point(
    30.1638 * scaling,
    points.pocketEdges_p6.y - store.get('pocketOpeningHeight')
  )

  paths.pocketEdges = new Path()
    .move(points.pocketEdges_p1)
    .line(points.pocketEdges_p2)
    .curve(points.pocketEdges_p3_cp1, points.pocketEdges_p3_cp2, points.pocketEdges_p3_ep)
    .curve(points.pocketEdges_p4_cp1, points.pocketEdges_p4_cp2, points.pocketEdges_p4_ep)
    .curve(points.pocketEdges_p5_cp1, points.pocketEdges_p5_cp2, points.pocketEdges_p5_ep)
    .line(points.pocketEdges_p6)
}

function draftPocket({
  Path,
  Point,
  paths,
  points,
  snippets,
  measurements,
  options,
  utils,
  macro,
  store,
  part,
}) {
  if (!options.withPocket) {
    return part.hide()
  }

  // hide all paths inherited from frontOutside
  for (const key of Object.keys(paths)) paths[key].hide()
  for (const i in snippets) delete snippets[i] // also remove notches

  // path is drafted from top left (= highest) corner to bottom to top ==> counterclockwise
  draft_pocketEdges(Path, Point, paths, points, measurements, options, utils, macro, store, part)

  // shift the edges to match the opening (so we can merge with frontoutsideabove later)

  let shiftedEdges = paths.pocketEdges.translate(
    points.pocketEdges_p6.dx(points.pocketEnd),
    points.pocketEdges_p6.dy(points.pocketEnd)
  )

  store.set('pocketEdges', shiftedEdges)

  // reverse the pocketOpening to fit the counterclockwise direction
  paths.seam = shiftedEdges.join(paths.pocketOpening.reverse()).addClass('fabric')

  points.titleAnchor = points.pocketEdges_p1
    .shiftFractionTowards(points.pocketEdges_p4_ep, 0.5)
    .translate(
      points.pocketEdges_p6.dx(points.pocketEnd),
      points.pocketEdges_p6.dy(points.pocketEnd)
    )

  // cutlist
  store.cutlist.setCut({ cut: 2, from: 'fabric', onFold: false })

  // grainline
  macro('grainline', {
    from: points.pocketEnd.shift(0, -20).shift(90, -20),
    to: points.pocketEdges_p5_ep
      .translate(
        points.pocketEdges_p6.dx(points.pocketEnd),
        points.pocketEdges_p6.dy(points.pocketEnd)
      )
      .shift(0, -20),
  })

  // title
  macro('title', {
    at: points.titleAnchor,
    nr: 6,
    title: 'pocket',
  })

  paths.pocketEdges.hide()

  return part
}

export const pocket = {
  name: 'sasha.pocket',
  from: sashaFrontOutside,
  draft: draftPocket,
}
