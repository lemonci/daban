import { Design } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { front } from './front.mjs'
import { back } from './back.mjs'
import { i18n } from '../i18n/index.mjs'
import { waistbandBack } from './waistband-back.mjs'
import { waistbandFront } from './waistband-front.mjs'
import { pocket } from './pocket.mjs'
import { pocketFacing } from './pocket-facing.mjs'

// Setup our new design
const Shale = new Design({
  data: about,
  parts: [front, back, waistbandBack, waistbandFront, pocket, pocketFacing],
})

// Named exports
export { front, back, waistbandBack, waistbandFront, pocket, pocketFacing, Shale, i18n, about }
