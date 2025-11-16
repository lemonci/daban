import { Design } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { i18n } from '../i18n/index.mjs'
// Parts
import { sleeve } from './sleeve/index.mjs'
import { topsleeve, undersleeve, twoPartSleeve } from './two-part-sleeve/index.mjs'

// Setup our new design
const Library = new Design({
  data: about,
  parts: [sleeve, topsleeve, undersleeve, twoPartSleeve],
})

// Named exports
export { sleeve, topsleeve, undersleeve, twoPartSleeve, Library, i18n, about }
