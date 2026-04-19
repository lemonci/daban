import { back as brianBack } from '@freesewing/brian'
import { front } from './front.mjs'
import { hidePresets } from '@freesewing/core'

function draftBack({
  options,
  Point,
  Path,
  points,
  paths,
  Snippet,
  snippets,
  sa,
  macro,
  part,
  measurements,
  store,
  log,
  expand,
}) {
  // Shorten body to take ribbing into account
  if (options.ribbing) {
    //Just redefining ribbing height again until I figure out how to make it work with the store
    //let rh = options.ribbingHeight * (measurements.hpsToWaistBack + measurements.waistToHips)
    let rh = store.get('ribbingHeight')

    for (let p of ['cbHips', 'hem', 'cbHem']) points[p] = points[p].shift(90, rh)
  }
  points.hem.x = (measurements.hips * (1 + options.hipsEase)) / 4
  //Redrawing the seam to reflect the shifted hem points
  paths.saBase = new Path()
    .move(points.cbHem)
    .line(points.hem)
    .line(points.armhole)
    .curve(points.armholeCp2, points.armholeHollowCp1, points.armholeHollow)
    .curve(points.armholeHollowCp2, points.armholePitchCp1, points.armholePitch)
    .join(paths.backArmhole)
    .line(points.s3CollarSplit)
    .join(paths.backCollar)
    .hide()
  paths.seam = new Path()
    .move(points.cbNeck)
    .line(points.cbHips)
    .join(paths.saBase)
    .setClass('fabric')

  //If using the yoke option, have to redraw a significant chunk of the path

  if (options.yoke) {
    points.armholesplit = paths.backArmhole.shiftFractionAlong(options.yokesplit)
    points.centertop = new Point(0, points.armholesplit.y)

    paths.yokesplitline = new Path()
      .move(points.armholesplit)
      .line(points.centertop)
      .setClass('lining')

    if (expand) {
      //If yoke is true and expand is true, cut the back piece down to just display the
      //bottom section

      delete paths.saBase

      paths.saBase = new Path()
        .move(points.cbHem)
        .line(points.hem)
        .line(points.armhole)
        .curve(points.armholeCp2, points.armholeHollowCp1, points.armholeHollow)
        .curve(points.armholeHollowCp2, points.armholePitchCp1, points.armholePitch)
        .line(points.armholesplit)

        //.join(paths.backArmhole)
        .line(points.centertop)

        .hide()

      paths.seam = new Path()
        .move(points.centertop)
        .line(points.cbHips)
        .join(paths.saBase)
        .setClass('fabric')
        .unhide()

      //Remove unneeded paperless macros
      macro('rmHd', 'lShoulder')
      macro('rmHd', 'wCFrontToHps')
      macro('rmLd', 'lShoulder')
      macro('rmVd', 'hTotal')
      macro('rmVd', 'hHemToNeckOpeningBottom')
      macro('rmVd', 'hHemToShoulder')
      macro('rmVd', 'hHemToArmholePitch')
      macro('rmVd', 'hHemToArmhole')
      macro('rmHd', 'wHem')
      macro('rmVd', 'hHemToWaist')
      macro('rmPd', 'lShoulderToArmholePitch')
      macro('rmPd', 'lArmhole')
      delete paths.waist
    }

    if (sa) {
      paths.sa = paths.saBase.offset(sa).setClass('fabric sa').move(points.cbHips)
      paths.sa.close()
    }

    macro('cutonfold', {
      from: points.centertop,
      to: points.cbHem,
      grainline: true,
    })

    //Make new paperless macros
    macro('hd', {
      id: 'wHem',
      from: points.cbHem,
      to: points.hem,
      y: points.hem.y + sa + 15,
    })
    macro('hd', {
      id: 'wTop',
      from: points.centertop,
      to: points.armholesplit,
      y: points.centertop.y - sa - 15,
    })
    macro('hd', {
      id: 'wChest',
      from: points.centertop,
      to: points.armhole,
      y: points.armhole.y,
    })
    macro('hd', {
      id: 'armholeHoriz',
      from: points.armholesplit,
      to: points.armhole,
      y: points.centertop.y,
    })

    macro('vd', {
      id: 'hHemToWaist',
      from: points.cbHem,
      to: points.cbWaist,
      x: points.cbHips.x - 15,
    })
    macro('vd', {
      id: 'hWaistToChest',
      from: points.cbWaist,
      to: points.cbArmhole,
      x: points.cbHips.x - 15,
    })
    macro('vd', {
      id: 'hChestToTop',
      from: points.cbArmhole,
      to: points.centertop,
      x: points.cbHips.x - 15,
    })
    macro('vd', {
      id: 'hTotal',
      from: points.cbHem,
      to: points.centertop,
      x: points.cbHips.x - 30,
    })

    points.title = points.centertop.shiftFractionTowards(points.hem, 0.5)
  } else {
    macro('vd', {
      id: 'hTotal',
      from: points.s3CollarSplit,
      to: points.hem,
      x: points.cbHem.x - 30,
    })
    macro('vd', {
      id: 'hHemToNeckOpeningBottom',
      from: points.cbNeck,
      to: points.hem,
      x: points.cbHem.x - 15,
    })
    macro('vd', {
      id: 'hHemToWaist',
      from: points.cbHem,
      to: points.cbWaist,
      x: points.cbHem.x + 30,
    })
    macro('vd', {
      id: 'hHemToArmhole',
      from: points.hem,
      to: points.armhole,
      x: points.armhole.x + 15,
    })
    macro('vd', {
      id: 'hHemToArmholePitch',
      from: points.hem,
      to: points.armholePitch,
      x: points.armhole.x + 30,
    })
    macro('vd', {
      id: 'hHemToShoulder',
      from: points.hem,
      to: points.s3ArmholeSplit,
      x: points.armhole.x + 45,
    })
    macro('hd', {
      id: 'wHem',
      from: points.cbHem,
      to: points.hem,
      y: points.hem.y + sa + 15,
    })
    macro('hd', {
      id: 'wArmhole',
      from: points.cbHem,
      to: points.armhole,
      y: points.armhole.y,
    })
    macro('hd', {
      id: 'wArmholeHollow',
      from: points.cbHem,
      to: points.backArmholePitch,
      y: points.backArmholePitch.y,
    })

    macro('cutonfold', {
      from: points.cbNeck,
      to: points.cbHem,
      grainline: true,
    })
    delete paths.waist

    points.title = points.cbNeck.shiftFractionTowards(points.hem, 0.5)
  }

  //Shift armscye point for lining
  const armShiftAngle = 90 * options.armholeShiftAngle
  const armShiftDistance = options.liningArmscyeShift * measurements.chest
  points.armholeShift = points.armhole.shift(armShiftAngle, armShiftDistance)
  points.armholeCp2Shift = points.armholeCp2.shift(armShiftAngle, armShiftDistance)

  points.armholeHollowCp1Shift = points.armholeHollowCp1.shift(
    armShiftAngle,
    armShiftDistance * 0.5
  )
  points.armholeHollowShift = points.armholeHollow.shift(armShiftAngle, armShiftDistance * 0.5)
  points.armholeHollowCp2Shift = points.armholeHollowCp2.shift(
    armShiftAngle,
    armShiftDistance * 0.5
  )

  paths.armholeNormal = new Path()
    .move(points.armhole)
    .curve(points.armholeCp2, points.armholeHollowCp1, points.armholeHollow)
    .curve(points.armholeHollowCp2, points.backArmholePitchCp1, points.backArmholePitch)
    .hide()

  paths.armholeLining = new Path()
    .move(points.armholeShift)
    .curve(points.armholeCp2Shift, points.armholeHollowCp1Shift, points.armholeHollowShift)
    .curve(points.armholeHollowCp2Shift, points.backArmholePitchCp1, points.backArmholePitch)
    .hide()

  const armscyeShiftDifference = paths.armholeLining.length() - paths.armholeNormal.length()
  store.set('armscyeShiftDifference', armscyeShiftDifference)
  if (armscyeShiftDifference < measurements.biceps * 0.02) {
    store.flag.note({ msg: `jett:armLiningDistance` })
  }

  if (!expand) {
    store.flag.note({ msg: 'jett:cutBackLining' })

    if (options.yoke) {
      store.flag.note({ msg: 'jett:expandSplitBack' })
    }

    paths.liningGreen = new Path()
      .move(points.hem)
      .line(points.armholeShift)
      .join(paths.armholeLining)
      .setClass('lining')

    const centerPleatDistance = options.centerPleatWidth * measurements.chest

    points.liningCenterTop = points.cbNeck.shift(180, centerPleatDistance)
    points.liningCenterBottom = points.cbHem.shift(180, centerPleatDistance)

    paths.liningCenterDistance = new Path()
      .move(points.cbHem)
      .line(points.liningCenterBottom)
      .line(points.liningCenterTop)
      .line(points.cbNeck)
      .setClass('lining')
  }

  macro('rmtitle')

  store.cutlist.addCut({ cut: false })
  store.cutlist.addCut({ cut: false, from: 'lining' })
  store.cutlist.addCut({ cut: 1, from: 'fabric', onFold: true })

  macro('ld', {
    id: 'sideSeamLength',
    from: points.armhole,
    to: points.hem,
    d: -15 - sa,
  })

  macro('title', { at: points.title, nr: 2, title: 'back' })

  return part
}

export const back = {
  name: 'jett.back',
  from: brianBack,
  after: front,

  hide: hidePresets.HIDE_TREE,
  measurements: ['hips', 'biceps'],
  options: {
    chestEase: { pct: 10, min: -15, max: 50, menu: 'fit' },
    hipsEase: { pct: 10, min: -15, max: 50, menu: 'fit' },
    yoke: { bool: true, menu: 'construction' },
    yokesplit: { pct: 30, min: 5, max: 80, menu: 'style' },
  },
  draft: draftBack,
}
