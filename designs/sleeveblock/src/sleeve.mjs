/*
 * Natalie Bray's straight sleeve (直袖), chapter 7 of 英国经典服装纸样设计 基础篇.
 *
 * Reference: docs/patterns/sleeveblock.md (pp.92-100). All lengths are millimetres.
 *
 * The sleeve is a standalone draft: the cutting rectangle and the cap both come from
 * `biceps`, `shoulderToWrist` and `shoulderToElbow` alone (pp.94-96). The bodice armhole
 * only ever enters as a check on the finished cap arc, run after both pieces are drawn
 * (p.95, p.99), so it is a test rather than a drafting input -- see tests/armhole.test.mjs.
 *
 * Coordinates: x runs across the sleeve, 0 at the back/outer seam edge and `rootWidth` at
 * the front/inner one; y runs down from the cap apex.
 */

/*
 * Fixed millimetre values the book states for its own worked root width of 35 cm. It
 * never says whether they scale with the sleeve, so the spec pins them (sleeveblock.md
 * ambiguity 4) and the cap-arc closure check in tests/oracle.test.mjs is the guard. A
 * consequence worth knowing, the same one the bodice block has: far below adult size
 * these constants stay put while everything else shrinks, so doll models draft but the
 * shape they give is meaningless.
 */
const B_DROP = 55 // p.95: B sits 5.5 cm below the top edge of the rectangle
const F_DROP = 60 // p.95: F sits 6 cm below it, 5 mm lower than B
const RECT_SHORTENING = 10 // p.95: the rectangle is drafted at sleeve length - 1 cm
const ELBOW_NOTCH_ABOVE = 75 // p.96: side-seam notch 7.5 cm above the elbow line
const ELBOW_NOTCH_BELOW = 50 // p.96: and 5 cm below it
const HEM_RISE = 25 // p.96: the front quarter line's hem point rises 2.5 cm

/*
 * The four chord-midpoint offsets of the cap (p.95), in chord order and in drafting
 * sign: positive is down, away from the apex. They hollow the cap at both underarms and
 * crown it in between, with the front hollow twice as deep as the back.
 */
const CAP_AUX = [10, -10, -12, 20] // U_back-B, B-T, T-F, F-U_front

/*
 * The cap is one smooth curve through nine points (p.95, figure 7-3): the two underarm
 * points, B, T and F, and the four offset chord midpoints between them. A uniform
 * Catmull-Rom spline interpolates all nine and keeps its tangent continuous, which is
 * what rounds the crown off at T; giving each chord its own parabola through the offset
 * midpoint instead leaves a 17 degree corner there. The one-sixth factor is the standard
 * Catmull-Rom to Bezier conversion, and at both ends the missing outside neighbour is
 * taken to be the endpoint itself.
 */
function smoothThrough(Point, Path, through) {
  let path = new Path().move(through[0])
  for (let i = 0; i < through.length - 1; i++) {
    const before = through[i - 1] || through[0]
    const after = through[i + 2] || through[through.length - 1]
    path = path.curve(
      new Point(
        through[i].x + (through[i + 1].x - before.x) / 6,
        through[i].y + (through[i + 1].y - before.y) / 6
      ),
      new Point(
        through[i + 1].x - (after.x - through[i].x) / 6,
        through[i + 1].y - (after.y - through[i].y) / 6
      ),
      through[i + 1]
    )
  }

  return path
}

export const sleeve = {
  name: 'sleeveblock.sleeve',
  measurements: ['biceps', 'shoulderToElbow', 'shoulderToWrist'],
  /*
   * The book states neither range. `bicepEase` brackets its three garment-weight ease
   * classes (5 cm skirts and blouses, 6 to 7 cm shirts and jackets, 8 cm coats, p.94);
   * `capHeight` runs from a third of the root width to the 14/35 of the high-cap variant
   * in appendix 2 (p.203). Both defaults are the book's own worked figure.
   */
  options: {
    bicepEase: { pct: 16.7, min: 15, max: 27, menu: 'fit' },
    capHeight: { pct: 37.14, min: 33, max: 40, menu: 'fit' },
  },
  draft: (sh) => {
    const { Point, Path, Snippet, points, paths, snippets, measurements, options } = sh
    const { macro, store, sa, part } = sh

    /*
     * The cutting rectangle (step 1) and the lines that divide it up. The quarter lines
     * are the book's 后袖线 and 前袖线: internal references that locate B, F and the
     * elbow, never cut edges.
     */
    const rootWidth = measurements.biceps * (1 + options.bicepEase)
    const capHeight = rootWidth * options.capHeight
    const rectLength = measurements.shoulderToWrist - RECT_SHORTENING
    const quarter = rootWidth / 4

    points.capApex = new Point(rootWidth / 2, 0) // T
    points.backUnderarm = new Point(0, capHeight) // U_back, on the DC root line
    points.frontUnderarm = new Point(rootWidth, capHeight) // U_front
    points.backNotch = new Point(quarter, B_DROP) // B
    points.frontNotch = new Point(3 * quarter, F_DROP) // F

    /*
     * Step 8: the midpoint of each cap chord, pushed off the chord by its book constant.
     * The offsets run straight down the page, not square to the chord, which is how the
     * book dimensions them in figure 7-2.
     */
    const chain = [
      points.backUnderarm,
      points.backNotch,
      points.capApex,
      points.frontNotch,
      points.frontUnderarm,
    ]
    const auxNames = ['backHollowAux', 'backCrownAux', 'frontCrownAux', 'frontHollowAux']
    for (let i = 0; i < auxNames.length; i++) {
      const mid = chain[i].shiftFractionTowards(chain[i + 1], 0.5)
      points[auxNames[i]] = new Point(mid.x, mid.y + CAP_AUX[i])
    }

    paths.cap = smoothThrough(Point, Path, [
      points.backUnderarm,
      points.backHollowAux,
      points.backNotch,
      points.backCrownAux,
      points.capApex,
      points.frontCrownAux,
      points.frontNotch,
      points.frontHollowAux,
      points.frontUnderarm,
    ]).hide()

    /*
     * Step 13: the hem. The front quarter line's hem point rises 2.5 cm and the back
     * quarter line's stays on the base hem, so the hem runs lower and longer at the back.
     * The cut is made through the folded sleeve (figure 7-6, 对折的袖片), and the quarter
     * lines are the folds, so beyond each of them the cut line mirrors: unrolled, the hem
     * is a chevron, and both seam edges land on the middle of the sloped segment. That
     * closes the underarm seam flush and keeps the whole hem inside the cutting rectangle,
     * which is what tells this reading apart from a straight diagonal run out to the seam
     * edges -- see sleeveblock.md ambiguity 6, and the two checks in tests/oracle.test.mjs.
     */
    points.backQuarterHem = new Point(quarter, rectLength)
    points.frontQuarterHem = new Point(3 * quarter, rectLength - HEM_RISE)
    points.backHem = new Point(0, rectLength - HEM_RISE / 2)
    points.frontHem = new Point(rootWidth, rectLength - HEM_RISE / 2)

    /*
     * Step 11: the elbow height is stepped off as a diagonal from T to the back quarter
     * line (figures 7-5 and 7-7), not straight down the sleeve centre, so the elbow line
     * lands higher than the measurement itself.
     */
    points.elbow = new Point(quarter, Math.sqrt(measurements.shoulderToElbow ** 2 - quarter ** 2))
    points.elbowFront = new Point(rootWidth, points.elbow.y)
    points.elbowBack = new Point(0, points.elbow.y)

    paths.elbowLine = new Path()
      .move(points.elbowBack)
      .line(points.elbowFront)
      .addClass('note help')

    /*
     * Step 10: the two straight seam edges, and the outline they close with the cap and
     * the hem. Figure 7-7 rounds the two chevron corners; that is drawing latitude, so
     * the hem stays a three-segment polyline.
     */
    paths.seam = new Path()
      .move(points.backHem)
      .line(points.backUnderarm)
      .join(paths.cap)
      .line(points.frontHem)
      .line(points.frontQuarterHem)
      .line(points.backQuarterHem)
      .line(points.backHem)
      .close()
      .addClass('fabric')

    if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')

    /*
     * Notches: T, B and F are the sleeve's only three set-in points (p.99), and the
     * elbow gets a pair on each seam edge (step 12).
     */
    for (const name of ['capApex', 'backNotch', 'frontNotch'])
      snippets[name] = new Snippet('notch', points[name])
    for (const [edge, x] of [
      ['back', 0],
      ['front', rootWidth],
    ]) {
      points[`${edge}ElbowAbove`] = new Point(x, points.elbow.y - ELBOW_NOTCH_ABOVE)
      points[`${edge}ElbowBelow`] = new Point(x, points.elbow.y + ELBOW_NOTCH_BELOW)
      snippets[`${edge}ElbowAbove`] = new Snippet('notch', points[`${edge}ElbowAbove`])
      snippets[`${edge}ElbowBelow`] = new Snippet('notch', points[`${edge}ElbowBelow`])
    }

    /*
     * Annotations
     */
    store.cutlist.addCut({ cut: 2, from: 'fabric' })

    points.grainlineFrom = new Point(rootWidth / 2, capHeight)
    points.grainlineTo = new Point(rootWidth / 2, rectLength - HEM_RISE)
    macro('grainline', { from: points.grainlineFrom, to: points.grainlineTo })

    points.title = new Point(rootWidth / 2, capHeight + (rectLength - capHeight) / 4)
    macro('title', { at: points.title, nr: 1, title: 'sleeve', align: 'center', scale: 0.8 })

    return part
  },
}
