import { Design } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { back } from './back.mjs'
import { front } from './front.mjs'
import { i18n } from '../i18n/index.mjs'

// Setup our new design
const SkirtBlock = new Design({
  data: about,
  parts: [back, front],
})

// Named exports
// `Skirtblock` is the alias the repo's code generator expects -- it derives the
// export name from the design id by capitalizing only the first letter
export { back, front, SkirtBlock, SkirtBlock as Skirtblock, i18n, about }
