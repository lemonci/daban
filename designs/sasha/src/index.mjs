import { Design, mergeI18n } from '@freesewing/core'
import { i18n as nobleI18n } from '@freesewing/noble'
import { i18n as sashaI18n } from '../i18n/index.mjs'
import { frontInside } from './frontinside.mjs'
import { frontOutside } from './frontoutside.mjs'
import { frontOutsideAbove } from './frontoutsideabove.mjs'
import { frontOutsideBelow } from './frontoutsidebelow.mjs'
import { backInside } from './backinside.mjs'
import { backOutside } from './backoutside.mjs'
import { pocket } from './pocket.mjs'
import { frontArmholeCalculation } from './frontarmholecalculation.mjs'
import { backArmholeCalculation } from './backarmholecalculation.mjs'
import { sleeve, sleeveI18n } from '@freesewing/library'
import about from '../about.json' with { type: 'json' }

// Setup our new design
const Sasha = new Design({
  data: about,
  // parts: [frontInside, frontOutside, backInside, backOutside],
  parts: [
    frontInside,
    frontOutside,
    frontArmholeCalculation,
    pocket,
    frontOutsideAbove,
    frontOutsideBelow,
    backInside,
    backOutside,
    backArmholeCalculation,
    sleeve,
  ],
})

// Merge translations
const i18n = mergeI18n([nobleI18n, sashaI18n, sleeveI18n], {
  o: {
    drop: ['dartPosition.armhole', 'dartPosition.shoulder'],
  },
})

// Named exports
export {
  frontInside,
  frontOutside,
  frontArmholeCalculation,
  pocket,
  frontOutsideAbove,
  frontOutsideBelow,
  backInside,
  backOutside,
  backArmholeCalculation,
  sleeve,
  i18n,
  Sasha,
  about,
}
