import { Store } from '@freesewing/core'
import { scaleAllPoints } from '../../../../shared.mjs'

function draft_path3(
  Path,
  Point,
  paths,
  points,
  measurements,
  options,
  utils,
  macro,
  part,
  store,
  log
) {
  // Path: path3
  points.path3_p1 = new Point(497.4, 1021.8)
  points.crownCenter_cp1 = new Point(629.1, 810.7)
  points.crownCenter_cp2 = new Point(748.9, 610.3)
  points.crownCenter_ep = new Point(751.9, 315.4)
  points.foreheadCenter_cp1 = new Point(693.5, 307.6)
  points.foreheadCenter_cp2 = new Point(577.9, 311.9)
  points.foreheadCenter_ep = new Point(501.9, 325.9)
  points.lowerPoint_cp1 = new Point(513.1, 465.8)
  points.lowerPoint_cp2 = new Point(549, 789.2)
  points.lowerPoint_ep = new Point(497.4, 1021.8)

  points.title = new Point(550, 600)

  points.grainlineFrom = new Point(570, 400)
  points.grainlineTo = new Point(680, 400)

  scaleAllPoints(part, options.totalSize * options.hairlineHeadScale)

  paths.crownSeam = new Path()
    .move(points.crownCenter_ep)
    .curve(points.foreheadCenter_cp1, points.foreheadCenter_cp2, points.foreheadCenter_ep)

  paths.sideSeam = new Path()
    .move(points.lowerPoint_ep)
    .curve(points.crownCenter_cp1, points.crownCenter_cp2, points.crownCenter_ep)

  paths.foreheadSeam = new Path()
    .move(points.foreheadCenter_ep)
    .curve(points.lowerPoint_cp1, points.lowerPoint_cp2, points.lowerPoint_ep)

  const sideSeamLower = store.get('lowerHeadSeam')

  const sideSeamLength = paths.sideSeam.length() + sideSeamLower
  log.info('Hairline head side seam length is ' + sideSeamLength)

  paths.path3 = new Path()
    .move(points.lowerPoint_ep)
    .join(paths.sideSeam)
    .join(paths.crownSeam)
    .join(paths.foreheadSeam)
    .close()
}

export { draft_path3 }
