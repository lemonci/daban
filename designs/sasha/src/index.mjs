import { Design } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { i18n } from '../i18n/index.mjs'
// Parts
import { frontInside } from './frontinside.mjs'
import { frontOutside } from './frontoutside.mjs'
import { frontOutsideAbove } from './frontoutsideabove.mjs'
import { frontOutsideBelow } from './frontoutsidebelow.mjs'
import { backInside } from './backinside.mjs'
import { backOutside } from './backoutside.mjs'
import { pocket } from './pocket.mjs'
import { frontArmholeCalculation } from './frontArmholeCalculation.mjs'
import { backArmholeCalculation } from './backArmholeCalculation.mjs'
// import { sleeve } from '@freesewing/brian'
import { sleeve } from './sleeve.mjs'
import { sleevecap } from './sleevecap.mjs'
// import { box } from './box.mjs'

// Setup our new design
const Sasha = new Design({
  data: about,
  // parts: [frontInside, frontOutside, backInside, backOutside],
  parts: [
    frontInside,
    frontOutside,
    pocket,
    frontOutsideAbove,
    frontOutsideBelow,
    backInside,
    backOutside,
    sleevecap,
    sleeve,
  ],
})

// Named exports
export {
  frontInside,
  frontOutside,
  pocket,
  frontOutsideAbove,
  frontOutsideBelow,
  backInside,
  backOutside,
  sleevecap,
  sleeve,
  i18n,
  Sasha,
  about,
}
