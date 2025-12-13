import { Design, mergeI18n } from '@freesewing/core'
import { i18n as brianI18n } from '../i18n/index.mjs'
import about from '../about.json' with { type: 'json' }
import { sleeve, i18n as libraryI18n } from '@freesewing/library'
import { back } from './back.mjs'
import { front } from './front.mjs'
// Re-export skeleton parts so peope can re-use them
import { base } from './base.mjs'

// Setup our new design
const Brian = new Design({
  data: about,
  parts: [back, front, sleeve],
})

// Merge translations
const i18n = mergeI18n([libraryI18n, brianI18n], {
  p: { keep: ['front', 'back', 'base', 'sleeve'] },
  o: {
    keep: [...Object.keys(sleeve.options), ...Object.keys(base.options)],
  },
  s: { drop: [] },
})

// Named exports
export { back, front, base, Brian, i18n, about }
