import {
  blockMeasurements,
  blockOptions,
  structure,
  armholeControlPoints,
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
    const st = structure(sh)

    /*
     * Structure points (bodiceblock.md section A). Origin is center back on the top line.
     */
    points.o = new Point(0, st.yOBack)
    points.np = new Point(st.neckWidth, st.yOBack - 20)
    points.armholePitch = new Point(st.backWidth / 2, st.yBackWidth)
    points.up = new Point(st.backUpX, st.yBust)
    points.sp = new Point(st.backWidth / 2 + 20, st.yShoulderBack)
    points.hp = new Point(st.backHpX, st.yHip)

    /*
     * Shoulder length check (book p.16): the drafted shoulder seam has to be at least
     * S + 1 cm, ideally S + 1.5 to 2 cm. If it comes up short the shoulder is lengthened
     * outward, and SP keeps the height it was drafted at:
     * "无论加长或缩短肩宽，SP点都必须在原有高度上不变".
     */
    const minShoulder = st.shoulderSeam + 10
    if (points.np.dist(points.sp) < minShoulder) {
      const rise = points.sp.y - points.np.y
      points.sp = new Point(points.np.x + Math.sqrt(minShoulder ** 2 - rise ** 2), points.sp.y)
    }

    /*
     * Armhole: square to the bust line at the underarm point, square to the back-width
     * guide at the pitch point, smoothed 3 cm off the corner in between.
     */
    armholeControlPoints(sh, 30)
    const shoulderAngle = points.np.angle(points.sp)
    const toPitch = points.sp.dist(points.armholePitch) / 3
    points.pitchCp1 = points.armholePitch.shift(90, toPitch)
    points.spCp = points.sp.shift(shoulderAngle - 90, toPitch)

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
     * The sleeve contract: real measured curve lengths, not formulas.
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
