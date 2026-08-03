import { Design } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { back } from './back.mjs'
import { front } from './front.mjs'
import { i18n } from '../i18n/index.mjs'

// Setup our new design
const Skirtblock = new Design({
  data: about,
  parts: [back, front],
})

// Named exports
export { back, front, Skirtblock, i18n, about }
