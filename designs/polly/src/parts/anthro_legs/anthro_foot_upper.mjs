import { scaleAllPoints } from '../../shared.mjs'
import { leg } from '../leg/leg.mjs'
import { anthro_leg_outer } from './anthro_leg_outer.mjs'

function draftPollyAnthroFootUpper({
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
  if (options.legType != 'anthro') return part

  const drawAnkleUpper = () => {
    return new Path()
      .move(points.ankleCenter_ep)
      .curve(points.ankleOuter_cp1, points.ankleOuter_cp2, points.ankleOuter_ep)
  }

  // Path: footUpperPathHalf
  // M 8.5086 -2.18695
  points.footUpperPathHalf_p1 = new Point(8.5, -2.2)
  // C 25.551 115.655 62.4745 237.806 140.786 296.677
  points.toePoint_cp1 = new Point(25.6, 115.7)
  points.toePoint_cp2 = new Point(62.5, 237.8)
  points.toePoint_ep = new Point(140.8, 296.7)
  // c 62.6239 -45.4428 79.2449 -88.7963 93.4208 -150.465
  points.dartCenter_cp1 = new Point(203.6, 251.6)
  points.dartCenter_cp2 = new Point(220.2, 208.2)
  points.dartCenter_ep = new Point(236, 146.5)
  // c 11.4449 47.5881 21.6804 100.654 94.2476 150.465
  // C 402.047 20.3661 314.311 37.5945 238.006 38.2054
  points.ankleCenter_ep = new Point(236, 38.2)
  // C 160.333 38.8273 49.248 16.0266 8.5086 -2.18695
  points.ankleOuter_cp1 = new Point(160.3, 38.8)
  points.ankleOuter_cp2 = new Point(49.2, 16)
  points.ankleOuter_ep = new Point(8.5, -2.2)
  // Z

  points.title = new Point(100, 170)

  scaleAllPoints(
    part,
    (options.totalSize * store.get('anthroLegScale') * options.footUpperSize * 25.9788118304098) /
      27.33725136737549
  )

  paths.anklePathHalf = drawAnkleUpper()

  log.debug('Foot upper ankle half length is ' + paths.anklePathHalf.length())

  paths.footCurve = new Path()
    .move(points.ankleOuter_ep)
    .curve(points.toePoint_cp1, points.toePoint_cp2, points.toePoint_ep)

  log.debug('Foot upper curve half length is ' + paths.footCurve.length())
  store.set('footCurveHalf', paths.footCurve.length())

  paths.footUpperPathHalf = new Path()
    // inkex.paths.Move: M 8.5086 -2.18695
    .move(points.ankleCenter_ep)
    // inkex.paths.Curve: C 160.333 38.8273 49.248 16.0266 8.5086 -2.18695
    .join(paths.anklePathHalf)
    // inkex.paths.ZoneClose: Z

    // inkex.paths.Curve: C 25.551 115.655 62.4745 237.806 140.786 296.677
    .join(paths.footCurve)
    // inkex.paths.curve: c 62.6239 -45.4428 79.2449 -88.7963 93.4208 -150.465
    .curve(points.dartCenter_cp1, points.dartCenter_cp2, points.dartCenter_ep)
  //.close()

  snippets.ankleCenterNotch = new Snippet('notch', points.ankleCenter_ep)

  macro('mirror', {
    clone: true,
    mirror: [points.ankleCenter_ep, points.dartCenter_ep],
    paths: Object.keys(paths),
    points: Object.keys(points),
  })

  if (sa) {
    paths.saBasis = paths.footUpperPathHalf.join(paths.mirroredFootUpperPathHalf.reverse())
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  if (options.helpText) {
    macro('banner', {
      id: 'seamAnthroAnkle',
      path: paths.mirroredAnklePathHalf.reverse().join(paths.anklePathHalf),
      text: 'polly:seamAnthroAnkle',
      spaces: 2,
    })
  }

  // add instructions to cut two from main fabric
  store.cutlist.addCut({ identical: true })

  macro('title', {
    at: points.title,
    nr: '4a',
    title: 'anthro_foot_upper',
    scale: options.totalSize,
  })

  //grainline

  points.grainlineFrom = new Point(1.7 * points.dartCenter_cp1.x, points.ankleCenter_ep.y * 2)
  points.grainlineTo = points.grainlineFrom.shift(-90, points.toePoint_ep.y * 0.6)

  macro('grainline', {
    from: points.grainlineFrom,
    to: points.grainlineTo,
  })

  //Paperless
  macro('vd', {
    id: 'footLength',
    from: points.ankleOuter_ep,
    to: points.toePoint_ep,
    x: points.ankleOuter_ep.x - (sa + 15),
  })

  macro('hd', {
    id: 'footWidth',
    from: points.ankleOuter_ep,
    to: points.mirroredAnkleOuter_ep,
    y: points.toePoint_ep.y + (sa + 15),
  })

  return part
}

export const anthro_foot_upper = {
  name: 'polly.anthro_foot_upper',
  draft: draftPollyAnthroFootUpper,
  after: [leg, anthro_leg_outer],

  measurements: [],
  options: {},
}
