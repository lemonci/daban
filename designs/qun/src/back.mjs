import { blockMeasurements, blockOptions, draftBlock, addDart, weaveDarts } from './shared.mjs'

export const back = {
  name: 'qun.back',
  measurements: blockMeasurements,
  options: blockOptions,
  draft: (sh) => {
    const { Point, Path, points, paths, macro, store, sa, part } = sh
    const { dartIntake, yokeDepth, partWidth } = draftBlock(sh, 'cb')

    const waist = new Path()
      .move(points.cbWaist)
      .curve(points.waistCp1, points.waistCp2, points.sideWaist)

    // Two back darts, on guide lines 8 and 14.5 cm from CB on the book's 26 cm block
    addDart(sh, waist, 'dart1', (partWidth * 8) / 26, yokeDepth, dartIntake)
    addDart(sh, waist, 'dart2', (partWidth * 14.5) / 26, yokeDepth, dartIntake)

    paths.seam = weaveDarts(waist, points, ['dart1', 'dart2'])
      .curve(points.sideCp1, points.sideCp2, points.sideSeat)
      .line(points.sideHem)
      .curve(points.hemCp1, points.hemCp2, points.cbHem)
      .line(points.cbWaist)
      .close()
      .addClass('fabric')

    if (sa) {
      const offset = new Path()
        .move(points.cbHem)
        .curve(points.hemCp2, points.hemCp1, points.sideHem)
        .line(points.sideSeat)
        .curve(points.sideCp2, points.sideCp1, points.sideWaist)
        .curve(points.waistCp2, points.waistCp1, points.cbWaist)
        .offset(sa)
      paths.sa = new Path()
        .move(points.cbHem)
        .line(offset.start())
        .join(offset)
        .line(points.cbWaist)
        .addClass('fabric sa')
    }

    /*
     * Annotations
     */
    store.cutlist.addCut({ cut: 1, from: 'fabric', onFold: true })

    macro('cutonfold', { from: points.cbWaist, to: points.cbHem })

    points.grainlineFrom = new Point(partWidth / 4, points.cbSeat.y)
    points.grainlineTo = new Point(partWidth / 4, points.cbHem.y)
    macro('grainline', { from: points.grainlineFrom, to: points.grainlineTo })

    points.title = points.cbSeat
      .shiftFractionTowards(points.sideSeat, 0.5)
      .shift(-90, points.cbSeat.dist(points.cbHem) / 3)
    macro('title', { at: points.title, nr: 1, title: 'back', align: 'center', scale: 0.8 })

    return part
  },
}
