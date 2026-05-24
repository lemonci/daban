function draft_leg(Path, Point, paths, points, measurements, options, utils, macro, part) {
  paths.leg = new Path()
    .move(points.hipOuter)
    .line(points.legPegOuter)
    .curve(points.legPegInner_cp1, points.legPegInner_cp2, points.legPegInner_ep)
    .line(points.hipInner)
}

export { draft_leg }
