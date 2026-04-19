import { back as brianBack } from '@freesewing/brian'
import { back } from './back.mjs'

function draftJettLiningBack({
  points,
  Point,
  paths,
  Path,
  options,
  complete,
  measurements,
  store,
  macro,
  utils,
  snippets,
  Snippet,
  sa,
  log,
  part,
  expand,
}) {
  if (!expand) {
    return part.hide()
  }

  paths.armscyeCurve = new Path()
    .move(points.armhole)
    .curve(points.armholeCp2, points.armholeHollowCp1, points.armholeHollow)
    .curve(points.armholeHollowCp2, points.armholePitchCp1, points.armholePitch)
    .join(paths.backArmhole)

  const originalArmscyeLength = paths.armscyeCurve.length()
  log.info('Original armscye length is ' + originalArmscyeLength)

  //Remove all the bits from the back that it doesn't need
  macro('rmtitle')

  // Shorten body to take ribbing into account
  if (options.ribbing) {
    //Just redefining ribbing height again until I figure out how to make it work with the store
    //let rh = options.ribbingHeight * (measurements.hpsToWaistBack + measurements.waistToHips)
    let rh = store.get('ribbingHeight')

    for (let p of ['cbHips', 'hem', 'cbHem']) points[p] = points[p].shift(90, rh)
  }

  points.hem.x = (measurements.hips * (1 + options.hipsEase)) / 4

  //Shift armscye point
  const armShiftAngle = 90 * options.armholeShiftAngle
  const toShift = ['armhole', 'armholeCp2']
  const toShiftHalf = ['armholeHollowCp1', 'armholeHollow', 'armholeHollowCp2']
  const armShiftDistance = options.liningArmscyeShift * measurements.chest
  for (const i of toShift) points[i] = points[i].shift(armShiftAngle, armShiftDistance)
  for (const i of toShiftHalf) points[i] = points[i].shift(armShiftAngle, armShiftDistance * 0.5)

  //Shift to add center pleat
  const centerPleatDistance = options.centerPleatWidth * measurements.chest
  points.originalCenterNeck = points.cbNeck
  for (const i of ['cbHem', 'cbNeck', 'cbHips']) {
    points[i] = points[i].shift(180, centerPleatDistance)
  }

  //Draw a line to show the pleat width
  points.pleatMarkLength = points.originalCenterNeck.shift(270, measurements.hpsToWaistBack * 0.2)
  paths.pleatMark = new Path()
    .move(points.originalCenterNeck)
    .line(points.pleatMarkLength)
    .setClass('sa')

  paths.armscyeCurve = new Path()
    .move(points.armhole)
    .curve(points.armholeCp2, points.armholeHollowCp1, points.armholeHollow)
    .curve(points.armholeHollowCp2, points.armholePitchCp1, points.armholePitch)
    .join(paths.backArmhole)

  const shiftedArmscyeLength = paths.armscyeCurve.length()
  log.info('Shifted armscye length is ' + shiftedArmscyeLength)
  log.info('Difference is ' + (shiftedArmscyeLength - originalArmscyeLength) + ' mm')

  store.set('armscyeShiftDifference', shiftedArmscyeLength - originalArmscyeLength)

  //Redrawing the seam to reflect the shifted points
  paths.saBase = new Path()
    .move(points.cbHem)
    .line(points.hem)
    .line(points.armhole)
    .join(paths.armscyeCurve)
    .line(points.s3CollarSplit)
    .join(paths.backCollar)
    .hide()
  paths.seam = new Path()
    .move(points.cbNeck)
    .line(points.cbHips)
    .join(paths.saBase)
    .close()
    .setClass('fabric')
  if (sa) paths.sa = paths.saBase.offset(sa).setClass('fabric sa')

  macro('cutonfold', {
    from: points.cbNeck,
    to: points.cbHem,
    grainline: true,
  })

  store.cutlist.addCut({ cut: false })
  store.cutlist.addCut({ cut: false, from: 'lining' })
  store.cutlist.addCut({ cut: 1, from: 'lining', onFold: true })

  macro('title', { at: points.title, nr: 12, title: 'lining_back' })

  return part
}

export const lining_back = {
  name: 'jett.lining_back',
  measurements: [],
  from: brianBack,
  after: back,
  options: {
    centerPleatWidth: {
      pct: 2,
      min: 0,
      max: 5,
      menu: 'advanced.lining',
    },
    armholeShiftAngle: {
      menu: 'advanced.lining',
      pct: 50,
      min: 0,
      max: 50,
    },
  },
  draft: draftJettLiningBack,
}
