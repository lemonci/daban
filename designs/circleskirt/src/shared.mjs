/*
 * Bray's circle skirt is a compass construction, not a block edit: the waist is a literal
 * circular arc whose radius comes from the waist measurement, and the hem is a second arc
 * concentric with it (第十六章 圆裙纸样 第一节 画样法, pp.189-198). Front and back are
 * geometrically identical -- no dart distinguishes them -- so the whole panel is drafted
 * here and both parts call into it.
 *
 * See docs/patterns/circleskirt.md for the full drafting spec.
 */

export const panelMeasurements = ['waist', 'waistToKnee']

export const panelOptions = {
  lengthBonus: { pct: 35, min: 0, max: 105, menu: 'style' },
  fullness: { dflt: 'full', list: ['full', 'threeQuarter', 'half', 'quarter'], menu: 'style' },
  hipSafetyMargin: { pct: 6.43, min: 0, max: 7.14, menu: 'fit' },
}

// How many 90 degree base patterns (基础纸样) the garment is made of -- p.192, spec step 2
const panels = { full: 4, threeQuarter: 3, half: 2, quarter: 1 }

/*
 * Adds the two control points of a circular arc drawn as a single cubic Bezier: an arc
 * from `start` at angle `from`, sweeping `sweep` degrees to `end`, both on `radius`.
 * The control points sit k = 4/3 * tan(sweep/4) * radius along the tangents, which is
 * 0.5523 * radius at a 90 degree sweep. That approximation stays within 0.027% of the
 * radius, so 0.03mm at this design's waist and 0.22mm at its hem -- well inside the
 * +-2mm the oracle allows, and closer than a polyline of any sane segment count.
 */
function arcCps(points, name, start, end, radius, from, sweep) {
  const k = (4 / 3) * Math.tan((sweep * Math.PI) / 720) * radius
  points[`${name}Cp1`] = start.shift(from + 90, k)
  points[`${name}Cp2`] = end.shift(from + sweep - 90, k)
}

/*
 * Drafts the panel. `c` is the prefix of the fold-edge points: `cb` on the back, `cf` on
 * the front. `nr` is the part number for the title macro.
 */
export function draftPanel(sh, c, nr) {
  const { Point, Path, points, paths, measurements, options, macro, store, sa, part } = sh

  const n = panels[options.fullness]
  const margin = measurements.waist * options.hipSafetyMargin
  const waistEff = measurements.waist + margin

  /*
   * The quarter arc Aa is waistEff/n (step 2), and Aa is by definition the arc of a 90
   * degree sector, so Aa = (pi/2) * r and r = (2/pi) * Aa (step 3). The book offers
   * `Aa * 2/3` instead, but only as tape-measure relief ("要算出半径并不太容易", p.191);
   * with the truncation it goes on to apply, that leaves the waist 9mm tight, and code
   * has pi. See Ambiguity 1 in the spec.
   */
  const r = (2 / Math.PI) * (waistEff / n)
  const length = measurements.waistToKnee * (1 + options.lengthBonus)
  const rHem = r + length

  /*
   * CHOSEN, not book-stated. The book describes the assembly only for the full circle
   * (spec step 7): front and back are each half the garment, cut on the fold, so each
   * drafted panel is a quarter of the garment's 90n degree sweep. At the default `full`
   * that is exactly the book's own 90 degree base pattern; at the other fullness values
   * the drafted sector narrows so that front plus back still sweep 90n degrees and the
   * waist still measures waistEff. The garment is still n base patterns' worth of cloth,
   * which is the chapter's organising idea.
   */
  const sweep = 22.5 * n
  const fold = -90 // the CF/CB fold edge runs straight down from O
  const side = fold + sweep // the side-seam edge

  points.center = new Point(0, 0) // O
  points[`${c}Waist`] = points.center.shift(fold, r) // A
  points[`${c}Hem`] = points.center.shift(fold, rHem) // B
  points.sideWaistRaw = points.center.shift(side, r) // a, before the hip-safety dart
  points.sideHem = points.center.shift(side, rHem) // b

  // The waist arc as drafted, and the hem arc concentric with it at r + length (step 5)
  arcCps(points, 'waistRaw', points[`${c}Waist`], points.sideWaistRaw, r, fold, sweep)
  arcCps(points, 'hem', points[`${c}Hem`], points.sideHem, rHem, fold, sweep)

  /*
   * Hip-safety margin (step 8, p.196): the block is sized from the waist alone, so the
   * waist is cut `margin` too big and the excess comes back out as a waist dart at each
   * of the two side seams. Each seam joins one front and one back edge, so each drafted
   * edge sheds a quarter of the margin and each seam the book's half of it.
   * The 100mm dart depth is chosen, not book-stated -- see Ambiguity 3 in the spec.
   */
  const dartIntake = margin / 4
  const dartSweep = ((dartIntake / r) * 180) / Math.PI
  points.sideWaist = points.center.shift(side - dartSweep, r)
  points.dartTip = points.center.shift(side, r + 100)
  arcCps(points, 'waist', points[`${c}Waist`], points.sideWaist, r, fold, sweep - dartSweep)

  paths.seam = new Path()
    .move(points[`${c}Waist`])
    .curve(points.waistCp1, points.waistCp2, points.sideWaist)
    .line(points.dartTip)
    .line(points.sideHem)
    .curve(points.hemCp2, points.hemCp1, points[`${c}Hem`])
    .line(points[`${c}Waist`])
    .close()
    .addClass('fabric')

  if (sa) {
    const offset = new Path()
      .move(points[`${c}Hem`])
      .curve(points.hemCp1, points.hemCp2, points.sideHem)
      .line(points.dartTip)
      .line(points.sideWaist)
      .curve(points.waistCp2, points.waistCp1, points[`${c}Waist`])
      .offset(sa)
    paths.sa = new Path()
      .move(points[`${c}Hem`])
      .line(offset.start())
      .join(offset)
      .line(points[`${c}Waist`])
      .addClass('fabric sa')
  }

  /*
   * Annotations
   */
  store.cutlist.addCut({ cut: 1, from: 'fabric', onFold: true })

  macro('cutonfold', { from: points[`${c}Waist`], to: points[`${c}Hem`] })

  // The straight grain runs along the fold; r/4 keeps the guide inside the narrowest sector
  points.grainlineFrom = new Point(r / 4, r + length / 6)
  points.grainlineTo = new Point(r / 4, r + (length * 5) / 6)
  macro('grainline', { from: points.grainlineFrom, to: points.grainlineTo })

  points.title = points.center.shift(fold + sweep / 2, r + length / 2)
  macro('title', {
    at: points.title,
    nr,
    title: c === 'cb' ? 'back' : 'front',
    align: 'center',
    scale: 0.8,
  })

  return part
}
