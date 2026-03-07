import { Design } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
// import { test } from './test.mjs'
import { back } from './back.mjs'
import { backPocketPoints } from './backpocketpoints.mjs'
import { backPocket } from './backpocket.mjs'
import { backPocketFacing } from './backpocketfacing.mjs'
import { backPocketCargo } from './backpocketcargo.mjs'
import { flyShield } from './flyshield.mjs'
import { front } from './front.mjs'
import { frontPocketPoints } from './frontpocketpoints.mjs'
import { frontPocket } from './frontpocket.mjs'
import { frontPocketFacing } from './frontpocketfacing.mjs'
import { frontPocketCargo } from './frontpocketcargo.mjs'
import { gusset } from './gusset.mjs'
import { waistband } from './waistband.mjs'
import { waistbanda } from './waistbanda.mjs'
import { basepoints } from './basepoints.mjs'
import { i18n } from '../i18n/index.mjs'

// Setup our new design
const Crux = new Design({
  data: about,
  parts: [
    front,
    back,
    gusset,
    basepoints,
    flyShield,
    frontPocketPoints,
    frontPocket,
    frontPocketCargo,
    frontPocketFacing,
    backPocketPoints,
    backPocket,
    backPocketCargo,
    backPocketFacing,
    waistband,
    waistbanda,
  ],
})

export {
  front,
  back,
  gusset,
  basepoints,
  flyShield,
  frontPocketPoints,
  frontPocket,
  frontPocketCargo,
  frontPocketFacing,
  backPocketPoints,
  backPocket,
  backPocketCargo,
  backPocketFacing,
  waistband,
  waistbanda,
  Crux,
  i18n,
  about,
}
