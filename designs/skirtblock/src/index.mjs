import { Design } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { back } from './back.mjs'
import { front } from './front.mjs'
import { blockOptions, draftBlock } from './shared.mjs'
import { i18n } from '../i18n/index.mjs'

// Setup our new design
const Skirtblock = new Design({
  data: about,
  parts: [back, front],
})

// Named exports. `blockOptions` and `draftBlock` are re-exported for designs that
// continue this block rather than redraw it -- see designs/dressblock.
export { back, front, blockOptions, draftBlock, Skirtblock, i18n, about }
