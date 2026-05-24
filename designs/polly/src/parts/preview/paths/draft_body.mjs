function draft_body(Path, Point, paths, points, measurements, options, utils, macro, part) {
  paths.body = new Path()
    .move(points.body_p1)
    .curve(points.armpitNotch_cp1, points.armpitNotch_cp2, points.armpitNotch_ep)
    .curve(points.body_p3_cp1, points.body_p3_cp2, points.body_p3_ep)
    .curve(points.body_p4_cp1, points.body_p4_cp2, points.hipOuter)
    .curve(points.hipCurveNotch_cp1, points.hipCurveNotch_cp2, points.hipCurveNotch_ep)
    .curve(points.body_p6_cp1, points.body_p6_cp2, points.hipInner)
    .line(points.crotchCenter)
}

export { draft_body }
