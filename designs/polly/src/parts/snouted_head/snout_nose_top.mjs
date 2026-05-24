import { scaleAllPoints } from '../../shared.mjs'
import { snout_forehead } from './snout_forehead.mjs'

function draftPollyNoseTop({
  Path,
  Point,
  paths,
  points,
  measurements,
  options,
  utils,
  macro,
  part,
  sa,
  log,
  store,
  Snippet,
  snippets,
}) {
  if (options.faceType != 'snout') {
    return part
  }

  // Path: path2
  // m 555.047 253.164
  points.noseTop = new Point(555, 253.2)
  // c -33.5354 -0.36891 -95.8548 -11.805 -123.584 -21.0277
  points.noseOuter_cp1 = new Point(521.5, 252.6)
  points.noseOuter_cp2 = new Point(459.1, 241.2)
  points.noseOuter_ep = new Point(431.4, 232)
  // c 6.73408 30.6763 11.6836 58.9012 16.2319 83.742
  points.noseNotch_cp1 = new Point(437.7, 262.7)
  points.noseNotch_cp2 = new Point(442.7, 290.9)
  points.noseNotch_ep = new Point(447.2, 315.7)
  // c 35.9819 19.8903 76.3739 27.5295 106.983 28.037
  points.noseBottom_cp1 = new Point(483, 335.9)
  points.noseBottom_cp2 = new Point(523.4, 343.5)
  points.noseBottom_ep = new Point(554, 344)

  const snoutHeadScale = store.get('snoutHeadScale')
  scaleAllPoints(part, options.totalSize * snoutHeadScale * options.headScale)

  paths.noseTop = new Path()
    .move(points.noseTop)
    .curve(points.noseOuter_cp1, points.noseOuter_cp2, points.noseOuter_ep)

  paths.noseEnd = new Path()
    .move(points.noseNotch_ep)
    .curve(points.noseBottom_cp1, points.noseBottom_cp2, points.noseBottom_ep)

  paths.path2 = new Path()
    // inkex.paths.move: m 555.047 253.164
    .move(points.noseTop)
    // inkex.paths.curve: c -33.5354 -0.36891 -95.8548 -11.805 -123.584 -21.0277
    .join(paths.noseTop)
    // inkex.paths.curve: c 6.73408 30.6763 11.6836 58.9012 16.2319 83.742
    .curve(points.noseNotch_cp1, points.noseNotch_cp2, points.noseNotch_ep)
    .join(paths.noseEnd)

  macro('mirror', {
    clone: true,
    mirror: [points.noseTop, points.noseBottom_ep],
    paths: Object.keys(paths),
    points: Object.keys(points),
  })

  paths.saBasis = paths.path2.join(paths.mirroredPath2.reverse())

  //1 from main fabric
  store.cutlist.addCut({ cut: 1 })

  points.title = points.noseTop.shiftFractionTowards(points.noseBottom_ep, 0.75)
  macro('title', {
    at: points.title,
    nr: '7b',
    title: 'snout_nose_top',
    scale: options.totalSize * 0.5,
  })

  if (options.helpText) {
    paths.noseTopTextPath = paths.noseTop.reverse().join(paths.mirroredNoseTop).reverse()
    macro('banner', {
      id: 'noseTop',
      path: paths.noseTopTextPath,
      text: 'polly:noseTop',
      spaces: 1,
    })

    paths.noseEndTextPath = paths.noseEnd.join(paths.mirroredNoseEnd.reverse()).reverse()
    macro('banner', {
      id: 'noseEnd',
      path: paths.noseEndTextPath,
      text: 'polly:noseEnd',
      spaces: 1,
    })
  }

  snippets.noseNotch = new Snippet('notch', points.noseOuter_ep)
  snippets.noseBNotch = new Snippet('bnotch', points.noseNotch_ep)

  snippets.mirroredNoseNotch = new Snippet('notch', points.mirroredNoseOuter_ep)
  snippets.mirroredNoseBNotch = new Snippet('bnotch', points.mirroredNoseNotch_ep)

  //grainline
  points.grainlineFrom = points.noseTop.shiftFractionTowards(points.noseNotch_ep, 0.4)
  points.grainlineTo = new Point(points.grainlineFrom.x, points.noseNotch_ep.y)
  macro('grainline', {
    from: points.grainlineFrom,
    to: points.grainlineTo,
  })

  //Paperless
  macro('vd', {
    id: 'snoutNoseHeight',
    from: points.mirroredNoseOuter_ep,
    to: points.mirroredNoseBottom_ep,
    x: points.mirroredNoseOuter_ep.x + (sa + 15),
  })
  macro('hd', {
    id: 'snoutNoseWidth',
    from: points.noseOuter_ep,
    to: points.mirroredNoseOuter_ep,
    y: points.mirroredNoseBottom_ep.y + (sa + 15),
  })

  if (sa) {
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  return part
}

export const snout_nose_top = {
  name: 'polly.snout_nose_top',
  draft: draftPollyNoseTop,
  after: snout_forehead,

  measurements: [],
  options: {},
}
