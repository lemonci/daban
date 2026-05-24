function draft_path190(Path, Point, paths, points, measurements, options, utils, macro, part) {
  // Path: path190
  // M 163.803 0.845703
  points.path190_p1 = new Point(163.8027, 0.8457)
  // C 158.263 3.02254 154.842 4.22089 150.172 5.18359
  points.path190_p2_cp1 = new Point(158.2633, 3.0225)
  points.path190_p2_cp2 = new Point(154.8418, 4.2209)
  points.path190_p2_ep = new Point(150.1719, 5.1836)
  // C 145.289 6.19022 139.269 6.67263 135.287 6.6543
  points.path190_p3_cp1 = new Point(145.2889, 6.1902)
  points.path190_p3_cp2 = new Point(139.269, 6.6726)
  points.path190_p3_ep = new Point(135.2871, 6.6543)
  // l 1.3125 402.607
  points.path190_p4 = new Point(136.3125, 409.6074)
  // c 8.53215 -0.22404 17.7678 -0.49973 23.4434 -0.66211
  points.path190_p5_cp1 = new Point(144.5322, 409.776)
  points.path190_p5_cp2 = new Point(153.7678, 409.5003)
  points.path190_p5_ep = new Point(159.4434, 409.3379)
  // c -7.23857 -23.8798 -5.28216 -60.9714 -3.98242 -91.459
  points.path190_p6_cp1 = new Point(151.7614, 385.1202)
  points.path190_p6_cp2 = new Point(153.7178, 348.0286)
  points.path190_p6_ep = new Point(155.0176, 317.541)
  // c 0.65759 -15.4246 -0.44896 -40.479 5.94531 -45.9336
  points.path190_p7_cp1 = new Point(155.6576, 302.5754)
  points.path190_p7_cp2 = new Point(154.551, 277.521)
  points.path190_p7_ep = new Point(160.9453, 272.0664)
  // c 6.39428 -5.45458 55.0486 -13.9971 81.5859 -7.54297
  points.path190_p8_cp1 = new Point(167.3943, 266.5454)
  points.path190_p8_cp2 = new Point(216.0486, 258.0029)
  points.path190_p8_ep = new Point(242.5859, 264.457)
  // c 10.8441 2.6374 13.1967 7.75259 28.1992 18.0488
  points.path190_p9_cp1 = new Point(253.8441, 266.6374)
  points.path190_p9_cp2 = new Point(256.1967, 271.7526)
  points.path190_p9_ep = new Point(271.1992, 282.0488)
  // c -1.73255 -19.0809 -4.64158 -34.1428 -7.94727 -51.041
  points.path190_p10_cp1 = new Point(269.2674, 262.9191)
  points.path190_p10_cp2 = new Point(266.3584, 247.8572)
  points.path190_p10_ep = new Point(263.0527, 230.959)
  // c -3.99901 -20.4424 -12.0719 -40.113 -14.3633 -60.8164
  points.path190_p11_cp1 = new Point(259.001, 210.5576)
  points.path190_p11_cp2 = new Point(250.9281, 190.887)
  points.path190_p11_ep = new Point(248.6367, 170.1836)
  // c -2.27075 -20.5168 -1.5954 -43.3911 0.71094 -61.9219
  points.path190_p12_cp1 = new Point(246.7293, 149.4832)
  points.path190_p12_cp2 = new Point(247.4046, 126.6089)
  points.path190_p12_ep = new Point(249.7109, 108.0781)
  // c -7.60541 -1.13495 -23.0225 -1.7184 -30.0996 -9.5039
  points.path190_p13_cp1 = new Point(242.3946, 106.865)
  points.path190_p13_cp2 = new Point(226.9775, 106.2816)
  points.path190_p13_ep = new Point(219.9004, 98.4961)
  // c -7.02217 -7.72509 -6.28038 -21.7507 -6.54688 -30.627
  points.path190_p14_cp1 = new Point(212.9778, 90.2749)
  points.path190_p14_cp2 = new Point(213.7196, 76.2493)
  points.path190_p14_ep = new Point(213.4531, 67.373)
  // C 207.611 60.9423 195.776 48.349 190.311 39.0762
  points.path190_p15_cp1 = new Point(207.6108, 60.9423)
  points.path190_p15_cp2 = new Point(195.7763, 48.349)
  points.path190_p15_ep = new Point(190.3106, 39.0762)
  // C 186.215 33.6155 166.977 4.43956 163.803 0.845703
  points.path190_p16_cp1 = new Point(186.215, 33.6155)
  points.path190_p16_cp2 = new Point(166.9773, 4.4396)
  points.path190_p16_ep = new Point(163.8027, 0.8457)
  // Z

  paths.path190 = new Path()
    // inkex.paths.Move: M 163.803 0.845703
    .move(points.path190_p1)
    // inkex.paths.Curve: C 158.263 3.02254 154.842 4.22089 150.172 5.18359
    .curve(points.path190_p2_cp1, points.path190_p2_cp2, points.path190_p2_ep)
    // inkex.paths.Curve: C 145.289 6.19022 139.269 6.67263 135.287 6.6543
    .curve(points.path190_p3_cp1, points.path190_p3_cp2, points.path190_p3_ep)
    // inkex.paths.line: l 1.3125 402.607
    .line(points.path190_p4)
    // inkex.paths.curve: c 8.53215 -0.22404 17.7678 -0.49973 23.4434 -0.66211
    .curve(points.path190_p5_cp1, points.path190_p5_cp2, points.path190_p5_ep)
    // inkex.paths.curve: c -7.23857 -23.8798 -5.28216 -60.9714 -3.98242 -91.459
    .curve(points.path190_p6_cp1, points.path190_p6_cp2, points.path190_p6_ep)
    // inkex.paths.curve: c 0.65759 -15.4246 -0.44896 -40.479 5.94531 -45.9336
    .curve(points.path190_p7_cp1, points.path190_p7_cp2, points.path190_p7_ep)
    // inkex.paths.curve: c 6.39428 -5.45458 55.0486 -13.9971 81.5859 -7.54297
    .curve(points.path190_p8_cp1, points.path190_p8_cp2, points.path190_p8_ep)
    // inkex.paths.curve: c 10.8441 2.6374 13.1967 7.75259 28.1992 18.0488
    .curve(points.path190_p9_cp1, points.path190_p9_cp2, points.path190_p9_ep)
    // inkex.paths.curve: c -1.73255 -19.0809 -4.64158 -34.1428 -7.94727 -51.041
    .curve(points.path190_p10_cp1, points.path190_p10_cp2, points.path190_p10_ep)
    // inkex.paths.curve: c -3.99901 -20.4424 -12.0719 -40.113 -14.3633 -60.8164
    .curve(points.path190_p11_cp1, points.path190_p11_cp2, points.path190_p11_ep)
    // inkex.paths.curve: c -2.27075 -20.5168 -1.5954 -43.3911 0.71094 -61.9219
    .curve(points.path190_p12_cp1, points.path190_p12_cp2, points.path190_p12_ep)
    // inkex.paths.curve: c -7.60541 -1.13495 -23.0225 -1.7184 -30.0996 -9.5039
    .curve(points.path190_p13_cp1, points.path190_p13_cp2, points.path190_p13_ep)
    // inkex.paths.curve: c -7.02217 -7.72509 -6.28038 -21.7507 -6.54688 -30.627
    .curve(points.path190_p14_cp1, points.path190_p14_cp2, points.path190_p14_ep)
    // inkex.paths.Curve: C 207.611 60.9423 195.776 48.349 190.311 39.0762
    .curve(points.path190_p15_cp1, points.path190_p15_cp2, points.path190_p15_ep)
    // inkex.paths.Curve: C 186.215 33.6155 166.977 4.43956 163.803 0.845703
    .curve(points.path190_p16_cp1, points.path190_p16_cp2, points.path190_p16_ep)
    // inkex.paths.ZoneClose: Z
    .line(points.path190_p1)
}

export { draft_path190 }
