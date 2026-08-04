import {
  blockMeasurements,
  blockOptions,
  structure,
  solveUpDrop,
  frontArmholeRegion,
  armholePath,
  storeArmhole,
  verticalCurve,
  waistDart,
  CF_SLANT,
  SIDE_EXTRA,
} from './shared.mjs'

export const front = {
  name: 'bodiceblock.front',
  measurements: blockMeasurements,
  options: blockOptions,
  draft: (sh) => {
    const { Point, Path, points, paths, options, macro, store, sa, part } = sh

    /*
     * Section D.0: solve the underarm drop before anything that starts at UP is drawn.
     * Both panels take the same value -- front and back UP are one point once the side
     * seam is sewn -- so this reads the answer the back part already cached, or solves
     * it if the front happens to draft first.
     */
    const upDrop = solveUpDrop(sh, structure(sh))
    const st = structure(sh, upDrop)

    /*
     * Structure points (bodiceblock.md section B). Origin is center front on the top line.
     */
    points.o = new Point(0, st.yOFront)
    points.cfNeck = new Point(0, st.yNeckDepthFront)
    const region = frontArmholeRegion(sh, st, upDrop)
    for (const key in region) points[key] = region[key]
    points.hp = new Point(st.frontHpX, st.yHip)

    /*
     * Front neckline: square to the center front, running into the shoulder at NP.
     */
    points.npCp = points.np.shiftFractionTowards(points.o, 0.55)
    points.cfNeckCp = points.cfNeck.shiftFractionTowards(points.o, 0.55)

    /*
     * Center front and side seam, as on the back.
     */
    const slant = options.waistFit ? CF_SLANT : 0
    points.cfTop = new Point(0, st.yChestWidth)
    points.cfWaist = new Point(slant, st.yWaist)
    points.cfHip = new Point(0, st.yHip)
    points.sideWaist = new Point(st.frontSide1 - (options.waistFit ? SIDE_EXTRA : 0), st.yWaist)

    verticalCurve(points, points.cfTop, points.cfWaist, 'cfUpper')
    verticalCurve(points, points.cfWaist, points.cfHip, 'cfLower')
    verticalCurve(points, points.up, points.sideWaist, 'sideUpper')
    verticalCurve(points, points.sideWaist, points.hp, 'sideLower')

    if (options.waistFit) waistDart(sh, st.chestWidth / 4, st.yWaist, st.frontDart)

    paths.armhole = armholePath(points, Path).hide()

    paths.seam = new Path()
      .move(points.cfNeck)
      .curve(points.cfNeckCp, points.npCp, points.np)
      .line(points.dartInner)
      .line(points.bustApex)
      .line(points.dartOuter)
      .line(points.sp)
      .join(paths.armhole.reverse())
      .curve(points.sideUpperCp1, points.sideUpperCp2, points.sideWaist)
      .curve(points.sideLowerCp1, points.sideLowerCp2, points.hp)
      .line(points.cfHip)
      .curve(points.cfLowerCp2, points.cfLowerCp1, points.cfWaist)
      .curve(points.cfUpperCp2, points.cfUpperCp1, points.cfTop)
      .line(points.cfNeck)
      .close()
      .addClass('fabric')

    /*
     * The book drops the waist line by 5 mm at the side seam and 1 cm at the center
     * front once the darts are set. Marked, not cut.
     */
    points.trueWaistCenter = points.cfWaist.shift(-90, 10)
    points.trueWaistSide = points.sideWaist.shift(-90, 5)
    paths.waistline = new Path()
      .move(points.trueWaistCenter)
      .line(points.trueWaistSide)
      .addClass('note help')

    if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')

    /*
     * The sleeve contract, off the calibrated curves.
     */
    storeArmhole(store, points, Path, 'front')

    /*
     * Annotations
     */
    if (options.waistFit) store.cutlist.addCut({ cut: 2, from: 'fabric' })
    else {
      store.cutlist.addCut({ cut: 1, from: 'fabric', onFold: true })
      macro('cutonfold', { from: points.o, to: points.cfHip })
    }

    points.grainlineFrom = new Point(st.chestWidth / 2, st.yBust)
    points.grainlineTo = new Point(st.chestWidth / 2, st.yHip)
    macro('grainline', { from: points.grainlineFrom, to: points.grainlineTo })

    points.title = new Point((st.chestWidth / 4 + st.frontSide1) / 2, st.yBust + 60)
    macro('title', { at: points.title, nr: 2, title: 'front', align: 'center', scale: 0.6 })

    return part
  },
}
