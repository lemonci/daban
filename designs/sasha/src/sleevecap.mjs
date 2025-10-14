import { backArmholeCalculation } from './backArmholeCalculation.mjs'
import { sleevecap as brianSleevecapForSasha } from '@freesewing/brian'

export const sleevecap = {
  name: 'sasha.sleevecap',
  after: backArmholeCalculation,
  hide: 'HIDE_TREE',
  measurements: [
    // TODO: import these somehow
    'biceps',
    'chest',
    'hpsToBust',
    'hpsToWaistBack',
    'neck',
    'shoulderToShoulder',
    'shoulderSlope',
    'waistToArmpit',
    'waistToHips',
  ],
  draft: (sh) => {
    const { paths, part } = sh
    //draft
    brianSleevecapForSasha.draft(sh)

    return part
  },
  options: {
    // TODO: import these somehow
    // from brian.sleevecap
    sleevecapEase: { pct: 0, min: 0, max: 10, menu: 'advanced' },
    sleevecapTopFactorX: { pct: 50, min: 25, max: 75, menu: 'advanced' },
    sleevecapTopFactorY: { pct: 45, min: 35, max: 125, menu: 'advanced' },
    sleevecapBackFactorX: { pct: 60, min: 35, max: 65, menu: 'advanced' },
    sleevecapBackFactorY: { pct: 33, min: 30, max: 65, menu: 'advanced' },
    sleevecapFrontFactorX: { pct: 55, min: 35, max: 65, menu: 'advanced' },
    sleevecapFrontFactorY: { pct: 33, min: 30, max: 65, menu: 'advanced' },
    sleevecapQ1Offset: { pct: 1.7, min: 0, max: 7, menu: 'advanced' },
    sleevecapQ2Offset: { pct: 3.5, min: 0, max: 7, menu: 'advanced' },
    sleevecapQ3Offset: { pct: 2.5, min: 0, max: 7, menu: 'advanced' },
    sleevecapQ4Offset: { pct: 1, min: 0, max: 7, menu: 'advanced' },
    sleevecapQ1Spread1: { pct: 10, min: 4, max: 20, menu: 'advanced' },
    sleevecapQ1Spread2: { pct: 15, min: 4, max: 20, menu: 'advanced' },
    sleevecapQ2Spread1: { pct: 15, min: 4, max: 20, menu: 'advanced' },
    sleevecapQ2Spread2: { pct: 10, min: 4, max: 20, menu: 'advanced' },
    sleevecapQ3Spread1: { pct: 10, min: 4, max: 20, menu: 'advanced' },
    sleevecapQ3Spread2: { pct: 8, min: 4, max: 20, menu: 'advanced' },
    sleevecapQ4Spread1: { pct: 7, min: 4, max: 20, menu: 'advanced' },
    sleevecapQ4Spread2: { pct: 6.3, min: 4, max: 20, menu: 'advanced' },
    sleeveWidthGuarantee: { pct: 90, min: 25, max: 100, menu: 'advanced' },
    // from brian.base
    armholeDepthFactor: {
      pct: 55,
      min: 50,
      max: 70,
      menu: (settings, mergedOptions) => (mergedOptions?.legacyArmholeDepth ? 'advanced' : false),
    },
  },
}
