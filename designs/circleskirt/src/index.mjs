import { Design } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { back } from './back.mjs'
import { front } from './front.mjs'
import { panelOptions, draftPanel } from './shared.mjs'
import { i18n } from '../i18n/index.mjs'

// Setup our new design
const Circleskirt = new Design({
  data: about,
  parts: [back, front],
})

// Named exports
export { back, front, panelOptions, draftPanel, Circleskirt, i18n, about }
