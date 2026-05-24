function draft_path38(Path, Point, paths, points, measurements, options, utils, macro, part) {
  // Path: path38
  // m 305.19 380.466
  points.path38_p1 = new Point(305.1904, 380.4663)
  // c 1.47478 32.029 19.2374 62.7822 58.5475 62.7295
  points.path38_p2_cp1 = new Point(306.4748, 412.029)
  points.path38_p2_cp2 = new Point(324.2374, 442.7822)
  points.path38_p2_ep = new Point(363.5475, 442.7295)
  // c 39.3102 -0.0528 62.641 -31.2395 62.4308 -65.1192
  points.path38_p3_cp1 = new Point(403.3102, 442.9472)
  points.path38_p3_cp2 = new Point(426.641, 411.7605)
  points.path38_p3_ep = new Point(426.4308, 377.8808)
  // c -0.21021 -33.8796 -28.3693 -64.385 -63.0282 -63.9243
  points.path38_p4_cp1 = new Point(425.7898, 344.1204)
  points.path38_p4_cp2 = new Point(397.6307, 313.615)
  points.path38_p4_ep = new Point(362.9718, 314.0757)
  // c -34.6589 0.46072 -59.4249 34.285 -57.9501 66.314
  points.path38_p5_cp1 = new Point(328.3411, 314.4607)
  points.path38_p5_cp2 = new Point(303.5751, 348.2851)
  points.path38_p5_ep = new Point(305.0499, 380.314)
  // z

  paths.path38 = new Path()
    // inkex.paths.move: m 305.19 380.466
    .move(points.path38_p1)
    // inkex.paths.curve: c 1.47478 32.029 19.2374 62.7822 58.5475 62.7295
    .curve(points.path38_p2_cp1, points.path38_p2_cp2, points.path38_p2_ep)
    // inkex.paths.curve: c 39.3102 -0.0528 62.641 -31.2395 62.4308 -65.1192
    .curve(points.path38_p3_cp1, points.path38_p3_cp2, points.path38_p3_ep)
    // inkex.paths.curve: c -0.21021 -33.8796 -28.3693 -64.385 -63.0282 -63.9243
    .curve(points.path38_p4_cp1, points.path38_p4_cp2, points.path38_p4_ep)
    // inkex.paths.curve: c -34.6589 0.46072 -59.4249 34.285 -57.9501 66.314
    .curve(points.path38_p5_cp1, points.path38_p5_cp2, points.path38_p5_ep)
    // inkex.paths.zoneClose: z
    .line(points.path38_p1)
}

export { draft_path38 }
