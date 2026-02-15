import { Design, mergeI18n } from '@freesewing/core'
import { i18n as devonI18n } from '../i18n/index.mjs'
import { i18n as brianI18n } from '@freesewing/brian'
import { i18n as nobleI18n } from '@freesewing/noble'
import { twoPartSleeveI18n } from '@freesewing/library'
import about from '../about.json' with { type: 'json' }

// Parts
import { base } from './base.mjs'
import { back } from './back.mjs'
import { backPanel } from './backpanel.mjs'
import { backSide } from './backside.mjs'
import { backYoke } from './backyoke.mjs'
import { cuff } from './cuff.mjs'
import { frontFacing } from './frontfacing.mjs'
import { frontInside } from './frontinside.mjs'
import { frontPanel } from './frontpanel.mjs'
import { frontSidePanel } from './frontsidepanel.mjs'
import { frontYoke } from './frontyoke.mjs'
import { pocket } from './pocket.mjs'
import { pocketflap } from './pocketflap.mjs'
import { sleeve } from './sleeve.mjs'
import { topSleeve } from './topsleeve.mjs'
import { underSleeve } from './undersleeve.mjs'
import { underCollar } from './undercollar.mjs'
import { upperCollar } from './uppercollar.mjs'
import { waistband } from './waistband.mjs'

// Create new design
const Devon = new Design({
  data: about,
  parts: [
    base,
    back,
    backPanel,
    backSide,
    backYoke,
    cuff,
    frontFacing,
    frontYoke,
    frontSidePanel,
    frontPanel,
    frontInside,
    pocket,
    pocketflap,
    sleeve,
    topSleeve,
    underSleeve,
    underCollar,
    upperCollar,
    waistband,
  ],
})

// Merge translations
const i18n = mergeI18n([twoPartSleeveI18n, brianI18n, nobleI18n, devonI18n], {
  o: {
    drop: [
      'armholeDartCurved',
      'armholeDartCurvePoint',
      'armholeDartCurveWidth',
      'armholeDartPosition',
      'backArmholeCurvature',
      'backArmholePitchDepth',
      'backArmholeSlant',
      'backDartHeight',
      'backHemSlope',
      'bustSpanEase',
      'dartPosition',
      'dartPosition.armhole',
      'dartPosition.shoulder',
      'frontArmholeCurvature',
      'frontArmholePitchDepth',
      'frontShoulderWidth',
      'fullChestEaseReduction',
      'highBustWidth',
      'shoulderDartCurvature',
      'shoulderDartPosition',
      'shoulderToShoulderEase',
      'sleevecapBackFactorX',
      'sleevecapBackFactorY',
      'sleevecapFrontFactorX',
      'sleevecapFrontFactorY',
      'sleevecapQ1Offset',
      'sleevecapQ1Spread1',
      'sleevecapQ1Spread2',
      'sleevecapQ2Offset',
      'sleevecapQ2Spread1',
      'sleevecapQ2Spread2',
      'sleevecapQ3Offset',
      'sleevecapQ3Spread1',
      'sleevecapQ3Spread2',
      'sleevecapQ4Offset',
      'sleevecapQ4Spread1',
      'sleevecapQ4Spread2',
      'sleevecapTopFactorX',
      'sleevecapTopFactorY',
      'sleeveWidthGuarantee',
      'upperDartLength',
      'waistDartLength',
      'waistdartposition',
      'waistDartPosition',
      'waistDartPosition',
      'waistEase',
    ],
  },
})

// Named exports
export {
  base,
  back,
  backPanel,
  backSide,
  backYoke,
  cuff,
  frontFacing,
  frontInside,
  frontPanel,
  frontSidePanel,
  frontYoke,
  pocket,
  pocketflap,
  sleeve,
  topSleeve,
  underSleeve,
  underCollar,
  upperCollar,
  waistband,
  i18n,
  about,
  Devon,
}
