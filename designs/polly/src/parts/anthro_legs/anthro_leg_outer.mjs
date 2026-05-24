import { scaleAllPoints } from '../../shared.mjs'
import { leg } from '../leg/leg.mjs'

function draftPollyAnthroLegOuter({
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
      .move(points.ankleFront_ep)
      .curve(points.ankleSide_cp1, points.ankleSide_cp2, points.ankleSide_ep)
  }

  // Path: path2
  // M 363.572 147.61
  points.path2_p1 = new Point(363.6, 147.6)
  // C 315.305 232.209 272.301 332.09 259.182 417.818
  points.frontDartPoint_cp1 = new Point(315.3, 232.2)
  points.frontDartPoint_cp2 = new Point(272.3, 332.1)
  points.frontDartPoint_ep = new Point(259.2, 417.8)
  // C 257.092 328.27 236.787 242.651 210.823 156.127
  points.frontDartInner_cp1 = new Point(257.1, 328.3)
  points.frontDartInner_cp2 = new Point(236.8, 242.7)
  points.frontDartInner_ep = new Point(210.8, 156.1)
  // c -37.5295 7.26731 -105.463 14.7076 -124.713 19.7097
  points.thighFront_cp1 = new Point(173.5, 163.3)
  points.thighFront_cp2 = new Point(105.5, 170.7)
  points.thighFront_ep = new Point(86.3, 175.7)
  // c 1.5388 40.3177 13.4507 129.368 30.8622 191.708
  points.kneeCurveFront_cp1 = new Point(87.5, 216.3)
  points.kneeCurveFront_cp2 = new Point(99.5, 305.4)
  points.kneeCurveFront_ep = new Point(116.9, 367.7)
  // c 24.645 88.2382 114.432 231.059 103.248 254.716
  points.path2_p6_cp1 = new Point(141.6, 456.2)
  points.path2_p6_cp2 = new Point(231.4, 599.1)
  points.path2_p6_ep = new Point(220.2, 622.7)
  // c -12.2765 25.9678 -43.0219 47.666 -61.1303 66.0434
  points.ankleFront_cp1 = new Point(207.7, 649)
  points.ankleFront_cp2 = new Point(177, 670.7)
  points.ankleFront_ep = new Point(158.9, 689)
  // c 36.4464 47.1367 39.5085 148.363 42.8424 193.869
  points.ankleSide_cp1 = new Point(195.4, 736.1)
  points.ankleSide_cp2 = new Point(198.5, 837.4)
  points.ankleSide_ep = new Point(201.8, 882.9)
  // c 19.7062 2.3692 84.7058 44.6968 101.909 68.1943
  points.ankleBack_cp1 = new Point(221.7, 885.4)
  points.ankleBack_cp2 = new Point(286.7, 927.7)
  points.ankleBack_ep = new Point(303.9, 951.2)
  // c 65.4257 -95.0818 104.427 -154.27 158.324 -234.662
  points.hockBack_cp1 = new Point(369.4, 855.9)
  points.hockBack_cp2 = new Point(408.4, 796.7)
  points.hockBack_ep = new Point(462.3, 716.3)
  // c 25.9131 -21.0409 68.2233 -71.7221 96.3206 -112.23
  points.kneeCurveBack_cp1 = new Point(487.9, 695)
  points.kneeCurveBack_cp2 = new Point(530.2, 644.3)
  points.kneeCurveBack_ep = new Point(558.3, 603.8)
  // c 32.8323 -47.3347 51.0131 -100.157 83.4007 -151.364
  points.thighBack_cp1 = new Point(590.8, 556.7)
  points.thighBack_cp2 = new Point(609, 503.8)
  points.thighBack_ep = new Point(641.4, 452.6)
  // C 572.27 424.101 524.79 353.02 496.658 288.326
  points.backDartOuter_cp1 = new Point(572.3, 424.1)
  points.backDartOuter_cp2 = new Point(524.8, 353)
  points.backDartOuter_ep = new Point(496.7, 288.3)
  // c -33.8375 37.1065 -91.65 98.7773 -122.701 183.209
  points.backDartPoint_cp1 = new Point(463.2, 325.1)
  points.backDartPoint_cp2 = new Point(405.3, 386.8)
  points.backDartPoint_ep = new Point(374.3, 471.2)
  // c 9.73929 -63.2331 43.7433 -161.715 61.8561 -228.834
  points.backDartInner_cp1 = new Point(383.7, 407.8)
  points.backDartInner_cp2 = new Point(417.7, 309.3)
  points.backDartInner_ep = new Point(435.9, 242.2)
  // c -10.3652 -42.8409 -34.6841 -83.953 -72.2408 -95.091
  points.frontDartOuter_cp1 = new Point(425.6, 199.2)
  points.frontDartOuter_cp2 = new Point(401.3, 158)
  points.frontDartOuter_ep = new Point(363.8, 146.9)
  // z

  const anthroLegScale = 90.9 / 193
  store.set('anthroLegScale', anthroLegScale)
  scaleAllPoints(part, options.totalSize * anthroLegScale)

  //Adjust a few points to set the ankle length as desired
  const ankleRotationPoints = [
    'ankleSide_cp2',
    'ankleSide_ep',
    'ankleBack_cp1',
    'ankleBack_cp2',
    'ankleBack_ep',
    'hockBack_cp1',
  ]

  paths.ankleUpperPath = drawAnkleUpper()

  const desiredAnkleLength = 104.4 * options.totalSize * options.footUpperSize

  let ankleDelta = desiredAnkleLength - paths.ankleUpperPath.length()

  let ankleIterations = 0

  while (ankleIterations < 10 && Math.abs(ankleDelta) > 0.001 * options.totalSize) {
    log.debug('Outer leg ankle iteration ' + ankleIterations + ', ankle delta ' + ankleDelta)

    for (let p of ankleRotationPoints) {
      points[p] = points[p].rotate(ankleDelta * 0.45, points.hockBack_ep)
    }
    paths.ankleUpperPath = drawAnkleUpper()
    ankleDelta = desiredAnkleLength - paths.ankleUpperPath.length()

    ankleIterations = ankleIterations + 1
  }

  log.debug('Anthro leg outer ankle length is ' + paths.ankleUpperPath.length())
  store.set('ankleUpperLength', paths.ankleUpperPath.length())

  paths.hipCurveBack = new Path()
    .move(points.thighBack_ep)
    // inkex.paths.Curve: C 572.27 424.101 524.79 353.02 496.658 288.326
    .curve(points.backDartOuter_cp1, points.backDartOuter_cp2, points.backDartOuter_ep)

  paths.hipCurveMiddle = new Path()
    .move(points.backDartInner_ep)
    .curve(points.frontDartOuter_cp1, points.frontDartOuter_cp2, points.frontDartOuter_ep)

  paths.hipCurveFront = new Path().move(points.frontDartInner_ep).line(points.thighFront_ep)

  const outerHipCurveLength =
    paths.hipCurveFront.length() + paths.hipCurveMiddle.length() + paths.hipCurveBack.length()
  store.set('outerHipCurveLength', outerHipCurveLength)

  paths.heelPath = new Path()
    .move(points.ankleSide_ep)
    // inkex.paths.curve: c 19.7062 2.3692 84.7058 44.6968 101.909 68.1943
    .curve(points.ankleBack_cp1, points.ankleBack_cp2, points.ankleBack_ep)
  store.set('heelLength', paths.heelPath.length())

  paths.frontPath = new Path()
    .move(points.thighFront_ep)
    // inkex.paths.curve: c 1.5388 40.3177 13.4507 129.368 30.8622 191.708
    .curve(points.kneeCurveFront_cp1, points.kneeCurveFront_cp2, points.kneeCurveFront_ep)
    // inkex.paths.curve: c 24.645 88.2382 114.432 231.059 103.248 254.716
    .curve(points.path2_p6_cp1, points.path2_p6_cp2, points.path2_p6_ep)
    // inkex.paths.curve: c -12.2765 25.9678 -43.0219 47.666 -61.1303 66.0434
    .curve(points.ankleFront_cp1, points.ankleFront_cp2, points.ankleFront_ep)

  log.debug('Thigh outer length is ' + paths.frontPath.length())

  paths.path2 = new Path()
    // inkex.paths.Move: M 363.572 147.61
    .move(points.frontDartOuter_ep)
    // inkex.paths.Curve: C 315.305 232.209 272.301 332.09 259.182 417.818
    .curve(points.frontDartPoint_cp1, points.frontDartPoint_cp2, points.frontDartPoint_ep)
    // inkex.paths.Curve: C 257.092 328.27 236.787 242.651 210.823 156.127
    .curve(points.frontDartInner_cp1, points.frontDartInner_cp2, points.frontDartInner_ep)
    .join(paths.hipCurveFront)
    .join(paths.frontPath)
    .join(paths.ankleUpperPath)
    .join(paths.heelPath)
    // inkex.paths.curve: c 65.4257 -95.0818 104.427 -154.27 158.324 -234.662
    .curve(points.hockBack_cp1, points.hockBack_cp2, points.hockBack_ep)
    // inkex.paths.curve: c 25.9131 -21.0409 68.2233 -71.7221 96.3206 -112.23
    .curve(points.kneeCurveBack_cp1, points.kneeCurveBack_cp2, points.kneeCurveBack_ep)
    // inkex.paths.curve: c 32.8323 -47.3347 51.0131 -100.157 83.4007 -151.364
    .curve(points.thighBack_cp1, points.thighBack_cp2, points.thighBack_ep)
    .join(paths.hipCurveBack)
    // inkex.paths.curve: c -33.8375 37.1065 -91.65 98.7773 -122.701 183.209
    .curve(points.backDartPoint_cp1, points.backDartPoint_cp2, points.backDartPoint_ep)
    // inkex.paths.curve: c 9.73929 -63.2331 43.7433 -161.715 61.8561 -228.834
    .curve(points.backDartInner_cp1, points.backDartInner_cp2, points.backDartInner_ep)
    .join(paths.hipCurveMiddle)
    // inkex.paths.zoneClose: z
    .close()

  snippets.hockNotch = new Snippet('notch', points.path2_p6_ep)
  snippets.kneeNotch = new Snippet('notch', paths.frontPath.shiftFractionAlong(0.5))

  if (options.helpText) {
    macro('banner', {
      id: 'seamLegsBack',
      path: paths.hipCurveBack,
      text: 'polly:seamLegsBack',
      spaces: 2,
    })

    macro('banner', {
      id: 'seamLegsFrontCenter',
      path: paths.hipCurveMiddle,
      text: 'polly:seamLegsFront',
      spaces: 2,
    })
    macro('banner', {
      id: 'seamLegsFrontFront',
      path: paths.hipCurveFront,
      text: 'polly:seamLegsFront',
      spaces: 2,
    })

    macro('banner', {
      id: 'seamAnthroAnkle',
      path: paths.ankleUpperPath,
      text: 'polly:seamAnthroAnkle',
      spaces: 2,
    })
  }

  // add instructions to cut two mirrored from main fabric
  store.cutlist.addCut()

  points.title = points.backDartPoint_ep
    .shiftFractionTowards(points.ankleFront_ep, 0.5)
    .shiftFractionTowards(points.thighBack_ep, 0.3)
  macro('title', {
    at: points.title,
    nr: '3a',
    title: 'anthro_leg_outer',
    scale: options.totalSize,
  })

  //Paperless
  macro('vd', {
    id: 'legLength',
    from: points.frontDartOuter_ep,
    to: points.ankleBack_ep,
    x: points.thighFront_ep.x - (sa + 15),
  })

  macro('hd', {
    id: 'legWidth',
    from: points.thighFront_ep,
    to: points.thighBack_ep,
    y: points.ankleBack_ep.y + (sa + 15),
  })

  if (options.paperlessCurves) {
    macro('pd', {
      id: 'ankleCurveLength',
      path: paths.ankleUpperPath,
      //d: 15,
    })
  }

  if (sa) {
    paths.sa = paths.path2.offset(sa).trim().attr('class', 'fabric sa')
  }

  //grainline
  points.grainlineFrom = points.frontDartPoint_cp1 //.shiftfractionTowards(points.backDartInner_ep, 0.5)
  points.grainlineTo = points.grainlineFrom.shiftFractionTowards(points.ankleBack_ep, 0.9)
  macro('grainline', {
    from: points.grainlineFrom,
    to: points.grainlineTo,
  })

  return part
}

export const anthro_leg_outer = {
  name: 'polly.anthro_leg_outer',
  draft: draftPollyAnthroLegOuter,
  after: leg,

  measurements: [],
  options: {
    footUpperSize: {
      pct: 100,
      min: 50,
      max: 150,
      menu: (_settings, mergedOptions) => (mergedOptions?.legType == 'anthro' ? 'style' : false),
    },
  },
}
