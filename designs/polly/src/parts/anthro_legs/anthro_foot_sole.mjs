import { scaleAllPoints } from '../../shared.mjs'
import { anthro_foot_upper } from './anthro_foot_upper.mjs'

function draftPollyAnthroFootSole({
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

  const drawHeelPath = () => {
    return new Path()
      .move(points.topCenter_ep)
      .curve(points.heelOuter_cp1, points.heelOuter_cp2, points.heelOuter_ep)
  }

  const drawToePath = () => {
    return (
      new Path()
        .move(points.heelOuter_ep)
        // inkex.paths.curve: c -31.8376 81.7548 -41.0956 201.488 4.91045 230.139
        .curve(points.toeOuter_cp1, points.toeOuter_cp2, points.toeOuter_ep)
        // inkex.paths.curve: c 15.8829 9.89111 37.6033 14.6045 58.4811 13.3672
        .curve(points.toeCenter_cp1, points.toeCenter_cp2, points.toeCenter_ep)
    )
  }

  // Path: path3
  // m 56.1169 39.0665
  points.path3_p1 = new Point(56.1, 39.1)
  // c -31.8376 81.7548 -41.0956 201.488 4.91045 230.139
  points.toeOuter_cp1 = new Point(24.2, 120.8)
  points.toeOuter_cp2 = new Point(14.9, 240.5)
  points.toeOuter_ep = new Point(60.9, 269.1)
  // c 15.8829 9.89111 37.6033 14.6045 58.4811 13.3672
  points.toeCenter_cp1 = new Point(76.9, 278.9)
  points.toeCenter_cp2 = new Point(98.6, 282.5)
  points.toeCenter_ep = new Point(116, 283)
  // C 161.518 21.6559 130.797 20.9726 111.853 21.5999
  points.topCenter_cp1 = new Point(161.5, 21.7)
  points.topCenter_cp2 = new Point(130.8, 21)
  points.topCenter_ep = new Point(116, 21.6)
  // C 92.3939 22.2443 62.4497 22.8048 56.1169 39.0665
  points.heelOuter_cp1 = new Point(92.4, 22.2)
  points.heelOuter_cp2 = new Point(62.4, 22.8)
  points.heelOuter_ep = new Point(56.1, 39.1)
  // Z

  points.scalePoint = points.topCenter_ep.shiftFractionTowards(points.toeCenter_ep, 0.5)

  points.title = new Point(100, 200)

  scaleAllPoints(part, options.totalSize * store.get('anthroLegScale'))

  //Scale the whole piece to match the heel length properly
  paths.heelPath = drawHeelPath()
  const heelLength = store.get('heelLength') / 2
  log.debug('Scaling foot heel by ' + heelLength / paths.heelPath.length())
  scaleAllPoints(part, heelLength / paths.heelPath.length())
  paths.heelPath = drawHeelPath()

  paths.toePath = drawToePath()
  const footCurveLength = store.get('footCurveHalf')

  let footCurveDelta = paths.toePath.length() - footCurveLength

  const footScalePoints = [
    'toeCenter_ep',
    'toeCenter_cp1',
    'toeCenter_cp2',
    'toeOuter_ep',
    'toeOuter_cp2',
  ]

  let footCurveIterations = 0

  while (footCurveIterations < 5 && Math.abs(footCurveDelta) > 0.001 * options.totalSize) {
    log.debug('Foot curve iteration ' + footCurveIterations + ', foot delta ' + footCurveDelta)

    for (let p of footScalePoints) {
      points[p] = points[p].shiftTowards(points.scalePoint, footCurveDelta * 0.715)
    }

    paths.toePath = drawToePath()
    footCurveDelta = paths.toePath.length() - footCurveLength

    footCurveIterations = footCurveIterations + 1
  }

  paths.saHalf = paths.heelPath.join(paths.toePath)

  //Define outer points for paperless reasons
  points.toeWidestPoint = paths.toePath.shiftFractionAlong(0.5)

  macro('mirror', {
    clone: true,
    mirror: [points.topCenter_ep, points.toeCenter_ep],
    paths: Object.keys(paths),
    points: Object.keys(points),
  })

  if (sa) {
    paths.saBasis = paths.saHalf.join(paths.mirroredSaHalf.reverse())
    paths.sa = paths.saBasis.offset(sa).attr('class', 'fabric sa')
  }

  snippets.heelNotch = new Snippet('notch', paths.heelPath.end())
  snippets.mirroredHeelNotch = new Snippet('notch', paths.mirroredHeelPath.end())

  // add instructions to cut two from main fabric
  store.cutlist.addCut({ identical: true })

  macro('title', {
    at: points.title,
    nr: '4b',
    title: 'anthro_foot_sole',
    scale: options.totalSize * 0.7,
  })

  //grainline
  points.grainlineFrom = points.heelOuter_ep.shift(-70, 25 * options.totalSize)
  points.grainlineTo = new Point(points.grainlineFrom.x, points.toeCenter_cp1.y * 0.8)
  macro('grainline', {
    from: points.grainlineFrom,
    to: points.grainlineTo,
  })

  //Paperless
  macro('vd', {
    id: 'footLength',
    from: points.topCenter_ep,
    to: points.toeCenter_ep,
    x: points.toeOuter_cp1.x - (sa + 15),
  })

  macro('hd', {
    id: 'footWidth',
    from: points.toeWidestPoint,
    to: points.mirroredToeWidestPoint,
    y: points.toeCenter_ep.y + (sa + 15),
  })

  return part
}

export const anthro_foot_sole = {
  name: 'polly.anthro_foot_sole',
  draft: draftPollyAnthroFootSole,
  after: [anthro_foot_upper],

  measurements: [],
  options: {},
}
