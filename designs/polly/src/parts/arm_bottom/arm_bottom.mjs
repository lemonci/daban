import { pctBasedOn } from '@freesewing/core'
import { draft_path64 } from './paths/draft_path64.mjs'
import { body_front } from '../body_front/body_front.mjs'
import { arm_top } from '../arm_top/arm_top.mjs'

function draftPollyArm_bottom({
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
  draft_path64(Path, Point, paths, points, measurements, options, utils, macro, part, store, log)

  points.armWidest = paths.armCurvePath.shiftFractionAlong(0.55)

  //snippets.backRaglanNotch = new Snippet('notch', points.armpitPointRight_ep)
  snippets.bottom = new Snippet('bnotch', points.curveBottom)

  macro('mirror', {
    clone: true,
    mirror: [points.armpitCenter_ep, points.curveBottom],
    paths: Object.keys(paths),
    points: Object.keys(points),
  })

  if (options.paperlessCurves) {
    macro('pd', {
      id: 'armpitCurveLength',
      path: paths.armpitPath.reverse().join(paths.mirroredArmpitPath).reverse(),
      //d: 15,
    })

    macro('pd', {
      id: 'armCurveLength',
      path: paths.armCurvePath.reverse(),
      //d: 15,
    })
  }

  //Paperless
  macro('vd', {
    id: 'armLength',
    from: points.armpitPointRight_ep,
    to: points.curveBottom,
    x: points.mirroredArmWidest.x - (sa + 15),
  })

  macro('hd', {
    id: 'armWidth',
    from: points.mirroredArmWidest,
    to: points.armWidest,
    y: points.curveBottom.y + (sa + 15),
  })

  if (options.helpText) {
    paths.armpitTextPath = paths.armpitPath.reverse().join(paths.mirroredArmpitPath)
    macro('banner', {
      id: 'seamArmscye',
      path: paths.armpitTextPath,
      text: 'polly:seamArmscye',
      spaces: 2,
    })
  }

  if (sa) {
    paths.saBasis = paths.path64.join(paths.mirroredPath64.reverse()).reverse()
    paths.sa = paths.saBasis.offset(sa).attr('class', 'fabric sa')
  }

  // add instructions to cut two mirrored from main fabric
  store.cutlist.addCut()

  macro('title', { at: points.title, nr: 5, title: 'arm_bottom', scale: options.totalSize })

  //grainline
  points.grainlineFrom = points.armpitPointRight_cp1
  points.grainlineTo = new Point(points.grainlineFrom.x, points.armWideRight_ep.y)
  macro('grainline', {
    from: points.grainlineFrom,
    to: points.grainlineTo,
  })

  return part
}

export const arm_bottom = {
  name: 'polly.arm_bottom',
  draft: draftPollyArm_bottom,
  after: [body_front, arm_top],

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
