import { Design } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { cup } from './cup.mjs'
import { backStrap } from './back-strap.mjs'
import { i18n } from '../i18n/index.mjs'
import { frontPanel } from './front-panel.mjs'
import { backPanel } from './back-panel.mjs'

// Setup our new design
const Sophie = new Design({
  data: about,
  parts: [cup, backStrap, frontPanel, backPanel],
})

// Named exports
export { cup, backStrap, frontPanel, backPanel, Sophie, i18n, about }
