import { Design, mergeI18n } from '@freesewing/core'
import { i18n as titanI18n } from '@freesewing/titan'
import { i18n as ashleyI18n } from '../i18n/index.mjs'
import { front } from './front.mjs'
import { back } from './back.mjs'
import { pocket } from './pocket.mjs'
import { pocket_facing } from './pocket_facing.mjs'
import { pocket_back } from './pocket_back.mjs'
import { yoke } from './yoke.mjs'
import { flyFacing } from './fly-facing.mjs'
import { flyExtension } from './fly-extension.mjs'
import about from '../about.json' with { type: 'json' }
import { beltLoops } from './beltloops.mjs'

import { waist_back } from './waist_back.mjs'

import { waistband_left } from './waistband_left.mjs'
import { waistband_right } from './waistband_right.mjs'

// Setup our new design
const Ashley = new Design({
  data: about,
  parts: [
    front,
    back,
    pocket,
    pocket_facing,
    pocket_back,
    yoke,
    flyFacing,
    flyExtension,
    beltLoops,

    waist_back,

    waistband_left,
    waistband_right,
  ],
})

// Merge translations
const i18n = mergeI18n([titanI18n, ashleyI18n])

// Named exports
export {
  front,
  back,
  pocket,
  pocket_facing,
  pocket_back,
  flyFacing,
  flyExtension,
  beltLoops,
  waist_back,
  waistband_left,
  waistband_right,
  yoke,
  Ashley,
  i18n,
  about,
}
