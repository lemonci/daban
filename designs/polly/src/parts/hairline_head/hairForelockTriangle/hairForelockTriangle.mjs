import { draft_path3 } from './paths/draft_path3.mjs'

function draftPollyHairforelocktriangle({
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

  draft_path3(Path, Point, paths, points, measurements, options, utils, macro, part, store, log)

  //2 mirrored from hair fabric
  store.cutlist.addCut({ from: 'contrast' })

  macro('title', {
    at: points.title,
    nr: '7a',
    title: 'hairForelockTriangle',
    scale: options.totalSize * 0.7,
  })

  if (sa) {
    paths.saBasis = paths.path3
    paths.sa = paths.saBasis.offset(sa).attr('class', 'fabric sa')
  }

  macro('grainline', {
    from: points.grainlineFrom,
    to: points.grainlineTo,
  })

  //Paperless

  macro('vd', {
    id: 'forelockHeight',
    from: points.foreheadCenter_cp2,
    to: points.lowerPoint_ep,
    x: points.crownCenter_ep.x + (sa + 15),
  })
  macro('hd', {
    id: 'forelockWidth',
    from: points.lowerPoint_ep,
    to: points.crownCenter_ep,
    y: points.lowerPoint_ep.y + (sa + 15),
  })

  if (options.paperlessCurves) {
    macro('pd', {
      id: 'foreheadLength',
      path: paths.foreheadSeam,
    })
  }

  if (options.helpText) {
    macro('banner', {
      id: 'hairline',
      path: paths.foreheadSeam,
      text: 'polly:hairline',
      spaces: 2,
    })
  }

  return part
}

export const hairForelockTriangle = {
  name: 'polly.hairForelockTriangle',
  draft: draftPollyHairforelocktriangle,

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
