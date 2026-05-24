function draft_path128(Path, Point, paths, points, measurements, options, utils, macro, part) {
  // Path: path128
  // m 337.139 747.8
  points.path128_p1 = new Point(337.1393, 747.8003)
  // c 44.0098 1.96676 112.022 9.14853 168.126 8.29219
  points.path128_p2_cp1 = new Point(381.0098, 749.9668)
  points.path128_p2_cp2 = new Point(449.0224, 757.1485)
  points.path128_p2_ep = new Point(505.1261, 756.2922)
  // c 54.6489 -0.83413 140.478 -9.15975 163.444 -13.0716
  points.path128_p3_cp1 = new Point(559.6489, 755.1659)
  points.path128_p3_cp2 = new Point(645.4783, 746.8402)
  points.path128_p3_ep = new Point(668.444, 742.9284)
  // c -9.01574 -88.3579 -18.3812 -179.55 -23.5982 -268.243
  points.path128_p4_cp1 = new Point(658.9843, 654.6421)
  points.path128_p4_cp2 = new Point(649.6188, 563.4497)
  points.path128_p4_ep = new Point(644.4018, 474.7568)
  // c -10.5848 -0.68171 -28.4322 -1.25095 -42.2498 -4.3326
  points.path128_p5_cp1 = new Point(633.4152, 474.3183)
  points.path128_p5_cp2 = new Point(615.5678, 473.7491)
  points.path128_p5_ep = new Point(601.7502, 470.6674)
  // c -18.3852 -4.10031 -36.7639 -9.71674 -53.3379 -18.6682
  points.path128_p6_cp1 = new Point(583.6148, 466.8997)
  points.path128_p6_cp2 = new Point(565.2361, 461.2833)
  points.path128_p6_ep = new Point(548.6621, 452.3318)
  // c -11.1423 -6.01785 -18.3305 -18.5785 -30.1577 -23.1042
  points.path128_p7_cp1 = new Point(537.8577, 445.9821)
  points.path128_p7_cp2 = new Point(530.6695, 433.4215)
  points.path128_p7_ep = new Point(518.8423, 428.8958)
  // c -24.9076 -9.53092 -55.0848 -16.2667 -79.7682 -6.16957
  points.path128_p8_cp1 = new Point(494.0924, 419.4691)
  points.path128_p8_cp2 = new Point(463.9152, 412.7333)
  points.path128_p8_ep = new Point(439.2318, 422.8304)
  // c -19.0729 7.80208 -22.6054 36.6016 -40.6248 46.599
  points.path128_p9_cp1 = new Point(419.9271, 430.8021)
  points.path128_p9_cp2 = new Point(416.3946, 459.6016)
  points.path128_p9_ep = new Point(398.3752, 469.599)
  // c -21.9578 12.1825 -52.0848 10.2192 -74.3792 11.9485
  points.path128_p10_cp1 = new Point(376.0422, 482.1825)
  points.path128_p10_cp2 = new Point(345.9152, 480.2192)
  points.path128_p10_ep = new Point(323.6208, 481.9485)
  // c 5.23663 82.4291 8.62003 171.002 12.5459 266.75
  points.path128_p11_cp1 = new Point(329.2366, 564.4291)
  points.path128_p11_cp2 = new Point(332.62, 653.0022)
  points.path128_p11_ep = new Point(336.5459, 748.7496)
  // z

  paths.path128 = new Path()
    // inkex.paths.move: m 337.139 747.8
    .move(points.path128_p1)
    // inkex.paths.curve: c 44.0098 1.96676 112.022 9.14853 168.126 8.29219
    .curve(points.path128_p2_cp1, points.path128_p2_cp2, points.path128_p2_ep)
    // inkex.paths.curve: c 54.6489 -0.83413 140.478 -9.15975 163.444 -13.0716
    .curve(points.path128_p3_cp1, points.path128_p3_cp2, points.path128_p3_ep)
    // inkex.paths.curve: c -9.01574 -88.3579 -18.3812 -179.55 -23.5982 -268.243
    .curve(points.path128_p4_cp1, points.path128_p4_cp2, points.path128_p4_ep)
    // inkex.paths.curve: c -10.5848 -0.68171 -28.4322 -1.25095 -42.2498 -4.3326
    .curve(points.path128_p5_cp1, points.path128_p5_cp2, points.path128_p5_ep)
    // inkex.paths.curve: c -18.3852 -4.10031 -36.7639 -9.71674 -53.3379 -18.6682
    .curve(points.path128_p6_cp1, points.path128_p6_cp2, points.path128_p6_ep)
    // inkex.paths.curve: c -11.1423 -6.01785 -18.3305 -18.5785 -30.1577 -23.1042
    .curve(points.path128_p7_cp1, points.path128_p7_cp2, points.path128_p7_ep)
    // inkex.paths.curve: c -24.9076 -9.53092 -55.0848 -16.2667 -79.7682 -6.16957
    .curve(points.path128_p8_cp1, points.path128_p8_cp2, points.path128_p8_ep)
    // inkex.paths.curve: c -19.0729 7.80208 -22.6054 36.6016 -40.6248 46.599
    .curve(points.path128_p9_cp1, points.path128_p9_cp2, points.path128_p9_ep)
    // inkex.paths.curve: c -21.9578 12.1825 -52.0848 10.2192 -74.3792 11.9485
    .curve(points.path128_p10_cp1, points.path128_p10_cp2, points.path128_p10_ep)
    // inkex.paths.curve: c 5.23663 82.4291 8.62003 171.002 12.5459 266.75
    .curve(points.path128_p11_cp1, points.path128_p11_cp2, points.path128_p11_ep)
    // inkex.paths.zoneClose: z
    .line(points.path128_p1)
}

export { draft_path128 }
