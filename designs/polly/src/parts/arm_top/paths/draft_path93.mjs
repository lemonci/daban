function draft_path93(Path, Point, paths, points, measurements, options, utils, macro, part) {
  // Path: path93
  // m 245.113 366.637
  points.path93_p1 = new Point(245.1125, 366.6374)
  // c 15.6403 -0.30672 25.6438 -7.94185 32.5596 -12.3965
  points.path93_p2_cp1 = new Point(260.6403, 366.6933)
  points.path93_p2_cp2 = new Point(270.6438, 359.0582)
  points.path93_p2_ep = new Point(277.5596, 354.6035)
  // c 1.95509 6.88125 11.7478 29.9962 15.8573 45.5341
  points.path93_p3_cp1 = new Point(279.9551, 361.8813)
  points.path93_p3_cp2 = new Point(289.7478, 384.9962)
  points.path93_p3_ep = new Point(293.8573, 400.534)
  // c 8.50418 32.1536 24.4766 127.491 23.2739 163.116
  points.path93_p4_cp1 = new Point(302.5042, 433.1536)
  points.path93_p4_cp2 = new Point(318.4766, 528.4905)
  points.path93_p4_ep = new Point(317.274, 564.1161)
  // c -1.07974 31.9838 2.96202 68.7895 -15.8317 94.6916
  points.path93_p5_cp1 = new Point(315.9203, 595.9838)
  points.path93_p5_cp2 = new Point(319.962, 632.7895)
  points.path93_p5_ep = new Point(301.1683, 658.6916)
  // c -11.9112 16.4164 -33.6597 27.8801 -53.9402 28.1572
  points.path93_p6_cp1 = new Point(289.0888, 675.4164)
  points.path93_p6_cp2 = new Point(267.3403, 686.88)
  points.path93_p6_ep = new Point(247.0598, 687.1572)
  // c -22.0905 0.30185 -46.0952 -11.5461 -59.5703 -29.0533
  points.path93_p7_cp1 = new Point(224.9095, 687.3018)
  points.path93_p7_cp2 = new Point(200.9048, 675.4539)
  points.path93_p7_ep = new Point(187.4297, 657.9467)
  // c -19.3972 -25.2014 -17.375 -61.816 -18.481 -93.5987
  points.path93_p8_cp1 = new Point(167.6028, 632.7986)
  points.path93_p8_cp2 = new Point(169.625, 596.184)
  points.path93_p8_ep = new Point(168.519, 564.4013)
  // c -0.75712 -21.758 18.4985 -148.27 23.4119 -164.542
  points.path93_p9_cp1 = new Point(168.2429, 542.242)
  points.path93_p9_cp2 = new Point(187.4985, 415.7304)
  points.path93_p9_ep = new Point(192.4119, 399.4581)
  // c 4.59966 -15.2331 15.1707 -36.3212 19.8622 -43.4089
  points.path93_p10_cp1 = new Point(196.5997, 383.7669)
  points.path93_p10_cp2 = new Point(207.1707, 362.6788)
  points.path93_p10_ep = new Point(211.8622, 355.5911)
  // c 7.8373 4.71393 17.218 11.8071 32.8583 11.5004
  points.path93_p11_cp1 = new Point(219.8373, 360.7139)
  points.path93_p11_cp2 = new Point(229.218, 367.8071)
  points.path93_p11_ep = new Point(244.8583, 367.5004)
  // z

  paths.path93 = new Path()
    // inkex.paths.move: m 245.113 366.637
    .move(points.path93_p1)
    // inkex.paths.curve: c 15.6403 -0.30672 25.6438 -7.94185 32.5596 -12.3965
    .curve(points.path93_p2_cp1, points.path93_p2_cp2, points.path93_p2_ep)
    // inkex.paths.curve: c 1.95509 6.88125 11.7478 29.9962 15.8573 45.5341
    .curve(points.path93_p3_cp1, points.path93_p3_cp2, points.path93_p3_ep)
    // inkex.paths.curve: c 8.50418 32.1536 24.4766 127.491 23.2739 163.116
    .curve(points.path93_p4_cp1, points.path93_p4_cp2, points.path93_p4_ep)
    // inkex.paths.curve: c -1.07974 31.9838 2.96202 68.7895 -15.8317 94.6916
    .curve(points.path93_p5_cp1, points.path93_p5_cp2, points.path93_p5_ep)
    // inkex.paths.curve: c -11.9112 16.4164 -33.6597 27.8801 -53.9402 28.1572
    .curve(points.path93_p6_cp1, points.path93_p6_cp2, points.path93_p6_ep)
    // inkex.paths.curve: c -22.0905 0.30185 -46.0952 -11.5461 -59.5703 -29.0533
    .curve(points.path93_p7_cp1, points.path93_p7_cp2, points.path93_p7_ep)
    // inkex.paths.curve: c -19.3972 -25.2014 -17.375 -61.816 -18.481 -93.5987
    .curve(points.path93_p8_cp1, points.path93_p8_cp2, points.path93_p8_ep)
    // inkex.paths.curve: c -0.75712 -21.758 18.4985 -148.27 23.4119 -164.542
    .curve(points.path93_p9_cp1, points.path93_p9_cp2, points.path93_p9_ep)
    // inkex.paths.curve: c 4.59966 -15.2331 15.1707 -36.3212 19.8622 -43.4089
    .curve(points.path93_p10_cp1, points.path93_p10_cp2, points.path93_p10_ep)
    // inkex.paths.curve: c 7.8373 4.71393 17.218 11.8071 32.8583 11.5004
    .curve(points.path93_p11_cp1, points.path93_p11_cp2, points.path93_p11_ep)
    // inkex.paths.zoneClose: z
    .line(points.path93_p1)
}

export { draft_path93 }
