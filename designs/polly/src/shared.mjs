export function scaleAllPoints(part, scale) {
  const { store, measurements, options, points, paths, Path, Point, expand, sa, macro, units } =
    part.shorthand()

  points.origin = new Point(0, 0)
  for (let p in points) {
    points[p] = points[p].shiftFractionTowards(points.origin, 1 - scale)
  }
}
