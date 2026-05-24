function draft_darts(Path, Point, paths, points, measurements, options, utils, macro, part) {
  paths.lowerDart = new Path().move(points.lowerDart_p1).line(points.lowerDartPoint_ep)

  paths.upperDart = new Path().move(points.upperDart_p1).line(points.upperDartPoint_ep)
}

export { draft_darts }
