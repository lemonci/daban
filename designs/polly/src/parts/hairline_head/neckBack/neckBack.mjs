import { draft_path4 } from './paths/draft_path4.mjs'

import { arm_top } from '../../arm_top/arm_top.mjs'
import { body_back } from '../../body_back/body_back.mjs'

function draftPollyNeckback({
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
  log,
  sa,
}) {
  if (options.faceType != 'hairline') {
    return part
  }

  draft_path4(Path, Point, paths, points, measurements, options, utils, macro, part, store, log)

  //2 mirrored from main fabric
  store.cutlist.addCut()

  macro('title', { at: points.title, nr: '8b', title: 'neckBack', scale: options.totalSize * 0.5 })

  if (sa) {
    paths.saBasis = paths.path4
    paths.sa = paths.saBasis.offset(sa).attr('class', 'fabric sa')
  }

  //Paperless
  macro('vd', {
    id: 'neckBackHeight',
    from: points.hairCurveCenter,
    to: points.neckOuter_ep,
    x: points.hairOuter.x + (sa + 15),
  })
  macro('hd', {
    id: 'neckBackWidth',
    from: points.hairCenter_ep,
    to: points.hairOuter,
    y: points.neckOuter_ep.y + (sa + 15),
  })

  if (options.paperlessCurves) {
    macro('pd', {
      id: 'hairCurveLength',
      path: paths.hairCurve,
      //d: 15,
    })
    macro('pd', {
      id: 'neckCurveLength',
      path: paths.neckCurve.reverse(),
      //d: 15,
    })
  }

  //Grainline
  macro('grainline', {
    to: points.neckCurveCenter,
    from: points.hairCurveCenter,
  })

  return part
}

export const neckBack = {
  name: 'polly.neckBack',
  draft: draftPollyNeckback,
  after: [arm_top, body_back],

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
