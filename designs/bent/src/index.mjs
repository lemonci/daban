import { Design, mergeI18n } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { front, back, i18n as brianI18n } from '@freesewing/brian'
import { undersleeve, topsleeve, i18n as libraryI18n } from '@freesewing/library'
import { i18n as bentI18n } from '../i18n/index.mjs'

// Create new design
const Bent = new Design({
  data: about,
  parts: [front, back, topsleeve, undersleeve],
})

// Merge translations
const i18n = {
  ...bentI18n,
  ...mergeI18n([libraryI18n, brianI18n], {
    p: { keep: ['front', 'back', 'topsleeve', 'undersleeve'] },
    o: {
      keep: [
        ...Object.keys(back.options),
        ...Object.keys(undersleeve.options),
        ...Object.keys(topsleeve.options),
      ],
    },
    s: { drop: [] },
  }),
}

export { front, back, topsleeve, undersleeve, Bent, i18n, about }
