/*
 * Chapter 12 is a join, not a new draft. It takes the bodice block exactly as chapter 2
 * leaves it -- through the hip point HP -- extends the centre line below the hip line by
 * the skirt length, and borrows one number per panel from the skirt block: the length of
 * that panel's hem edge. Nothing above the hip line is touched, and no bodice or skirt
 * geometry is restated here.
 *
 * Reference: docs/patterns/dressblock.md (Natalie Bray, 英国经典服装纸样设计 基础篇, pp.157-162)
 * All lengths are millimetres.
 */
import { blockOptions as skirtOptions, draftBlock } from '@freesewing/skirtblock'

/*
 * p.158: the hem baseline leaves the centre line at a right angle and "尾端稍稍向上弯曲
 * 0.5~1cm" -- its tail curls up by half to one centimetre. The book states the range but
 * no value; this is its midpoint, chosen rather than quoted (dressblock.md ambiguity 1).
 */
export const HEM_CURL = 7.5

/*
 * On top of everything the bodice block already asks for, the dress needs the skirt
 * block's own length measurement, because chapter 12's skirt length is measured from the
 * waist the way the skirt block measures it.
 */
export const dressMeasurements = ['waistToKnee']

/*
 * Likewise the two skirt-block options that decide how long the skirt is and how far it
 * flares are taken from the skirt block itself rather than restated. `seatEase` needs no
 * entry: the bodice block already carries it at the same 6.12% (dressblock.md ambiguity 5).
 */
export const dressOptions = {
  lengthBonus: { ...skirtOptions.lengthBonus },
  silhouette: { ...skirtOptions.silhouette },
  /*
   * p.158: to close the hem in, shorten each centre-to-side-seam hem length by 2 to 4 cm
   * and mark the new point inside the original. FreeSewing's shared config test rejects
   * raw mm options, so the book's centimetres are expressed as a fraction of the panel's
   * own hem width -- 2 to 4 cm is 7 to 14% of it at the book's worked size.
   */
  hemTighten: { pct: 0, min: 0, max: 15, menu: 'style' },
}

/*
 * Step 1. The book does not compute the dress hem. It sends you to the standard skirt
 * block and has you measure, *separately*, from its back centre and from its front centre
 * to its side seam ("分别量出从前中、后中至侧缝线的长度"). So this drafts the skirt block's
 * own outline and measures the hem edge it draws, rather than restating its arithmetic.
 *
 * `c` is the centre prefix -- 'cb' on the back panel, 'cf' on the front -- so each dress
 * panel reads the skirt panel it is actually continuing. The two come out equal today
 * only because the skirt block's panels are congruent; reading them separately is what
 * keeps this correct if that ever stops being true.
 */
export function skirtHemLength({ Point, Path, measurements, options }, c) {
  const points = {}
  draftBlock({ Point, points, measurements, options }, c)

  return new Path()
    .move(points[`${c}Hem`])
    .curve(points.hemCp2, points.hemCp1, points.sideHem)
    .length()
}

/*
 * Extends one drafted bodice panel into a dress panel. `c` is that panel's centre prefix,
 * which the bodice block and the skirt block happen to name the same way.
 */
export function extend(sh, c) {
  const { Point, points, paths, options, measurements, macro, store, sa } = sh

  /*
   * Steps 1 and 3: the hem width this panel is to be marked at, closed in by `hemTighten`.
   */
  const hemWidth = skirtHemLength(sh, c) * (1 - options.hemTighten)

  /*
   * Step 2: continue the centre line straight down to the hem depth -- the skirt length,
   * measured from the waist line -- and put the hem baseline there, square to the centre
   * line, with its outer end curled up.
   */
  const skirtLength = measurements.waistToKnee * (1 + options.lengthBonus)
  points.centerHem = new Point(0, points[`${c}Waist`].y + skirtLength)
  points.sideHem = new Point(hemWidth, points.centerHem.y - HEM_CURL)

  /*
   * Step 4: connect the hem mark up to the bodice's side seam, "平滑而不间断地" -- smoothly
   * and without a break. The bodice's side seam arrives at HP vertically, so leaving HP
   * vertically is what makes the join tangent-continuous; arriving vertically in turn
   * squares the side seam to the hem. The book fixes only the two endpoints and that
   * smoothness, so the curve family is this implementation's (dressblock.md ambiguity 2).
   */
  const run = Math.abs(points.sideHem.y - points.hp.y) / 3
  points.sideHemCp1 = points.hp.shift(-90, run)
  points.sideHemCp2 = points.sideHem.shift(90, run)

  /*
   * Step 5: the hem itself, square to the centre line where it starts and running into
   * the curled-up mark.
   */
  const chord = points.centerHem.dist(points.sideHem)
  points.hemCp1 = points.centerHem.shift(0, chord / 3)
  points.hemCp2 = points.sideHem.shiftTowards(points.centerHem, chord / 3)

  /*
   * The bodice's own outline, cut at HP and at the hip point on the centre line, with the
   * skirt spliced in between. Everything else -- neckline, shoulder, armhole, waist
   * shaping, centre-line slant -- is the bodice block's, unmodified.
   */
  const bodice = paths.seam
  const upper = bodice.split(points.hp)[0]
  const center = bodice.split(points[`${c}Hip`])[1]

  paths.seam = upper
    .curve(points.sideHemCp1, points.sideHemCp2, points.sideHem)
    .curve(points.hemCp2, points.hemCp1, points.centerHem)
    .line(points[`${c}Hip`])
    .join(center)
    .close()
    .addClass('fabric')

  if (sa) paths.sa = paths.seam.offset(sa).addClass('fabric sa')

  /*
   * Annotations. The bodice block's own grainline and fold marker stopped at the hip
   * line, so they are redrawn here for the finished length, and its cutting instructions
   * arrive here already copied in by the cutlist plugin -- hence `setCut`, not `addCut`.
   */
  if (options.waistFit) store.cutlist.setCut({ cut: 2, from: 'fabric' })
  else {
    store.cutlist.setCut({ cut: 1, from: 'fabric', onFold: true })
    macro('rmcutonfold')
    macro('cutonfold', { from: points.o, to: points.centerHem })
  }

  macro('rmgrainline')
  points.grainlineTo = new Point(points.grainlineFrom.x, points.centerHem.y)
  macro('grainline', { from: points.grainlineFrom, to: points.grainlineTo })
}
