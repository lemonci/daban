import { draft_face_mirrored } from './paths/draft_face_mirrored.mjs'
import { draft_face_split } from './paths/draft_face_split.mjs'

import { head_back } from '../head_back/head_back.mjs'

function draftPollyFace({
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
}) {
  if (options.faceType == 'mirrored') {
    // add instructions to cut one from main fabric
    store.cutlist.addCut({ cut: 1 })
    draft_face_mirrored(
      Path,
      Point,
      paths,
      points,
      measurements,
      options,
      utils,
      macro,
      part,
      log,
      store
    )
    macro('mirror', {
      clone: true,
      mirror: [points.headTopCenter, points.neckCenter],
      paths: Object.keys(paths),
      points: Object.keys(points),
    })
    paths.saBasis = paths.face_path.join(paths.mirroredFace_path.reverse()).hide()

    //grainline
    points.grainlineFrom = points.dartUpperTop_cp2
      .shift(-90, 30 * options.totalSize)
      .shift(-180, 130 * options.totalSize)
    points.grainlineTo = new Point(points.grainlineFrom.x, points.dartLowerBottom_cp2.y)
    macro('grainline', {
      from: points.grainlineFrom,
      to: points.grainlineTo,
    })
  } else if (options.faceType == 'split') {
    draft_face_split(
      Path,
      Point,
      paths,
      points,
      measurements,
      options,
      utils,
      macro,
      part,
      log,
      store
    )
    paths.saBasis = paths.face_path.reverse().hide()

    //Add instructions to cut 2 mirrored
    store.cutlist.addCut()

    //grainline
    points.grainlineFrom = points.dartUpperBottom_cp2.shift(-90, 30 * options.totalSize)
    points.grainlineTo = new Point(points.grainlineFrom.x, points.dartLowerPoint_ep.y)
    macro('grainline', {
      from: points.grainlineFrom,
      to: points.grainlineTo,
    })
  } else {
    //We're drafting the face with the snout, nothing more to do here
    return part
  }

  log.debug('Face neck length is ' + paths.neckCurve.length())

  points.title = points.neckCenter.shiftFractionTowards(points.headTopCenter, 0.5)
  macro('title', { at: points.title, nr: 7, title: 'face', scale: options.totalSize })

  //Paperless
  if (options.paperlessCurves) {
    macro('ld', {
      id: 'faceDartDistance',
      from: points.dartUpperPoint_ep,
      to: points.dartLowerPoint_ep,
    })
  }
  macro('vd', {
    id: 'faceHeight',
    from: points.headTopCenter,
    to: points.neckEdge,
    x: points.dartUpperBottom_ep.x + (sa + 15),
  })
  if (options.faceType == 'mirrored') {
    macro('hd', {
      id: 'faceWidth',
      from: points.mirroredDartUpperBottom_ep,
      to: points.dartUpperBottom_ep,
      y: points.neckEdge.y + (sa + 15),
    })

    if (options.paperlessCurves) {
      macro('pd', {
        path: paths.neckCurve.join(paths.mirroredNeckCurve.reverse()),
        id: 'neckCurveTotal',
        d: 15,
      })
    }
  } else {
    macro('hd', {
      id: 'faceWidth',
      from: points.widestPoint,
      to: points.dartUpperBottom_ep,
      y: points.neckEdge.y + (sa + 15),
    })

    if (options.paperlessCurves) {
      macro('pd', {
        path: paths.neckCurve,
        id: 'neckCurvePd',
        d: 10,
      })
    }
  }

  if (sa) {
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  return part
}

export const face = {
  name: 'polly.face',
  draft: draftPollyFace,
  after: head_back,

  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    faceType: {
      menu: 'parts',
      dflt: 'split',
      list: ['split', 'mirrored', 'snout', 'hairline'],
    },
    hairlineHeadScale: 0.40927,
  },
}
