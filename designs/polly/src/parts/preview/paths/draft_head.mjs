function draft_head(Path, Point, paths, points, measurements, options, utils, macro, part) {
  paths.head = new Path()
    .move(points.headTop)
    .curve(points.upperDartPoint_cp1, points.upperDartPoint_cp2, points.upperDartPoint_ep)
    .curve(points.head_p3_cp1, points.head_p3_cp2, points.head_p3_ep)
    .curve(points.lowerDartPoint_cp1, points.lowerDartPoint_cp2, points.lowerDartPoint_ep)
    .curve(points.chinBottom_cp1, points.chinBottom_cp2, points.chinBottom_ep)
}

export { draft_head }
