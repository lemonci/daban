import { Design, mergeI18n } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { front, back, i18n as brianI18n } from '@freesewing/brian'
import { undersleeve, topsleeve, twoPartSleeveI18n } from '@freesewing/library'
import { i18n as bentI18n } from '../i18n/index.mjs'

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
