import { Design, mergeI18n, pctBasedOn } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { front as brianFront, back as brianBack, i18n as brianI18n } from '@freesewing/brian'
import { undersleeve, topsleeve, twoPartSleeveI18n } from '@freesewing/library'
import { i18n as bentI18n } from '../i18n/index.mjs'

// Options that are different in Bent from Brian
const optionsOverride = {
  // Fit
  chestEase: { pct: 8, min: -4, max: 20, ...pctBasedOn('chest'), menu: 'fit' },
  collarEase: { pct: 3.5, min: 0, max: 10, ...pctBasedOn('neck'), menu: 'fit' },
  bicepsEase: { pct: 20, min: 10, max: 40, ...pctBasedOn('biceps'), menu: 'fit' },
  cuffEase: { pct: 40, min: 2, max: 100, ...pctBasedOn('wrist'), menu: 'fit' },
  // Advanced
  acrossBackFactor: { pct: 97, min: 93, max: 100, menu: 'advanced' },
  frontArmholeDeeper: { pct: 0.5, min: 0, max: 1.5, menu: 'advanced' },
  // v3 armhole depth
  armholeDepth: {
    pct: 5,
    min: -10,
    max: 50,
    menu: (_settings, mergedOptions) => (mergedOptions?.legacyArmholeDepth ? false : 'advanced'),
  },
  armholeDepthFactor: {
    pct: 60,
    min: 50,
    max: 70,
    menu: (_settings, mergedOptions) => (mergedOptions?.legacyArmholeDepth ? 'advanced' : false),
  },
}

// We need to redefine both Brian parts with different options.
// This is because both Brian parts define the same options, and otherwise
// we can run into issues with options priority
const back = {
  ...brianBack,
  options: {
    ...brianBack.options,
    ...optionsOverride,
  },
}
const front = {
  ...brianFront,
  options: {
    ...brianFront.options,
    ...optionsOverride,
  },
}

// Create new design
const Bent = new Design({
  data: about,
  parts: [front, back, topsleeve, undersleeve],
})

// Merge translations
const i18n = mergeI18n([twoPartSleeveI18n, brianI18n, bentI18n], {
  o: {
    drop: [
      'sleevecapTopFactorX',
      'sleevecapTopFactorY',
      'sleevecapBackFactorX',
      'sleevecapBackFactorY',
      'sleevecapFrontFactorX',
      'sleevecapFrontFactorY',
      'sleevecapQ1Offset',
      'sleevecapQ2Offset',
      'sleevecapQ3Offset',
      'sleevecapQ4Offset',
      'sleevecapQ1Spread1',
      'sleevecapQ1Spread2',
      'sleevecapQ2Spread1',
      'sleevecapQ2Spread2',
      'sleevecapQ3Spread1',
      'sleevecapQ3Spread2',
      'sleevecapQ4Spread1',
      'sleevecapQ4Spread2',
      'sleeveWidthGuarantee',
    ],
  },
})

export { front, back, topsleeve, undersleeve, Bent, i18n, about }
