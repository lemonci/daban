function draft_arm(Path, Point, paths, points, measurements, options, utils, macro, part) {
  paths.arm = new Path()
    .move(points.arm_p1)
    .curve(points.arm_p2_cp1, points.arm_p2_cp2, points.arm_p2_ep)
    .curve(points.arm_p3_cp1, points.arm_p3_cp2, points.arm_p3_ep)
    .curve(points.armEnd_cp1, points.armEnd_cp2, points.armEnd_ep)
    .curve(points.arm_p5_cp1, points.arm_p5_cp2, points.arm_p5_ep)
    .curve(points.arm_p6_cp1, points.arm_p6_cp2, points.arm_p6_ep)
}

export { draft_arm }
