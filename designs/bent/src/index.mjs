import { Design, mergeI18n } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { front, back, i18n as brianI18n } from '@freesewing/brian'
import { underSleeve2 as underSleeve, topSleeve2 as topSleeve } from '@freesewing/partlib'
import { i18n as bentI18n } from '../i18n/index.mjs'

// Create new design
const Bent = new Design({
  data: about,
  parts: [front, back, topSleeve, underSleeve],
})

// Merge translations
const i18n = mergeI18n([brianI18n, bentI18n])

// Named exports
export { Bent, i18n, about }
