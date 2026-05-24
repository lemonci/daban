import { scaleAllPoints } from '../../../../shared.mjs'

function draft_path2(Path, Point, paths, points, measurements, options, utils, macro, part, store) {
  // Path: path2
  points.path2_p1 = new Point(115.7, 1024.5)
  points.path2_p2_cp1 = new Point(203.3, 979.4)
  points.path2_p2_cp2 = new Point(340.9, 995.3)
  points.path2_p2_ep = new Point(440.5, 1023.2)
  points.path2_p3_cp1 = new Point(510.1, 788.7)
  points.path2_p3_cp2 = new Point(508.3, 453.4)
  points.path2_p3_ep = new Point(394.2, 272.5)
  points.path2_p4_cp1 = new Point(301.3, 310)
  points.path2_p4_cp2 = new Point(180.4, 382.1)
  points.path2_p4_ep = new Point(106.1, 455.2)
  points.path2_p5_cp1 = new Point(149.1, 516.5)
  points.path2_p5_cp2 = new Point(254.7, 613.2)
  points.path2_p5_ep = new Point(301.5, 641.8)
  points.path2_p6_cp1 = new Point(249.8, 613.7)
  points.path2_p6_cp2 = new Point(141.4, 581.4)
  points.path2_p6_ep = new Point(46.1, 582.5)
  points.path2_p7_cp1 = new Point(23.5, 719.6)
  points.path2_p7_cp2 = new Point(58.9, 924.7)
  points.path2_p7_ep = new Point(115.7, 1024.5)

  points.grainlineFrom = new Point(394.2, 370)

  points.title = new Point(150, 800)

  scaleAllPoints(part, options.totalSize * options.hairlineHeadScale)

  paths.centerSeam = new Path()
    .move(points.path2_p2_ep)
    .curve(points.path2_p3_cp1, points.path2_p3_cp2, points.path2_p3_ep)

  points.widestPoint = paths.centerSeam.shiftFractionAlong(0.4)

  paths.path2 = new Path()
    .move(points.path2_p1)
    .curve(points.path2_p2_cp1, points.path2_p2_cp2, points.path2_p2_ep)
    .join(paths.centerSeam)
    .curve(points.path2_p4_cp1, points.path2_p4_cp2, points.path2_p4_ep)
    .curve(points.path2_p5_cp1, points.path2_p5_cp2, points.path2_p5_ep)
    .curve(points.path2_p6_cp1, points.path2_p6_cp2, points.path2_p6_ep)
    .curve(points.path2_p7_cp1, points.path2_p7_cp2, points.path2_p7_ep)
    .close()
}

export { draft_path2 }
