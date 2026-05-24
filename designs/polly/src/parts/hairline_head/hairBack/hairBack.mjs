import { draft_path2 } from './paths/draft_path2.mjs'

function draftPollyHairback({
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
  Snippet,
  snippets,
}) {
  if (options.faceType != 'hairline') {
    return part
  }

  draft_path2(Path, Point, paths, points, measurements, options, utils, macro, part, store)

  //2 mirrored from hair fabric
  store.cutlist.addCut({ from: 'contrast' })
  macro('title', { at: points.title, nr: '8a', title: 'hairBack', scale: options.totalSize })

  if (sa) {
    paths.saBasis = paths.path2
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  //Grainline
  points.grainlineTo = new Point(points.grainlineFrom.x, points.path2_p7_cp2.y)
  macro('grainline', {
    from: points.grainlineFrom,
    to: points.grainlineTo,
  })

  points.ladderOpeningNotch = paths.centerSeam.shiftFractionAlong(0.4)
  snippets.ladderOpeningNotch = new Snippet('bnotch', points.ladderOpeningNotch)

  if (options.helpText) {
    paths.ladderOpeningPath = paths.centerSeam.split(points.ladderOpeningNotch)[0]
    macro('banner', {
      path: paths.ladderOpeningPath,
      text: 'polly:openToTurn',
    })
  }

  //Paperless

  macro('vd', {
    id: 'hairBackHeight',
    from: points.path2_p3_ep,
    to: points.path2_p2_ep,
    x: points.widestPoint.x + (sa + 15),
  })

  macro('hd', {
    id: 'hairBackWidth',
    from: points.path2_p6_ep,
    to: points.widestPoint,
    y: points.path2_p2_ep.y + (sa + 15),
  })

  return part
}

export const hairBack = {
  name: 'polly.hairBack',
  draft: draftPollyHairback,

  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    // Enter your pattern options here. Example:
    /*
        extraLength: {
            pct: 10,
            min: 5,
            max: 20,
            label: 'Extra length',
            menu: 'fit',
            ...pctBasedOn('neck')
        }
        */
  },
}
