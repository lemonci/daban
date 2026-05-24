import { pctBasedOn } from '@freesewing/core'
import { draft_path127 } from './paths/draft_path127.mjs'

import { arm_top } from '../arm_top/arm_top.mjs'
import { body_back } from '../body_back/body_back.mjs'

function draftPollyHead_back({
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
  if (options.faceType == 'hairline') {
    return part
  }

  draft_path127(Path, Point, paths, points, measurements, options, utils, macro, part, log, store)

  points.ladderOpeningNotch = paths.backSeam.shiftFractionAlong(0.4)
  snippets.ladderOpeningNotch = new Snippet('bnotch', points.ladderOpeningNotch)

  //2 mirrored from main fabric
  store.cutlist.addCut()

  points.title = points.dartBottom_ep.shiftFractionTowards(points.neckCenter_ep, 0.5)
  macro('title', { at: points.title, nr: 8, title: 'head_back', scale: options.totalSize })

  if (options.helpText) {
    paths.ladderOpeningPath = paths.backSeam.split(points.ladderOpeningNotch)[0]
    macro('banner', {
      path: paths.ladderOpeningPath,
      text: 'polly:openToTurn',
    })
  }

  if (sa) {
    paths.saBasis = paths.path127.close()
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  //grainline
  points.grainlineFrom = points.headTip_ep.shift(-90, 60 * options.totalSize)
  points.grainlineTo = new Point(points.grainlineFrom.x, points.backCurveLower_cp2.y)
  macro('grainline', {
    from: points.grainlineFrom,
    to: points.grainlineTo,
  })

  //Paperless
  macro('vd', {
    id: 'headBackHeight',
    from: points.headTip_ep,
    to: points.neckOuter_ep,
    x: points.ladderOpeningNotch.x + (sa + 15),
  })

  macro('hd', {
    id: 'headBackWidth',
    from: points.dartBottom_ep,
    to: points.ladderOpeningNotch,
    y: points.neckOuter_ep.y + (sa + 15),
  })

  if (options.paperlessCurves) {
    macro('pd', {
      path: paths.neckCurve.reverse(),
      id: 'neckCurvePd',
      d: 10,
    })
  }

  return part
}

export const head_back = {
  name: 'polly.head_back',
  draft: draftPollyHead_back,
  after: [arm_top, body_back],
  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    headScale: { pct: 100, min: 50, max: 200, menu: 'style' },
  },
}
