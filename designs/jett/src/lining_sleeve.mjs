import { sleeve } from './sleeve.mjs'
import { lining_back } from './lining_back.mjs'

function draftJettLiningSleeve({
  points,
  Point,
  paths,
  Path,
  options,
  complete,
  measurements,
  store,
  macro,
  utils,
  snippets,
  Snippet,
  sa,
  log,
  part,
  expand,
}) {
  //Remove all the bits from the sleeve that it doesn't need

  if (!expand) {
    return part.hide()
  }
  const armscyeShiftDifference = store.get('armscyeShiftDifference')
  if (armscyeShiftDifference < 0.02 * measurements.biceps) {
    return part.hide()
  }
  macro('rmtitle')
  store.cutlist.addCut({ cut: false })
  store.cutlist.addCut({ cut: false, from: 'lining' })
  store.cutlist.addCut({ from: 'lining' })

  //Shift the biceps points
  const baseangle = points.capQ1Cp1.angle(points.bicepsRight)
  const armscyeshift = store.get('armscyeShiftDifference')
  points.bicepsRight = points.bicepsRight.shift(baseangle, armscyeshift)
  points.bicepsLeft = points.bicepsLeft.shift(180 - baseangle, armscyeshift)

  //redraw seam
  paths.seam = new Path()
    .move(points.bicepsLeft)
    .move(points.wristLeft)
    .move(points.wristRight)
    .line(points.bicepsRight)
    .join(paths.sleevecap)
    .close()
    .setClass('fabric')

  if (sa) paths.sa = paths.seam.offset(sa).setClass('fabric sa')

  macro('title', { at: points.title, nr: 13, title: 'lining_sleeve' })

  return part
}

export const lining_sleeve = {
  name: 'jett.lining_sleeve',
  measurements: [],
  after: lining_back,
  from: sleeve,
  options: {},
  draft: draftJettLiningSleeve,
}
