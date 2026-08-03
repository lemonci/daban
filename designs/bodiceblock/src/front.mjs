import {
  blockMeasurements,
  blockOptions,
  structure,
  armholeControlPoints,
  armholePath,
  storeArmhole,
  verticalCurve,
  waistDart,
  CF_SLANT,
  SIDE_EXTRA,
} from './shared.mjs'

/*
 * The book fixes the front shoulder slope by drawing a ray from NP through a point on
 * the front shoulder guide line, 16.5 cm out from the center front (p.16). Like the
 * other structure constants it is stated for the average size only.
 */
const SHOULDER_GUIDE_X = 165

export const front = {
  name: 'bodiceblock.front',
  measurements: blockMeasurements,
  options: blockOptions,
  draft: (sh) => {
    const { Point, Path, points, paths, options, macro, store, utils, sa, part } = sh
    const st = structure(sh)

    /*
     * Structure points (bodiceblock.md section B). Origin is center front on the top line.
     */
    points.o = new Point(0, st.yOFront)
    points.np = new Point(st.neckWidth, st.yOFront)
    points.cfNeck = new Point(0, st.yNeckDepthFront)
    points.shoulderGuide = new Point(SHOULDER_GUIDE_X, st.yShoulderFront)
    points.chestWidthPoint = new Point(st.chestWidth / 2, st.yChestWidth)
    // The armhole passes 2 cm outside the chest-width guide point (figure 2-2)
    points.armholePitch = new Point(st.chestWidth / 2 + 20, st.yChestWidth)
    points.up = new Point(st.frontUpX, st.yBust)
    points.hp = new Point(st.frontHpX, st.yHip)

    /*
     * Shoulder ray, and the shoulder/bust dart that sits on it. The dart's apex is a
     * quarter of the chest width out from the center front and 2 cm below the bust
     * line; its inner leg starts 2 cm back along the ray from the point directly above
     * the apex, and the outer leg is a dart width further out.
     */
    const rayAngle = points.np.angle(points.shoulderGuide)
    points.sp = points.np.shift(rayAngle, st.shoulderSeam + st.dartWidth)
    points.bustApex = new Point(st.chestWidth / 4, st.yBust + 20)
    points.dartOnRay = utils.beamIntersectsX(points.np, points.sp, points.bustApex.x)
    points.dartInner = points.dartOnRay.shiftTowards(points.np, 20)
    points.dartOuter = points.dartInner.shift(rayAngle, st.dartWidth)

    /*
     * Armhole. Below the chest-width point it mirrors the back: square to the bust line
     * at the underarm point, square to the chest-width guide at the pitch point, and
     * smoothed 1.5 cm off the corner between them. Above it, the straight shoulder-point
     * to pitch-point line is hollowed by 1 cm at its midpoint.
     */
    armholeControlPoints(sh, 15)
    const chord = points.sp.angle(points.armholePitch)
    // The armhole hollows toward the center front, which is to the left of the chord
    const inward = chord - 90
    points.spCp = points.sp.shiftFractionTowards(points.armholePitch, 1 / 3).shift(inward, 40 / 3)
    points.pitchCp1 = points.sp
      .shiftFractionTowards(points.armholePitch, 2 / 3)
      .shift(inward, 40 / 3)

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
     * The sleeve contract: real measured curve lengths, not formulas.
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
