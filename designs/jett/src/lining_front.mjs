import { front } from './front.mjs'

function draftJettLiningFront({
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
  if (!expand) {
    return part.hide()
  }
  //Remove all the bits from the front that it doesn't need
  macro('rmtitle')
  for (const i in snippets) delete snippets[i]
  //for (const i in paths) paths[i].unhide()
  delete paths.pocketOutline
  paths.seam.hide()
  paths.saBase.hide()
  paths.edgePlacketLine.hide()

  //Shift armscye point
  const armShiftAngle = 90 * options.armholeShiftAngle
  const toShift = ['armhole', 'armholeCp2']
  const toShiftHalf = ['armholeHollowCp1', 'armholeHollow', 'armholeHollowCp2']
  const armShiftDistance = options.liningArmscyeShift * measurements.chest
  for (const i of toShift) points[i] = points[i].shift(armShiftAngle, armShiftDistance)
  for (const i of toShiftHalf) points[i] = points[i].shift(armShiftAngle, armShiftDistance * 0.5)

  store.cutlist.addCut({ cut: false })
  store.cutlist.addCut({ cut: false, from: 'lining' })
  store.cutlist.addCut({ from: 'lining' })

  //Redefine side seam
  if (!options.bustDart || (options.bustDart && !options.draftForHighBust)) {
    paths.sideSeam = new Path().move(points.hem).line(points.armhole).hide()
  } else {
    paths.sideSeam = new Path()
      .move(points.hem)
      .line(points.dartBottomEdge)
      .line(points.dartTopEdge)
      .line(points.armhole)
      .hide()
  }

  //Redefine base seam and seam allowance
  paths.saBase = new Path().move(points.centerPlacketBottom)
  if (options.useBellyAdjustment) {
    paths.saBase = paths.saBase.line(points.bellyEdge)
  }
  paths.saBase = paths.saBase
    .line(points.hem)
    .join(paths.sideSeam)
    .curve(points.armholeCp2, points.armholeHollowCp1, points.armholeHollow)

  if (options.bustDart && options.draftForHighBust) {
    paths.saBase = paths.saBase.line(points.armholeIntercept)
  } else {
    paths.saBase = paths.saBase.curve(
      points.armholeHollowCp2,
      points.armholePitchCp1,
      points.armholePitch
    )
  }
  paths.saBase = paths.saBase
    //.curve(points.armholeHollowCp2, points.armholePitchCp1, points.armholePitch)
    .join(paths.frontArmhole)
    .line(points.s3CollarSplit)
    .join(paths.frontCollar)
    .line(points.centerPlacketTop)
  //.line(points.centerPlacketBottom)
  //.close()

  //Redraw seam allowance
  if (sa) {
    paths.sa = paths.saBase.offset(sa).setClass('fabric sa')
    paths.sa.line(paths.sa.start())
  }

  macro('title', { at: points.title, nr: 11, title: 'lining_front' })

  return part
}

export const lining_front = {
  name: 'jett.lining_front',
  measurements: [],
  from: front,
  options: {
    liningArmscyeShift: {
      pct: 2,
      max: 5,
      min: 0,
      menu: 'advanced.lining',
    },
  },
  draft: draftJettLiningFront,
}
