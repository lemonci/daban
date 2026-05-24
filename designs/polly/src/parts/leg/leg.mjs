import { draft_legPath } from './paths/draft_legPath.mjs'
import { body_back } from '../body_back/body_back.mjs'

function draftPollyLeg({
  Path,
  Point,
  paths,
  points,
  measurements,
  options,
  utils,
  macro,
  part,
  store,
  sa,
  log,
  Snippet,
  snippets,
}) {
  if (options.legType != 'cylinder') {
    return part
  }

  draft_legPath(Path, Point, paths, points, measurements, options, utils, macro, part, store, log)

  snippets.hipCurveNotch = new Snippet('bnotch', points.hipCurveSnippet)
  snippets.hipCornerNotch = new Snippet('notch', points.hipCornerNotch)

  //2 mirrored from main fabric
  store.cutlist.addCut()

  points.title = points.legEndRight_ep.shiftFractionTowards(points.legTopLeft_ep, 0.5)
  macro('title', { at: points.title, nr: 3, title: 'leg', scale: options.totalSize })

  if (sa) {
    paths.saBasis = paths.legPath
    paths.sa = paths.saBasis.offset(sa).attr('class', 'fabric sa')
  }

  if (options.helpText) {
    paths.legSectionC = paths.hipCurve.split(points.hipCurveSnippet)[0]
    macro('banner', {
      id: 'seamLegsBack',
      path: paths.legSectionC,
      text: 'polly:seamLegsBack',
      spaces: 2,
    })

    paths.legSectionB = paths.hipCurve
      .split(points.hipCurveSnippet)[1]
      .split(points.hipCornerNotch)[0]
    macro('banner', {
      id: 'seamLegsFront',
      path: paths.legSectionB,
      text: 'polly:seamLegsFront',
      spaces: 2,
    })

    paths.legSectionA = paths.hipCurve.split(points.hipCornerNotch)[1]
    macro('banner', {
      id: 'seamBetweenLegs',
      path: paths.legSectionA,
      text: 'polly:seamBetweenLegs',
      spaces: 2,
    })
  }

  points.highestPoint = paths.hipCurve.shiftFractionAlong(0.5)
  const increment = 0.1 * options.totalSize

  let ary = paths.legPath.intersectsY(points.highestPoint.y - increment)
  let x = 0
  while (x < 15 && ary.length > 0) {
    log.info('Leg curve intersects ' + ary.length + ' times at y ' + points.highestPoint.y)
    points.highestPoint = ary[0]
    x = x + 1
    ary = paths.legPath.intersectsY(points.highestPoint.y - increment)
  }

  macro('vd', {
    id: 'highestLength',
    from: points.highestPoint,
    to: points.legEndLeft_ep,
    x: points.highestPoint.x,
  })
  macro('vd', {
    id: 'sideLength',
    from: points.legTopLeft_ep,
    to: points.legEndLeft_ep,
    x: points.legEndLeft_ep.x - 15,
  })
  macro('vd', {
    id: 'sideLength2',
    from: points.legTopRight_ep,
    to: points.legEndRight_ep,
    x: points.legEndRight_ep.x + 15,
  })

  macro('hd', {
    id: 'bottomWidth',
    from: points.legEndLeft_ep,
    to: points.legEndRight_ep,
    y: points.legEndLeft_ep.y + 15,
  })

  macro('hd', {
    id: 'cornerNotchX',
    from: points.legTopLeft_ep,
    to: points.hipCornerNotch,
    y: points.hipCornerNotch.y,
  })

  macro('vd', {
    id: 'cornerNotchY',
    from: points.legTopLeft_ep,
    to: points.hipCornerNotch,
    x: points.hipCornerNotch.x,
  })

  macro('hd', {
    id: 'curveNotchX',
    from: points.hipCurveSnippet,
    to: points.legTopRight_ep,
    y: points.hipCurveSnippet.y,
  })

  macro('vd', {
    id: 'curveNotchY',
    from: points.hipCurveSnippet,
    to: points.legTopRight_ep,
    x: points.hipCurveSnippet.x,
  })

  //grainline
  points.grainlineFrom = points.curve5_ep.shift(-90, 50 * options.totalSize * options.legLength)
  points.grainlineTo = points.curve5_ep.shift(-90, 250 * options.totalSize * options.legLength)
  macro('grainline', {
    from: points.grainlineFrom,
    to: points.grainlineTo,
  })

  return part
}

export const leg = {
  name: 'polly.leg',
  draft: draftPollyLeg,
  after: body_back,

  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    legFlare: {
      pct: 100,
      min: 20,
      max: 200,
      menu: (_settings, mergedOptions) => (mergedOptions?.legType == 'cylinder' ? 'style' : false),
    },
    legLength: {
      pct: 100,
      min: 50,
      max: 150,
      menu: (_settings, mergedOptions) => (mergedOptions?.legType == 'cylinder' ? 'style' : false),
    },

    legType: {
      dflt: 'cylinder',
      list: ['cylinder', 'anthro'],
      menu: 'parts',
    },
  },
}
