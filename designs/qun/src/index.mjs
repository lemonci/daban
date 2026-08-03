import { Design } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { box } from './box.mjs'
import { i18n } from '../i18n/index.mjs'

// Setup our new design
const Qun = new Design({
  data: about,
  parts: [box],
})

// Named exports
export { box, Qun, i18n, about }
