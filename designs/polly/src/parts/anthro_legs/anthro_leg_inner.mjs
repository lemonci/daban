import { scaleAllPoints } from '../../shared.mjs'
import { leg } from '../leg/leg.mjs'
import { anthro_leg_outer } from './anthro_leg_outer.mjs'

function draftPollyAnthroLegInner({
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
      .move(points.ankleLowestPoint_ep)
      .curve(points.ankleTop_cp1, points.ankleTop_cp2, points.ankleTop_ep)
  }

  // Path: path8
  // m 173.979 804.303
  points.path8_p1 = new Point(174, 804.3)
  // c 42.1486 -65.1356 76.6882 -142.428 125.974 -178.301
  points.ankleTop_cp1 = new Point(216.1, 738.9)
  points.ankleTop_cp2 = new Point(250.7, 661.6)
  points.ankleTop_ep = new Point(300, 625.7)
  // c -16.4136 -39.3227 -38.2998 -57.1323 -33.37 -88.1667
  points.hockInner_cp1 = new Point(283.6, 586.7)
  points.hockInner_cp2 = new Point(261.7, 568.9)
  points.hockInner_ep = new Point(266.6, 537.8)
  // c 2.69088 -16.9397 82.4058 -81.4912 99.9896 -163.634
  points.kneeCurve_cp1 = new Point(269.7, 521.1)
  points.kneeCurve_cp2 = new Point(349.4, 456.5)
  points.kneeCurve_ep = new Point(367, 374.4)
  // c 18.0344 -84.248 -5.01096 -195.772 -23.2593 -261.71
  points.thighUpperPoint_cp1 = new Point(385, 289.8)
  points.thighUpperPoint_cp2 = new Point(362, 178.2)
  points.thighUpperPoint_ep = new Point(343.7, 112.3)
  // c -18.375 27.7611 -24.8839 64.274 -53.1352 82.377
  points.crotchCurve_cp1 = new Point(325.6, 139.8)
  points.crotchCurve_cp2 = new Point(319.1, 176.3)
  points.crotchCurve_ep = new Point(290.9, 194.4)
  // C 235.688 229.784 161.027 216.944 97.1037 215.301
  points.thighBack_cp1 = new Point(235.7, 229.8)
  points.thighBack_cp2 = new Point(161, 216.9)
  points.thighBack_ep = new Point(97.1, 215.3)
  // C 93.6092 263.073 83.8456 311.509 76.1889 344.62
  points.kneeBack_cp1 = new Point(93.6, 263.1)
  points.kneeBack_cp2 = new Point(83.8, 311.5)
  points.kneeBack_ep = new Point(76.2, 344.6)
  // C 68.7831 376.645 36.6822 494.932 37.7508 519.643
  points.hockBack_cp1 = new Point(68.8, 376.6)
  points.hockBack_cp2 = new Point(36.7, 494.9)
  points.hockBack_ep = new Point(37.8, 519.6)
  // C 38.809 544.112 136.776 732.742 172.072 805.285
  points.ankleLowestPoint_cp1 = new Point(38.8, 544.1)
  points.ankleLowestPoint_cp2 = new Point(136.8, 732.7)
  points.ankleLowestPoint_ep = new Point(172.1, 805.3)

  points.title = new Point(150, 400)

  scaleAllPoints(part, options.totalSize * store.get('anthroLegScale'))

  //Match the ankle length to the ankle curve on the front
  const ankleUpperLength = store.get('ankleUpperLength')
  paths.ankleUpperPath = drawAnkleUpper()

  let ankleDelta = ankleUpperLength - paths.ankleUpperPath.length()
  const anklePathLengthConstant = points.ankleLowestPoint_ep.dist(points.hockBack_ep)

  const ankleRotationPoints = [
    'ankleTop_cp1',
    'ankleLowestPoint_ep',
    'ankleLowestPoint_cp2',
    'ankleLowestPoint_cp1',
  ]

  let ankleIterations = 0
  while (ankleIterations < 10 && Math.abs(ankleDelta) > 0.001 * options.totalSize) {
    log.debug('Inner leg ankle iteration ' + ankleIterations + ', ankle delta ' + ankleDelta)

    for (let p of ankleRotationPoints) {
      points[p] = points[p].rotate((-68 * ankleDelta) / anklePathLengthConstant, points.hockBack_ep)
    }
    paths.ankleUpperPath = drawAnkleUpper()
    ankleDelta = ankleUpperLength - paths.ankleUpperPath.length()

    ankleIterations = ankleIterations + 1
  }

  log.debug('Final inner leg ankle length is ' + paths.ankleUpperPath.length())

  paths.hipCurve = new Path()
    .move(points.thighUpperPoint_ep)
    // inkex.paths.curve: c -18.375 27.7611 -24.8839 64.274 -53.1352 82.377
    .curve(points.crotchCurve_cp1, points.crotchCurve_cp2, points.crotchCurve_ep)
    // inkex.paths.Curve: C 235.688 229.784 161.027 216.944 97.1037 215.301
    .curve(points.thighBack_cp1, points.thighBack_cp2, points.thighBack_ep)

  paths.thighFront = new Path()
    .move(points.ankleTop_ep)
    // inkex.paths.curve: c -16.4136 -39.3227 -38.2998 -57.1323 -33.37 -88.1667
    .curve(points.hockInner_cp1, points.hockInner_cp2, points.hockInner_ep)
    // inkex.paths.curve: c 2.69088 -16.9397 82.4058 -81.4912 99.9896 -163.634
    .curve(points.kneeCurve_cp1, points.kneeCurve_cp2, points.kneeCurve_ep)
    // inkex.paths.curve: c 18.0344 -84.248 -5.01096 -195.772 -23.2593 -261.71
    .curve(points.thighUpperPoint_cp1, points.thighUpperPoint_cp2, points.thighUpperPoint_ep)
  log.debug('Thigh inner length is ' + paths.thighFront.length())

  if (options.helpText) {
    macro('banner', {
      id: 'seamBetweenLegs',
      path: paths.hipCurve,
      text: 'polly:seamBetweenLegs',
      spaces: 2,
    })
    macro('banner', {
      id: 'seamAnthroAnkle',
      path: paths.ankleUpperPath,
      text: 'polly:seamAnthroAnkle',
      spaces: 2,
    })
  }

  const outerHipCurveLength = store.get('outerHipCurveLength')
  log.debug('Anthro leg outer hip length is ' + outerHipCurveLength)

  log.debug('Anthro leg inner hip length is ' + paths.hipCurve.length())

  log.debug('Total hip curve length is ' + (outerHipCurveLength + paths.hipCurve.length()))

  paths.path8 = new Path()
    // inkex.paths.move: m 173.979 804.303
    .move(points.ankleLowestPoint_ep)
    .join(paths.ankleUpperPath)
    .join(paths.thighFront)
    .join(paths.hipCurve)
    // inkex.paths.Curve: C 93.6092 263.073 83.8456 311.509 76.1889 344.62
    .curve(points.kneeBack_cp1, points.kneeBack_cp2, points.kneeBack_ep)
    // inkex.paths.Curve: C 68.7831 376.645 36.6822 494.932 37.7508 519.643
    .curve(points.hockBack_cp1, points.hockBack_cp2, points.hockBack_ep)
    // inkex.paths.Curve: C 38.809 544.112 136.776 732.742 172.072 805.285
    .curve(points.ankleLowestPoint_cp1, points.ankleLowestPoint_cp2, points.ankleLowestPoint_ep)
    .close()

  snippets.hockNotch = new Snippet('notch', points.hockInner_ep)
  snippets.kneeNotch = new Snippet('notch', paths.thighFront.shiftFractionAlong(0.5))

  // add instructions to cut two mirrored from main fabric
  store.cutlist.addCut()

  macro('title', {
    at: points.title,
    nr: '3b',
    title: 'anthro_leg_inner',
    scale: options.totalSize,
  })

  //Paperless
  macro('vd', {
    id: 'legLength',
    from: points.thighUpperPoint_ep,
    to: points.ankleLowestPoint_ep,
    x: points.hockBack_ep.x - (sa + 15),
  })

  macro('hd', {
    id: 'legWidth',
    from: points.hockBack_ep,
    to: points.kneeCurve_ep,
    y: points.ankleLowestPoint_ep.y + (sa + 15),
  })

  if (options.paperlessCurves) {
    macro('pd', {
      id: 'ankleCurveLength',
      path: paths.ankleUpperPath,
      //d: 15,
    })
  }

  //grainline
  points.grainlineFrom = points.thighBack_cp1
  points.grainlineTo = points.ankleLowestPoint_cp2.shiftFractionTowards(points.ankleTop_cp1, 0.5)
  macro('grainline', {
    from: points.grainlineFrom,
    to: points.grainlineTo,
  })

  if (sa) {
    paths.sa = paths.path8.offset(sa).attr('class', 'fabric sa')
  }

  return part
}

export const anthro_leg_inner = {
  name: 'polly.anthro_leg_inner',
  draft: draftPollyAnthroLegInner,
  after: [leg, anthro_leg_outer],

  measurements: [],
  options: {},
}
