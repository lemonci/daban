import { pctBasedOn, snappedPctOption } from '@freesewing/core'
import { back, front, sleeveMenuEnabled } from '@freesewing/toni'
import { steps } from '@freesewing/snapseries'
import { hoodSide as libraryHood } from '@freesewing/library'
import * as shared from '@freesewing/toni'

export const hood = {
  name: 'hannah.hood',
  after: [front, back],
  from: libraryHood,
  hide: {
    from: true,
  },
  options: {
    wristEase: {
      pct: 15,
      min: -15,
      max: 200,
      ...pctBasedOn('wrist'),
      menu: sleeveMenuEnabled('fit'),
      order: 200,
    },
    neckOpeningSize: {
      pct: 100,
      min: 85,
      max: 150,
      toAbs: (val, settings, mergedOptions) => {
        return settings.measurements[mergedOptions.neckBasedOn] * val
      },
      fromAbs: (val, settings, mergedOptions) =>
        Math.round((10000 * val) / settings.measurements[mergedOptions.neckBasedOn]) / 10000,
      menu: 'style',
    },
    sleeveLength: {
      pct: 100,
      min: 10,
      max: 120,
      ...pctBasedOn('shoulderToWrist'),
      menu: sleeveMenuEnabled(),
    },
    lengthBelowWaist: {
      pct: 90,
      min: -15,
      max: 100,
      ...pctBasedOn('waistToSeat'),
      menu: 'style',
    },
    chestEase: { pct: 10, min: 0, max: 25, ...pctBasedOn('chest'), menu: 'fit' },
    waistEase: { pct: 20, min: 0, max: 40, ...pctBasedOn('waist'), menu: 'fit' },
    seatEase: { pct: 12, min: 0, max: 40, ...pctBasedOn('seat'), menu: 'fit' },
    bicepsEase: { pct: 18, min: 0, max: 35, ...pctBasedOn('biceps'), menu: 'fit' },
    ribbingHeight: snappedPctOption('hpsToWaistBack', {
      pct: 15,
      min: 0,
      max: 20,
      menu: 'style',
      snap: steps,
    }),
    hasCollar: true,
  },
  draft: ({ part, points, Path }) => {
    const neckSeam = new Path()
      .move(points.neckEdge)
      .curve(points.neckEdgeCp2, points.frontEdgeCp1, points.frontEdge)

    shared.addText(part, neckSeam, points.cfNotch, 'Front Center')
    shared.addText(part, neckSeam, points.shoulderNotch, 'Shoulder Seam')
    return part
  },
}
