import {
  blockMeasurements,
  blockOptions,
  structure,
  solveUpDrop,
  backShoulderCheck,
  backArmholeRegion,
  armholePath,
  storeArmhole,
  verticalCurve,
  waistDart,
  CB_SLANT,
  SIDE_EXTRA,
} from './shared.mjs'

export const back = {
  name: 'bodiceblock.back',
  measurements: blockMeasurements,
  options: blockOptions,
  draft: (sh) => {
    const { Point, Path, points, paths, options, macro, store, sa, part } = sh

    /*
     * Section D.0: solve the underarm drop before anything that starts at UP is drawn.
     * The structure is then rebuilt with it, because the section 1 side seam runs from
     * UP to HP and its waist point is an interpolation along that line.
     */
    const upDrop = solveUpDrop(sh, structure(sh))
    const st = structure(sh, upDrop)

    /*
     * Structure points (bodiceblock.md section A). Origin is center back on the top line.
     */
    points.o = new Point(0, st.yOBack)
    const region = backArmholeRegion(sh, st, upDrop)
    for (const key in region) points[key] = region[key]
    points.hp = new Point(st.backHpX, st.yHip)

    /*
     * Shoulder length check (book p.16). This fires on most stock sizes rather than
     * rarely, so say so out loud when it does: it means the shoulder is coming from
     * `shoulderToShoulder` and not from `backWidthPct`. See ambiguity 14 in
     * docs/patterns/bodiceblock.md. It is a note, never a failure.
     */
    const shoulder = backShoulderCheck(Point, st)
    if (shoulder.adjusted)
      store.log.info(
        `bodiceblock: the shoulder seam drafted from backWidthPct measures ` +
          `${Math.round(shoulder.length)}mm, short of the book's ${Math.round(
            shoulder.minimum
          )}mm floor, so SP was moved out along the shoulder line at unchanged height to ` +
          `${Math.round(shoulder.target)}mm (the middle of the book's ideal band). ` +
          `backWidthPct is not controlling the shoulder in this draft; shoulderToShoulder ` +
          `is. See ambiguity 14 in docs/patterns/bodiceblock.md.`
      )

    /*
     * Back neckline: square to the center back, running into the shoulder at NP.
     */
    points.oCp = points.o.shift(0, points.np.x * 0.6)
    points.npCp = new Point(points.np.x, points.o.y)

    /*
     * Center back and side seam. Without waist shaping both stay on the plain block's
     * section 1 line; with it the center back comes in at the waist and returns to the
     * vertical at the back-width line above and the hip line below, and the side seam
     * takes a further 1 cm.
     */
    const slant = options.waistFit ? CB_SLANT : 0
    points.cbTop = new Point(0, st.yBackWidth)
    points.cbWaist = new Point(slant, st.yWaist)
    points.cbHip = new Point(0, st.yHip)
    points.sideWaist = new Point(st.backSide1 - (options.waistFit ? SIDE_EXTRA : 0), st.yWaist)

    verticalCurve(points, points.cbTop, points.cbWaist, 'cbUpper')
    verticalCurve(points, points.cbWaist, points.cbHip, 'cbLower')
    verticalCurve(points, points.up, points.sideWaist, 'sideUpper')
    verticalCurve(points, points.sideWaist, points.hp, 'sideLower')

    if (options.waistFit) waistDart(sh, st.backWidth / 4, st.yWaist, st.backDart)

    paths.armhole = armholePath(points, Path).hide()

    paths.seam = new Path()
      .move(points.o)
      .curve(points.oCp, points.npCp, points.np)
      .line(points.sp)
      .join(paths.armhole.reverse())
      .curve(points.sideUpperCp1, points.sideUpperCp2, points.sideWaist)
      .curve(points.sideLowerCp1, points.sideLowerCp2, points.hp)
      .line(points.cbHip)
      .curve(points.cbLowerCp2, points.cbLowerCp1, points.cbWaist)
      .curve(points.cbUpperCp2, points.cbUpperCp1, points.cbTop)
      .line(points.o)
      .close()
      .addClass('fabric')

    /*
     * The book drops the waist line at the side seam by 5 mm once the darts are set,
     * to get a level waist on the body. Marked, not cut.
     */
    points.trueWaistSide = points.sideWaist.shift(-90, 5)
    paths.waistline = new Path()
      .move(points.cbWaist)
      .line(points.trueWaistSide)
      .addClass('note help')

    if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')

    /*
     * The sleeve contract, off the calibrated curves.
     */
    storeArmhole(store, points, Path, 'back')

    /*
     * Annotations
     */
    if (options.waistFit) store.cutlist.addCut({ cut: 2, from: 'fabric' })
    else {
      store.cutlist.addCut({ cut: 1, from: 'fabric', onFold: true })
      macro('cutonfold', { from: points.o, to: points.cbHip })
    }

    points.grainlineFrom = new Point(st.backWidth / 2, st.yBust)
    points.grainlineTo = new Point(st.backWidth / 2, st.yHip)
    macro('grainline', { from: points.grainlineFrom, to: points.grainlineTo })

    points.title = new Point((st.backWidth / 4 + st.backSide1) / 2, st.yBust + 60)
    macro('title', { at: points.title, nr: 1, title: 'back', align: 'center', scale: 0.6 })

    return part
  },
}
