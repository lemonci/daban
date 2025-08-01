import { Design, mergeI18n } from '@freesewing/core'
import { i18n as toniI18n } from '@freesewing/toni'
import { sleeve as toniSleeve } from '@freesewing/toni'
import { waistband as toniWaistband } from '@freesewing/toni'
import { cuff as toniCuff } from '@freesewing/toni'
import { i18n as tinaI18n } from '../i18n/index.mjs'
import { front } from './front.mjs'
import { back } from './back.mjs'
import { frontBottom } from './frontBottom.mjs'

import about from '../about.json' with { type: 'json' }

// Setup our new design
const Tina = new Design({
  data: about,
  parts: [back, front, frontBottom, toniSleeve, toniWaistband, toniCuff],
})

// Merge translations
const i18n = mergeI18n([toniI18n, tinaI18n], {
  o: { drop: ['sleeveLengthBonus'] },
})

// Named exports
export { front, frontBottom, back, Tina, i18n }
