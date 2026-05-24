import { draft_body_front } from './paths/draft_body_front.mjs'

function draftPollyBody_front({
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
  store,
  log,
  Snippet,
  snippets,
}) {
  draft_body_front(
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
    log
  )

  snippets.hipCornerNotch = new Snippet('notch', points.hipCorner_ep)
  snippets.armpitNotch = new Snippet('notch', points.armpitNotch_ep)

  const paperlessDistance = 15 * options.totalSize + sa

  macro('mirror', {
    clone: true,
    mirror: [points.neckCenter_ep, points.crotchCenter],
    paths: Object.keys(paths),
    points: Object.keys(points),
  })

  if (options.helpText) {
    macro('banner', {
      id: 'seamBetweenLegs',
      path: paths.hipToCorner.reverse(),
      text: 'polly:seamBetweenLegs',
      spaces: 2,
    })
    macro('banner', {
      id: 'seamBetweenLegs2',
      path: paths.mirroredHipToCorner.reverse().reverse(),
      text: 'polly:seamBetweenLegs',
      spaces: 2,
    })

    macro('banner', {
      id: 'seamLegsFront',
      path: paths.cornerToSide,
      text: 'polly:seamLegsFront',
      spaces: 1,
    })
    macro('banner', {
      id: 'seamLegsFront2',
      path: paths.mirroredCornerToSide.reverse(),
      text: 'polly:seamLegsFront',
      spaces: 1,
    })

    macro('banner', {
      id: 'seamArmscye',
      path: paths.armpitCurve,
      text: 'polly:seamArmscye',
      spaces: 2,
    })
    macro('banner', {
      id: 'seamArmscye2',
      path: paths.mirroredArmpitCurve.reverse(),
      text: 'polly:seamArmscye',
      spaces: 2,
    })

    macro('banner', {
      id: 'seamRaglanFront',
      path: paths.raglanLength,
      text: 'polly:seamRaglanFront',
      spaces: 2,
    })
    macro('banner', {
      id: 'seamRaglanFront2',
      path: paths.mirroredRaglanLength.reverse(),
      text: 'polly:seamRaglanFront',
      spaces: 2,
    })
  }

  points.armpitNotchMirrored = paths.mirroredArmpitCurve.end()
  snippets.armpitNotchMirrored = new Snippet('notch', points.armpitNotchMirrored)

  points.hipNotchMirrored = paths.mirroredHipToCorner.end()
  snippets.hipNotchMirrored = new Snippet('notch', points.hipNotchMirrored)

  if (sa) {
    paths.saBasis = paths.path190.join(paths.mirroredPath190.reverse())
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  //Paperless
  if (options.paperlessCurves) {
    macro('pd', {
      id: 'neckCurveJoined',
      path: paths.neckCurve.join(paths.mirroredNeckCurve.reverse()).reverse(),
      d: sa + 15,
    })

    macro('pd', {
      id: 'armpitCurveLength',
      path: paths.armpitCurve.reverse(),
      d: sa + 15,
    })
    macro('pd', {
      id: 'hipCurveLength',
      path: paths.hipCurve,
      d: (sa + 15) / 2,
    })
    macro('pd', {
      id: 'raglanCurveLength',
      path: paths.raglanLength,
      d: sa + 15,
    })

    macro('pd', {
      id: 'sideSeamLength',
      path: paths.sideSeamCurve,
      d: sa + 15,
    })

    macro('hd', {
      id: 'bottomHipWidth',
      from: points.mirroredCrotchWidth_ep,
      to: points.crotchWidth_ep,
      y: points.crotchCenter.y + 15 / 2,
    })

    macro('hd', {
      id: 'hipSocketWidth',
      from: points.crotchWidth_ep,
      to: points.hipOuter_ep,
      y: points.crotchCenter.y + 15 / 2,
    })
    macro('vd', {
      id: 'hipSocketHeight',
      from: points.crotchWidth_ep,
      to: points.hipOuter_ep,
      x: points.hipOuter_ep.x + 15 / 2,
    })
  }
  macro('hd', {
    id: 'bodyWidth',
    from: points.mirroredHipOuter_ep,
    to: points.hipOuter_ep,
    y: points.mirroredCrotchCenter.y + (sa + 15),
  })
  macro('vd', {
    id: 'bodyHeight',
    from: points.neckOuter_ep,
    to: points.crotchCenter,
    x: points.mirroredHipOuter_ep.x - 15 - sa,
  })

  //Title
  // add instructions to cut one from main fabric
  store.cutlist.addCut({ cut: 1 })

  points.title = points.neckCenter_ep
    .shiftFractionTowards(points.crotchCenter, 0.5)
    .shiftFractionTowards(points.waistControl_cp1, -0.7)
  macro('title', { at: points.title, nr: 1, title: 'body_front', scale: options.totalSize })

  //grainline
  points.grainlineFrom = points.neckCenter_ep.shiftFractionTowards(points.crotchCenter, 0.2)
  points.grainlineTo = points.neckCenter_ep.shiftFractionTowards(points.crotchCenter, 0.5)
  macro('grainline', {
    from: points.grainlineFrom,
    to: points.grainlineTo,
  })

  return part
}

export const body_front = {
  name: 'polly.body_front',
  draft: draftPollyBody_front,

  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    hipExtraWidth: {
      pct: 0,
      min: 0,
      max: 50,
      label: 'Hip extra width',
      menu: 'style',
    },
    torsoLength: {
      pct: 0,
      min: -50,
      max: 50,
      label: 'Torso length',
      menu: 'style',
    },
    totalSize: {
      pct: 33.5,
      min: 5,
      max: 200,
      menu: 'scale',
      toAbs: function (value, settings) {
        return 813 * value
      },
    },
    helpText: { bool: false, menu: 'help' },
    paperlessCurves: { bool: false, menu: 'help' },
  },
}
