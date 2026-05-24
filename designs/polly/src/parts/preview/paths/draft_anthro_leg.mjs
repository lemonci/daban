function draft_anthro_leg(Path, Point, paths, points, measurements, options, utils, macro, part) {
  paths.legOutline = new Path()
    .move(points.legOutline_p1)
    .curve(points.legOutline_p2_cp1, points.legOutline_p2_cp2, points.legOutline_p2_ep)
    .curve(points.legOutline_p3_cp1, points.legOutline_p3_cp2, points.legOutline_p3_ep)
    .curve(points.legOutline_p4_cp1, points.legOutline_p4_cp2, points.legOutline_p4_ep)
    .curve(points.legOutline_p5_cp1, points.legOutline_p5_cp2, points.legOutline_p5_ep)
    .curve(points.legOutline_p6_cp1, points.legOutline_p6_cp2, points.legOutline_p6_ep)
    .curve(points.legOutline_p7_cp1, points.legOutline_p7_cp2, points.legOutline_p7_ep)
    .curve(points.legOutline_p8_cp1, points.legOutline_p8_cp2, points.legOutline_p8_ep)
    .curve(points.legOutline_p9_cp1, points.legOutline_p9_cp2, points.legOutline_p9_ep)
    .curve(points.legOutline_p10_cp1, points.legOutline_p10_cp2, points.legOutline_p10_ep)
    .curve(points.legOutline_p11_cp1, points.legOutline_p11_cp2, points.legOutline_p11_ep)

  paths.footUpperSeam = new Path()
    .move(points.footUpperSeam_p1)
    .curve(points.footUpperSeam_p2_cp1, points.footUpperSeam_p2_cp2, points.footUpperSeam_p2_ep)
    .curve(points.footUpperSeam_p3_cp1, points.footUpperSeam_p3_cp2, points.footUpperSeam_p3_ep)

  paths.soleSeam = new Path()
    .move(points.soleSeam_p1)
    .curve(points.soleSeam_p2_cp1, points.soleSeam_p2_cp2, points.soleSeam_p2_ep)
    .curve(points.soleSeam_p3_cp1, points.soleSeam_p3_cp2, points.soleSeam_p3_ep)

  paths.toeDart = new Path()
    .move(points.toeDart_p1)
    .curve(points.toeDart_p2_cp1, points.toeDart_p2_cp2, points.toeDart_p2_ep)

  paths.thighDart = new Path()
    .move(points.thighDart_p1)
    .curve(points.thighDart_p2_cp1, points.thighDart_p2_cp2, points.thighDart_p2_ep)

  paths.frontSeam = new Path()
    .move(points.frontSeam_p1)
    .curve(points.frontSeam_p2_cp1, points.frontSeam_p2_cp2, points.frontSeam_p2_ep)
    .curve(points.frontSeam_p3_cp1, points.frontSeam_p3_cp2, points.frontSeam_p3_ep)
    .curve(points.frontSeam_p4_cp1, points.frontSeam_p4_cp2, points.frontSeam_p4_ep)

  paths.kneeContour = new Path()
    .move(points.kneeContour_p1)
    .curve(points.kneeContour_p2_cp1, points.kneeContour_p2_cp2, points.kneeContour_p2_ep)
}

export { draft_anthro_leg }
