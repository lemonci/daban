function draft_path254(Path, Point, paths, points, measurements, options, utils, macro, part) {
  // Path: path254
  // m 187.293 21.209
  points.path254_p1 = new Point(187.293, 21.209)
  // l -0.39649 305.119
  points.path254_p2 = new Point(186.6035, 326.1191)
  // c 23.6447 0.41308 36.5269 6.76345 49.8828 23.5938
  points.path254_p3_cp1 = new Point(210.6447, 326.4131)
  points.path254_p3_cp2 = new Point(223.5269, 332.7634)
  points.path254_p3_ep = new Point(236.8828, 349.5938)
  // c -2.76891 -16.4376 -11.0619 -55.5334 -17.4434 -78.5449
  points.path254_p4_cp1 = new Point(234.2311, 333.5624)
  points.path254_p4_cp2 = new Point(225.9381, 294.4666)
  points.path254_p4_ep = new Point(219.5566, 271.4551)
  // c 20.7026 27.5104 41.6562 50.8871 74.5879 63.9707
  points.path254_p5_cp1 = new Point(240.7026, 298.5104)
  points.path254_p5_cp2 = new Point(261.6562, 321.8871)
  points.path254_p5_ep = new Point(294.5879, 334.9707)
  // c 38.3553 -58.3976 64.4057 -111.882 64.2773 -201.434
  points.path254_p6_cp1 = new Point(333.3553, 276.6024)
  points.path254_p6_cp2 = new Point(359.4057, 223.1177)
  points.path254_p6_ep = new Point(359.2773, 133.5664)
  // c -12.837 -0.80124 -39.0776 -1.65681 -58.2266 1.55078
  points.path254_p7_cp1 = new Point(346.163, 133.1988)
  points.path254_p7_cp2 = new Point(319.9224, 132.3432)
  points.path254_p7_ep = new Point(300.7734, 135.5508)
  // c -20.256 3.39303 -44.3728 10.0496 -58.7656 18.5215
  points.path254_p8_cp1 = new Point(280.744, 139.393)
  points.path254_p8_cp2 = new Point(256.6272, 146.0496)
  points.path254_p8_ep = new Point(242.2344, 154.5215)
  // c 17.3817 -15.183 31.9472 -33.0754 44.6914 -52.0684
  points.path254_p9_cp1 = new Point(259.3817, 139.817)
  points.path254_p9_cp2 = new Point(273.9472, 121.9246)
  points.path254_p9_ep = new Point(286.6914, 102.9316)
  // C 295.86 87.0744 302.388 71.1712 310.316 54.1719
  points.path254_p10_cp1 = new Point(295.8604, 87.0744)
  points.path254_p10_cp2 = new Point(302.3879, 71.1712)
  points.path254_p10_ep = new Point(310.3164, 54.1719)
  // C 282.506 41.3202 238.267 19.8402 187.293 21.209
  points.path254_p11_cp1 = new Point(282.5062, 41.3202)
  points.path254_p11_cp2 = new Point(238.2675, 19.8402)
  points.path254_p11_ep = new Point(187.293, 21.209)
  // Z

  paths.path254 = new Path()
    // inkex.paths.move: m 187.293 21.209
    .move(points.path254_p1)
    // inkex.paths.line: l -0.39649 305.119
    .line(points.path254_p2)
    // inkex.paths.curve: c 23.6447 0.41308 36.5269 6.76345 49.8828 23.5938
    .curve(points.path254_p3_cp1, points.path254_p3_cp2, points.path254_p3_ep)
    // inkex.paths.curve: c -2.76891 -16.4376 -11.0619 -55.5334 -17.4434 -78.5449
    .curve(points.path254_p4_cp1, points.path254_p4_cp2, points.path254_p4_ep)
    // inkex.paths.curve: c 20.7026 27.5104 41.6562 50.8871 74.5879 63.9707
    .curve(points.path254_p5_cp1, points.path254_p5_cp2, points.path254_p5_ep)
    // inkex.paths.curve: c 38.3553 -58.3976 64.4057 -111.882 64.2773 -201.434
    .curve(points.path254_p6_cp1, points.path254_p6_cp2, points.path254_p6_ep)
    // inkex.paths.curve: c -12.837 -0.80124 -39.0776 -1.65681 -58.2266 1.55078
    .curve(points.path254_p7_cp1, points.path254_p7_cp2, points.path254_p7_ep)
    // inkex.paths.curve: c -20.256 3.39303 -44.3728 10.0496 -58.7656 18.5215
    .curve(points.path254_p8_cp1, points.path254_p8_cp2, points.path254_p8_ep)
    // inkex.paths.curve: c 17.3817 -15.183 31.9472 -33.0754 44.6914 -52.0684
    .curve(points.path254_p9_cp1, points.path254_p9_cp2, points.path254_p9_ep)
    // inkex.paths.Curve: C 295.86 87.0744 302.388 71.1712 310.316 54.1719
    .curve(points.path254_p10_cp1, points.path254_p10_cp2, points.path254_p10_ep)
    // inkex.paths.Curve: C 282.506 41.3202 238.267 19.8402 187.293 21.209
    .curve(points.path254_p11_cp1, points.path254_p11_cp2, points.path254_p11_ep)
    // inkex.paths.ZoneClose: Z
    .line(points.path254_p1)
}

export { draft_path254 }
