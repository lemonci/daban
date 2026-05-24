function draft_armSeam(Path, Point, paths, points, measurements, options, utils, macro, part) {
  paths.armSeam = new Path()
    .move(points.armEnd_ep)
    ._curve(
      //points.armSeam_p2_cp1,
      points.armSeam_p2_cp2,
      points.armSeam_p2_ep
    )
    .curve_(points.armSeam_p3_cp1, points.armpitNotch_ep)
}

export { draft_armSeam }
