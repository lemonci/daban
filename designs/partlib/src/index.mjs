import { Design } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { sleeve1 } from './sleeve-1.mjs'
import { underSleeve2 } from './undersleeve-2.mjs'
import { topSleeve2 } from './topsleeve-2.mjs'
import { i18n } from '../i18n/index.mjs'

// Setup our new design
const Partlib = new Design({
  data: about,
  parts: [sleeve1, underSleeve2, topSleeve2],
})

// Named exports
export { sleeve1, underSleeve2, topSleeve2, Partlib, i18n, about }
