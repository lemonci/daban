import { front, paperlessBack } from './front.mjs'

export const back = {
  name: 'shale.back',
  from: front,
  measurements: [],
  optionalMeasurements: [],
  options: {},
  draft: ({ points, Path, paths, macro, options, part, sa, complete }) => {
    if (!options.splitParts) {
      return part.hide()
    }

    for (const key of Object.keys(paths)) {
      paths[key].hide()
    }
    paths.seamBack.close().unhide()

    if (sa) {
      let hemWidth = sa

      paths.saBase = new Path()
        .move(points.legBack)
        .line(points.forkBack)
        .curve(points.crotchCp2Back, points.crotchCp1Back, points.seatBack)
        .line(points.styleWaistBack)
        .curve(points.styleWaistCp1, points.styleWaistCp2, points.styleWaistOut)
        .line(points.styleWaistOut)
        .hide()

      if (complete) {
        paths.legFold = paths.legBack.offset(sa).setClass('various help')
      }
      // paths.sideFold = paths.backSplit.offset(sa).setClass('various help')
      // paths.bridge = new Path()
      //   .move(paths.sideFold.end())
      //   .line(paths.legFold.start())
      //   .setClass('various help')
      //   .hide()

      paths.sa = macro('sa', {
        paths: [
          paths.saBase,
          { p: paths.backSplit, offset: sa },
          // paths.bridge,
          { p: paths.legBack, offset: sa + hemWidth },
        ],
      })
    }

    points.title = points.crotchOut.shiftFractionTowards(points.seatBack, 0.1)
    macro('title', { at: points.title, nr: 2, title: 'back' })
    macro('grainline', {
      from: points.styleWaistOut.translate(15, 0),
      to: points.legOut.translate(15, 0),
    })

    paperlessBack(macro, points, paths)
    return part
  },
}
