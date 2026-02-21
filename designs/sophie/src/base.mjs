import { pctBasedOn } from '@freesewing/core'

export const base = {
  name: 'sophie.base',
  measurements: [
    'bustSpan',
    'hpsToBust',
    'hpsToWaistBack',
    'bustPointToUnderbust',
    'bustFront',
    'shoulderToShoulder',
    'shoulderSlope',
    'underbust',
    'waist',
    'hips',
    'seat',
    'waistToUnderbust',
    'waistToHips',
    'waistToSeat',
    'waistToKnee',
  ],
  optionalMeasurements: [],
  options: {
    strapWidth: { pct: 30, min: 10, max: 100, menu: 'style' },
    necklineCoverage: { pct: 20, min: 0, max: 90, menu: 'style' },
    backCoverage: { pct: 10, min: -50, max: 90, menu: 'style' },
    sideCornerDrop: { pct: 50, min: 0, max: 100, menu: 'style' },
    lengthBonus: { pct: 0, min: -50, max: 50, ...pctBasedOn('waistToKnee'), menu: 'style' },
    bottomWidthBonus: { pct: 20, min: 0, max: 100, ...pctBasedOn('seat'), menu: 'style' },

    //armhole fit
    armholeDrop: { pct: 80, min: 50, max: 90, menu: 'fit' },
    armholeWidthFront: { pct: 30, min: 20, max: 60, menu: 'fit' },
    armholeWidthBack: { pct: 30, min: 20, max: 90, menu: 'fit' },

    //body fit
    bustEase: { pct: 5, min: 0, max: 25, ...pctBasedOn('bustFront'), menu: 'fit' },
    underbustEase: { pct: 5, min: 0, max: 25, ...pctBasedOn('underbust'), menu: 'fit' },
    waistEase: { pct: 5, min: 0, max: 25, ...pctBasedOn('waist'), menu: 'fit' },
    hipsEase: { pct: 5, min: 0, max: 25, ...pctBasedOn('hips'), menu: 'fit' },
    seatEase: { pct: 5, min: 0, max: 25, ...pctBasedOn('seat'), menu: 'fit' },
  },

  draft: ({
    options,
    measurements,
    part,
    store,
    points,
    Point,
    Path,
    paths,
    macro,
    sa,
    paperless,
  }) => {
    /*
     * create constants
     */

    const hpsToUnderbust = measurements.hpsToBust + measurements.bustPointToUnderbust

    //body fit
    const bustFront = measurements.bustFront * (1 + options.bustEase)
    store.set('bustFront', bustFront)
    const underbust = measurements.underbust * (1 + options.underbustEase)
    store.set('underbust', underbust)
    const waist = measurements.waist * (1 + options.waistEase)
    store.set('waist', waist)
    const hips = measurements.hips * (1 + options.hipsEase)
    store.set('hips', hips)
    const seat = measurements.seat * (1 + options.seatEase)
    store.set('seat', seat)

    //style
    store.set('hpsToUnderbust', hpsToUnderbust)
    const strapWidth = (measurements.shoulderToShoulder / 4) * options.strapWidth
    store.set('strapWidth', strapWidth)
    const necklineCoverage =
      (measurements.hpsToBust + measurements.bustPointToUnderbust) * options.necklineCoverage
    store.set('necklineCoverage', necklineCoverage)
    const backCoverage =
      (measurements.hpsToWaistBack - measurements.waistToUnderbust) * options.backCoverage
    store.set('backCoverage', backCoverage)
    const skirtLength = measurements.waistToKnee * (1 + options.lengthBonus)
    store.set('skirtLength', skirtLength)
    const bottomWidth = measurements.seat * (1 + options.bottomWidthBonus)
    store.set('bottomWidth', bottomWidth)
    const cornerWidth =
      (underbust / 4) * (1 - options.sideCornerDrop) + (waist / 4) * options.sideCornerDrop
    store.set('cornerWidth', cornerWidth)
    const totalLength = measurements.waistToUnderbust + store.get('skirtLength')

    //armhole fit
    const armholeDrop = hpsToUnderbust * options.armholeDrop
    store.set('armholeDrop', armholeDrop)

    const armholeWidthFront =
      (measurements.bustFront - measurements.bustSpan / 2) * options.armholeWidthFront
    store.set('armholeWidthFront', armholeWidthFront)
    const armholeWidthBack = (underbust / 4) * options.armholeWidthBack
    store.set('armholeWidthBack', armholeWidthBack)

    //create shared bottom part path
    points.foldCenterpoint = new Point(0, totalLength / 2)
    points.bottomCenterpoint = new Point(0, totalLength)
    points.bottomSide = new Point(bottomWidth / 4, totalLength)
    points.seatSide = new Point(seat / 4, measurements.waistToUnderbust + measurements.waistToSeat)
    points.seatToHipsTweak = new Point(
      seat / 4,
      measurements.waistToUnderbust + (measurements.waistToSeat + measurements.waistToHips) / 2
    )
    points.hipsSide = new Point(hips / 4, measurements.waistToUnderbust + measurements.waistToHips)
    points.hipsToWaistTweak = new Point(
      waist / 4,
      measurements.waistToUnderbust + measurements.waistToHips / 2
    )
    points.waistSide = new Point(waist / 4, measurements.waistToUnderbust)

    points.topSide = new Point(
      (underbust / 4) * (1 - options.sideCornerDrop) + (waist / 4) * options.sideCornerDrop,
      measurements.waistToUnderbust * options.sideCornerDrop
    )

    paths.shared = new Path()
      .move(points.bottomCenterpoint)
      .line(points.bottomSide)
      .line(points.seatSide)
      .curve_(points.seatToHipsTweak, points.hipsSide)
      .curve_(points.hipsToWaistTweak, points.waistSide)
      .line(points.topSide)

    if (paperless) {
      macro('vd', {
        from: points.topSide,
        to: points.waistSide,
        x: points.bottomSide.x + sa + 10,
        id: 'vd2',
      })

      macro('vd', {
        from: points.waistSide,
        to: points.hipsSide,
        x: points.bottomSide.x + sa + 10,
        id: 'vd3',
      })

      macro('vd', {
        from: points.hipsSide,
        to: points.seatSide,
        x: points.bottomSide.x + sa + 10,
        id: 'vd4',
      })
      macro('vd', {
        from: points.seatSide,
        to: points.bottomSide,
        x: points.bottomSide.x + sa + 10,
        id: 'vd5',
      })

      //horizontal distances
      macro('hd', {
        from: points.bottomCenterpoint,
        to: points.bottomSide,
        y: points.bottomSide.y + sa + 10,
        id: 'hd0',
      })

      macro('hd', {
        from: points.seatSide,
        to: points.bottomSide,
        y: points.seatSide.y,
        id: 'hd1',
      })

      macro('hd', {
        from: points.hipsSide,
        to: points.bottomSide,
        y: points.hipsSide.y,
        id: 'hd2',
      })
      macro('hd', {
        from: points.waistSide,
        to: points.bottomSide,
        y: points.waistSide.y,
        id: 'hd3',
      })
      macro('hd', {
        from: points.topSide,
        to: points.bottomSide,
        y: points.topSide.y,
        id: 'hd4',
      })
    }
    part.hide()

    return part
  },
}
