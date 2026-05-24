import { draft_path6 } from './paths/draft_path6.mjs'

import { neckBack } from '../neckBack/neckBack.mjs'

function draftPollyFaceforelock({
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

  draft_path6(Path, Point, paths, points, measurements, options, utils, macro, part, store, log)

  //2 mirrored from main fabric
  store.cutlist.addCut()
  macro('title', { at: points.title, nr: '7b', title: 'faceForelock', scale: options.totalSize })

  if (sa) {
    paths.saBasis = paths.path6
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  points.grainlineTo = new Point(points.grainlineFrom.x, points.dartBottom.y)
  macro('grainline', {
    from: points.grainlineFrom,
    to: points.grainlineTo,
  })

  //Paperless

  macro('vd', {
    id: 'faceForelockHeight',
    from: points.foreheadCenter_ep,
    to: points.neckOuter_ep,
    x: points.dartTop_ep.x + (sa + 15),
  })

  macro('hd', {
    id: 'faceForelockWidth',
    from: points.neckInner_cp2,
    to: points.dartTop_ep,
    y: points.neckOuter_ep.y + (sa + 15),
  })

  if (options.paperlessCurves) {
    macro('pd', {
      id: 'hairCurveLength',
      path: paths.hairCurve,
    })
  }

  if (options.helpText) {
    macro('banner', {
      id: 'hairline',
      path: paths.hairCurve,
      text: 'polly:hairline',
      spaces: 2,
    })
  }

  return part
}

export const faceForelock = {
  name: 'polly.faceForelock',
  draft: draftPollyFaceforelock,
  after: neckBack,

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
