import { sleeve as librarySleeve } from '@freesewing/library'
import { back } from './back.mjs'
import { lining_back } from './lining_back.mjs'
import { hidePresets } from '@freesewing/core'

function draftsleeve({
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
  expand,
  log,
}) {
  macro('rmtitle')
  store.cutlist.addCut({ cut: false })
  store.cutlist.addCut({ cut: false, from: 'lining' })

  //points.hem.x = measurements.hips * (1+options.hipsEase ) / 4

  // Shorten body to take ribbing into account
  if (options.ribbing) {
    //Just redefining ribbing height again until I figure out how to make it work with the store
    //let rh = options.ribbingHeight * (measurements.hpsToWaistBack + measurements.waistToHips)
    let rh = store.get('ribbingHeight')

    for (let p of ['wristLeft', 'centerWrist', 'wristRight']) points[p] = points[p].shift(90, rh)
  }
  paths.seam = new Path()
    .move(points.bicepsLeft)
    .move(points.wristLeft)
    .move(points.wristRight)
    .line(points.bicepsRight)
    .join(paths.sleevecap)
    .close()
    .setClass('fabric')

  const armscyeshift = store.get('armscyeShiftDifference')

  //Draw slightly widened lining points if expand is on
  // and the lining needs to move
  if (!expand && armscyeshift > 0.02 * measurements.biceps) {
    log.info('Sleeve expand started ')

    //Draw shifted lining points for biceps
    const baseangle = points.capQ1Cp1.angle(points.bicepsRight)
    points.liningBicepsRight = points.bicepsRight.shift(baseangle, armscyeshift)
    points.liningBicepsLeft = points.bicepsLeft.shift(180 - baseangle, armscyeshift)

    paths.liningLeft = new Path()
      .move(points.bicepsLeft)
      .line(points.liningBicepsLeft)
      .line(points.wristLeft)
      .setClass('lining')

    paths.liningRight = new Path()
      .move(points.wristRight)
      .line(points.liningBicepsRight)
      .line(points.bicepsRight)
      .setClass('lining')

    paths.liningSeam = new Path()
      .move(points.liningBicepsLeft)
      .move(points.wristLeft)
      .move(points.wristRight)
      .line(points.liningBicepsRight)
      .join(paths.sleevecap)
      .close()
      .setClass('lining')
      .hide()

    if (sa) paths.sa = paths.liningSeam.offset(sa).setClass('fabric sa')

    log.info('Sleeve expand finished ')
  } else {
    if (sa) paths.sa = paths.seam.offset(sa).setClass('fabric sa')
  }
  if (armscyeshift < 0.02 * measurements.biceps) store.cutlist.addCut({ cut: 2, from: 'lining' })

  //remove broken paperless macros
  macro('rmHd', 'wCuff')
  macro('rmVd', 'hCuffToArmhole')
  macro('rmVd', 'hFull')
  macro('rmGrainline', 'grainline')

  //make new paperless markings
  macro('vd', {
    id: 'hTotal',
    from: points.sleeveTop,
    to: points.centerWrist,
    x: points.bicepsLeft.x - sa - 30,
  })
  macro('vd', {
    id: 'hSleeve',
    from: points.bicepsLeft,
    to: points.centerWrist,
    x: points.bicepsLeft.x - sa - 15,
  })
  macro('vd', {
    id: 'hSleeveCap',
    from: points.sleeveTop,
    to: points.bicepsLeft,
    x: points.bicepsLeft.x - sa - 15,
  })

  macro('hd', {
    id: 'wWrist',
    from: points.wristLeft,
    to: points.wristRight,
    y: points.centerWrist.y + sa + 15,
  })

  macro('grainline', {
    from: points.sleeveTop,
    to: points.centerWrist,
  })

  store.cutlist.addCut({ cut: 2, from: 'fabric', identical: false })

  //points.title = points.outerPlacketTop.shiftFractionTowards(points.hem, 0.5)
  macro('title', { at: points.title, nr: 3, title: 'sleeve' })

  return part
}

export const sleeve = {
  name: 'jett.sleeve',
  from: librarySleeve,
  after: [back, lining_back],
  hide: hidePresets.HIDE_TREE,
  options: {
    cuffEase: { pct: 60, min: -8, max: 100, menu: 'fit' },
    libraryFitSleeve: true,
    sleeveLengthBonus: {
      pct: 6,
      min: -60,
      max: 20,
      menu: 'style',
    },
  },
  draft: draftsleeve,
}
