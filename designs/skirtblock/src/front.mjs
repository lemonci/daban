import { blockMeasurements, blockOptions, draftBlock, addDart, weaveDarts } from './shared.mjs'

export const front = {
  name: 'skirtblock.front',
  measurements: blockMeasurements,
  options: blockOptions,
  draft: (sh) => {
    const { Point, Path, points, paths, macro, store, sa, part } = sh
    const { dartIntake, yokeDepth, partWidth } = draftBlock(sh, 'cf')

    const waist = new Path()
      .move(points.cfWaist)
      .curve(points.waistCp1, points.waistCp2, points.sideWaist)

    // One front dart, on a guide line a third of the way from the side seam to CF
    addDart(sh, waist, 'dart1', (points.sideWaist.x * 2) / 3, yokeDepth, dartIntake)

    paths.seam = weaveDarts(waist, points, ['dart1'])
      .curve(points.sideCp1, points.sideCp2, points.sideSeat)
      .line(points.sideHem)
      .curve(points.hemCp1, points.hemCp2, points.cfHem)
      .line(points.cfWaist)
      .close()
      .addClass('fabric')

    if (sa) {
      const offset = new Path()
        .move(points.cfHem)
        .curve(points.hemCp2, points.hemCp1, points.sideHem)
        .line(points.sideSeat)
        .curve(points.sideCp2, points.sideCp1, points.sideWaist)
        .curve(points.waistCp2, points.waistCp1, points.cfWaist)
        .offset(sa)
      paths.sa = new Path()
        .move(points.cfHem)
        .line(offset.start())
        .join(offset)
        .line(points.cfWaist)
        .addClass('fabric sa')
    }

    /*
     * Annotations
     */
    store.cutlist.addCut({ cut: 1, from: 'fabric', onFold: true })

    macro('cutonfold', { from: points.cfWaist, to: points.cfHem })

    points.grainlineFrom = new Point(partWidth / 4, points.cfSeat.y)
    points.grainlineTo = new Point(partWidth / 4, points.cfHem.y)
    macro('grainline', { from: points.grainlineFrom, to: points.grainlineTo })

    points.title = points.cfSeat
      .shiftFractionTowards(points.sideSeat, 0.5)
      .shift(-90, points.cfSeat.dist(points.cfHem) / 3)
    macro('title', { at: points.title, nr: 2, title: 'front', align: 'center', scale: 0.8 })

    return part
  },
}
