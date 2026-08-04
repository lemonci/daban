import { Design } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { sleeve } from './sleeve.mjs'
import { i18n } from '../i18n/index.mjs'

// Setup our new design
const Sleeveblock = new Design({
  data: about,
  parts: [sleeve],
})

// Named exports
export { sleeve, Sleeveblock, i18n, about }
