import { scaleAllPoints } from '../../shared.mjs'
import { face } from '../face/face.mjs'

function draftPollySnoutForehead({
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

  const drawForeheadCurve = () => {
    return (
      new Path()
        .move(points.foreheadOuter_ep)
        .curve(points.foreheadCurve_cp1, points.foreheadCurve_cp2, points.foreheadCurve_ep)
        // inkex.paths.curve: c 14.274 44.1525 11.4458 107.872 15.2033 138.375
        .curve(points.noseOuter_cp1, points.noseOuter_cp2, points.noseOuter_ep)
    )
  }

  // Path: path1
  // m 745.898 707.97
  points.foreheadDart = new Point(745.9, 708)
  // c -0.86438 -89.2556 -21.2388 -163.446 -52.0135 -245.58
  points.foreheadCenter_cp1 = new Point(745.1, 618.7)
  points.foreheadCenter_cp2 = new Point(724.8, 544.6)
  points.foreheadCenter_ep = new Point(694, 462.4)
  // c -63.6665 23.1896 -130.072 49.972 -181.714 84.3707
  points.foreheadOuter_cp1 = new Point(630.3, 485.2)
  points.foreheadOuter_cp2 = new Point(563.9, 512)
  points.foreheadOuter_ep = new Point(512.3, 546.4)
  // c 27.7801 44.1584 72.0325 101.864 90.9318 160.324
  points.foreheadCurve_cp1 = new Point(539.8, 590.2)
  points.foreheadCurve_cp2 = new Point(584, 647.9)
  points.foreheadCurve_ep = new Point(602.9, 706.3)
  // c 14.274 44.1525 11.4458 107.872 15.2033 138.375
  points.noseOuter_cp1 = new Point(617.3, 750.2)
  points.noseOuter_cp2 = new Point(614.4, 813.9)
  points.noseOuter_ep = new Point(618.2, 844.4)
  // c 37.4439 -3.55449 84.7148 2.49341 128.636 1.80843
  points.noseCenter_cp1 = new Point(655.4, 840.4)
  points.noseCenter_cp2 = new Point(702.7, 846.5)
  points.noseCenter_ep = new Point(746.6, 845.8)

  points.grainlineFrom = new Point(670, 590)

  const snoutHeadScale = (0.5 * 333.27 * (350 / 327) * (350 / 353)) / 345.15

  store.set('snoutHeadScale', snoutHeadScale)

  scaleAllPoints(part, options.totalSize * snoutHeadScale * options.headScale)

  paths.foreheadTopSeam = drawForeheadCurve()

  store.set('foreheadTopSeamLength', paths.foreheadTopSeam.length())
  log.debug('Forehead only length is ' + paths.foreheadTopSeam.length())

  paths.noseTop = new Path().move(points.noseOuter_ep).line(points.noseCenter_ep)

  paths.path1 = new Path()
    // inkex.paths.move: m 745.898 707.97
    .move(points.foreheadDart)
    // inkex.paths.curve: c -0.86438 -89.2556 -21.2388 -163.446 -52.0135 -245.58
    .curve(points.foreheadCenter_cp1, points.foreheadCenter_cp2, points.foreheadCenter_ep)
    // inkex.paths.curve: c -63.6665 23.1896 -130.072 49.972 -181.714 84.3707
    .curve(points.foreheadOuter_cp1, points.foreheadOuter_cp2, points.foreheadOuter_ep)
    .join(paths.foreheadTopSeam)
    // inkex.paths.curve: c 37.4439 -3.55449 84.7148 2.49341 128.636 1.80843
    .join(paths.noseTop)
    .hide()

  macro('mirror', {
    clone: true,
    mirror: [points.foreheadDart, points.noseCenter_ep],
    paths: Object.keys(paths),
    points: Object.keys(points),
  })

  paths.saBasis = paths.path1.join(paths.mirroredPath1.reverse()).close()

  if (options.helpText) {
    paths.noseTopTextPath = paths.noseTop.join(paths.mirroredNoseTop.reverse())
    macro('banner', {
      id: 'noseTop',
      path: paths.noseTopTextPath,
      text: 'polly:noseTop',
      spaces: 1,
    })

    macro('banner', {
      id: 'templeCurve',
      path: paths.foreheadTopSeam,
      text: 'polly:templeCurve',
      spaces: 1,
    })

    macro('banner', {
      id: 'templeCurveMirrored',
      path: paths.mirroredForeheadTopSeam.reverse(),
      text: 'polly:templeCurve',
      spaces: 1,
    })
  }

  //1 from main fabric
  store.cutlist.addCut({ cut: 1 })

  points.title = points.foreheadDart.shiftFractionTowards(points.noseCenter_ep, 0.5)
  macro('title', { at: points.title, nr: '7a', title: 'snout_forehead', scale: options.totalSize })
  if (sa) {
    paths.sa = paths.saBasis.offset(sa).attr('class', 'fabric sa')
  }

  //grainline
  points.grainlineTo = new Point(points.grainlineFrom.x, points.noseOuter_cp1.y)
  macro('grainline', {
    from: points.grainlineFrom,
    to: points.grainlineTo,
  })

  snippets.noseNotch = new Snippet('notch', points.noseOuter_ep)
  snippets.mirroredNoseNotch = new Snippet('notch', points.mirroredNoseOuter_ep)

  //Paperless
  macro('vd', {
    id: 'foreheadHeight',
    from: points.foreheadCenter_ep,
    to: points.noseCenter_ep,
    x: points.mirroredForeheadOuter_ep.x + (sa + 15),
  })
  macro('hd', {
    id: 'foreheadWidth',
    from: points.foreheadOuter_ep,
    to: points.mirroredForeheadOuter_ep,
    y: points.noseCenter_ep.y + (sa + 15),
  })

  return part
}

export const snout_forehead = {
  name: 'polly.snout_forehead',
  draft: draftPollySnoutForehead,
  after: face,

  measurements: [],
  options: {},
}
