import { Design } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { i18n } from '../i18n/index.mjs'
import { demo } from './demo.mjs'

// Setup our new design
const Rendertest = new Design({
  data: about,
  parts: [demo],
})

// Named exports
export { demo, Rendertest, i18n, about }
